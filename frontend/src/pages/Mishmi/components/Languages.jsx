import React, { useState } from 'react';
import { Volume2, HelpCircle } from 'lucide-react';
import SectionWrapper from './shared/SectionWrapper';
import GlassCard from './shared/GlassCard';

export default function Languages({ data }) {
  const [playingWord, setPlayingWord] = useState(null);

  const speakWord = (text, type) => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    // Cancel currently speaking voices
    window.speechSynthesis.cancel();

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set parameters for natural flow
    utterance.rate = 0.85; 
    utterance.pitch = 1.0;
    
    // Highlight play state
    setPlayingWord(`${text}-${type}`);

    utterance.onend = () => {
      setPlayingWord(null);
    };

    utterance.onerror = () => {
      setPlayingWord(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <SectionWrapper id="languages" className="bg-beige-50 dark:bg-stone-950 text-stone-800 dark:text-stone-100">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Dialect descriptions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-forest-800 dark:text-beige bg-forest-800/10 dark:bg-beige/10 px-3 py-1 rounded-full">
              {data.title}
            </span>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-forest-900 dark:text-beige">
              Symphony of Mountain Dialects
            </h2>
            <p className="text-stone-600 dark:text-stone-300 font-light text-sm leading-relaxed">
              {data.description}
            </p>
          </div>

          <div className="space-y-4">
            <GlassCard hoverEffect={false} className="border-forest-800/20 bg-forest-950/5 dark:bg-stone-900/40 p-5">
              <h4 className="text-sm font-semibold text-forest-850 dark:text-beige uppercase tracking-wider mb-2">
                Tibeto-Burman Family
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-light leading-relaxed">
                The languages are primarily oral. Historically lacking a script, Latin and Devanagari scripts are now adopted for conservation. Conservation of these endangered tongues is vital for local heritage.
              </p>
            </GlassCard>
          </div>
        </div>

        {/* Right Column: Audio interactive table */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden">
            {/* Header info */}
            <div className="p-4 bg-forest-900 text-beige text-xs flex justify-between items-center">
              <span>Interactive Vocabulary Pronunciation Guide</span>
              <span className="flex items-center gap-1.5 opacity-80">
                <HelpCircle className="w-3.5 h-3.5" /> Tap volume icon to listen
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-xs font-semibold text-stone-600 dark:text-stone-400">
                    <th className="p-4">Word / Phrase</th>
                    <th className="p-4">Idu Dialect</th>
                    <th className="p-4">Digaru Dialect</th>
                    <th className="p-4">Miju Dialect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-850 text-xs font-light text-stone-700 dark:text-stone-300">
                  {data.vocab.map((row, idx) => (
                    <tr key={idx} className="hover:bg-stone-50/50 dark:hover:bg-stone-850/50 transition-colors">
                      <td className="p-4 font-semibold text-stone-800 dark:text-stone-200">{row.word}</td>
                      
                      {/* Idu column */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span>{row.idu}</span>
                          <button
                            onClick={() => speakWord(row.idu, 'idu')}
                            aria-label={`Listen to ${row.idu}`}
                            className={`p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer ${
                              playingWord === `${row.idu}-idu` ? 'text-forest-800 dark:text-beige' : 'text-stone-400'
                            }`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Digaru column */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span>{row.digaru}</span>
                          <button
                            onClick={() => speakWord(row.digaru, 'digaru')}
                            aria-label={`Listen to ${row.digaru}`}
                            className={`p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer ${
                              playingWord === `${row.digaru}-digaru` ? 'text-forest-800 dark:text-beige' : 'text-stone-400'
                            }`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Miju column */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span>{row.miju}</span>
                          <button
                            onClick={() => speakWord(row.miju, 'miju')}
                            aria-label={`Listen to ${row.miju}`}
                            className={`p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer ${
                              playingWord === `${row.miju}-miju` ? 'text-forest-800 dark:text-beige' : 'text-stone-400'
                            }`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
