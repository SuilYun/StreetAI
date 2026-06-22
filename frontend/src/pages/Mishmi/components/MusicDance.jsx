import React from 'react';
import SectionWrapper from './shared/SectionWrapper';
import GlassCard from './shared/GlassCard';

export default function MusicDance({ data }) {
  return (
    <SectionWrapper id="musicdance" className="bg-forest-950 text-white relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-forest-800/10 blur-[120px] pointer-events-none" />

      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-beige bg-beige/10 px-3 py-1 rounded-full">
          Rhythms & Steps
        </span>
        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-beige">
          Music & Folk Dance
        </h2>
        <p className="text-stone-300 font-light max-w-xl mx-auto">
          Through metallic gongs, bamboo mouth harps, and community dances, the Mishmis celebrate lifecycle events, harvest, and connect with deities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {data.items.map((item, idx) => (
          <GlassCard key={idx} delay={idx * 0.15} className="p-0 overflow-hidden flex flex-col h-full">
            {/* Visual Image Header */}
            {item.image && (
              <div className="relative overflow-hidden aspect-[4/3] w-full shrink-0 group">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-85" />
              </div>
            )}

            <div className="p-6 flex flex-col flex-grow">
              {/* Waveform graphic overlay */}
              <div className="flex gap-1 mb-4 items-end h-6 select-none opacity-80">
                <span className="w-1 h-4 bg-beige/40 rounded-full" />
                <span className="w-1 h-6 bg-beige/85 rounded-full" />
                <span className="w-1 h-3 bg-beige/30 rounded-full" />
                <span className="w-1 h-5 bg-beige/65 rounded-full" />
                <span className="w-1 h-4 bg-beige/50 rounded-full" />
              </div>

              <h3 className="text-xl font-playfair font-bold text-white mb-3">
                {item.title}
              </h3>

              <p className="text-stone-300 text-xs font-light leading-relaxed flex-grow">
                {item.description}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </SectionWrapper>
  );
}
