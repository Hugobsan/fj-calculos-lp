/**
 * Widget de avaliações Google (Elfsight)
 * Carrega platform.js local (com cache do boot por 24h em platform.js) para reduzir as 200 visualizações/mês.
 */
(function () {
    'use strict';

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
        var CHECK_WIDGET_AFTER_MS = 8000;
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

        // Cache só no boot, dentro do platform.js local; sem interceptor global para não quebrar sources/reviews
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
