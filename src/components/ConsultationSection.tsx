import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import {
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
} from 'lucide-react';

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
      `Assalamu'alaikum Ibu Hj. Triana Indrian SE,\n\nSaya ingin konsultasi rencana perjalanan:\n• Nama: ${name || 'Jamaah'}\n• No. WhatsApp: ${phone || '-'}\n• Domisili: ${city || '-'}\n• Pilihan Paket: ${destination}\n• Estimasi Waktu: ${month}\n• Jumlah Jamaah: ${pax}\n• Catatan Tambahan: ${notes || 'Mohon info ketersediaan seat & rincian brosur lengkap.'}\n\nTerima kasih.`
    );
    // WhatsApp direct link (standard Indonesian WhatsApp international format)
    const waUrl = `https://wa.me/6281234567890?text=${textMessage}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setIsSubmitted(true);
  };

  return (
    <section id="konsultasi" className="w-full py-16 md:py-24">
      <div className="liquid-glass rounded-3xl p-8 sm:p-12 border border-amber-400/40 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left info column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="liquid-glass inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-amber-300 text-xs font-medium mb-6">
                <Sparkles size={14} />
                <span className="uppercase tracking-wider">Layanan Konsultasi Cepat</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight mb-4">
                Rencanakan Perjalanan Ibadah &amp;{' '}
                <span className="font-bold italic font-['Cormorant_Garamond'] bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent">
                  Wisata Dunia Anda
                </span>
              </h2>

              <p className="text-sm text-white/80 leading-relaxed mb-8">
                Diskusikan anggaran, tanggal keberangkatan terbaik, hingga kebutuhan khusus lansia dan anak-anak bersama konsultan berpengalaman Hj. Triana Indrian SE.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-white/90">
                  <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <span>Konsultasi 100% Gratis tanpa biaya komitmen</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-white/90">
                  <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <span>Dapatkan simulasi tabungan umroh &amp; rincian detail</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-white/90">
                  <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <span>Respon cepat langsung melalui WhatsApp resmi</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-xs text-white/60">
              <p>Kantor Pusat Arminareka Perdana • Melayani Jamaah Se-Nusantara</p>
            </div>
          </div>

          {/* Right form column */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md space-y-4"
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
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-amber-400 transition-colors"
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
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-amber-400 transition-colors"
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
                    className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
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
                    className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
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
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-amber-400 transition-colors"
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
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-amber-400 transition-colors"
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
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
              >
                <MessageCircle size={18} />
                <span>Kirim Permintaan Konsultasi via WhatsApp</span>
              </button>

              {isSubmitted && (
                <p className="text-center text-xs text-amber-300 font-medium pt-2">
                  ✓ Permintaan sedang dialihkan ke WhatsApp resmi Hj. Triana Indrian SE.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
