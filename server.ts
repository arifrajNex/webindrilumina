import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Expert Knowledge Base fallback for instant & reliable responses
function getArminarekaKnowledgeReply(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes('biaya') || msg.includes('harga') || msg.includes('harga paket') || msg.includes('pembayaran')) {
    return "Alhamdulillah, Arminareka menyediakan berbagai pilihan program Umroh & Haji Khusus dengan harga terbaik dan transparan:\n\n1. Paket Umroh VIP Plus Turkey 12 Hari (Musim Salju)\n2. Paket Wisata Religi Mesir - Aqsa - Jordan 9 Hari\n3. Paket Umroh Reguler / Plus Dubai\n4. Haji Khusus / Furoda Resmi\n\nUntuk rincian harga, promo cicilan, dan pendaftaran, silakan hubungi admin WhatsApp resmi kami atau konsultasi langsung dengan Hj. Triana Indrian, SE!";
  }

  if (msg.includes('hotel') || msg.includes('akomodasi') || msg.includes('mekkah') || msg.includes('madinah')) {
    return "Hotel pilihan Arminareka di Mekkah & Madinah sangat strategis dan berkualitas tinggi (bintang 4 & 5), berada sangat dekat dengan Masjidil Haram dan Masjid Nabawi sehingga memudahkan jamaah beribadah dengan khusyuk.";
  }

  if (msg.includes('perlengkapan') || msg.includes('koper') || msg.includes('atribut')) {
    return "Jamaah Arminareka mendapatkan perlengkapan eksklusif lengkap:\n- Koper Besar & Koper Kabin\n- Ransel Arafah Mina & Tas Masjid\n- Kain Ihram & Sabuk Ihram\n- Seragam Batik & Baju Koko\n- Mukena & Bergo (Wanita)\n- Topi, Payung, Handuk Kecil, Buku Doa, ID Card, dan atribut pendukung lainnya.";
  }

  if (msg.includes('haji') || msg.includes('haji khusus') || msg.includes('furoda')) {
    return "Program Haji Khusus Arminareka menggunakan kuota resmi dengan bimbingan manasik intensif, akomodasi VIP, dan didampingi pembimbing berpengalaman hingga di Arafah & Mina.";
  }

  if (msg.includes('penerbangan') || msg.includes('pesawat') || msg.includes('garuda') || msg.includes('saudia')) {
    return "Penerbangan Haji & Umroh Arminareka menggunakan maskapai kelas dunia seperti Garuda Indonesia dan Saudi Airlines dengan rute langsung (Direct Flight) Jakarta - Jeddah/Madinah tanpa transit.";
  }

  if (msg.includes('daftar') || msg.includes('cara') || msg.includes('kontak') || msg.includes('admin') || msg.includes('whatsapp')) {
    return "Untuk pendaftaran atau konsultasi cepat, Anda dapat mengklik tombol 'Konsultasi Free' atau langsung menghubungi nomor WhatsApp resmi kami di website ini. Tim kami siap melayani Anda 24/7!";
  }

  return "Alhamdulillah, Arminareka Kancab 09 Tangerang (Pimpinan Hj. Triana Indrian, SE) siap melayani perjalanan ibadah Umroh dan Haji Khusus Anda dengan penuh amanah, profesional, fasilitas hotel bintang 5, penerbangan langsung, dan perlengkapan eksklusif. Ada hal khusus mengenai paket, hotel, atau jadwal yang ingin ditanyakan, Ka?";
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

      const apiKey = process.env.GEMINI_API_KEY;

      // If API key is present, try Gemini
      if (apiKey) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const systemInstruction = "Anda adalah Ka Lila, AI Asisten Jamaah Umroh & Haji yang ramah, profesional, religius, dan sangat membantu dari Arminareka (Kancab 09 Tangerang, pimpinan Hj. Triana Indrian, SE). Anda membantu jamaah menjawab pertanyaan seputar paket umroh, haji khusus, manasik, perlengkapan, hotel, penerbangan, dan panduan ibadah dengan cepat dan akurat. Sapa jamaah dengan ramah dan hangat.";

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
