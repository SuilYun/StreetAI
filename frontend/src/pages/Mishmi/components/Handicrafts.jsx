import React from 'react';
import SectionWrapper from './shared/SectionWrapper';

export default function Handicrafts() {
  return (
    <SectionWrapper id="handicrafts" className="bg-forest-950 text-white relative">
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-forest-800/10 blur-[120px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Story description */}
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-beige bg-beige/10 px-3 py-1 rounded-full">
            Artisanship & Heritage
          </span>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-beige tracking-tight leading-tight">
            Handicrafts & The Weave Arts
          </h2>
          <p className="text-stone-300 font-light text-base leading-relaxed">
            Mishmi women are exceptional weavers, creating highly detailed geometric motifs on traditional backstrap looms. Nettle fiber, cotton, and wool are dyed using local wild plants.
          </p>
          <div className="grid grid-cols-2 gap-4 text-xs font-inter pt-4 border-t border-white/10">
            <div>
              <h4 className="font-semibold text-beige mb-1">Backstrap Weaving</h4>
              <p className="text-stone-400 font-light">The loom is portable, allowing weavers to set up inside longhouses, adjusting warp tension using body weight.</p>
            </div>
            <div>
              <h4 className="font-semibold text-beige mb-1">Cane & Bamboo Crafts</h4>
              <p className="text-stone-400 font-light">Cane helmets, bags, grain baskets, and fishing cages are expertly woven by Mishmi men using thin split strips.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Visual illustration */}
        <div className="lg:col-span-5 relative group">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-[4/5] max-h-[500px]">
            <div 
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out"
              style={{ backgroundImage: "url('/mishmi/weaving.png')" }}
            />
            {/* Ambient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white z-10">
              <p className="text-xs uppercase tracking-widest text-beige font-semibold mb-1">Weaving Tools</p>
              <h4 className="font-playfair text-lg font-bold">Traditional Loom Display</h4>
              <p className="text-[11px] text-stone-300 font-light mt-1">Intricate red and black tribal patterns weave ancestral memory into cloth.</p>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
