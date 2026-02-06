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
    
    document.body.style.overflow = 'hidden';

    loadingScreen.style.display = 'flex';
    loadingScreen.style.opacity = '1';
    loadingScreen.style.visibility = 'visible';
    loadingScreen.style.pointerEvents = 'none';
    loadingScreen.classList.remove('fade-out');

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

                    document.dispatchEvent(new CustomEvent('loading-screen-complete'));
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
            size: 0.8,
            sizeVariance: 2.5,
            alphaMin: 1,
            alphaMax: 1,
            vx: 0,
            vy: 0,
            maxScale: Infinity,
            scrollStep: 120
        };

        // Black and white color palette
        const coldColors = [
            [0, 0, 0],       // Black
            [20, 20, 20],    // Very dark gray
            [40, 40, 40],    // Dark gray
            [60, 60, 60],    // Medium dark gray
            [80, 80, 80],    // Medium gray
            [120, 120, 120], // Medium light gray
            [160, 160, 160], // Light gray
            [200, 200, 200], // Very light gray
            [220, 220, 220], // Near white
            [240, 240, 240], // Almost white
            [250, 250, 250], // Very light gray
            [255, 255, 255]  // White
        ];

        let scrollScale = 1; // Always stay at 1, no scaling on scroll
        let fallbackUnits = 0;
        
        const dpr = window.devicePixelRatio || 1;
        let canvasSize = { w: 0, h: 0 };
        let mouse = { x: 0, y: 0 };
        let circles = [];
        let rafID = null;
        let resizeTimeout = null;
        const colorObservers = new Set();
        
        function subscribeColorObserver(fn) {
            if (typeof fn !== 'function') {
                return () => {};
            }
            colorObservers.add(fn);
            return () => {
                colorObservers.delete(fn);
            };
        }
        
        function notifyColorObservers() {
            if (!colorObservers.size) return;
            colorObservers.forEach(observer => {
                try {
                    observer();
                } catch (err) {
                    console.error('Particle color observer error:', err);
                }
            });
        }
        
        // Circle parameters
        function circleParams() {
            const x = Math.floor(Math.random() * canvasSize.w);
            const y = Math.floor(Math.random() * canvasSize.h);
            const translateX = 0;
            const translateY = 0;
            const baseSize = (Math.random() * config.sizeVariance) + config.size;
            const alpha = 0;
            const targetAlpha = config.alphaMax;
            const dx = (Math.random() - 0.5) * 0.1;
            const dy = (Math.random() - 0.5) * 0.1;
            const magnetism = 0.1 + Math.random() * 4;
            // Randomly assign a cold color to each particle
            const colorIndex = Math.floor(Math.random() * coldColors.length);
            const color = coldColors[colorIndex];
            
            return {
                x, y, translateX, translateY, baseSize,
                alpha, targetAlpha, dx, dy, magnetism, color
            };
        }
        
        // Draw circle
        function drawCircle(circle, update = false) {
            const { x, y, translateX, translateY, baseSize, alpha, color } = circle;
            const displaySize = baseSize * scrollScale;
            ctx.translate(translateX, translateY);
            ctx.beginPath();
            ctx.arc(x, y, displaySize, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(${color.join(', ')}, ${alpha})`;
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

        function populateCircles() {
            circles = [];
            clearContext();
            for (let i = 0; i < config.quantity; i++) {
                const circle = circleParams();
                drawCircle(circle);
            }
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

            populateCircles();
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
                const displaySize = circle.baseSize * scrollScale;
                const edge = [
                    circle.x + circle.translateX - displaySize,
                    canvasSize.w - circle.x - circle.translateX - displaySize,
                    circle.y + circle.translateY - displaySize,
                    canvasSize.h - circle.y - circle.translateY - displaySize
                ];
                const closestEdge = edge.reduce((a, b) => Math.min(a, b));
                const remapClosestEdge = parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2));
                
            circle.alpha = circle.targetAlpha;
                
                circle.x += circle.dx + config.vx;
                circle.y += circle.dy + config.vy;
                circle.translateX += (mouse.x / (config.staticity / circle.magnetism) - circle.translateX) / config.ease;
                circle.translateY += (mouse.y / (config.staticity / circle.magnetism) - circle.translateY) / config.ease;
                
                drawCircle(circle, true);
                
                // Circle gets out of canvas
                if (circle.x < -displaySize || circle.x > canvasSize.w + displaySize ||
                    circle.y < -displaySize || circle.y > canvasSize.h + displaySize) {
                    circles.splice(i, 1);
                    const newCircle = circleParams();
                    drawCircle(newCircle);
                }
            });
            
            notifyColorObservers();
            rafID = requestAnimationFrame(animate);
        }
        
        // Initialize
        function init() {
            resizeCanvas();
            animate();
        }

        function applyScrollScale() {
            // Disabled - keep scrollScale at 1
            scrollScale = 1;
        }

        function updateFallbackSteps(force = false, scrollPosition) {
            // Disabled - no scroll-based scaling
            scrollScale = 1;
        }

        applyScrollScale();
        updateFallbackSteps(true);
        
        function isPointDark(clientX, clientY) {
            const rect = canvas.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            
            if (x < 0 || y < 0 || x > canvasSize.w || y > canvasSize.h) {
                return false;
            }
            
            for (let i = 0; i < circles.length; i++) {
                const circle = circles[i];
                const radius = circle.baseSize * scrollScale;
                const cx = circle.x + circle.translateX;
                const cy = circle.y + circle.translateY;
                const dx = x - cx;
                const dy = y - cy;
                
                if ((dx * dx + dy * dy) <= radius * radius) {
                    return true;
                }
            }
            
            return false;
        }

        // Event listeners
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('resize', () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                resizeCanvas();
            }, 200);
        });
        // Removed scroll listener - no scaling on scroll
        // Initialize
        init();

        console.log('Particles background initialized');
        
        window.particleField = {
            isPointDark,
            subscribe: subscribeColorObserver
        };
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

    // About section: pin the card so it stays on screen while we scroll through the section; reveal characters with scroll progress.
    function setupAboutAnimation() {
        const aboutSection = document.querySelector('.about');
        const pinWrap = document.querySelector('.about-pin-wrap');
        const revealEl = document.querySelector('.about-text-reveal');
        const sourceEl = document.querySelector('.about-text');
        if (!aboutSection || !pinWrap || !revealEl || !sourceEl) return;

        const text = sourceEl.textContent.trim();
        revealEl.innerHTML = '';
        const chars = Array.from(text);
        const segments = [];

        chars.forEach((char) => {
            const wrap = document.createElement('span');
            wrap.className = 'reveal-char-wrapper';
            const span = document.createElement('span');
            span.className = 'reveal-char-actual' + (char === ' ' ? ' reveal-char-space' : '');
            span.textContent = char === ' ' ? '\u00A0' : char;
            wrap.appendChild(span);
            revealEl.appendChild(wrap);
            segments.push(span);
        });

        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);

        const total = segments.length;
        const bufferStart = 0.2;
        const bufferEnd = 0.75;

        function updateChars(progress) {
            segments.forEach((seg, i) => {
                const start = i / total;
                const end = (i + 1) / total;
                const t = Math.max(0, Math.min(1, (progress - start) / (end - start || 1)));
                seg.style.opacity = t;
                seg.style.fontWeight = Math.round(300 + 350 * t);
            });
        }

        // Pin the card wrapper so the card stays fixed on screen. Start when section top hits viewport top so the 100vh wrap centers the card at 50vh; end when section bottom hits viewport top.
        const st = ScrollTrigger.create({
            trigger: aboutSection,
            start: 'top top',
            end: 'bottom top',
            pin: pinWrap,
            pinSpacing: true,
            scrub: true,
            onUpdate(self) {
                let p = self.progress;
                if (p <= bufferStart) p = 0;
                else if (p >= bufferEnd) p = 1;
                else p = (p - bufferStart) / (bufferEnd - bufferStart);
                updateChars(p);
            }
        });

        if (st) {
            let p = st.progress;
            if (p <= bufferStart) p = 0;
            else if (p >= bufferEnd) p = 1;
            else p = (p - bufferStart) / (bufferEnd - bufferStart);
            updateChars(p);
        }
    }

    // Projects carousel: one card at a time with prev/next arrows
    function setupProjectsCarousel() {
        const carousel = document.querySelector('.projects-carousel');
        if (!carousel) return;

        const viewport = carousel.querySelector('.projects-carousel__viewport');
        const track = carousel.querySelector('.projects-carousel__track');
        const slides = Array.from(track?.children || []);
        const prevBtn = carousel.querySelector('.projects-carousel__nav--prev');
        const nextBtn = carousel.querySelector('.projects-carousel__nav--next');
        const counterCurrent = carousel.querySelector('.projects-carousel__counter .current');
        const counterTotal = carousel.querySelector('.projects-carousel__counter .total');

        if (!viewport || !track || slides.length === 0) return;

        const totalSlides = slides.length;
        let currentIndex = 0;

        track.style.width = `${totalSlides * 100}%`;
        slides.forEach((slide) => {
            slide.style.flex = `0 0 ${100 / totalSlides}%`;
            slide.style.width = `${100 / totalSlides}%`;
        });
        const typedSlides = new WeakSet();

        const runTypingAnimation = (slide) => {
            if (!slide || typedSlides.has(slide)) return;
            const titleElement = slide.querySelector('.project-title .typing-text');
            if (!titleElement) {
                typedSlides.add(slide);
                return;
            }
            const text = titleElement.getAttribute('data-text') || titleElement.textContent;
            if (!text) {
                typedSlides.add(slide);
                return;
            }
            typedSlides.add(slide);
            typeWriter(titleElement, text, 45, 0);
        };

        function goToSlide(index) {
            currentIndex = Math.max(0, Math.min(totalSlides - 1, index));
            const offsetPercent = (currentIndex * 100) / totalSlides;
            track.style.transform = `translate3d(-${offsetPercent}%, 0, 0)`;

            if (counterCurrent) counterCurrent.textContent = String(currentIndex + 1);
            if (counterTotal) counterTotal.textContent = String(totalSlides);

            if (prevBtn) prevBtn.disabled = currentIndex === 0;
            if (nextBtn) nextBtn.disabled = currentIndex === totalSlides - 1;

            runTypingAnimation(slides[currentIndex]);
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
            prevBtn.disabled = true;
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
            nextBtn.disabled = totalSlides <= 1;
        }

        if (counterTotal) counterTotal.textContent = String(totalSlides);
        goToSlide(0);
    }

    console.log('DOMContentLoaded - Starting animations...');
    
    if (typeof ScrollTrigger !== 'undefined') {
        setTimeout(() => ScrollTrigger.refresh(), 0);
    }

    animateHero();
    
    console.log('Setting up about animation...');
    setupAboutAnimation();
    
    setupProjectsCarousel();
    
    // Initialize spinning text after a delay to ensure profile image is rendered
    setTimeout(() => {
        setupSpinningText();
    }, 500);
    
    // Initialize projects bouncing scroll
    document.addEventListener('loading-screen-complete', () => {
        if (typeof ScrollTrigger !== 'undefined') {
            setTimeout(() => ScrollTrigger.refresh(), 0);
        }
    }, { once: true });

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

