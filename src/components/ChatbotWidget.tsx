import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Sparkles, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: 'Assalamualaikum Warohmatullahi wabarakhatu !\nAku Ka Lila, AI Agent yang Siap membantu Kaka 24 jam dan juga para tamu Allah yang siap menjadi Jamaah Umroh & Haji.\n\nAda yang bisa aku bantu, Ka ??\nSilahkan Chat dibawah ya',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'Berapa biaya Paket Umroh?',
    'Apa saja fasilitas hotel di Mekkah?',
    'Bagaimana cara daftar Haji Khusus?',
    'Apa saja perlengkapan yang didapat?',
  ];

  const sendSpecificMessage = async (text: string) => {
    if (isLoading) return;
    const userText = text;
    const newMessages: Message[] = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText,
          history: newMessages.slice(0, -1),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gagal menghubungi server.');
      }

      setMessages((prev) => [...prev, { role: 'model', text: data.reply }]);
    } catch (err: any) {
      console.error(err);
      // Fallback response for instant UX
      let fallbackReply = "Alhamdulillah, Arminareka menyediakan berbagai pilihan program Umroh & Haji Khusus dengan fasilitas terbaik, hotel bintang 5 dekat Masjidil Haram, serta bimbingan manasik profesional. Silakan hubungi WhatsApp resmi kami untuk pendaftaran cepat!";
      if (userText.toLowerCase().includes('biaya')) {
        fallbackReply = "Biaya Paket Umroh & Haji Khusus bervariasi sesuai program pilihan (seperti Umroh VIP Plus Turkey atau Haji Khusus Furoda/Kupon). Hubungi admin kami via WhatsApp untuk brosur dan harga terbaru!";
      } else if (userText.toLowerCase().includes('hotel')) {
        fallbackReply = "Hotel pilihan Arminareka di Mekkah dan Madinah berada di lokasi sangat strategis (dekat Masjidil Haram dan Masjid Nabawi), seperti Abraj Al Bait, Movenpick, dan Ajyad Makareem.";
      } else if (userText.toLowerCase().includes('perlengkapan')) {
        fallbackReply = "Jamaah mendapatkan perlengkapan eksklusif lengkap: Koper Besar, Koper Kabin, Ransel Arafah Mina, Tas Masjid, Kain Ihram, Seragam Batik, Mukena, Buku Doa, dan atribut lengkap lainnya.";
      }
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: fallbackReply,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
    const text = inputMessage.trim();
    setInputMessage('');
    await sendSpecificMessage(text);
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setTimeout(() => setIsDragging(false), 50)}
      className="fixed bottom-6 right-6 z-50 cursor-grab active:cursor-grabbing select-none"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-0 w-[90vw] sm:w-[380px] h-[520px] liquid-glass bg-slate-900/95 border border-amber-400/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white backdrop-blur-md cursor-auto"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-amber-600/30 via-slate-900/80 to-slate-900 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md">
                    <Bot size={22} />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                    Ka Lila <Sparkles size={14} className="text-amber-400" />
                  </h4>
                  <p className="text-[11px] text-amber-300">AI Asisten Umroh & Haji</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Tutup Chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-black/30">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 ${
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                      msg.role === 'user'
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-slate-800 text-amber-300 border border-amber-400/30'
                    }`}
                  >
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div
                    className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                        : 'bg-slate-800/90 text-slate-100 border border-white/10 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-amber-300 border border-amber-400/30 flex items-center justify-center text-xs shrink-0">
                    <Bot size={14} />
                  </div>
                  <div className="bg-slate-800/90 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="px-3 py-2 bg-slate-950/60 border-t border-white/10 flex gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => sendSpecificMessage(q)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-amber-400 hover:text-slate-950 text-slate-200 whitespace-nowrap transition-colors border border-white/10 cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-slate-950/80 border-t border-white/10 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Tanyakan seputar Umroh & Haji..."
                className="flex-1 bg-black/40 border border-white/15 rounded-full px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="w-10 h-10 rounded-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:hover:bg-amber-400 text-slate-950 flex items-center justify-center transition-colors shadow-lg cursor-pointer shrink-0"
                aria-label="Kirim Pesan"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <div className="relative flex items-center gap-2">
        {!isOpen && (
          <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-slate-900/95 text-amber-300 border border-amber-400/40 text-[11px] font-semibold px-3 py-1.5 rounded-2xl shadow-xl backdrop-blur-sm whitespace-nowrap">
              Tanya Ka Lila ✨
            </div>
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (!isDragging) {
              setIsOpen(!isOpen);
            }
          }}
          className="relative group flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold rounded-full shadow-2xl border border-amber-300/40 cursor-pointer shrink-0"
          aria-label="Chat dengan Ka Lila"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </span>
          <MessageCircle size={26} className="text-slate-950" />
        </motion.button>
      </div>
    </motion.div>
  );
}
