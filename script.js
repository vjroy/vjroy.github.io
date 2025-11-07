// Number Ticker - Vanilla JS implementation
class NumberTicker {
    constructor(element, options = {}) {
        this.element = element;
        this.value = options.value || 100;
        this.startValue = options.startValue || 0;
        this.duration = options.duration || 2000;
        this.delay = options.delay || 0;
        this.decimalPlaces = options.decimalPlaces || 0;
        this.onComplete = options.onComplete || null;
        
        this.currentValue = this.startValue;
        this.startTime = null;
        this.animationFrame = null;
        this.isAnimating = false;
    }
    
    start() {
        if (this.isAnimating) return;
        
        setTimeout(() => {
            this.isAnimating = true;
            this.startTime = performance.now();
            this.animate();
        }, this.delay);
    }
    
    animate() {
        const elapsed = performance.now() - this.startTime;
        const progress = Math.min(elapsed / this.duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        this.currentValue = this.startValue + (this.value - this.startValue) * easeOut;
        
        // Format and display
        const formatted = this.currentValue.toFixed(this.decimalPlaces);
        this.element.textContent = Intl.NumberFormat("en-US", {
            minimumFractionDigits: this.decimalPlaces,
            maximumFractionDigits: this.decimalPlaces,
        }).format(Number(formatted));
        
        if (progress < 1) {
            this.animationFrame = requestAnimationFrame(() => this.animate());
        } else {
            this.isAnimating = false;
            if (this.onComplete) {
                this.onComplete();
            }
        }
    }
    
    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.isAnimating = false;
        }
    }
}

// Blur Fade Animation - Vanilla JS implementation
function blurFadeIn(element, options = {}) {
    const {
        duration = 0.4,
        delay = 0,
        offset = 6,
        direction = 'down',
        blur = '6px'
    } = options;
    
    // Set initial state
    const isHorizontal = direction === 'left' || direction === 'right';
    const startValue = direction === 'right' || direction === 'down' ? -offset : offset;
    
    element.style.opacity = '0';
    element.style.filter = `blur(${blur})`;
    element.style.transform = isHorizontal 
        ? `translateX(${startValue}px)` 
        : `translateY(${startValue}px)`;
    element.style.transition = 'none';
    // Ensure pointer events are enabled
    element.style.pointerEvents = 'auto';
    
    // Force reflow
    element.offsetHeight;
    
    // Animate to visible state
    setTimeout(() => {
        element.style.transition = `opacity ${duration}s ease-out, filter ${duration}s ease-out, transform ${duration}s ease-out`;
        element.style.opacity = '1';
        element.style.filter = 'blur(0px)';
        element.style.transform = isHorizontal ? 'translateX(0)' : 'translateY(0)';
        // Ensure pointer events remain enabled after animation
        element.style.pointerEvents = 'auto';
    }, delay * 1000);
}

