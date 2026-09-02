import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Sparkles, Bot, User, Mic, MicOff, Volume2, VolumeX, PhoneCall, PhoneOff } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Assalamu'alaikum! Aku Ka Lila, Asisten Virtual dari Ka Indri untuk Umrah dan Haji Arminareka. Ada yang bisa Ka Lila bantu untuk rencana ibadah Anda hari ini?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isVoiceCallMode, setIsVoiceCallMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'Berapa biaya Paket Umroh?',
    'Apa saja fasilitas hotel di Mekkah?',
    'Bagaimana cara daftar Haji Khusus?',
    'Apa saja perlengkapan yang didapat?',
  ];

  // Text to Speech function with continuous 2-way callback support
  const speakText = (text: string, onFinish?: () => void) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) {
      if (onFinish) onFinish();
      return;
    }
    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const cleanText = text.replace(/[*#_`~-]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'id-ID';
    utterance.rate = 1.0;
    utterance.pitch = 1.1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (onFinish) onFinish();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      if (onFinish) onFinish();
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Speech Recognition (Voice Input) with continuous call mode handling
  const startListening = (onResultCallback?: (transcript: string) => void) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Maaf, browser Anda tidak mendukung fitur Voice Input. Silakan gunakan Google Chrome.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        setInputMessage(speechResult);
        setIsListening(false);
        if (speechResult) {
          if (onResultCallback) {
            onResultCallback(speechResult);
          } else {
            sendSpecificMessage(speechResult);
          }
        }
      };

      recognition.onerror = (e: any) => {
        console.error("Speech recognition error:", e);
        setIsListening(false);
        // If in voice call mode and error occurs, retry listening after brief pause
        if (isVoiceCallMode && !isSpeaking && !isLoading) {
          setTimeout(() => startListening(), 1500);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      startListening();
    }
  };

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

      const replyText = data.reply;
      setMessages((prev) => [...prev, { role: 'model', text: replyText }]);
      
      // Speak response, and if Voice Call Mode is active, automatically start listening again when Ka Lila finishes speaking!
      speakText(replyText, () => {
        if (isVoiceCallMode) {
          setTimeout(() => {
            startListening();
          }, 600);
        }
      });
    } catch (err: any) {
      console.error(err);
      let fallbackReply = "Alhamdulillah, Arminareka menyediakan berbagai pilihan program Umroh & Haji Khusus dengan fasilitas terbaik dan hotel bintang 5. Silakan hubungi WhatsApp resmi kami untuk pendaftaran cepat!";
      if (userText.toLowerCase().includes('biaya')) {
        fallbackReply = "Biaya Paket Umroh & Haji Khusus bervariasi sesuai program pilihan. Hubungi admin kami via WhatsApp untuk brosur dan harga terbaru!";
      } else if (userText.toLowerCase().includes('hotel')) {
        fallbackReply = "Hotel pilihan Arminareka di Mekkah dan Madinah berada di lokasi sangat strategis dekat Masjidil Haram dan Masjid Nabawi.";
      }
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: fallbackReply,
        },
      ]);
      speakText(fallbackReply, () => {
        if (isVoiceCallMode) {
          setTimeout(() => {
            startListening();
          }, 600);
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceCallMode = () => {
    if (!isVoiceCallMode) {
      setIsVoiceCallMode(true);
      // Greet and start listening right away
      const greeting = "Assalamu'alaikum! Mode panggilan suara aktif. Silakan bicara, Ka Lila mendengarkan.";
      speakText(greeting, () => {
        startListening();
      });
    } else {
      setIsVoiceCallMode(false);
      stopSpeaking();
      setIsListening(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    } else {
      stopSpeaking();
      setIsVoiceCallMode(false);
      setIsListening(false);
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
            className="absolute bottom-20 right-0 w-[90vw] sm:w-[380px] h-[540px] liquid-glass bg-slate-900/95 border border-amber-400/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white backdrop-blur-md cursor-auto"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-amber-600/30 via-slate-900/80 to-slate-900 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md">
                    <Bot size={22} />
                  </div>
                  <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-slate-900 rounded-full ${isSpeaking ? 'bg-amber-400 animate-ping' : isListening ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                    Ka Lila AI Voice {isVoiceCallMode && <span className="text-[10px] bg-rose-500/80 text-white px-2 py-0.5 rounded-full animate-pulse">LIVE CALL</span>}
                  </h4>
                  <p className="text-[11px] text-amber-300 flex items-center gap-1">
                    {isSpeaking ? '🔊 Ka Lila berbicara...' : isListening ? '🎙️ Mendengarkan suara Anda...' : isVoiceCallMode ? '📞 Mode Panggilan Aktif' : 'Asisten Virtual Mba Indri'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleVoiceCallMode}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    isVoiceCallMode 
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30 animate-pulse' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/30'
                  }`}
                  title={isVoiceCallMode ? "Akhiri Panggilan Suara" : "Mulai Panggilan Suara 2 Arah"}
                >
                  {isVoiceCallMode ? <PhoneOff size={13} /> : <PhoneCall size={13} />}
                  <span>{isVoiceCallMode ? 'Akhiri' : 'Call'}</span>
                </button>
                <button
                  onClick={() => {
                    setVoiceEnabled(!voiceEnabled);
                    if (isSpeaking) stopSpeaking();
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${voiceEnabled ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' : 'bg-white/10 text-white/50'}`}
                  title={voiceEnabled ? "Voice Assistant Aktif" : "Voice Assistant Mute"}
                >
                  {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
                <button
                  onClick={() => {
                    stopSpeaking();
                    setIsOpen(false);
                  }}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                  aria-label="Tutup Chat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Voice Call Active Banner / Overlay if active */}
            {isVoiceCallMode && (
              <div className="bg-gradient-to-r from-rose-900/60 via-amber-900/40 to-slate-900 px-4 py-2.5 border-b border-rose-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-rose-200">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-1 bg-rose-400 animate-bounce h-full"></span>
                    <span className="w-1 bg-amber-400 animate-bounce [animation-delay:0.2s] h-3"></span>
                    <span className="w-1 bg-rose-400 animate-bounce [animation-delay:0.4s] h-4"></span>
                  </div>
                  <span className="font-medium">
                    {isSpeaking ? 'Ka Lila sedang berbicara...' : isListening ? 'Silakan bicara sekarang...' : 'Menghubungkan suara...'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (isListening) setIsListening(false);
                    else startListening();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/30 text-rose-200 hover:bg-rose-500/50 text-[11px] font-semibold"
                >
                  {isListening ? 'Berhenti Dengar' : 'Dengarkan'}
                </button>
              </div>
            )}

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
                  <div className="relative group max-w-[78%]">
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                          : 'bg-slate-800/90 text-slate-100 border border-white/10 rounded-tl-none shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.role === 'model' && (
                      <button
                        onClick={() => speakText(msg.text)}
                        className="absolute -right-8 bottom-1 p-1.5 rounded-full bg-slate-800/80 text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-amber-500 hover:text-slate-950"
                        title="Dengarkan Suara"
                      >
                        <Volume2 size={12} />
                      </button>
                    )}
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

            {/* Input Form with Voice Mic */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-slate-950/80 border-t border-white/10 flex items-center gap-2"
            >
              <button
                type="button"
                onClick={toggleListening}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-md ${
                  isListening 
                    ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/50' 
                    : 'bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/30'
                }`}
                title={isListening ? "Hentikan mendengarkan" : "Bicara dengan Ka Lila (Voice Input)"}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isListening ? "Mendengarkan suara Anda..." : isVoiceCallMode ? "Mode panggilan suara aktif (bicara langsung)..." : "Tanyakan seputar Umroh & Haji..."}
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
      <div className="relative flex items-center gap-2 group">
        <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-slate-900/95 text-amber-300 border border-amber-400/40 text-[11px] font-semibold px-3 py-1.5 rounded-2xl shadow-xl backdrop-blur-sm whitespace-nowrap">
            Tanya Ka Lila ✨ (Live 2-Way Voice)
          </div>
        </div>
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
