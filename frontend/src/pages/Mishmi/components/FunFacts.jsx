import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import SectionWrapper from './shared/SectionWrapper';
import GlassCard from './shared/GlassCard';

function Counter({ value, suffix = "", duration = 1.5 }) {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const isInView = useInView(countRef, { once: true, margin: "-10%" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = parseInt(value, 10);
    if (start === end) return;

    const totalMiliseconds = duration * 1000;
    const frameRate = 1000 / 60; // 60fps
    const totalFrames = Math.round(totalMiliseconds / frameRate);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // easeOutExpo counting curve
      const currentCount = Math.round(end * (1 - Math.pow(2, -10 * progress)));
      
      if (frame >= totalFrames) {
        setCount(end);
        clearInterval(counter);
      } else {
        setCount(currentCount);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [isInView, value, duration]);

  return (
    <span ref={countRef}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function FunFacts({ data }) {
  return (
    <SectionWrapper id="funfacts" className="bg-beige-50 dark:bg-stone-950 text-stone-800 dark:text-stone-100">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-forest-800 dark:text-beige bg-forest-800/10 dark:bg-beige/10 px-3 py-1 rounded-full">
          Cultural Statistics
        </span>
        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-forest-900 dark:text-beige">
          Fun Facts & Numbers
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Grid of animated counters */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-6">
          {data.funFacts.map((stat, idx) => (
            <GlassCard key={idx} hoverEffect={true} className="border-stone-200 dark:border-stone-800 bg-white/40 dark:bg-stone-900/40 p-8 text-center flex flex-col items-center justify-center min-h-[160px]">
              <span className="text-4xl md:text-5xl font-playfair font-black text-forest-850 dark:text-beige mb-2">
                <Counter value={stat.count} suffix={stat.suffix} />
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400">
                {stat.label}
              </span>
            </GlassCard>
          ))}
        </div>

        {/* Right Column: Mini trivia highlights */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard hoverEffect={false} className="border-forest-800/20 bg-forest-950/5 dark:bg-stone-900/40 p-8 min-h-[345px] flex flex-col">
            <div className="flex items-center gap-2 mb-6 text-forest-850 dark:text-beige">
              <Lightbulb className="w-6 h-6 animate-bounce" />
              <h4 className="font-playfair text-xl font-bold">Mishmi Trivia</h4>
            </div>

            <div className="space-y-6 flex-grow">
              {data.funFactTexts.map((text, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-800 dark:bg-beige mt-2 shrink-0 animate-ping" />
                  <p className="text-xs text-stone-600 dark:text-stone-300 font-light leading-relaxed">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </SectionWrapper>
  );
}
