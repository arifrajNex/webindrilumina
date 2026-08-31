import { motion } from 'motion/react';
import {
  ShieldCheck,
  Hotel,
  Utensils,
  Users,
  Plane,
  HeartHandshake,
  Sparkles,
} from 'lucide-react';
import { WHY_CHOOSE_US_DATA } from '../data/travelData';

const iconMap = {
  ShieldCheck: ShieldCheck,
  Hotel: Hotel,
  Utensils: Utensils,
  Users: Users,
  Plane: Plane,
  HeartHandshake: HeartHandshake,
};

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
      staggerChildren: 0.1,
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

export default function WhyChooseUs() {
  return (
    <section id="keunggulan-layanan" className="w-full py-16 md:py-24">
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
          <Sparkles size={14} className="animate-spin-slow" />
          <span className="uppercase tracking-wider">Standar Pelayanan Internasional</span>
        </motion.div>
        <motion.h2
          variants={textFade}
          className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight mb-4"
        >
          Mengapa Memilih Kami untuk{' '}
          <span className="font-bold italic font-['Cormorant_Garamond'] bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent">
            Perjalanan Berharga Anda
          </span>
        </motion.h2>
        <motion.p
          variants={textFade}
          className="text-sm sm:text-base text-white/75 leading-relaxed"
        >
          Dedikasi penuh dalam memberikan pengalaman perjalanan ibadah dan wisata dunia yang aman, nyaman, dan berkesan.
        </motion.p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {WHY_CHOOSE_US_DATA.map((item) => {
          const Icon = iconMap[item.iconName as keyof typeof iconMap] || ShieldCheck;
          return (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3, ease: 'easeOut' },
              }}
              className="liquid-glass rounded-3xl p-7 border border-white/10 hover:border-amber-400/50 transition-colors flex flex-col justify-between group shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 cursor-default"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <motion.div
                    whileHover={{ rotate: 8, scale: 1.15 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-inner group-hover:border-amber-300/60"
                  >
                    <Icon size={24} />
                  </motion.div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white/5 border border-white/10 text-amber-300/90 group-hover:border-amber-400/30 transition-colors">
                    {item.highlight}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-amber-300 transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed group-hover:text-white/85 transition-colors">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-[11px] font-medium text-amber-300/80 group-hover:text-amber-300 transition-colors">
                <span>Standar Mutu Arminareka Terjamin</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
