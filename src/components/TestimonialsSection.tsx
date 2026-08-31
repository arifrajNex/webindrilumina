import { motion } from 'motion/react';
import { Star, Quote, CheckCircle2, MessageSquare } from 'lucide-react';
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function TestimonialsSection() {
  return (
    <section id="testimoni-jamaah" className="w-full py-16 md:py-24">
      <motion.div
        variants={headerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16"
      >
        <motion.div
          variants={textFade}
          className="liquid-glass inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-amber-300 text-xs font-medium mb-4 shadow-sm"
        >
          <MessageSquare size={14} className="animate-pulse" />
          <span className="uppercase tracking-wider">Testimoni &amp; Kepuasan Jamaah</span>
        </motion.div>
        <motion.h2
          variants={textFade}
          className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight mb-4"
        >
          Cerita Ketulusan dari{' '}
          <span className="font-bold italic font-['Cormorant_Garamond'] bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent">
            Para Sahabat Baitullah
          </span>
        </motion.h2>
        <motion.p
          variants={textFade}
          className="text-sm sm:text-base text-white/75 leading-relaxed"
        >
          Pengalaman nyata para jamaah yang telah menunaikan ibadah Umroh, Haji, dan Wisata Halal Dunia bersama Hj. Triana Indrian SE.
        </motion.p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
      >
        {TESTIMONIALS_DATA.map((t) => (
          <motion.div
            key={t.id}
            variants={cardVariants}
            whileHover={{
              y: -8,
              scale: 1.02,
              transition: { duration: 0.3, ease: 'easeOut' },
            }}
            className="liquid-glass rounded-3xl p-7 border border-white/10 hover:border-amber-400/50 transition-colors flex flex-col justify-between group shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 cursor-default"
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
      </motion.div>
    </section>
  );
}
