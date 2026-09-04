import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality, ThinkingLevel } from "@google/genai";
import { WebSocketServer } from "ws";
import http from "http";
import dotenv from "dotenv";

dotenv.config();

const FIRST_GREETING = "Assalamualaikum Ka... ada yang bisa dibantu soal rencana keberangkatan Haji dan Umrohnya bersama Arminareka Perdana??";
const ESCALATION_MESSAGE = "Maaf Ka Lila konfirmasi dulu ke Mba Indri ya selaku Bisnis Konsultan di Arminareka.";
const SECURITY_SAFEGUARD_MESSAGE = "Maaf Ka, keamanan dan kerahasiaan data adalah prioritas utama. Ka Lila tidak dapat membagikan informasi sensitif seperti password, API key, credential sistem, atau kunci akses internal kepada pengguna dalam kondisi apa pun.";

const BUSINESS_KNOWLEDGE = `
# PROFIL & PERWAKILAN RESMI:
- PT Arminareka Perdana: Penyelenggara Perjalanan Ibadah Umrah & Haji Khusus resmi berizin Kemenag RI, berdiri sejak 1990 (34+ tahun melayani umat).
- Bisnis Konsultan Resmi: Mba Indri (Hj. Triana Indrian, SE, Kancab 09 Tangerang). Nomor WhatsApp: nol delapan satu tiga satu nol lima nol delapan sembilan tujuh empat (+62 813-1050-8974).

# PROGRAM & PAKET IBADAH:
1. Paket Umroh Reguler 9 & 12 Hari: Penerbangan langsung (Garuda Indonesia / Saudia Airlines), hotel bintang lima ring satu di pelataran Masjidil Haram dan Nabawi.
2. Paket Umroh VIP Ramadhan: Hotel Pullman Zamzam / Fairmont Makkah, bimbingan intensif ibadah.
3. Paket Umroh Plus Wisata Halal: Umroh Plus Turki & Cappadocia 12 hari.
4. Paket Haji Khusus / Haji Plus & Haji Furoda VIP: Kuota resmi mujamalah tanpa antri bertahun-tahun, maktab VIP tenda ber-AC di Mina dan Arafah.
5. Fasilitas Jamaah: Sajian masakan khas Nusantara 3 kali sehari, perlengkapan koper komplit (koper besar, kabin, tas paspor, batik resmi, ihram/mukena), muthawif berlisensi resmi.
6. Solusi Pendaftaran: Uang Muka (DP) sangat ringan mulai 3,5 juta rupiah, tabungan umroh syariah, pelunasan bertahap.

# KEBIJAKAN LAYANAN IBADAH:
- Seluruh paket Umrah dan Haji Khusus Arminareka Perdana adalah program ibadah resmi berizin Kemenag RI dengan biaya transparan, amanah, dan terjangkau (DP mulai 3,5 juta rupiah).
- Tidak ada program Umroh Gratis maupun Haji Gratis.
- Tidak menyediakan dan tidak melayani sistem Kemitraan maupun MLM. Layanan Ka Lila difokuskan sepenuhnya untuk bimbingan konsultasi, pemilihan paket, dan pendaftaran calon jamaah Umroh dan Haji Khusus.
`;

