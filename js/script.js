// Navigation Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section');
    const header = document.querySelector('header');

    function highlightNavLink() {
        let scrollPosition = window.scrollY;
        
        // Check if we're at the header/hero section
        if (scrollPosition < header.offsetHeight - 100) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#header') {
                    link.classList.add('active');
                }
            });
            return;
        }

        // Check other sections
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    // Skills animation
    const skillBars = document.querySelectorAll('.skill-per');
    
    function animateSkills() {
        skillBars.forEach(skill => {
            const percentage = skill.getAttribute('per');
            skill.style.width = "0%";
            
            setTimeout(() => {
                skill.style.width = percentage;
            }, 500);
        });
    }

    // Project filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter projects
            const filterValue = button.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                card.style.display = 'none';
                
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                }
            });
        });
    });

    // Contact form
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // You can implement form submission logic here
            // For now, just log the values
            console.log({
                name,
                email,
                subject,
                message
            });
            
            // Reset form fields
            contactForm.reset();
            
            // Show success message (you can customize this)
            alert('Your message has been sent successfully!');
        });
    }

    // Initial function calls on page load
    animateSkills();
    highlightNavLink();

    // Animate skills again when skills section is in view
    const skillsSection = document.getElementById('skills');
    
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    document.addEventListener('scroll', () => {
        if (isInViewport(skillsSection)) {
            animateSkills();
        }
    });
});