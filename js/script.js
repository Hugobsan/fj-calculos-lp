// Aguardar carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function () {
    console.log('JP Cálculos - Landing Page carregada');
    
    // TRACKING GOOGLE ADS - EVENTOS OTIMIZADOS
    // Os eventos foram configurados para serem automaticamente reconhecidos pelo Google Ads:
    // - generate_lead: Para conversões de leads (WhatsApp + Formulário)
    // - contact: Para contatos via WhatsApp
    // - submit_form: Para envios de formulário
    // - view_item: Para navegação para serviços
    
    // Inicializar funcionalidades
    initMobileMenu();
    initScrollEffects();
    initSmoothScrolling();
    initAnimationsOnScroll();
    initPerformanceOptimizations();
    initWhatsAppIntegration();
    initCTAButtons();
    initServiceButtons();
    enhanceServiceCards();
    initFormspreeIntegration();
    initCookieBanner();
    initHeroCarousel();

    // Listener para mudanças de tamanho de tela (debounced)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (typeof handleCarouselResize === 'function') {
                handleCarouselResize();
            }
        }, 250);
    });

    // Aplica máscara de telefone a todos os inputs com a classe 'phone-mask'
    const phoneInputs = document.querySelectorAll('input.phone-mask');
    phoneInputs.forEach(input => {
        applyPhoneMask(input);
    });
});

// Funcionalidade do menu mobile
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = mobileMenuButton.querySelector('.material-icons');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function () {
            const isHidden = mobileMenu.classList.contains('hidden');

            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('mobile-menu-open');
                mobileMenu.classList.remove('mobile-menu-closed');
                menuIcon.textContent = 'close';

                // Adicionar ARIA attributes para acessibilidade
                mobileMenuButton.setAttribute('aria-expanded', 'true');
                mobileMenu.setAttribute('aria-hidden', 'false');
            } else {
                mobileMenu.classList.add('mobile-menu-closed');
                mobileMenu.classList.remove('mobile-menu-open');
                menuIcon.textContent = 'menu';

                // Esconder o menu após a animação
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300);

                // Atualizar ARIA attributes
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
            }
        });

        // Fechar menu ao clicar em links
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.add('mobile-menu-closed');
                mobileMenu.classList.remove('mobile-menu-open');
                menuIcon.textContent = 'menu';
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
            });
        });
    }
}

// Efeitos de scroll no header
function initScrollEffects() {
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    let isScrolling = false;

    function handleScroll() {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                // Adicionar classe quando rolar para baixo
                if (scrollTop > 50) {
                    header.classList.add('header-scrolled');
                } else {
                    header.classList.remove('header-scrolled');
                }

                // Efeito de esconder/mostrar header (opcional)
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    // Rolando para baixo
                    header.style.transform = 'translateY(-100%)';
                } else {
                    // Rolando para cima
                    header.style.transform = 'translateY(0)';
                }

                lastScrollTop = scrollTop;
                isScrolling = false;
            });
        }
        isScrolling = true;
    }

    // Throttle do evento de scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
            setTimeout(() => ticking = false, 10);
        }
    });
}

// Scroll suave para links de navegação
function initSmoothScrolling() {
    // Selecionar apenas links de navegação que são âncoras internas válidas
    const navLinks = document.querySelectorAll('a[href^="#"]:not([data-cta]):not([data-service])');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // Apenas processar se for uma âncora interna válida
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Fechar menu mobile se estiver aberto
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                        const menuIcon = document.querySelector('#mobile-menu-button .material-icons');
                        if (menuIcon) menuIcon.textContent = 'menu';
                    }
                }
            }
        });
    });
}

