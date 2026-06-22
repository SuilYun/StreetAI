import React from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from './shared/SectionWrapper';

export default function HistorySection({ data }) {
  return (
    <SectionWrapper id="history" className="bg-beige-50 dark:bg-stone-950 text-stone-800 dark:text-stone-100">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Storytelling Text */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-forest-800 dark:text-beige bg-forest-800/10 dark:bg-beige/10 px-3 py-1 rounded-full">
              {data.title}
            </span>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold tracking-tight text-forest-900 dark:text-beige leading-tight">
              A Legacy Carved in the Forest Canopy
            </h2>
          </div>

          <p className="text-lg font-inter font-light text-stone-600 dark:text-stone-300 leading-relaxed">
            {data.introduction}
          </p>

          <div className="space-y-6 text-base font-inter font-light leading-relaxed text-stone-600 dark:text-stone-400">
            {data.details.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Pull Quote */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="border-l-4 border-forest-800 dark:border-beige pl-6 py-2 italic font-playfair text-xl md:text-2xl text-forest-800 dark:text-beige"
          >
            "{data.quote}"
            <span className="block text-sm font-inter not-italic font-semibold tracking-wider text-stone-500 uppercase mt-2">
              — {data.quoteAuthor}
            </span>
          </motion.div>
        </div>

        {/* Right Column: Parallax/Sticky Image Card */}
        <div className="lg:col-span-5 relative group">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] max-h-[500px]"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out"
              style={{ backgroundImage: "url('/mishmi/village.png')" }}
            />
            {/* Ambient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white z-10">
              <p className="text-xs uppercase tracking-widest text-beige font-semibold mb-1">Mishmi Settlements</p>
              <h4 className="font-playfair text-xl font-bold">Stilted Mountain Longhouse</h4>
              <p className="text-xs text-stone-300 font-light mt-1">Traditionally made of bamboo, cane, and wood, accommodating extended clans.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
