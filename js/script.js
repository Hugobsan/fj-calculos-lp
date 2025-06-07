// Aguardar carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('JP Cálculos - Landing Page carregada');
    
    // Inicializar funcionalidades
    initMobileMenu();
    initScrollEffects();
    initSmoothScrolling();
    initFormHandling();
    initAnimationsOnScroll();
    initPerformanceOptimizations();
});

// Funcionalidade do menu mobile
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = mobileMenuButton.querySelector('.material-icons');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
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
        link.addEventListener('click', function(e) {
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

// Manipulação de formulários
function initFormHandling() {
    const contactForm = document.querySelector('#contato form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação dos campos
            const formData = new FormData(this);
            const formElements = this.elements;
            let isValid = true;
            let errors = [];
            
            // Validação básica
            for (let element of formElements) {
                if (element.hasAttribute('required') && !element.value.trim()) {
                    isValid = false;
                    errors.push(`O campo ${element.previousElementSibling.textContent} é obrigatório`);
                    element.classList.add('border-red-500');
                } else {
                    element.classList.remove('border-red-500');
                }
                
                // Validação de email
                if (element.type === 'email' && element.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(element.value)) {
                        isValid = false;
                        errors.push('Por favor, insira um email válido');
                        element.classList.add('border-red-500');
                    }
                }
            }
            
            if (isValid) {
                // Simular envio do formulário
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                
                submitButton.innerHTML = '<span class="material-icons animate-spin inline-block mr-2">refresh</span>Enviando...';
                submitButton.disabled = true;
                submitButton.classList.add('loading');
                
                // Simular delay de envio
                setTimeout(() => {
                    submitButton.innerHTML = '<span class="material-icons inline-block mr-2">check</span>Enviado!';
                    submitButton.classList.remove('loading');
                    submitButton.classList.add('bg-green-500');
                    
                    // Mostrar mensagem de sucesso
                    showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                    
                    // Reset do formulário
                    setTimeout(() => {
                        this.reset();
                        submitButton.innerHTML = originalText;
                        submitButton.disabled = false;
                        submitButton.classList.remove('bg-green-500');
                    }, 3000);
                }, 2000);
            } else {
                // Mostrar erros
                showNotification(errors.join('<br>'), 'error');
            }
        });
        
        // Adicionar validação em tempo real
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                // Remover classe de erro ao digitar
                this.classList.remove('border-red-500');
            });
        });
    }
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
                const element = entry.target;
                
                // Adicionar classes de animação baseadas na posição
                if (element.classList.contains('animate-on-scroll')) {
                    element.classList.add('animate-fade-in-up');
                }
                
                if (element.classList.contains('animate-left')) {
                    element.classList.add('animate-fade-in-left');
                }
                
                if (element.classList.contains('animate-right')) {
                    element.classList.add('animate-fade-in-right');
                }
                
                // Parar de observar após animar
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observar elementos que devem ser animados
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll, .animate-left, .animate-right');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
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
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Event listeners para botões de CTA
document.addEventListener('DOMContentLoaded', function() {
    const ctaButtons = document.querySelectorAll('[data-cta]');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
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
        });
    });
});

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
window.addEventListener('load', function() {
    // Detectar modo escuro
    detectColorScheme();
    
    // Log de performance
    if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Página carregada em ${loadTime}ms`);
    }
});

// Tratamento de erros globais
window.addEventListener('error', function(e) {
    console.error('Erro capturado:', e.error);
    // Aqui você pode implementar logging de erros para um serviço externo
});

// Service Worker registration (para PWA futuro)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registrado'))
        //     .catch(error => console.log('Erro no SW:', error));
    });
}

// Funcionalidades do botão flutuante do WhatsApp
function initWhatsAppButton() {
    const whatsappButton = document.querySelector('.whatsapp-button');
    
    if (whatsappButton) {
        // Adicionar evento de clique com tracking
        whatsappButton.addEventListener('click', function(e) {
            // Analytics tracking (se necessário)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    event_category: 'WhatsApp',
                    event_label: 'Floating Button'
                });
            }
            
            // Log para debug
            console.log('WhatsApp button clicked');
        });
        
        // Efeito de entrada após carregamento da página
        setTimeout(() => {
            whatsappButton.classList.add('animate-bounce-in');
        }, 1500);
        
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
    }
}

// Função para detectar se o usuário está em um dispositivo móvel
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Personalizar link do WhatsApp baseado no dispositivo
function customizeWhatsAppLink() {
    const whatsappButton = document.querySelector('.whatsapp-button');
    
    if (whatsappButton) {
        const currentHref = whatsappButton.getAttribute('href');
        
        // Se for mobile, usar o protocolo do app
        if (isMobileDevice()) {
            const phoneNumber = '5511999999999'; // Substitua pelo número real
            const message = encodeURIComponent('Olá! Gostaria de solicitar um orçamento para cálculos judiciais.');
            whatsappButton.setAttribute('href', `whatsapp://send?phone=${phoneNumber}&text=${message}`);
        }
    }
}

// Adicionar efeito de shake ocasional para chamar atenção
function addShakeEffect() {
    const whatsappButton = document.querySelector('.whatsapp-button');
    
    if (whatsappButton) {
        setInterval(() => {
            // Shake a cada 30 segundos se o usuário não interagiu
            if (!document.hidden && !whatsappButton.classList.contains('recently-hovered')) {
                whatsappButton.classList.add('animate-shake');
                setTimeout(() => {
                    whatsappButton.classList.remove('animate-shake');
                }, 1000);
            }
        }, 30000);
        
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
document.addEventListener('DOMContentLoaded', function() {
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
        
        if (isMobileDevice()) {
            whatsappButton.setAttribute('href', `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`);
        } else {
            whatsappButton.setAttribute('href', `https://wa.me/${phoneNumber}?text=${encodedMessage}`);
        }
    }
}

// Exportar funções para uso global se necessário
window.WhatsAppUtils = {
    updateNumber: updateWhatsAppNumber,
    isMobile: isMobileDevice
};