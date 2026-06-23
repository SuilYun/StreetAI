import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import SectionWrapper from './shared/SectionWrapper';

// Stylized AMEWA Emblem/Seal
const AmewaLogo = () => (
  <div className="relative flex flex-col items-center justify-center w-36 h-36 bg-emerald-950/40 rounded-full border-2 border-amber-500/30 p-2 shadow-inner select-none">
    {/* Wheat stalks decoration left & right */}
    <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col space-y-1 text-amber-500/80 animate-pulse text-lg">🌾</div>
    <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-1 text-amber-500/80 animate-pulse text-lg">🌾</div>
    
    {/* Center circle */}
    <div className="flex flex-col items-center justify-center w-full h-full rounded-full bg-forest-900 border border-amber-500/20 text-center p-3">
      <span className="text-[9px] uppercase tracking-widest text-amber-500/80 font-bold font-mono">ESTD 1997</span>
      <span className="font-playfair text-lg font-black text-amber-300 tracking-widest my-0.5">AMEWA</span>
      
      {/* Hand and Coin SVG representation from poster */}
      <svg className="w-10 h-10 text-amber-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        {/* Rupee Coin */}
        <circle cx="12" cy="8" r="4" fill="rgba(245, 158, 11, 0.2)" stroke="#F59E0B" strokeWidth="1.5" />
        {/* Rupee Symbol inside coin */}
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 6h2.5M11 8h2.5M11 6c0 1.5 2.5 1.5 2.5 2M11.5 10l2-2" stroke="#F59E0B" />
        {/* Supporting Hands */}
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 16c1 1 3 2 6 2s5-1 6-2m-12 1.5c.5 1 2.5 2.5 6 2.5s5.5-1.5 6-2.5" />
      </svg>
    </div>
  </div>
);

