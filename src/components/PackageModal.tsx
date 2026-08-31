import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Clock,
  Calendar,
  Plane,
  Hotel,
  CheckCircle2,
  MapPin,
  Star,
  MessageCircle,
} from 'lucide-react';
import { TravelPackage, Destination } from '../types';

interface ModalProps {
  pkg: TravelPackage | null;
  dest: Destination | null;
  onClose: () => void;
  onBook: (title: string) => void;
}

export default function PackageModal({ pkg, dest, onClose, onBook }: ModalProps) {
  if (!pkg && !dest) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-3xl my-8 rounded-3xl bg-[#121212] border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 text-white hover:bg-black flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-lg"
          >
            <X size={18} />
          </button>

          {/* Modal Header */}
          <div className="relative p-6 sm:p-8 bg-gradient-to-b from-amber-500/20 via-black/40 to-transparent border-b border-white/10">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400 text-black mb-2 uppercase tracking-wider">
              {pkg ? 'Rincian Paket & Itinerary' : 'Informasi Rute Destinasi'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {pkg ? pkg.title : dest?.title}
            </h3>
            <p className="text-xs sm:text-sm text-amber-300 font-medium">
              {pkg ? `${pkg.destination} • ${pkg.duration}` : `${dest?.subtitle} • ${dest?.country}`}
            </p>
          </div>

          {/* Modal Body (Scrollable) */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-white/80 text-xs sm:text-sm">
            {pkg && (
              <>
                {/* Meta details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2.5">
                    <Calendar size={16} className="text-amber-400 shrink-0" />
                    <div>
                      <span className="block text-[10px] text-white/50 uppercase">Keberangkatan</span>
                      <span className="font-semibold text-white">{pkg.departureMonth}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Plane size={16} className="text-amber-400 shrink-0" />
                    <div>
                      <span className="block text-[10px] text-white/50 uppercase">Maskapai</span>
                      <span className="font-semibold text-white">{pkg.airline}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 sm:col-span-2">
                    <Hotel size={16} className="text-amber-400 shrink-0" />
                    <div>
                      <span className="block text-[10px] text-white/50 uppercase">Hotel Akomodasi</span>
                      <span className="font-semibold text-white">{pkg.hotel}</span>
                    </div>
                  </div>
                </div>

                {/* Itinerary Daily Breakdown */}
                <div>
                  <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider text-amber-300">
                    Rangkaian Itinerary Perjalanan:
                  </h4>
                  <div className="space-y-3">
                    {pkg.itinerary.map((item, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col gap-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                            {item.day}
                          </span>
                          <span className="font-bold text-white text-xs sm:text-sm">
                            {item.title}
                          </span>
                        </div>
                        <p className="text-xs text-white/70 leading-relaxed pl-1 pt-1">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inclusions */}
                <div>
                  <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider text-amber-300">
                    Fasilitas All-In Termasuk:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {pkg.inclusions.map((inc, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5">
                        <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                        <span className="text-xs text-white/90">{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {dest && !pkg && (
              <>
                <img
                  src={dest.image}
                  alt={dest.title}
                  className="w-full h-56 rounded-2xl object-cover border border-white/10"
                />
                <p className="text-sm leading-relaxed text-white/90">
                  {dest.description}
                </p>

                <div>
                  <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider text-amber-300">
                    Keunggulan &amp; Fasilitas Rute:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {dest.highlights.map((hl, i) => (
                      <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-white/5">
                        <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                        <span className="text-xs text-white/90">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] text-white/50 uppercase">Estimasi Biaya Paket</span>
                    <span className="text-xl font-bold font-['Cormorant_Garamond'] text-amber-300">
                      {dest.priceFrom}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] text-white/50 uppercase">Hotel Standard</span>
                    <span className="text-xs font-semibold text-white">
                      {'★'.repeat(dest.hotelStar)} Hotel Bintang {dest.hotelStar}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-6 bg-black/80 border-t border-white/10 flex items-center justify-between gap-4">
            <div>
              <span className="block text-[10px] uppercase text-white/50">Biaya Investasi</span>
              <span className="text-2xl font-bold font-['Cormorant_Garamond'] text-amber-300">
                {pkg ? pkg.price : dest?.priceFrom}
              </span>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                const title = pkg ? pkg.title : dest?.title || '';
                onBook(title);
                onClose();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black transition-all cursor-pointer shadow-lg shadow-amber-500/25"
            >
              <MessageCircle size={16} />
              <span>Daftar / Konsultasi WhatsApp</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
