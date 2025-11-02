// Simple slide-in animations
document.addEventListener('DOMContentLoaded', function() {
    // Advanced gradient scroll interaction
    function setupGradientScroll() {
        const gradientBg = document.querySelector('.gradient-background-interactive');
        if (!gradientBg) {
            console.error('Gradient element not found!');
            return;
        }
        
        // Force visibility
        gradientBg.style.setProperty('display', 'block', 'important');
        gradientBg.style.setProperty('opacity', '1', 'important');
        gradientBg.style.setProperty('visibility', 'visible', 'important');
        gradientBg.style.setProperty('z-index', '1', 'important');
        
        console.log('Gradient element found and made visible', gradientBg);
        
        let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
        let scrollVelocity = 0;
        
        function updateGradient() {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            const scrollDelta = scrollY - lastScrollY;
            scrollVelocity = scrollDelta * 0.3;
            lastScrollY = scrollY;
            
            // Calculate gradient position based on scroll
            const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            const scrollProgress = Math.min(scrollY / maxScroll, 1);
            
            // Simple but effective movement patterns
            const x1 = 20 + scrollProgress * 40 + Math.sin(scrollProgress * Math.PI * 2) * 15;
            const y1 = 30 + Math.cos(scrollProgress * Math.PI * 2) * 20;
            const x2 = 80 - scrollProgress * 40 + Math.cos(scrollProgress * Math.PI * 2.5) * 12;
            const y2 = 70 + Math.sin(scrollProgress * Math.PI * 2.5) * 18;
            const x3 = 50 + Math.sin(scrollProgress * Math.PI * 4) * 10;
            const y3 = 50 + Math.cos(scrollProgress * Math.PI * 4) * 10;
            
            // Update CSS variables
            gradientBg.style.setProperty('--gradient-x', `${x1}%`);
            gradientBg.style.setProperty('--gradient-y', `${y1}%`);
            gradientBg.style.setProperty('--gradient-x2', `${x2}%`);
            gradientBg.style.setProperty('--gradient-y2', `${y2}%`);
            gradientBg.style.setProperty('--gradient-x3', `${x3}%`);
            gradientBg.style.setProperty('--gradient-y3', `${y3}%`);
            
            // Subtle rotation based on scroll velocity
            const rotation = Math.max(-1, Math.min(1, scrollVelocity * 0.1));
            gradientBg.style.setProperty('--gradient-rotation', `${rotation}deg`);
        }
        
        // Mouse move for hover effect
        let targetX = 0;
        let targetY = 0;
        
        document.addEventListener('mousemove', (e) => {
            targetX = (e.clientX / window.innerWidth - 0.5) * 15;
            targetY = (e.clientY / window.innerHeight - 0.5) * 15;
        });
        
        // Smooth hover position update
        let hoverX = 0;
        let hoverY = 0;
        
        function updateHoverPosition() {
            if (gradientBg.matches(':hover')) {
                hoverX += (targetX - hoverX) * 0.15;
                hoverY += (targetY - hoverY) * 0.15;
                gradientBg.style.setProperty('--hover-x', `${hoverX}px`);
                gradientBg.style.setProperty('--hover-y', `${hoverY}px`);
            } else {
                hoverX *= 0.9;
                hoverY *= 0.9;
                gradientBg.style.setProperty('--hover-x', `${hoverX}px`);
                gradientBg.style.setProperty('--hover-y', `${hoverY}px`);
            }
            
            requestAnimationFrame(updateHoverPosition);
        }
        updateHoverPosition();
        
        // Scroll event with proper throttling
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateGradient();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        
        // Initial update
        setTimeout(() => {
            updateGradient();
        }, 100);
    }
    
    setupGradientScroll();
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

    // About section with scroll-based glitch effect
    function setupAboutAnimation() {
        const aboutSection = document.querySelector('.about');
        const originalText = document.querySelector('.about-text');
        const glitchText = document.querySelector('.about-text-glitch');
        
        if (!aboutSection || !originalText || !glitchText) {
            console.error('About animation setup failed - missing elements:', {
                aboutSection: !!aboutSection,
                originalText: !!originalText,
                glitchText: !!glitchText
            });
            return;
        }
        
        console.log('About animation setup - elements found');
        
        const text = originalText.textContent;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        let animationComplete = false;
        
        // Initialize text with random characters
        function initializeText() {
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
            glitchText.style.opacity = '1';
        }
        
        initializeText();
        const spans = glitchText.querySelectorAll('span');
        
        // Make spans visible with random chars initially
        spans.forEach((span) => {
            span.style.opacity = '0.6';
        });
        
        // Check if all characters are correctly resolved
        function isAnimationComplete() {
            let allResolved = true;
            spans.forEach((span) => {
                const targetChar = span.getAttribute('data-char');
                const currentChar = span.textContent;
                const isLocked = span.getAttribute('data-locked') === 'true';
                
                if (currentChar !== targetChar || !isLocked) {
                    allResolved = false;
                }
            });
            return allResolved;
        }
        
        // Update glitch animation based on scroll progress
        function updateGlitch(progress) {
            // Clamp progress between 0 and 1
            progress = Math.max(0, Math.min(1, progress));
            
            // Calculate how many characters should be resolved
            const totalChars = spans.length;
            const resolvedCount = Math.floor(progress * totalChars);
            
            let changed = 0;
            
            // Update each character
            spans.forEach((span, index) => {
                const targetChar = span.getAttribute('data-char');
                const spanLocked = span.getAttribute('data-locked') === 'true';
                
                if (index < resolvedCount) {
                    // Character should be resolved
                    if (span.textContent !== targetChar) {
                        span.textContent = targetChar;
                        changed++;
                    }
                    span.style.opacity = '1';
                    span.setAttribute('data-locked', 'true');
                } else {
                    // Character should still be glitching
                    if (spanLocked) {
                        span.setAttribute('data-locked', 'false');
                    }
                    // Randomly change glitch character more frequently
                    if (Math.random() < 0.4) {
                        const newChar = characters[Math.floor(Math.random() * characters.length)];
                        if (span.textContent !== newChar) {
                            span.textContent = newChar;
                            changed++;
                        }
                    }
                    span.style.opacity = '0.6';
                }
            });
            
            // When progress reaches 1, force ALL characters to be correct
            if (progress >= 1) {
                spans.forEach((span) => {
                    const targetChar = span.getAttribute('data-char');
                    if (span.textContent !== targetChar) {
                        span.textContent = targetChar;
                        changed++;
                    }
                    span.style.opacity = '1';
                    span.setAttribute('data-locked', 'true');
                });
                
                if (!animationComplete) {
                    animationComplete = true;
                    console.log('✅ Animation complete!');
                }
            }
            
            // Debug: log if characters changed
            if (changed > 0 && progress > 0 && progress < 1) {
                console.log(`📝 Updated ${changed} characters, progress: ${(progress * 100).toFixed(1)}%, resolved: ${resolvedCount}/${totalChars}`);
            }
        }
        
        // GSAP ScrollTrigger Approach - Reliable and proven
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            
            // Make section visible
            aboutSection.classList.add('visible');
            glitchText.style.opacity = '1';
            
            // Animation should start when text reaches viewport center (where sticky activates)
            // The text is sticky at top: 50vh, so we need to wait until it's actually at center
            const animationDistance = 3500;
            
            // Use the glitchText element itself as the trigger
            // Start when the text's center reaches the viewport center (50vh)
            ScrollTrigger.create({
                trigger: glitchText,
                start: 'center center', // Start when text center is at viewport center
                end: () => `+=${animationDistance}`, // Continue for 3500px of scroll
                scrub: true, // Smooth animation tied to scroll
                onUpdate: (self) => {
                    // self.progress goes from 0 to 1 as you scroll through the trigger area
                    const progress = self.progress;
                    
                    // Update glitch animation based on scroll progress
                    updateGlitch(progress);
                    
                    // Force complete when at the end
                    if (progress >= 1) {
                        updateGlitch(1);
                    }
                },
                onEnter: () => {
                    console.log('✅ Animation STARTED - Text at center');
                },
                onLeave: () => {
                    console.log('Animation complete');
                    updateGlitch(1);
                }
            });
            
            console.log('GSAP ScrollTrigger initialized for About section');
        } else {
            console.error('GSAP or ScrollTrigger not loaded! Using fallback.');
            // Fallback to basic scroll handler
            window.addEventListener('scroll', () => {
                const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                const textRect = glitchText.getBoundingClientRect();
                const sectionRect = aboutSection.getBoundingClientRect();
                
                if (sectionRect.top < window.innerHeight && sectionRect.bottom > 0) {
                    aboutSection.classList.add('visible');
                    glitchText.style.opacity = '1';
                    
                    const windowHeight = window.innerHeight;
                    const expectedCenter = windowHeight * 0.5;
                    const textTop = textRect.top;
                    const distanceFromCenter = Math.abs(textTop - expectedCenter);
                    
                    // Simple progress calculation
                    const sectionProgress = Math.max(0, Math.min(1, 
                        (window.innerHeight - sectionRect.top) / (sectionRect.height + window.innerHeight)
                    ));
                    
                    updateGlitch(sectionProgress);
                }
            }, { passive: true });
        }
    }

    // Bouncing Horizontal Scroll (2D, bounces at ends)
    function setupProjectsBounce() {
        const scroller = document.querySelector('.projects-scroller');
        if (!scroller) return;
        
        // Check for reduced motion preference
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            addBounceAnimation();
        }
        
        function addBounceAnimation() {
            const scrollerInner = scroller.querySelector('.projects-scroller__inner');
            if (!scrollerInner) return;
            
            // Wait for layout to calculate widths
            setTimeout(() => {
                // Calculate the total width of all items
                const items = Array.from(scrollerInner.children);
                let totalWidth = 0;
                items.forEach((item, index) => {
                    totalWidth += item.offsetWidth;
                    if (index < items.length - 1) {
                        totalWidth += 32; // gap size (2rem = 32px)
                    }
                });
                
                // Calculate how far we need to scroll to show the last item
                const containerWidth = scroller.clientWidth;
                const maxScroll = Math.max(0, totalWidth - containerWidth);
                
                // Add animated attribute
                scroller.setAttribute("data-animated", true);
                
                // Remove any existing custom style
                const existingStyle = document.getElementById('projects-bounce-style');
                if (existingStyle) existingStyle.remove();
                
                const baseDuration = 20; // seconds
                
                // Create custom animation that bounces between start and end
                const style = document.createElement('style');
                style.id = 'projects-bounce-style';
                style.textContent = `
                    .projects-scroller[data-animated="true"] .projects-scroller__inner {
                        animation: scrollProjectsBounceExact ${baseDuration}s ease-in-out infinite !important;
                        animation-play-state: running !important;
                        animation-play-rate: 1;
                    }
                    @keyframes scrollProjectsBounceExact {
                        0%, 100% {
                            transform: translateX(0);
                        }
                        50% {
                            transform: translateX(-${maxScroll}px);
                        }
                    }
                `;
                document.head.appendChild(style);
                
                // Smoothly transition animation speed on hover
                let currentPlayRate = 1;
                let targetPlayRate = 1;
                let animationFrameId = null;
                
                function updatePlayRate() {
                    const animation = scrollerInner.getAnimations()[0];
                    if (animation) {
                        // Smoothly interpolate to target rate
                        currentPlayRate += (targetPlayRate - currentPlayRate) * 0.15;
                        
                        // Stop when close enough
                        if (Math.abs(currentPlayRate - targetPlayRate) < 0.01) {
                            currentPlayRate = targetPlayRate;
                            if (animationFrameId) {
                                cancelAnimationFrame(animationFrameId);
                                animationFrameId = null;
                            }
                        } else {
                            animationFrameId = requestAnimationFrame(updatePlayRate);
                        }
                        
                        animation.playbackRate = currentPlayRate;
                    }
                }
                
                scroller.addEventListener('mouseenter', () => {
                    targetPlayRate = 0.2; // 5x slower
                    if (!animationFrameId) {
                        updatePlayRate();
                    }
                });
                
                scroller.addEventListener('mouseleave', () => {
                    targetPlayRate = 1;
                    if (!animationFrameId) {
                        updatePlayRate();
                    }
                });
                
                console.log('Projects bouncing scroll initialized - max scroll:', maxScroll, 'px, total width:', totalWidth, 'px, items:', items.length);
            }, 100);
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

    console.log('DOMContentLoaded - Starting animations...');
    
    animateHero();
    
    console.log('Setting up about animation...');
    setupAboutAnimation();
    
    setupSlideAnimations();
    
    // Initialize projects bouncing scroll
    setTimeout(() => {
        setupProjectsBounce();
    }, 500);
    
    console.log('All animations setup complete');
});

