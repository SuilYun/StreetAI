import React, { useState, useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import Navbar from './components/Navbar';
import ScrollProgress from './components/shared/ScrollProgress';
import HeroSection from './components/HeroSection';
import HistorySection from './components/HistorySection';
import SubTribes from './components/SubTribes';
import MapSection from './components/MapSection';
import TraditionalDress from './components/TraditionalDress';
import Festivals from './components/Festivals';
import Lifestyle from './components/Lifestyle';
import Languages from './components/Languages';
import MusicDance from './components/MusicDance';
import Cuisine from './components/Cuisine';
import Religion from './components/Religion';
import FloraFauna from './components/FloraFauna';
import Handicrafts from './components/Handicrafts';
import Gallery from './components/Gallery';
import Timeline from './components/Timeline';
import FunFacts from './components/FunFacts';
import Footer from './components/Footer';

import { mishmiData } from './data/mishmiData';
import './MishmiPage.css';

export default function MishmiPage() {
  const [activeSection, setActiveSection] = useState('hero');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Update HTML elements class when dark mode state changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Section scroll spy using IntersectionObserver
  useEffect(() => {
    const sections = [
      'hero', 'history', 'subtribes', 'map', 'dress',
      'festivals', 'lifestyle', 'languages', 'musicdance',
      'cuisine', 'religion', 'florafauna', 'handicrafts',
      'gallery', 'timeline', 'funfacts'
    ];

    const observers = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        {
          rootMargin: '-30% 0px -60% 0px' // Trigger active state when section fills center of viewport
        }
      );

      observer.observe(el);
      observers.push({ observer, el });
    });

    return () => {
      observers.forEach(({ observer, el }) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="mishmi-body-wrapper min-h-screen bg-beige-50 dark:bg-stone-950 text-stone-850 dark:text-stone-100 font-sans transition-colors duration-300 overflow-x-hidden antialiased">
      {/* Top scroll reading progress indicator */}
      <ScrollProgress />

      {/* Header Sticky Navigation bar */}
      <Navbar 
        activeSection={activeSection}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Hero section */}
      <HeroSection data={mishmiData.hero} />

      {/* Core exhibition body */}
      <div className="relative z-20">
        <HistorySection data={mishmiData.history} />
        <SubTribes data={mishmiData.subTribes} />
        <MapSection data={mishmiData.geography} />
        <TraditionalDress data={mishmiData.dress} />
        <Festivals data={mishmiData.festivals} />
        <Lifestyle data={mishmiData.lifestyle} />
        <Languages data={mishmiData.languages} />
        <MusicDance data={mishmiData.musicDance} />
        <Cuisine data={mishmiData.cuisine} />
        <Religion data={mishmiData.religion} />
        <FloraFauna data={mishmiData.floraFauna} />
        <Handicrafts />
        <Gallery />
        <Timeline data={mishmiData.timeline} />
        <FunFacts data={mishmiData} />
      </div>

      {/* References Footer */}
      <Footer data={mishmiData} />
    </div>
  );
}
