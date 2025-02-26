/**
 * Interactive Particle System
 * 
 * This script manages the main application logic, including:
 * - Canvas setup and resizing
 * - Particle creation and management
 * - Animation loop
 * - User interaction handling
 * - UI controls and settings
 */

// DOM Elements
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
const fpsDisplay = document.getElementById('fps');
const connectionsDisplay = document.getElementById('active-connections');
const infoPanel = document.getElementById('info-panel');
const particleInfo = document.getElementById('particle-info');
const infoButton = document.getElementById('info-button');
const infoModal = document.getElementById('info-modal');
const closeButton = document.querySelector('.close-button');

// Controls
const particleCountControl = document.getElementById('particles');
const particleCountDisplay = document.getElementById('particle-count');
const connectionRadiusControl = document.getElementById('connection-radius');
const radiusValueDisplay = document.getElementById('radius-value');
const speedControl = document.getElementById('particle-speed');
const speedValueDisplay = document.getElementById('speed-value');
const colorThemeControl = document.getElementById('color-theme');

// Application state
const state = {
    particles: [],
    particleCount: 100,
    connectionRadius: 150,
    speedFactor: 1,
    colorTheme: 'blue',
    mouse: { x: null, y: null, isActive: false },
    hoveredParticle: null,
    selectedParticle: null,
    frameCount: 0,
    lastFrameTime: 0,
    fps: 0,
    activeConnections: 0
};

// Color themes - corresponding to CSS variables
const colorThemes = {
    blue: ['#0066ff', '#00c3ff', '#80dfff'],
    green: ['#00b300', '#33ff33', '#99ff99'],
    purple: ['#6600cc', '#9933ff', '#cc99ff'],
    sunset: ['#ff3300', '#ff9900', '#ffcc00'],
    grayscale: ['#666666', '#999999', '#cccccc']
};

// Setup the canvas to fill the screen
function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - document.querySelector('header').offsetHeight;
    
    // Update canvas state for particles
    state.canvasDimensions = {
        width: canvas.width,
        height: canvas.height
    };
}

/**
 * Create particles based on current settings
 * This completely resets the particle array
 */
function createParticles() {
    state.particles = [];
    
    // Use the current theme colors
    const colors = colorThemes[state.colorTheme];
    
    for (let i = 0; i < state.particleCount; i++) {
        // Random position
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        // Random size variation (small, medium, large)
        const radius = Math.random() * 3 + 2;
        
        // Random color from the current theme
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Create particle
        const particle = new Particle(
            x, y, radius, color, 
            state.canvasDimensions, 
            state.speedFactor
        );
        
        state.particles.push(particle);
    }
}

/**
 * Clear the canvas
 */
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Draw connections between particles that are close to each other
 */
