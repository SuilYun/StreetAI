import React from 'react';
import * as Icons from 'lucide-react';
import SectionWrapper from './shared/SectionWrapper';
import GlassCard from './shared/GlassCard';

export default function Lifestyle({ data }) {
  // Helper to dynamically render a lucide icon
  const renderIcon = (name) => {
    const IconComponent = Icons[name];
    if (!IconComponent) return <Icons.Activity className="w-6 h-6 text-beige" />;
    return <IconComponent className="w-6 h-6 text-beige" />;
  };

  return (
    <SectionWrapper id="lifestyle" className="bg-forest-950 text-white relative">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-beige bg-beige/10 px-3 py-1 rounded-full">
          Daily Survival
        </span>
        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-beige">
          Lifestyle & Occupation
        </h2>
        <p className="text-stone-300 font-light max-w-xl mx-auto">
          Deeply linked with the mountainous ecosystem, the daily lives of the Mishmis combine sustainable farming with deep forest wisdom.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.items.map((item, idx) => (
          <GlassCard key={idx} delay={idx * 0.1} className="p-6 flex flex-col items-start min-h-[220px]">
            {/* Icon Header */}
            <div className="p-3 bg-white/10 rounded-xl mb-5 flex items-center justify-center">
              {renderIcon(item.icon)}
            </div>

            {/* Title */}
            <h3 className="text-lg font-playfair font-bold text-white mb-2">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-stone-300 text-xs font-light leading-relaxed flex-grow">
              {item.description}
            </p>
          </GlassCard>
        ))}
      </div>
    </SectionWrapper>
  );
}