// Validação individual de campo
function validateField(field) {
    let isValid = true;

    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        field.classList.add('border-red-500');
    }

    if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            field.classList.add('border-red-500');
        }
    }

    if (isValid) {
        field.classList.remove('border-red-500');
        field.classList.add('border-green-500');
    }

    return isValid;
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    // Remover notificação existente
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-md ${getNotificationClasses(type)}`;
    notification.innerHTML = `
        <div class="flex items-center">
            <span class="material-icons mr-2">${getNotificationIcon(type)}</span>
            <div class="flex-1">${message}</div>
            <button class="ml-2 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                <span class="material-icons">close</span>
            </button>
        </div>
    `;

    document.body.appendChild(notification);

    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('opacity-0', 'transform', 'translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationClasses(type) {
    switch (type) {
        case 'success':
            return 'bg-green-500 text-white';
        case 'error':
            return 'bg-red-500 text-white';
        case 'warning':
            return 'bg-yellow-500 text-white';
        default:
            return 'bg-blue-500 text-white';
    }
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return 'check_circle';
        case 'error':
            return 'error';
        case 'warning':
            return 'warning';
        default:
            return 'info';
    }
}

// Animações ao rolar a página
function initAnimationsOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;                // Adicionar classes de animação baseadas na posição
                if (element.classList.contains('animate-on-scroll')) {
                    element.classList.add('animate-fade-in-up');

                    // Verificar se é o card especial e aplicar efeito mais suave
                    if (element.classList.contains('special-effect-card')) {
                        setTimeout(() => {
                            element.classList.add('special-glow');
                        }, 800);
                    }
                }

                if (element.classList.contains('animate-in')) {
                    element.classList.add('animate-bounce-in');
                }
                if (element.classList.contains('pulse')) {
                    element.classList.add('animate-pulse');
                }
                if (element.classList.contains('slide-in-scale')) {
                    element.classList.add('animate-slide-in-scale');
                }

                if (element.classList.contains('animate-left')) {
                    element.classList.add('animate-fade-in-left');
                } if (element.classList.contains('animate-right')) {
                    element.classList.add('animate-fade-in-right');
                }                // Efeito especial para cards destacados
                if (element.classList.contains('animate-special-effect')) {
                    console.log('Aplicando efeito especial ao elemento:', element);
                    // Apenas adicionar o efeito de shimmer após 0.5s
                    setTimeout(() => {
                        element.classList.add('animate-shimmer');
                    }, 500);
                }

                // Animação de contador para números
                if (element.classList.contains('animate-counter')) {
                    element.classList.add('animate-fade-in-up');
                    animateCounter(element);
                }

                // Animação escalonada para informações de contato
                if (element.classList.contains('animate-contact-info')) {
                    const contactItems = element.querySelectorAll('.flex.items-center');
                    contactItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.animation = `slideInFromLeft 0.6s ease-out forwards`;
                        }, index * 200); // 200ms de delay entre cada item
                    });
                }

                // Parar de observar após animar
                observer.unobserve(element);
            }
        });
    }, observerOptions);    // Observar elementos que devem ser animados
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll, .animate-left, .animate-right, .animate-special-effect, .animate-counter, .animate-contact-info, .animate-in, .pulse, .slide-in-scale');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// Função para animar contadores numéricos
function animateCounter(element) {
    const numberElement = element.querySelector('.text-3xl');
    if (!numberElement) return;

    const originalText = numberElement.textContent;
    const target = parseInt(originalText.replace(/\D/g, ''));

    if (isNaN(target) || target === 0) return;

    const duration = 1000;
    const increment = target / (duration / 16); // 60 FPS
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            if (originalText.includes('+')) {
                numberElement.textContent = `${Math.floor(current)}+`;
            } else {
                numberElement.textContent = Math.floor(current).toString();
            }
            requestAnimationFrame(updateCounter);
        } else {
            // Restaurar texto original
            numberElement.textContent = originalText;
        }
    };

    updateCounter();
}

// Otimizações de performance
function initPerformanceOptimizations() {
    // Lazy loading para imagens
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Preload de recursos críticos
    const preloadResources = [
        './assets/images/logo/2.png'
    ];

    preloadResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = resource;
        document.head.appendChild(link);
    });
}

// Utilidades auxiliares
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Detecção de modo escuro (para futuro suporte)
function detectColorScheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark-mode');
    }

    // Escutar mudanças
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (e.matches) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
    });
}

// Inicialização de recursos opcionais
window.addEventListener('load', function () {
    // Detectar modo escuro
    detectColorScheme();

    // Log de performance
    if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    }
});

// Tratamento de erros globais
window.addEventListener('error', function (e) {
    console.error('Erro capturado:', e.error);
    // Aqui você pode implementar logging de erros para um serviço externo
});

// Service Worker registration (para PWA futuro)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registrado'))
        //     .catch(error => console.log('Erro no SW:', error));
    });
}

// Funcionalidades do botão flutuante do WhatsApp
function initWhatsAppButton() {
    const whatsappButton = document.querySelector('.whatsapp-button');

    if (whatsappButton) {
        console.log('Botão WhatsApp encontrado, inicializando...');

        // Remover qualquer evento anterior
        whatsappButton.removeEventListener('click', handleWhatsAppClick);

        // Adicionar evento de clique com tracking
        whatsappButton.addEventListener('click', handleWhatsAppClick);

        // Garantir que o link seja configurado imediatamente
        customizeWhatsAppLink();

    } else {
        console.error('Botão WhatsApp não encontrado!');
    }
}

// Função separada para lidar com o clique do WhatsApp
function handleWhatsAppClick(e) {
    e.preventDefault(); // Prevenir comportamento padrão

    console.log('Clique no WhatsApp detectado!');

    const phoneNumber = '553398337624';
    const message = encodeURIComponent('Olá! vim pelo site, e gostaria de um orçamento.');

    console.log('Dispositivo móvel:', isMobileDevice());

    if (isMobileDevice()) {
        // Para mobile: tentar app primeiro, depois fallback para wa.me
        const whatsappAppUrl = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
        const waUrl = `https://wa.me/${phoneNumber}?text=${message}`;

        console.log('Tentando abrir app WhatsApp:', whatsappAppUrl);

        // Método mais confiável: tentar window.location primeiro
        window.location.href = whatsappAppUrl;

        // Fallback para wa.me se o app não abrir
        const fallbackTimer = setTimeout(() => {
            console.log('App não abriu, usando fallback wa.me:', waUrl);
            window.open(waUrl, '_blank', 'noopener,noreferrer');
        }, 2000);

        // Se a página perder o foco (app abriu), cancelar o fallback
        const blurHandler = () => {
            console.log('Página perdeu foco, app provavelmente abriu');
            clearTimeout(fallbackTimer);
            window.removeEventListener('blur', blurHandler);
            window.removeEventListener('visibilitychange', visibilityHandler);
        };

        const visibilityHandler = () => {
            if (document.hidden) {
                console.log('Página ficou invisível, app provavelmente abriu');
                clearTimeout(fallbackTimer);
                window.removeEventListener('blur', blurHandler);
                window.removeEventListener('visibilitychange', visibilityHandler);
            }
        };

        window.addEventListener('blur', blurHandler);
        window.addEventListener('visibilitychange', visibilityHandler);

        // Limpar após 3 segundos independentemente
        setTimeout(() => {
            clearTimeout(fallbackTimer);
            window.removeEventListener('blur', blurHandler);
            window.removeEventListener('visibilitychange', visibilityHandler);
        }, 3000);

    } else {
        // Para desktop: usar wa.me diretamente
        const waUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        console.log('Abrindo wa.me para desktop:', waUrl);
        window.open(waUrl, '_blank', 'noopener,noreferrer');
    }

    // Analytics tracking (se necessário)
    if (typeof gtag !== 'undefined') {
        // Evento padrão GA4 para contato via WhatsApp
        gtag('event', 'generate_lead', {
            currency: 'BRL',
            value: 1,
            method: 'whatsapp_float',
            source: 'floating_button',
            campaign: 'contact_request'
        });
        
        gtag('event', 'contact', {
            method: 'whatsapp',
            event_category: 'Lead Generation',
            event_label: 'Floating WhatsApp Button',
            content_group: 'Float'
        });
    }
}

