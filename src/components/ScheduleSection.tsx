import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Calendar, Plane, ShieldCheck, UserCheck, Clock, CheckCircle2, Search, Filter, Building2, Bus, Utensils, Users, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';

interface ScheduleItem {
  no: number;
  date: string;
  day: string;
  airline: 'Garuda Indonesia' | 'Lion Air' | 'Saudia';
  packageName: string;
  route: string;
  duration: string;
  pic: string;
  status: 'FIX DATE' | 'ESTIMATED';
}

const SCHEDULE_DATA: ScheduleItem[] = [
  { no: 1, date: '5 Des', day: 'Sabtu', airline: 'Garuda Indonesia', packageName: 'GA Arafah 9D + KC', route: 'CGK - Med', duration: '9 Hari', pic: 'Henny TLA', status: 'ESTIMATED' },
  { no: 2, date: '9 Des', day: 'Rabu', airline: 'Garuda Indonesia', packageName: 'GA Arafah 9D', route: 'CGK - Med', duration: '9 Hari', pic: 'Lani / Aulia LA', status: 'FIX DATE' },
  { no: 3, date: '10 Des', day: 'Kamis', airline: 'Lion Air', packageName: 'LION Muzdalifah 9D', route: 'CGK - Jed', duration: '9 Hari', pic: 'Team Al Furqon', status: 'FIX DATE' },
  { no: 4, date: '17 Des', day: 'Kamis', airline: 'Lion Air', packageName: 'LION Mina 9D', route: 'CGK - Jed', duration: '9 Hari', pic: 'Tuti Sutopo / Hj. Emsur', status: 'ESTIMATED' },
  { no: 5, date: '19 Des', day: 'Sabtu', airline: 'Saudia', packageName: 'SV Umroh Plus Turki 12D', route: 'CGK - IST - Med', duration: '12 Hari', pic: 'Henny HS', status: 'ESTIMATED' },
  { no: 6, date: '21 Des', day: 'Senin', airline: 'Garuda Indonesia', packageName: 'GA Mina 9D', route: 'CGK - Med', duration: '9 Hari', pic: 'Vera / Danny LA', status: 'FIX DATE' },
  { no: 7, date: '21 Des', day: 'Senin', airline: 'Lion Air', packageName: 'LION Muzdalifah 12D', route: 'CGK - Jed', duration: '12 Hari', pic: 'Hj. Eka', status: 'FIX DATE' },
  { no: 8, date: '23 Des', day: 'Rabu', airline: 'Garuda Indonesia', packageName: 'GA Arafah 9D', route: 'CGK - Med', duration: '9 Hari', pic: 'Henny HS', status: 'FIX DATE' },
  { no: 9, date: '23 Des', day: 'Rabu', airline: 'Garuda Indonesia', packageName: 'GA Muzdalifah 9D', route: 'CGK - Med', duration: '9 Hari', pic: 'Team Al Furqon', status: 'ESTIMATED' },
  { no: 10, date: '24 Des', day: 'Kamis', airline: 'Lion Air', packageName: 'LION Muzdalifah 9D', route: 'CGK - Jed', duration: '9 Hari', pic: 'Hj. Eka', status: 'FIX DATE' },
  { no: 11, date: '24 Des', day: 'Kamis', airline: 'Lion Air', packageName: 'LION Muzdalifah 9D', route: 'CGK - Jed', duration: '9 Hari', pic: 'Hj. Ros', status: 'FIX DATE' },
  { no: 12, date: '24 Des', day: 'Kamis', airline: 'Lion Air', packageName: 'LION Mina 9D', route: 'CGK - Jed', duration: '9 Hari', pic: 'Nurhidayah / Suherni / Hj. Eka', status: 'FIX DATE' },
  { no: 13, date: '24 Des', day: 'Kamis', airline: 'Lion Air', packageName: 'LION Mina 9D', route: 'CGK - Jed', duration: '9 Hari', pic: 'Ustd Ciptadi / Affu', status: 'FIX DATE' },
];

interface ScheduleSectionProps {
  onBookSchedule: (pkgTitle: string) => void;
}

