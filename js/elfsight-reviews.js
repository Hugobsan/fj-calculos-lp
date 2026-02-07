/**
 * Widget de avaliações Google (Elfsight)
 * Cache: 24h no platform.js (localStorage). Se ELFSIGHT_BOOT_PROXY_URL estiver definida, o boot usa o Worker (cache externo).
 */
(function () {
    'use strict';

    // URL do Worker Cloudflare (cache externo do boot). Ex.: 'https://elfsight-boot-proxy.xxx.workers.dev'
    // Deixe vazio para usar só o cache no localStorage do navegador.
    var ELFSIGHT_BOOT_PROXY_URL = 'https://fj-calculos-lp.hbsantos36.workers.dev';

    // true = usa cache no localStorage; false = sempre chama o Worker (útil para testar o Worker sem cache local)
    var ELFSIGHT_USE_LOCAL_CACHE = false;

    function removeElfsightBranding() {
        var link = document.querySelector('a[href*="elfsight.com/google-reviews-widget"]:not([data-elfsight-observed])');
        if (!link || !link.parentNode) return;

        link.setAttribute('data-elfsight-observed', 'true');
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting && entry.target.parentNode) {
                        entry.target.parentNode.removeChild(entry.target);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px' }
        );
        observer.observe(link);
    }

    function initElfsightReviews() {
        var ELFSIGHT_SCRIPT_URL = 'https://elfsightcdn.com/platform.js';
        var WIDGET_APP_ID = '50d6f75c-a179-449a-b2a1-c1386c5c40fa';
        var CHECK_WIDGET_AFTER_MS = 20000; // 20s: boot + assets + render; conexões lentas precisam de mais tempo
        var BRANDING_CHECK_INTERVAL_MS = 500;
        var BRANDING_CHECK_MAX_MS = 15000;

        var section = document.getElementById('avaliacoes');
        if (!section) return;

        var widgetContainer = document.querySelector('.elfsight-app-' + WIDGET_APP_ID);
        if (!widgetContainer) return;

        function hideAvaliacoesSection() {
            section.style.display = 'none';
        }

        function startBrandingRemoval() {
            var brandingCheckStart = Date.now();
            var brandingInterval = setInterval(function () {
                removeElfsightBranding();
                if (Date.now() - brandingCheckStart > BRANDING_CHECK_MAX_MS) {
                    clearInterval(brandingInterval);
                }
            }, BRANDING_CHECK_INTERVAL_MS);
        }

        // Se tiver Worker configurado, o boot vai para o proxy (cache externo); senão usa platform.js com cache no localStorage
        if (ELFSIGHT_BOOT_PROXY_URL) {
            window.eappsCustomPlatformUrl = ELFSIGHT_BOOT_PROXY_URL.replace(/\/$/, '');
        }
        window.ELFSIGHT_SKIP_LOCAL_CACHE = !ELFSIGHT_USE_LOCAL_CACHE;
        var script = document.createElement('script');
        script.async = true;
        script.src = './js/elfsight/platform.js';
        script.onerror = function () {
            hideAvaliacoesSection();
        };
        script.onload = function () {
            startBrandingRemoval();
            setTimeout(function () {
                var widget = document.querySelector('.elfsight-app-' + WIDGET_APP_ID);
                if (!widget || !widget.children || widget.children.length === 0) {
                    hideAvaliacoesSection();
                }
            }, CHECK_WIDGET_AFTER_MS);
        };
        (document.head || document.documentElement).appendChild(script);
    }

    window.initElfsightReviews = initElfsightReviews;
})();