// Loading Screen
function setupLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const numberTicker = document.getElementById('number-ticker');
    
    if (!loadingScreen || !numberTicker) return;
    
    // Make sure all content is visible from the start (behind loading screen)
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.classList.add('visible');
        hero.style.opacity = '1';
        hero.style.visibility = 'visible';
    }
    
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
        mainContainer.style.opacity = '1';
        mainContainer.style.visibility = 'visible';
    }
    
    // Create number ticker instance
    const ticker = new NumberTicker(numberTicker, {
        value: 100,
        startValue: 0,
        duration: 2000,
        delay: 0,
        decimalPlaces: 0,
        onComplete: () => {
            // Start blur fade out animation
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                
                // Start blur fade in content 0.1s after loading screen starts fading
                setTimeout(() => {
                    // Blur fade in hero content
                    const heroContent = document.querySelector('.hero-content');
                    if (heroContent) {
                        blurFadeIn(heroContent, {
                            duration: 0.6,
                            delay: 0.1,
                            offset: 20,
                            direction: 'up',
                            blur: '10px'
                        });
                    }
                    
                    // Blur fade in profile image
                    const profileWrapper = document.querySelector('.profile-img-wrapper');
                    if (profileWrapper) {
                        blurFadeIn(profileWrapper, {
                            duration: 0.6,
                            delay: 0.2,
                            offset: 20,
                            direction: 'up',
                            blur: '10px'
                        });
                    }
                    
                    // Blur fade in name
                    const heroName = document.querySelector('.hero-name');
                    if (heroName) {
                        blurFadeIn(heroName, {
                            duration: 0.5,
                            delay: 0.3,
                            offset: 15,
                            direction: 'up',
                            blur: '8px'
                        });
                    }
                    
                    // Blur fade in title
                    const heroTitle = document.querySelector('.hero-title');
                    if (heroTitle) {
                        blurFadeIn(heroTitle, {
                            duration: 0.5,
                            delay: 0.4,
                            offset: 15,
                            direction: 'up',
                            blur: '8px'
                        });
                    }
                    
                    // Blur fade in email
                    const heroEmail = document.querySelector('.hero-email');
                    if (heroEmail) {
                        blurFadeIn(heroEmail, {
                            duration: 0.5,
                            delay: 0.5,
                            offset: 15,
                            direction: 'up',
                            blur: '8px'
                        });
                    }
                    
                    // Make dock visible and interactive AFTER loading screen is completely gone
                    // Wait a bit to ensure nothing is blocking it
                    setTimeout(() => {
                        const dock = document.querySelector('.dock');
                        const dockContainer = document.querySelector('.dock-container');
                        if (dock && dockContainer) {
                            // Make dock visible immediately with no animation
                            dock.style.opacity = '1';
                            dock.style.visibility = 'visible';
                            dock.style.pointerEvents = 'auto';
                            dock.style.transform = '';
                            dock.style.filter = 'none';
                            dock.style.transition = 'none';
                            dock.style.zIndex = '10000';
                            
                            dockContainer.style.opacity = '1';
                            dockContainer.style.visibility = 'visible';
                            dockContainer.style.pointerEvents = 'auto';
                            dockContainer.style.transform = '';
                            dockContainer.style.filter = 'none';
                            dockContainer.style.transition = 'none';
                            dockContainer.style.zIndex = '10000';
                            
                            // Ensure all icons and links are interactive
                            const dockIcons = dock.querySelectorAll('.dock-icon');
                            dockIcons.forEach(icon => {
                                icon.style.pointerEvents = 'auto';
                                icon.style.opacity = '1';
                                icon.style.visibility = 'visible';
                                icon.style.transform = '';
                                icon.style.filter = 'none';
                                icon.style.transition = 'none';
                                icon.style.zIndex = '10001';
                                
                                const link = icon.querySelector('a');
                                if (link) {
                                    link.style.pointerEvents = 'auto';
                                    link.style.cursor = 'pointer';
                                    link.style.opacity = '1';
                                    link.style.visibility = 'visible';
                                    link.style.transform = '';
                                    link.style.filter = 'none';
                                    link.style.transition = 'none';
                                    link.style.zIndex = '10002';
                                    link.style.position = 'relative';
                                }
                            });
                            
                            // Initialize dock animation after a small delay
                            setTimeout(() => {
                                setupDockAnimation();
                            }, 100);
                        }
                    }, 500); // Wait 500ms after loading screen is removed
                    
                    // Blur fade in spinning text
                    const spinningText = document.querySelector('.spinning-text');
                    if (spinningText) {
                        blurFadeIn(spinningText, {
                            duration: 0.6,
                            delay: 0.2,
                            offset: 20,
                            direction: 'up',
                            blur: '10px'
                        });
                    }
                }, 100);
                
                // Remove loading screen after animation completes
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    loadingScreen.style.visibility = 'hidden';
                    loadingScreen.style.opacity = '0';
                    loadingScreen.style.pointerEvents = 'none';
                    loadingScreen.style.zIndex = '-1';
                    document.body.style.overflow = '';
                }, 400);
            }, 300);
        }
    });
    
    // Prevent scrolling during loading
    document.body.style.overflow = 'hidden';
    
    // Start the ticker
    ticker.start();
}

