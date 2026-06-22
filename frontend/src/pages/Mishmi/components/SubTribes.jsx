import React from 'react';
import SectionWrapper from './shared/SectionWrapper';
import GlassCard from './shared/GlassCard';

export default function SubTribes({ data }) {
  return (
    <SectionWrapper id="subtribes" className="bg-forest-950 text-white relative">
      {/* Decorative Background Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-forest-800/10 blur-[120px] pointer-events-none" />

      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 relative z-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-beige bg-beige/10 px-3 py-1 rounded-full">
          Distinct Groups
        </span>
        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-beige">
          The Three Sub-tribes
        </h2>
        <p className="text-stone-300 font-light max-w-xl mx-auto">
          The Mishmi community is divided into three distinct groups, each possessing unique dialects, styles of haircut, and variations in traditional wear.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {data.map((tribe, index) => (
          <GlassCard key={tribe.id} delay={index * 0.15} className="p-0 overflow-hidden flex flex-col h-full">
            {/* Tribe Portrait Image */}
            <div className="relative overflow-hidden aspect-[4/3] w-full shrink-0 group">
              <img 
                src={tribe.image} 
                alt={tribe.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-85" />
            </div>

            <div className="p-6 flex flex-col flex-grow">
              {/* Header info */}
              <div className="space-y-4 mb-6">
                <span className="text-xs uppercase tracking-widest font-semibold text-beige opacity-85">
                  {tribe.alternativeName}
                </span>
                <h3 className="text-2xl font-playfair font-bold text-white">
                  {tribe.name}
                </h3>
                
                {/* Stats/Meta info */}
                <div className="grid grid-cols-2 gap-2 text-xs border-y border-white/10 py-3 mt-2">
                  <div>
                    <span className="block text-stone-400 font-light">Region</span>
                    <span className="font-semibold text-beige">{tribe.regions}</span>
                  </div>
                  <div>
                    <span className="block text-stone-400 font-light">Population</span>
                    <span className="font-semibold text-beige">{tribe.population}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-stone-300 text-sm font-light leading-relaxed mb-6 flex-grow">
                {tribe.description}
              </p>

              {/* Features/Custom bullet points */}
              <div className="space-y-2.5">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-beige select-none">
                  Key Cultural Traits
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-300 font-light">
                  {tribe.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-beige mt-1.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </SectionWrapper>
  );
}
