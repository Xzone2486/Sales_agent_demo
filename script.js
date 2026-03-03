// Innovative Glass Cursor Logic
const dot = document.getElementById('cursor-dot');
const aura = document.getElementById('cursor-aura');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let auraX = mouseX;
let auraY = mouseY;
let dotX = mouseX;
let dotY = mouseY;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    // Aura trails smoothly
    auraX += (mouseX - auraX) * 0.15;
    auraY += (mouseY - auraY) * 0.15;
    
    // Dot trails VERY slightly for visual weight, or tracks nearly instantly
    dotX += (mouseX - dotX) * 0.6;
    dotY += (mouseY - dotY) * 0.6;
    
    // Use translate3d for hardware acceleration (smooth framerates)
    if(aura && dot) {
        aura.style.transform = `translate3d(${auraX - 16}px, ${auraY - 16}px, 0)`;
        // Using static offsets instead of offsetWidth/Height inside the loop for performance
        const dotOffset = dot.classList.contains('hover') ? 2 : 3; 
        dot.style.transform = `translate3d(${dotX - dotOffset}px, ${dotY - dotOffset}px, 0)`;
    }
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Add hover effects for interactive elements
const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [role="button"], [onclick]');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        if(aura) aura.classList.add('hover');
        if(dot) dot.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        if(aura) aura.classList.remove('hover');
        if(dot) dot.classList.remove('hover');
    });
});

    // Scroll Animations
    const observer = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible') } }) }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => observer.observe(el));

    // Navbar scroll effect
    window.addEventListener('scroll', () => { const n = document.getElementById('navbar'); n.classList.toggle('shadow-md', window.scrollY > 20) });

    // Modal functions
    function openModal(id) {
        document.getElementById('modal-backdrop').classList.remove('hidden');
        setTimeout(() => document.getElementById('modal-backdrop').style.opacity = '1', 10);
        const m = document.getElementById(id);
        m.classList.remove('hidden');
        setTimeout(() => { m.style.opacity = '1'; m.style.transform = 'scale(1)' }, 10);
    }
    function closeAllModals() {
        const bd = document.getElementById('modal-backdrop');
        bd.style.opacity = '0';
        setTimeout(() => bd.classList.add('hidden'), 300);
        document.querySelectorAll('[id$="-modal"]:not(#modal-backdrop)').forEach(m => { 
            m.style.opacity = '0'; 
            m.style.transform = 'scale(0.95)'; 
            setTimeout(() => m.classList.add('hidden'), 300);
        });
    }
    function switchModal(from, to) { closeAllModals(); setTimeout(() => openModal(to), 300) }
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllModals() });

    // Toast
    function showToast(msg) {
        const t = document.getElementById('toast');
        document.getElementById('toast-msg').textContent = msg;
        t.style.transform = 'translateX(-50%) translateY(0)'; t.style.opacity = '1';
        setTimeout(() => { t.style.transform = 'translateX(-50%) translateY(80px)'; t.style.opacity = '0' }, 4000);
    }

    // Form handlers
    function handleFormSubmit(e, modalId, msg) {
        e.preventDefault(); closeAllModals();
        setTimeout(() => showToast(msg), 400);
    }
    function handleContactForm(e) {
        e.preventDefault(); showToast('Message sent! Our team will reach out within 24 hours.');
        e.target.reset();
    }
    function handleNewsletterForm(e) {
        e.preventDefault(); showToast('Subscribed! You will receive updates on our latest releases.');
        e.target.reset();
    }

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const t = document.querySelector(a.getAttribute('href'));
            if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
        });
    });



