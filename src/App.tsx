/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import heroVideo from '../assets/hero-video.mp4';
import {
  Music2,
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Sparkles,
  ArrowUpRight,
  Compass,
  Globe,
  Calendar,
  ShieldCheck,
  MessageCircle,
  Menu,
  X,
  Mail,
  Volume2,
  VolumeX,
} from 'lucide-react';

import StatsSection from './components/StatsSection';
import FeaturedPackages from './components/FeaturedPackages';
import ScheduleSection from './components/ScheduleSection';
import WhyChooseUs from './components/WhyChooseUs';
import AboutConsultant from './components/AboutConsultant';
import GallerySection from './components/GallerySection';
import TestimonialsSection from './components/TestimonialsSection';
import ConsultationSection from './components/ConsultationSection';
import PackageModal from './components/PackageModal';
import ChatbotWidget from './components/ChatbotWidget';

import { Destination, TravelPackage } from './types';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const toggleMusic = () => {
    const videoEl = document.getElementById('bg-hero-video') as HTMLVideoElement;
    let audio = audioElement;
    if (!audio) {
      audio = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf756.mp3?filename=spiritual-ambient-111214.mp3');
      audio.loop = true;
      audio.volume = 0.3;
      setAudioElement(audio);
    }

    if (isPlayingMusic) {
      // Mute / Turn Off
      if (videoEl) {
        videoEl.muted = true;
      }
      audio.pause();
      setIsPlayingMusic(false);
    } else {
      // Unmute / Turn On
      if (videoEl) {
        videoEl.muted = false;
        videoEl.play().catch(() => {});
      }
      audio.play().then(() => {
        setIsPlayingMusic(true);
      }).catch(err => {
        console.log("Audio play prevented:", err);
        setIsPlayingMusic(true);
      });
    }
  };

  const handleDirectWhatsApp = (subject: string) => {
    const text = encodeURIComponent(
      `Assalamualaikum Kak, Aku siap Berangkat Umrah & Haji, Boleh dibantu...??\n\n(Tertarik dengan paket/destinasi: ${subject})`
    );
    window.open(`https://wa.me/6281310508974?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const navLinks = [
    { label: 'Paket & Jadwal', href: '#paket-unggulan' },
    { label: 'Jadwal Desember', href: '#jadwal-umroh' },
    { label: 'Keunggulan', href: '#keunggulan-layanan' },
    { label: 'Profil Leader', href: '#profil-konsultan' },
    { label: 'Galeri', href: '#galeri-dokumentasi' },
    { label: 'Testimoni', href: '#testimoni-jamaah' },
  ];

  const umrohLinks = [
    'Umroh Reguler 9 / 12 Hari',
    'Umroh Ramadhan & Syawal VIP',
    'Umroh Plus Turki & Cappadocia',
    'Umroh Plus Dubai & Abu Dhabi',
    'Umroh Private Family & VIP',
  ];

  const hajiLinks = [
    'Haji Khusus (Haji Plus)',
    'Haji Furoda (Tanpa Antri)',
    'Program Tabungan Umroh',
    'Syarat & Pendaftaran Resmi',
    'Cek Estimasi Keberangkatan',
  ];

  const layananLinks = [
    'Bimbingan Manasik Lengkap',
    'Hotel Bintang 5 Ring 1',
    'Muthawif & Tour Leader Resmi',
    'Jaminan Makanan 100% Halal',
    'Konsultasi WhatsApp 24/7',
  ];

  const socialLinks = [
    { icon: Music2, name: 'TikTok', href: '#' },
    { icon: Facebook, name: 'Facebook', href: '#' },
    { icon: Twitter, name: 'Twitter / X', href: '#' },
    { icon: Youtube, name: 'YouTube', href: '#' },
    { icon: Instagram, name: 'Instagram', href: '#' },
  ];

  return (
    <main
      id="main-app-container"
      className="relative w-full min-h-screen overflow-x-hidden flex flex-col items-center font-sans selection:bg-amber-400/30 selection:text-amber-200"
    >
      {/* Background Hero Video */}
      <video
        id="bg-hero-video"
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover object-[35%_center] sm:object-[20%_center] md:object-center z-[0]"
      />

      {/* Atmospheric Overlays for Contrast and Depth */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90 pointer-events-none z-[1]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/70 pointer-events-none z-[1]" />

      {/* Main Container */}
      <div
        id="content-wrapper"
        className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-10 flex flex-col items-center"
      >
        {/* Top Navigation Bar */}
        <header
          id="top-nav-header"
          style={{ paddingTop: '14px', marginTop: '-16px' }}
          className="liquid-glass w-full rounded-full px-5 sm:px-8 py-3.5 mb-12 md:mb-20 flex items-center justify-between border border-white/15 sticky top-4 z-40 backdrop-blur-md"
        >
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Compass size={18} />
            </div>
            <div className="text-center flex flex-col items-center">
              <span className="text-white font-bold text-base tracking-wider block leading-none">
                Arminareka
              </span>
              <span className="text-[10px] text-amber-300 font-medium tracking-wider uppercase">
                Kancab 09 Tangerang
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs text-white/80 font-medium">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="hover:text-amber-300 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Action Button & Music Toggle & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Transparent Music Toggle Icon Button */}
            <button
              onClick={toggleMusic}
              aria-label="Toggle Background Music"
              className="liquid-glass bg-slate-950/40 border border-amber-500/30 hover:border-amber-400 text-amber-300 p-2.5 rounded-full flex items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(251,191,36,0.1)] transition-all duration-300 hover:scale-105 group relative"
            >
              <div className="relative flex items-center justify-center w-4 h-4">
                {isPlayingMusic ? (
                  <>
                    <Volume2 size={16} className="text-amber-400 animate-pulse" />
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                  </>
                ) : (
                  <VolumeX size={16} className="text-slate-400 group-hover:text-amber-300 transition-colors" />
                )}
              </div>
            </button>

            <a
              href="#konsultasi"
              className="text-[10px] sm:text-xs uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold shadow-md shadow-amber-500/20 transition-all flex flex-col items-center justify-center text-center leading-tight mx-auto"
            >
              <span className="block text-center w-full">Konsultasi</span>
              <span className="block text-center w-full">Free</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-white/80 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden w-full liquid-glass rounded-2xl p-6 mb-8 border border-white/15 flex flex-col gap-3 text-sm text-white/90">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-white/10 hover:text-amber-300"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}

        {/* Hero Section */}
        <section
          id="upper-hero-cta"
          style={{ marginTop: '86px' }}
          className="w-full flex flex-col items-center text-center my-auto py-10 md:py-24 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >

            {/* Person Name Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="font-light text-white tracking-tight leading-tight mb-6"
            >
              <span
                id="hero-person-name"
                className="block font-bold italic font-['Cormorant_Garamond'] text-3xl sm:text-5xl md:text-6xl lg:text-7xl animate-shine-gold mb-2 tracking-wide drop-shadow-[0_0_35px_rgba(245,158,11,0.8)] pb-1"
              >
                Hj. Triana Indrian SE
              </span>
              <span className="block text-2xl sm:text-4xl md:text-5xl font-light text-white/95">
                Antara Anda &amp; Baitullah
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
              className="text-base sm:text-lg md:text-xl text-white/90 font-normal max-w-2xl mb-10 leading-relaxed"
            >
              Menyajikan pelayanan umroh dan haji plus dengan mengedepankan kualitas, kenyamanan hotel bintang 5, serta kepuasan jamaah dalam menjelajahi keindahan peradaban dunia.
            </motion.p>

            {/* Hero CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <motion.a
                href="#konsultasi"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="liquid-glass group inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white font-medium text-sm transition-colors hover:bg-white/10 hover:shadow-xl cursor-pointer border border-white/20"
              >
                <span>Konsultasi Free</span>
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-amber-300"
                />
              </motion.a>

              <motion.a
                href="#paket-unggulan"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-black font-bold bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-sm transition-all shadow-lg shadow-amber-500/25 cursor-pointer"
              >
                <Compass size={16} />
                <span>Lihat Paket &amp; Jadwal</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </section>

        {/* 1. Stats & Reputation Milestones */}
        <StatsSection />

        {/* 2. Featured Packages & Schedules */}
        <FeaturedPackages
          onSelectPackage={(pkg) => setSelectedPackage(pkg)}
          onBookDirect={handleDirectWhatsApp}
        />

        {/* 3. December 2026 Schedule Table */}
        <ScheduleSection
          onBookSchedule={handleDirectWhatsApp}
        />

        {/* 4. International Service Standards (Why Choose Us) */}
        <WhyChooseUs />

        {/* 5. Consultant Leader Profile: Hj. Triana Indrian SE */}
        <AboutConsultant
          onConsultClick={() => handleDirectWhatsApp('Konsultasi Privat bersama Hj. Triana Indrian SE')}
        />

        {/* 6. Travel & Pilgrimage Documentation Gallery */}
        <GallerySection />

        {/* 7. Client & Pilgrim Testimonials */}
        <TestimonialsSection />

        {/* 8. Instant Consultation & Booking Form */}
        <ConsultationSection />

        {/* Liquid Glass Footer */}
        <motion.footer
          id="liquid-glass-footer"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="liquid-glass w-full rounded-3xl p-6 md:p-12 text-white/70 mt-20 md:mt-32 border border-white/15"
        >
          {/* Top Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-12">
            {/* First Column: Logo & Description */}
            <div className="md:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-white mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                    <Compass size={22} />
                  </div>
                  <div>
                    <span className="text-xl font-bold tracking-wider block">Arminareka</span>
                    <span className="text-xs text-amber-300 uppercase tracking-widest font-semibold">
                      Hj. Triana Indrian SE
                    </span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed max-w-sm text-white/75 mb-6">
                  Menyajikan pelayanan umroh, haji plus, dan wisata halal dunia dengan mengedepankan kualitas, kenyamanan akomodasi bintang 5, serta kepuasan jamaah berlandaskan Al-Qur'an dan As-Sunnah.
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-amber-300">
                    <ShieldCheck size={14} />
                    <span>Izin Resmi PPIU &amp; PIHK Kemenag RI</span>
                  </div>
                  <a
                    href="mailto:triana.indrian180774@gmail.com"
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs text-amber-300 hover:bg-amber-400/20 transition-colors"
                  >
                    <Mail size={14} />
                    <span>triana.indrian180774@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Second Column: 3-column Links Section */}
            <div className="md:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {/* Paket Umroh */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-amber-300 font-bold mb-4">
                    Paket Umroh
                  </h3>
                  <ul className="text-xs space-y-2.5">
                    {umrohLinks.map((link) => (
                      <li key={link}>
                        <a
                          href="#paket-unggulan"
                          className="hover:text-white transition-colors block text-white/75"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Haji & Tabungan */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-amber-300 font-bold mb-4">
                    Haji &amp; Tabungan
                  </h3>
                  <ul className="text-xs space-y-2.5">
                    {hajiLinks.map((link) => (
                      <li key={link}>
                        <a
                          href="#konsultasi"
                          className="hover:text-white transition-colors block text-white/75"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Layanan Jamaah */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-amber-300 font-bold mb-4">
                    Layanan Jamaah
                  </h3>
                  <ul className="text-xs space-y-2.5">
                    {layananLinks.map((link) => (
                      <li key={link}>
                        <a
                          href="#keunggulan-layanan"
                          className="hover:text-white transition-colors block text-white/75"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
            <p className="text-xs opacity-60">
              © 2026 Arminareka - Hj. Triana Indrian SE. Melayani Jamaah &amp; Wisatawan Menuju Keberkahan Dunia.
            </p>

            <div className="flex items-center gap-4 flex-wrap justify-center">
              <span className="text-xs opacity-60">
                Media Sosial &amp; Info Jamaah:
              </span>
              <div className="flex items-center gap-3">
                {socialLinks.map(({ icon: Icon, name, href }) => (
                  <a
                    key={name}
                    href={href}
                    aria-label={name}
                    className="opacity-70 hover:opacity-100 transition-colors hover:text-amber-300 p-1"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.footer>
      </div>

      {/* Detail / Itinerary Inspection Modal */}
      <PackageModal
        pkg={selectedPackage}
        dest={selectedDestination}
        onClose={() => {
          setSelectedPackage(null);
          setSelectedDestination(null);
        }}
        onBook={handleDirectWhatsApp}
      />

      {/* Floating AI Chatbot Assistant Ka Lila */}
      <ChatbotWidget />
    </main>
  );
}
