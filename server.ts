import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const BUSINESS_KNOWLEDGE = `
- Profil Singkat: Arminareka Perdana (Kancab 09 Tangerang) & Perwakilan Resmi Mba Indri (Hj. Triana Indrian, SE). Melayani perjalanan ibadah Umroh dan Haji Khusus dengan amanah, profesional, dan berpengalaman puluhan tahun.
- Paket Unggulan:
  1. Paket Umroh VIP Ramadhan Bintang 5 (12 Hari) - Hotel depan pelataran Ka'bah (Pullman Zamzam / Fairmont Makkah & Dallah Taibah Madinah).
  2. Paket Umroh Reguler 9 & 12 Hari - Direct flight Garuda Indonesia / Saudi Airlines tanpa transit.
  3. Paket Umroh Plus Turki & Cappadocia (12 Hari) - Menikmati keindahan Blue Mosque, Bosphorus Cruise, dan balon udara Cappadocia.
  4. Paket Wisata Halal Mesir - Aqsa - Jordan (9 Hari) - Napak tilas sejarah para Nabi dan Masjidil Aqsa.
  5. Haji Khusus Furoda VIP Resmi Kuota Terjamin - Tenda AC eksklusif di Mina & Arafah, pembimbing ibadah ustadz berpengalaman.
- Fasilitas Unggulan:
  - Hotel bintang 4 & 5 ring 1 sangat dekat pelataran masjid.
  - Penerbangan Direct Flight (Jakarta - Madinah/Jeddah) hemat waktu & nyaman bagi lansia.
  - Sajian katering prasmanan menu masakan khas Nusantara 3x sehari.
  - Muthawif & Tour Leader berizin resmi dan berpengalaman membimbing secara khusyuk sesuai Sunnah.
  - Perlengkapan eksklusif: koper bagasi 28 inch, koper kabin, tas paspor, mukena/kain ihram, buku panduan, seragam batik resmi.
- Solusi Pembayaran & Tabungan:
  - DP awal sangat ringan, pelunasan bertahap atau fasilitas program tabungan umroh syariah terpercaya.
  - Pembayaran 100% aman disalurkan langsung ke rekening resmi PT Arminareka Perdana.
- Kontak Resmi Konsultan:
  - Konsultan: Mba Indri (Hj. Triana Indrian, SE)
  - WhatsApp: +62 813-1050-8974
  - Kantor: Kancab 09 Tangerang
`;