export default function ScheduleSection({ onBookSchedule }: ScheduleSectionProps) {
  const [filterAirline, setFilterAirline] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isHotelModalOpen, setIsHotelModalOpen] = useState<boolean>(false);
  const facilitiesScrollRef = useRef<HTMLDivElement>(null);

  const handleFacilityScrollLeft = () => {
    if (facilitiesScrollRef.current) {
      facilitiesScrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const handleFacilityScrollRight = () => {
    if (facilitiesScrollRef.current) {
      facilitiesScrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const filteredSchedules = SCHEDULE_DATA.filter((item) => {
    const matchAirline = filterAirline === 'ALL' || item.airline === filterAirline;
    const matchStatus = filterStatus === 'ALL' || item.status === filterStatus;
    const matchSearch =
      item.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.route.toLowerCase().includes(searchQuery.toLowerCase());
    return matchAirline && matchStatus && matchSearch;
  });

  return (
    <section id="jadwal-umroh" className="w-full py-16 md:py-24 bg-transparent text-white relative">
      {/* Subtle warm glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Calendar size={14} />
            <span>Arminareka Kancab 009</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight mb-4 text-white">
            Jadwal Umroh <span className="font-bold italic font-['Cormorant_Garamond'] bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent">Desember 2026</span>
          </h2>
          <p className="text-base text-slate-300 italic">
            "Nyaman Ibadahnya, Berkesan Perjalanannya"
          </p>
        </div>

        {/* Filters & Search Toolbar */}
        <motion.div
          whileHover={{
            y: -4,
            transition: { duration: 0.3, ease: 'easeOut' },
          }}
          className="liquid-glass rounded-3xl p-6 sm:p-8 mb-8 border border-white/10 hover:border-amber-400/50 transition-all flex flex-col md:flex-row gap-6 items-center justify-between shadow-xl hover:shadow-2xl hover:shadow-amber-500/10"
        >
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-2xl px-4 py-2.5 w-full sm:w-72 focus-within:border-amber-400 transition-colors">
              <Search size={16} className="text-amber-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Cari paket, PIC, atau tanggal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none w-full"
              />
            </div>

            {/* Airline Filter */}
            <select
              value={filterAirline}
              onChange={(e) => setFilterAirline(e.target.value)}
              className="liquid-glass bg-slate-950/70 border border-amber-500/30 hover:border-amber-400 focus:border-amber-400 rounded-3xl px-5 py-3 text-sm text-slate-200 focus:outline-none cursor-pointer transition-all shadow-[0_0_15px_rgba(251,191,36,0.1)]"
            >
              <option value="ALL" className="bg-slate-950 text-amber-300 font-medium">Semua Maskapai</option>
              <option value="Garuda Indonesia" className="bg-slate-950 text-slate-200">Garuda Indonesia</option>
              <option value="Lion Air" className="bg-slate-950 text-slate-200">Lion Air</option>
              <option value="Saudia" className="bg-slate-950 text-slate-200">Saudia Airlines</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="liquid-glass bg-slate-950/60 border border-white/10 hover:border-amber-400/50 rounded-3xl px-5 py-3 text-sm text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer transition-all shadow-md"
            >
              <option value="ALL" className="bg-slate-950">Semua Status</option>
              <option value="FIX DATE" className="bg-slate-950">FIX DATE</option>
              <option value="ESTIMATED" className="bg-slate-950">ESTIMATED</option>
            </select>
          </div>

          <div className="text-xs sm:text-sm text-slate-300 font-medium bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
            Menampilkan <span className="text-amber-400 font-bold">{filteredSchedules.length}</span> jadwal keberangkatan
          </div>
        </motion.div>

        {/* Schedule Table / Cards Grid */}
        <motion.div
          whileHover={{
            y: -2,
            transition: { duration: 0.3, ease: 'easeOut' },
          }}
          className="liquid-glass bg-slate-950/60 border border-white/10 hover:border-amber-400/50 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md p-2 sm:p-4 transition-all"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/40 border-b border-white/10 text-xs uppercase tracking-wider text-amber-300 font-semibold">
                  <th className="py-4 px-4 text-center w-16">No</th>
                  <th className="py-4 px-4">Tanggal</th>
                  <th className="py-4 px-4">Maskapai</th>
                  <th className="py-4 px-4">Paket / Rute</th>
                  <th className="py-4 px-4 text-center">Durasi</th>
                  <th className="py-4 px-4">PIC / Tour Leader</th>
                  <th className="py-4 px-4 text-center">Keterangan</th>
                  <th className="py-4 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredSchedules.length > 0 ? (
                  filteredSchedules.map((item) => (
                    <motion.tr
                      key={item.no}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="py-4 px-4 text-center font-bold text-slate-400">{item.no}</td>
                      <td className="py-4 px-4 font-semibold text-white whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-amber-400" />
                          <span>{item.date}</span>
                          <span className="text-xs text-slate-400 font-normal">({item.day})</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.airline === 'Garuda Indonesia'
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                            : item.airline === 'Saudia'
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                            : 'bg-zinc-500/10 text-zinc-300 border border-zinc-500/20'
                        }`}>
                          <Plane size={12} />
                          {item.airline}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-100">{item.packageName}</div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{item.route}</div>
                      </td>
                      <td className="py-4 px-4 text-center font-medium text-amber-300">{item.duration}</td>
                      <td className="py-4 px-4 text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <UserCheck size={14} className="text-slate-400 flex-shrink-0" />
                          <span>{item.pic}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase ${
                          item.status === 'FIX DATE'
                            ? 'bg-amber-400 text-black font-extrabold shadow-lg shadow-amber-400/20'
                            : 'bg-white/10 text-slate-300 border border-white/20'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onBookSchedule(`${item.packageName} (${item.date} Desember 2026 - ${item.airline})`)}
                          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-bold text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
                        >
                          Booking Seat
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      Tidak ada jadwal yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Facilities footer banner */}
        <motion.div
          whileHover={{
            y: -2,
            transition: { duration: 0.3, ease: 'easeOut' },
          }}
          className="mt-12 liquid-glass bg-slate-950/60 border border-white/10 hover:border-amber-400/50 rounded-3xl p-6 sm:p-10 backdrop-blur-md shadow-2xl transition-all"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-white">
                Fasilitas Terbaik <span className="font-bold italic font-['Cormorant_Garamond'] bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent">Untuk Perjalanan Ibadah Anda</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2">
                Kenyamanan jamaah adalah prioritas utama Arminareka Kancab 009
              </p>
            </div>
            {/* Scroll Navigation Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleFacilityScrollLeft}
                className="w-10 h-10 rounded-full liquid-glass border border-white/20 flex items-center justify-center text-white/80 hover:text-amber-300 hover:border-amber-400/50 transition-all cursor-pointer shadow-md"
                aria-label="Geser Kiri"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={handleFacilityScrollRight}
                className="w-10 h-10 rounded-full liquid-glass border border-white/20 flex items-center justify-center text-white/80 hover:text-amber-300 hover:border-amber-400/50 transition-all cursor-pointer shadow-md"
                aria-label="Geser Kanan"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <div
            ref={facilitiesScrollRef}
            className="flex overflow-x-auto gap-6 pb-4 pt-2 px-2 no-scrollbar scroll-smooth snap-x snap-mandatory"
          >
            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="liquid-glass bg-slate-950/60 border border-white/10 hover:border-amber-400/50 rounded-3xl p-6 sm:p-8 transition-all shadow-lg flex flex-col items-center min-w-[280px] sm:min-w-[320px] max-w-[360px] shrink-0 snap-start text-center"
            >
              <motion.div
                whileHover={{ rotate: 8, scale: 1.15, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30 shadow-inner flex items-center justify-center mb-4"
              >
                <Plane className="w-6 h-6 text-amber-400" />
              </motion.div>
              <h4 className="text-sm font-bold text-white">Penerbangan Terpercaya</h4>
              <p className="text-xs text-slate-300 mt-1">Garuda, Lion & Saudia</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              onClick={() => setIsHotelModalOpen(true)}
              className="liquid-glass bg-slate-950/60 border border-white/10 hover:border-amber-400/50 rounded-3xl p-6 sm:p-8 transition-all shadow-lg flex flex-col items-center min-w-[280px] sm:min-w-[320px] max-w-[360px] shrink-0 snap-start text-center cursor-pointer relative group"
            >
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-medium border border-amber-400/30 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                Detail Hotel
              </div>
              <motion.div
                whileHover={{ rotate: 8, scale: 1.15, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30 shadow-inner flex items-center justify-center mb-4"
              >
                <Building2 className="w-6 h-6 text-amber-400" />
              </motion.div>
              <h4 className="text-sm font-bold text-white">Hotel Nyaman</h4>
              <p className="text-xs text-slate-300 mt-1">Mekah & Madinah</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Pilihan hotel strategis dan berkualitas</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="liquid-glass bg-slate-950/60 border border-white/10 hover:border-amber-400/50 rounded-3xl p-6 sm:p-8 transition-all shadow-lg flex flex-col items-center min-w-[280px] sm:min-w-[320px] max-w-[360px] shrink-0 snap-start text-center"
            >
              <motion.div
                whileHover={{ rotate: 8, scale: 1.15, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30 shadow-inner flex items-center justify-center mb-4"
              >
                <Bus className="w-6 h-6 text-amber-400" />
              </motion.div>
              <h4 className="text-sm font-bold text-white">Transportasi Nyaman</h4>
              <p className="text-xs text-slate-300 mt-1">Bus VIP Ber-AC</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="liquid-glass bg-slate-950/60 border border-white/10 hover:border-amber-400/50 rounded-3xl p-6 sm:p-8 transition-all shadow-lg flex flex-col items-center min-w-[280px] sm:min-w-[320px] max-w-[360px] shrink-0 snap-start text-center"
            >
              <motion.div
                whileHover={{ rotate: 8, scale: 1.15, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30 shadow-inner flex items-center justify-center mb-4"
              >
                <Utensils className="w-6 h-6 text-amber-400" />
              </motion.div>
              <h4 className="text-sm font-bold text-white">Makan 3x Sehari</h4>
              <p className="text-xs text-slate-300 mt-1">Full Board Menu Indonesia</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="liquid-glass bg-slate-950/60 border border-white/10 hover:border-amber-400/50 rounded-3xl p-6 sm:p-8 transition-all shadow-lg flex flex-col items-center min-w-[280px] sm:min-w-[320px] max-w-[360px] shrink-0 snap-start text-center"
            >
              <motion.div
                whileHover={{ rotate: 8, scale: 1.15, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30 shadow-inner flex items-center justify-center mb-4"
              >
                <Users className="w-6 h-6 text-amber-400" />
              </motion.div>
              <h4 className="text-sm font-bold text-white">Muthawif &amp; TL</h4>
              <p className="text-xs text-slate-300 mt-1">Berpengalaman &amp; Profesional</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="liquid-glass bg-slate-950/60 border border-white/10 hover:border-amber-400/50 rounded-3xl p-6 sm:p-8 transition-all shadow-lg flex flex-col items-center min-w-[280px] sm:min-w-[320px] max-w-[360px] shrink-0 snap-start text-center"
            >
              <motion.div
                whileHover={{ rotate: 8, scale: 1.15, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30 shadow-inner flex items-center justify-center mb-4"
              >
                <Briefcase className="w-6 h-6 text-amber-400" />
              </motion.div>
              <h4 className="text-sm font-bold text-white">Perlengkapan Lengkap</h4>
              <p className="text-xs text-slate-300 mt-1">Koper &amp; Atribut Eksklusif</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="liquid-glass bg-slate-950/60 border border-white/10 hover:border-amber-400/50 rounded-3xl p-6 sm:p-8 transition-all shadow-lg flex flex-col items-center min-w-[280px] sm:min-w-[320px] max-w-[360px] shrink-0 snap-start text-center"
            >
              <motion.div
                whileHover={{ rotate: 8, scale: 1.15, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30 shadow-inner flex items-center justify-center mb-4"
              >
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              </motion.div>
              <h4 className="text-sm font-bold text-white">Pelayanan Terbaik</h4>
              <p className="text-xs text-slate-300 mt-1">Standar pelayanan tinggi dan profesional</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="liquid-glass bg-slate-950/60 border border-white/10 hover:border-amber-400/50 rounded-3xl p-6 sm:p-8 transition-all shadow-lg flex flex-col items-center min-w-[280px] sm:min-w-[320px] max-w-[360px] shrink-0 snap-start text-center"
            >
              <motion.div
                whileHover={{ rotate: 8, scale: 1.15, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30 shadow-inner flex items-center justify-center mb-4"
              >
                <CheckCircle2 className="w-6 h-6 text-amber-400" />
              </motion.div>
              <h4 className="text-sm font-bold text-white">Fasilitas Lengkap</h4>
              <p className="text-xs text-slate-300 mt-1">Perjalanan ibadah yang nyaman dan berkesan</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Hotel Bintang Pilihan Detail Modal */}
      {isHotelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto liquid-glass bg-slate-900/95 border border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white"
          >
            <button
              onClick={() => setIsHotelModalOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1 block">POSISI HOTEL PILIHAN DI MEKKAH</span>
              <h3 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
                Arminareka <span className="font-bold italic font-['Cormorant_Garamond'] bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 bg-clip-text text-transparent">- Antara Anda dan Baitullah</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 italic">
                Hotel pilihan terbaik Arminareka yang berlokasi sangat dekat dengan Masjidil Haram.
              </p>
            </div>

            <div className="space-y-6 text-sm text-slate-200">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                <h4 className="font-bold text-amber-300 uppercase text-xs tracking-wider mb-2 flex items-center gap-2">
                  <Building2 size={16} /> Area & Lokasi Hotel
                </h4>
                
                <div className="space-y-4 mt-3">
                  <div>
                    <h5 className="font-semibold text-white">KOMPLEKS ABRAJ AL BAIT</h5>
                    <p className="text-xs text-slate-300 mb-2">Hotel-hotel berlokasi di dalam kompleks Abraj Al Bait, tepat menghadap Masjidil Haram dan akses langsung ke pelataran.</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full text-xs bg-amber-400/10 border border-amber-400/30 text-amber-200">Marwa Rotana</span>
                      <span className="px-3 py-1 rounded-full text-xs bg-amber-400/10 border border-amber-400/30 text-amber-200">Movenpick</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <h5 className="font-semibold text-white">KAWASAN AJYAD</h5>
                    <p className="text-xs text-slate-300 mb-2">Hotel-hotel pilihan Arminareka di kawasan Ajyad, hanya beberapa langkah menuju Masjidil Haram.</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full text-xs bg-amber-400/10 border border-amber-400/30 text-amber-200">Arrayana</span>
                      <span className="px-3 py-1 rounded-full text-xs bg-amber-400/10 border border-amber-400/30 text-amber-200">Prestige</span>
                      <span className="px-3 py-1 rounded-full text-xs bg-amber-400/10 border border-amber-400/30 text-amber-200">Ajyad Makareem</span>
                      <span className="px-3 py-1 rounded-full text-xs bg-amber-400/10 border border-amber-400/30 text-amber-200">Sofwa Orchid</span>
                      <span className="px-3 py-1 rounded-full text-xs bg-amber-400/10 border border-amber-400/30 text-amber-200">Mekkah Tower</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                <h4 className="font-bold text-amber-300 uppercase text-xs tracking-wider mb-2">AKSES TERDEKAT</h4>
                <p className="text-xs text-slate-300">Selangkah menuju pintu masuk Masjidil Haram melalui King Abdul Aziz Gate.</p>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                <h4 className="font-bold text-amber-300 uppercase text-xs tracking-wider mb-3">KEUNGGULAN LOKASI HOTEL</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Sangat Dekat</strong>
                      <span className="text-slate-300">Hanya beberapa langkah menuju Masjidil Haram.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Akses Langsung</strong>
                      <span className="text-slate-300">Akses mudah ke pelataran dan berbagai pintu masuk.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Pemandangan Haram</strong>
                      <span className="text-slate-300">Nikmati pemandangan indah Masjidil Haram dari kamar hotel.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Fasilitas Nyaman</strong>
                      <span className="text-slate-300">Layanan terbaik dan fasilitas premium untuk kenyamanan Anda beribadah.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2 border-t border-white/10">
                <p className="text-xs text-amber-300/90 italic">
                  "Arminareka berkomitmen memberikan pelayanan terbaik untuk perjalanan ibadah yang nyaman dan berkesan."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
