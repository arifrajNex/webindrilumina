import { motion } from 'motion/react';
import {
  Award,
  CheckCircle,
  Phone,
  MessageCircle,
  Sparkles,
  MapPin,
  Calendar,
} from 'lucide-react';

interface AboutConsultantProps {
  onConsultClick: () => void;
}

export default function AboutConsultant({ onConsultClick }: AboutConsultantProps) {
  const credentials = [
    'Senior Official Consultant Arminareka Perdana',
    'Sertifikasi Pembimbing Ibadah Haji & Umroh Nasional',
    'Telah memimpin lebih dari 120+ grup keberangkatan',
    'Spesialis Rute Wisata Halal & Napak Tilas Peradaban Islam',
  ];

  return (
    <section id="profil-konsultan" className="w-full py-16 md:py-24">
      <div className="liquid-glass rounded-3xl p-8 sm:p-12 border border-amber-400/30 shadow-2xl relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left: Consultant Details */}
          <div className="lg:col-span-7">
            <div className="liquid-glass inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-amber-300 text-xs font-medium mb-6">
              <Award size={14} />
              <span className="uppercase tracking-wider">Senior Travel Consultant &amp; Leader</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight mb-2">
              <span className="font-bold italic font-['Cormorant_Garamond'] bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent block">
                Hj. Triana Indrian SE
              </span>
              <span className="text-xl sm:text-2xl font-light text-white/90">
                Membimbing dengan Hati, Melayani dengan Ikhlas
              </span>
            </h2>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed my-6">
              "Bagi kami, setiap langkah jamaah menuju Baitullah dan setiap penjelajahan keindahan bumi ciptaan Allah adalah amanah mulia. Kami berkomitmen mendampingi Anda dan keluarga mulai dari perencanaan, administrasi, bimbingan manasik, hingga pelaksanaan di lapangan dengan penuh ketulusan."
            </p>

            {/* Credential bullets */}
            <div className="space-y-3 mb-8">
              {credentials.map((cred, i) => (
                <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-white/90">
                  <div className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle size={13} />
                  </div>
                  <span>{cred}</span>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onConsultClick}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black transition-all cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <MessageCircle size={18} />
                <span>Konsultasi Pribadi via WhatsApp</span>
              </button>
              <a
                href="#jadwal-paket"
                className="px-6 py-3.5 rounded-full text-sm font-medium text-white/90 hover:text-white border border-white/20 hover:bg-white/10 transition-all text-center"
              >
                Lihat Rombongan Berikutnya
              </a>
            </div>
          </div>

          {/* Right: Metric Badge Card */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="rounded-2xl p-6 bg-black/40 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                  <Sparkles size={28} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Pelayanan Terpadu</h4>
                  <p className="text-xs text-amber-300/90 font-medium">Biro Resmi Berizin Kemenag</p>
                </div>
              </div>
              <p className="text-xs text-white/70 leading-relaxed mb-4">
                Konsultasikan kebutuhan ibadah Umroh keluarga, Haji Khusus tanpa antri, hingga paket Private Tour keluarga besar ke destinasi impian Anda.
              </p>
              <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-xl bg-white/5">
                  <span className="block text-xl font-bold text-amber-300 font-['Cormorant_Garamond']">
                    100%
                  </span>
                  <span className="text-[10px] text-white/60 uppercase">Kepastian Visa</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <span className="block text-xl font-bold text-amber-300 font-['Cormorant_Garamond']">
                    24/7
                  </span>
                  <span className="text-[10px] text-white/60 uppercase">Pendampingan</span>
                </div>
              </div>
            </div>

            {/* Quick Contact Info */}
            <div className="rounded-2xl p-4 bg-white/5 border border-white/10 flex items-center justify-between text-xs text-white/80">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-amber-400" />
                <span>Layanan Seluruh Indonesia</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-amber-400" />
                <span>Konsultasi Setiap Hari</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
