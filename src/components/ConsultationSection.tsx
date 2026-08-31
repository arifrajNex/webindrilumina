import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import {
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Mail,
} from 'lucide-react';

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

export default function ConsultationSection() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [destination, setDestination] = useState('Umroh Reguler Bintang 5');
  const [month, setMonth] = useState('Ramadhan / Syawal 2026');
  const [pax, setPax] = useState('2 Orang');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Format WhatsApp message to consultant
    const textMessage = encodeURIComponent(
      `Assalamualaikum Kak, Aku siap Berangkat Umrah & Haji, Boleh dibantu...??\n\nDetail Konsultasi:\n• Nama: ${name || 'Jamaah'}\n• No. WhatsApp: ${phone || '-'}\n• Domisili: ${city || '-'}\n• Pilihan Paket: ${destination}\n• Estimasi Waktu: ${month}\n• Jumlah Jamaah: ${pax}\n• Catatan Tambahan: ${notes || '-'}`
    );
    // WhatsApp direct link
    const waUrl = `https://wa.me/6281310508974?text=${textMessage}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setIsSubmitted(true);
  };

  const handleEmailSubmit = () => {
    const subject = encodeURIComponent(`Konsultasi Umroh & Haji - ${destination} (${name || 'Jamaah'})`);
    const body = encodeURIComponent(
      `Assalamualaikum Wr. Wb.\nIbu Hj. Triana Indrian SE,\n\nBerikut detail konsultasi / pertanyaan saya:\n• Nama: ${name || 'Jamaah'}\n• No. WhatsApp/Telp: ${phone || '-'}\n• Domisili: ${city || '-'}\n• Pilihan Paket: ${destination}\n• Estimasi Waktu: ${month}\n• Jumlah Jamaah: ${pax}\n• Catatan Tambahan: ${notes || '-'}\n\nMohon bantuannya. Terima kasih.`
    );
    window.location.href = `mailto:triana.indrian180774@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <section id="konsultasi" className="w-full py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="liquid-glass rounded-3xl p-8 sm:p-12 border border-amber-400/40 shadow-2xl relative overflow-hidden"
      >
        {/* Glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left info column */}
          <motion.div
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-5 flex flex-col justify-between"
          >
            <div>
              <motion.div
                variants={textFade}
                className="liquid-glass inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-amber-300 text-xs font-medium mb-6 shadow-sm"
              >
                <Sparkles size={14} className="animate-spin-slow" />
                <span className="uppercase tracking-wider">Layanan Konsultasi Cepat</span>
              </motion.div>

              <motion.h2
                variants={textFade}
                className="text-3xl sm:text-4xl font-light text-white tracking-tight mb-4"
              >
                Rencanakan Perjalanan Ibadah &amp;{' '}
                <span className="font-bold italic font-['Cormorant_Garamond'] bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent">
                  Wisata Dunia Anda
                </span>
              </motion.h2>

              <motion.p
                variants={textFade}
                className="text-sm text-white/80 leading-relaxed mb-8"
              >
                Diskusikan anggaran, tanggal keberangkatan terbaik, hingga kebutuhan khusus lansia dan anak-anak bersama konsultan berpengalaman Hj. Triana Indrian SE.
              </motion.p>

              <div className="space-y-4">
                {[
                  'Konsultasi 100% Gratis tanpa biaya komitmen',
                  'Dapatkan simulasi tabungan umroh & rincian detail',
                  'Respon cepat langsung melalui WhatsApp resmi',
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={textFade}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3 text-xs sm:text-sm text-white/90 cursor-default"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              variants={textFade}
              className="mt-8 pt-6 border-t border-white/10 text-xs text-white/60"
            >
              <p>Kantor Pusat Arminareka Perdana • Melayani Jamaah Se-Nusantara</p>
            </motion.div>
          </motion.div>

          {/* Right form column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md space-y-4 shadow-xl"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/90 mb-1.5">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: H. Ahmad Zaki"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/90 mb-1.5">
                    Nomor WhatsApp / HP *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/90 mb-1.5">
                    Pilihan Destinasi / Paket
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors cursor-pointer"
                  >
                    <option value="Umroh Reguler Bintang 5">Umroh Reguler Bintang 5</option>
                    <option value="Umroh Ramadhan & Syawal VIP">Umroh Ramadhan &amp; Syawal VIP</option>
                    <option value="Haji Khusus (Haji Plus)">Haji Khusus (Haji Plus)</option>
                    <option value="Haji Furoda (Tanpa Antri)">Haji Furoda (Tanpa Antri)</option>
                    <option value="Turki & Cappadocia Tulip Tour">Turki &amp; Cappadocia Tulip Tour</option>
                    <option value="Dubai & Abu Dhabi Royal Tour">Dubai &amp; Abu Dhabi Royal Tour</option>
                    <option value="Jejak Andalusia Spanyol & Maroko">Jejak Andalusia Spanyol &amp; Maroko</option>
                    <option value="Jepang Halal Tour Sakura">Jepang Halal Tour Sakura</option>
                    <option value="Swiss & Paris Western Europe">Swiss &amp; Paris Western Europe</option>
                    <option value="Program Tabungan Umroh">Program Tabungan Umroh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/90 mb-1.5">
                    Rencana Keberangkatan
                  </label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors cursor-pointer"
                  >
                    <option value="Maret / Ramadhan 2026">Maret / Ramadhan 2026</option>
                    <option value="April / Syawal 2026">April / Syawal 2026</option>
                    <option value="Musim Haji 2026 (1447 H)">Musim Haji 2026 (1447 H)</option>
                    <option value="Juli - September 2026 (Liburan)">Juli - September 2026 (Liburan)</option>
                    <option value="Akhir Tahun 2026 (Desember)">Akhir Tahun 2026 (Desember)</option>
                    <option value="Fleksibel / Menyesuaikan">Fleksibel / Menyesuaikan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/90 mb-1.5">
                    Jumlah Jamaah / Peserta
                  </label>
                  <input
                    type="text"
                    value={pax}
                    onChange={(e) => setPax(e.target.value)}
                    placeholder="Contoh: 4 Orang (Keluarga)"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/90 mb-1.5">
                    Kota Domisili
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Contoh: Jakarta / Surabaya / Medan"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/90 mb-1.5">
                  Catatan / Kebutuhan Khusus (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Memerlukan kursi roda untuk orang tua / request kamar berdua (double bed)..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors resize-none"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
              >
                <MessageCircle size={18} />
                <span>Kirim Permintaan Konsultasi via WhatsApp</span>
              </motion.button>

              <motion.button
                type="button"
                onClick={handleEmailSubmit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl font-semibold text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Mail size={16} className="text-amber-300" />
                <span>Kirim via Email Resmi (triana.indrian180774@gmail.com)</span>
              </motion.button>

              {isSubmitted && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-xs text-amber-300 font-medium pt-2"
                >
                  ✓ Permintaan sedang dialihkan ke WhatsApp resmi Hj. Triana Indrian SE.
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
