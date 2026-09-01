import { useRef } from 'react';
import { motion } from 'motion/react';
import { Star, Quote, CheckCircle2, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/travelData';

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

export default function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 380, behavior: 'smooth' });
    }
  };

  return (
    <section id="testimoni-jamaah" className="w-full py-16 md:py-24">
      <motion.div
        variants={headerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
      >
        <div className="max-w-2xl">
          <motion.div
            variants={textFade}
            className="liquid-glass inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-amber-300 text-xs font-medium mb-4 shadow-sm"
          >
            <MessageSquare size={14} className="animate-pulse" />
            <span className="uppercase tracking-wider">Testimoni &amp; Kepuasan Jamaah</span>
          </motion.div>
          <motion.h2
            variants={textFade}
            className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight"
          >
            Cerita Ketulusan dari{' '}
            <span className="font-bold italic font-['Cormorant_Garamond'] bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent">
              Para Sahabat Baitullah
            </span>
          </motion.h2>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
          <motion.p
            variants={textFade}
            className="text-sm text-white/75 max-w-sm hidden sm:block"
          >
            Pengalaman nyata para jamaah yang telah menunaikan ibadah bersama Hj. Triana Indrian SE.
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

      {/* Testimonials Horizontal Swipe/Scroll Carousel */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-6 pt-2 px-2 sm:px-4 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {TESTIMONIALS_DATA.map((t) => (
            <motion.div
              key={t.id}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3, ease: 'easeOut' },
              }}
              className="liquid-glass rounded-3xl p-7 border border-white/10 hover:border-amber-400/50 transition-colors flex flex-col justify-between group shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 cursor-default min-w-[320px] sm:min-w-[380px] md:min-w-[420px] max-w-[460px] shrink-0 snap-start"
            >
              <div>
                {/* Header quote icon & stars */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.3, rotate: 12 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                      >
                        <Star size={15} fill="currentColor" />
                      </motion.div>
                    ))}
                  </div>
                  <Quote size={24} className="text-amber-400/30 group-hover:text-amber-400/70 group-hover:scale-110 transition-all duration-300" />
                </div>

                {/* Review text */}
                <p className="text-xs sm:text-sm text-white/85 leading-relaxed italic mb-6 group-hover:text-white transition-colors">
                  "{t.review}"
                </p>
              </div>

              {/* User profile */}
              <div className="pt-4 border-t border-white/10 flex items-center gap-3.5">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-400/50 group-hover:border-amber-300 shadow-md transition-colors"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-200 transition-colors">{t.name}</h4>
                    <CheckCircle2 size={13} className="text-amber-400 shrink-0" />
                  </div>
                  <p className="text-[11px] text-amber-300/90 font-medium">
                    {t.packageTaken}
                  </p>
                  <p className="text-[10px] text-white/50">{t.location} • {t.year}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
