import { motion } from 'motion/react';
import {
  Award,
  CheckCircle,
  MessageCircle,
  Sparkles,
  MapPin,
  Calendar,
  Compass,
} from 'lucide-react';

interface AboutConsultantProps {
  onConsultClick: () => void;
}

const containerVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
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

export default function AboutConsultant({ onConsultClick }: AboutConsultantProps) {
  const credentials = [
    'Senior Official Consultant Arminareka Perdana',
    'Telah memimpin lebih dari 120+ grup keberangkatan',
  ];

  return (
    <section id="profil-konsultan" className="w-full py-16 md:py-24">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="liquid-glass rounded-3xl p-8 sm:p-12 border border-amber-400/30 shadow-2xl relative overflow-hidden"
      >
        {/* Ambient background glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.08, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-amber-600/15 blur-3xl pointer-events-none"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left: Consultant Details */}
          <div className="lg:col-span-7">
            <motion.div
              variants={textFade}
              className="liquid-glass inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-amber-300 text-xs font-medium mb-6 shadow-sm"
            >
              <Award size={14} />
              <span className="uppercase tracking-wider">Tour Leader &amp; Business Consultant</span>
            </motion.div>

            <motion.h2
              variants={textFade}
              className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight mb-2"
            >
              <span className="font-bold italic font-['Cormorant_Garamond'] bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent block">
                Hj. Triana Indrian SE
              </span>
              <span className="text-xl sm:text-2xl font-light text-white/90">
                "Membimbing dengan Hati, Tulus Ikhlas Melayani"
              </span>
            </motion.h2>

            <motion.p
              variants={textFade}
              className="text-sm sm:text-base text-white/80 leading-relaxed my-6"
            >
              "Bagi kami, setiap langkah jamaah menuju Baitullah dan setiap penjelajahan keindahan bumi ciptaan Allah adalah amanah mulia. Kami berkomitmen mendampingi Anda dan keluarga mulai dari perencanaan, administrasi, bimbingan manasik, hingga pelaksanaan di lapangan dengan penuh ketulusan."
            </motion.p>

            {/* Credential bullets */}
            <motion.div variants={textFade} className="space-y-3 mb-8">
              {credentials.map((cred, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-3 text-xs sm:text-sm text-white/90 group cursor-default"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-400/30 transition-colors">
                    <CheckCircle size={13} />
                  </div>
                  <span className="group-hover:text-amber-200 transition-colors">{cred}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Action buttons */}
            <motion.div variants={textFade} className="flex flex-wrap items-center gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onConsultClick}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black transition-all cursor-pointer shadow-lg shadow-amber-500/25"
              >
                <MessageCircle size={18} />
                <span>Konsultasi Free via WhatsApp</span>
              </motion.button>
              <motion.a
                href="#paket-unggulan"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="px-6 py-3.5 rounded-full text-sm font-medium text-white/90 hover:text-white border border-white/20 hover:bg-white/10 transition-colors text-center cursor-pointer"
              >
                Lihat Rombongan Berikutnya
              </motion.a>
            </motion.div>
          </div>

          {/* Right: Metric Badge Card */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <motion.div
              variants={textFade}
              whileHover={{
                y: -6,
                scale: 1.02,
                transition: { duration: 0.3, ease: 'easeOut' },
              }}
              className="rounded-3xl p-6 bg-black/40 border border-white/10 hover:border-amber-400/40 backdrop-blur-md transition-colors shadow-xl group cursor-default"
            >
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.15 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-inner group-hover:border-amber-300/60"
                >
                  <Sparkles size={28} />
                </motion.div>
                <div>
                  <h4 className="text-white font-bold text-lg group-hover:text-amber-300 transition-colors">
                    Pelayanan Terpadu
                  </h4>
                  <p className="text-xs text-amber-300/90 font-medium">Biro Resmi Berizin Kemenag</p>
                </div>
              </div>
              <p className="text-xs text-white/70 leading-relaxed mb-4 group-hover:text-white/85 transition-colors">
                Konsultasikan kebutuhan ibadah Umroh keluarga, Haji Khusus tanpa antri, hingga paket Private Tour keluarga besar ke destinasi impian Anda.
              </p>
              <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                  <span className="block text-xl font-bold text-amber-300 font-['Cormorant_Garamond']">
                    100%
                  </span>
                  <span className="text-[10px] text-white/60 uppercase">Kepastian Visa</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                  <span className="block text-xl font-bold text-amber-300 font-['Cormorant_Garamond']">
                    24/7
                  </span>
                  <span className="text-[10px] text-white/60 uppercase">Pendampingan</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Contact Info */}
            <motion.div
              variants={textFade}
              whileHover={{ y: -3 }}
              className="rounded-2xl p-4 bg-white/5 border border-white/10 hover:border-amber-400/30 flex items-center justify-between text-xs text-white/80 transition-colors"
            >
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-amber-400" />
                <span>Layanan Seluruh Indonesia</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-amber-400" />
                <span>Konsultasi Setiap Hari</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
