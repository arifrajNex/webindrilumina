import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, MapPin, X, ZoomIn } from 'lucide-react';
import { GALLERY_PHOTOS } from '../data/travelData';
import { GalleryPhoto } from '../types';

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

export default function GallerySection() {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('Semua');

  const filters = ['Semua', 'Makkah & Madinah', 'Wisata Dunia', 'Jejak Islam'];

  const filteredPhotos =
    activeFilter === 'Semua'
      ? GALLERY_PHOTOS
      : GALLERY_PHOTOS.filter((p) => p.category === activeFilter);

  return (
    <section id="galeri-dokumentasi" className="w-full py-16 md:py-24">
      {/* Header */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12"
      >
        <motion.div
          variants={textFade}
          className="liquid-glass inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-amber-300 text-xs font-medium mb-4 shadow-sm"
        >
          <Camera size={14} className="animate-pulse" />
          <span className="uppercase tracking-wider">Momen Nyata Jamaah &amp; Wisatawan</span>
        </motion.div>
        <motion.h2
          variants={textFade}
          className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight mb-4"
        >
          Galeri Jejak{' '}
          <span className="font-bold italic font-['Cormorant_Garamond'] bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent">
            Perjalanan &amp; Ibadah
          </span>
        </motion.h2>
        <motion.p
          variants={textFade}
          className="text-sm sm:text-base text-white/75 leading-relaxed"
        >
          Potret kebahagiaan para jamaah dan pelancong saat mengeksplorasi keagungan Baitullah dan pesona lanskap dunia.
        </motion.p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar"
      >
        {filters.map((filter) => (
          <motion.button
            key={filter}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeFilter === filter
                ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold shadow-md shadow-amber-500/20'
                : 'liquid-glass text-white/80 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            {filter}
          </motion.button>
        ))}
      </motion.div>

      {/* Photos Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              layout
              initial={{ opacity: 0, scale: 0.94, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.45, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3, ease: 'easeOut' },
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer liquid-glass border border-white/10 hover:border-amber-400/60 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-colors"
            >
              <img
                src={photo.imageUrl}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Hover overlay icon */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-amber-300 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <ZoomIn size={16} />
              </div>

              {/* Photo info */}
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-400/95 text-black mb-1.5 shadow-sm">
                  {photo.category}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white mb-1 drop-shadow-md group-hover:text-amber-200 transition-colors">
                  {photo.title}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <MapPin size={12} className="text-amber-400" />
                  <span>{photo.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl w-full rounded-3xl overflow-hidden border border-white/20 bg-black/70 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center border border-white/20 transition-colors cursor-pointer shadow-lg"
              >
                <X size={20} />
              </motion.button>

              <div className="max-h-[75vh] w-full overflow-hidden flex items-center justify-center bg-black">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="max-h-[75vh] w-auto object-contain"
                />
              </div>

              <div className="p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider block mb-1">
                  {selectedPhoto.category}
                </span>
                <h3 className="text-xl font-bold text-white mb-1">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs text-white/70 flex items-center gap-1.5">
                  <MapPin size={13} className="text-amber-400" />
                  {selectedPhoto.location}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
