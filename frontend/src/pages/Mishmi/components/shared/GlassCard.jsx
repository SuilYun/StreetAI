import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({ children, className = "", hoverEffect = true, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={hoverEffect ? { y: -8, scale: 1.02 } : {}}
      className={`
        relative overflow-hidden rounded-2xl cursor-pointer
        backdrop-blur-xl 
        bg-white/10 dark:bg-black/20 
        border border-white/20 dark:border-white/10
        shadow-lg shadow-black/5 hover:shadow-2xl hover:shadow-forest-800/10
        transition-all duration-300 ease-out
        ${className}
      `}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-forest-800/5 to-earth-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="relative z-10 p-6 h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}