export default function Handicrafts({ amewa, crafts }) {
  const [activeTab, setActiveTab] = useState('bambooCane');

  const tabs = [
    { id: 'bambooCane', label: 'Bamboo & Cane', icon: 'Trees' },
    { id: 'handlooms', label: 'Traditional Handlooms', icon: 'Scissors' },
    { id: 'milletsProduce', label: 'Millets & Produce', icon: 'Leaf' }
  ];

  const getTabIcon = (iconName) => {
    const IconComponent = Icons[iconName];
    if (!IconComponent) return <Icons.Activity className="w-4 h-4" />;
    return <IconComponent className="w-4 h-4" />;
  };

  const activeItems = crafts ? crafts[activeTab] : [];

  return (
    <SectionWrapper id="handicrafts" className="bg-forest-950 text-white relative">
      {/* Decorative ambient light */}
      <div className="absolute top-1/4 left-10 w-[300px] h-[300px] rounded-full bg-forest-800/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[300px] h-[300px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      <div className="space-y-16">
        {/* Header Section with AMEWA Store Cum Museum info and Emblem */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-8 space-y-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Artisanship & Heritage
            </span>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-beige tracking-tight leading-tight">
              Mishmi Crafts & Handloom Portal
            </h2>
            <p className="text-stone-300 font-light text-base leading-relaxed max-w-3xl">
              The material culture of the Mishmi is highly eco-conscious and localized. The local economy is driven by exquisite weaving and specialized split-bamboo and cane craftwork. Organizations like the <strong>All Mishmi Economy Welfare Association (AMEWA)</strong> work closely with native craftsmen, operating a dedicated <strong>Store Cum Museum</strong> in Tezu to preserve and showcase these ancestral traditions.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-light text-stone-400 pt-2">
              <span className="flex items-center gap-1.5"><Icons.CheckCircle className="w-4 h-4 text-amber-500" /> GI-Accredited Backstrap Weaving</span>
              <span className="flex items-center gap-1.5"><Icons.CheckCircle className="w-4 h-4 text-amber-500" /> 100% Organic Bamboo & Cane</span>
              <span className="flex items-center gap-1.5"><Icons.CheckCircle className="w-4 h-4 text-amber-500" /> Sustainable Millets Marketing</span>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <motion.div 
              initial={{ rotate: -5, scale: 0.95 }}
              whileHover={{ rotate: 0, scale: 1.05 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10 shadow-2xl relative"
            >
              <div className="absolute top-2 right-2 flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
              </div>
              <AmewaLogo />
              <p className="text-center font-playfair text-xs font-bold text-amber-400 mt-4 tracking-wider">OFFICIAL RECONSTRUCTED EMBLEM</p>
              <p className="text-center text-[10px] text-stone-400 font-light mt-1 max-w-[180px]">Representing financial empowerment and agricultural sustainability.</p>
            </motion.div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-col items-center space-y-8">
          <div className="flex flex-wrap gap-2 p-1.5 bg-white/5 border border-white/10 rounded-xl max-w-xl justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-forest-950 font-bold z-10'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-amber-400 rounded-lg -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {getTabIcon(tab.icon)}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tabbed Grid Container */}
          <div className="w-full">
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {activeItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -6, scale: 1.015 }}
                    className="relative overflow-hidden rounded-2xl bg-white/5 dark:bg-black/40 border border-white/10 dark:border-white/5 hover:border-amber-500/30 p-6 flex flex-col justify-between transition-all duration-300"
                  >
                    {/* Card glow decoration */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-[45px] pointer-events-none rounded-full" />
                    
                    <div>
                      {item.image && (
                        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 relative group border border-white/10">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                          {item.tag}
                        </span>
                        <Icons.Sparkles className="w-3.5 h-3.5 text-amber-500/40" />
                      </div>

                      <h4 className="text-xl font-playfair font-bold text-white mb-2 tracking-wide leading-snug">
                        {item.name}
                      </h4>

                      <p className="text-stone-300 font-light text-xs leading-relaxed mb-6">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex flex-col gap-1 text-[11px]">
                      <span className="text-amber-500/80 font-bold tracking-wider uppercase font-mono text-[9px]">Key Attribute</span>
                      <span className="text-stone-300 font-light">{item.highlights}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* AMEWA Posters Information Section */}
        <div className="mt-20 border-t border-white/10 pt-16">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Community Livelihood
            </span>
            <h3 className="text-3xl font-playfair font-bold text-beige">
              All Mishmi Economy Welfare Association
            </h3>
            <p className="text-stone-300 font-light text-sm max-w-2xl mx-auto">
              Sourcing directly from artisans, AMEWA connects remote weavers and bamboo craftsmen with broader markets, promoting economic independence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Store & Museum Panel - Red & Gold Themed */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-950/40 to-stone-900/60 border border-red-900/30 p-8 shadow-2xl flex flex-col justify-between">
              {/* Gold corners design */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-500/40" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-500/40" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-500/40" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-500/40" />
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                    <Icons.Store className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Store cum Museum</h4>
                    <h5 className="text-xl font-playfair font-bold text-white leading-tight">Handloom, Handicrafts & Millets</h5>
                  </div>
                </div>

                <p className="text-stone-300 font-light text-xs leading-relaxed">
                  {amewa?.storeMuseum?.description || "A community-led center promoting local economy and conserving traditional Mishmi heritage. It showcases authentic handwoven textiles, organic millet grains, and masterfully crafted cane and bamboo objects."}
                </p>

                <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
                  <div className="flex items-start gap-3">
                    <Icons.MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-stone-200">Address</p>
                      <p className="text-stone-400 font-light mt-0.5">{amewa?.storeMuseum?.address || "Chaitom Complex Near APMC, Tezu / Opposite IGG College Tezu"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icons.ShoppingBag className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-stone-200">Featured Offerings</p>
                      <p className="text-stone-400 font-light mt-0.5">Backstrap weaves, split cane baskets, organic millet, wild-harvested herbs, and local artifacts.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 flex justify-between items-center text-[10px] text-amber-400/70 border-t border-white/5 font-mono">
                <span>SUPPORTING LOCAL ARTISANS</span>
                <span>TEZU, ARUNACHAL PRADESH</span>
              </div>
            </div>

            {/* Office Registry Panel - Blue & Gold Themed */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-950/40 to-stone-900/60 border border-blue-900/30 p-8 shadow-2xl flex flex-col justify-between">
              {/* Gold corners design */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-500/40" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-500/40" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-500/40" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-500/40" />

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                    <Icons.Briefcase className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Administrative Office</h4>
                    <h5 className="text-xl font-playfair font-bold text-white leading-tight">AMEWA Headquarters</h5>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-[10px] text-amber-400/70 uppercase tracking-wider mb-1 font-semibold">Established Date</p>
                    <p className="text-white font-medium">{amewa?.established || "26th October 1997"}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-[10px] text-amber-400/70 uppercase tracking-wider mb-1 font-semibold">Registration Number</p>
                    <p className="text-white font-medium">{amewa?.registrationNo || "SR/ITA/718/00"}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
                  <div className="flex items-start gap-3">
                    <Icons.Building className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-stone-200">Head Office</p>
                      <p className="text-stone-400 font-light mt-0.5">{amewa?.headOffice || "Tezu, Lohit District, Arunachal Pradesh, PIN: 792001"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icons.Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-stone-200">Key Mission</p>
                      <p className="text-stone-400 font-light mt-0.5">Uplifting the rural Mishmi economy, protecting ancestral knowledge, and promoting organic biodiversity products.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 flex justify-between items-center text-[10px] text-amber-400/70 border-t border-white/5 font-mono">
                <span>ESTABLISHED UNDER SOCIETY REGISTRY</span>
                <span>LOHIT DISTRICT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Services Provided by AMEWA */}
        <div className="mt-24 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Commercial Catalogue
            </span>
            <h3 className="text-3xl font-playfair font-bold text-beige">
              Services & Products by AMEWA
            </h3>
            <p className="text-stone-300 font-light text-sm">
              We offer certified authentic services directly run by Mishmi artisans. All proceeds fund community welfare initiatives in Lohit and Anjaw.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Service 1: Attire */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col justify-between hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1">
              <div>
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-5 border border-white/10 relative">
                  <img 
                    src="/mishmi/mishmi_weaving_loom.jpg" 
                    alt="Bespoke Attire & Weaving" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-lg font-bold text-white font-playfair mb-2">Bespoke Attire & Weaves</h4>
                <p className="text-stone-300 text-xs font-light leading-relaxed">
                  We supply custom-made traditional garments including wrap-around skirts (*Thoba*), sleeveless coats (*Togo*), and pom-pom sling bags handwoven on backstrap looms.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 text-[10px] font-mono text-amber-400/80 uppercase">
                100% Native Handwoven
              </div>
            </div>

            {/* Service 2: Bamboo Cups */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col justify-between hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1">
              <div>
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-5 border border-white/10 relative">
                  <img 
                    src="/mishmi/mishmi_bamboo_flute.jpg" 
                    alt="Handcrafted Bamboo Cups" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-lg font-bold text-white font-playfair mb-2">Cane & Bamboo Utilities</h4>
                <p className="text-stone-300 text-xs font-light leading-relaxed">
                  Purchase handcrafted single-joint bamboo cups/mugs, tea strainers, tableware, and custom-woven storage baskets made from seasoned hill-bamboo.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 text-[10px] font-mono text-amber-400/80 uppercase">
                Eco-Friendly Dining
              </div>
            </div>

            {/* Service 3: Catering */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col justify-between hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1">
              <div>
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-5 border border-white/10 relative">
                  <img 
                    src="/mishmi/mishmi_elder_drinking.jpg" 
                    alt="Indigenous Food Catering" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-lg font-bold text-white font-playfair mb-2">Indigenous Food Catering</h4>
                <p className="text-stone-300 text-xs font-light leading-relaxed">
                  Book culinary catering for events featuring organic sticky rice cooked in green bamboo hollows (*Dun*), smoked meats, and native ginger-infused broths.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 text-[10px] font-mono text-amber-400/80 uppercase">
                Traditional Kitchens
              </div>
            </div>

            {/* Service 4: Grains */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col justify-between hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1">
              <div>
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-5 border border-white/10 relative">
                  <img 
                    src="/mishmi/mishmi_mountains.jpg" 
                    alt="Millets & Herb Supplies" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-lg font-bold text-white font-playfair mb-2">Millets & Herb Supplies</h4>
                <p className="text-stone-300 text-xs font-light leading-relaxed">
                  Bulk seed supplies and retail marketing of organic foxtail millet, cold-tolerant buckwheat, and shade-grown medicinal herbs like Mishmi Teeta.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 text-[10px] font-mono text-amber-400/80 uppercase">
                Artisanal Seed Bank
              </div>
            </div>
          </div>
        </div>

        {/* AMEWA Services Advertisement Section */}
        <div className="mt-24 bg-gradient-to-r from-amber-500/10 via-forest-900/40 to-amber-500/10 border border-amber-500/20 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Decorative background vectors */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-forest-700/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col xl:flex-row justify-between items-center gap-8 md:gap-12">
            <div className="space-y-6 max-w-2xl text-center xl:text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
                Book Services & Custom Commissions
              </span>
              <h3 className="text-3xl md:text-4xl font-playfair font-black text-beige tracking-wide leading-tight">
                Empowering Communities, Sustaining Livelihoods
              </h3>
              <p className="text-stone-300 font-light text-sm leading-relaxed">
                By purchasing through AMEWA or booking our direct artisanal services, you directly fund sustainable livelihoods in Tezu and Lohit valley. We connect you with certified tribal weavers and farmers for bespoke items, cultural catering, and organic seed supplies.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div className="flex items-start gap-2.5 text-stone-200">
                  <Icons.Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Bespoke Handlooms:</strong> Custom wrap-arounds (*Thoba*) & coats.</span>
                </div>
                <div className="flex items-start gap-2.5 text-stone-200">
                  <Icons.Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Culinary Demos:</strong> Cooking sticky rice inside green bamboo (*Dun*).</span>
                </div>
                <div className="flex items-start gap-2.5 text-stone-200">
                  <Icons.Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Heritage Classes:</strong> Learn splitting and plaiting cane for *Boolup* helmets.</span>
                </div>
                <div className="flex items-start gap-2.5 text-stone-200">
                  <Icons.Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Organic Seed Supplies:</strong> Direct-sourced millet grains & medicinal herbs.</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center shrink-0 w-full sm:w-auto bg-white/5 border border-white/10 rounded-2xl p-6">
              <AmewaLogo />
              <div className="mt-4 text-center max-w-[280px] w-full">
                <div className="flex items-center justify-center gap-1.5 text-amber-400 font-bold text-[10px] uppercase tracking-wider font-mono">
                  <Icons.MapPin className="w-3.5 h-3.5" />
                  <span>Store & Museum Address</span>
                </div>
                <p className="text-stone-300 font-light text-[11px] mt-1.5 leading-normal">
                  {amewa?.storeMuseum?.address || "Chaitom Complex Near APMC, Tezu / Opposite IGG College Tezu"}
                </p>
                <div className="mt-3 text-[9px] text-stone-500 font-mono tracking-wider">
                  SUPPORTED BY APMC TEZU
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

