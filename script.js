// Simple slide-in animations
document.addEventListener('DOMContentLoaded', function() {
    // Typing animation
    function typeWriter(element, text, speed = 80, delay = 0) {
        return new Promise((resolve) => {
            setTimeout(() => {
                element.textContent = '';
                element.classList.remove('typing-complete');
                
                let i = 0;
                function type() {
                    if (i < text.length) {
                        element.textContent += text.charAt(i);
                        i++;
                        setTimeout(type, speed);
                    } else {
                        element.classList.add('typing-complete');
                        resolve();
                    }
                }
                type();
            }, delay);
        });
    }

    // Animate hero
    function animateHero() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        setTimeout(() => {
            hero.classList.add('visible');

            const nameElement = document.querySelector('.hero-name .typing-text');
            const titleElement = document.querySelector('.hero-title .typing-text');

            if (nameElement) {
                typeWriter(nameElement, nameElement.getAttribute('data-text') || 'Veejhay Roy', 70, 300);
            }

            if (titleElement) {
                typeWriter(titleElement, titleElement.getAttribute('data-text') || 'Computer Science & Machine Learning Student', 50, 2500);
            }

            const emailElement = document.querySelector('.hero-email');
            if (emailElement) {
                setTimeout(() => {
                    emailElement.style.opacity = '1';
                    emailElement.style.transform = 'translateY(0)';
                }, 4000);
            }
        }, 500);
    }

    // About section
    function setupAboutAnimation() {
        const aboutSection = document.querySelector('.about');
        if (aboutSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        aboutSection.classList.add('visible');
                    }
                });
            }, { threshold: 0.3 });
            observer.observe(aboutSection);
        }
    }

    // Slide-in animations with Intersection Observer
    function setupSlideAnimations() {
        const projectItems = document.querySelectorAll('.project-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('slide-in');
                    
                    // Trigger typing animation for title
                    if (!entry.target.classList.contains('typed')) {
                        entry.target.classList.add('typed');
                        const titleElement = entry.target.querySelector('.project-title .typing-text');
                        if (titleElement) {
                            const text = titleElement.getAttribute('data-text');
                            if (text) {
                                typeWriter(titleElement, text, 50, 0);
                            }
                        }
                    }
                }
            });
        }, {
            threshold: 0.3
        });

        projectItems.forEach(item => {
            observer.observe(item);
        });
    }

    animateHero();
    setupAboutAnimation();
    setupSlideAnimations();
    
    // Add custom cursor effect for interactive elements
    setupCustomCursor();
});

// Custom cursor effect for interactive elements
function setupCustomCursor() {
    // Create custom cursor element
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    const links = document.querySelectorAll('.link, .project-item, .profile-img-wrapper, .social-link');
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Add hover effects
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        link.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });
}
