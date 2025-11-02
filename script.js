// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize lazy loading features
    initLazyLoading();
    initScrollReveal();
    initImageLazyLoad();
});

// ===== LAZY LOADING INITIALIZATION =====
function initLazyLoading() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    fadeElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('visible');
        }, index * 100);
    });
}

// ===== SCROLL REVEAL ANIMATION =====
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('revealed');
            }
        });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Check on initial load
}

// ===== IMAGE LAZY LOADING =====
function initImageLazyLoad() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Add loaded class when image loads
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                    });
                    
                    // If image is already cached, add loaded class immediately
                    if (img.complete) {
                        img.classList.add('loaded');
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => {
            img.classList.add('loaded');
        });
    }
}

// ===== CURSOR TRAIL ANIMATION =====
class CursorTrail {
    constructor() {
        this.trail = document.querySelector('.cursor-trail');
        this.isActive = false;
        this.particles = [];
        this.init();
    }
    init() {
        if (!this.trail) return;
        
        document.addEventListener('mousemove', (e) => {
            this.updateTrail(e.clientX, e.clientY);
            this.createParticle(e.clientX, e.clientY);
        });

        document.addEventListener('mouseenter', () => {
            this.trail.classList.add('active');
        });

        document.addEventListener('mouseleave', () => {
            this.trail.classList.remove('active');
        });
    }
    updateTrail(x, y) {
        this.trail.style.left = x + 'px';
        this.trail.style.top = y + 'px';
    }
    
    createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'trail-particle';
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, var(--gold) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: fadeOut 1s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }
}

// Add fadeOut animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0); }
    }
