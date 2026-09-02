import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Wrench, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export function HuddyChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hey! I'm Huddy, your Plumbing AI assistant. How can I help you today?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'How do I fix a leaky faucet?',
    'What causes clogged drains?',
    'Water heater troubleshooting',
    'How to prevent frozen pipes?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

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
        throw new Error(data.error || 'Failed to get response');
      }

      setMessages((prev) => [...prev, { role: 'model', text: data.reply }]);
    } catch (err: any) {
      console.error(err);
      // Fallback plumbing response
      let fallbackReply = "As your plumbing assistant, I recommend turning off the main water valve if you have a major leak. For specific repairs like clogged drains or fixture installations, feel free to ask for step-by-step guidance!";
      if (userText.toLowerCase().includes('faucet') || userText.toLowerCase().includes('leaky')) {
        fallbackReply = "To fix a leaky faucet: 1. Turn off the water supply valve under the sink. 2. Plug the drain so parts don't fall in. 3. Remove the handle and inspect the O-ring, washer, or cartridge for wear and replace if necessary.";
      } else if (userText.toLowerCase().includes('drain') || userText.toLowerCase().includes('clog')) {
        fallbackReply = "For clogged drains, try using a plunger or a mixture of baking soda and vinegar followed by hot water. Avoid harsh chemical drain cleaners as they can damage older pipes.";
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
            className="absolute bottom-20 right-0 w-[90vw] sm:w-[380px] h-[520px] bg-slate-900/95 border border-cyan-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white backdrop-blur-md cursor-auto"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-cyan-600/30 via-slate-900/80 to-slate-900 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                  <Wrench size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide text-white flex items-center gap-1.5">
                    Huddy <Sparkles size={14} className="text-cyan-400" />
                  </h3>
                  <p className="text-[11px] text-cyan-300/80">Plumbing AI Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-colors cursor-pointer"
                aria-label="Close Chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-sm">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-cyan-600 text-white rounded-br-none shadow-md'
                        : 'bg-slate-800/90 text-cyan-100 border border-cyan-500/20 rounded-bl-none shadow'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-xs sm:text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800/90 text-cyan-300 border border-cyan-500/20 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-cyan-400" />
                    <span className="text-xs">Huddy is thinking...</span>
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
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 whitespace-nowrap transition-colors border border-white/10 cursor-pointer shrink-0 disabled:opacity-50"
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
                placeholder="Ask Huddy about plumbing..."
                disabled={isLoading}
                className="flex-1 bg-slate-900 border border-white/10 focus:border-cyan-400 rounded-full px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer shrink-0 shadow-lg"
                aria-label="Send message"
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
          <div className="bg-slate-900/95 text-cyan-300 border border-cyan-400/40 text-[11px] font-semibold px-3 py-1.5 rounded-2xl shadow-xl backdrop-blur-sm whitespace-nowrap">
            Ask Huddy 🚰
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
          className="relative group flex items-center justify-center w-14 h-14 bg-gradient-to-br from-cyan-400 via-cyan-500 to-cyan-600 text-slate-950 font-bold rounded-full shadow-2xl border border-cyan-300/40 cursor-pointer shrink-0"
          aria-label="Chat with Huddy"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </span>
          <Wrench size={26} className="text-slate-950" />
        </motion.button>
      </div>
    </motion.div>
  );
}
