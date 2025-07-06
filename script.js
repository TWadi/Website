// Modern JavaScript for Carthavate Website
document.addEventListener('DOMContentLoaded', function() {
    
    // Loading animation
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = `
        <div style="text-align: center; color: white;">
            <div style="font-size: 2rem; margin-bottom: 1rem;">Carthavate</div>
            <div style="width: 50px; height: 50px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
        </div>
    `;
    document.body.appendChild(loading);
    
    // Remove loading after 2 seconds
    setTimeout(() => {
        loading.remove();
    }, 2000);
    
    // Header scroll effect
    const header = document.querySelector('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        if (currentScroll > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.15)';
            header.style.backdropFilter = 'blur(25px)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.1)';
            header.style.backdropFilter = 'blur(20px)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Scroll animations for services
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe all service cards
    document.querySelectorAll('.service').forEach(service => {
        observer.observe(service);
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('nav a[href^="#"], .cta-button[href^="#"]').forEach(anchor => {
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
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Interactive service cards
    document.querySelectorAll('.service').forEach(service => {
        service.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        service.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Form animations
    const form = document.querySelector('form');
    if (form) {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'translateY(-5px)';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'translateY(0)';
            });
        });
        
        // Form submission animation
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const button = form.querySelector('button');
            const originalText = button.textContent;
            
            button.textContent = 'Sending...';
            button.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
            
            // Simulate form submission
            setTimeout(() => {
                button.textContent = 'Message Sent!';
                button.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    form.reset();
                }, 2000);
            }, 1500);
        });
    }
    
    // Typing animation for hero title
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Start typing animation after page load
        setTimeout(typeWriter, 1000);
    }
    
    // Floating animation for logo
    const logo = document.querySelector('.logo img');
    if (logo) {
        logo.style.animation = 'float 3s ease-in-out infinite';
    }
    
    // Add CSS for spin animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .service {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hero h1 {
            overflow: hidden;
            white-space: nowrap;
        }
    `;
    document.head.appendChild(style);
    
    // Mobile menu toggle (if needed)
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.innerHTML = '☰';
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.style.cssText = `
        display: none;
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 10px;
    `;
    
    // Add mobile menu toggle for small screens
    if (window.innerWidth <= 768) {
        const nav = document.querySelector('nav');
        nav.parentElement.insertBefore(mobileMenuToggle, nav);
        mobileMenuToggle.style.display = 'block';
        
        mobileMenuToggle.addEventListener('click', () => {
            nav.style.display = nav.style.display === 'none' ? 'block' : 'none';
        });
    }
    
    // Add some particle effects to the hero section
    createParticles();
});

// Particle effect function
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
            animation: float ${Math.random() * 3 + 2}s ease-in-out infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        hero.appendChild(particle);
    }
}

// Add smooth reveal animations for sections
function revealOnScroll() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollY = window.pageYOffset;
        
        if (scrollY + windowHeight > sectionTop + sectionHeight * 0.3) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
}

// Initialize reveal animations
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll); 