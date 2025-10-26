// Dynamic Background and Scroll Effects
document.addEventListener('DOMContentLoaded', function() {
    // Ensure video loads and plays
    const video = document.querySelector('.video-background video');
    if (video) {
        video.addEventListener('loadeddata', function() {
            console.log('Video loaded successfully');
            this.play().catch(e => console.log('Video autoplay failed:', e));
        });
        
        video.addEventListener('error', function() {
            console.log('Video failed to load, using fallback background');
            document.querySelector('.video-background').style.background = 
                'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)';
        });
        
        // Force play on user interaction
        document.addEventListener('click', function() {
            if (video.paused) {
                video.play().catch(e => console.log('Video play failed:', e));
            }
        }, { once: true });
    }

    // Simple gradient change based on scroll position (no parallax)
    function updateGradient() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollPercent = scrollY / (documentHeight - windowHeight);
        
        // Remove existing gradient classes
        document.body.classList.remove('gradient-warm', 'gradient-cool');
        
        // Add appropriate gradient class based on scroll position
        if (scrollPercent < 0.3) {
            document.body.classList.add('gradient-warm');
        } else if (scrollPercent > 0.7) {
            document.body.classList.add('gradient-warm');
        } else {
            document.body.classList.add('gradient-cool');
        }
    }
    
    // Simple scroll listener without throttling
    window.addEventListener('scroll', updateGradient);
    
    // Initial gradient
    updateGradient();

    // Scroll Progress Bar
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        document.querySelector('.scroll-progress-bar').style.width = scrollPercent + '%';
    }
    
    window.addEventListener('scroll', updateScrollProgress);

    // Create Floating Particles
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
            particlesContainer.appendChild(particle);
        }
    }
    
    createParticles();

    // Enhanced Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all sections for animations
    const sections = document.querySelectorAll('.profile-section, .about-section, .project-card, .running-card');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px) scale(0.95)';
        section.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(section);
    });
    
    // Smooth scrolling for anchor links
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
    
    // Enhanced Interactive Effects
    const projectCards = document.querySelectorAll('.project-card, .running-card');
    
    // Add magnetic effect to cards
    projectCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translateY(-8px) scale(1.02) translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) translate(0px, 0px)';
        });
    });
    
    // Advanced Typography Animations
    function createTextRevealAnimation() {
        const textElements = document.querySelectorAll('.name, .title, .project-title, .running-title');
        
        textElements.forEach(element => {
            const text = element.textContent;
            element.innerHTML = '';
            
            for (let i = 0; i < text.length; i++) {
                const span = document.createElement('span');
                span.textContent = text[i];
                span.style.opacity = '0';
                span.style.transform = 'translateY(20px) rotateX(90deg)';
                span.style.transition = `opacity 0.6s ease ${i * 0.05}s, transform 0.6s ease ${i * 0.05}s`;
                span.style.display = 'inline-block';
                element.appendChild(span);
            }
            
            // Trigger animation when element comes into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const spans = entry.target.querySelectorAll('span');
                        spans.forEach(span => {
                            span.style.opacity = '1';
                            span.style.transform = 'translateY(0) rotateX(0deg)';
                        });
                    }
                });
            });
            
            observer.observe(element);
        });
    }
    
    createTextRevealAnimation();

    // Typing effect for name with enhanced styling
    const nameElement = document.querySelector('.name');
    if (nameElement) {
        const originalText = nameElement.textContent;
        nameElement.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                nameElement.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 120);
            }
        };
        
        setTimeout(typeWriter, 1500);
    }
    
    // Add glow effect to profile picture
    const profilePicture = document.querySelector('.profile-picture');
    if (profilePicture) {
        profilePicture.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 40px rgba(255, 215, 0, 0.6), 0 0 80px rgba(255, 215, 0, 0.3)';
        });
        
        profilePicture.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.1)';
        });
    }
    
    // Add click ripple effect to buttons
    const buttons = document.querySelectorAll('.project-link, .running-link');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .project-link, .running-link {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);