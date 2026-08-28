import { motion } from 'motion/react';
import { Star, Quote, CheckCircle2, MessageSquare } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/travelData';

export default function TestimonialsSection() {
  return (
    <section id="testimoni-jamaah" className="w-full py-16 md:py-24">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
        <div className="liquid-glass inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-amber-300 text-xs font-medium mb-4">
          <MessageSquare size={14} />
          <span className="uppercase tracking-wider">Testimoni &amp; Kepuasan Jamaah</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight mb-4">
          Cerita Ketulusan dari{' '}
          <span className="font-bold italic font-['Cormorant_Garamond'] bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent">
            Para Sahabat Baitullah
          </span>
        </h2>
        <p className="text-sm sm:text-base text-white/75 leading-relaxed">
          Pengalaman nyata para jamaah yang telah menunaikan ibadah Umroh, Haji, dan Wisata Halal Dunia bersama Hj. Triana Indrian SE.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {TESTIMONIALS_DATA.map((t, index) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="liquid-glass rounded-3xl p-7 border border-white/10 hover:border-amber-400/30 transition-all flex flex-col justify-between group shadow-xl"
          >
            <div>
              {/* Header quote icon & stars */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>
                <Quote size={24} className="text-amber-400/30 group-hover:text-amber-400/60 transition-colors" />
              </div>

              {/* Review text */}
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed italic mb-6">
                "{t.review}"
              </p>
            </div>

            {/* User profile */}
            <div className="pt-4 border-t border-white/10 flex items-center gap-3.5">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-400/50"
              />
              <div>
                <div className="flex items-center gap-1">
                  <h4 className="text-sm font-bold text-white">{t.name}</h4>
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
    </section>
  );
}
