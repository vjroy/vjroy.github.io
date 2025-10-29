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

    // About section with glitch effect
    function setupAboutAnimation() {
        const aboutSection = document.querySelector('.about');
        const originalText = document.querySelector('.about-text');
        const glitchText = document.querySelector('.about-text-glitch');
        
        if (!aboutSection || !originalText || !glitchText) return;
        
        const text = originalText.textContent;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        
        // Initialize the HTML structure immediately
        const textArray = text.split('');
        let htmlContent = '';
        
        textArray.forEach((char, i) => {
            if (char === ' ') {
                htmlContent += ' ';
            } else {
                const randomChar = characters[Math.floor(Math.random() * characters.length)];
                htmlContent += `<span data-char="${char}" data-index="${i}">${randomChar}</span>`;
            }
        });
        
        glitchText.innerHTML = htmlContent;
        const spans = glitchText.querySelectorAll('span');
        let animationComplete = false;
        let hardLock = false;
        
        function updateGlitch(progress) {
            if (animationComplete || hardLock) return;
            
            const resolvedIndex = Math.floor(progress * text.length);
            
            spans.forEach((span, index) => {
                // Don't update if locked
                if (span.getAttribute('data-locked') === 'true') return;
                
                const targetChar = span.getAttribute('data-char');
                
                if (index <= resolvedIndex) {
                    // Character is resolved - set it once and lock it
                    span.textContent = targetChar;
                    span.style.opacity = '1';
                    span.setAttribute('data-locked', 'true');
                } else {
                    // Character is still glitching
                    if (Math.random() < 0.1) {
                        span.textContent = characters[Math.floor(Math.random() * characters.length)];
                    }
                    span.style.opacity = '0.5';
                }
            });
        }
        
        let hasAnimated = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    aboutSection.classList.add('visible');
                    
                    // Animate glitch effect
                    let progress = 0;
                    const interval = setInterval(() => {
                        progress += 0.015;
                        updateGlitch(progress);
                        
                        if (progress >= 1) {
                            clearInterval(interval);
                            animationComplete = true;
                            hardLock = true;
                            
                            // Disable ALL further updates
                            glitchText.setAttribute('data-frozen', 'true');
                            
                            // Final pass - ensure all characters are correct and lock them
                            spans.forEach((span) => {
                                const targetChar = span.getAttribute('data-char');
                                span.textContent = targetChar;
                                span.style.opacity = '1';
                                span.style.transition = 'none';
                                span.setAttribute('data-locked', 'true');
                                span.style.setProperty('pointer-events', 'none');
                            });
                            
                            // Remove event listeners or any other mechanism that could trigger updates
                            window.getComputedStyle = new Proxy(window.getComputedStyle, {
                                apply: function(target, thisArg, args) {
                                    if (glitchText.getAttribute('data-frozen') === 'true') {
                                        return {};
                                    }
                                    return target.apply(thisArg, args);
                                }
                            });
                        }
                    }, 25);
                }
            });
        }, { threshold: 0.3 });
        observer.observe(aboutSection);
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
    
    // Add 3D tilt effect to project boxes
    setup3DTiltEffect();
    
});


// 3D tilt effect for project boxes
function setup3DTiltEffect() {
    const boxes = document.querySelectorAll('.project-item');
    
    boxes.forEach(box => {
        box.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = box.getBoundingClientRect();
            
            // Get mouse position relative to box center
            const x = clientX - left;
            const y = clientY - top;
            const middleX = width / 2;
            const middleY = height / 2;
            
            // Calculate offset from center as percentage
            const offsetX = ((x - middleX) / middleX) * 20;
            const offsetY = ((y - middleY) / middleY) * -15;
            
            // Apply 3D transform directly, keeping the base scale
            box.style.transform = `scale(0.95) perspective(2000px) rotateX(${offsetY}deg) rotateY(${offsetX}deg)`;
            box.style.transition = 'transform 0.1s ease-out';
        });

        box.addEventListener('mouseleave', () => {
            // Return to base centered position
            box.style.transform = 'scale(0.95)';
            box.style.transition = 'transform 0.3s ease-out';
        });
    });
}

