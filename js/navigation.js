class MobileNavigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navOverlay = document.querySelector('.nav-overlay');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        // Toggle mobile menu
        this.navToggle?.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking overlay
        this.navOverlay?.addEventListener('click', () => this.closeMenu());
        
        // Close menu when clicking a nav link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Close menu when pressing Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.navMenu.contains(e.target) && 
                !this.navToggle.contains(e.target)) {
                this.closeMenu();
            }
        });
        
        // Handle scroll effects
        this.handleScroll();
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Close menu when resizing to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024 && this.isOpen) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.isOpen = true;
        document.body.classList.add('menu-open');
        this.navToggle?.classList.add('active');
        this.navMenu?.classList.add('active');
        this.navOverlay?.classList.add('active');
        document.documentElement.style.overflow = 'hidden';
    }
    
    closeMenu() {
        this.isOpen = false;
        document.body.classList.remove('menu-open');
        this.navToggle?.classList.remove('active');
        this.navMenu?.classList.remove('active');
        this.navOverlay?.classList.remove('active');
        document.documentElement.style.overflow = '';
    }
    
    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar?.classList.add('scrolled');
        } else {
            this.navbar?.classList.remove('scrolled');
        }
    }
}

// Initialize mobile navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const mobileNav = new MobileNavigation();
});
