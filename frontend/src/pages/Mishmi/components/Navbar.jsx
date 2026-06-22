import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';

const navItems = [
  { id: "hero", label: "Home" },
  { id: "history", label: "History" },
  { id: "subtribes", label: "Sub-tribes" },
  { id: "map", label: "Geography" },
  { id: "dress", label: "Attire" },
  { id: "festivals", label: "Festivals" },
  { id: "languages", label: "Language" },
  { id: "cuisine", label: "Cuisine" },
  { id: "gallery", label: "Gallery" },
  { id: "timeline", label: "Timeline" }
];

export default function Navbar({ activeSection, darkMode, toggleDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={`
      fixed top-4 left-4 right-4 z-40 rounded-2xl transition-all duration-300
      ${scrolled 
        ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-lg border border-white/20 dark:border-white/10 py-3' 
        : 'bg-transparent py-5 border border-transparent'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <span 
            onClick={() => scrollToSection('hero')} 
            className="text-xl md:text-2xl font-playfair font-bold text-forest-800 dark:text-beige cursor-pointer"
          >
            Mishmi Tribe
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`
                text-sm font-inter tracking-wide transition-all duration-200 cursor-pointer
                ${activeSection === item.id 
                  ? 'text-forest-800 dark:text-beige font-semibold border-b-2 border-forest-800 dark:border-beige pb-1' 
                  : 'text-stone-600 dark:text-stone-400 hover:text-forest-800 dark:hover:text-beige'
                }
              `}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Button */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle theme"
            className="p-2.5 rounded-xl cursor-pointer hover:bg-forest-800/10 dark:hover:bg-beige/10 transition-colors text-forest-800 dark:text-beige"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Hamburger Mobile Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl cursor-pointer hover:bg-forest-800/10 dark:hover:bg-beige/10 transition-colors text-forest-800 dark:text-beige"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 mt-2 p-4 bg-white/95 dark:bg-black/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-white/10 flex flex-col gap-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`
                text-left py-2 px-3 rounded-lg text-base cursor-pointer
                ${activeSection === item.id 
                  ? 'bg-forest-800 text-white dark:bg-beige dark:text-black font-semibold' 
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900'
                }
              `}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