function drawConnections() {
    // Reset connection counter
    state.activeConnections = 0;
    
    // Reset connected particles counter for each particle
    state.particles.forEach(particle => {
        particle.connectedParticles = 0;
    });
    
    // Loop through all particles
    for (let i = 0; i < state.particles.length; i++) {
        for (let j = i + 1; j < state.particles.length; j++) {
            const particle1 = state.particles[i];
            const particle2 = state.particles[j];
            
            // Check distance between particles
            const distance = particle1.distanceTo(particle2);
            
            // If close enough, draw a connection line
            if (distance < state.connectionRadius) {
                // Calculate opacity based on distance
                const opacity = 1 - (distance / state.connectionRadius);
                
                // Draw connection line
                ctx.beginPath();
                ctx.moveTo(particle1.x, particle1.y);
                ctx.lineTo(particle2.x, particle2.y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
                ctx.lineWidth = Math.max(0.5, 2 * opacity);
                ctx.stroke();
                
                // Increment connection counters
                state.activeConnections++;
                particle1.connectedParticles++;
                particle2.connectedParticles++;
            }
        }
    }
}

/**
 * Main animation loop
 * This is where we update and render everything
 */
function animate(timestamp) {
    // Calculate FPS
    if (!state.lastFrameTime) {
        state.lastFrameTime = timestamp;
    }
    
    const deltaTime = timestamp - state.lastFrameTime;
    if (deltaTime >= 1000) { // Update every second
        state.fps = Math.round((state.frameCount * 1000) / deltaTime);
        state.frameCount = 0;
        state.lastFrameTime = timestamp;
        
        // Update stats display
        fpsDisplay.textContent = `FPS: ${state.fps}`;
        connectionsDisplay.textContent = `Active Connections: ${state.activeConnections}`;
    }
    
    state.frameCount++;
    
    // Clear canvas
    clearCanvas();
    
    // Draw connections between particles
    drawConnections();
    
    // Update and draw all particles
    state.particles.forEach(particle => {
        // Reset highlight
        if (particle !== state.hoveredParticle && particle !== state.selectedParticle) {
            particle.unhighlight();
        }
        
        // Highlight particle if mouse is near it
        if (state.mouse.isActive && particle.isNear(state.mouse.x, state.mouse.y, 50)) {
            particle.highlight();
            state.hoveredParticle = particle;
            
            // Show info panel
            showInfoPanel(particle);
        }
        
        // Update and draw the particle
        particle.update();
        particle.draw(ctx);
    });
    
    // Hide info panel if no particle is hovered
    if (!state.hoveredParticle) {
        hideInfoPanel();
    }
    
    // Request next frame
    requestAnimationFrame(animate);
}

/**
 * Show info panel for a particle
 */
function showInfoPanel(particle) {
    // Update info panel content
    particleInfo.innerHTML = particle.getInfoContent();
    
    // Position panel near mouse but not under it
    infoPanel.style.left = (state.mouse.x + 20) + 'px';
    infoPanel.style.top = (state.mouse.y - 20) + 'px';
    
    // Make sure panel stays within viewport
    const panelRect = infoPanel.getBoundingClientRect();
    if (panelRect.right > window.innerWidth) {
        infoPanel.style.left = (state.mouse.x - panelRect.width - 20) + 'px';
    }
    if (panelRect.bottom > window.innerHeight) {
        infoPanel.style.top = (state.mouse.y - panelRect.height - 20) + 'px';
    }
    
    // Show panel
    infoPanel.classList.remove('hidden');
}

/**
 * Hide info panel
 */
function hideInfoPanel() {
    infoPanel.classList.add('hidden');
    state.hoveredParticle = null;
}

/**
 * Update particle speed based on speedFactor
 */
function updateParticleSpeed() {
    state.particles.forEach(particle => {
        // Calculate current speed vector
        const currentSpeed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        const normalizedVx = particle.vx / currentSpeed;
        const normalizedVy = particle.vy / currentSpeed;
        
        // Apply new speed while maintaining direction
        particle.vx = normalizedVx * state.speedFactor;
        particle.vy = normalizedVy * state.speedFactor;
    });
}

// Event Listeners
window.addEventListener('resize', () => {
    setupCanvas();
    createParticles();
});

// Mouse movement tracking
canvas.addEventListener('mousemove', (e) => {
    state.mouse.x = e.clientX;
    state.mouse.y = e.clientY;
    state.mouse.isActive = true;
});

// Mouse leave tracking
canvas.addEventListener('mouseleave', () => {
    state.mouse.isActive = false;
    hideInfoPanel();
});

// Mouse click to select a particle
canvas.addEventListener('click', (e) => {
    // If there's a currently selected particle, deselect it
    if (state.selectedParticle) {
        state.selectedParticle.deselect();
        state.selectedParticle = null;
    }
    
    // Check if we're clicking on a particle
    const clickedParticle = state.particles.find(particle => 
        particle.isNear(e.clientX, e.clientY, particle.radius * 3)
    );
    
    if (clickedParticle) {
        // Select the particle
        clickedParticle.select();
        state.selectedParticle = clickedParticle;
    }
});

// Particle count control
particleCountControl.addEventListener('input', (e) => {
    state.particleCount = parseInt(e.target.value);
    particleCountDisplay.textContent = state.particleCount;
    createParticles();
});

// Connection radius control
connectionRadiusControl.addEventListener('input', (e) => {
    state.connectionRadius = parseInt(e.target.value);
    radiusValueDisplay.textContent = `${state.connectionRadius}px`;
});

// Speed control
speedControl.addEventListener('input', (e) => {
    state.speedFactor = parseFloat(e.target.value);
    speedValueDisplay.textContent = `${state.speedFactor.toFixed(1)}x`;
    updateParticleSpeed();
});

// Color theme control
colorThemeControl.addEventListener('change', (e) => {
    state.colorTheme = e.target.value;
    createParticles();
});

// Info button 
infoButton.addEventListener('click', () => {
    infoModal.classList.remove('hidden');
});

// Close modal button
closeButton.addEventListener('click', () => {
    infoModal.classList.add('hidden');
});

// Close modal when clicking outside
infoModal.addEventListener('click', (e) => {
    if (e.target === infoModal) {
        infoModal.classList.add('hidden');
    }
});

// Initialize the application
function init() {
    setupCanvas();
    createParticles();
    requestAnimationFrame(animate);
}

// Start the application when loaded
window.addEventListener('load', init);

// Add keyboard controls for accessibility
document.addEventListener('keydown', (e) => {
    // Escape key closes modal
    if (e.key === 'Escape') {
        infoModal.classList.add('hidden');
    }
    
    // Space bar toggles the info modal
    if (e.key === ' ' && document.activeElement === infoButton) {
        e.preventDefault();
        infoModal.classList.toggle('hidden');
    }
    
    // Arrow keys to adjust particle count
    if (document.activeElement === particleCountControl) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            particleCountControl.value = parseInt(particleCountControl.value) + 10;
            particleCountControl.dispatchEvent(new Event('input'));
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            particleCountControl.value = parseInt(particleCountControl.value) - 10;
            particleCountControl.dispatchEvent(new Event('input'));
        }
    }
});

