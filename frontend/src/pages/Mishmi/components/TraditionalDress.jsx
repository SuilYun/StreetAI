import React from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from './shared/SectionWrapper';

export default function TraditionalDress({ data }) {
  return (
    <SectionWrapper id="dress" className="bg-forest-950 text-white relative">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-beige bg-beige/10 px-3 py-1 rounded-full">
          Cultural Dress
        </span>
        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-beige">
          Traditional Attire & Silver Ornaments
        </h2>
        <p className="text-stone-300 font-light max-w-xl mx-auto">
          Every weave, color band, and ornament on a Mishmi dress is a mark of prestige, tribe lineage, and connection to the wilderness.
        </p>
      </div>

      <div className="space-y-16">
        {data.elements.map((item, index) => {
          const isEven = index % 2 === 0;
          return (
            <div 
              key={index}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center ${
                isEven ? '' : 'lg:flex-row-reverse'
              }`}
            >
              {/* Image side */}
              <div className={`lg:col-span-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-[4/3]"
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent opacity-65" />
                </motion.div>
              </div>

              {/* Text side */}
              <div className={`lg:col-span-6 space-y-4 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                <h3 className="text-2xl md:text-3xl font-playfair font-bold text-beige">
                  {item.title}
                </h3>
                <div className="w-12 h-1 bg-beige rounded-full" />
                <p className="text-stone-300 font-light leading-relaxed text-base">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
