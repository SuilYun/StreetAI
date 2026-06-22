import React from 'react';
import { ArrowUp, BookOpen, Share2 } from 'lucide-react';

export default function Footer({ data }) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer id="footer" className="bg-forest-950 text-white relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12 border-b border-white/10 pb-12">
          {/* Brand Credits */}
          <div className="md:col-span-5 space-y-4">
            <h3 className="text-2xl font-playfair font-black tracking-tight text-beige">
              Mishmi Culture
            </h3>
            <p className="text-xs text-stone-400 font-light leading-relaxed max-w-sm">
              Dedicated to documenting, conserving, and celebrating the rich oral history, custom textiles, and forest taboos of the Mishmi Tribe of Arunachal Pradesh.
            </p>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => alert("Link copied to clipboard! Shared successfully.")}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-beige bg-white/10 hover:bg-white/20 py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" /> Share Exhibition
              </button>
            </div>
          </div>

          {/* References & Bibliography */}
          <div className="md:col-span-7 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-beige flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Recommended Readings & References
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-400 font-light">
              {data.references.map((ref, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="inline-block w-1 h-1 rounded-full bg-beige mt-1.5 shrink-0" />
                  <span>{ref}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-center sm:text-left text-[11px] text-stone-500 font-light">
            <p>© {new Date().getFullYear()} Digital Cultural Museum. Created with passion for Arunachal Pradesh Heritage.</p>
            <p className="mt-1">Content gathered from ethnographic archives and local community resources.</p>
          </div>

          {/* Scroll to Top */}
          <button
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="flex items-center gap-2 text-xs font-semibold text-beige bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow hover:shadow-lg hover:-translate-y-0.5 border border-white/5"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-4 h-4 animate-bounce" />
          </button>
        </div>
      </div>
    </footer>
  );
}
