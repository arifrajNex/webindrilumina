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

export default function WhyChooseUs() {
  return (
    <section id="keunggulan-layanan" className="w-full py-16 md:py-24">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
        <div className="liquid-glass inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-amber-300 text-xs font-medium mb-4">
          <Sparkles size={14} />
          <span className="uppercase tracking-wider">Standar Pelayanan Internasional</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight mb-4">
          Mengapa Memilih Kami untuk{' '}
          <span className="font-bold italic font-['Cormorant_Garamond'] bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent">
            Perjalanan Berharga Anda
          </span>
        </h2>
        <p className="text-sm sm:text-base text-white/75 leading-relaxed">
          Dedikasi penuh dalam memberikan pengalaman perjalanan ibadah dan wisata dunia yang aman, nyaman, dan berkesan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {WHY_CHOOSE_US_DATA.map((item, index) => {
          const Icon = iconMap[item.iconName as keyof typeof iconMap] || ShieldCheck;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="liquid-glass rounded-3xl p-7 border border-white/10 hover:border-amber-400/30 transition-all flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                    <Icon size={24} />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white/5 border border-white/10 text-amber-300/90">
                    {item.highlight}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-[11px] font-medium text-amber-300/80">
                <span>Standar Mutu Arminareka Terjamin</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
