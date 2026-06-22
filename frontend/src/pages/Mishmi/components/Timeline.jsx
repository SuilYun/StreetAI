import React from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from './shared/SectionWrapper';
import GlassCard from './shared/GlassCard';

export default function Timeline({ data }) {
  return (
    <SectionWrapper id="timeline" className="bg-forest-950 text-white relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-forest-800/10 blur-[120px] pointer-events-none" />

      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 relative z-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-beige bg-beige/10 px-3 py-1 rounded-full">
          Historical Chronicle
        </span>
        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-beige">
          Timeline of Mishmi Culture
        </h2>
        <p className="text-stone-300 font-light max-w-xl mx-auto">
          Trace the historical developments, colonial encounters, and modern conservation recognition shaping the Mishmi people.
        </p>
      </div>

      {/* Timeline core tree */}
      <div className="relative max-w-4xl mx-auto px-4 z-10">
        {/* Central connecting line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-beige/25 -translate-x-1/2" />

        <div className="space-y-12">
          {data.map((milestone, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div 
                key={index} 
                className={`flex flex-col md:flex-row items-stretch gap-6 relative ${
                  isLeft ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Visual marker dot */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-beige border-[3px] border-forest-950 -translate-x-1/2 top-6 z-20 shadow-md" />

                {/* Content card */}
                <div className="w-full md:w-1/2 pl-8 md:pl-0 md:px-8">
                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <GlassCard hoverEffect={true} className="p-6 bg-white/5 border-white/10 hover:border-beige/30 transition-colors">
                      <span className="text-sm font-bold font-mono text-beige bg-beige/15 py-1 px-3 rounded-full inline-block mb-3 select-none">
                        {milestone.year}
                      </span>
                      <h3 className="text-xl font-playfair font-bold text-white mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-stone-300 text-xs font-light leading-relaxed">
                        {milestone.desc}
                      </p>
                    </GlassCard>
                  </motion.div>
                </div>

                {/* Empty column spacer on desktop */}
                <div className="hidden md:block w-1/2" />
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
