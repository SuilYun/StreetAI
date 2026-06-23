import React from 'react';
import { Calendar, User2 } from 'lucide-react';
import SectionWrapper from './shared/SectionWrapper';
import GlassCard from './shared/GlassCard';

export default function Festivals({ data }) {
  return (
    <SectionWrapper id="festivals" className="bg-beige-50 dark:bg-stone-950 text-stone-800 dark:text-stone-100">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-forest-800 dark:text-beige bg-forest-800/10 dark:bg-beige/10 px-3 py-1 rounded-full">
          Divine Celebrations
        </span>
        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-forest-900 dark:text-beige">
          Major Festivals & Rituals
        </h2>
        <p className="text-stone-600 dark:text-stone-400 font-light max-w-xl mx-auto">
          Mishmi festivals are deep spiritual ceremonies of thanksgiving to mountain gods, rivers, and ancestral winds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {data.map((festival, idx) => (
          <GlassCard key={idx} hoverEffect={true} className="border-forest-800/15 bg-white/40 dark:bg-stone-900/40 p-8 flex flex-col">
            {festival.image && (
              <div className="w-full aspect-video rounded-xl overflow-hidden mb-6 relative group border border-stone-200/50 dark:border-stone-800/50">
                <img 
                  src={festival.image} 
                  alt={festival.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
              </div>
            )}
            <div className="space-y-4 mb-6">
              {/* Meta indicators */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-forest-850 dark:text-beige flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {festival.date}
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-forest-800/10 dark:bg-beige/10 text-forest-800 dark:text-beige rounded">
                  {festival.tribe}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-3xl font-playfair font-bold text-forest-950 dark:text-beige">
                {festival.name}
              </h3>
            </div>

            {/* Description */}
            <p className="text-stone-600 dark:text-stone-300 font-light text-sm leading-relaxed mb-6 flex-grow">
              {festival.description}
            </p>

            {/* Rituals Bullet points */}
            <div className="space-y-3 pt-6 border-t border-stone-200 dark:border-stone-800">
              <h4 className="text-xs font-semibold uppercase text-forest-800 dark:text-beige tracking-wider">
                Festival Rituals & Events
              </h4>
              <ul className="space-y-2.5 text-xs text-stone-600 dark:text-stone-450 font-light">
                {festival.rituals.map((ritual, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-forest-800 dark:bg-beige mt-1.5 shrink-0" />
                    <span>{ritual}</span>
                  </li>
                ))}
              </ul>
            </div>
          </GlassCard>
        ))}
      </div>
    </SectionWrapper>
  );
}
