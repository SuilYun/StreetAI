import React from 'react';
import { ChefHat } from 'lucide-react';
import SectionWrapper from './shared/SectionWrapper';
import GlassCard from './shared/GlassCard';

export default function Cuisine({ data }) {
  return (
    <SectionWrapper id="cuisine" className="bg-beige-50 dark:bg-stone-950 text-stone-800 dark:text-stone-100">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-forest-800 dark:text-beige bg-forest-800/10 dark:bg-beige/10 px-3 py-1 rounded-full">
          Gastronomy
        </span>
        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-forest-900 dark:text-beige">
          Traditional Cuisine & Delicacies
        </h2>
        <p className="text-stone-600 dark:text-stone-400 font-light max-w-xl mx-auto">
          Mishmi cuisine is organic, fresh, and highlights local cooking techniques utilizing fireside hearths, bamboo tubes, and jungle leaves.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {data.map((food, idx) => (
          <GlassCard key={idx} delay={idx * 0.15} className="border-stone-200 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 p-0 overflow-hidden flex flex-col h-full">
            {/* Visual element / Image wrapper */}
            <div className="relative overflow-hidden aspect-[4/3] w-full shrink-0 group">
              <img 
                src={food.image} 
                alt={food.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider bg-forest-900 text-beige px-2.5 py-1 rounded-full shadow z-10 select-none">
                {food.tag}
              </span>
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-80" />
            </div>

            {/* Inner Content */}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-playfair font-bold text-stone-900 dark:text-beige mb-3 flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-forest-800 dark:text-beige shrink-0" />
                {food.name}
              </h3>
              <p className="text-stone-600 dark:text-stone-305 text-xs font-light leading-relaxed flex-grow">
                {food.description}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </SectionWrapper>
  );
}