`;
document.head.appendChild(style);

// ===== PRODUCT CAROUSEL LIGHTBOX BINDINGS =====
function initProductLightboxBindings() {
    const lightboxEl = document.getElementById('lightbox');
    if (!lightboxEl || !window.lightbox) return;

    document.querySelectorAll('.carousel-container').forEach(container => {
        const items = Array.from(container.querySelectorAll('.carousel-item'));
        const card = container.closest('.product-card');
        const titleEl = card ? card.querySelector('h3, .product-title') : null;
        const descEl = card ? card.querySelector('p, .product-description') : null;
        const title = titleEl ? titleEl.textContent.trim() : '';
        const description = descEl ? descEl.textContent.trim() : '';

        const mediaArray = items.map(it => {
            const img = it.querySelector('img');
            if (img) {
                const src = img.getAttribute('src') || img.getAttribute('data-src') || '';
                return { type: 'image', src, title, description };
            }
            const vid = it.querySelector('video');
            if (vid) {
                let src = vid.getAttribute('data-src') || vid.getAttribute('src') || '';
                if (!src) {
                    const source = vid.querySelector('source');
                    src = (source && (source.getAttribute('data-src') || source.getAttribute('src'))) || '';
                }
                return { type: 'video', src, title, description };
            }
            return null;
        }).filter(Boolean);

        items.forEach((it, idx) => {
            it.style.cursor = 'zoom-in';
            it.addEventListener('click', () => {
                const m = mediaArray[idx];
                if (!m || !m.src) return;
                openLightbox(m.src, title, description, mediaArray);
            });
        });
    });
}

// (removed duplicate stray code block)

// ===== NAVIGATION =====
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.init();
    }

    init() {
        // Mobile menu toggle
        if (this.navToggle && this.navMenu) {
            this.navToggle.addEventListener('click', () => {
                this.navMenu.classList.toggle('active');
                this.navToggle.classList.toggle('active');
            });

            // Close menu when clicking on links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    this.navMenu.classList.remove('active');
                    this.navToggle.classList.remove('active');
                });
            });
        }

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });
    }
}

// ===== LIGHTBOX MODAL =====
class Lightbox {
    constructor() {
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.getElementById('lightbox-image');
        this.lightboxVideo = document.getElementById('lightbox-video');
        this.lightboxTitle = document.getElementById('lightbox-title');
        this.lightboxDescription = document.getElementById('lightbox-description');
        this.lightboxClose = document.querySelector('.lightbox-close');
        this.lightboxPrev = document.getElementById('lightbox-prev');
        this.lightboxNext = document.getElementById('lightbox-next');
        
        this.currentIndex = 0;
        this.mediaItems = [];
        this.init();
    }

    init() {
        if (!this.lightbox) return;

        // Close lightbox
        this.lightboxClose.addEventListener('click', () => this.close());
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) this.close();
        });

        // Navigation
        this.lightboxPrev.addEventListener('click', () => this.prev());
        this.lightboxNext.addEventListener('click', () => this.next());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    this.close();
                    break;
                case 'ArrowLeft':
                    this.prev();
                    break;
                case 'ArrowRight':
                    this.next();
                    break;
            }
        });
    }

    open(imageSrc, title, description, mediaArray = []) {
        this.mediaItems = mediaArray && mediaArray.length ? mediaArray : [{ type: 'image', src: imageSrc, title, description }];
        const foundIndex = this.mediaItems.findIndex(item => item.src === imageSrc);
        this.currentIndex = foundIndex !== -1 ? foundIndex : 0;

        this.showCurrentMedia();

        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Pause any playing videos outside of lightbox
        this.pauseAllVideos();
    }

    close() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
        this.pauseAllVideos();
    }

    prev() {
        if (this.mediaItems.length === 0) return;
        
        this.currentIndex = (this.currentIndex - 1 + this.mediaItems.length) % this.mediaItems.length;
        this.showCurrentMedia();
    }

    next() {
        if (this.mediaItems.length === 0) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.mediaItems.length;
        this.showCurrentMedia();
    }

    showCurrentMedia() {
        const item = this.mediaItems[this.currentIndex];
        const type = item.type || 'image';
        this.lightboxTitle.textContent = item.title || '';
        this.lightboxDescription.textContent = item.description || '';

        if (type === 'video') {
            // Show video
            this.lightboxImage.style.display = 'none';
            this.lightboxVideo.style.display = 'block';
            // Set video source
            const sourceEl = this.lightboxVideo.querySelector('source');
            if (sourceEl) {
                sourceEl.setAttribute('src', item.src);
            } else {
                this.lightboxVideo.setAttribute('src', item.src);
            }
            this.lightboxVideo.load();
        } else {
            // Show image
            this.lightboxVideo.pause();
            this.lightboxVideo.style.display = 'none';
            this.lightboxImage.style.display = 'block';
            this.lightboxImage.src = item.src;
        }
    }

    pauseAllVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => video.pause());
    }
}

// ===== WHATSAPP INTEGRATION =====
class WhatsAppIntegration {
    constructor() {
        this.phoneNumber = '919740161629';
        this.init();
    }

    init() {
        // Quick quote form
        const quickForm = document.getElementById('quick-quote-form');
        if (quickForm) {
            quickForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sendQuickQuote();
            });
        }

        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sendContactForm();
            });
        }

        // Category selection for product dropdown
        const categorySelect = document.getElementById('category');
        const productSelection = document.getElementById('product-selection');
        
        if (categorySelect && productSelection) {
            categorySelect.addEventListener('change', () => {
                this.updateProductOptions();
            });
        }
    }

    sendQuickQuote() {
        const name = document.getElementById('quick-name').value;
        const phone = document.getElementById('quick-phone').value;
        const category = document.getElementById('quick-category').value;
        
        if (!name || !phone || !category) {
            alert('Please fill in all required fields.');
            return;
        }

        const message = `Hi! I'm interested in getting a quote for ${category} products.

Name: ${name}
Phone: ${phone}
Category: ${category}

Please provide me with pricing and availability details.

Thank you!`;

        this.openWhatsApp(message);
    }

    sendContactForm() {
        const formData = new FormData(document.getElementById('contact-form'));
        const data = Object.fromEntries(formData);
        
        let message = `Hi! I'm interested in your products and services.