// Funcionalidades do botão flutuante do WhatsApp
function initWhatsAppButton() {
    const whatsappButton = document.querySelector('.whatsapp-button');

    if (whatsappButton) {
        console.log('Botão WhatsApp encontrado, inicializando...');

        // Remover qualquer evento anterior
        whatsappButton.removeEventListener('click', handleWhatsAppClick);

        // Adicionar evento de clique com tracking
        whatsappButton.addEventListener('click', handleWhatsAppClick);

        // Garantir que o link seja configurado imediatamente
        customizeWhatsAppLink();

        // Mostrar/esconder baseado no scroll
        let lastScrollTop = 0;
        const scrollThreshold = 100;

        function handleWhatsAppScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const whatsappFloat = document.getElementById('whatsapp-float');

            if (scrollTop > scrollThreshold) {
                whatsappFloat.style.opacity = '1';
                whatsappFloat.style.pointerEvents = 'auto';
            } else {
                whatsappFloat.style.opacity = '0.7';
                whatsappFloat.style.pointerEvents = 'auto';
            }

            lastScrollTop = scrollTop;
        }

        // Throttle do scroll para performance
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(handleWhatsAppScroll, 10);
        });
    } else {
        console.error('Botão WhatsApp não encontrado!');
    }
}
function isMobileDevice() {
    // Verificar através do user agent
    const userAgentMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Verificar através do tamanho da tela
    const screenMobile = window.innerWidth <= 768;

    // Verificar se suporta touch
    const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    console.log('Mobile detection:', {
        userAgent: userAgentMobile,
        screenSize: screenMobile,
        touchSupport: touchSupport,
        final: userAgentMobile || (screenMobile && touchSupport)
    });

    return userAgentMobile || (screenMobile && touchSupport);
}

// Personalizar link do WhatsApp baseado no dispositivo
function customizeWhatsAppLink() {
    const whatsappButton = document.querySelector('.whatsapp-button');

    if (whatsappButton) {
        const phoneNumber = '553398337624';
        const message = encodeURIComponent('Olá! vim pelo site, e gostaria de um orçamento.');

        // Se for mobile, usar o protocolo do app
        if (isMobileDevice()) {
            whatsappButton.setAttribute('href', `whatsapp://send?phone=${phoneNumber}&text=${message}`);
        } else {
            // Para desktop, usar wa.me
            whatsappButton.setAttribute('href', `https://wa.me/${phoneNumber}?text=${message}`);
        }

        console.log('WhatsApp link configurado para:', isMobileDevice() ? 'Mobile' : 'Desktop');
        console.log('Link:', whatsappButton.getAttribute('href'));
    }
}

