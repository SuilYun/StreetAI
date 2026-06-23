import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import ParticleCanvas from './shared/ParticleCanvas';

export default function HeroSection({ data }) {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const handleScrollClick = () => {
    const nextSection = document.getElementById('history');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero" 
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-forest-950 text-white"
    >
      {/* Background Image with immersive parallax scaling on load */}
      <motion.div 
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.65 }}
        transition={{ duration: 2.2, ease: "easeOut" }}
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/mishmi/mishmi_mountains.jpg')" }}
      />

      {/* Atmospheric Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-forest-950/20 to-forest-950 z-10" />
      <div className="absolute inset-0 bg-black/45 z-0" />

      {/* Soft Floating Particles */}
      <ParticleCanvas />

      {/* Hero Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Main Tag */}
          <motion.span 
            variants={textVariants}
            className="inline-block text-xs md:text-sm uppercase tracking-[0.4em] font-semibold text-beige select-none bg-beige/10 py-1.5 px-4 rounded-full backdrop-blur-md"
          >
            Digital Cultural Museum
          </motion.span>

          {/* Heading with Playfair Font */}
          <motion.h1 
            variants={textVariants}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-playfair font-black tracking-tight leading-none text-beige"
          >
            {data.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={textVariants}
            className="text-xl sm:text-2xl md:text-3xl font-inter font-light tracking-wide text-stone-200"
          >
            {data.subtitle}
          </motion.p>

          {/* Description */}
          <motion.p 
            variants={textVariants}
            className="max-w-xl mx-auto text-sm sm:text-base font-inter font-light leading-relaxed text-stone-300 opacity-90"
          >
            {data.description}
          </motion.p>
        </motion.div>
      </div>

      {/* Floating Action Scroll Hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xs uppercase tracking-widest font-medium text-stone-400 select-none cursor-pointer"
          onClick={handleScrollClick}
        >
          Begin Journey
        </motion.span>
        <motion.button 
          onClick={handleScrollClick}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="p-2 rounded-full cursor-pointer bg-beige/10 hover:bg-beige/25 transition-colors border border-white/10"
        >
          <ChevronDown className="w-5 h-5 text-beige" />
        </motion.button>
      </div>
    </section>
  );
}
