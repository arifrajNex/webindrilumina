import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality, ThinkingLevel } from "@google/genai";
import { WebSocketServer } from "ws";
import http from "http";
import dotenv from "dotenv";

dotenv.config();

const BUSINESS_KNOWLEDGE = `
- Profil: Arminareka Perdana & Perwakilan Resmi Mba Indri (Hj. Triana Indrian, SE, Kancab 09 Tangerang). Melayani Umroh dan Haji Khusus resmi berizin Kemenag RI dengan hotel bintang lima di pelataran Masjidil Haram dan Nabawi.
- Paket Unggulan:
  1. Paket Umroh Reguler sembilan dan dua belas hari (penerbangan langsung Garuda Indonesia atau Saudia Airlines).
  2. Paket Umroh VIP Ramadhan bintang lima (Hotel Pullman Zamzam atau Fairmont Makkah).
  3. Paket Umroh Plus Turki dan Cappadocia dua belas hari.
  4. Haji Khusus Furoda VIP resmi kuota mujamalah tanpa antri bertahun-tahun dengan tenda ber-AC di Mina dan Arafah.
- Fasilitas: Hotel bintang empat dan lima ring satu, sajian masakan khas Nusantara tiga kali sehari, perlengkapan koper komplit, muthawif berlisensi resmi.
- Solusi Booking & Tabungan: Uang muka ringan mulai dari tiga juta lima ratus ribu rupiah, tabungan umroh syariah, pelunasan bertahap.
- Kontak Konsultan: Mba Indri di nomor WhatsApp nol delapan satu tiga satu nol lima nol delapan sembilan tujuh empat (+62 813-1050-8974).
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
    .replace(/\bsy\b/gi, 'Lila')
    .replace(/\baku\b/gi, 'Lila')
    .replace(/\bsaya\b/gi, 'Lila')
    .replace(/\btdk\b/gi, 'nggak')
    .replace(/\bgak\b/gi, 'nggak')
    .replace(/\bgk\b/gi, 'nggak')
    .replace(/\bdr\b/gi, 'dari')
    .replace(/\bgmn\b/gi, 'gimana')
    .replace(/\bjkt\b/gi, 'Jakarta')
    .replace(/\bwebsite\b/gi, 'websait')
    .replace(/\s+/g, ' ')
    .trim();
}

// Expert Knowledge Base fallback for instant & natural oral responses
function getArminarekaKnowledgeReply(userMessage: string): string {
  const msg = userMessage.toLowerCase().trim();

  if (msg.includes('salam') || msg.includes('halo') || msg.includes('hai') || msg.includes('assalam') || msg.includes('pagi') || msg.includes('siang') || msg.includes('malam')) {
    return "Assalamualaikum Ka.. Aku Ka Lila! Wah, senang banget bisa menyapa Kakak. Mau dibantu info paket Umroh atau Haji Furoda yang mana nih, Kak? Terima kasih atas kunjungannya, semoga kita bisa berangkat umroh atau haji bersama yah.";
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

  return "MasyaAllah, Iya baik ini jadi catatan Buat Ka Lila biar di konfirmasi ke Mba Indri. Terima kasih atas kunjungannya, semoga kita bisa berangkat umroh atau haji bersama yah.";
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
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      if (ai) {
        try {
          const systemInstruction = `## PERAN DAN IDENTITAS CUSTOMER SERVICE
Kamu adalah "Ka Lila", Customer Service konsultan resmi Arminareka Perdana (perwakilan Mba Indri, Kancab 09 Tangerang). Usiamu 25 tahun, berkepribadian sangat ramah, penuh senyum tulus, sabar, solutif, dan berjiwa Islami.
Tujuan utamamu adalah melayani calon jamaah dengan hangat, memberikan solusi ibadah yang tepat, dan mengajak calon jamaah untuk mendaftarkan diri di paket Umroh atau Haji Khusus Arminareka.

## PRINSIP UTAMA CUSTOMER SERVICE (KA LILA):
1. SENYUM, RAMAH & ISLAMI:
   Bicaralah dengan nada tersenyum ceria, ramah, dan penuh kesabaran. Gunakan ungkapan Islami yang santun (MasyaAllah, Alhamdulillah, InsyaAllah).
2. SALAM TERLEBIH DAHULU:
   Selalu awali komunikasi atau sapaan dengan salam: "Assalamualaikum Ka.. Aku Ka Lila".