// Add touch support for mobile devices
let touchTimeout;

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent scrolling
    const touch = e.touches[0];
    
    state.mouse.x = touch.clientX;
    state.mouse.y = touch.clientY;
    state.mouse.isActive = true;
    
    // Clear any existing timeout
    clearTimeout(touchTimeout);
    
    // Simulate click if touch is held
    touchTimeout = setTimeout(() => {
        // Find particle under touch
        const touchedParticle = state.particles.find(particle => 
            particle.isNear(touch.clientX, touch.clientY, particle.radius * 3)
        );
        
        if (touchedParticle) {
            // Deselect previous
            if (state.selectedParticle) {
                state.selectedParticle.deselect();
            }
            
            // Select new
            touchedParticle.select();
            state.selectedParticle = touchedParticle;
        }
    }, 300);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    
    state.mouse.x = touch.clientX;
    state.mouse.y = touch.clientY;
    
    // Clear timeout as we're moving
    clearTimeout(touchTimeout);
});

canvas.addEventListener('touchend', () => {
    // Keep mouse active for a moment to allow reading info
    setTimeout(() => {
        state.mouse.isActive = false;
        hideInfoPanel();
    }, 1000);
    
    // Clear timeout
    clearTimeout(touchTimeout);
});

// Add a performance mode toggle for slower devices
function addPerformanceToggle() {
    const header = document.querySelector('header');
    
    // Create performance toggle
    const perfToggle = document.createElement('div');
    perfToggle.className = 'control-group';
    perfToggle.innerHTML = `
        <label for="performance-mode">Performance Mode:</label>
        <select id="performance-mode">
            <option value="high">High Quality</option>
            <option value="medium">Balanced</option>
            <option value="low">Low (Better Performance)</option>
        </select>
    `;
    
    header.querySelector('.controls').appendChild(perfToggle);
    
    // Add event listener
    const perfSelector = document.getElementById('performance-mode');
    perfSelector.addEventListener('change', (e) => {
        const mode = e.target.value;
        
        switch (mode) {
            case 'low':
                // Reduce particle count and connections
                particleCountControl.value = "50";
                connectionRadiusControl.value = "100";
                break;
            case 'medium':
                particleCountControl.value = "100";
                connectionRadiusControl.value = "150";
                break;
            case 'high':
                particleCountControl.value = "200";
                connectionRadiusControl.value = "200";
                break;
        }
        
        // Trigger input events to update
        particleCountControl.dispatchEvent(new Event('input'));
        connectionRadiusControl.dispatchEvent(new Event('input'));
    });
}

// Call this after the page loads
window.addEventListener('load', addPerformanceToggle);

// Add double-click to create a new particle
canvas.addEventListener('dblclick', (e) => {
    // Get colors for the current theme
    const colors = colorThemes[state.colorTheme];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Create a new particle at the click location
    const newParticle = new Particle(
        e.clientX, 
        e.clientY, 
        Math.random() * 3 + 2, 
        color, 
        state.canvasDimensions, 
        state.speedFactor
    );
    
    // Add to particles array
    state.particles.push(newParticle);
    
    // Update particle count display and slider
    state.particleCount = state.particles.length;
    particleCountControl.value = state.particleCount;
    particleCountDisplay.textContent = state.particleCount;
    
    // Add a temporary highlight effect
    newParticle.select();
    setTimeout(() => newParticle.deselect(), 1000);
});