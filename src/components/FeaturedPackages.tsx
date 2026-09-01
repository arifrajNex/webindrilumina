import { useRef } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  Plane,
  Hotel,
  Check,
  ArrowRight,
  Flame,
  Users,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { PACKAGES_DATA } from '../data/travelData';
import { TravelPackage } from '../types';

interface FeaturedPackagesProps {
  onSelectPackage: (pkg: TravelPackage) => void;
  onBookDirect: (pkgTitle: string) => void;
}

const headerVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.12,
    },
  },
};

const textFade = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function FeaturedPackages({
  onSelectPackage,
  onBookDirect,
}: FeaturedPackagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -450, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 450, behavior: 'smooth' });
    }
  };

  return (
    <section id="paket-unggulan" className="w-full py-16 md:py-24">
      {/* Header */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
      >
        <div className="max-w-2xl">
          <motion.div
            variants={textFade}
            className="liquid-glass inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-amber-300 text-xs font-medium mb-4 shadow-sm"
          >
            <Flame size={14} className="text-amber-400 animate-pulse" />
            <span className="uppercase tracking-wider">Jadwal Keberangkatan Resmi 2026</span>
          </motion.div>
          <motion.h2
            variants={textFade}
            className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight"
          >
            Paket Pilihan &amp;{' '}
            <span className="font-bold italic font-['Cormorant_Garamond'] bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent">
              Jadwal Eksklusif
            </span>
          </motion.h2>
        </div>
        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
          <motion.p
            variants={textFade}
            className="text-sm text-white/70 max-w-md hidden sm:block"
          >
            Nikmati kepastian kuota, tiket pesawat terkonfirmasi, dan pendampingan menyeluruh dari manasik hingga kepulangan.
          </motion.p>
          {/* Scroll Navigation Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleScrollLeft}
              className="w-10 h-10 rounded-full liquid-glass border border-white/20 flex items-center justify-center text-white/80 hover:text-amber-300 hover:border-amber-400/50 transition-all cursor-pointer shadow-md"
              aria-label="Geser Kiri"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={handleScrollRight}
              className="w-10 h-10 rounded-full liquid-glass border border-white/20 flex items-center justify-center text-white/80 hover:text-amber-300 hover:border-amber-400/50 transition-all cursor-pointer shadow-md"
              aria-label="Geser Kanan"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Packages Horizontal Swipe/Scroll Carousel */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-6 pt-2 px-2 sm:px-4 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {PACKAGES_DATA.map((pkg) => (
            <motion.div
              key={pkg.id}
              whileHover={{
                y: -8,
                scale: 1.015,
                transition: { duration: 0.3, ease: 'easeOut' },
              }}
              className={`liquid-glass rounded-3xl p-6 sm:p-8 border flex flex-col justify-between transition-colors group cursor-default shadow-xl min-w-[320px] sm:min-w-[400px] md:min-w-[440px] max-w-[480px] shrink-0 snap-start ${
                pkg.isBestSeller
                  ? 'border-amber-400/40 hover:border-amber-400/80 shadow-amber-500/10 hover:shadow-2xl hover:shadow-amber-500/20'
                  : 'border-white/10 hover:border-amber-400/40 hover:shadow-2xl'
              }`}
            >
            <div>
              {/* Top Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  {pkg.isBestSeller && (
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-amber-400 to-amber-600 text-black flex items-center gap-1 shadow-sm">
                      <Flame size={12} fill="currentColor" />
                      Best Seller
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-white/10 text-white/90 border border-white/15">
                    {pkg.destination}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                  <Users size={12} />
                  <span>Sisa {pkg.slotsLeft} Kursi</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-amber-300 transition-colors duration-200">
                {pkg.title}
              </h3>

              {/* Schedule & Airline Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 p-4 rounded-2xl bg-black/30 border border-white/10 group-hover:border-amber-400/20 transition-colors">
                <div className="flex items-center gap-2.5 text-xs text-white/80">
                  <Clock size={15} className="text-amber-400 shrink-0" />
                  <div>
                    <span className="block text-[10px] uppercase text-white/40">Durasi</span>
                    <span className="font-semibold">{pkg.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-white/80">
                  <Calendar size={15} className="text-amber-400 shrink-0" />
                  <div>
                    <span className="block text-[10px] uppercase text-white/40">Keberangkatan</span>
                    <span className="font-semibold">{pkg.departureMonth}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-white/80 sm:col-span-2">
                  <Plane size={15} className="text-amber-400 shrink-0" />
                  <div className="truncate">
                    <span className="block text-[10px] uppercase text-white/40">Maskapai</span>
                    <span className="font-semibold truncate">{pkg.airline}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-white/80 sm:col-span-2">
                  <Hotel size={15} className="text-amber-400 shrink-0" />
                  <div className="truncate">
                    <span className="block text-[10px] uppercase text-white/40">Akomodasi</span>
                    <span className="font-semibold truncate">{pkg.hotel}</span>
                  </div>
                </div>
              </div>

              {/* Inclusions Highlights */}
              <div className="space-y-2 mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
                  Fasilitas Sudah Termasuk (All-In):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {pkg.inclusions.slice(0, 4).map((inc, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-white/85">
                      <div className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={11} />
                      </div>
                      <span className="truncate">{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Pricing Box for Mesir Aqsa Jordan */}
              {pkg.id === 'pkg-mesir-aqsa-jordan' && (
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-400/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={14} />
                      Jadwal All-In (11 Januari 2027)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                      <span className="block text-[10px] text-white/50 uppercase">ESTIMASI BIAYA</span>
                      <span className="text-base font-bold text-amber-300">$3,000 USD</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                      <span className="block text-[10px] text-white/50 uppercase">MASKAPAI</span>
                      <span className="text-sm font-bold text-amber-300">EgyptAir</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Special Pricing Box for Umroh Turkey Salju */}
              {pkg.id === 'pkg-umroh-turkey-salju' && (
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-400/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={14} />
                      Harga All-In (Musim Salju 11 Jan 2027)
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                      <span className="block text-[10px] text-white/50 uppercase">QUAD</span>
                      <span className="text-sm font-bold text-amber-300">Rp. 48,5 JT</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                      <span className="block text-[10px] text-white/50 uppercase">TRIPLE</span>
                      <span className="text-sm font-bold text-amber-300">Rp. 50 JT</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                      <span className="block text-[10px] text-white/50 uppercase">DOUBLE</span>
                      <span className="text-sm font-bold text-amber-300">Rp. 53 JT</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div>
                {pkg.originalPrice && (
                  <span className="block text-xs line-through text-white/40">
                    {pkg.originalPrice}
                  </span>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-bold font-['Cormorant_Garamond'] bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                    {pkg.price}
                  </span>
                  <span className="text-[11px] text-white/60">/ pax</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelectPackage(pkg)}
                  className="px-4 py-2.5 rounded-full text-xs font-medium text-white/90 hover:text-white border border-white/20 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Itinerary Lengkap
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onBookDirect(pkg.title)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black transition-all cursor-pointer shadow-lg shadow-amber-500/25 group/btn"
                >
                  <span>Daftar / Tanya</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover/btn:translate-x-1"
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
        </div>
      </div>
    </section>
  );
}
