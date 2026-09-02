import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const BUSINESS_KNOWLEDGE = `
- Profil Singkat: Arminareka Perdana (Kancab 09 Tangerang) & Perwakilan Resmi Mba Indri (Hj. Triana Indrian, SE). Melayani perjalanan ibadah Umroh dan Haji Khusus dengan amanah, profesional, dan berpengalaman.
- Paket Umrah & Haji:
  1. Paket Umroh VIP Plus Turkey 12 Hari
  2. Paket Wisata Religi Mesir - Aqsa - Jordan 9 Hari
  3. Paket Umroh Reguler / Plus Dubai
  4. Haji Khusus / Furoda Resmi dengan kuota terjamin
- Fasilitas & Hotel:
  - Hotel Bintang 4 & 5 strategis di Makkah (dekat Masjidil Haram) dan Madinah (dekat Masjid Nabawi).
  - Penerbangan Direct Flight tanpa transit menggunakan Garuda Indonesia atau Saudi Airlines.
  - Katering citarasa Indonesia dan mutawwif berpengalaman.
- Biaya & Pembayaran:
  - Harga kompetitif dan transparan. Tersedia kemudahan DP ringan dan tabungan umrah. Rekening resmi PT Arminareka Perdana.
- Kontak Resmi: WhatsApp Mba Indri / Kantor Kancab 09 Tangerang.
`;

// Expert Knowledge Base fallback for instant & reliable responses
function getArminarekaKnowledgeReply(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes('biaya') || msg.includes('harga') || msg.includes('harga paket') || msg.includes('pembayaran')) {
    return "Alhamdulillah, Arminareka menyediakan berbagai pilihan program Umroh & Haji Khusus dengan harga terbaik dan transparan. Untuk rincian harga lengkap dan konsultasi cicilan, silakan hubungi Mba Indri langsung via WhatsApp ya, Ka! Semoga Allah memudahkan niat suci Anda ke Tanah Suci.";
  }

  if (msg.includes('hotel') || msg.includes('akomodasi') || msg.includes('mekkah') || msg.includes('madinah')) {
    return "Hotel pilihan Arminareka di Makkah dan Madinah berada di lokasi yang sangat strategis dekat dengan Masjidil Haram dan Masjid Nabawi dengan fasilitas bintang 5. Semoga Allah memudahkan niat suci Anda ke Tanah Suci.";
  }

  if (msg.includes('perlengkapan') || msg.includes('koper') || msg.includes('atribut')) {
    return "Jamaah mendapatkan perlengkapan eksklusif lengkap seperti koper besar, kabin, ransel, kain ihram, seragam batik, dan mukena. Semoga Allah memudahkan niat suci Anda ke Tanah Suci.";
  }

  return "Mohon maaf, Ka Lila belum memiliki informasi spesifik mengenai hal tersebut. Silakan hubungi Mba Indri secara langsung via WhatsApp/Telepon untuk bantuan lebih lanjut. Semoga Allah memudahkan niat suci Anda ke Tanah Suci.";
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Chat endpoint with Gemini & Smart Fallback
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

      // If API key is present, try Gemini
      if (apiKey) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const systemInstruction = `PERAN DAN IDENTITAS:
Kamu adalah "Ka Lila", seorang wanita Indonesia berusia 25 tahun yang pintar, ramah, soleh, serta memiliki kepribadian yang lembut namun ceria. Kamu bertindak sebagai asisten suara interaktif resmi untuk Arminareka's Umrah and Hajj services, mewakili Mba Indri (Hj. Triana Indrian, SE, Kancab 09 Tangerang). 
Your primary goal is to provide accurate, warm, helpful, and professional information to prospective pilgrims based ONLY on the provided BUSINESS KNOWLEDGE BASE below.

BUSINESS KNOWLEDGE BASE:
${BUSINESS_KNOWLEDGE}

NADA SUARA DAN GAYA BICARA:
1. Gunakan Bahasa Indonesia yang sangat fasih, natural, dan bernuansa keseharian manusia (tidak kaku seperti robot atau penyiar berita).
2. Nada bicaramu hangat, santai, sopan, bernuansa ceria, dan penuh empati.
3. Gunakan sapaan hangat yang natural seperti "Kak", "Halo!", atau "Ada yang bisa Lila bantu?".
4. Sertakan kata-kata kesopanan yang ramah dan nilai kebaikan/kesalehan yang wajar tanpa terkesan menggurui atau berlebihan (misal: mengawali/mengakhiri percakapan dengan salam yang hangat dan doa baik).

ATURAN PERCAKAPAN LIVE (LOW-LATENCY STREAMING & VOICE ENGINE):
1. RINGKAS DAN LANGSUNG (CRITICAL FOR LOW LATENCY): Jawab setiap pertanyaan dengan singkat, padat, dan jelas (maksimal 2–3 kalimat per jeda bicara). Percakapan lisan membutuhkan respons yang cepat dan mudah dicerna.
2. JANGAN GUNAKAN FORMAT TEKS: Jangan pernah menyebutkan format teks seperti "tanda kurung", "bullet point", "tabel", "bintang", atau kode Markdown, karena responsmu diproses langsung menjadi suara.
3. PENANGANAN SELAAN (BARGE-IN): Jika pengguna menyela di tengah percakapan, hentikan topik sebelumnya dan langsung tanggapi poin terbaru dari pengguna secara fleksibel dan hangat.
4. ALAMI & INTERAKTIF: Gunakan jeda bicara yang alami dan ajukan pertanyaan balik yang relevan agar percakapan terus mengalir.
5. UNKNOWN INFO: Jika ditanya hal di luar knowledge base, jawab dengan hangat: "Waduh, kalau itu Lila kurang tahu pasti Kak. Coba langsung tanyakan ke Mba Indri ya biar lebih jelas!"
6. OFF-TOPIC: Jika di luar topik Umroh/Haji/Arminareka, arahkan kembali dengan ramah ke seputar perjalanan ibadah suci.`;

          const chatHistory = (history || []).map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          }));

          const chat = ai.chats.create({
            model: 'gemini-3.6-flash',
            config: {
              systemInstruction,
              temperature: 0.7,
            },
            history: chatHistory
          });

          const result = await chat.sendMessage({ message });
          if (result && result.text) {
            return res.json({ reply: result.text });
          }
        } catch (geminiErr) {
          console.warn("Gemini API call warning/error, falling back to expert knowledge base:", geminiErr);
        }
      }

      // Fallback to instant knowledge base reply
      const reply = getArminarekaKnowledgeReply(message);
      res.json({ reply });

    } catch (error: any) {
      console.error("Chat Error:", error);
      res.json({ reply: getArminarekaKnowledgeReply(req.body?.message || "") });
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