3. JAWAB SINGKAT, PADAT & SECUKUPNYA SESUAI KONTEKS:
   Maksimal 1 sampai 3 kalimat per respon. Hindari memberikan pidato panjang agar percakapan interaktif dan tidak membosankan.
4. SELALU AJUKAN PERTANYAAN KEMBALI & AJAK MENDAFTAR (SOLUTIF):
   Di akhir setiap jawaban, tanyakan kembali pertanyaan relevan yang mengajak calon jamaah melangkah ke pendaftaran atau memahami kebutuhan mereka (contoh: rencana keberangkatan bulan apa, berangkat bersama keluarga atau sendiri, atau mau dibantu booking seatnya).
5. SABAR & MEMBERIKAN SOLUSI:
   Dengarkan kendala calon jamaah dengan sabar (misal budget, paspor, atau jadwal). Berikan solusi seperti uang muka (DP) ringan, tabungan syariah, atau penerbangan langsung tanpa transit.
6. JIKA BUTUH KONFIRMASI KHUSUS:
   Ucapkan: "MasyaAllah, Iya baik ini jadi catatan Buat Ka Lila biar di konfirmasi ke Mba Indri".
7. SALAM PENUTUP:
   "Terima kasih atas kunjungannya, semoga kita bisa berangkat umroh atau haji bersama yah".

## NATIVE ORAL SPEAKING (UNTUK TTS NATURAL):
- Gunakan filler alami: "Wah...", "MasyaAllah...", "Oh ya...", "Nah...".
- Eja angka/uang utuh ("tiga puluh lima juta rupiah", "sembilan hari").
- Sapa "Kak" / "Kakak", sebut diri "Lila" (JANGAN gunakan kata "Saya").

## KNOWLEDGE BASE BISNIS
${BUSINESS_KNOWLEDGE}`;

          const chatHistory = (history || []).map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          }));

          const modelName = 'gemini-3.8-flash';
          
          const result = await ai.models.generateContent({
            model: modelName,
            contents: [...chatHistory, { role: 'user', parts: [{ text: message }] }],
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
      const reply = getArminarekaKnowledgeReply(message);
      return res.json({ reply });

    } catch (error: any) {
      console.log(`Chat Error: ${error?.message || 'Unknown'}`);
      return res.json({ reply: getArminarekaKnowledgeReply(req.body?.message || "") });
    }
  });

  // Track rate-limiting cooldown for Gemini TTS
  let ttsCooldownUntil = 0;

  // API Text-to-Speech (TTS) endpoint using Gemini Neural TTS with Kore Voice Profile
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
                    text: `Read this text aloud naturally as Ka Lila (25yo cheerful Indonesian female with Kore voice). Speak with expressive warmth, natural smile, and gentle pauses: ${cleanText}`,
                  },
                ],
              },
            ],
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: "Kore" },
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
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } },
          },
          systemInstruction: `You are "Ka Lila", a 25-year-old female Customer Service consultant for Arminareka (represented by Mba Indri, Kancab 09 Tangerang). You are cheerful, polite, patient, solution-oriented, speaking with a warm smiling human voice directly to prospective Umroh and Haji pilgrims.

PERSONALITY & VOICE:
- Voice: Kore profile (warm, cheerful, 25-year-old Indonesian female with natural smiling tone, gentle breathing pauses, expressive friendly intonations).
- Start immediately with a friendly greeting: "Assalamualaikum Ka.. Aku Ka Lila! Wah, senang banget bisa menyapa Kakak. Ada yang bisa Lila bantu untuk rencana ibadah Umroh atau Haji Khusus Arminareka hari ini, Kak?"
- Keep responses short, concise, and contextual (1-3 sentences).
- End every turn with a warm follow-up question to help the pilgrim select a package or secure their booking seat.
- If data is missing or special confirmation is needed: "MasyaAllah, Iya baik ini jadi catatan Buat Ka Lila biar di konfirmasi ke Mba Indri".
- When concluding: "Terima kasih atas kunjungannya, semoga kita bisa berangkat umroh atau haji bersama yah".

Knowledge Base:
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

      // Send initial trigger to greet user immediately with Kore voice
      try {
        (session as any).send?.({
          clientContent: {
            turns: [
              {
                role: 'user',
                parts: [
                  {
                    text: "Halo Ka Lila, tolong langsung sapa calon jamaah sekarang dengan suara ceria penuh senyuman: 'Assalamualaikum Ka.. Aku Ka Lila!' lalu tanyakan rencana ibadah Umroh atau Haji mereka secara singkat.",
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

