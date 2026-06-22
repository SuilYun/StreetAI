import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Info, ArrowUpRight } from 'lucide-react';
import SectionWrapper from './shared/SectionWrapper';
import GlassCard from './shared/GlassCard';

// Component to handle map view transitions when a district is selected
function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapSection({ data }) {
  const [activeDistrict, setActiveDistrict] = useState(null);
  const [mapCenter, setMapCenter] = useState([28.25, 96.2]);
  const [mapZoom, setMapZoom] = useState(8);

  const districts = [
    {
      id: "dibang",
      name: "Dibang Valley",
      resides: "Idu Mishmi",
      population: "~8,000",
      description: "Mysterious high-altitude valleys, dense alpine woods, cold glaciers, and home of the Idu tribe.",
      lat: 28.85,
      lng: 95.9,
      color: "#065f46" // Emerald-800
    },
    {
      id: "lower-dibang",
      name: "Lower Dibang Valley",
      resides: "Idu Mishmi & Plains settlers",
      population: "~54,000",
      description: "Lush foothills where the fast-flowing Dibang river exits mountains into plains.",
      lat: 28.15,
      lng: 95.8,
      color: "#022c22" // Emerald-950
    },
    {
      id: "lohit",
      name: "Lohit",
      resides: "Digaru & Miju Mishmi",
      population: "~145,000 (total district)",
      description: "Scenic valley centered around the mighty Lohit river system, featuring fertile orange orchards.",
      lat: 27.95,
      lng: 96.35,
      color: "#92400e" // Amber-800
    },
    {
      id: "anjaw",
      name: "Anjaw",
      resides: "Miju & Digaru Mishmi",
      population: "~21,000",
      description: "Easternmost international border frontier, characterized by gushing pine forests and high peaks.",
      lat: 28.1,
      lng: 96.9,
      color: "#78350f" // Amber-900
    }
  ];

  const handleDistrictSelect = (district) => {
    setActiveDistrict(district);
    setMapCenter([district.lat, district.lng]);
    setMapZoom(9);
  };

  const handleResetView = () => {
    setActiveDistrict(null);
    setMapCenter([28.25, 96.2]);
    setMapZoom(8);
  };

  return (
    <SectionWrapper id="map" className="bg-beige-50 dark:bg-stone-950 text-stone-800 dark:text-stone-100">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Leaflet map view */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-forest-800 dark:text-beige bg-forest-800/10 dark:bg-beige/10 px-3 py-1 rounded-full">
              {data.title}
            </span>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-forest-900 dark:text-beige">
              Residing Territories
            </h2>
            <p className="text-stone-600 dark:text-stone-300 font-light text-sm max-w-lg">
              Click the markers on the real state map of Arunachal Pradesh to inspect district statistics, river systems, and tribe locations.
            </p>
          </div>

          {/* Leaflet map frame container */}
          <div className="relative rounded-2xl overflow-hidden border border-stone-250 dark:border-stone-800 shadow-xl min-h-[380px] h-[450px]">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
              zoomControl={true}
            >
              <ChangeMapView center={mapCenter} zoom={mapZoom} />
              
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {districts.map((dist) => {
                const isSelected = activeDistrict?.id === dist.id;
                return (
                  <CircleMarker
                    key={dist.id}
                    center={[dist.lat, dist.lng]}
                    radius={isSelected ? 18 : 12}
                    pathOptions={{
                      color: isSelected ? '#F5F5DC' : '#1B4332',
                      fillColor: dist.color,
                      fillOpacity: isSelected ? 0.9 : 0.65,
                      weight: isSelected ? 3 : 1.5,
                    }}
                    eventHandlers={{
                      click: () => handleDistrictSelect(dist),
                    }}
                  >
                    <Popup>
                      <div className="font-sans text-xs p-1 text-slate-900 leading-normal">
                        <strong className="font-bold text-sm block mb-1">{dist.name}</strong>
                        <span>Tribe: {dist.resides}</span><br />
                        <span>Population: {dist.population}</span>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>

            {/* Custom map legend on the corner */}
            <div className="absolute bottom-4 left-4 z-[400] bg-white/90 dark:bg-stone-900/90 backdrop-blur-md p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 flex flex-col gap-1.5 text-xs text-stone-600 dark:text-stone-300 font-light shadow-lg">
              <span className="font-semibold text-stone-800 dark:text-stone-150 mb-1 border-b border-stone-200 dark:border-stone-800 pb-1">Tribe Distribution</span>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border border-forest-800 block" style={{ backgroundColor: "#065f46" }} />
                <span>Idu residing region</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border border-forest-800 block" style={{ backgroundColor: "#92400e" }} />
                <span>Miju / Digaru region</span>
              </div>
            </div>

            {/* Reset view overlay button */}
            <button
              onClick={handleResetView}
              className="absolute top-4 right-4 z-[400] px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-850 shadow-md"
            >
              Reset Map
            </button>
          </div>
        </div>

        {/* Right Column: Detail description card */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            {activeDistrict ? (
              <motion.div
                key={activeDistrict.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard hoverEffect={false} className="border-forest-800/20 bg-forest-950/5 dark:bg-stone-900/40 p-8">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <span className="text-xs font-semibold text-forest-800 dark:text-beige uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> Arunachal District
                      </span>
                      <h3 className="text-2xl font-playfair font-bold text-forest-955 dark:text-beige mt-1">
                        {activeDistrict.name}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-1 rounded bg-forest-800/10 dark:bg-beige/10 text-forest-800 dark:text-beige">
                      Coordinates: {activeDistrict.lat}°N, {activeDistrict.lng}°E
                    </span>
                  </div>

                  <p className="text-stone-600 dark:text-stone-300 text-sm font-light leading-relaxed mb-6">
                    {activeDistrict.description}
                  </p>

                  <div className="space-y-4 border-t border-stone-200 dark:border-stone-800 pt-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-stone-500 dark:text-stone-400 font-light">Primary Sub-tribe</span>
                      <span className="font-semibold text-forest-900 dark:text-beige">{activeDistrict.resides}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-stone-500 dark:text-stone-400 font-light">Approx. Population</span>
                      <span className="font-semibold text-stone-700 dark:text-stone-300">{activeDistrict.population}</span>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center gap-2 text-xs text-forest-800 dark:text-beige font-semibold group cursor-pointer">
                    <span>Explore District Culture</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              <GlassCard hoverEffect={false} className="border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/10 p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
                <Info className="w-8 h-8 text-stone-400 dark:text-stone-600 mb-3" />
                <h4 className="text-lg font-playfair font-bold text-stone-700 dark:text-stone-300">Select a Residing District</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-light max-w-[220px] mt-1">
                  Click on the emerald or amber circles on the Arunachal state map to explore local sub-tribes and geographic stats.
                </p>
                <div className="mt-6 flex flex-col gap-2 w-full">
                  {districts.map((dist) => (
                    <button
                      key={dist.id}
                      onClick={() => handleDistrictSelect(dist)}
                      className="w-full text-left p-2.5 rounded-lg border border-stone-200 dark:border-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>{dist.name}</span>
                      <span className="text-[10px] text-stone-450 dark:text-stone-500 font-light">{dist.resides.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </GlassCard>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SectionWrapper>
  );
}
