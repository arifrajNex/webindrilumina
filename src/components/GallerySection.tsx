import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, MapPin, X, ZoomIn } from 'lucide-react';
import { GALLERY_PHOTOS } from '../data/travelData';
import { GalleryPhoto } from '../types';

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
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
        <div className="liquid-glass inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-amber-300 text-xs font-medium mb-4">
          <Camera size={14} />
          <span className="uppercase tracking-wider">Momen Nyata Jamaah &amp; Wisatawan</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight mb-4">
          Galeri Jejak{' '}
          <span className="font-bold italic font-['Cormorant_Garamond'] bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent">
            Perjalanan &amp; Ibadah
          </span>
        </h2>
        <p className="text-sm sm:text-base text-white/75 leading-relaxed">
          Potret kebahagiaan para jamaah dan pelancong saat mengeksplorasi keagungan Baitullah dan pesona lanskap dunia.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeFilter === filter
                ? 'bg-amber-400 text-black font-semibold shadow-md'
                : 'liquid-glass text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Photos Masonry / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer liquid-glass border border-white/10 hover:border-amber-400/50 shadow-xl"
          >
            <img
              src={photo.imageUrl}
              alt={photo.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

            {/* Hover overlay icon */}
            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white/90 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn size={16} />
            </div>

            {/* Photo info */}
            <div className="absolute bottom-4 left-4 right-4">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-400/90 text-black mb-1.5">
                {photo.category}
              </span>
              <h4 className="text-sm sm:text-base font-bold text-white mb-1 drop-shadow-md">
                {photo.title}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-white/80">
                <MapPin size={12} className="text-amber-400" />
                <span>{photo.location}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full rounded-3xl overflow-hidden border border-white/20 bg-black/60 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black/90 flex items-center justify-center border border-white/20 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>

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