Name: ${data.name}
Phone: ${data.phone}`;

        if (data.email) message += `\nEmail: ${data.email}`;
        
        message += `\nProduct Category: ${data.category}`;
        
        if (data.products) {
            const selectedProducts = Array.isArray(data.products) ? data.products.join(', ') : data.products;
            message += `\nSpecific Products: ${selectedProducts}`;
        }
        
        if (data.quantity) message += `\nEstimated Quantity: ${data.quantity}`;
        if (data['project-type']) message += `\nProject Type: ${data['project-type']}`;
        
        message += `\nProject Details:\n${data.message}

Please provide me with a detailed quote and any additional information you may need.

Thank you!`;

        this.openWhatsApp(message);
    }

    updateProductOptions() {
        const category = document.getElementById('category').value;
        const productSelect = document.getElementById('products');
        const productSelection = document.getElementById('product-selection');
        
        if (!productSelect || !productSelection) return;
        
        productSelect.innerHTML = '';
        
        if (!category) {
            productSelection.style.display = 'none';
            return;
        }
        
        productSelection.style.display = 'block';
        
        const products = {
            'stone': [
                'Natural Pebbles',
                'Polished Pebbles', 
                'Unpolished Pebbles',
                'Stone Crushed Chips',
                'Multi-color Pebbles'
            ],
            'sand': [
                'River Sand Quality 1',
                'River Sand Quality 2',
                'River Sand Quality 3',
                'River Sand Quality 4',
                'Sea Sand',
                'Play Area Sand',
                'Plastering Sand',
                'Cricket/Hockey Ground Sand',
                'Coarse Sand',
                'Bagged Sand Available'
            ],
            'both': [
                'Natural Pebbles',
                'Polished Pebbles',
                'Unpolished Pebbles',
                'Stone Crushed Chips',
                'Multi-color Pebbles',
                'River Sand Quality 1',
                'River Sand Quality 2',
                'Sea Sand',
                'Play Area Sand',
                'Plastering Sand'
            ]
        };
        
        const categoryProducts = products[category] || [];
        
        categoryProducts.forEach(product => {
            const option = document.createElement('option');
            option.value = product;
            option.textContent = product;
            productSelect.appendChild(option);
        });
    }

    openWhatsApp(message) {
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${this.phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all scroll reveal elements
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }
}

// ===== GALLERY FILTER =====
class GalleryFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.init();
    }

    init() {
        if (this.filterButtons.length === 0) return;

        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                this.filterItems(filter);
                this.updateActiveButton(button);
            });
        });
    }

    filterItems(filter) {
        this.galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.5s ease';
            } else {
                item.style.display = 'none';
            }
        });
    }

    updateActiveButton(activeButton) {
        this.filterButtons.forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
    }
}

// ===== FAQ ACCORDION =====
class FAQAccordion {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.init();
    }

    init() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const icon = question.querySelector('i');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                this.faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherIcon = otherItem.querySelector('.faq-question i');
                        otherAnswer.style.maxHeight = null;
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    answer.style.maxHeight = null;
                    icon.style.transform = 'rotate(0deg)';
                } else {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    icon.style.transform = 'rotate(180deg)';
                }
            });
        });
    }
}

// ===== UTILITY FUNCTIONS =====
function openLightbox(imageSrc, title, description, mediaArray = []) {
    if (window.lightbox) {
        window.lightbox.open(imageSrc, title, description, mediaArray);
    }
}

function sendWhatsApp(productName, price) {
    const message = `Hi! I'm interested in ${productName}.

Product: ${productName}
Price: ${price}

Please provide me with more details about availability, delivery options, and any bulk discounts available.