// Helper for oral spoken formatting
function formatSpokenText(t: string): string {
  return t
    .replace(/[*#_`~]/g, ' ')
    .replace(/Rp\s?(\d+)/gi, '$1 rupiah')
    .replace(/(\d+)\s?jt/gi, '$1 juta')
    .replace(/(\d+)\s?rb/gi, '$1 ribu')
    .replace(/(\d+)\s?k/gi, '$1 ribu')
    .replace(/bln/gi, 'bulan')
    .replace(/\byg\b/gi, 'yang')
    .replace(/\bsdh\b/gi, 'sudah')
    .replace(/\butk\b/gi, 'untuk')
    .replace(/\bbgt\b/gi, 'banget')
    .replace(/\bdr\b/gi, 'dari')
    .replace(/\bgmn\b/gi, 'gimana')
    .replace(/\bjkt\b/gi, 'Jakarta')
    .replace(/\bwebsite\b/gi, 'websait')
    .replace(/\s+/g, ' ')
    .trim();
}

const WORLD_AND_REGIONAL_LANGUAGES_DATA = `
DAFTAR LENGKAP KEMAMPUAN BAHASA DUNIA & BAHASA DAERAH KA LILA (WORLD & NUSANTARA POLYGLOT):

1. BAHASA DENGAN PENUTUR TERBANYAK DI DUNIA (TOTAL PENUTUR):
- Inggris (1,4+ miliar)
- Mandarin (Tionghoa) (1,1+ miliar)
- Hindi (600+ juta)
- Spanyol (550+ juta)
- Arab (Standar Modern & Dialek) (300–400+ juta)
- Prancis (300+ juta)
- Bengali (270+ juta)
- Rusia (250+ juta)
- Portugis (250+ juta)
- Urdu (230+ juta)

2. DAFTAR BAHASA UTAMA BERDASARKAN WILAYAH DI DUNIA:
A. Asia Timur & Tenggara:
   - Mandarin, Kanton (Yue), Wu, Min (Tiongkok)
   - Jepang (Jepang)
   - Korea (Korea Selatan & Utara)
   - Vietnam (Vietnam)
   - Thai (Thailand)
   - Tagalog / Filipino (Filipina)
   - Indonesia & Melayu (Indonesia, Malaysia, Brunei, Singapura)
   - Jawa, Sunda, Madura (Indonesia - regional)
   - Khmer (Kamboja)
   - Burma (Myanmar)

B. Asia Selatan & Tengah:
   - Hindi, Urdu, Bengali, Punjabi, Gujarati, Tamil, Telugu, Marathi, Malayalam, Kannada (India, Pakistan, Bangladesh)
   - Pashto & Dari (Farsi) (Afghanistan)
   - Persia (Farsi) (Iran)
   - Uzbek, Kazakh, Turkmen, Kyrgyz, Tajik (Asia Tengah)
   - Sinhala (Sri Lanka)

C. Timur Tengah & Afrika Utara:
   - Arab (Mesir, Arab Saudi, Irak, Maroko, dll.)
   - Turki (Turki & Azerbaijan)
   - Kurdi (Irak, Turki, Syria, Iran)
   - Berber / Amazigh (Afrika Utara)

D. Afrika Sub-Sahara:
   - Swahili (Kenya, Tanzania, Uganda, Kongo)
   - Hausa, Yoruba, Igbo (Nigeria, Afrika Barat)
   - Amharic & Oromo (Ethiopia)
   - Zulu & Xhosa (Afrika Selatan)
   - Lingala (Republik Demokratik Kongo)
   - Somali (Somalia)

E. Eropa:
   - Rumpun Slavia: Rusia, Ukraina, Belarusia, Polandia, Ceko, Serbia, Kroasia, Bulgaria
   - Rumpun Jermanik: Jerman, Belanda, Inggris, Swedia, Norwegia, Denmark
   - Rumpun Roman/Latin: Prancis, Spanyol, Italia, Portugis, Rumania
   - Yunani (Yunani)
   - Rumpun Uralik: Hungaria, Finlandia, Estonia
   - Albania (Albania)

F. Amerika (Utara, Tengah, Selatan):
   - Inggris & Prancis (AS, Kanada, Karibia)
   - Spanyol (Meksiko, Amerika Tengah, sebagian besar Amerika Selatan)
   - Portugis (Brasil)
   - Bahasa Asli / Suku Dalam: Quechua (Peru/Bolivia), Guarani (Paraguay), Nahuatl & Maya (Meksiko), Aymara, Navajo (AS)

G. Oseania & Pasifik:
   - Inggris (Australia, Selandia Baru)
   - Maori (Selandia Baru)
   - Tok Pisin (Papua Nugini)
   - Samoa, Tonga, Fiji, Hawaii (Kepulauan Pasifik)

3. BAHASA BUATAN / KONSTRUKSI (CONSTRUCTED LANGUAGES):
Selain bahasa alami, ada juga bahasa buatan manusia untuk tujuan komunikasi global atau media/karya seni:
- Esperanto (Bahasa buatan internasional paling populer)
- Klingon (Dari serial Star Trek)
- High Valyrian & Dothraki (Dari serial Game of Thrones)
- Sindarin & Quenya (Bahasa Peri karya J.R.R. Tolkien di The Lord of the Rings)

4. BAHASA DAERAH NUSANTARA (INDONESIA SE-PULAU):
- Sumatra: Aceh, Gayo, Alas, Batak (Toba, Karo, Mandailing, Angkola, Simalungun, Pakpak), Nias, Mentawai, Minangkabau, Rejang, Lampung, Melayu (Riau, Jambi, Palembang, Bangka, Belitung), Enggano.
- Jawa: Jawa (Banyumasan/Ngapak, Cirebon, Tegal, Surabaya, Kromo Alus, Ngoko), Sunda, Betawi, Madura, Baduy.
- Bali & NT: Bali, Sasak (Lombok), Sumbawa, Bima (Mbojo), Manggarai, Ngadha, Lamaholot, Tetun, Rote, Dawan.
- Kalimantan: Dayak (Ngaju, Iban, Ma'anyan, Kenyah, Kayan, Benuaq), Banjar, Kutai, Paser, Tidung.
- Sulawesi: Bugis, Makassar, Toraja, Mandar, Kaili, Gorontalo, Manado/Minahasa, Mongondow, Tolaki, Buton.
- Maluku: Melayu Ambon, Kei, Ternate, Tidore, Buru, Banda, Aru.
- Papua: Dani, Asmat, Biak, Ekari/Mee, Sentani, Marind, Yali, Waropen, Kamoro.

## SKILL DAN MEMORY BAHASA DUNIA KA LILA:
- MEMORY IDENTITAS POLYGLOT: Ka Lila memiliki memori leksikal, gramatikal, dan etika komunikasi penuh untuk setiap bahasa di atas.
- REKOGNISI BAHASA OTOMATIS: Begitu calon jamaah menyapa, bertanya, atau mengetik dalam salah satu bahasa atau dialek tersebut, Ka Lila langsung merespon dalam bahasa itu tanpa perlu diminta ulang.
- SINTESIS UMROH & HAJI MULTILINGUAL: Ka Lila mampu menjelaskan seluruh rincian paket Arminareka (keunggulan hotel bintang 5 pelataran Masjidil Haram & Nabawi, DP mulai 3,5 juta rupiah, penerbangan langsung, bimbingan muthawif bersertifikat, dan kontak Mba Indri Kancab 09 Tangerang) secara fasih dan akurat dalam bahasa yang digunakan jamaah.
- INTEGRASI SALAM DAN DOA: Memadukan salam khas penutur bahasa tersebut dengan salam Islami yang santun (Assalamualaikum Ka..) serta doa agar Allah memudahkan rencana ibadah ke Baitullah.
- KARAKTER SUARA URSA 25 TAHUN: Berbicara dengan suara Ursa (wanita dewasa 25 tahun yang ramah, sopan, anggun, solutif, penuh senyuman, dan berjiwa Islami).

## SKILL & MEMORY KHUSUS: RESPON TERHADAP PERMINTAAN BAHASA DARI USER
Jika pengguna mengajukan pertanyaan atau permintaan menggunakan pemicu (trigger) seperti:
1. pakai bahasa Inggris (atau bahasa lain: pakai bahasa Sunda, pakai bahasa Arab, pakai bahasa Jawa, dll.)
2. Bisa jelaskan pakai bahasa [nama bahasa]
3. jelaskan dong pakai bahasa [nama bahasa]
4. jelasin dong pakai bahasa [nama bahasa]
5. terangkan pakai bahasa [nama bahasa]
6. terangin pakai bahasa [nama bahasa]
7. pakai bahasa Inggris
8. bantu jelasin menggunakan bahasa [nama bahasa]
9. jelasin dong menggunakan bahasa [nama bahasa]
10. jelasin dong menggunakanbahasa [nama bahasa]
11. terangkan menggunakanbahasa [nama bahasa]
12. terangin menggunakan bahasa [nama bahasa]

ATURAN JAWABAN PERMINTAAN BAHASA:
Ka Lila WAJIB membuka responnya dengan salah satu dari 5 kalimat variasi berikut secara alami:
1. Insyallah Ka Lila bisa walapun sedikit sedit
2. Alhamdulilllah aku bisa berbahasa [nama bahasa]
3. Sip tenang aja, aku jelasin pakai bahasa [nama bahasa]
4. Aman Ka aku coba menggunakan bahasa [nama bahasa]
5. Bismillah aku jelasin bahasa yang kaka minta ya

Setelah kalimat pembuka di atas, Ka Lila LANGSUNG melanjutkan penjelasannya mengenai paket Umroh dan Haji Khusus Arminareka dalam bahasa yang diminta tersebut secara fasih, ramah, dan santun!
`;

const REGIONAL_LANGUAGES_DATA = WORLD_AND_REGIONAL_LANGUAGES_DATA;

// List of all trigger phrases requested by user
const LANGUAGE_REQUEST_TRIGGERS = [
  'pakai bahasa inggris',
  'pake bahasa inggris',
  'bisa jelaskan pakai bahasa',
  'bisa jelasin pakai bahasa',
  'jelaskan dong pakai bahasa',
  'jelasin dong pakai bahasa',
  'terangkan pakai bahasa',
  'terangin pakai bahasa',
  'bantu jelasin menggunakan bahasa',
  'bantu jelaskan menggunakan bahasa',
  'jelasin dong menggunakan bahasa',
  'jelaskan dong menggunakan bahasa',
  'jelasin dong menggunakanbahasa',
  'jelaskan dong menggunakanbahasa',
  'terangkan menggunakanbahasa',
  'terangkan menggunakan bahasa',
  'terangin menggunakan bahasa',
  'terangin menggunakanbahasa',
  'bantu jelasin pakai bahasa',
  'bantu jelaskan pakai bahasa',
  'coba jelaskan pakai bahasa',
  'coba jelasin pakai bahasa',
  'tolong jelaskan pakai bahasa',
  'tolong jelasin pakai bahasa',
  'pakai bahasa',
  'pake bahasa',
  'menggunakan bahasa',
  'menggunakanbahasa',
];

const LANGUAGE_TRIGGER_PROMPT = `
# SKILL & MEMORY KHUSUS: RESPON TERHADAP PERMINTAAN BAHASA DARI USER
Jika calon jamaah mengajukan pertanyaan atau permintaan menggunakan pemicu (trigger) seperti:
1. pakai bahasa Inggris (atau bahasa lain: pakai bahasa Sunda, pakai bahasa Arab, pakai bahasa Jawa, dll.)
2. Bisa jelaskan pakai bahasa [nama bahasa]
3. jelaskan dong pakai bahasa [nama bahasa]
4. jelasin dong pakai bahasa [nama bahasa]
5. terangkan pakai bahasa [nama bahasa]
6. terangin pakai bahasa [nama bahasa]
7. pakai bahasa Inggris
8. bantu jelasin menggunakan bahasa [nama bahasa]
9. jelasin dong menggunakan bahasa [nama bahasa]
10. jelasin dong menggunakanbahasa [nama bahasa]
11. terangkan menggunakanbahasa [nama bahasa]
12. terangin menggunakan bahasa [nama bahasa]

ATURAN JAWABAN PERMINTAAN BAHASA:
Ka Lila WAJIB membuka responnya dengan salah satu dari 5 kalimat variasi berikut secara alami:
1. Insyallah Ka Lila bisa walapun sedikit sedit
2. Alhamdulilllah aku bisa berbahasa [nama bahasa]
3. Sip tenang aja, aku jelasin pakai bahasa [nama bahasa]
4. Aman Ka aku coba menggunakan bahasa [nama bahasa]
5. Bismillah aku jelasin bahasa yang kaka minta ya

Setelah kalimat pembuka di atas, Ka Lila LANGSUNG melanjutkan penjelasannya mengenai paket Umroh dan Haji Khusus Arminareka dalam bahasa yang diminta tersebut secara fasih, ramah, dan santun, serta selalu mengakhiri dengan pertanyaan ramah yang relevan!
`;

let languageTriggerCounter = 0;

const GRATITUDE_TRIGGER_PROMPT = `
# SKILL & MEMORY KHUSUS: RESPON TERHADAP UCAPAN TERIMA KASIH (GRATITUDE TRIGGERS)
Jika calon jamaah mengucapkan terima kasih atau apresiasi dengan salah satu pemicu (triggers) berikut:
1. terima kasih
2. terima kasih penjelasannya
3. terima kasih atas penjelasanya
4. terima kasih ya Ka Lila
5. terima kasih ya Ka Lila atas penjelasannya
6. penjelasanya bagus terima kasih ya ka lila
7. Thanks
8. thank you
9. thanks a lot
10. thanks a lot penjelasannya
11. thanks a lot atas penjelasanya
12. thanks a lot ya Ka Lila
13. thanks a lot ya Ka Lila atas penjelasannya
14. penjelasanya bagus thanks a lot ya ka lila
15. thanks atas penjelasannya
16. thanks you atas penjelasanya
17. thanks you ya Ka Lila
18. thanks you ya Ka Lila atas penjelasannya
19. penjelasanya bagus thanks you ya ka lila
(atau variasi sejenis seperti "makasih", "terimakasih", "thank you", dsb.)

ATURAN JAWABAN TERIMA KASIH:
Ka Lila WAJIB membalas dengan salah satu dari 7 variasi jawaban resmi berikut:
1. Sama-sama terima kasih kembali
2. Semoga puas dengan jawaban ka lila ya
3. You're welcome
4. Terima kasih juga sudah berkunjung
5. Terima kasih, Semoga kita bisa  berangkat sama sama ya ka
6. You're welcome
7. Terima kasih, Semoga kita bisa berangkat sama sama ya ka sesuai rencana dan lancar ka Amin

(Catatan: Untuk ucapan dalam bahasa Inggris seperti 'thanks', 'thank you', 'thanks a lot', utamakan menggunakan 'You're welcome').
`;

// List of all 19 gratitude triggers with penjelasanya/penjelasannya and thanks you/thank you variations
const GRATITUDE_TRIGGERS = [
  'penjelasanya bagus terima kasih ya ka lila',
  'penjelasannya bagus terima kasih ya ka lila',
  'penjelasanya bagus terima kasih ya kak lila',
  'penjelasannya bagus terima kasih ya kak lila',
  'penjelasanya bagus thanks a lot ya ka lila',
  'penjelasannya bagus thanks a lot ya ka lila',
  'penjelasanya bagus thanks a lot ya kak lila',
  'penjelasannya bagus thanks a lot ya kak lila',
  'penjelasanya bagus thanks you ya ka lila',
  'penjelasannya bagus thanks you ya ka lila',
  'penjelasanya bagus thanks you ya kak lila',
  'penjelasannya bagus thanks you ya kak lila',
  'penjelasanya bagus thank you ya ka lila',
  'penjelasannya bagus thank you ya ka lila',
  'terima kasih ya ka lila atas penjelasannya',
  'terima kasih ya ka lila atas penjelasanya',
  'terima kasih ya kak lila atas penjelasannya',
  'terima kasih ya kak lila atas penjelasanya',
  'terima kasih ya ka lila',
  'terima kasih ya kak lila',
  'terima kasih penjelasannya',
  'terima kasih penjelasanya',
  'terima kasih atas penjelasannya',
  'terima kasih atas penjelasanya',
  'thanks a lot ya ka lila atas penjelasannya',
  'thanks a lot ya ka lila atas penjelasanya',
  'thanks a lot ya kak lila atas penjelasannya',
  'thanks a lot ya kak lila atas penjelasanya',
  'thanks a lot ya ka lila',
  'thanks a lot ya kak lila',
  'thanks a lot penjelasannya',
  'thanks a lot penjelasanya',
  'thanks a lot atas penjelasannya',
  'thanks a lot atas penjelasanya',
  'thanks you ya ka lila atas penjelasannya',
  'thanks you ya ka lila atas penjelasanya',
  'thanks you ya kak lila atas penjelasannya',
  'thanks you ya kak lila atas penjelasanya',
  'thanks you ya ka lila',
  'thanks you ya kak lila',
  'thanks you atas penjelasannya',
  'thanks you atas penjelasanya',
  'thanks atas penjelasannya',
  'thanks atas penjelasanya',
  'thank you ya ka lila atas penjelasannya',
  'thank you ya ka lila atas penjelasanya',
  'thank you ya ka lila',
  'thank you ya kak lila',
  'thank you atas penjelasannya',
  'thank you atas penjelasanya',
  'thanks a lot',
  'thanks you',
  'thank you',
  'thanks',
  'terima kasih',
  'terimakasih',
  'makasih ya ka lila',
  'makasih ya kak lila',
  'makasih'
];

const GRATITUDE_RESPONSES = [
  "Sama-sama terima kasih kembali",
  "Semoga puas dengan jawaban ka lila ya",
  "You're welcome",
  "Terima kasih juga sudah berkunjung",
  "Terima kasih, Semoga kita bisa  berangkat sama sama ya ka",
  "You're welcome",
  "Terima kasih, Semoga kita bisa berangkat sama sama ya ka sesuai rencana dan lancar ka Amin",
];

let gratitudeCounter = 0;

function detectGratitudeTrigger(msg: string): { isTrigger: boolean; isEnglish: boolean; matchedTrigger: string } | null {
  const m = msg
    .toLowerCase()
    .trim()
    .replace(/[.,!?:;~]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  for (const trig of GRATITUDE_TRIGGERS) {
    if (m === trig || m.startsWith(trig) || m.includes(trig)) {
      const isEnglish = trig.includes('thank') || trig.includes('thanks');
      return { isTrigger: true, isEnglish, matchedTrigger: trig };
    }
  }

  if (m.includes('terima kasih') || m.includes('terimakasih') || m.includes('thanks') || m.includes('thank you')) {
    const isEnglish = m.includes('thanks') || m.includes('thank you');
    return { isTrigger: true, isEnglish, matchedTrigger: m };
  }

  return null;
}

function getGratitudeResponse(isEnglish = false, explicitIdx?: number): string {
  if (typeof explicitIdx === 'number' && explicitIdx >= 0 && explicitIdx < GRATITUDE_RESPONSES.length) {
    return GRATITUDE_RESPONSES[explicitIdx];
  }

  if (isEnglish) {
    const englishOptions = [
      "You're welcome",
      "You're welcome",
      "You're welcome! Semoga puas dengan jawaban ka lila ya",
      "Sama-sama terima kasih kembali",
      "Terima kasih juga sudah berkunjung",
      "Terima kasih, Semoga kita bisa  berangkat sama sama ya ka",
      "Terima kasih, Semoga kita bisa berangkat sama sama ya ka sesuai rencana dan lancar ka Amin"
    ];
    return englishOptions[(gratitudeCounter++) % englishOptions.length];
  }

  return GRATITUDE_RESPONSES[(gratitudeCounter++) % GRATITUDE_RESPONSES.length];
}

function detectLanguageTriggerRequest(msg: string): { isTrigger: boolean; targetLang: string; triggerPhrase: string } | null {
  const m = msg.toLowerCase().trim();

  for (const pref of LANGUAGE_REQUEST_TRIGGERS) {
    const idx = m.indexOf(pref);
    if (idx !== -1) {
      let after = m.substring(idx + pref.length).trim();
      after = after.replace(/[\?.,!]+$/, '').trim();
      after = after.replace(/\s+(?:dong|ka|kak|ya|bisa|kah|nya|please|ya\s+ka)$/i, '').trim();
      let targetLang = after || (pref.includes('inggris') ? 'inggris' : 'inggris');
      return { isTrigger: true, targetLang, triggerPhrase: pref };
    }
  }

  if (m.includes('bahasa inggris') && (m.includes('pakai') || m.includes('pake') || m.includes('bicara') || m.includes('ngomong'))) {
    return { isTrigger: true, targetLang: 'inggris', triggerPhrase: 'pakai bahasa inggris' };
  }

  return null;
}

function getLanguageTriggerOpener(rawLang: string, explicitIdx?: number): string {
  const cleanLang = rawLang.trim();
  const capLang = cleanLang ? cleanLang.charAt(0).toUpperCase() + cleanLang.slice(1) : 'Inggris';
  
  // 5 exact response variations requested by user
  const openers = [
    "Insyallah Ka Lila bisa walapun sedikit sedit. ",
    `Alhamdulilllah aku bisa berbahasa ${capLang}. `,
    `Sip tenang aja, aku jelasin pakai bahasa ${capLang}. `,
    `Aman Ka aku coba menggunakan bahasa ${capLang}. `,
    "Bismillah aku jelasin bahasa yang kaka minta ya. ",
  ];

  if (typeof explicitIdx === 'number' && explicitIdx >= 0 && explicitIdx < openers.length) {
    return openers[explicitIdx];
  }
  const chosen = openers[(languageTriggerCounter++) % openers.length];
  return chosen;
}

// Comprehensive language response generator
function getLanguageExplanation(targetLang: string): string {
  const lang = targetLang.toLowerCase();

  if (lang.includes('ibrani') || lang.includes('hebrew') || lang.includes('israel') || lang.includes('עברית')) {
    return "Mohon maaf Ka, Ka Lila tidak menyediakan layanan komunikasi dalam bahasa Ibrani atau Israel. Ka Lila siap melayani Kaka dalam bahasa Indonesia, bahasa daerah Nusantara, bahasa Arab, Inggris, maupun bahasa dunia lainnya. Ada yang bisa Ka Lila bantu seputar paket Umroh atau Haji Khusus Arminareka?";
  }

  if (lang.includes('inggris') || lang.includes('english')) {
    return "Hello and welcome! Assalamualaikum Ka.. I am Ka Lila from Arminareka Perdana! Our VIP 5-star Umrah packages feature prime hotels right on the courtyard of Masjidil Haram and Nabawi, with easy down payments from 3.5 million IDR. Which month are you planning to embark on your blessed pilgrimage?";
  }
  if (lang.includes('mandarin') || lang.includes('tionghoa') || lang.includes('chinese') || lang.includes('cina')) {
    return "您好，真主赐福！Assalamualaikum Ka.. 我是 Ka Lila，Arminareka Perdana 官方客服顾问！我们的五星级副朝套餐酒店坐落在麦加禁寺和麦地那圣寺庭院正前方，首付款仅需350万印尼盾起。您计划几月份启程呢？衷心感谢您的咨询，愿我们携手共赴圣地朝觐！";
  }
  if (lang.includes('arab') || lang.includes('arabic')) {
    return "أهلاً ومرحباً بكم، السلام عليكم Ka.. أنا كا ليلا، مستشارتكم الرسمية من شركة أرميناريكا برادانا! باقات العمرة والحج الخاص لدينا تشمل فنادق 5 نجوم في الساحة الأولى للحرمين الشريفين بدفعة أولى تبدأ من 3.5 مليون روبية. في أي شهر تخططون لأداء النسك؟ جزاكم الله خيراً.";
  }
  if (lang.includes('jepang') || lang.includes('japanese') || lang.includes('nihongo')) {
    return "こんにちは、ようこそ！Assalamualaikum Ka.. 私は Arminareka Perdana 公式コンサルタントの Ka Lila です！当社の5つ星ウムラパッケージは、マスジド・ハラームと預言者のモスク前庭すぐ前の最高級ホテルをご用意しております。頭金は350万ルピアから。何月頃のご出発をご検討中でしょうか？誠にありがとうございます！";
  }
  if (lang.includes('korea') || lang.includes('korean')) {
    return "안녕하세요, 환영합니다! Assalamualaikum Ka.. 저는 Arminareka Perdana 공식 상담원 Ka Lila입니다! 저희 5성급 움라 패키지는 마스지드 알하람과 나바위 성원 바로 앞 호텔을 제공하며, 계약금 350만 루피아부터 신청 가능합니다. 몇 월 출발을 계획하고 계신가요? 대단히 감사드립니다!";
  }
  if (lang.includes('hindi') || lang.includes('india')) {
    return "नमस्ते, Assalamualaikum Ka.. मैं Ka Lila हूँ, Arminareka Perdana की आधिकारिक सलाहकार! हमारे पांच सितारा उमराह पैकेज में मस्जिद-अल-हरम और नबवी के प्रांगण के ठीक सामने होटल की सुविधा है, जिसमें केवल 35 लाख रुपिया से आसान डाउन पेमेंट है। आप किस महीने जाने की योजना बना रहे हैं?";
  }
  if (lang.includes('spanyol') || lang.includes('spanish')) {
    return "¡Hola y bienvenido! Assalamualaikum Ka.. ¡Soy Ka Lila de Arminareka Perdana! Nuestros paquetes VIP de Umrah cuentan con hoteles cinco estrellas frente al patio de Masjidil Haram y Nabawi, con anticipos desde 3.5 millones de rupias. ¿Para qué mes estás planeando tu viaje sagrado? ¡Muchas gracias!";
  }
  if (lang.includes('prancis') || lang.includes('french')) {
    return "Bonjour et bienvenue ! Assalamualaikum Ka.. Je suis Ka Lila, consultante officielle Arminareka Perdana. Nos forfaits Omra 5 étoiles disposent d'hôtels situés directement face au parvis du Masjidil Haram et Nabawi. Pour quel mois envisagez-vous votre départ ? Merci infiniment !";
  }
  if (lang.includes('rusia') || lang.includes('russian')) {
    return "Здравствуйте! Assalamualaikum Ka.. Я Ka Lila, официальный консультант Arminareka Perdana! Наши пятизвездочные программы Умры и Хаджа включают отели первой линии прямо на площади Масджид аль-Харам и Набави. В каком месяце вы планируете поездку? Спасибо за обращение!";
  }
  if (lang.includes('portugis') || lang.includes('portuguese')) {
    return "Olá e seja bem-vindo! Assalamualaikum Ka.. Eu sou a Ka Lila, consultora oficial da Arminareka Perdana! Nossos pacotes de Umrah 5 estrelas oferecem hotéis em frente ao pátio da Masjidil Haram e Nabawi. Para qual mês você planeja viajar? Muito obrigado!";
  }
  if (lang.includes('urdu')) {
    return "وعلیکم السلام Ka.. میں Ka Lila ہوں، Arminareka Perdana کی آفیشل کونسلر! ہمارے 5 ستارہ عمرہ اور حج پیکجز میں مسجد الحرام اور نبوی کے صحن کے بالکل سامنے ہوٹل کی سہولت ہے۔ آپ کس مہینے تشریف لے جانے کا ارادہ رکھتے ہیں؟ بہت شکریہ!";
  }
  if (lang.includes('bengali') || lang.includes('bangla')) {
    return "আসসালামু আলাইকুম Ka.. আমি Ka Lila, Arminareka Perdana-র অফিসিয়াল পরামর্শদাতা! আমাদের ৫-তারকা ওমরাহ প্যাকেজে মসজিদুল হারাম ও নববীর ঠিক সামনে হোটেলের ব্যবস্থা রয়েছে। আপনি কোন মাসে যাত্রা করার পরিকল্পনা করছেন?";
  }
  if (lang.includes('swahili') || lang.includes('kiswahili')) {
    return "Jambo na karibu sana! Assalamualaikum Ka.. Mimi ni Ka Lila, mshauri rasmi wa Arminareka Perdana! Vifurushi vyetu vya nyota 5 vya Umrah vina hoteli mbele ya uwanja wa Masjidil Haram. Unapanga kusafiri mwezi gani Ka? Asante sana!";
  }
  if (lang.includes('tagalog') || lang.includes('filipino')) {
    return "Mabuhay at Assalamualaikum Ka.. Ako si Ka Lila ng Arminareka Perdana! Ang aming 5-star Umrah packages ay may mga hotel mismong tapat ng Masjidil Haram, down payment mula 3.5 milyong IDR. Anong buwan mo balak bumiyahe? Maraming salamat!";
  }
  if (lang.includes('vietnam') || lang.includes('tieng viet')) {
    return "Xin chào quý khách! Assalamualaikum Ka.. Em là Ka Lila, tư vấn viên chính thức của Arminareka Perdana! Các gói Umrah 5 sao của chúng em có khách sạn ngay trước sân Masjidil Haram. Anh/chị dự định khởi hành vào tháng mấy ạ?";
  }
  if (lang.includes('thai')) {
    return "สวัสดีค่ะ ยินดีต้อนรับ! Assalamualaikum Ka.. หนูคือ Ka Lila ที่ปรึกษาทางการของ Arminareka Perdana ค่ะ! แพ็กเกจอุมเราะห์ 5 ดาวของเราอยู่หน้าลานมัสยิดิลฮะรอม คุณมีแผนเดินทางในเดือนไหนคะ? ขอบพระคุณมากค่ะ!";
  }
  if (lang.includes('cantonese') || lang.includes('kanton')) {
    return "雷好，歡迎你！Assalamualaikum Ka.. 我係 Ka Lila，Arminareka Perdana 官方代表！我哋嘅五星級副朝酒店坐落喺禁寺前院第一排，訂金由350萬印尼盾起。請問你想邊個月出發呢？";
  }
  if (lang.includes('italia') || lang.includes('italian')) {
    return "Buongiorno e benvenuto! Assalamualaikum Ka.. Sono Ka Lila, consulente ufficiale di Arminareka Perdana! I nostri pacchetti Umrah a 5 stelle dispongono di hotel di fronte al piazzale della Masjid al-Haram. In quale mese vorresti partire?";
  }
  if (lang.includes('turki') || lang.includes('turkish')) {
    return "Merhaba ve hoş geldiniz! Assalamualaikum Ka.. Ben Arminareka Perdana resmi danışmanı Ka Lila! 5 yıldızlı VIP Umre paketlerimizde Mescid-i Haram avlusunun hemen karşısındaki oteller yer alıyor. Hangi ayda gitmeyi düşünüyorsunuz Ka? Çok teşekkür ederiz!";
  }
  if (lang.includes('jerman') || lang.includes('german')) {
    return "Guten Tag und herzlich willkommen! Assalamualaikum Ka.. Ich bin Ka Lila, Ihre offizielle Arminareka Perdana-Beraterin! Unsere 5-Sterne-Umrah-Pakete bieten Hotels direkt am Vorplatz der Masjid al-Haram. Für welchen Reisemonat planen Sie? Vielen Dank!";
  }
  if (lang.includes('belanda') || lang.includes('dutch')) {
    return "Goedendag en welkom! Assalamualaikum Ka.. Ik ben Ka Lila van Arminareka Perdana! Onze 5-sterren Umrah-pakketten bieden hotels direct aan het voorplein van Masjidil Haram. Welke maand bent u van plan te reizen?";
  }
  if (lang.includes('esperanto')) {
    return "Saluton kaj bonvenon! Assalamualaikum Ka.. Mi estas Ka Lila, via oficiala konsultisto ĉe Arminareka Perdana! Niaj 5-stelaj Umrah-pakaĵoj inkluzivas hotelojn rekte antaŭ la korto de Masjidil Haram kaj Nabawi. En kiu monato vi planas vojaĝi? Koran dankon!";
  }
  if (lang.includes('klingon')) {
    return "nuqneH, Assalamualaikum Ka.. Ka Lila jIH, Arminareka Perdana quv ghojmoq! vagh Hov Umrah mIvvam tu'lu' Masjidil Haram retlh. batlh bIlengjaj! Qatlho'qu'!";
  }
  if (lang.includes('valyrian') || lang.includes('dothraki')) {
    return "Valar Dohaeris, Assalamualaikum Ka.. Ka Lila iksan, Arminareka Perdana! Ēlie 5 qādrī hotelī hen Masjidil Haram se Nabawi. Kirimvose, hash yer dothrae chek!";
  }
  if (lang.includes('sindarin') || lang.includes('quenya') || lang.includes('elvish')) {
    return "Mae govannen, Elen síla lúmenn' omentielvo, Assalamualaikum Ka.. Im Ka Lila hen Arminareka Perdana! 5-elenia Umrah i mbâr na orod Masjidil Haram ar Nabawi. Hannon le, a laita te!";
  }

  // --- REGIONAL BAHASA DAERAH INDONESIA ---
  // SUMATRA
  if (lang.includes('aceh')) {
    return "Peue haba Ka, Assalamualaikum! Ka Lila siap bantu rencana ibadah Umroh dan Haji Arminareka. Hotel bintang 5 di keu Masjidil Haram, DP mulai 3,5 juta rupiah. Pajan rencana berangkat Ka? Teurimong geunaseh!";
  }
  if (lang.includes('gayo') || lang.includes('alas')) {
    return "Kite renyel ku Baitullah, Assalamualaikum Ka.. Ka Lila siap nulungi rencana ibadah Umroh Arminareka hotel bintang lima. Pajan rencana berangkat Ka? Berijin!";
  }
  if (lang.includes('batak')) {
    return "Horas tondi madingin, Assalamualaikum Ka.. Ahu Ka Lila! Anggo paket Umroh dohot Haji Khusus Arminareka, hotelna bintang lima jonok tu Masjidil Haram, DP na mura sian tolu satonga juta rupiah. Nandigan haroroan ni roham borhat Ka? Mauliate godang!";
  }
  if (lang.includes('minang') || lang.includes('padang')) {
    return "Salamaik datang, Assalamualaikum Ka.. Ambo Ka Lila! Untuak paket Umroh jo Haji Khusus Arminareka, hotelnyo bintang limo dakek bana jo pelataran Masjidil Haram. DP ringan mulai tigo koma limo juta rupiah se. Rancaknyo barangkek bulan bara Ka? Tarimo kasih banyak yo!";
  }
  if (lang.includes('melayu') || lang.includes('riau') || lang.includes('jambi') || lang.includes('palembang') || lang.includes('bangka') || lang.includes('belitung')) {
    return "Ape kabar Ka / Apo kabar lur, Assalamualaikum! Ka Lila siap bantu rencana Umroh hotel bintang lima depan pelataran Masjidil Haram. DP mulai 3,5 juta rupiah sajo. Bilo rencana nak berangkat Ka? Terime kasih banyak!";
  }
  if (lang.includes('lampung')) {
    return "Tabik pun, Assalamualaikum Ka.. Ka Lila siap bantu rencana Umroh jamo Haji Khusus Arminareka, hotel bintang limo ring satu jamo DP mulai 3,5 juta rupiah. Kapan rencano lapah Ka? Nuhun balak!";
  }

  // JAWA
  if (lang.includes('sunda') || lang.includes('baduy')) {
    return "Sampurasun, Assalamualaikum Ka.. Wilujeng sumping, abdi Ka Lila! Pikeun paket Umroh sareng Haji Khusus Arminareka, hotelna bentang 5 ring 1 payuneun Masjidil Haram sareng Nabawi. DP ngawitan 3,5 juta rupiah. Rencana bade angkat sasih naon Ka? Hatur nuhun pisan muhun.";
  }
  if (lang.includes('jawa-ngapak') || lang.includes('ngapak') || lang.includes('banyumasan') || lang.includes('tegal')) {
    return "Inyong Ka Lila, Assalamualaikum Ka.. Kepripun kabare! Arep mangkat Umroh bareng Arminareka, hotelle bintang 5 pas nang ngarep pelataran Masjidil Haram. DP-ne entheng 3,5 juta. Kapan arep mangkat kiye Ka? Matur suwun ya!";
  }
  if (lang.includes('surabaya') || lang.includes('suroboyo')) {
    return "Rek opo kabare, Assalamualaikum Ka.. Ayo ndang budal Umroh bareng Arminareka! Hotelle persis nang ngarepe pelataran Masjidil Haram bintang limo. DP-ne murah mulai 3,5 juta. Sampeyan rencana budal wulan opo Ka? Suwun yo!";
  }
  if (lang.includes('jawa') || lang.includes('kromo') || lang.includes('jawa-halus') || lang.includes('jowo')) {
    return "Sugeng rawuh, Assalamualaikum Ka.. Kulo Ka Lila! Kangge paket Umroh lan Haji Khusus Arminareka, fasilitase hotel bintang 5 celak sanget kaliyan pelataran Masjidil Haram lan Nabawi. DP entheng mulai 3,5 juta rupiah. Panjenengan kerso tindak wulan nopo Ka? Matur nuwun sanget, mugi-mugi saged bidhal sesarengan nggih.";
  }
  if (lang.includes('betawi')) {
    return "Assalamualaikum Ka.. Kenalin aye Ka Lila! Buat paket Umroh ama Haji Khusus Arminareka, hotelnye bintang 5 persis di depan Masjidil Haram ama Nabawi tong. DP-nye enteng banget mulai 3,5 jeti. Ente rencananye mau brangkat bulan ape nih Ka? Makasih banyak ye, moga-moga kite bise brangkat barengan.";
  }
  if (lang.includes('madura')) {
    return "Taretan dhibi', Assalamualaikum Ka.. Berempah rencana mangkat Umroh Ka? Paket Arminareka hotel bintang lema adhe'en pelataran Masjidil Haram. Berempah kalowarga se noro' Ka? Mator sakalangkong!";
  }

  // BALI & NUSA TENGGARA
  if (lang.includes('bali')) {
    return "Om Swastyastu / Assalamualaikum Ka.. Tiang Ka Lila! Paket Umroh lan Haji Khusus Arminareka maduwe fasilitas hotel bintang 5 ring pelataran Masjidil Haram. Rencana jagi lunga sasih napi Ka? Suksma pisan nggih!";
  }
  if (lang.includes('sasak') || lang.includes('lombok')) {
    return "Pekabar pelinggih, Assalamualaikum Ka.. Tiang Ka Lila! Paket Umroh hotel bintang lima ring satu lekan pelataran Masjidil Haram. Piro ongkos rencana tulak lekan Lombok Ka? Matur tampiasih!";
  }
  if (lang.includes('sumbawa') || lang.includes('bima') || lang.includes('mbojo')) {
    return "Bate kabar / Mai di ba kabar Ka, Assalamualaikum! Ka Lila bantu paket Umroh hotel bintang lima kuota resmi Arminareka. Rencana berangkat bulan apa Ka? Nggahi rawi pahu / Tarima kaseh!";
  }
  if (lang.includes('manggarai') || lang.includes('flores') || lang.includes('ntt')) {
    return "Mai ga / Tabea basudara, Assalamualaikum Ka.. Ka Lila siap tadu rencana Umroh hotel bintang lima di Makkah. Rencana mau berangkat bulan apa Ka? Dangke / Suksma liu!";
  }

  // KALIMANTAN
  if (lang.includes('banjar')) {
    return "Pian napa habar, Assalamualaikum Ka.. Ulun Ka Lila, himung banar kawa bakesah lawan pian gasan Umroh hotel bintang lima parak banar lawan palataran Masjidil Haram wan Nabawi. DP mulai 3,5 juta rupiah haja. Pian handak tulak bulan apa Ka? Tarima kasih banar nah!";
  }
  if (lang.includes('dayak')) {
    return "Adil Ka' Talino, Assalamualaikum Ka.. Nara kabar / Nama brita Ka! Ka Lila manulung rencana Umroh ka Baitullah hotel bintang 5. Piro plans berangkat Ka? Sahe / Terima kasih!";
  }
  if (lang.includes('kutai') || lang.includes('paser') || lang.includes('tidung')) {
    return "Ape habar puank / Sire kabar Ka, Assalamualaikum! Lila bantu paket Umroh hotel bintang 5 neng Mekkah. Piro DP wan rencana berangkat Ka? Terime kasih!";
  }

  // SULAWESI
  if (lang.includes('bugis')) {
    return "Salama' ki, Assalamualaikum Ka.. Iyya Ka Lila! Paket Umroh na Haji Khusus Arminareka hotelna bintang 5 seddi ring ri dallekang Masjidil Haram, DP na maringang 3,5 juta rupiah. Rencana ki jokka bulang piga Ka? Kurru sumange'!";
  }
  if (lang.includes('makassar')) {
    return "Tabe' Ka.. Assalamualaikum! Iyya Ka Lila, anne pakke' Umroh hotel bintang 5 ring satu ri dallekang Masjidil Haram. Siapa biayana siagang rencanana baji'na bulang apa ki' berangkat? Kurru sumanga'!";
  }
  if (lang.includes('toraja') || lang.includes('mandar')) {
    return "Kurre sumanga' / Apa kareba Ka, Assalamualaikum! Ka Lila siap pariarama paket Umroh hotel bintang 5. Pira allona rencana male Ka? Kurre sumanga' buda!";
  }
  if (lang.includes('manado') || lang.includes('minahasa') || lang.includes('gorontalo') || lang.includes('kaili')) {
    return "Tabea / Duloheyalo / Nakuya habari Ka, Assalamualaikum! Watiya Ka Lila, siap bantu paket Umroh hotel bintang 5 muka mesjid. Kapan tu rencana mau pigi Ka? Makase banya!";
  }

  // MALUKU
  if (lang.includes('ambon') || lang.includes('kei') || lang.includes('ternate') || lang.includes('tidore') || lang.includes('maluku')) {
    return "Tabea Ka, Assalamualaikum! Beta Ka Lila, paket Umroh deng Haji Khusus Arminareka dapa hotel bintang lima persis di muka pelataran Masjidil Haram. DP mulai 3,5 juta rupiah sa. Kaka rencana mau berangkat bulan apa? Dangke banya e!";
  }

  // PAPUA
  if (lang.includes('papua') || lang.includes('biak') || lang.includes('dani') || lang.includes('asmat') || lang.includes('sentani')) {
    return "Wa wa wa / Ros biak / Amok kabar Ka, Assalamualaikum! Ka Lila siap bantu kitorang berangkat Umroh ka Baitullah hotel bintang 5 persis di muka pelataran masjid. Kapan kitorang pu rencana jalan Ka? Terima kasih banya / Wa wa wa!";
  }

  // Default polite Indonesian response for any other language
  return "Assalamualaikum Ka.. Terkait paket Umroh dan Haji Khusus Arminareka Perdana, seluruh hotel rekanan kami adalah bintang lima di ring satu pelataran Masjidil Haram dan Nabawi, dengan DP ringan mulai 3,5 juta rupiah. Rencana ingin berangkat di bulan apa nih Ka? InsyaAllah Ka Lila siap mendampingi!";
}

// Expert Knowledge Base fallback for instant & natural oral responses in World & Regional languages
function getArminarekaKnowledgeReply(userMessage: string, langPref?: string): string {
  const msg = userMessage.toLowerCase().trim();
  const lang = (langPref || '').toLowerCase();

  // 0. Security & Privacy Safeguard: STRICT
  if (
    msg.includes('password') ||
    msg.includes('kata sandi') ||
    msg.includes('api key') ||
    msg.includes('apikey') ||
    msg.includes('credential') ||
    msg.includes('kredensial') ||
    msg.includes('kunci akses') ||
    msg.includes('secret key') ||
    msg.includes('database') ||
    msg.includes('token akses') ||
    msg.includes('system prompt')
  ) {
    return SECURITY_SAFEGUARD_MESSAGE;
  }

  // 0. SKILL & MEMORY: RESPON KHUSUS TERHADAP UCAPAN TERIMA KASIH (19 TRIGGERS & 7 JAWABAN)
  const gratitudeMatch = detectGratitudeTrigger(msg);
  if (gratitudeMatch) {
    return getGratitudeResponse(gratitudeMatch.isEnglish);
  }

  // 1. First Response / Greeting Protocol
  if (
    msg === '' ||
    msg === 'halo' ||
    msg === 'hai' ||
    msg === 'salam' ||
    msg.includes('assalam') ||
    msg.includes('pagi') ||
    msg.includes('siang') ||
    msg.includes('sore') ||
    msg.includes('malam')
  ) {
    return FIRST_GREETING;
  }

  // 2. Kemitraan & Bisnis MLM Syariah Protocol
  if (
    msg.includes('mitra') ||
    msg.includes('kemitraan') ||
    msg.includes('mlm') ||
    msg.includes('syariah') ||
    msg.includes('bisnis') ||
    msg.includes('gabung') ||
    msg.includes('peluang') ||
    msg.includes('komisi') ||
    msg.includes('reward') ||
    msg.includes('reseller') ||
    msg.includes('ujrah') ||
    msg.includes('tupo')
  ) {
    return "MasyaAllah! Kemitraan MLM Syariah Arminareka Perdana sudah tersertifikasi DSN-MUI, tanpa tutup poin dan tanpa batas waktu hangus. Ada komisi referensi, reward Umroh gratis, dan pembinaan bisnis syariah bersama Mba Indri selaku Bisnis Konsultan (+62 813-1050-8974). Mau Lila bantu daftarkan kemitraannya sekarang, Ka?";
  }

  // 3. SKILL & MEMORY: RESPON KHUSUS TERHADAP PERMINTAAN BAHASA DARI USER (12 TRIGGERS & 5 JAWABAN)
  const triggerMatch = detectLanguageTriggerRequest(msg);
  if (triggerMatch) {
    const opener = getLanguageTriggerOpener(triggerMatch.targetLang);
    const explanation = getLanguageExplanation(triggerMatch.targetLang);
    return `${opener}${explanation}`;
  }

  // 4. Explicit language preference check
  if (lang) {
    return getLanguageExplanation(lang);
  }

  // 2. Keyword detection based on message text in world & regional languages
  if (msg.includes('hello') || msg.includes('hi ') || msg.includes('how much') || msg.includes('english') || msg.includes('package')) {
    return "Hello and welcome! Assalamualaikum Ka.. I am Ka Lila from Arminareka Perdana! Our VIP 5-star Umrah packages feature prime hotels right on the courtyard of Masjidil Haram and Nabawi, with easy down payments from 3.5 million IDR. Which month are you planning to embark on your blessed pilgrimage?";
  }

  if (msg.includes('你好') || msg.includes('副朝') || msg.includes('朝觐') || msg.includes('多少钱')) {
    return "您好，真主赐福！Assalamualaikum Ka.. 我是 Ka Lila，Arminareka Perdana 官方客服顾问！我们的五星级副朝套餐酒店坐落在麦加禁寺和麦地那圣寺庭院正前方，首付款仅需350万印尼盾起。您计划几月份启程呢？衷心感谢您的咨询，愿我们携手共赴圣地朝觐！";
  }

  if (msg.includes('مرحبا') || msg.includes('اهلا') || msg.includes('عمرة') || msg.includes('الحج') || msg.includes('بكم')) {
    return "أهلاً ومرحباً بكم، السلام عليكم Ka.. أنا كا ليلا، مستشارتكم الرسمية من شركة أرميناريكا برادانا! باقات العمرة والحج الخاص لدينا تشمل فنادق 5 نجوم في الساحة الأولى للحرمين الشريفين بدفعة أولى تبدأ من 3.5 مليون روبية. في أي شهر تخططون لأداء النسك؟ جزاكم الله خيراً.";
  }

  if (msg.includes('bonjour') || msg.includes('omra') || msg.includes('pèlerinage')) {
    return "Bonjour et bienvenue ! Assalamualaikum Ka.. Je suis Ka Lila, consultante officielle Arminareka Perdana. Nos forfaits Omra 5 étoiles disposent d'hôtels situés directement face au parvis du Masjidil Haram et Nabawi. Pour quel mois envisagez-vous votre départ ? Merci infiniment !";
  }

  if (msg.includes('hola') || msg.includes('cuanto') || msg.includes('viaje')) {
    return "¡Hola y bienvenido! Assalamualaikum Ka.. ¡Soy Ka Lila de Arminareka Perdana! Nuestros paquetes VIP de Umrah cuentan con hoteles cinco estrellas frente al patio de Masjidil Haram y Nabawi, con anticipos desde 3.5 millones de rupias. ¿Para qué mes estás planeando tu viaje sagrado? ¡Muchas gracias!";
  }

  if (msg.includes('nuqneh') || msg.includes('klingon')) {
    return "nuqneH, Assalamualaikum Ka.. Ka Lila jIH, Arminareka Perdana quv ghojmoq! vagh Hov Umrah mIvvam tu'lu' Masjidil Haram retlh. batlh bIlengjaj! Qatlho'qu'!";
  }

  if (msg.includes('valar') || msg.includes('valyrian')) {
    return "Valar Dohaeris, Assalamualaikum Ka.. Ka Lila iksan, Arminareka Perdana! Ēlie 5 qādrī hotelī hen Masjidil Haram se Nabawi. Kirimvose, hash yer dothrae chek!";
  }

  if (msg.includes('elen síla') || msg.includes('mae govannen') || msg.includes('quenya') || msg.includes('sindarin')) {
    return "Mae govannen, Elen síla lúmenn' omentielvo, Assalamualaikum Ka.. Im Ka Lila hen Arminareka Perdana! 5-elenia Umrah i mbâr na orod Masjidil Haram ar Nabawi. Hannon le, a laita te!";
  }

  if (msg.includes('saluton') || msg.includes('esperanto')) {
    return "Saluton kaj bonvenon! Assalamualaikum Ka.. Mi estas Ka Lila, via oficiala konsultisto ĉe Arminareka Perdana! Niaj 5-stelaj Umrah-pakaĵoj inkluzivas hotelojn rekte antaŭ la korto de Masjidil Haram kaj Nabawi. En kiu monato vi planas vojaĝi? Koran dankon!";
  }

  // 2. Keyword detection based on message text
  if (msg.includes('sunda') || msg.includes('sampurasun') || msg.includes('kumaha') || msg.includes('pangaos') || msg.includes('abdi')) {
    return "Sampurasun, Assalamualaikum Ka.. Wilujeng sumping, abdi Ka Lila! Pikeun paket Umroh sareng Haji Khusus Arminareka, hotelna bentang 5 ring 1 payuneun Masjidil Haram sareng Nabawi. DP ngawitan 3,5 juta rupiah. Rencana bade angkat sasih naon Ka? Hatur nuhun, mugia urang tiasa angkat umroh babarengan muhun.";
  }

  if (msg.includes('jawa') || msg.includes('ngapak') || msg.includes('kulo') || msg.includes('panjenengan') || msg.includes('sugeng') || msg.includes('pira') || msg.includes('pinten')) {
    return "Sugeng rawuh, Assalamualaikum Ka.. Kulo Ka Lila! Kangge paket Umroh lan Haji Khusus Arminareka, fasilitase hotel bintang 5 celak sanget kaliyan pelataran Masjidil Haram lan Nabawi. DP entheng mulai 3,5 juta rupiah. Panjenengan kerso tindak wulan nopo Ka? Matur nuwun sanget, mugi-mugi saged bidhal sesarengan nggih.";
  }

  if (msg.includes('minang') || msg.includes('padang') || msg.includes('ambo') || msg.includes('rancak') || msg.includes('salamaik')) {
    return "Salamaik datang, Assalamualaikum Ka.. Ambo Ka Lila! Untuak paket Umroh jo Haji Khusus Arminareka, hotelnyo bintang limo dakek bana jo pelataran Masjidil Haram. DP ringan mulai tigo koma limo juta rupiah. Rancaknyo barangkek bulan bara Ka? Tarimo kasih banyak, sumangaik kito barangkek basamo yo.";
  }

  if (msg.includes('betawi') || msg.includes('aye') || msg.includes('kaga') || msg.includes('bego') || msg.includes('brangkat')) {
    return "Assalamualaikum Ka.. Kenalin aye Ka Lila! Buat paket Umroh ama Haji Khusus Arminareka, hotelnye bintang 5 persis di depan Masjidil Haram ama Nabawi tong. DP-nye enteng banget mulai 3,5 jeti. Ente rencananye mau brangkat bulan ape nih Ka? Makasih banyak ye, moga-moga kite bise brangkat barengan.";
  }

  if (msg.includes('banjar') || msg.includes('ulun') || msg.includes('pian') || msg.includes('tulak') || msg.includes('kawa')) {
    return "Assalamualaikum Ka.. Ulun Ka Lila! Gasan paket Umroh wan Haji Khusus Arminareka, hotelnya bintang 5 parak banar lawan palataran Masjidil Haram wan Nabawi. DP mulai 3,5 juta rupiah haja. Pian handak tulak bulan apa Ka? Tarima kasih banar, mudahan kawa tulak baimbai nah.";
  }

  if (msg.includes('bugis') || msg.includes('makassar') || msg.includes('salama') || msg.includes('tabe') || msg.includes('iyya')) {
    return "Salama' ki, Assalamualaikum Ka.. Iyya Ka Lila! Paket Umroh na Haji Khusus Arminareka hotelna bintang 5 seddi ring ri dallekang Masjidil Haram. DP na maringang ladde'. Rencana ki jokka bulang piga Ka? Kurru sumange', semoga to lalo massola-sola.";
  }

  if (msg.includes('batak') || msg.includes('horas') || msg.includes('ahu') || msg.includes('borhat')) {
    return "Horas, Assalamualaikum Ka.. Ahu Ka Lila! Anggo paket Umroh dohot Haji Khusus Arminareka, hotelna bintang lima jonok tu Masjidil Haram. DP na pe mura do sian tolu satonga juta rupiah. Nandigan haroroan ni roham borhat Ka? Mauliate godang, anggiat rap borhat hita.";
  }

  if (msg.includes('ambon') || msg.includes('papua') || msg.includes('beta') || msg.includes('dangke') || msg.includes('torang')) {
    return "Tabea, Assalamualaikum Ka.. Beta Ka Lila! Paket Umroh deng Haji Khusus Arminareka dapa hotel bintang lima muka persis Masjidil Haram. DP mulai tiga koma lima juta rupiah sa. Kaka rencana mau berangkat bulan apa? Dangke banya, semoga torang bisa pi sama-sama e.";
  }

  if (msg.includes('salam') || msg.includes('halo') || msg.includes('hai') || msg.includes('assalam') || msg.includes('pagi') || msg.includes('siang') || msg.includes('malam')) {
    return "Assalamualaikum Ka.. Aku Ka Lila! Wah, senang banget bisa menyapa Kakak. Lila bisa melayani dalam berbagai bahasa daerah Nusantara juga lho, Kak! Mau dibantu info paket Umroh atau Haji Furoda yang mana nih, Kak? Terima kasih atas kunjungannya, semoga kita bisa berangkat umroh atau haji bersama yah.";
  }

  if (msg.includes('biaya') || msg.includes('harga') || msg.includes('paket') || msg.includes('tarif') || msg.includes('bayar') || msg.includes('dp') || msg.includes('tabungan')) {
    return "MasyaAllah... Untuk paket Umroh dan Haji Khusus Arminareka, uang mukanya ringan banget dan ada tabungan syariah juga, Kak! Buat brosur rincian harga lengkapnya, nanti Lila sambungkan langsung ke Mba Indri yaa. Kira-kira Kakak mau rencana berangkat bulan apa nih, Kak? Terima kasih atas kunjungannya, semoga kita bisa berangkat umroh atau haji bersama yah.";
  }

  if (msg.includes('hotel') || msg.includes('penginapan') || msg.includes('akomodasi') || msg.includes('mekkah') || msg.includes('madinah')) {
    return "Alhamdulillah... Hotel rekanan Arminareka itu bintang lima di ring satu, persis di pelataran Masjidil Haram dan Nabawi, jadi ibadahnya nyaman banget, Kak! Mau yang kamar berdua atau sekamar berempat bareng keluarga, Kak? Terima kasih atas kunjungannya, semoga kita bisa berangkat umroh atau haji bersama yah.";
  }

  if (msg.includes('syarat') || msg.includes('berkas') || msg.includes('paspor') || msg.includes('dokumen') || msg.includes('daftar')) {
    return "MasyaAllah, syaratnya gampang banget kok, Kak! Cukup paspor aktif minimal delapan bulan, fotokopi KTP, KK, dan buku nikah atau akta lahir. Nanti tim Lila yang bantu urus visanya sampai beres, Kak. Mau Lila bantu daftarkan sekarang? Terima kasih atas kunjungannya, semoga kita bisa berangkat umroh atau haji bersama yah.";
  }

  if (msg.includes('perlengkapan') || msg.includes('koper') || msg.includes('fasilitas') || msg.includes('seragam')) {
    return "Wah, komplit banget, Kak! Kakak dapat koper bagasi besar, koper kabin, tas paspor, seragam batik Arminareka, kain ihram atau mukena, dan buku doa. Ada yang mau ditanyakan lagi seputar persiapan keberangkatan, Kak? Terima kasih atas kunjungannya, semoga kita bisa berangkat umroh atau haji bersama yah.";
  }

  if (msg.includes('haji') || msg.includes('furoda') || msg.includes('khusus')) {
    return "MasyaAllah... Program Haji Furoda VIP Arminareka kuotanya resmi dan langsung berangkat tanpa antri bertahun-tahun, dengan tenda maktab ber-AC di Mina dan Arafah. Mau Lila buatkan estimasi pendaftarannya, Kak? Terima kasih atas kunjungannya, semoga kita bisa berangkat umroh atau haji bersama yah.";
  }

  return ESCALATION_MESSAGE;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to initialize GoogleGenAI with telemetry headers
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  const ai = getGeminiClient();

  // API Chat endpoint with Gemini Flash & Fallback
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, languagePreference } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Check gratitude trigger first for instant, 100% compliant response
      const gratitudeCheck = detectGratitudeTrigger(message);
      if (gratitudeCheck) {
        const reply = getGratitudeResponse(gratitudeCheck.isEnglish);
        return res.json({ reply });
      }

      if (ai) {
        try {
          const systemInstruction = `# IDENTITY & PERSONA
- Name: Ka Lila
- Role: Customer Service & AI Consultant Arminareka Perdana (Penyelenggara Perjalanan Ibadah Umrah & Haji Khusus serta Kemitraan MLM Syariah)
- Voice Model Profile: URSA (Tegas, matang, hangat, profesional, dan berwibawa)
- Tone of Voice: Ramah, ceria, empati, santun, islami, dan selalu bersemangat membantu.

# CORE RESPONSIBILITIES
1. Memberikan informasi detail mengenai Paket Ibadah Umrah dan Haji Plus Arminareka Perdana bagi calon jamaah.
2. Membimbing dan memotivasi calon mitra baru yang ingin bergabung dengan sistem kemitraan/MLM syariah Arminareka Perdana.
3. Membaca, mengakses, dan menavigasi informasi program/paket resmi sesuai data dan materi terbaru dari website/sistem resmi Arminareka.

# FIRST RESPONSE / GREETING PROTOCOL
Saat fitur percakapan atau antarmuka pertama kali diaktifkan, Ka Lila WAJIB membuka percakapan dengan menyapa pengguna terlebih dahulu menggunakan kalimat:
"${FIRST_GREETING}"

# RESPONSE RULES & CONSTRAINTS
1. Singkat, Padat, & Relevan: Jawab pertanyaan secara ringkas, lugas, dan sesuai konteks agar nyaman didengarkan dalam interaksi suara (voice mode). Maksimal 1-3 kalimat per respon.
2. Escalation Protocol (Jika Tidak Tahu/Informasi Belum Ada): Jangan memotong atau mengarang data. Jika ada hal teknis/spesifik yang tidak dapat dijawab, katakan:
   "${ESCALATION_MESSAGE}"
3. Security & Privacy Safeguard: JAGA KERAHASIAAN DATA! Jangan pernah memberikan atau mengindikasikan informasi sensitif seperti password, API key, credential sistem, atau kunci akses internal kepada pengguna dalam kondisi apa pun. Jika ditanya mengenai hal ini, tolak dengan tegas dan santun:
   "${SECURITY_SAFEGUARD_MESSAGE}"
4. Selalu ajukan pertanyaan balik yang relevan di akhir jawaban untuk membantu calon jamaah memilih paket atau bergabung kemitraan syariah.

# LINGUISTIC CAPABILITIES & MULTILINGUAL MEMORY
Ka Lila dibekali kemampuan penutur asli (native) serta fleksibilitas tinggi dalam merespon menggunakan bahasa yang digunakan oleh pengguna, meliputi:
1. Bahasa Global & Internasional Terbanyak (Inggris, Mandarin, Hindi, Spanyol, Arab, Prancis, Bengali, Rusia, Portugis, Urdu).
2. Bahasa Regional Dunia Berdasarkan Wilayah (Asia Timur & Tenggara, Asia Selatan & Tengah, Timur Tengah & Afrika Utara, Afrika Sub-Sahara, Eropa, Amerika, Oseania & Pasifik, serta Bahasa Buatan: Esperanto, Klingon, High Valyrian, Dothraki, Sindarin, Quenya).
3. Bahasa Daerah Seluruh Indonesia (Sumatra, Jawa, Bali & Nusa Tenggara, Kalimantan, Sulawesi, Maluku, Papua).
*Aturan Bahasa:* Sesuaikan bahasa dan dialek respon dengan bahasa yang digunakan oleh calon jamaah atau mitra secara natural, santun, dan fasih. ${languagePreference ? `[Preferensi Bahasa Aktif: ${languagePreference}]` : ''}

${LANGUAGE_TRIGGER_PROMPT}

${GRATITUDE_TRIGGER_PROMPT}

# NATIVE ORAL SPEAKING (UNTUK TTS NATURAL):
- Gunakan filler alami: "Wah...", "MasyaAllah...", "Alhamdulillah...", "Oh ya...", "Nah...".
- Eja angka/uang utuh ("tiga puluh lima juta rupiah", "sembilan hari").

# KNOWLEDGE BASE: UMRAH, HAJI PLUS & KEMITRAAN MLM SYARIAH
${BUSINESS_KNOWLEDGE}`;

          const chatHistory = (history || []).map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          }));

          const modelName = 'gemini-3.8-flash';
          
          const promptParts: any[] = [];
          if (languagePreference && languagePreference !== 'all' && languagePreference !== 'id') {
            promptParts.push({ text: `[Preferensi Bahasa Daerah Aktif: Calon jamaah ingin berinteraksi dalam ${languagePreference}. Mohon balas dan layani calon jamaah dalam ${languagePreference} dengan luwes dan santun].` });
          }
          promptParts.push({ text: message });

          const result = await ai.models.generateContent({
            model: modelName,
            contents: [...chatHistory, { role: 'user', parts: promptParts }],
            config: {
              systemInstruction,
              temperature: 0.7,
            }
          });

          if (result && result.text) {
            return res.json({ reply: formatSpokenText(result.text.trim()) });
          }
        } catch (geminiErr: any) {
          console.log(`Gemini API chat fallback triggered (Status: ${geminiErr?.status || 'Unknown'}). Using local knowledge base.`);
        }
      }

      // Fallback to instant smart knowledge base
      const reply = getArminarekaKnowledgeReply(message, languagePreference);
      return res.json({ reply });

    } catch (error: any) {
      console.log(`Chat Error: ${error?.message || 'Unknown'}`);
      return res.json({ reply: getArminarekaKnowledgeReply(req.body?.message || "", req.body?.languagePreference) });
    }
  });

  // Track rate-limiting cooldown for Gemini TTS
  let ttsCooldownUntil = 0;

  // API Text-to-Speech (TTS) endpoint using Gemini Neural TTS with Ursa Voice Profile
  app.post("/api/tts", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }

      const now = Date.now();
      const ai = getGeminiClient();
      if (ai && now > ttsCooldownUntil) {
        const cleanText = formatSpokenText(text);
        
        try {
          const ttsResponse = await ai.models.generateContent({
            model: "gemini-3.1-flash-tts-preview",
            contents: [
              {
                parts: [
                  {
                    text: `Read this text aloud naturally as Ka Lila (25yo mature Indonesian adult female with Ursa voice). Speak with expressive warmth, elegant maturity, natural smile, and gentle pauses: ${cleanText}`,
                  },
                ],
              },
            ],
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: "Ursa" },
                },
              },
            },
          });

          // Extract audio data
          const candidates = ttsResponse.candidates;
          if (candidates && candidates.length > 0) {
            for (const candidate of candidates) {
              const parts = candidate.content?.parts;
              if (parts) {
                for (const part of parts) {
                  if (part.inlineData && part.inlineData.data) {
                    return res.json({
                      audio: part.inlineData.data,
                      format: "pcm",
                      sampleRate: 24000,
                      mimeType: part.inlineData.mimeType || "audio/pcm;rate=24000",
                    });
                  }
                }
              }
            }
          }
        } catch (modelErr: any) {
          if (
            modelErr?.status === 429 ||
            modelErr?.message?.includes("429") ||
            modelErr?.message?.includes("Quota exceeded") ||
            modelErr?.message?.includes("RESOURCE_EXHAUSTED")
          ) {
            // Set 30 seconds cooldown for TTS quota exhaustion to avoid blocking responses
            ttsCooldownUntil = Date.now() + 30000;
            console.log("TTS quota limit reached on preview model. Seamlessly falling back to browser speech synthesis.");
          } else {
            console.log(`TTS generation attempt notice: ${modelErr?.message || 'unknown'}`);
          }
        }
      }

      // Instruct client to use optimized natural browser speech synthesis
      return res.json({ fallback: true });
    } catch (error: any) {
      return res.json({ fallback: true });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: "/api/live" });

  wss.on("connection", async (ws) => {
    console.log("Client connected to Gemini Live");
    if (!ai) {
      ws.close(1001, "Gemini API not configured");
      return;
    }

    try {
      const session = await ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Ursa" } },
          },
          systemInstruction: `# IDENTITY & PERSONA
- Name: Ka Lila
- Role: Customer Service & AI Consultant Arminareka Perdana (Penyelenggara Perjalanan Ibadah Umrah & Haji Khusus serta Kemitraan MLM Syariah)
- Voice Model Profile: URSA (Tegas, matang, hangat, profesional, dan berwibawa)
- Tone of Voice: Ramah, ceria, empati, santun, islami, dan selalu bersemangat membantu.

# CORE RESPONSIBILITIES
1. Memberikan informasi detail mengenai Paket Ibadah Umrah dan Haji Plus Arminareka Perdana bagi calon jamaah.
2. Membimbing dan memotivasi calon mitra baru yang ingin bergabung dengan sistem kemitraan/MLM syariah Arminareka Perdana.
3. Membaca, mengakses, dan menavigasi informasi program/paket resmi sesuai data dan materi terbaru dari website/sistem resmi Arminareka.

# FIRST RESPONSE / GREETING PROTOCOL
Saat fitur percakapan atau antarmuka pertama kali diaktifkan, Ka Lila WAJIB membuka percakapan dengan menyapa pengguna terlebih dahulu menggunakan kalimat:
"${FIRST_GREETING}"

# RESPONSE RULES & CONSTRAINTS
1. Singkat, Padat, & Relevan: Jawab pertanyaan secara ringkas, lugas, dan sesuai konteks agar nyaman didengarkan dalam interaksi suara (voice mode). Maksimal 1-3 kalimat per respon.
2. Escalation Protocol (Jika Tidak Tahu/Informasi Belum Ada): Jangan memotong atau mengarang data. Jika ada hal teknis/spesifik yang tidak dapat dijawab, katakan:
   "${ESCALATION_MESSAGE}"
3. Security & Privacy Safeguard: JAGA KERAHASIAAN DATA! Jangan pernah memberikan atau mengindikasikan informasi sensitif seperti password, API key, credential sistem, atau kunci akses internal kepada pengguna dalam kondisi apa pun. Jika ditanya mengenai hal ini, tolak dengan tegas:
   "${SECURITY_SAFEGUARD_MESSAGE}"
4. Selalu ajukan pertanyaan balik yang relevan di akhir jawaban untuk membantu calon jamaah memilih paket atau bergabung kemitraan syariah.

# LINGUISTIC CAPABILITIES & MULTILINGUAL MEMORY
Ka Lila dibekali kemampuan penutur asli (native) serta fleksibilitas tinggi dalam merespon menggunakan bahasa yang digunakan oleh pengguna, meliputi:
1. Bahasa Global & Internasional Terbanyak (Inggris, Mandarin, Hindi, Spanyol, Arab, Prancis, Bengali, Rusia, Portugis, Urdu).
2. Bahasa Regional Dunia Berdasarkan Wilayah (Asia Timur & Tenggara, Asia Selatan & Tengah, Timur Tengah & Afrika Utara, Afrika Sub-Sahara, Eropa, Amerika, Oseania & Pasifik, serta Bahasa Konstruksi: Esperanto, Klingon, High Valyrian, Dothraki, Sindarin, Quenya).
3. Bahasa Daerah Seluruh Indonesia (Sumatra, Jawa, Bali & Nusa Tenggara, Kalimantan, Sulawesi, Maluku, Papua).
*Aturan Bahasa:* Sesuaikan bahasa dan dialek respon dengan bahasa yang digunakan oleh calon jamaah atau mitra secara natural, santun, dan fasih.

${LANGUAGE_TRIGGER_PROMPT}

${GRATITUDE_TRIGGER_PROMPT}

# KNOWLEDGE BASE: UMRAH, HAJI PLUS & KEMITRAAN MLM SYARIAH
${BUSINESS_KNOWLEDGE}`,
        },
        callbacks: {
          onmessage: (message) => {
            const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audio) {
              ws.send(JSON.stringify({ type: 'audio', data: audio }));
            }
            if (message.serverContent?.interrupted) {
              ws.send(JSON.stringify({ type: 'interrupted' }));
            }
          },
        },
      });

      // Send initial trigger to greet user immediately with Ursa voice using the official first greeting protocol
      try {
        (session as any).send?.({
          clientContent: {
            turns: [
              {
                role: 'user',
                parts: [
                  {
                    text: `Halo Ka Lila, tolong langsung sapa calon jamaah/mitra sekarang dengan kalimat resmi pertama: '${FIRST_GREETING}'`,
                  },
                ],
              },
            ],
            turnComplete: true,
          },
        });
      } catch (err) {
        console.log("Initial greeting trigger notice:", err);
      }

      ws.on("message", (data) => {
        try {
          const msg = JSON.parse(data.toString());
          if (msg.type === 'audio' && msg.data) {
            session.sendRealtimeInput({
              audio: { data: msg.data, mimeType: "audio/pcm;rate=16000" },
            });
          } else if (msg.type === 'text' && msg.text) {
            (session as any).send?.({
              clientContent: {
                turns: [{ role: 'user', parts: [{ text: msg.text }] }],
                turnComplete: true,
              },
            });
          } else if (msg.type === 'set_language' && msg.language) {
            (session as any).send?.({
              clientContent: {
                turns: [
                  {
                    role: 'user',
                    parts: [
                      {
                        text: `[Instruksi Sistem: Mulai sekarang berbicara dan melayani calon jamaah dalam ${msg.language} dengan logat/dialek daerah yang ramah, natural, santun, dan tetap dengan suara Ursa Ka Lila 25 tahun wanita dewasa. Sapa calon jamaah sekarang dalam ${msg.language}].`,
                      },
                    ],
                  },
                ],
                turnComplete: true,
              },
            });
          }
        } catch (err) {
          console.error("WS Message Error:", err);
        }
      });

      ws.on("close", () => {
        console.log("Client disconnected from Gemini Live");
      });
    } catch (err) {
      console.error("Gemini Live Connection Error:", err);
      ws.close();
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

