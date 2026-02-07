/**
 * Proxy do boot da Elfsight com cache (24h).
 * Reduz as requisições à Elfsight: 1 request real por widget a cada 24h.
 */

const ELFSIGHT_BOOT_ORIGIN = 'https://core.service.elfsight.com';
const CACHE_TTL_SECONDS = 24 * 60 * 60; // 24 horas

function corsHeaders(origin) {
    const o = origin || '*';
    const h = {
        'Access-Control-Allow-Origin': o,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
        'Access-Control-Max-Age': '86400',
    };
    if (o !== '*') {
        h['Access-Control-Allow-Credentials'] = 'true';
    }
    return h;
}

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const origin = request.headers.get('Origin') || '*';

        // Preflight CORS (localhost, trycloudflare, etc.)
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: corsHeaders(origin) });
        }

        // Só atende GET /p/boot/?...
        if (request.method !== 'GET' || !url.pathname.endsWith('/p/boot/')) {
            return new Response('Not Found', { status: 404, headers: corsHeaders(origin) });
        }

        try {
            // Chave de cache só pelo widget (w=): todos os visitantes compartilham o mesmo boot em cache
            const widgetId = url.searchParams.get('w') || 'default';
            const cacheKeyUrl = url.origin + url.pathname + '?w=' + encodeURIComponent(widgetId);
            const cacheKey = new Request(cacheKeyUrl);
            const cache = caches.default;

            // Tenta servir do cache
            let response = await cache.match(cacheKey);
            if (response) {
                const cloned = new Response(response.body, response);
                Object.entries(corsHeaders(origin)).forEach(([k, v]) => cloned.headers.set(k, v));
                cloned.headers.set('X-Elfsight-Boot', 'cache');
                return cloned;
            }

            // Cache miss: busca na Elfsight
            const upstreamUrl = ELFSIGHT_BOOT_ORIGIN + url.pathname + url.search;
            const upstreamResponse = await fetch(upstreamUrl, {
                method: 'GET',
                headers: {
                    'Accept': request.headers.get('Accept') || 'application/json',
                    'User-Agent': request.headers.get('User-Agent') || 'Cloudflare-Worker-Elfsight-Proxy',
                },
            });

            if (!upstreamResponse.ok) {
                return new Response(upstreamResponse.body, {
                    status: upstreamResponse.status,
                    statusText: upstreamResponse.statusText,
                    headers: corsHeaders(origin),
                });
            }

            const body = await upstreamResponse.text();
            response = new Response(body, {
                status: upstreamResponse.status,
                statusText: upstreamResponse.statusText,
                headers: {
                    'Content-Type': upstreamResponse.headers.get('Content-Type') || 'application/json',
                    ...corsHeaders(origin),
                    'Cache-Control': 'public, max-age=' + CACHE_TTL_SECONDS,
                    'X-Elfsight-Boot': 'miss',
                },
            });

            // Guarda no cache pela chave do widget (todos os visitantes usam o mesmo cache)
            ctx.waitUntil(cache.put(cacheKey, response.clone()));
            return response;
        } catch (err) {
            return new Response(JSON.stringify({ status: false, reason: 'Proxy error' }), {
                status: 502,
                headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
            });
        }
    },
};
