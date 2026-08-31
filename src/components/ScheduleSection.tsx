import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Plane, ShieldCheck, UserCheck, Clock, CheckCircle2, Search, Filter } from 'lucide-react';

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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Jadwal Umroh <span className="text-amber-400">Desember 2026</span>
          </h2>
          <p className="text-base text-slate-300 italic">
            "🌸 Nyaman Ibadahnya, Berkesan Perjalanannya 🌸"
          </p>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 sm:p-6 mb-8 backdrop-blur-md flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-xl px-3 py-2 w-full sm:w-64 focus-within:border-amber-400 transition-colors">
              <Search size={16} className="text-slate-400" />
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
              className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-400"
            >
              <option value="ALL" className="bg-slate-900">Semua Maskapai</option>
              <option value="Garuda Indonesia" className="bg-slate-900">Garuda Indonesia</option>
              <option value="Lion Air" className="bg-slate-900">Lion Air</option>
              <option value="Saudia" className="bg-slate-900">Saudia Airlines</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-400"
            >
              <option value="ALL" className="bg-slate-900">Semua Status</option>
              <option value="FIX DATE" className="bg-slate-900">FIX DATE</option>
              <option value="ESTIMATED" className="bg-slate-900">ESTIMATED</option>
            </select>
          </div>

          <div className="text-xs text-slate-400">
            Menampilkan <span className="text-amber-400 font-bold">{filteredSchedules.length}</span> jadwal keberangkatan
          </div>
        </div>

        {/* Schedule Table / Cards Grid */}
        <div className="bg-slate-900/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
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
        </div>

        {/* Facilities footer banner */}
        <div className="mt-12 bg-slate-900 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl">
          <div className="text-center mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-amber-300 uppercase tracking-wider">
              Fasilitas Terbaik Untuk Perjalanan Ibadah Anda
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Kenyamanan jamaah adalah prioritas utama Arminareka Kancab 009
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            <div className="p-4 rounded-xl bg-black/40 border border-white/10">
              <span className="block text-xl mb-1">✈️</span>
              <h4 className="text-xs font-bold text-white">Penerbangan Terpercaya</h4>
              <p className="text-[10px] text-slate-400 mt-1">Garuda, Lion & Saudia</p>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10">
              <span className="block text-xl mb-1">🏨</span>
              <h4 className="text-xs font-bold text-white">Hotel Bintang Pilihan</h4>
              <p className="text-[10px] text-slate-400 mt-1">Mekkah & Madinah</p>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10">
              <span className="block text-xl mb-1">🚌</span>
              <h4 className="text-xs font-bold text-white">Transportasi Nyaman</h4>
              <p className="text-[10px] text-slate-400 mt-1">Bus VIP Ber-AC</p>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10">
              <span className="block text-xl mb-1">🍽️</span>
              <h4 className="text-xs font-bold text-white">Makan 3x Sehari</h4>
              <p className="text-[10px] text-slate-400 mt-1">Full Board Menu Indonesia</p>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10">
              <span className="block text-xl mb-1">👳‍♂️</span>
              <h4 className="text-xs font-bold text-white">Muthawif &amp; TL</h4>
              <p className="text-[10px] text-slate-400 mt-1">Berpengalaman &amp; Profesional</p>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10">
              <span className="block text-xl mb-1">🧳</span>
              <h4 className="text-xs font-bold text-white">Perlengkapan Lengkap</h4>
              <p className="text-[10px] text-slate-400 mt-1">Koper &amp; Atribut Eksklusif</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