Thank you!`;

    const whatsapp = new WhatsAppIntegration();
    whatsapp.openWhatsApp(message);
}

function callNow() {
    window.location.href = 'tel:+919740161629';
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== FORM VALIDATION =====
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // Remove error class after user starts typing
                    field.addEventListener('input', function() {
                        this.classList.remove('error');
                    });
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    });
}

// ===== LOADING ANIMATIONS =====
function initLoadingAnimations() {
    // Add loading class to body initially
    document.body.classList.add('loading');
    
    // Remove loading class when page is fully loaded
    window.addEventListener('load', () => {
        document.body.classList.remove('loading');
        
        // Trigger entrance animations
        setTimeout(() => {
            document.querySelectorAll('.fade-in').forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('visible');
                }, index * 100);
            });
        }, 100);
    });
}

// ===== LAZY LOADING FOR IMAGES =====
function initLazyLoading() {
    // Ensure all images use native lazy loading
    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });

    // Lazy load images with data-src
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    images.forEach(img => imageObserver.observe(img));

    // Prepare videos to avoid eager preload
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.preload = 'none';
        // If source children exist with src, move to data-src so browser doesn't load immediately
        video.querySelectorAll('source').forEach(source => {
            if (source.getAttribute('src')) {
                source.setAttribute('data-src', source.getAttribute('src'));
                source.removeAttribute('src');
            }
        });
    });

    // Lazy load videos that have data-src on either video or source
    const lazyVideos = document.querySelectorAll('video[data-src], video source[data-src]');
    const videoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const videoEl = target.tagName.toLowerCase() === 'video' ? target : target.closest('video');
                if (!videoEl) return;

                // Restore video src from data-src if present
                if (videoEl.dataset.src && !videoEl.getAttribute('src')) {
                    videoEl.setAttribute('src', videoEl.dataset.src);
                }
                // Restore all source children
                videoEl.querySelectorAll('source').forEach(source => {
                    const ds = source.getAttribute('data-src');
                    if (ds && !source.getAttribute('src')) {
                        source.setAttribute('src', ds);
                    }
                });

                // Load and optionally play muted loops per markup
                videoEl.load();
                if (videoEl.autoplay) {
                    videoEl.play().catch(() => {});
                }

                observer.unobserve(target);
            }
        });
    });

    lazyVideos.forEach(el => videoObserver.observe(el.tagName.toLowerCase() === 'video' ? el : el.closest('video')));
}

// ===== SEARCH FUNCTIONALITY =====
function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const searchableElements = document.querySelectorAll('[data-searchable]');
        
        searchableElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            const parent = element.closest('.searchable-item');
            
            if (text.includes(searchTerm)) {
                if (parent) parent.style.display = 'block';
                element.style.display = 'block';
            } else {
                if (parent) parent.style.display = 'none';
                element.style.display = 'none';
            }
        });
    });
}

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 6rem;
        width: 50px;
        height: 50px;
        background: var(--luxury-gradient);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: var(--shadow-medium);
    `;
    
    document.body.appendChild(backToTopBtn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== PERFORMANCE OPTIMIZATION =====
function initPerformanceOptimizations() {
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            // Handle scroll events here
        }, 10);
    });
    
    // Preload critical images
    const criticalImages = [
        'images/Stones/Natural Pebbles/Natural1.jpg',
        'images/Stones/Polished/P1.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// ===== PRODUCT CARD CAROUSELS (Prev/Next) =====
function initCarousels() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        let currentIndex = 0;
        const items = Array.from(card.querySelectorAll('.carousel-item'));
        const nextBtn = card.querySelector('.carousel-next');
        const prevBtn = card.querySelector('.carousel-prev');

        if (items.length === 0) return;

        function stopAllVideos() {
            items.forEach(it => {
                const vid = it.querySelector('video');
                if (vid) vid.pause();
            });
        }

        function showSlide(index) {
            items.forEach((item, i) => {
                item.classList.remove('active');
                item.classList.remove('opacity-100');
                item.classList.add('opacity-0');
                if (i === index) {
                    item.classList.add('active');
                    item.classList.add('opacity-100');
                    item.classList.remove('opacity-0');
                }
            });
            stopAllVideos();
            currentIndex = index;
        }

        // Ensure initial state
        showSlide(0);

        nextBtn && nextBtn.addEventListener('click', () => {
            showSlide((currentIndex + 1) % items.length);
        });
        prevBtn && prevBtn.addEventListener('click', () => {
            showSlide((currentIndex - 1 + items.length) % items.length);
        });

        // Swipe support
        let touchStartX = 0;
        card.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        card.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            if (touchEndX < touchStartX - 50) {
                showSlide((currentIndex + 1) % items.length);
            } else if (touchEndX > touchStartX + 50) {
                showSlide((currentIndex - 1 + items.length) % items.length);
            }
        });

        // Auto-rotate
        let autoRotate = setInterval(() => {
            showSlide((currentIndex + 1) % items.length);
        }, 4000);

        card.addEventListener('mouseenter', () => clearInterval(autoRotate));
        card.addEventListener('mouseleave', () => {
            autoRotate = setInterval(() => {
                showSlide((currentIndex + 1) % items.length);
            }, 4000);
        });
    });
}

