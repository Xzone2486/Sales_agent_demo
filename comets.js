// Interactive Node Network Background
function initNetwork() {
    const canvas = document.getElementById('comet-canvas'); // reusing the same canvas ID
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    // Core Settings
    const PARTICLE_COUNT = 100;
    const MAX_DISTANCE = 150; // Distance to draw connecting lines
    const MOUSE_REPEL_RADIUS = 150;
    const PRIMARY_COLOR = '19, 91, 236'; // #135bec (Tailwind blue-600)

    const mouse = { x: -1000, y: -1000 };

    function resize() {
        const parent = canvas.parentElement;
        width = parent.clientWidth;
        height = parent.clientHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Slow, drifting velocities
            this.vx = (Math.random() - 0.5) * 0.8; 
            this.vy = (Math.random() - 0.5) * 0.8;
            this.baseRadius = Math.random() * 1.5 + 0.5;
            this.radius = this.baseRadius;
        }

        update() {
            // Mouse repulsion
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < MOUSE_REPEL_RADIUS) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (MOUSE_REPEL_RADIUS - distance) / MOUSE_REPEL_RADIUS;
                
                // Push particles away
                this.vx -= forceDirectionX * force * 0.5;
                this.vy -= forceDirectionY * force * 0.5;
                
                // Enhance glow when interacted with
                this.radius = this.baseRadius * 3;
            } else {
                // Return to normal size smoothly
                if (this.radius > this.baseRadius) {
                    this.radius -= 0.1;
                }
            }

            // Apply velocity
            this.x += this.vx;
            this.y += this.vy;

            // Apply friction so they don't fly out of control from mouse interaction
            this.vx *= 0.98;
            this.vy *= 0.98;

            // Maintain base drifting speed
            if (Math.abs(this.vx) < 0.2) this.vx += (Math.random() - 0.5) * 0.1;
            if (Math.abs(this.vy) < 0.2) this.vy += (Math.random() - 0.5) * 0.1;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
            
            // Safety bounds
            this.x = Math.max(0, Math.min(width, this.x));
            this.y = Math.max(0, Math.min(height, this.y));
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${PRIMARY_COLOR}, 0.6)`;
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Update all particles
        particles.forEach(p => p.update());

        // Draw connecting lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < MAX_DISTANCE) {
                    // Opacity scales based on distance (closer = more opaque)
                    const opacity = 1 - (distance / MAX_DISTANCE);
                    
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${PRIMARY_COLOR}, ${opacity * 0.5})`; // Max 50% opacity
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        // Draw particles on top of lines
        particles.forEach(p => p.draw());
        
        // Optional: Draw lines from mouse to nearby particles
        particles.forEach(p => {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < MOUSE_REPEL_RADIUS) {
                const opacity = 1 - (distance / MOUSE_REPEL_RADIUS);
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 215, 0, ${opacity * 0.4})`; // Accent gold connection
                ctx.lineWidth = 1.5;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        });

        requestAnimationFrame(animate);
    }
    
    animate();
}

if(document.readyState === 'complete' || document.readyState === 'interactive') {
    initNetwork();
} else {
    document.addEventListener('DOMContentLoaded', initNetwork);
}
