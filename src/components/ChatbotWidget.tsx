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
  PhoneCall,
  PhoneOff,
} from 'lucide-react';
import { SupportedLanguageCode, NAV_LANGUAGES, TRANSLATIONS } from '../data/translations';

interface Message {
  role: 'user' | 'model';
  text: string;
}

type WidgetTab = 'voice' | 'chat';

interface ChatbotWidgetProps {
  currentLanguage?: SupportedLanguageCode;
}

export default function ChatbotWidget({ currentLanguage = 'id' }: ChatbotWidgetProps) {
  const activeLangOption =
    NAV_LANGUAGES.find((lang) => lang.code === currentLanguage) || NAV_LANGUAGES[0];
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.id;

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<WidgetTab>('voice');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: t.chatbot.greeting,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const liveWsRef = useRef<WebSocket | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeBufferSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const speechSessionIdRef = useRef<number>(0);
  const isVoiceConnectingRef = useRef<boolean>(false);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        setAvailableVoices(window.speechSynthesis.getVoices());
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Global listener for the Hero "Bicara dengan Ka Lila" CTA button
    const handleOpenVoice = () => {
      setIsOpen(true);
      setActiveTab('voice');
      setTimeout(() => {
        startVoiceCall();
      }, 100);
    };

    window.addEventListener('open-ka-lila-voice', handleOpenVoice);
    return () => {
      window.removeEventListener('open-ka-lila-voice', handleOpenVoice);
    };
  }, []);

  // Update initial greeting when language changes if no conversation has started yet
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length <= 1) {
        return [{ role: 'model', text: t.chatbot.greeting }];
      }
      return prev;
    });
  }, [currentLanguage]);

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

  // Stop any currently playing audio instantly with full guarantee of no overlap
  const stopAudioPlayback = () => {
    // Invalidate any ongoing speech sessions
    speechSessionIdRef.current++;

    // Stop all Web Audio buffer sources
    if (activeBufferSourcesRef.current.length > 0) {
      activeBufferSourcesRef.current.forEach((source) => {
        try {
          source.stop();
          source.disconnect();
        } catch {
          // ignore
        }
      });
      activeBufferSourcesRef.current = [];
    }

    // Cancel browser speech synthesis
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }

    nextStartTimeRef.current = 0;
    setIsSpeaking(false);
  };

  // Browser SpeechSynthesis with Humanized Multi-Sentence Prosody (25yo Female)
  const speakWithBrowserSpeech = (text: string, onFinish?: () => void) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) {
      if (onFinish) onFinish();
      return;
    }

    // Stop previous audio and register new unique session ID
    stopAudioPlayback();
    const currentSessionId = speechSessionIdRef.current;

    try {
      window.speechSynthesis.resume();
    } catch {
      // ignore
    }

    // Comprehensive phonetic Indonesian normalization
    const humanizeIndonesianText = (raw: string) => {
      let t = raw
        .replace(/[*#_`~-]/g, ' ')
        // Convert prices & numbers
        .replace(/Rp\.?\s?(\d+)\.?(\d+)?\.?(\d+)?/gi, (_, g1, g2, g3) => {
          if (g3) return `${g1} juta rupiah`;
          if (g2) return `${g1} ribu rupiah`;
          return `${g1} rupiah`;
        })
        .replace(/(\d+)\s?jt/gi, '$1 juta rupiah')
        .replace(/(\d+)\s?rb/gi, '$1 ribu rupiah')
        .replace(/(\d+)\s?k\b/gi, '$1 ribu')
        .replace(/\bbln\b/gi, 'bulan')
        .replace(/\bthn\b/gi, 'tahun')
        .replace(/(\d+)\/(\d+)/g, '$1 per $2')
        .replace(/\b1\b/g, 'satu')
        .replace(/\b2\b/g, 'dua')
        .replace(/\b3\b/g, 'tiga')
        .replace(/\b4\b/g, 'empat')
        .replace(/\b5\b/g, 'lima')
        .replace(/\b6\b/g, 'enam')
        .replace(/\b7\b/g, 'tujuh')
        .replace(/\b8\b/g, 'delapan')
        .replace(/\b9\b/g, 'sembilan')
        .replace(/\b10\b/g, 'sepuluh')
        .replace(/\b12\b/g, 'dua belas')
        .replace(/\b16\b/g, 'enam belas')
        // Common abbreviations & terms
        .replace(/\byg\b/gi, 'yang')
        .replace(/\bsdh\b/gi, 'sudah')
        .replace(/\butk\b/gi, 'untuk')
        .replace(/\bbgt\b/gi, 'banget')
        .replace(/\bsy\b/gi, 'Lila')
        .replace(/\btdk\b/gi, 'nggak')
        .replace(/\bgak\b/gi, 'nggak')
        .replace(/\bgk\b/gi, 'nggak')
        .replace(/\bdr\b/gi, 'dari')
        .replace(/\bgmn\b/gi, 'gimana')
        .replace(/\bjkt\b/gi, 'Jakarta')
        .replace(/\bCS\b/gi, 'Kastemer Servis')
        .replace(/\bAI\b/gi, 'Ei-Ai')
        .replace(/\bDP\b/gi, 'De-Pe')
        .replace(/\bVIP\b/gi, 'Vi-Ai-Pi')
        .replace(/\bseat\b/gi, 'sit')
        .replace(/\bbooking\b/gi, 'buking')
        .replace(/\bhotel\b/gi, 'hotel')
        .replace(/\bwebsite\b/gi, 'websait')
        .replace(/\bfeature\b/gi, 'fitur')
        .replace(/\bKancab\b/gi, 'Kantor Cabang')
        .replace(/\bKa\b/gi, 'Kak')
        .replace(/\bMba\b/gi, 'Mbak')
        .replace(/MasyaAllah/gi, 'Masya Allah')
        .replace(/InsyaAllah/gi, 'Insya Allah')
        .replace(/Alhamdulillah/gi, 'Alhamdulillah')
        .replace(/Assalamualaikum/gi, "Assalamu'alaikum")
        .replace(/\.{3,}/g, ', ')
        .replace(/\s+/g, ' ')
        .trim();
      return t;
    };

    const cleanText = humanizeIndonesianText(text);

    // Split text into natural conversational sentence chunks for dynamic human prosody
    const rawChunks = cleanText.split(/([.!?]+|\n+)/g).filter(Boolean);
    const sentenceChunks: { text: string; type: 'question' | 'exclamation' | 'statement' }[] = [];

    for (let i = 0; i < rawChunks.length; i += 2) {
      const sentenceText = rawChunks[i]?.trim();
      const punct = rawChunks[i + 1]?.trim() || '.';
      if (!sentenceText) continue;

      let type: 'question' | 'exclamation' | 'statement' = 'statement';
      if (punct.includes('?')) type = 'question';
      else if (punct.includes('!')) type = 'exclamation';

      sentenceChunks.push({
        text: `${sentenceText}${punct.includes('?') ? '?' : punct.includes('!') ? '!' : '.'}`,
        type,
      });
    }

    if (sentenceChunks.length === 0) {
      sentenceChunks.push({ text: cleanText, type: 'statement' });
    }

    const currentVoices =
      availableVoices.length > 0
        ? availableVoices
        : window.speechSynthesis.getVoices() || [];

    // Prioritized search for natural, neural female voices matching current language
    const langPrefix = (activeLangOption.speechCode || 'id').split('-')[0].toLowerCase();
    let bestVoice = currentVoices.find(
      (v) =>
        v.lang.toLowerCase().startsWith(langPrefix) &&
        (v.name.toLowerCase().includes('gadis') ||
          v.name.toLowerCase().includes('natural') ||
          v.name.toLowerCase().includes('online') ||
          v.name.toLowerCase().includes('female'))
    );

    if (!bestVoice) {
      bestVoice = currentVoices.find((v) =>
        v.lang.toLowerCase().startsWith(langPrefix)
      );
    }

    if (!bestVoice) {
      bestVoice = currentVoices.find(
        (v) =>
          v.lang.startsWith('id') &&
          (v.name.toLowerCase().includes('damayanti') ||
            v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('siti') ||
            v.name.toLowerCase().includes('wanita') ||
            v.name.toLowerCase().includes('wavenet'))
      );
    }

    if (!bestVoice) {
      bestVoice = currentVoices.find((v) => v.lang.startsWith('id')) || currentVoices[0];
    }

    let currentIndex = 0;
    setIsSpeaking(true);

    const speakNextChunk = () => {
      // Bail out if another speech session has taken over
      if (speechSessionIdRef.current !== currentSessionId) return;

      if (currentIndex >= sentenceChunks.length) {
        setIsSpeaking(false);
        if (onFinish) onFinish();
        return;
      }

      const chunk = sentenceChunks[currentIndex];
      const utterance = new SpeechSynthesisUtterance(chunk.text);
      utterance.lang = activeLangOption.speechCode || 'id-ID';

      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      // Dynamic prosody according to 25yo cheerful female tone
      if (chunk.type === 'question') {
        utterance.pitch = 1.16; // Cheerful upward inflection
        utterance.rate = 1.0;
      } else if (chunk.type === 'exclamation') {
        utterance.pitch = 1.14; // Enthusiastic and smiling
        utterance.rate = 1.02;
      } else {
        utterance.pitch = 1.11; // Warm, friendly, soothing
        utterance.rate = 0.98; // Relaxed human cadence
      }

      utterance.onend = () => {
        if (speechSessionIdRef.current !== currentSessionId) return;
        currentIndex++;
        // Natural micro-breath pause (70ms) between sentences
        setTimeout(() => {
          if (speechSessionIdRef.current === currentSessionId) {
            speakNextChunk();
          }
        }, 70);
      };

      utterance.onerror = () => {
        if (speechSessionIdRef.current !== currentSessionId) return;
        currentIndex++;
        speakNextChunk();
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNextChunk();
  };

  // Helper: PCM Float32 to Base64 PCM Int16
  const pcmToBase64 = (float32Array: Float32Array) => {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      int16Array[i] = Math.max(-1, Math.min(1, float32Array[i])) * 0x7fff;
    }
    const buffer = int16Array.buffer;
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Helper: Play Base64 PCM Int16 at 24kHz with gapless single-stream tracking
  const playAudioChunk = async (base64Data: string) => {
    // Silence any browser speech synthesis to ensure 100% pure single neural voice
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        // ignore
      }
    }
    
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const int16Array = new Int16Array(bytes.buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768.0;
    }

    const buffer = ctx.createBuffer(1, float32Array.length, 24000);
    buffer.copyToChannel(float32Array, 0);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    activeBufferSourcesRef.current.push(source);

    const now = ctx.currentTime;
    if (nextStartTimeRef.current < now) {
      nextStartTimeRef.current = now + 0.04;
    }
    
    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += buffer.duration;
    
    setIsSpeaking(true);
    source.onended = () => {
      activeBufferSourcesRef.current = activeBufferSourcesRef.current.filter((s) => s !== source);
      if (activeBufferSourcesRef.current.length === 0 && ctx.currentTime >= nextStartTimeRef.current - 0.05) {
        setIsSpeaking(false);
      }
    };
  };

  // Start Gemini Live Voice Call (Ursa Voice Profile - 25yo mature female)
  const startLiveVoiceCall = async () => {
    if (isVoiceConnectingRef.current) return;
    isVoiceConnectingRef.current = true;

    try {
      // Clear any running audio first to ensure single pure sound stream
      stopAudioPlayback();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
        },
      });
      setMicPermissionDenied(false);
      micStreamRef.current = stream;

      // Initialize Audio Context for both Mic (16k) and Output (24k)
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioContextClass({ sampleRate: 16000 });
      audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${protocol}//${window.location.host}/api/live`);
      liveWsRef.current = ws;

      ws.onopen = () => {
        isVoiceConnectingRef.current = false;
        setIsVoiceCallActive(true);
        setActiveTab('voice');
        
        // Setup Mic Processor with echo suppression
        const source = inputCtx.createMediaStreamSource(stream);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        micProcessorRef.current = processor;
        
        source.connect(processor);
        processor.connect(inputCtx.destination);

        processor.onaudioprocess = (e) => {
          // Do not send mic audio while Ka Lila is speaking to eliminate speaker loopback
          if (ws.readyState === WebSocket.OPEN && !isSpeaking && activeBufferSourcesRef.current.length === 0) {
            const inputData = e.inputBuffer.getChannelData(0);
            const base64 = pcmToBase64(inputData);
            ws.send(JSON.stringify({ type: 'audio', data: base64 }));
            setIsListening(true);
          } else {
            setIsListening(false);
          }
        };
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'audio') {
            playAudioChunk(msg.data);
          } else if (msg.type === 'interrupted') {
            // Handle interruption: clear playback queue immediately
            stopAudioPlayback();
          }
        } catch (err) {
          console.error("WS parse error:", err);
        }
      };

      ws.onerror = (err) => {
        console.warn("Live Voice WebSocket Notice:", err);
        isVoiceConnectingRef.current = false;
      };

      ws.onclose = () => {
        isVoiceConnectingRef.current = false;
        endVoiceCall();
      };

    } catch (err: any) {
      isVoiceConnectingRef.current = false;
      console.warn("Microphone access notice (fallback to Voice Narration Mode):", err?.message || err);
      setMicPermissionDenied(true);
      setIsVoiceCallActive(true);
      setActiveTab('voice');

      // Greet user with Ka Lila's voice so they still get the natural voice experience immediately!
      const greeting =
        "Assalamualaikum Ka.. Aku Ka Lila! Senang sekali bisa menyapa Kakak. Silakan pilih atau ketik pertanyaan di bawah, Ka Lila siap bantu jelaskan paket Umroh dan Haji Arminareka.";
      speakText(greeting);
    }
  };

  // Play text via Gemini Neural TTS with Ursa Voice (with single-channel guarantee)
  const speakText = async (text: string, onFinish?: () => void) => {
    if (!voiceEnabled) {
      if (onFinish) onFinish();
      return;
    }
    stopAudioPlayback();
    const currentSessionId = speechSessionIdRef.current;

    try {
      // Ensure AudioContext exists and is running
      if (!audioContextRef.current) {
        const AudioContextClass =
          window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
        }
      }
      const ctx = audioContextRef.current;
      if (ctx && ctx.state === 'suspended') {
        await ctx.resume();
      }

      // Call backend Gemini TTS endpoint
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      if (speechSessionIdRef.current !== currentSessionId) return;

      if (data.audio && ctx) {
        const binaryString = atob(data.audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        let audioBuffer: AudioBuffer | null = null;

        // Try standard decodeAudioData first
        try {
          audioBuffer = await ctx.decodeAudioData(bytes.buffer.slice(0));
        } catch {
          // If headerless raw PCM 24kHz Int16:
          try {
            const int16Array = new Int16Array(bytes.buffer);
            const float32Array = new Float32Array(int16Array.length);
            for (let i = 0; i < int16Array.length; i++) {
              float32Array[i] = int16Array[i] / 32768.0;
            }
            const buf = ctx.createBuffer(1, float32Array.length, 24000);
            buf.copyToChannel(float32Array, 0);
            audioBuffer = buf;
          } catch (pcmErr) {
            console.warn("PCM decode error:", pcmErr);
          }
        }

        if (audioBuffer && speechSessionIdRef.current === currentSessionId) {
          const source = ctx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(ctx.destination);
          activeBufferSourcesRef.current.push(source);

          source.onended = () => {
            activeBufferSourcesRef.current = activeBufferSourcesRef.current.filter((s) => s !== source);
            if (activeBufferSourcesRef.current.length === 0) {
              setIsSpeaking(false);
            }
            if (speechSessionIdRef.current === currentSessionId && onFinish) {
              onFinish();
            }
          };

          setIsSpeaking(true);
          source.start(0);
          return;
        }
      }
    } catch (err: any) {
      console.log(`TTS API fetch fallback to browser SpeechSynthesis (${err?.message || 'Unknown'})`);
    }

    if (speechSessionIdRef.current === currentSessionId) {
      speakWithBrowserSpeech(text, onFinish);
    }
  };

  // Speech Recognition (Voice Input)
  const startListening = async (onResultCallback?: (transcript: string) => void) => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermissionDenied(false);
    } catch (permErr: any) {
      console.warn("Microphone access notice:", permErr?.message || permErr);
      setMicPermissionDenied(true);
      setIsListening(false);
      return;
    }

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      console.warn("SpeechRecognition not supported on current browser engine");
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.lang = activeLangOption.speechCode || 'id-ID';
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
          setMicPermissionDenied(true);
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
      console.warn("Recognition start notice:", err);
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
          languagePreference: activeLangOption.label,
        }),
      });

      const data = await response.json();
      const replyText =
        data.reply ||
        "MasyaAllah, Iya baik ini jadi catatan Buat Ka Lila biar di konfirmasi ke Mba Indri agar Ka Lila bisa memberikan info terbaik seputar Umroh & Haji Khusus Arminareka.";

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

  // Voice Call Mode Toggle & Start (Direct Gemini Live Ursa Voice Stream - 25yo mature female)
  const startVoiceCall = async () => {
    setIsVoiceCallActive(true);
    setActiveTab('voice');

    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      }
    }
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      try {
        await audioContextRef.current.resume();
      } catch (e) {
        console.warn("AudioContext resume error:", e);
      }
    }

    startLiveVoiceCall();
  };

  const endVoiceCall = () => {
    setIsVoiceCallActive(false);
    setIsListening(false);
    setIsSpeaking(false);
    stopAudioPlayback();

    if (liveWsRef.current) {
      try {
        liveWsRef.current.close();
      } catch (e) {
        // ignore
      }
      liveWsRef.current = null;
    }

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }

    if (micProcessorRef.current) {
      micProcessorRef.current.disconnect();
      micProcessorRef.current = null;
    }

    nextStartTimeRef.current = 0;
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
            className="absolute bottom-20 right-0 w-[94vw] sm:w-[420px] md:w-[450px] h-[600px] max-h-[85vh] liquid-glass bg-slate-950/40 border border-amber-400/20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden text-white backdrop-blur-2xl"
          >
            {/* Header with Mode Switcher Tabs */}
            <div className="px-4 py-3 bg-white/5 border-b border-white/10 shrink-0 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
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
                      Ka Lila • CS Arminareka
                    </h4>
                    <p className="text-[11px] text-amber-300/80">
                      Customer Service Konsultan Umroh &amp; Haji
                    </p>
                  </div>
                </div>

                {/* Right Controls: Close Button */}
                <button
                  onClick={() => {
                    stopAudioPlayback();
                    setIsOpen(false);
                  }}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                  aria-label="Tutup"
                >
                  <X size={16} />
                </button>
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
                  <Mic size={14} className={isVoiceCallActive ? 'animate-pulse' : ''} />
                  <span>AI Talk</span>
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
                  <span>Chat Bot</span>
                </button>
              </div>
            </div>

            {/* TAB 1: 🎙️ AI VOICE ASSISTANT (Live 2-Way Voice Call Interface) */}
            {activeTab === 'voice' && (
              <div className="flex-1 flex flex-col items-center justify-between p-6 bg-black/20 text-center overflow-y-auto">
                <div className="w-full flex justify-end items-center text-xs text-amber-300/80 px-2">
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
                    Konsultasi Suara • Ka Lila CS
                  </h3>
                  <p className="text-xs text-amber-300 font-medium mb-3">
                    {isSpeaking
                      ? '🔊 Ka Lila sedang menjelaskan solusi...'
                      : isListening
                      ? '🎙️ Mendengarkan pertanyaan Kakak...'
                      : isLoading
                      ? '⚡ Menyiapkan rekomendasi paket...'
                      : isVoiceCallActive
                      ? micPermissionDenied
                        ? 'Ka Lila siap menjawab pertanyaan Kakak!'
                        : 'Ka Lila siap melayani, silakan bicara...'
                      : 'Tekan tombol untuk mulai konsultasi'}
                  </p>

                  {micPermissionDenied && (
                    <div className="w-full max-w-sm my-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-left">
                      <div className="flex items-start gap-2 text-xs text-amber-200 mb-2">
                        <MicOff size={15} className="text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-amber-300">Suara Ka Lila Aktif (Mode Panduan Suara)</p>
                          <p className="text-[11px] text-amber-200/80 leading-relaxed mt-0.5">
                            Izin mikrofon browser belum aktif. Kakak tetap bisa mendengar suara Ka Lila dengan memilih topik di bawah:
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {quickQuestions.slice(0, 3).map((q, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => sendSpecificMessage(q)}
                            className="text-[11px] bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-amber-200 border border-amber-400/30 px-2.5 py-1 rounded-full transition-all cursor-pointer text-left"
                          >
                            💬 {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Call Control Action Bar */}
                <div className="w-full pt-4 border-t border-white/10 flex items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      if (isVoiceCallActive) {
                        endVoiceCall();
                      } else {
                        startVoiceCall();
                      }
                    }}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl ${
                      isVoiceCallActive
                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/40'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/40'
                    }`}
                    title={isVoiceCallActive ? 'Akhiri Panggilan' : 'Mulai Panggilan'}
                  >
                    {isVoiceCallActive ? <PhoneOff size={24} /> : <PhoneCall size={24} />}
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
                          {msg.role === 'model' && (
                            <div className="mt-1.5 pt-1 border-t border-white/5 flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => speakText(msg.text)}
                                className="inline-flex items-center gap-1 text-[10px] text-amber-300/80 hover:text-amber-300 font-medium transition-colors cursor-pointer"
                                title="Dengarkan Suara Ka Lila"
                              >
                                <Volume2 size={12} />
                                <span>Dengarkan Suara</span>
                              </button>
                            </div>
                          )}
                        </div>
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

      {/* Floating WhatsApp Launcher Button (Draggable) */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.05}
        className="relative flex items-center gap-2 group cursor-grab active:cursor-grabbing inline-block"
      >
        <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-slate-950 text-amber-300 border border-amber-400/40 text-[11px] font-semibold px-3 py-1.5 rounded-2xl shadow-2xl backdrop-blur-md whitespace-nowrap flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            💬 Chat WA
          </div>
        </div>

        <motion.a
          href="https://wa.me/6281310508974"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={(e) => {
            // Prevent navigation if user was dragging
          }}
          className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-slate-950/30 backdrop-blur-2xl text-emerald-400 font-bold rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.4)] border border-emerald-400/30 cursor-pointer shrink-0 overflow-hidden pointer-events-auto"
          aria-label="WhatsApp CS Arminareka"
        >
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/10 to-transparent opacity-50"></div>
          
          <span className="absolute -top-1 -right-1 flex h-4 w-4 z-10">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/30 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500/40 backdrop-blur-sm border-2 border-slate-950/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]"></span>
          </span>
          <MessageCircle size={28} className="text-emerald-400" />
        </motion.a>
      </motion.div>
    </div>
  );
}
