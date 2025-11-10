document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const navbar = document.getElementById('navbar');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');
    const sections = document.querySelectorAll('section');


    mobileMenuButton.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.contains('hidden');
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('flex');
        } else {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
        }
    });


    mobileMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
        }
    });

    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    const handleScroll = () => {
        if (window.scrollY > 10) {
            navbar.classList.add('shadow-lg');
        } else {
            navbar.classList.remove('shadow-lg');
        }
    };
    
    window.addEventListener('scroll', throttle(handleScroll, 100));
    

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' });

    sections.forEach(section => {
        observer.observe(section);
    });
});