// ===== GALLERY LIGHTBOX BINDINGS =====
function initGalleryLightboxBindings() {
    const grid = document.querySelector('.gallery-grid');
    if (!grid || !window.lightbox) return;

    const getVisibleItems = () => Array.from(grid.querySelectorAll('.gallery-item'))
        .filter(it => it.style.display !== 'none');

    const buildMediaArray = () => getVisibleItems().map(it => {
        const img = it.querySelector('img');
        const titleEl = it.querySelector('.gallery-info h4');
        const descEl = it.querySelector('.gallery-info p');
        return {
            type: 'image',
            src: img ? (img.getAttribute('data-src') || img.getAttribute('src') || '') : '',
            title: titleEl ? titleEl.textContent.trim() : '',
            description: descEl ? descEl.textContent.trim() : ''
        };
    }).filter(m => m.src);

    grid.querySelectorAll('.gallery-item').forEach(item => {
        if (item.dataset.lbBound === '1') return;
        item.dataset.lbBound = '1';
        item.style.cursor = 'zoom-in';
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const img = item.querySelector('img');
            if (!img) return;
            const mediaArray = buildMediaArray();
            const clickedSrc = img.getAttribute('data-src') || img.getAttribute('src');
            if (!clickedSrc) return;
            openLightbox(clickedSrc, '', '', mediaArray);
        });
    });

    // Rebind when filter buttons change visibility
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.lbRebind === '1') return;
        btn.dataset.lbRebind = '1';
        btn.addEventListener('click', () => {
            setTimeout(() => initGalleryLightboxBindings(), 0);
        });
    });
}

// ===== INITIALIZE ALL FEATURES =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    new CursorTrail();
    new Navigation();
    window.lightbox = new Lightbox();
    new WhatsAppIntegration();
    new ScrollAnimations();
    new GalleryFilter();
    new FAQAccordion();
    
    // Initialize utility functions
    initSmoothScrolling();
    initFormValidation();
    initLoadingAnimations();
    initLazyLoading();
    initSearch();
    initBackToTop();
    initPerformanceOptimizations();

    // Bind product carousels to lightbox
    initProductLightboxBindings();

    // Initialize carousel controls for prev/next arrows
    initCarousels();
    
    // Bind gallery images to global lightbox
    initGalleryLightboxBindings();
    
    // Add custom CSS for form validation
    const validationCSS = `
        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
            border-color: #e74c3c;
            box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
        }
        
        .searchable-item {
            transition: opacity 0.3s ease;
        }
        
        .back-to-top:hover {
            transform: translateY(-3px);
            box-shadow: var(--shadow-heavy);
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = validationCSS;
    document.head.appendChild(styleSheet);
    
    console.log('Madhu Enterprises website initialized successfully!');
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// ===== SERVICE WORKER FOR OFFLINE SUPPORT (Optional) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
