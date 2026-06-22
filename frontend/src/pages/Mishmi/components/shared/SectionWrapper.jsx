import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function SectionWrapper({ children, id, className = "" }) {
  const shouldReduceMotion = useReducedMotion();

  const animationVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 30 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      }
    }
  };

  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      variants={animationVariants}
      className={`relative w-full py-20 px-4 sm:px-6 lg:px-8 overflow-hidden ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </motion.section>
  );
}
