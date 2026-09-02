import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneCall,
  PhoneOff,
} from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

type WidgetTab = 'voice' | 'chat';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<WidgetTab>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Assalamu'alaikum! Aku Ka Lila, Asisten AI Cerdas resmi Arminareka mewakili Mba Indri (Kancab 09 Tangerang). Ada yang bisa Ka Lila bantu untuk rencana ibadah suci Anda hari ini?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [audioSourceNode, setAudioSourceNode] = useState<AudioBufferSourceNode | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        setAvailableVoices(window.speechSynthesis.getVoices());
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const quickQuestions = [
    'Berapa biaya Paket Umroh 2026?',
    'Fasilitas hotel bintang 5 ring 1?',
    'Syarat pendaftaran haji furoda?',
    'Simulasi tabungan & DP ringan?',
    'Apa saja perlengkapan koper?',
  ];

  // Call duration counter
  useEffect(() => {
    let interval: any = null;
    if (isVoiceCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isVoiceCallActive]);

  // Format call timer
  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Stop any currently playing audio
  const stopAudioPlayback = () => {
    if (audioSourceNode) {
      try {
        audioSourceNode.stop();
      } catch (e) {
        // ignore already stopped
      }
      setAudioSourceNode(null);
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Browser SpeechSynthesis Fallback
  const speakWithBrowserSpeech = (text: string, onFinish?: () => void) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) {
      if (onFinish) onFinish();
      return;
    }
    window.speechSynthesis.cancel();

    const clean = text
      .replace(/[*#_`~-]/g, ' ')
      .replace(/Rp\s?(\d+)/g, '$1 Rupiah')
      .replace(/(\d+)\s?jt/gi, '$1 Juta')
      .replace(/bln/gi, 'bulan')
      .replace(/(\d+)\s?rb/gi, '$1 Ribu')
      .replace(/(\d+)\s?k/gi, '$1 Ribu')
      .replace(/(\d+)\/(\d+)/g, '$1 per $2')
      .replace(/\byg\b/gi, 'yang')
      .replace(/\bsdh\b/gi, 'sudah')
      .replace(/\butk\b/gi, 'untuk')
      .replace(/\bbgt\b/gi, 'banget')
      .replace(/\bsy\b/gi, 'saya')
      .replace(/\btdk\b/gi, 'tidak')
      .replace(/\bdr\b/gi, 'dari')
      .replace(/\.\.\./g, ', ') // Replace triple dots with comma for natural pause
      .replace(/\s+/g, ' ')
      .trim();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'id-ID';
    utterance.rate = 0.92; // Slightly slower for more human-like pacing
    utterance.pitch = 1.1; // Gentle, warmer and slightly more feminine tone

    let bestVoice = availableVoices.find(v => v.name === 'Google Bahasa Indonesia');
    if (!bestVoice) {
      bestVoice = availableVoices.find(v => v.lang.startsWith('id') && v.name.toLowerCase().includes('female'));
    }
    if (!bestVoice) {
      bestVoice = availableVoices.find(v => v.lang.startsWith('id') || v.name.toLowerCase().includes('indonesia'));
    }
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

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

  // Play text via Gemini Flash TTS (with instant fallback)
  const speakText = async (text: string, onFinish?: () => void) => {
    if (!voiceEnabled) {
      if (onFinish) onFinish();
      return;
    }
    stopAudioPlayback();

    try {
      // Call backend Gemini Flash TTS
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      if (data.audio && data.format === 'pcm') {
        // Decode 24kHz raw PCM little endian from Gemini Flash TTS
        const binaryString = atob(data.audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const int16Array = new Int16Array(bytes.buffer);
        const float32Array = new Float32Array(int16Array.length);
        for (let i = 0; i < int16Array.length; i++) {
          float32Array[i] = int16Array[i] / 32768.0;
        }

        if (!audioContextRef.current) {
          const AudioContextClass =
            window.AudioContext || (window as any).webkitAudioContext;
          audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
        }

        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }

        const buffer = ctx.createBuffer(1, float32Array.length, 24000);
        buffer.copyToChannel(float32Array, 0);

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);

        source.onended = () => {
          setIsSpeaking(false);
          setAudioSourceNode(null);
          if (onFinish) onFinish();
        };

        setIsSpeaking(true);
        setAudioSourceNode(source);
        source.start(0);
        return;
      }
    } catch (err: any) {
      console.log(`TTS API fetch fallback to browser SpeechSynthesis (Status: ${err?.message || 'Unknown'})`);
    }

    // Fallback to browser SpeechSynthesis
    speakWithBrowserSpeech(text, onFinish);
  };

  // Speech Recognition (Voice Input)
  const startListening = async (onResultCallback?: (transcript: string) => void) => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (permErr) {
      console.warn("Microphone permission denied:", permErr);
      alert(
        "Akses mikrofon diperlukan untuk berbicara dengan Ka Lila. Silakan klik izinkan (Allow) pada browser Anda."
      );
      setIsListening(false);
      return;
    }

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      alert("Browser Anda belum mendukung input suara. Gunakan Google Chrome untuk pengalaman terbaik.");
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
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

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setIsVoiceCallActive(false);
        } else if (isVoiceCallActive && !isSpeaking && !isLoading) {
          setTimeout(() => {
            if (isVoiceCallActive) startListening();
          }, 1500);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error("Recognition start error:", err);
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

  // Send message to backend
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
      const replyText =
        data.reply ||
        "Alhamdulillah, terima kasih atas pertanyaannya. Ka Lila siap membantu memberikan info terbaik seputar Umroh & Haji Khusus Arminareka.";

      setMessages((prev) => [...prev, { role: 'model', text: replyText }]);

      // Speak Ka Lila's response
      speakText(replyText, () => {
        // If Voice Call is currently active, seamlessly resume listening for next turn!
        if (isVoiceCallActive || activeTab === 'voice') {
          setTimeout(() => {
            if (isVoiceCallActive || activeTab === 'voice') {
              startListening();
            }
          }, 500);
        }
      });
    } catch (err: any) {
      console.log(`Chat error: ${err?.message || 'Unknown'}`);
      const fallbackReply =
        "Alhamdulillah, Arminareka menyediakan beragam paket Umroh & Haji Khusus terbaik dengan fasilitas hotel bintang 5. Hubungi Mba Indri di WhatsApp untuk informasi selengkapnya!";
      setMessages((prev) => [...prev, { role: 'model', text: fallbackReply }]);
      speakText(fallbackReply);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice Call Mode Toggle
  const startVoiceCall = () => {
    setActiveTab('voice');
    setIsVoiceCallActive(true);
    const greeting =
      "Assalamu'alaikum! Mode panggilan suara aktif bersama Ka Lila. Silakan bicara langsung, Ka Lila mendengarkan.";
    speakText(greeting, () => {
      startListening();
    });
  };

  const endVoiceCall = () => {
    setIsVoiceCallActive(false);
    stopAudioPlayback();
    setIsListening(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      scrollToBottom();
    }
    if (!isOpen) {
      endVoiceCall();
    }
  }, [isOpen, messages, activeTab]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
    const text = inputMessage.trim();
    setInputMessage('');
    await sendSpecificMessage(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute bottom-20 right-0 w-[94vw] sm:w-[420px] md:w-[450px] h-[600px] max-h-[85vh] liquid-glass bg-slate-950/95 border border-amber-400/40 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden text-white backdrop-blur-xl"
          >
            {/* Header with Mode Switcher Tabs */}
            <div className="px-4 py-3 bg-gradient-to-r from-amber-600/30 via-slate-900 to-slate-950 border-b border-white/10 shrink-0">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md">
                      <Bot size={20} />
                    </div>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-slate-950 rounded-full ${
                        isSpeaking
                          ? 'bg-amber-400 animate-ping'
                          : isListening
                          ? 'bg-rose-500 animate-pulse'
                          : 'bg-emerald-500'
                      }`}
                    ></span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                      Ka Lila AI Assistant
                    </h4>
                    <p className="text-[11px] text-amber-300/80">
                      Asisten Cerdas Arminareka (Mba Indri)
                    </p>
                  </div>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setVoiceEnabled(!voiceEnabled);
                      if (isSpeaking) stopAudioPlayback();
                    }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                      voiceEnabled
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                        : 'bg-white/10 text-white/40'
                    }`}
                    title={voiceEnabled ? 'Suara Aktif' : 'Suara Dimatikan'}
                  >
                    {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                  </button>
                  <button
                    onClick={() => {
                      stopAudioPlayback();
                      setIsOpen(false);
                    }}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                    aria-label="Tutup"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* 2 Main Mode Navigation Tabs: Voice Call & Chat Bot */}
              <div className="grid grid-cols-2 gap-1.5 bg-black/50 p-1 rounded-xl border border-white/10 text-xs font-medium">
                <button
                  onClick={() => {
                    setActiveTab('voice');
                    if (!isVoiceCallActive) startVoiceCall();
                  }}
                  className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'voice'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <PhoneCall size={14} className={isVoiceCallActive ? 'animate-pulse text-slate-950' : ''} />
                  <span>🎙️ Voice Call</span>
                </button>

                <button
                  onClick={() => setActiveTab('chat')}
                  className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'chat'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <MessageCircle size={14} />
                  <span>💬 Chat Bot</span>
                </button>
              </div>
            </div>

            {/* TAB 1: 🎙️ AI VOICE ASSISTANT (Live 2-Way Voice Call Interface) */}
            {activeTab === 'voice' && (
              <div className="flex-1 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-black text-center overflow-y-auto">
                <div className="w-full flex justify-between items-center text-xs text-amber-300/80 px-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    Gemini Flash TTS Active
                  </span>
                  <span className="font-mono bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
                    {formatTimer(callDuration)}
                  </span>
                </div>

                {/* Animated Calling Avatar */}
                <div className="my-auto flex flex-col items-center py-4">
                  <div className="relative mb-6">
                    {/* Pulsing rings */}
                    <div
                      className={`absolute -inset-4 rounded-full border border-amber-400/30 transition-transform duration-700 ${
                        isSpeaking
                          ? 'animate-ping opacity-60 scale-125'
                          : isListening
                          ? 'animate-pulse opacity-80 scale-110'
                          : 'opacity-20'
                      }`}
                    ></div>
                    <div
                      className={`absolute -inset-8 rounded-full border border-amber-500/20 ${
                        isSpeaking ? 'animate-pulse' : ''
                      }`}
                    ></div>

                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-1 shadow-[0_0_40px_rgba(245,158,11,0.4)] flex items-center justify-center">
                      <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center text-amber-300 overflow-hidden relative">
                        <Bot size={48} className={isSpeaking ? 'animate-bounce' : ''} />
                        {isSpeaking && (
                          <div className="absolute bottom-2 flex gap-1 items-end h-3">
                            <span className="w-1 bg-amber-400 animate-bounce h-full"></span>
                            <span className="w-1 bg-amber-400 animate-bounce [animation-delay:0.2s] h-2"></span>
                            <span className="w-1 bg-amber-400 animate-bounce [animation-delay:0.4s] h-3"></span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">
                    Ka Lila • AI Voice Call
                  </h3>
                  <p className="text-xs text-amber-300 font-medium mb-3">
                    {isSpeaking
                      ? '🔊 Ka Lila sedang berbicara...'
                      : isListening
                      ? '🎙️ Mendengarkan suara Anda...'
                      : isLoading
                      ? '⚡ Memproses jawaban...'
                      : isVoiceCallActive
                      ? 'Siap mendengarkan, silakan bicara...'
                      : 'Panggilan siap dimulai'}
                  </p>

                  {/* Last spoken transcript / response banner */}
                  <div className="w-full max-w-sm px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-200 leading-relaxed max-h-24 overflow-y-auto">
                    {messages.length > 1
                      ? `"${messages[messages.length - 1].text}"`
                      : '"Assalamu\'alaikum! Silakan tanyakan seputar Paket Umroh, Hotel Bintang 5, atau Haji Furoda."'}
                  </div>
                </div>

                {/* Call Control Action Bar */}
                <div className="w-full pt-4 border-t border-white/10 flex items-center justify-center gap-4">
                  <button
                    onClick={toggleListening}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/50'
                        : 'bg-white/10 hover:bg-white/20 text-amber-300 border border-white/20'
                    }`}
                    title={isListening ? 'Hentikan Mendengarkan' : 'Bicara Sekarang'}
                  >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>

                  <button
                    onClick={() => {
                      if (isVoiceCallActive) {
                        endVoiceCall();
                      } else {
                        startVoiceCall();
                      }
                    }}
                    className={`px-6 py-3 rounded-full flex items-center gap-2 font-bold text-xs transition-all cursor-pointer shadow-xl ${
                      isVoiceCallActive
                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/40'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/40'
                    }`}
                  >
                    {isVoiceCallActive ? (
                      <>
                        <PhoneOff size={16} />
                        <span>Akhiri Panggilan</span>
                      </>
                    ) : (
                      <>
                        <PhoneCall size={16} />
                        <span>Mulai Panggilan</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('chat')}
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-all cursor-pointer border border-white/10"
                    title="Beralih ke Chat Bot"
                  >
                    <MessageCircle size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: 💬 AI CHATBOT / AI ASSISTANT (24/7 Text Conversation) */}
            {activeTab === 'chat' && (
              <>
                {/* Messages Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-black/40">
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
                        {msg.role === 'user' ? <User size={13} /> : <Bot size={13} />}
                      </div>
                      <div className="relative group max-w-[80%]">
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none shadow-md'
                              : 'bg-slate-900/90 text-slate-100 border border-white/10 rounded-tl-none shadow-sm'
                          }`}
                        >
                          {msg.text}
                        </div>
                        {msg.role === 'model' && (
                          <button
                            onClick={() => speakText(msg.text)}
                            className="absolute -right-8 bottom-1 p-1.5 rounded-full bg-slate-800/80 text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-amber-500 hover:text-slate-950"
                            title="Dengarkan Suara Ka Lila"
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
                        <Bot size={13} />
                      </div>
                      <div className="bg-slate-900/90 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Suggestion Pills */}
                <div className="px-3 py-2 bg-slate-950/80 border-t border-white/10 flex gap-1.5 overflow-x-auto no-scrollbar text-[11px] shrink-0">
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

                {/* Text & Mic Input Form */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 bg-slate-950 border-t border-white/10 flex items-center gap-2 shrink-0"
                >
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/40'
                        : 'bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/30'
                    }`}
                    title={isListening ? 'Hentikan mic' : 'Ketik dengan suara (Voice Input)'}
                  >
                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>

                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={
                      isListening
                        ? 'Mendengarkan ucapan Anda...'
                        : 'Ketik pertanyaan seputar Umroh & Haji...'
                    }
                    className="flex-1 bg-black/50 border border-white/15 rounded-full px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
                  />

                  <button
                    type="submit"
                    disabled={isLoading || !inputMessage.trim()}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-40 text-slate-950 flex items-center justify-center transition-colors shadow-md cursor-pointer shrink-0"
                    aria-label="Kirim"
                  >
                    <Send size={15} />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Launcher Button */}
      <div className="relative flex items-center gap-2 group">
        <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-slate-950 text-amber-300 border border-amber-400/40 text-[11px] font-semibold px-3 py-1.5 rounded-2xl shadow-2xl backdrop-blur-md whitespace-nowrap flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            🎙️ Voice Call • 💬 Chatbot
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold rounded-full shadow-[0_8px_30px_rgba(245,158,11,0.5)] border border-amber-300/60 cursor-pointer shrink-0"
          aria-label="Buka Ka Lila AI Assistant"
        >
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950"></span>
          </span>
          <Bot size={28} className="text-slate-950" />
        </motion.button>
      </div>
    </div>
  );
}