// Simple slide-in animations
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles FIRST so background is ready
    // Particles Background - Magic UI style adapted for vanilla JS
    function setupParticles() {
        const particlesContainer = document.getElementById('particles-background');
        if (!particlesContainer) {
            console.error('Particles container not found!');
            return;
        }
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        particlesContainer.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Could not get canvas context');
            return;
        }
        
        // Configuration
        const config = {
            quantity: 100,
            staticity: 50,
            ease: 50,
            size: 0.8, // Doubled from 0.4
            color: '#000000', // Black particles on white background
            vx: 0,
            vy: 0
        };
        
        const dpr = window.devicePixelRatio || 1;
        let canvasSize = { w: 0, h: 0 };
        let mouse = { x: 0, y: 0 };
        let circles = [];
        let rafID = null;
        let resizeTimeout = null;
        
        // Convert hex to RGB
        function hexToRgb(hex) {
            hex = hex.replace('#', '');
            if (hex.length === 3) {
                hex = hex.split('').map(char => char + char).join('');
            }
            const hexInt = parseInt(hex, 16);
            const red = (hexInt >> 16) & 255;
            const green = (hexInt >> 8) & 255;
            const blue = hexInt & 255;
            return [red, green, blue];
        }
        
        const rgb = hexToRgb(config.color);
        
        // Circle parameters
        function circleParams() {
            const x = Math.floor(Math.random() * canvasSize.w);
            const y = Math.floor(Math.random() * canvasSize.h);
            const translateX = 0;
            const translateY = 0;
            const pSize = Math.floor(Math.random() * 4) + config.size; // Doubled variation (0-4 instead of 0-2)
            const alpha = 0;
            const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
            const dx = (Math.random() - 0.5) * 0.1;
            const dy = (Math.random() - 0.5) * 0.1;
            const magnetism = 0.1 + Math.random() * 4;
            
            return {
                x, y, translateX, translateY, size: pSize,
                alpha, targetAlpha, dx, dy, magnetism
            };
        }
        
        // Draw circle
        function drawCircle(circle, update = false) {
            const { x, y, translateX, translateY, size, alpha } = circle;
            ctx.translate(translateX, translateY);
            ctx.beginPath();
            ctx.arc(x, y, size, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(${rgb.join(', ')}, ${alpha})`;
            ctx.fill();
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            
            if (!update) {
                circles.push(circle);
            }
        }
        
        // Clear context
        function clearContext() {
            ctx.clearRect(0, 0, canvasSize.w, canvasSize.h);
        }
        
        // Resize canvas
        function resizeCanvas() {
            canvasSize.w = particlesContainer.offsetWidth;
            canvasSize.h = particlesContainer.offsetHeight;
            
            canvas.width = canvasSize.w * dpr;
            canvas.height = canvasSize.h * dpr;
            canvas.style.width = `${canvasSize.w}px`;
            canvas.style.height = `${canvasSize.h}px`;
            ctx.scale(dpr, dpr);
            
            circles = [];
            for (let i = 0; i < config.quantity; i++) {
                const circle = circleParams();
                drawCircle(circle);
            }
        }
        
        // Mouse move handler
        function onMouseMove(e) {
            const rect = canvas.getBoundingClientRect();
            const { w, h } = canvasSize;
            const x = e.clientX - rect.left - w / 2;
            const y = e.clientY - rect.top - h / 2;
            const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
            if (inside) {
                mouse.x = x;
                mouse.y = y;
            }
        }
        
        // Remap value
        function remapValue(value, start1, end1, start2, end2) {
            const remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
            return remapped > 0 ? remapped : 0;
        }
        
        // Animate
        function animate() {
            clearContext();
            
            circles.forEach((circle, i) => {
                // Handle alpha value
                const edge = [
                    circle.x + circle.translateX - circle.size,
                    canvasSize.w - circle.x - circle.translateX - circle.size,
                    circle.y + circle.translateY - circle.size,
                    canvasSize.h - circle.y - circle.translateY - circle.size
                ];
                const closestEdge = edge.reduce((a, b) => Math.min(a, b));
                const remapClosestEdge = parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2));
                
                if (remapClosestEdge > 1) {
                    circle.alpha += 0.02;
                    if (circle.alpha > circle.targetAlpha) {
                        circle.alpha = circle.targetAlpha;
                    }
                } else {
                    circle.alpha = circle.targetAlpha * remapClosestEdge;
                }
                
                circle.x += circle.dx + config.vx;
                circle.y += circle.dy + config.vy;
                circle.translateX += (mouse.x / (config.staticity / circle.magnetism) - circle.translateX) / config.ease;
                circle.translateY += (mouse.y / (config.staticity / circle.magnetism) - circle.translateY) / config.ease;
                
                drawCircle(circle, true);
                
                // Circle gets out of canvas
                if (circle.x < -circle.size || circle.x > canvasSize.w + circle.size ||
                    circle.y < -circle.size || circle.y > canvasSize.h + circle.size) {
                    circles.splice(i, 1);
                    const newCircle = circleParams();
                    drawCircle(newCircle);
                }
            });
            
            rafID = requestAnimationFrame(animate);
        }
        
        // Initialize
        function init() {
            resizeCanvas();
            animate();
        }
        
        // Event listeners
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('resize', () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                resizeCanvas();
            }, 200);
        });
        
        // Initialize
        init();

        console.log('Particles background initialized');
    }
    
    setupParticles();
    
    // Setup loading screen AFTER particles are initialized
    setupLoadingScreen();
    
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
    // Text Reveal - Magic UI style adapted for vanilla JS
    function setupAboutAnimation() {
        const aboutSection = document.querySelector('.about');
        if (!aboutSection) return;
        
        const revealText = document.querySelector('.about-text-reveal');
        if (!revealText) return;
        
        const aboutText = document.querySelector('.about-text');
        if (!aboutText) return;
        
        const targetText = aboutText.textContent.trim();
        
        // Split text into words for text reveal animation
        revealText.innerHTML = '';
        const words = targetText.split(' ');
        
        words.forEach((word, index) => {
            const wordWrapper = document.createElement('span');
            wordWrapper.className = 'reveal-word-wrapper';
            
            const actualSpan = document.createElement('span');
            actualSpan.className = 'reveal-word-actual';
            
            const textNode = document.createTextNode(word);
            actualSpan.appendChild(textNode);
            wordWrapper.appendChild(actualSpan);
            revealText.appendChild(wordWrapper);
            
            if (index < words.length - 1) {
                revealText.appendChild(document.createTextNode(' '));
            }
        });
        
        // GSAP ScrollTrigger for split text animation with smooth transitions
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            
            // Make section visible
            aboutSection.classList.add('visible');
            
            // Animation only happens during sticky period
            // Reduced distance so animation completes faster - each scroll has more weight
            const animationDistance = 600; // Shorter distance doubles reveal speed
            const wordElements = revealText.querySelectorAll('.reveal-word-actual');
            
            // Text reveal - starts when sticky, ends when animation completes
            wordElements.forEach((wordEl, index) => {
                // Distribute words evenly across the animation distance
                const start = index / words.length;
                const end = start + (1 / words.length);
                
                ScrollTrigger.create({
                    trigger: aboutSection,
                    start: 'top 60%', // starts exactly when element becomes sticky
                    end: `+=${animationDistance}`, // Shorter distance = faster completion
                    scrub: true,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        const wordProgress = Math.max(0, Math.min(1, (progress - start) / (end - start)));
                        
                        const baseOpacity = 0.25;
                        const maxOpacity = 1;
                        const computedOpacity = baseOpacity + (maxOpacity - baseOpacity) * wordProgress;
                        wordEl.style.opacity = computedOpacity;
                        
                        const minWeight = 300;
                        const maxWeight = 700;
                        const computedWeight = Math.round(minWeight + (maxWeight - minWeight) * wordProgress);
                        wordEl.style.fontWeight = computedWeight;
                    }
                });
            });
            
            console.log('Text reveal animation initialized with', words.length, 'words');
        } else {
            console.error('GSAP or ScrollTrigger not loaded!');
        }
    }

    // Magic UI Marquee - exact implementation adapted for vanilla JS
    function setupProjectsBounce() {
        const scroller = document.querySelector('.projects-scroller');
        if (!scroller) return;
        
        // Check for reduced motion preference
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }
        
        const scrollerInner = scroller.querySelector('.projects-scroller__inner');
        if (!scrollerInner) return;
        
        // Wait for layout to ensure items are rendered
        setTimeout(() => {
            // Get all original items (project-tilt-container elements)
            const originalItems = Array.from(scrollerInner.querySelectorAll('.project-tilt-container'));
            if (originalItems.length === 0) {
                console.warn('No project items found');
                return;
            }
            
            // Check if already set up
            if (scroller.getAttribute('data-marquee-setup') === 'true') {
                return;
            }
            
            const innerStyles = window.getComputedStyle(scrollerInner);
            const gapValue = parseFloat(innerStyles.columnGap || innerStyles.gap || '0');
            const itemWidths = originalItems.map(item => {
                const rect = item.getBoundingClientRect();
                return rect.width || item.offsetWidth || 0;
            });
            const baseGroupWidth = itemWidths.reduce((sum, width) => sum + width, 0) + gapValue * Math.max(0, originalItems.length - 1);
            const viewportWidth = window.innerWidth;
            const duplicationFactor = Math.max(1, Math.ceil(viewportWidth / baseGroupWidth));
            const groupWidth = baseGroupWidth * duplicationFactor;
            const repeatCount = Math.max(3, Math.ceil((viewportWidth * 2) / groupWidth));
            
            // Clear the inner container
            scrollerInner.innerHTML = '';
            
            // Magic UI approach: wrap items in marquee groups
            for (let i = 0; i < repeatCount; i++) {
                // Create a wrapper div for this copy (like Magic UI does)
                const marqueeGroup = document.createElement('div');
                marqueeGroup.className = 'marquee-group';
                
                for (let copyIndex = 0; copyIndex < duplicationFactor; copyIndex++) {
                    originalItems.forEach(item => {
                        const clone = item.cloneNode(true);
                        // Make sure cloned items are visible
                        const projectItem = clone.querySelector('.project-item');
                        if (projectItem) {
                            projectItem.classList.add('slide-in');
                            projectItem.style.opacity = '1';
                        }
                        marqueeGroup.appendChild(clone);
                    });
                }
                
                scrollerInner.appendChild(marqueeGroup);
            }
            
            // Mark as set up
            scroller.setAttribute('data-marquee-setup', 'true');
            
            // Add animated attribute to trigger CSS animation
            scroller.setAttribute("data-animated", "true");
            
            console.log('Magic UI marquee initialized - items:', originalItems.length, 'base width:', baseGroupWidth, 'duplicationFactor:', duplicationFactor, 'final group width:', groupWidth, 'viewport:', viewportWidth, 'groups:', repeatCount);
        }, 200);
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
    
    // Setup smooth cursor
    setupSmoothCursor();
    
    animateHero();
    
    console.log('Setting up about animation...');
    setupAboutAnimation();
    
    setupSlideAnimations();
    
    // Initialize spinning text after a delay to ensure profile image is rendered
    setTimeout(() => {
        setupSpinningText();
    }, 500);
    
    // Initialize projects bouncing scroll
    setTimeout(() => {
        setupProjectsBounce();
    }, 500);
    
    // Initialize dock animation - but only once, will be re-initialized after loading screen
    // Don't call it here to avoid double initialization
    
    console.log('All animations setup complete');
});

// Spinning Text - Magic UI style adapted for vanilla JS
function setupSpinningText() {
    const spinningTextEl = document.querySelector('.spinning-text');
    if (!spinningTextEl) {
        console.warn('Spinning text element not found');
        return;
    }
    
    const text = spinningTextEl.getAttribute('data-text') || 'run • think • build • repeat •';
    const letters = text.split('');
    
    // Get profile image size to calculate proper radius
    const profileImg = document.querySelector('.profile-img-wrapper');
    let profileSize = 180; // Default to 180px
    
    if (profileImg) {
        // Wait for image to be rendered and get actual size
        const rect = profileImg.getBoundingClientRect();
        profileSize = rect.width || profileImg.offsetWidth || 180;
    }
    
    // Match the old orbiting icons radius (120px from center)
    // This was the radius used for the orbit circle icons
    const radiusPx = 120;
    
    // Clear any existing content
    spinningTextEl.innerHTML = '';
    
    // Force visibility - ensure it stays visible
    spinningTextEl.style.opacity = '1';
    spinningTextEl.style.visibility = 'visible';
    spinningTextEl.style.display = 'flex';
    spinningTextEl.style.pointerEvents = 'none'; // Don't interfere with interactions
    
    // Create a letter element for each character
    letters.forEach((letter, index) => {
        const letterEl = document.createElement('span');
        letterEl.className = 'letter';
        letterEl.textContent = letter;
        letterEl.setAttribute('aria-hidden', 'true');
        
        // Calculate angle for this letter (360 degrees divided by total letters)
        const totalLetters = letters.length;
        const angle = (360 / totalLetters) * index;
        
        // Position letter in circle using pixels for precise radius
        letterEl.style.setProperty('--index', index);
        letterEl.style.setProperty('--total', totalLetters);
        letterEl.style.setProperty('--radius', radiusPx);
        
        // Transform: translate to center, rotate to position, then translate outward
        letterEl.style.transform = `
            translate(-50%, -50%)
            rotate(${angle}deg)
            translateY(-${radiusPx}px)
        `;
        letterEl.style.transformOrigin = 'center';
        letterEl.style.opacity = '1';
        letterEl.style.visibility = 'visible';
        letterEl.style.pointerEvents = 'none';
        
        spinningTextEl.appendChild(letterEl);
    });
    
    // Ensure container stays visible
    const container = spinningTextEl.closest('.spinning-text-container');
    if (container) {
        container.style.opacity = '1';
        container.style.visibility = 'visible';
    }
    
    console.log('Spinning text initialized with', letters.length, 'characters, radius:', radiusPx, 'px, profile size:', profileSize, 'px');
}

// Dock Animation - Completely novel approach using event delegation
let dockInitialized = false;

function setupDockAnimation() {
    // Prevent double initialization
    if (dockInitialized) {
        return;
    }
    
    const dockContainer = document.querySelector('.dock-container');
    const dock = document.querySelector('.dock');
    
    if (!dockContainer || !dock) {
        console.warn('Dock container or dock not found');
        return;
    }
    
    console.log('Setting up dock with novel approach');
    dockInitialized = true;
    
    // CRITICAL: Remove ALL existing event listeners by cloning
    const newContainer = dockContainer.cloneNode(true);
    dockContainer.parentNode.replaceChild(newContainer, dockContainer);
    
    // Get fresh references
    const freshContainer = document.querySelector('.dock-container');
    const freshDock = freshContainer.querySelector('.dock');
    const freshIcons = freshDock.querySelectorAll('.dock-icon');
    
    if (!freshContainer || !freshDock || freshIcons.length === 0) {
        console.error('Failed to get fresh dock elements');
        return;
    }
    
    // Force all styles with maximum priority
    freshContainer.style.cssText = `
        pointer-events: auto !important;
        z-index: 99999 !important;
        position: relative !important;
        opacity: 1 !important;
        visibility: visible !important;
    `;
    
    freshDock.style.cssText = `
        pointer-events: auto !important;
        z-index: 99999 !important;
        position: relative !important;
        opacity: 1 !important;
        visibility: visible !important;
    `;
    
    // Setup each icon
    freshIcons.forEach((icon, index) => {
        icon.style.cssText = `
            pointer-events: auto !important;
            z-index: 1000000 !important;
            position: relative !important;
            cursor: pointer !important;
            opacity: 1 !important;
            visibility: visible !important;
            isolation: isolate !important;
        `;
        
        const link = icon.querySelector('a');
        if (link) {
            link.style.cssText = `
                pointer-events: auto !important;
                cursor: pointer !important;
                z-index: 1000001 !important;
                position: relative !important;
                display: flex !important;
                width: 100% !important;
                height: 100% !important;
                align-items: center !important;
                justify-content: center !important;
                opacity: 1 !important;
                visibility: visible !important;
                isolation: isolate !important;
            `;
            
            // Direct onclick handler - most reliable
            link.onclick = function(e) {
                console.log('LINK CLICKED:', this.href);
                window.open(this.href, this.target || '_self');
                return false;
            };
        }
    });
    
    // Test if ANY events are reaching the dock - check coordinates
    document.addEventListener('click', function(e) {
        const clickedElement = document.elementFromPoint(e.clientX, e.clientY);
        
        // Get dock container bounds
        const dockRect = freshContainer.getBoundingClientRect();
        const isInDockArea = e.clientX >= dockRect.left && 
                             e.clientX <= dockRect.right && 
                             e.clientY >= dockRect.top && 
                             e.clientY <= dockRect.bottom;
        
        if (isInDockArea) {
            console.log('CLICK IS IN DOCK AREA!');
            console.log('Clicked element:', clickedElement);
            console.log('Dock container:', freshContainer);
            
            // Prevent the about section from intercepting
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            // Find ALL links in the dock and determine which one was clicked
            const allLinks = freshContainer.querySelectorAll('a');
            console.log('Found', allLinks.length, 'links in dock');
            
            // Find which link was actually clicked based on position
            let clickedLink = null;
            allLinks.forEach(link => {
                const linkRect = link.getBoundingClientRect();
                if (e.clientX >= linkRect.left && e.clientX <= linkRect.right &&
                    e.clientY >= linkRect.top && e.clientY <= linkRect.bottom) {
                    clickedLink = link;
                }
            });
            
            if (clickedLink) {
                console.log('FOUND CLICKED LINK:', clickedLink.href);
                e.preventDefault();
                window.open(clickedLink.href, clickedLink.target || '_self');
                return false;
            }
            
            // Fallback: try to find link from clicked element
            const linkFromClick = clickedElement?.closest('a');
            if (linkFromClick && freshContainer.contains(linkFromClick)) {
                console.log('FOUND LINK FROM CLICK:', linkFromClick.href);
                e.preventDefault();
                window.open(linkFromClick.href, linkFromClick.target || '_self');
                return false;
            }
        }
    }, true);
    
    // Use event delegation on the container - most reliable approach
    freshContainer.addEventListener('mouseenter', function(e) {
        console.log('Container mouse enter');
    }, true);
    
    freshContainer.addEventListener('click', function(e) {
        console.log('Container clicked - event reached!');
        const link = e.target.closest('a');
        if (link) {
            console.log('Found link in container click:', link.href);
            e.preventDefault();
            e.stopPropagation();
            window.open(link.href, link.target || '_self');
        }
    }, true);
    
    // Also try mousedown/up
    freshContainer.addEventListener('mousedown', function(e) {
        console.log('Container mousedown');
    }, true);
    
    freshContainer.addEventListener('mouseup', function(e) {
        console.log('Container mouseup');
    }, true);
    
    // Simple hover effect using event delegation
    freshDock.addEventListener('mouseover', function(e) {
        const icon = e.target.closest('.dock-icon');
        if (icon) {
            console.log('Icon hovered');
            icon.style.transform = 'scale(1.5) translateY(-8px)';
            icon.style.transition = 'transform 0.2s ease';
        }
    }, true);
    
    freshDock.addEventListener('mouseout', function(e) {
        const icon = e.target.closest('.dock-icon');
        if (icon) {
            icon.style.transform = 'scale(1) translateY(0)';
        }
    }, true);
    
    // Also attach directly to each icon as backup
    freshIcons.forEach((icon, index) => {
        icon.addEventListener('mouseenter', function() {
            console.log('Icon', index, 'mouseenter');
            this.style.transform = 'scale(1.5) translateY(-8px)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
        
        const link = icon.querySelector('a');
        if (link) {
            link.addEventListener('click', function(e) {
                console.log('Direct link click:', this.href);
                // Don't prevent default - let it work
            });
        }
    });
    
    console.log('Dock setup complete with', freshIcons.length, 'icons');
}

// Smooth Cursor - Physics-based cursor animation
function setupSmoothCursor() {
    const cursor = document.getElementById('smooth-cursor');
    if (!cursor) return;

    // Spring configuration
    const springConfig = {
        damping: 45,
        stiffness: 400,
        mass: 1,
        restDelta: 0.001,
    };

    const rotationSpringConfig = {
        damping: 60,
        stiffness: 300,
        mass: 1,
        restDelta: 0.001,
    };

    const scaleSpringConfig = {
        damping: 35,
        stiffness: 500,
        mass: 1,
        restDelta: 0.001,
    };

    // Spring physics implementation
    class Spring {
        constructor(value, config) {
            this.value = value;
            this.velocity = 0;
            this.target = value;
            this.config = config;
        }

        setTarget(target) {
            this.target = target;
        }

        update(deltaTime) {
            const delta = this.target - this.value;
            const springForce = delta * this.config.stiffness;
            const dampingForce = -this.velocity * this.config.damping;
            const acceleration = (springForce + dampingForce) / this.config.mass;

            this.velocity += acceleration * deltaTime;
            this.value += this.velocity * deltaTime;

            // Check if at rest
            if (Math.abs(delta) < this.config.restDelta && Math.abs(this.velocity) < this.config.restDelta) {
                this.value = this.target;
                this.velocity = 0;
            }

            return this.value;
        }
    }

    // Initialize springs
    const cursorX = new Spring(0, springConfig);
    const cursorY = new Spring(0, springConfig);
    const rotation = new Spring(0, rotationSpringConfig);
    const scale = new Spring(1, scaleSpringConfig);

    // State
    let lastMousePos = { x: 0, y: 0 };
    let velocity = { x: 0, y: 0 };
    let lastMouseUpdateTime = Date.now();
    let lastAnimationTime = Date.now();
    let previousAngle = 0;
    let accumulatedRotation = 0;
    let isMoving = false;
    let rafId = null;
    let animationFrameId = null;

    // Make cursor visible
    cursor.classList.add('visible');

    // Update velocity
    function updateVelocity(currentPos) {
        const currentTime = Date.now();
        const deltaTime = currentTime - lastMouseUpdateTime;

        if (deltaTime > 0) {
            velocity.x = (currentPos.x - lastMousePos.x) / deltaTime;
            velocity.y = (currentPos.y - lastMousePos.y) / deltaTime;
        }

        lastMouseUpdateTime = currentTime;
        lastMousePos = currentPos;
    }

    // Smooth mouse move handler
    function smoothMouseMove(e) {
        // Use clientX/clientY for viewport coordinates (works with fixed positioning)
        const currentPos = { x: e.clientX, y: e.clientY };
        updateVelocity(currentPos);

        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);

        cursorX.setTarget(currentPos.x);
        cursorY.setTarget(currentPos.y);

        if (speed > 0.1) {
            const currentAngle = Math.atan2(velocity.y, velocity.x) * (180 / Math.PI) + 90;

            let angleDiff = currentAngle - previousAngle;
            if (angleDiff > 180) angleDiff -= 360;
            if (angleDiff < -180) angleDiff += 360;

            accumulatedRotation += angleDiff;
            rotation.setTarget(accumulatedRotation);
            previousAngle = currentAngle;

            scale.setTarget(0.95);
            isMoving = true;

            clearTimeout(scale.timeout);
            scale.timeout = setTimeout(() => {
                scale.setTarget(1);
                isMoving = false;
            }, 150);
        }
    }
    
    // Also track mouse on scroll to keep cursor visible
    function handleScroll() {
        // Force cursor to stay visible during scroll
        if (cursor) {
            cursor.style.display = 'block';
            cursor.style.visibility = 'visible';
        }
    }

    // Throttled mouse move with RAF
    function throttledMouseMove(e) {
        if (rafId) return;

        rafId = requestAnimationFrame(() => {
            smoothMouseMove(e);
            rafId = null;
        });
    }

    // Animation loop
    function animate() {
        const currentTime = Date.now();
        const deltaTime = Math.min(0.033, (currentTime - lastAnimationTime) / 1000); // Cap at ~30ms (30fps minimum)
        lastAnimationTime = currentTime;

        const x = cursorX.update(deltaTime);
        const y = cursorY.update(deltaTime);
        const rot = rotation.update(deltaTime);
        const sc = scale.update(deltaTime);

        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
        cursor.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(${sc})`;

        animationFrameId = requestAnimationFrame(animate);
    }

    // Start animation loop
    animate();

    // Event listeners
    window.addEventListener('mousemove', throttledMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleScroll, { passive: true });

    // Cleanup function
    return () => {
        window.removeEventListener('mousemove', throttledMouseMove);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('wheel', handleScroll);
        if (rafId) cancelAnimationFrame(rafId);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
}


