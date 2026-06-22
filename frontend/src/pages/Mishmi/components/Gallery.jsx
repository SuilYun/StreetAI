import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionWrapper from './shared/SectionWrapper';

const galleryImages = [
  { id: 1, src: "/mishmi/hero.png", category: "landscapes", title: "Himalayan Ridges", desc: "Mist rolling over pine forests." },
  { id: 2, src: "/mishmi/village.png", category: "culture", title: "Traditional Settlement", desc: "Classic stilted longhouses." },
  { id: 3, src: "/mishmi/dress.png", category: "attire", title: "Mishmi Attire", desc: "Beaded necklaces and traditional gear." },
  { id: 4, src: "/mishmi/festival.png", category: "culture", title: "Ritual Gathering", desc: "Reh festival community dancers." },
  { id: 5, src: "/mishmi/cuisine.png", category: "culture", title: "Gastronomy Spreed", desc: "Traditional food served on banana leaves." },
  { id: 6, src: "/mishmi/weaving.png", category: "attire", title: "Loom Geometrics", desc: "Red and black woven patterns." },
  { id: 7, src: "/mishmi/takin.png", category: "landscapes", title: "Mishmi Takin", desc: "Rare stocky bovid native to Eastern Himalayas." }
];

export default function Gallery() {
  const [filter, setFilter] = useState('all');
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  const filteredImages = filter === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === filter);

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <SectionWrapper id="gallery" className="bg-beige-50 dark:bg-stone-950 text-stone-800 dark:text-stone-100">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-forest-800 dark:text-beige bg-forest-800/10 dark:bg-beige/10 px-3 py-1 rounded-full">
          Visual Archive
        </span>
        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-forest-900 dark:text-beige">
          Image Gallery
        </h2>
        <p className="text-stone-600 dark:text-stone-400 font-light max-w-xl mx-auto">
          Explore scenes capturing the dramatic geography, elaborate textiles, and vibrant community rituals of the Mishmi hills.
        </p>

        {/* Filter buttons */}
        <div className="flex justify-center gap-3 pt-6 flex-wrap">
          {['all', 'landscapes', 'culture', 'attire'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`
                text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full cursor-pointer transition-all duration-200
                ${filter === cat 
                  ? 'bg-forest-800 text-white dark:bg-beige dark:text-black shadow-md' 
                  : 'bg-stone-200/60 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-300/60 dark:hover:bg-stone-850'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry Columns Grid */}
      <motion.div 
        layout 
        className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
      >
        {filteredImages.map((image, index) => (
          <motion.div
            key={image.id}
            layout
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="break-inside-avoid relative rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-stone-200 dark:border-stone-850"
            onClick={() => setActiveImageIndex(index)}
          >
            <img 
              src={image.src} 
              alt={image.title} 
              className="w-full object-cover rounded-2xl group-hover:scale-102 transition-transform duration-500"
              loading="lazy"
            />
            {/* Hover details overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
              <span className="text-[9px] font-mono text-beige uppercase tracking-widest">{image.category}</span>
              <h4 className="font-playfair text-lg font-bold flex items-center gap-1.5 mt-1">
                {image.title} <ZoomIn className="w-4 h-4 text-stone-300" />
              </h4>
              <p className="text-xs text-stone-300 font-light mt-1">{image.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Immersive Lightbox Modal */}
      <AnimatePresence>
        {activeImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 select-none"
            onClick={() => setActiveImageIndex(null)}
          >
            {/* Close Button */}
            <button 
              onClick={() => setActiveImageIndex(null)}
              className="absolute top-6 right-6 p-2 rounded-full cursor-pointer bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Control */}
            <button 
              onClick={handlePrev}
              className="absolute left-4 sm:left-6 p-3 rounded-full cursor-pointer bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Lightbox main frame */}
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl max-h-[80vh] flex flex-col items-center gap-4 relative"
            >
              <img 
                src={filteredImages[activeImageIndex].src} 
                alt={filteredImages[activeImageIndex].title} 
                className="max-w-full max-h-[70vh] rounded-xl object-contain shadow-2xl border border-white/10"
              />
              <div className="text-center text-white">
                <h4 className="font-playfair text-xl font-bold">{filteredImages[activeImageIndex].title}</h4>
                <p className="text-xs text-stone-400 font-light mt-1">{filteredImages[activeImageIndex].desc}</p>
              </div>
            </motion.div>

            {/* Right Control */}
            <button 
              onClick={handleNext}
              className="absolute right-4 sm:right-6 p-3 rounded-full cursor-pointer bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}
