import { motion } from 'motion/react';
import { Award, Users, Globe, ShieldCheck, TrendingUp } from 'lucide-react';
import { STATS_DATA } from '../data/travelData';

const iconMap = {
  Award: Award,
  Users: Users,
  Globe: Globe,
  ShieldCheck: ShieldCheck,
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

export default function StatsSection() {
  return (
    <section id="stats-section" className="w-full py-12 md:py-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {STATS_DATA.map((item) => {
          const Icon = iconMap[item.iconName as keyof typeof iconMap] || Award;
          return (
            <motion.div
              key={item.label}
              variants={cardVariants}
              whileHover={{
                y: -6,
                scale: 1.02,
                transition: { duration: 0.25, ease: 'easeOut' },
              }}
              whileTap={{ scale: 0.98 }}
              className="liquid-glass rounded-2xl p-5 md:p-7 flex flex-col justify-between border border-white/10 hover:border-amber-400/50 transition-colors group shadow-lg hover:shadow-amber-500/10 cursor-default"
            >
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.15 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-inner group-hover:border-amber-300/60"
                >
                  <Icon size={22} />
                </motion.div>
                <div className="flex items-center gap-1 text-[11px] uppercase tracking-widest text-amber-300/80 font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10 group-hover:border-amber-400/30 transition-colors">
                  <TrendingUp size={10} className="text-amber-400" />
                  <span>Verified</span>
                </div>
              </div>
              <div>
                <motion.h3
                  className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Cormorant_Garamond'] text-white tracking-tight mb-1 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent group-hover:from-amber-100 group-hover:via-amber-300 group-hover:to-amber-400 transition-all"
                >
                  {item.value}
                </motion.h3>
                <p className="text-sm font-semibold text-white/95 mb-1 group-hover:text-white transition-colors">
                  {item.label}
                </p>
                <p className="text-xs text-white/65 leading-relaxed group-hover:text-white/80 transition-colors">
                  {item.detail}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
