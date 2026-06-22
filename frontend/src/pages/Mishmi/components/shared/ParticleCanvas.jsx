import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

export default function ParticleCanvas() {
  const canvasRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height + canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedY = -(Math.random() * 0.8 + 0.2);
        this.speedX = Math.random() * 0.4 - 0.2;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        
        // Handle fading
        if (this.y < 0) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // Golden beige or soft white particles resembling fireflies
        ctx.fillStyle = `rgba(245, 245, 220, ${this.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#F5F5DC';
        ctx.fill();
        ctx.restore();
      }
    }

    const init = () => {
      const particleCount = Math.min(60, Math.floor((canvas.width * canvas.height) / 25000));
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const p = new Particle();
        // pre-populate across height so they don't all start at bottom
        p.y = Math.random() * canvas.height;
        particles.push(p);
      }
    };

    init();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10 w-full h-full mix-blend-screen opacity-60"
    />
  );
}
