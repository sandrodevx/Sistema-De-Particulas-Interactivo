/**
 * Particle class - represents a single particle in our system
 * This class encapsulates all the logic for particle behavior,
 * movement, rendering, and interaction
 */
class Particle {
    /**
     * Constructor for creating a new particle
     * 
     * @param {number} x - The initial x position
     * @param {number} y - The initial y position
     * @param {number} radius - The radius of the particle
     * @param {string} color - The color of the particle
     * @param {Object} canvas - The canvas dimensions
     * @param {number} speedFactor - How fast the particle moves
     */
    constructor(x, y, radius, color, canvas, speedFactor = 1) {
        // Position
        this.x = x;
        this.y = y;
        
        // Visual properties
        this.radius = radius;
        this.color = color;
        this.originalColor = color;
        this.glowAmount = 0;
        
        // Movement
        this.speedFactor = speedFactor;
        this.vx = (Math.random() - 0.5) * 2 * speedFactor; // Random velocity in x direction
        this.vy = (Math.random() - 0.5) * 2 * speedFactor; // Random velocity in y direction
        
        // Canvas boundaries
        this.canvas = canvas;
        
        // Interaction
        this.isHighlighted = false;
        this.isSelected = false;
        this.connectedParticles = 0;
        
        // Unique properties to make particles more interesting
        this.oscillationRate = Math.random() * 0.02 + 0.01;
        this.oscillationOffset = Math.random() * Math.PI * 2;
        this.maxRadiusMultiplier = Math.random() * 0.5 + 1;
        
        // Assign a unique ID to each particle
        this.id = Particle.nextId++;
        
        // Metadata that will be shown in the info panel
        this.metadata = {
            speed: Math.sqrt(this.vx * this.vx + this.vy * this.vy).toFixed(2),
            angle: (Math.atan2(this.vy, this.vx) * 180 / Math.PI).toFixed(1) + "°",
            oscillation: this.oscillationRate.toFixed(3)
        };
    }
    
    // Static counter for unique IDs
    static nextId = 0;
    
    /**
     * Update the particle's position based on its velocity
     * Also handles boundary conditions
     */
    update() {
        // Move the particle
        this.x += this.vx;
        this.y += this.vy;
        
        // Boundary checks - make particles bounce off the edges
        if (this.x < this.radius) {
            this.x = this.radius;
            this.vx = -this.vx;
        } else if (this.x > this.canvas.width - this.radius) {
            this.x = this.canvas.width - this.radius;
            this.vx = -this.vx;
        }
        
        if (this.y < this.radius) {
            this.y = this.radius;
            this.vy = -this.vy;
        } else if (this.y > this.canvas.height - this.radius) {
            this.y = this.canvas.height - this.radius;
            this.vy = -this.vy;
        }
        
        // Apply pulsating effect using sine wave
        const oscillation = Math.sin(Date.now() * this.oscillationRate + this.oscillationOffset);
        const radiusMultiplier = 1 + (oscillation * 0.2 * this.maxRadiusMultiplier);
        this.currentRadius = this.radius * radiusMultiplier;
        
        // Update metadata
        this.metadata.speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy).toFixed(2);
        this.metadata.angle = (Math.atan2(this.vy, this.vx) * 180 / Math.PI).toFixed(1) + "°";
        
        // Gradually reduce glow if highlighted
        if (this.glowAmount > 0) {
            this.glowAmount -= 0.05;
            if (this.glowAmount < 0) this.glowAmount = 0;
        }
    }
    
    /**
     * Draw the particle on the canvas
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on
     */
    draw(ctx) {
        ctx.save();
        
        // Draw the particle base
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Add glow effect if highlighted or selected
        if (this.isHighlighted || this.isSelected || this.glowAmount > 0) {
            const glowIntensity = this.isSelected ? 1 : (this.isHighlighted ? 0.7 : this.glowAmount);
            const glowSize = this.currentRadius * (1 + glowIntensity * 0.7);
            
            // Create a radial gradient for glow effect
            const gradient = ctx.createRadialGradient(
                this.x, this.y, this.currentRadius,
                this.x, this.y, glowSize
            );
            
            // Set gradient colors
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            // Draw the glow
            ctx.beginPath();
            ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Draw a highlight line from center to edge (if selected)
            if (this.isSelected) {
                const angle = Date.now() * 0.003; // Rotating angle
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                const endX = this.x + Math.cos(angle) * this.currentRadius;
                const endY = this.y + Math.sin(angle) * this.currentRadius;
                ctx.lineTo(endX, endY);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
        
        ctx.restore();
    }
    
    /**
     * Check if this particle is near a specific point
     * 
     * @param {number} x - The x coordinate to check
     * @param {number} y - The y coordinate to check
     * @param {number} threshold - Maximum distance to be considered "near"
     * @returns {boolean} True if the particle is near the point
     */
    isNear(x, y, threshold = 50) {
        const dx = this.x - x;
        const dy = this.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < threshold;
    }
    
    /**
     * Calculate the distance to another particle
     * 
     * @param {Particle} other - The other particle
     * @returns {number} The distance between the particles
     */
    distanceTo(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    /**
     * Highlight the particle (temporarily)
     */
    highlight() {
        this.isHighlighted = true;
    }
    
    /**
     * Remove highlight from the particle
     */
    unhighlight() {
        this.isHighlighted = false;
    }
    
    /**
     * Select the particle (more permanent than highlight)
     */
    select() {
        this.isSelected = true;
        this.glowAmount = 1;
    }
    
    /**
     * Deselect the particle
     */
    deselect() {
        this.isSelected = false;
    }
    
    /**
     * Get HTML content for the info panel about this particle
     * 
     * @returns {string} HTML content
     */
    getInfoContent() {
        return `
            <div>
                <p><strong>ID:</strong> ${this.id}</p>
                <p><strong>Position:</strong> (${Math.round(this.x)}, ${Math.round(this.y)})</p>
                <p><strong>Speed:</strong> ${this.metadata.speed} px/frame</p>
                <p><strong>Direction:</strong> ${this.metadata.angle}</p>
                <p><strong>Connections:</strong> ${this.connectedParticles}</p>
                <p><strong>Oscillation:</strong> ${this.metadata.oscillation} Hz</p>
            </div>
        `;
    }
}