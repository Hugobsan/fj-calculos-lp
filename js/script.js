// Aguardar carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function () {
    console.log('JP Cálculos - Landing Page carregada');

    // Inicializar funcionalidades
    initMobileMenu();
    initScrollEffects();
    initSmoothScrolling();
    initAnimationsOnScroll();
    initPerformanceOptimizations();
    initWhatsAppIntegration();
    initCTAButtons();
    initFormspreeIntegration();
    initCookieBanner();

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
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
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

                if(element.classList.contains('animate-in')){
                    element.classList.add('animate-bounce-in');
                }
                if(element.classList.contains('pulse')){
                    element.classList.add('animate-pulse');
                }
                if(element.classList.contains('slide-in-scale')) {
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

// Event listeners para botões de CTA - REMOVIDO: conflito com initCTAButtons()
// Esta implementação foi substituída pela função initCTAButtons() que inclui integração WhatsApp
/*
document.addEventListener('DOMContentLoaded', function () {
    const ctaButtons = document.querySelectorAll('[data-cta]');

    ctaButtons.forEach(button => {
        button.addEventListener('click', function () {
            const ctaType = this.dataset.cta;

            // Analytics tracking (se necessário)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    event_category: 'CTA',
                    event_label: ctaType
                });
            }

            // Scroll para formulário de contato
            if (ctaType === 'contact' || ctaType === 'quote') {
                const contactSection = document.querySelector('#contato');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            }

            // Scroll para seção de serviços
            if (ctaType === 'services') {
                const servicesSection = document.querySelector('#servicos');
                if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth' });
                }
            }

            // Scroll para seção sobre
            if (ctaType === 'about') {
                const aboutSection = document.querySelector('#sobre');
                if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});
*/

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
    const message = encodeURIComponent('Olá! Gostaria de solicitar um orçamento para cálculos judiciais.');

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
        gtag('event', 'click', {
            event_category: 'WhatsApp',
            event_label: 'Floating Button'
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
        const message = encodeURIComponent('Olá! Gostaria de solicitar um orçamento para cálculos judiciais.');

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
        const message = customMessage || 'Olá! Gostaria de solicitar um orçamento para cálculos judiciais.';
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
        return '';
    }

    const message = customMessage || 'Olá! Gostaria de solicitar um orçamento para cálculos judiciais.';
    const encodedMessage = encodeURIComponent(message);

    if (isMobileDevice()) {
        return `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
    } else {
        return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    }
}

// Exportar funções para uso global se necessário
window.WhatsAppUtils = {
    updateNumber: updateWhatsAppNumber,
    isMobile: isMobileDevice,
    getUrl: getWhatsAppUrl
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
        acceptButton.addEventListener('click', function() {
            setCookieConsent('accepted');
            enableGoogleAnalytics();
            hideCookieBanner();
        });
    }

    if (declineButton) {
        declineButton.addEventListener('click', function() {
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
    updateWhatsAppNumber('553398337624', 'Olá! Gostaria de solicitar um orçamento para cálculos judiciais.');

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
function initCTAButtons() {
    // Adicionar evento aos botões CTA
    const ctaButtons = document.querySelectorAll('[data-cta]');    ctaButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault(); // Prevenir comportamento padrão
            const ctaType = this.getAttribute('data-cta');switch (ctaType) {
                case 'quote':
                    // Abrir WhatsApp com mensagem de orçamento
                    const phoneNumber = '553398337624';
                    const quoteMessage = 'Olá! Gostaria de solicitar um orçamento personalizado para cálculos judiciais. Poderia me enviar mais informações sobre os serviços e valores?';
                    const whatsappUrl = getWhatsAppUrl(phoneNumber, quoteMessage);
                    
                    if (whatsappUrl) {
                        if (isMobileDevice()) {
                            // Para mobile: tentar app primeiro
                            window.location.href = whatsappUrl;
                        } else {
                            // Para desktop: abrir em nova aba
                            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                        }
                        
                        // Analytics tracking
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'click', {
                                event_category: 'WhatsApp',
                                event_label: 'CTA Quote Button'
                            });
                        }
                    } else {
                        // Fallback: rolar para o formulário de contato
                        document.getElementById('contato').scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        setTimeout(() => {
                            const nomeField = document.querySelector('input[name="nome"]');
                            if (nomeField) nomeField.focus();
                        }, 500);
                    }
                    break;                case 'services':
                    // Rolar para a seção de serviços
                    document.getElementById('servicos').scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    break;
            }

            // Tracking de eventos (analytics)
            console.log('CTA clicked:', ctaType);
        });
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