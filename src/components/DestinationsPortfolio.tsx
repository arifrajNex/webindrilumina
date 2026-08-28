import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Star,
  Clock,
  Plane,
  ChevronRight,
  Sparkles,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { DESTINATIONS_DATA } from '../data/travelData';
import { Destination, TravelCategory } from '../types';

interface DestinationsPortfolioProps {
  onSelectDestination: (dest: Destination) => void;
}

const CATEGORY_TABS: { label: string; value: TravelCategory }[] = [
  { label: 'Semua Destinasi', value: 'all' },
  { label: 'Umroh & Religi', value: 'umroh-religi' },
  { label: 'Jejak Peradaban Islam', value: 'islamic-heritage' },
  { label: 'Wisata Halal Dunia', value: 'halal-world' },
  { label: 'VIP & Luxury Tour', value: 'vip-luxury' },
];

export default function DestinationsPortfolio({
  onSelectDestination,
}: DestinationsPortfolioProps) {
  const [activeCategory, setActiveCategory] = useState<TravelCategory>('all');

  const filteredDestinations =
    activeCategory === 'all'
      ? DESTINATIONS_DATA
      : DESTINATIONS_DATA.filter((d) => d.category === activeCategory);

  return (
    <section id="destinasi-portfolio" className="w-full py-16 md:py-24">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
        <div className="liquid-glass inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-amber-300 text-xs font-medium mb-4">
          <Globe size={14} />
          <span className="uppercase tracking-wider">Portofolio Perjalanan Global</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight mb-4">
          Destinasi Unggulan{' '}
          <span className="font-bold italic font-['Cormorant_Garamond'] bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent">
            Dunia &amp; Religi
          </span>
        </h2>
        <p className="text-sm sm:text-base text-white/75 leading-relaxed">
          Koleksi rute perjalanan eksklusif dengan standar kenyamanan hotel bintang 5, makanan halal 100%, dan bimbingan nilai spiritual peradaban Islam.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar px-2">
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeCategory === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveCategory(tab.value)}
              className={`px-5 py-2.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold shadow-lg shadow-amber-500/20'
                  : 'liquid-glass text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grid of Destinations */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
      >
        <AnimatePresence>
          {filteredDestinations.map((dest, index) => (
            <motion.div
              key={dest.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="liquid-glass rounded-3xl overflow-hidden border border-white/10 hover:border-amber-400/40 transition-all duration-300 flex flex-col group hover:-translate-y-1.5 shadow-2xl"
            >
              {/* Image Banner */}
              <div className="relative h-60 w-full overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Badge top left */}
                {dest.badge && (
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-400/90 text-black flex items-center gap-1 shadow-md">
                    <Sparkles size={12} />
                    <span>{dest.badge}</span>
                  </div>
                )}

                {/* Duration top right */}
                <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-[11px] font-medium bg-black/60 backdrop-blur-md text-white/90 border border-white/20 flex items-center gap-1.5">
                  <Clock size={12} className="text-amber-300" />
                  <span>{dest.duration}</span>
                </div>

                {/* Country tag on image bottom */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white/90">
                  <div className="flex items-center gap-1 font-medium">
                    <MapPin size={14} className="text-amber-400" />
                    <span>{dest.country}</span>
                    <span className="text-white/40">•</span>
                    <span className="text-white/70">{dest.region}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full border border-white/10 text-amber-300 font-semibold">
                    <Star size={12} fill="currentColor" />
                    <span>{dest.rating.toFixed(1)}</span>
                    <span className="text-white/60 text-[10px]">({dest.reviewsCount})</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1.5 group-hover:text-amber-300 transition-colors">
                    {dest.title}
                  </h3>
                  <p className="text-xs text-amber-200/90 font-medium mb-3">
                    {dest.subtitle}
                  </p>
                  <p className="text-xs text-white/70 line-clamp-2 leading-relaxed mb-4">
                    {dest.description}
                  </p>

                  {/* Highlights list */}
                  <div className="space-y-1.5 mb-5">
                    {dest.highlights.slice(0, 3).map((hl, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-white/80">
                        <CheckCircle2 size={13} className="text-amber-400 shrink-0 mt-0.5" />
                        <span className="truncate">{hl}</span>
                      </div>
                    ))}
                  </div>

                  {/* Flight Info */}
                  <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-white/80 mb-5">
                    <Plane size={13} className="text-amber-300 shrink-0" />
                    <span className="truncate">{dest.airlines}</span>
                  </div>
                </div>

                {/* Footer price and action */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-white/50">
                      Mulai Dari
                    </span>
                    <span className="text-lg font-bold font-['Cormorant_Garamond'] text-amber-300">
                      {dest.priceFrom}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectDestination(dest)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white/10 hover:bg-amber-400 hover:text-black text-white transition-all cursor-pointer border border-white/20 group/btn"
                  >
                    <span>Detail Rute</span>
                    <ChevronRight
                      size={14}
                      className="transition-transform group-hover/btn:translate-x-1"
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
