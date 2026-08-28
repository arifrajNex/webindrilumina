import { motion } from 'motion/react';
import { Award, Users, Globe, ShieldCheck } from 'lucide-react';
import { STATS_DATA } from '../data/travelData';

const iconMap = {
  Award: Award,
  Users: Users,
  Globe: Globe,
  ShieldCheck: ShieldCheck,
};

export default function StatsSection() {
  return (
    <section id="stats-section" className="w-full py-12 md:py-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {STATS_DATA.map((item, index) => {
          const Icon = iconMap[item.iconName as keyof typeof iconMap] || Award;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="liquid-glass rounded-2xl p-5 md:p-7 flex flex-col justify-between border border-white/10 hover:border-amber-400/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                  <Icon size={22} />
                </div>
                <span className="text-[11px] uppercase tracking-widest text-white/50 font-medium">
                  Verified
                </span>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Cormorant_Garamond'] text-white tracking-tight mb-1 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                  {item.value}
                </h3>
                <p className="text-sm font-semibold text-white/95 mb-1">
                  {item.label}
                </p>
                <p className="text-xs text-white/60 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
