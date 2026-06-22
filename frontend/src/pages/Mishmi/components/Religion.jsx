import React from 'react';
import { Shield } from 'lucide-react';
import SectionWrapper from './shared/SectionWrapper';
import GlassCard from './shared/GlassCard';

export default function Religion({ data }) {
  return (
    <SectionWrapper id="religion" className="bg-forest-950 text-white relative">
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-forest-800/10 blur-[120px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Visual details */}
        <div className="lg:col-span-5 order-2 lg:order-1 relative">
          <GlassCard hoverEffect={false} className="border-beige/20 bg-white/5 p-8 relative overflow-hidden">
            {/* Background design */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-beige/5 rounded-full blur-2xl pointer-events-none" />
            
            <Shield className="w-10 h-10 text-beige mb-6" />
            
            <h4 className="font-playfair text-xl font-bold text-beige mb-3">
              The Sacred Tiger Taboo
            </h4>
            <p className="text-stone-300 text-xs font-light leading-relaxed mb-4">
              Idu Mishmis strongly believe the Tiger is their sibling, born of the same cosmic mother. A strict system of taboos forbids harming tigers.
            </p>
            <p className="text-stone-400 text-[11px] font-light leading-relaxed italic">
              "If a tiger is killed accidentally, it is treated like the death of a human brother—the village undergoes mourning rites led by the Igu."
            </p>
          </GlassCard>
        </div>

        {/* Right Column: Title and storytelling text */}
        <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-beige bg-beige/10 px-3 py-1 rounded-full">
            {data.title}
          </span>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-beige tracking-tight leading-tight">
            Animistic Faith & Shamanic Realms
          </h2>
          <p className="text-stone-200 text-lg font-inter font-light leading-relaxed">
            {data.description}
          </p>

          <div className="space-y-4 text-xs font-inter font-light text-stone-300 leading-relaxed">
            {data.details.map((paragraph, index) => (
              <p key={index} className="pl-4 border-l border-beige/30">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