// Adicionar efeito de shake ocasional para chamar atenção
function addShakeEffect() {
    const whatsappButton = document.querySelector('.whatsapp-button');

    if (whatsappButton) {
        setInterval(() => {
            // Shake a cada 15 segundos se o usuário não interagiu
            if (!document.hidden && !whatsappButton.classList.contains('recently-hovered')) {
                whatsappButton.classList.add('animate-shake');
                setTimeout(() => {
                    whatsappButton.classList.remove('animate-shake');
                }, 1000);
            }
        }, 20000);

        // Marcar como recentemente hovereado
        whatsappButton.addEventListener('mouseenter', () => {
            whatsappButton.classList.add('recently-hovered');
            setTimeout(() => {
                whatsappButton.classList.remove('recently-hovered');
            }, 60000); // Remove a marca após 1 minuto
        });
    }
}

// Adicionar animação de shake ao CSS
function addShakeAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        
        .animate-shake {
            animation: shake 0.5s ease-in-out;
        }
        
        .animate-bounce-in {
            animation: bounceIn 0.6s ease-out;
        }
        
        @keyframes bounceIn {
            0% {
                opacity: 0;
                transform: scale(0.3) translateX(100px);
            }
            50% {
                opacity: 1;
                transform: scale(1.05);
            }
            70% {
                transform: scale(0.9);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(style);
}

// Inicializar funcionalidades do WhatsApp quando a página carregar
document.addEventListener('DOMContentLoaded', function () {
    addShakeAnimation();
    initWhatsAppButton();
    customizeWhatsAppLink();

    // Adicionar shake effect após 5 segundos
    setTimeout(addShakeEffect, 5000);
});

// Função para atualizar o número do WhatsApp dinamicamente
function updateWhatsAppNumber(phoneNumber, customMessage = '') {
    const whatsappButton = document.querySelector('.whatsapp-button');

    if (whatsappButton && phoneNumber) {
        const message = customMessage || 'Olá! vim pelo site, e gostaria de um orçamento.';
        const encodedMessage = encodeURIComponent(message);

        //Setando href usando getWhatsAppUrl
        let href = getWhatsAppUrl(phoneNumber, message);

        whatsappButton.setAttribute('href', href);
        console.log('WhatsApp number updated:', phoneNumber);
        console.log('Device type:', isMobileDevice() ? 'Mobile' : 'Desktop');
        console.log('Generated link:', href);
    } else {
        console.error('WhatsApp button not found or phone number not provided');
    }
}

// Função para pegar a URL do WhatsApp
function getWhatsAppUrl(phoneNumber, customMessage = '') {
    if (!phoneNumber) {
        console.error('Número de telefone não fornecido');
        phoneNumber = '553398337624'; // Fallback para o número padrão
    }

    const message = customMessage || 'Olá! vim pelo site, e gostaria de um orçamento.';
    const encodedMessage = encodeURIComponent(message);

    if (isMobileDevice()) {
        return `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
    } else {
        return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    }
}

// Função para pegar URLs do WhatsApp baseadas em chaves/tipos de CTA
function getWhatsAppUrlByKey(keyName = 'default') {
    const phoneNumber = '553398337624';
    const messageTemplates = {
        'quote': 'Olá! vim pelo site, e gostaria de um orçamento.',
        'services': 'Olá! vim pelo site, e gostaria de um orçamento.',
        'liquidacao-sentenca': 'Olá! vim pelo site, e gostaria de um orçamento para liquidação de sentença.',
        'liquidacao-inicial': 'Olá! vim pelo site, e gostaria de um orçamento para liquidação da petição inicial.',
        'calculos-contingencia': 'Olá! vim pelo site, e gostaria de um orçamento para cálculos de contingência.',
        'impugnacao-calculos': 'Olá! vim pelo site, e gostaria de um orçamento para impugnação de cálculos.',
        'default': 'Olá! vim pelo site, e gostaria de um orçamento.'
    };

    const message = messageTemplates[keyName] || messageTemplates['default'];
    return getWhatsAppUrl(phoneNumber, message);
}

// Exportar funções para uso global se necessário
window.WhatsAppUtils = {
    updateNumber: updateWhatsAppNumber,
    isMobile: isMobileDevice,
    getUrl: getWhatsAppUrl,
    getUrlByKey: getWhatsAppUrlByKey
};

// ========= FUNÇÕES DE GERENCIAMENTO DE COOKIES =========

// Inicializar banner de cookies
function initCookieBanner() {

    // Verificar se o usuário já fez uma escolha sobre cookies
    const cookieConsent = getCookieConsent();

    // Verificar se o consentimento expirou (365 dias)
    if (cookieConsent !== null && isCookieConsentExpired()) {
        setCookieConsent(null);
        showCookieBanner();
        return;
    }

    if (cookieConsent === null) {
        // Primeira visita - mostrar banner
        showCookieBanner();
    } else if (cookieConsent === 'accepted') {
        // Cookies aceitos - habilitar Google Analytics
        enableGoogleAnalytics();
    } else {
        // Cookies recusados - desabilitar Google Analytics
        disableGoogleAnalytics();
    }

    // Configurar event listeners para os botões
    setupCookieButtons();
}

// Mostrar banner de cookies
function showCookieBanner() {
    const banner = document.getElementById('cookie-banner');

    if (banner) {
        banner.classList.remove('hidden');

        // Animar entrada do banner
        setTimeout(() => {
            banner.classList.remove('translate-y-full');
            banner.classList.add('translate-y-0');
        }, 100);

        console.log('Banner de cookies exibido');
    }
}

// Esconder banner de cookies
function hideCookieBanner() {
    const banner = document.getElementById('cookie-banner');

    if (banner) {
        banner.classList.remove('translate-y-0');
        banner.classList.add('translate-y-full');

        // Esconder completamente após animação
        setTimeout(() => {
            banner.classList.add('hidden');
        }, 500);

        console.log('Banner de cookies ocultado');
    }
}

// Configurar event listeners para botões do banner
function setupCookieButtons() {
    const acceptButton = document.getElementById('cookie-accept');
    const declineButton = document.getElementById('cookie-decline');

    if (acceptButton) {
        acceptButton.addEventListener('click', function () {
            setCookieConsent('accepted');
            enableGoogleAnalytics();
            hideCookieBanner();
        });
    }

    if (declineButton) {
        declineButton.addEventListener('click', function () {
            setCookieConsent('declined');
            disableGoogleAnalytics();
            hideCookieBanner();
        });
    }
}

// Obter consentimento de cookies do localStorage
function getCookieConsent() {
    try {
        return localStorage.getItem('fjcalculos_cookie_consent');
    } catch (error) {
        console.warn('Erro ao acessar localStorage:', error);
        return null;
    }
}

// Definir consentimento de cookies no localStorage
function setCookieConsent(consent) {
    try {
        if (consent === null) {
            localStorage.removeItem('fjcalculos_cookie_consent');
            localStorage.removeItem('fjcalculos_cookie_date');
            localStorage.removeItem('fjcalculos_cookie_type');
        } else {
            localStorage.setItem('fjcalculos_cookie_consent', consent);
            localStorage.setItem('fjcalculos_cookie_date', new Date().toISOString());
            localStorage.setItem('fjcalculos_cookie_type', consent);
        }
    } catch (error) {
        console.warn('Erro ao salvar no localStorage:', error);
    }
}

// Habilitar Google Analytics
function enableGoogleAnalytics() {
    console.log('Google Analytics habilitado');

    // Se gtag estiver disponível, garantir que está ativo
    if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
            'analytics_storage': 'granted'
        });

        gtag('event', 'cookie_consent', {
            'event_category': 'Privacy',
            'event_label': 'Accepted',
            'value': 1
        });
    }
}

// Desabilitar Google Analytics
function disableGoogleAnalytics() {
    console.log('Google Analytics desabilitado');

    // Se gtag estiver disponível, desabilitar
    if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
            'analytics_storage': 'denied'
        });

        gtag('event', 'cookie_consent', {
            'event_category': 'Privacy',
            'event_label': 'Declined',
            'value': 0
        });
    }
}

// Função para resetar consentimento de cookies (para testes ou se o usuário quiser alterar)
function resetCookieConsent() {
    try {
        localStorage.removeItem('fjcalculos_cookie_consent');
        localStorage.removeItem('fjcalculos_cookie_date');
        localStorage.removeItem('fjcalculos_cookie_type');
        console.log('Consentimento de cookies resetado');
    } catch (error) {
        console.warn('Erro ao resetar consentimento:', error);
    }
}

// Função para verificar se o consentimento está expirado
function isCookieConsentExpired() {
    try {
        const consentDate = localStorage.getItem('fjcalculos_cookie_date');
        const consentType = localStorage.getItem('fjcalculos_cookie_type');

        if (!consentDate || !consentType) return true;

        const consentTime = new Date(consentDate).getTime();
        const currentTime = new Date().getTime();

        // Se foi recusado, expira em 1 hora (60 minutos)
        if (consentType === 'declined') {
            const oneHour = 60 * 60 * 1000; // 1 hora em millisegundos
            return (currentTime - consentTime) > oneHour;
        }

        // Se foi aceito, expira em 365 dias
        const oneYear = 365 * 24 * 60 * 60 * 1000; // 365 dias em millisegundos
        return (currentTime - consentTime) > oneYear;
    } catch (error) {
        console.warn('Erro ao verificar expiração do consentimento:', error);
        return true;
    }
}

// Exportar funções de cookies para uso global se necessário
window.CookieUtils = {
    reset: resetCookieConsent,
    getConsent: getCookieConsent,
    isExpired: isCookieConsentExpired
};

// ========= FUNÇÕES DE INTEGRAÇÃO =========

// Inicializar integração do WhatsApp
function initWhatsAppIntegration() {
    console.log('Inicializando integração WhatsApp...');

    // Configurar número do WhatsApp primeiro
    updateWhatsAppNumber('553398337624', 'Olá! vim pelo site, e gostaria de um orçamento.');

    // Depois customizar o link baseado no dispositivo
    customizeWhatsAppLink();

    // Inicializar funcionalidades específicas do WhatsApp
    initWhatsAppButton();

    // Adicionar efeito de shake ocasional
    addShakeEffect();
    addShakeAnimation();

    console.log('Integração WhatsApp inicializada com sucesso!');
}

// Inicializar botões CTA
// Inicializar botões CTA
function initCTAButtons() {
    // Configurar links CTA com mensagens personalizadas
    const ctaLinks = document.querySelectorAll('[data-cta]');
    
    ctaLinks.forEach(link => {
        const ctaType = link.getAttribute('data-cta');
        
        if (ctaType === 'services') {
            // Para o botão "Saiba Mais", manter comportamento de scroll
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const metodologiaSection = document.querySelector('.py-24.bg-gradient-to-br.from-primary');
                if (metodologiaSection) {
                    metodologiaSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else {
                    document.getElementById('servicos').scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        } else {
            // Para outros CTAs (como quote), configurar como links diretos do WhatsApp
            const whatsappUrl = getWhatsAppUrlByKey(ctaType);
            
            if (whatsappUrl) {
                link.href = whatsappUrl;
                // Remover target="_blank" para abrir na mesma aba
                // link.target = '_blank';
                // link.rel = 'noopener noreferrer';
            }
        }
    });
}

// Inicializar botões de serviços
// Inicializar botões de serviços
function initServiceButtons() {
    // Configurar links de serviços com mensagens específicas
    const serviceLinks = document.querySelectorAll('[data-service]');
    
    serviceLinks.forEach(link => {
        const serviceType = link.getAttribute('data-service');
        const whatsappUrl = getWhatsAppUrlByKey(serviceType);
        
        if (whatsappUrl) {
            link.href = whatsappUrl;
            // Remover target="_blank" para abrir na mesma aba
            // link.target = '_blank';
            // link.rel = 'noopener noreferrer';
        }
    });
}

// Adicionar efeitos visuais extras para cards de serviços clicáveis
function enhanceServiceCards() {
    const serviceCards = document.querySelectorAll('[data-service]');

    serviceCards.forEach(card => {
        // Adicionar classe CSS para efeitos visuais
        card.classList.add('service-card-clickable');
    });
}

// Integração com Formspree
function initFormspreeIntegration() {
    const form = document.getElementById('form-contato');
    const submitButton = document.getElementById('form-submit-button');
    const statusElement = document.getElementById('form-status');

    async function handleSubmit(event) {
        event.preventDefault();

        // Desabilitar botão e mostrar loading
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="material-icons inline-block mr-2 animate-spin">refresh</span>Enviando...';

        // Obter dados do formulário
        const formData = new FormData(form);
        const nome = formData.get('nome');
        const email = formData.get('email');
        const telefone = formData.get('telefone');
        const mensagem = formData.get('mensagem');

        try {
            // Tentar enviar via Formspree
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    Accept: "application/json",
                },
            });

            if (response.ok) {
                // Sucesso com Formspree
                statusElement.innerHTML =
                    '<span class="text-green-600 font-semibold">✓ Mensagem enviada com sucesso! Entraremos em contato em breve.</span>';
                form.reset();

                // Usar função de notificação
                showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');

                // Tracking otimizado para Google Ads - Formulário enviado com sucesso
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'generate_lead', {
                        currency: 'BRL',
                        value: 2, // Valor maior para formulário (mais qualificado)
                        method: 'contact_form',
                        source: 'website_form',
                        campaign: 'form_submission'
                    });
                    
                    gtag('event', 'submit_form', {
                        form_id: 'form-contato',
                        event_category: 'Lead Generation',
                        event_label: 'Contact Form Submission',
                        content_group: 'Form'
                    });
                }
            } else {
                // Erro do Formspree, usar fallback
                throw new Error("Formspree error");
            }
        } catch (error) {
            // Fallback para mailto
            console.log("Usando fallback mailto devido a:", error.message);

            const corpo = `Nome: ${nome}%0AEmail: ${email}%0ATelefone: ${telefone}%0AMensagem: ${mensagem}`;
            window.location.href = `mailto:contato@fjcalculos.com?subject=Solicitação de Orçamento&body=${corpo}`;

            statusElement.innerHTML =
                '<span class="text-blue-600 font-semibold">📧 Abrindo seu cliente de email para enviar a mensagem...</span>';

            // Usar função de notificação
            showNotification('Abrindo seu cliente de email para enviar a mensagem...', 'info');
        }

        // Reabilitar botão
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = '<span class="material-icons inline-block mr-2">send</span>Enviar Mensagem';
        }, 3000);
    }

    if (form) {
        form.addEventListener("submit", handleSubmit);
    }
}

// Função para aplicar máscara de telefone
function applyPhoneMask(input) {
    if (!input) return;

    input.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, ''); // Removes tudo que não é dígito

        // Limita a 11 dígitos (celular) ou 10 dígitos (fixo)
        if (value.length > 11) {
            value = value.substring(0, 11);
        }

        // Aplica a formatação
        let formattedValue = '';

        if (value.length > 0) {
            formattedValue = '(' + value.substring(0, 2);

            if (value.length > 2) {
                formattedValue += ') ';

                if (value.length <= 6) {
                    // Para números com 10 dígitos (fixo): (00) 0000-0000
                    formattedValue += value.substring(2);
                } else if (value.length <= 10) {
                    // Para números com 10 dígitos (fixo): (00) 0000-0000
                    formattedValue += value.substring(2, 6) + '-' + value.substring(6);
                } else {
                    // Para números com 11 dígitos (celular): (00) 00000-0000
                    formattedValue += value.substring(2, 7) + '-' + value.substring(7);
                }
            }
        }

        e.target.value = formattedValue;
    });

    // Permitir apenas números, backspace, delete e setas
    input.addEventListener('keydown', function (e) {
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
        const isNumber = (e.key >= '0' && e.key <= '9');

        if (!allowedKeys.includes(e.key) && !isNumber) {
            e.preventDefault();
        }
    });

    // Limpar formatação ao colar texto
    input.addEventListener('paste', function (e) {
        setTimeout(() => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) {
                value = value.substring(0, 11);
            }

            // Reaplica a formatação
            const event = new Event('input', { bubbles: true });
            e.target.value = value;
            e.target.dispatchEvent(event);
        }, 0);
    });
}

// ========= FUNCIONALIDADES DO CARROSSEL HERO =========

// Inicializar carrossel do hero
function initHeroCarousel() {
    console.log('Inicializando carrossel do hero...');
    
    const carousel = document.getElementById('hero-carousel');
    if (!carousel) {
        console.warn('Carrossel hero não encontrado');
        return;
    }
    
    // Verificar se é dispositivo móvel - se for, desabilitar carrossel
    if (isMobileDevice()) {
        console.log('Dispositivo móvel detectado - desabilitando carrossel e mostrando como stack');
        setupMobileStackLayout();
        return;
    }
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevButton = document.getElementById('carousel-prev');
    const nextButton = document.getElementById('carousel-next');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    let currentSlide = 0;
    let autoPlayInterval;
    const autoPlayDelay = 8000; // 8 segundos
    
    // Função para ir para um slide específico
    function goToSlide(slideIndex) {
        // Remover classes ativas
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev');
            if (index === slideIndex) {
                slide.classList.add('active');
            } else if (index < slideIndex) {
                slide.classList.add('prev');
            }
        });
        
        // Atualizar indicadores
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === slideIndex);
            indicator.classList.remove('auto-progress');
        });
        
        currentSlide = slideIndex;
        
        // Adicionar animação de progresso no indicador ativo (apenas se auto-play estiver ativo)
        if (autoPlayInterval && indicators[currentSlide]) {
            indicators[currentSlide].classList.add('auto-progress');
        }
        
        console.log(`Mudou para slide ${slideIndex + 1}`);
    }
    
    // Função para ir para o próximo slide
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }
    
    // Função para ir para o slide anterior
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prev);
    }
    
    // Função para iniciar auto-play
    function startAutoPlay() {
        stopAutoPlay(); // Limpar qualquer interval existente
        autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
        // Adicionar indicador de progresso
        if (indicators[currentSlide]) {
            indicators[currentSlide].classList.add('auto-progress');
        }
    }
    
    // Função para parar auto-play
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
        // Remover indicadores de progresso
        indicators.forEach(indicator => {
            indicator.classList.remove('auto-progress');
        });
    }
    
    // Event listeners para os botões de navegação
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            nextSlide();
            stopAutoPlay();
            // Reiniciar auto-play após 3 segundos de inatividade
            setTimeout(startAutoPlay, 3000);
        });
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            prevSlide();
            stopAutoPlay();
            // Reiniciar auto-play após 3 segundos de inatividade
            setTimeout(startAutoPlay, 3000);
        });
    }
    
    // Event listeners para os indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            stopAutoPlay();
            // Reiniciar auto-play após 3 segundos de inatividade
            setTimeout(startAutoPlay, 3000);
        });
    });
    
    // Pausar auto-play quando o mouse estiver sobre o carrossel
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    
    // Pausar auto-play quando a aba não estiver ativa
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    });
    
    // Suporte para navegação por teclado
    document.addEventListener('keydown', (e) => {
        // Verificar se o carrossel está visível
        const heroSection = document.getElementById('inicio');
        if (!heroSection) return;
        
        const rect = heroSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
                stopAutoPlay();
                setTimeout(startAutoPlay, 3000);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
                stopAutoPlay();
                setTimeout(startAutoPlay, 3000);
            }
        }
    });
    
    // Inicializar o carrossel
    goToSlide(0);
    startAutoPlay();
    
    console.log('Carrossel do hero inicializado com sucesso!');
}

// Função para configurar layout empilhado em mobile
function setupMobileStackLayout() {
    const carousel = document.getElementById('hero-carousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    const controlsNext = document.getElementById('carousel-next');
    const controlsPrev = document.getElementById('carousel-prev');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    // Esconder controles do carrossel em mobile
    if (controlsNext) controlsNext.style.display = 'none';
    if (controlsPrev) controlsPrev.style.display = 'none';
    indicators.forEach(indicator => indicator.style.display = 'none');
    
    // Modificar classes dos slides para layout empilhado
    slides.forEach((slide, index) => {
        // Remover classes de carrossel
        slide.classList.remove('absolute', 'inset-0', 'active', 'prev');
        slide.classList.remove('opacity-0', 'opacity-100', 'translate-x-0', 'translate-x-full', '-translate-x-full');
        
        // Adicionar classes para layout empilhado
        slide.classList.add('relative', 'w-full', 'opacity-100');
        slide.style.position = 'relative';
        slide.style.transform = 'none';
        slide.style.opacity = '1';
        
        // Adicionar separação entre os slides
        if (index > 0) {
            slide.style.marginTop = '4rem'; // 16 * 0.25rem = 4rem
            
            // Adicionar uma linha divisória visual
            const divider = document.createElement('div');
            divider.className = 'w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-8';
            slide.style.borderTop = '1px solid rgba(0,0,0,0.1)';
            slide.style.paddingTop = '2rem';
        }
        
        // Ajustar altura mínima para mobile
        if (index === 1) { // Slide do LinkedIn
            slide.style.minHeight = 'auto';
            
            // Ajustar layout interno para mobile
            const container = slide.querySelector('.container');
            if (container) {
                const grid = container.querySelector('.grid');
                if (grid) {
                    grid.classList.remove('lg:grid-cols-3');
                    grid.classList.add('grid-cols-1');
                    
                    // Reorganizar ordem dos elementos
                    const textContent = grid.querySelector('.lg\\:col-span-2');
                    const imageContent = grid.querySelector('.text-center:not(.lg\\:col-span-2)');
                    
                    if (textContent && imageContent) {
                        // Colocar imagem primeiro em mobile
                        grid.insertBefore(imageContent, textContent);
                        
                        // Ajustar classes
                        textContent.classList.remove('lg:col-span-2', 'lg:text-left');
                        textContent.classList.add('text-center');
                    }
                }
            }
        }
    });
    
    // Adicionar classe especial ao container para identificar modo mobile
    carousel.classList.add('mobile-stack-layout');
    
    console.log('Layout empilhado configurado para mobile');
}

// Função para resetar o carrossel (útil para debugging)
function resetHeroCarousel() {
    const indicators = document.querySelectorAll('.carousel-indicator');
    indicators.forEach(indicator => {
        indicator.classList.remove('auto-progress');
    });
    
    // Reinicializar
    initHeroCarousel();
}

// Função para lidar com mudanças de tamanho de tela
function handleCarouselResize() {
    const carousel = document.getElementById('hero-carousel');
    if (!carousel) return;
    
    const wasMobileLayout = carousel.classList.contains('mobile-stack-layout');
    const isMobileNow = isMobileDevice();
    
    // Se mudou de mobile para desktop ou vice-versa, reinicializar
    if ((wasMobileLayout && !isMobileNow) || (!wasMobileLayout && isMobileNow)) {
        console.log('Mudança de layout detectada, reinicializando carrossel...');
        
        // Resetar todas as classes e estilos
        const slides = carousel.querySelectorAll('.carousel-slide');
        slides.forEach(slide => {
            slide.className = 'carousel-slide';
            slide.style.cssText = '';
        });
        
        carousel.classList.remove('mobile-stack-layout');
        
        // Mostrar controles novamente
        const controlsNext = document.getElementById('carousel-next');
        const controlsPrev = document.getElementById('carousel-prev');
        const indicators = document.querySelectorAll('.carousel-indicator');
        
        if (controlsNext) controlsNext.style.display = '';
        if (controlsPrev) controlsPrev.style.display = '';
        indicators.forEach(indicator => indicator.style.display = '');
        
        // Reinicializar
        setTimeout(() => {
            initHeroCarousel();
        }, 100);
    }
}

// Exportar funções do carrossel para uso global se necessário
window.HeroCarousel = {
    reset: resetHeroCarousel,
    init: initHeroCarousel,
    handleResize: handleCarouselResize
};