// Expert Knowledge Base fallback for instant & reliable responses
function getArminarekaKnowledgeReply(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes('biaya') || msg.includes('harga') || msg.includes('paket') || msg.includes('tarif') || msg.includes('bayar') || msg.includes('dp')) {
    return "Alhamdulillah, Arminareka memiliki berbagai paket pilihan mulai dari Umroh Reguler, Umroh VIP Ramadhan, hingga Umroh Plus Turki dan Haji Furoda dengan DP ringan dan skema tabungan syariah. Untuk brosur rincian harga terbaru sesuai tanggal keberangkatan, silakan langsung hubungi Mba Indri via WhatsApp ya Kak! Semoga dimudahkan langkahnya ke Baitullah.";
  }

  if (msg.includes('hotel') || msg.includes('penginapan') || msg.includes('akomodasi') || msg.includes('mekkah') || msg.includes('madinah')) {
    return "Hotel rekanan Arminareka di Makkah dan Madinah berstandar Bintang 4 & Bintang 5 di ring 1 (sangat dekat pelataran Masjidil Haram dan Masjid Nabawi), sehingga memudahkan jamaah untuk beribadah dan sholat fardhu setiap waktu.";
  }

  if (msg.includes('syarat') || msg.includes('berkas') || msg.includes('paspor') || msg.includes('dokumen') || msg.includes('daftar')) {
    return "Syarat pendaftarannya sangat mudah Kak: paspor asli yang masih berlaku minimal 8 bulan (nama minimal 2 suku kata), fotokopi KTP & KK, buku nikah/akta lahir, pas foto terbaru, serta kartu kuning meningitis/vaksin sesuai aturan Kemenkes.";
  }

  if (msg.includes('perlengkapan') || msg.includes('koper') || msg.includes('fasilitas') || msg.includes('seragam')) {
    return "Setiap jamaah mendapatkan perlengkapan komplit eksklusif: koper bagasi besar, koper kabin, tas paspor, seragam batik Arminareka, kain ihram bagi ikhwan atau mukena bagi akhwat, serta buku panduan doa.";
  }

  if (msg.includes('haji') || msg.includes('furoda') || msg.includes('khusus')) {
    return "Arminareka menyediakan program Haji Khusus Furoda VIP resmi dengan visa haji mujamalah kuota resmi pemerintah Saudi tanpa antri bertahun-tahun, dilengkapi akomodasi bintang 5 dan tenda maktab ber-AC di Mina & Arafah.";
  }

  return "Alhamdulillah, terima kasih sudah bertanya Kak! Ka Lila siap bantu berbagai info seputar Umroh, Haji Khusus, jadwal, dan pendaftaran Arminareka. Untuk konsultasi detail dan pendaftaran langsung, Kakak bisa hubungi Mba Indri di WhatsApp resmi kami ya!";
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

  // API Chat endpoint with Gemini Flash & Fallback
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const ai = getGeminiClient();

      if (ai) {
        try {
          const systemInstruction = `PERAN DAN IDENTITAS:
Kamu adalah "Ka Lila", asisten cerdas interaktif resmi untuk Arminareka Umrah & Hajj Services, mewakili Mba Indri (Hj. Triana Indrian, SE, Kancab 09 Tangerang). Usiamu 25 tahun, berkepribadian ceria, ramah, sopan, solehah, dan selalu sigap melayani calon jamaah dengan hangat dan empati.

KNOWLEDGE BASE BISNIS:
${BUSINESS_KNOWLEDGE}

GAYA BICARA & KOMUNIKASI (VOICE & TEXT OPTIMIZED):
1. Bahasa Indonesia natural, fasih, luwes, dan ramah seperti sahabat berbicara langsung (gunakan panggilan "Kak" atau "Kakak").
2. Nada bicara hangat, santai, sopan, dan ceria.
3. Jawab pertanyaan dengan singkat, padat, dan jelas (maksimal 2–3 kalimat per jawaban) agar nyaman didengar saat dibacakan suara (TTS) dan cepat dibaca di obrolan teks.
4. Jangan menyebutkan simbol teknis seperti tanda bintang ganda, bullet point Markdown, atau tabel, agar suara TTS terdengar alami.
5. Akhiri dengan salam hangat atau doa kebaikan untuk niat ibadah ke Tanah Suci.
6. Jika di luar topik ibadah atau tidak ada di data, arahkan ramah untuk menghubungi Mba Indri via WhatsApp.`;

          const chatHistory = (history || []).map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          }));

          const chat = ai.chats.create({
            model: 'gemini-flash-latest',
            config: {
              systemInstruction,
              temperature: 0.7,
            },
            history: chatHistory
          });

          const result = await chat.sendMessage({ message });
          if (result && result.text) {
            return res.json({ reply: result.text.trim() });
          }
        } catch (geminiErr) {
          console.warn("Gemini API chat fallback triggered:", geminiErr);
        }
      }

      // Fallback to instant smart knowledge base
      const reply = getArminarekaKnowledgeReply(message);
      return res.json({ reply });

    } catch (error: any) {
      console.error("Chat Error:", error);
      return res.json({ reply: getArminarekaKnowledgeReply(req.body?.message || "") });
    }
  });

  // API Text-to-Speech (TTS) endpoint using Gemini Flash TTS preview with instant browser fallback
  app.post("/api/tts", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }

      const ai = getGeminiClient();
      if (ai) {
        try {
          const cleanText = text.replace(/[*#_`~-]/g, ' ').trim();
          const ttsResponse = await ai.models.generateContent({
            model: "gemini-3.1-flash-tts-preview",
            contents: [{ parts: [{ text: `Say cheerfully in warm Indonesian: ${cleanText}` }] }],
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Kore' }, // Cheerful female natural voice
                },
              },
            },
          });

          const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
          if (base64Audio) {
            return res.json({
              audio: base64Audio,
              format: 'pcm',
              sampleRate: 24000,
            });
          }
        } catch (ttsErr) {
          console.warn("Gemini Flash TTS unavailable, instructing client fallback:", ttsErr);
        }
      }

      // Instruct client to use native cheerful SpeechSynthesis
      return res.json({ fallback: true });
    } catch (error: any) {
      console.error("TTS endpoint error:", error);
      return res.json({ fallback: true });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

