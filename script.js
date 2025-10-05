// Dynamic gradient effect based on scroll position
document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const projectsSection = document.getElementById('projects');
    const runningSection = document.getElementById('running');
    
    // Function to update gradient based on scroll position
    function updateGradient() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Calculate scroll percentage
        const scrollPercentage = scrollY / (documentHeight - windowHeight);
        
        // Remove existing gradient classes
        body.classList.remove('gradient-warm', 'gradient-cool');
        
        if (scrollPercentage < 0.3) {
            // Top section - warm Instagram colors
            body.classList.add('gradient-warm');
        } else if (scrollPercentage < 0.7) {
            // Middle section - transition to cool colors
            const transitionProgress = (scrollPercentage - 0.3) / 0.4;
            const warmColors = [
                '#f09433', '#e6683c', '#dc2743', '#cc2366', '#bc1888'
            ];
            const coolColors = [
                '#667eea', '#764ba2', '#6B73FF', '#9B59B6', '#8E44AD'
            ];
            
            // Interpolate between warm and cool colors
            const interpolatedColors = warmColors.map((warmColor, index) => {
                return interpolateColor(warmColor, coolColors[index], transitionProgress);
            });
            
            body.style.background = `linear-gradient(135deg, 
                ${interpolatedColors[0]} 0%, 
                ${interpolatedColors[1]} 25%, 
                ${interpolatedColors[2]} 50%, 
                ${interpolatedColors[3]} 75%, 
                ${interpolatedColors[4]} 100%)`;
        } else {
            // Bottom section - cool colors
            body.classList.add('gradient-cool');
        }
    }
    
    // Function to interpolate between two hex colors
    function interpolateColor(color1, color2, factor) {
        const hex1 = color1.replace('#', '');
        const hex2 = color2.replace('#', '');
        
        const r1 = parseInt(hex1.substr(0, 2), 16);
        const g1 = parseInt(hex1.substr(2, 2), 16);
        const b1 = parseInt(hex1.substr(4, 2), 16);
        
        const r2 = parseInt(hex2.substr(0, 2), 16);
        const g2 = parseInt(hex2.substr(2, 2), 16);
        const b2 = parseInt(hex2.substr(4, 2), 16);
        
        const r = Math.round(r1 + (r2 - r1) * factor);
        const g = Math.round(g1 + (g2 - g1) * factor);
        const b = Math.round(b1 + (b2 - b1) * factor);
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    // Smooth scrolling for navigation
    function smoothScrollTo(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', updateGradient);
    
    // Initialize gradient
    updateGradient();
    
    // Add smooth scrolling to project links
    document.querySelectorAll('.project-link, .running-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // You can add specific scroll behavior here if needed
        });
    });
    
    // Add intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe project and running cards
    document.querySelectorAll('.project-card, .running-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});
