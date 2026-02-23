
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, MessageCircle, Mic, PhoneOff, User, Phone, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../context/LanguageContext';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AIChatAssistantProps {
  products: Product[];
}

const LIVE_MODEL = 'gemini-2.5-flash-native-audio-preview-12-2025';
const LIVE_WS_BASE = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent';

const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ products }) => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [formLoading, setFormLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: t('chat.welcome') }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Live audio refs
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourceNodesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isLive, isRegistered]);

  useEffect(() => {
    const savedUser = localStorage.getItem('luxecore_chat_user');
    if (savedUser) {
      setIsRegistered(true);
      const user = JSON.parse(savedUser);
      setFormData(user);
    }
    return () => {
      disconnectLive();
    };
  }, []);

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    localStorage.setItem('luxecore_chat_user', JSON.stringify(formData));

    const env = import.meta.env || {};
    if (env.VITE_SUPABASE_URL) {
      try {
        await supabase.from('leads').insert({
          id: `lead_${Date.now()}`,
          name: formData.name,
          phone: formData.phone,
          created_at: new Date().toISOString()
        });
        console.log('Lead saved successfully');
      } catch (error) {
        console.error("Error saving lead:", error);
      }
    }

    setFormLoading(false);
    setIsRegistered(true);
  };

  const getSystemInstruction = () => {
    const productContext = products.map(p =>
      `- ${p.name} (${p.category}): ${p.formattedPrice}. ${p.shortDescription}`
    ).join('\n');

    return `
      ${t('chat.ai_role')}
      Mijozingizning ismi: ${formData.name}. Unga ismi bilan murojaat qiling.
      Siz xushmuomala, "siz"lab va ${language === 'uz' ? 'o\'zbek' : 'rus'} tilida gaplashing.
      
      Bizdagi mavjud mahsulotlar ro'yxatdagidek:
      ${productContext}

      Qoidalaringiz:
      1. Faqat yuqoridagi ro'yxatdagi mahsulotlarni tavsiya qiling.
      2. Agar mijoz umumiy savol bersa (masalan, "soat kerak"), ro'yxatdagi mos mahsulotni narxi va afzalligi bilan taklif qiling.
      3. Javoblaringiz qisqa (maksimum 3 gap), lo'nda va sotuvga yo'naltirilgan bo'lsin.
      4. Narxlarni so'rashsa, ro'yxatdagidek aniq ayting.
    `;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    const updatedMessages: Message[] = [...messages, { role: 'user' as const, text: userMessage }];
    setMessages(updatedMessages);
    setIsLoading(true);

    const history = updatedMessages.slice(0, -1);
    const systemInstruction = getSystemInstruction();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history,
          systemInstruction,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || t('chat.error_server'));
      }

      const data = await response.json();
      const text = data.text || t('chat.error_understanding');

      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      console.error("AI Error:", error);

      const fallbackKey = getLocalGeminiKey();
      if (fallbackKey) {
        try {
          const text = await sendDirectTextChat({
            apiKey: fallbackKey,
            message: userMessage,
            history,
            systemInstruction
          });
          setMessages(prev => [...prev, { role: 'model', text }]);
          return;
        } catch (fallbackError) {
          console.error('Direct Gemini fallback failed:', fallbackError);
        }
      }

      setMessages(prev => [...prev, { role: 'model', text: t('chat.error_generic') }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  const pushLiveMessage = (uzText: string, ruText: string) => {
    setMessages(prev => [...prev, {
      role: 'model',
      text: language === 'uz' ? uzText : ruText
    }]);
  };

  const getLocalGeminiKey = () => {
    const env = import.meta.env || {};
    return (env.VITE_GEMINI_API_KEY || '').trim();
  };

  const sendDirectTextChat = async ({
    apiKey,
    message,
    history,
    systemInstruction
  }: {
    apiKey: string;
    message: string;
    history: Message[];
    systemInstruction: string;
  }): Promise<string> => {
    const models = ['gemini-2.5-flash', 'gemini-2.0-flash'];
    const contents = [
      ...history.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    let lastError = 'Unknown error';

    for (const modelName of models) {
      try {
        const directRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              systemInstruction: { parts: [{ text: systemInstruction }] }
            })
          }
        );

        if (!directRes.ok) {
          const errPayload = await directRes.json().catch(() => ({}));
          const errMsg = errPayload?.error?.message || `HTTP ${directRes.status}`;
          lastError = `${modelName}: ${errMsg}`;
          continue;
        }

        const payload = await directRes.json();
        const text = (payload?.candidates?.[0]?.content?.parts || [])
          .map((part: any) => part?.text || '')
          .join('\n')
          .trim();

        if (text) {
          return text;
        }
      } catch (err: any) {
        lastError = `${modelName}: ${err?.message || String(err)}`;
      }
    }

    throw new Error(lastError);
  };

  const resolveLiveSession = async (): Promise<{ wsUrl: string; model: string }> => {
    try {
      const sessionRes = await fetch('/api/chat');
      if (sessionRes.ok) {
        const sessionData = await sessionRes.json().catch(() => ({}));
        if (sessionData?.wsUrl) {
          return {
            wsUrl: sessionData.wsUrl,
            model: sessionData.model || LIVE_MODEL
          };
        }
      } else {
        console.warn('[Live] /api/chat returned', sessionRes.status);
      }
    } catch (err) {
      console.warn('[Live] /api/chat fetch failed, trying VITE key fallback:', err);
    }

    const fallbackKey = getLocalGeminiKey();
    if (fallbackKey) {
      return {
        wsUrl: `${LIVE_WS_BASE}?key=${fallbackKey}`,
        model: LIVE_MODEL
      };
    }

    throw new Error('Live session endpoint not available');
  };

  // ========== GEMINI LIVE AUDIO ==========
  const connectLive = async () => {
    try {
      const { wsUrl, model } = await resolveLiveSession();

      if (!wsUrl) {
        pushLiveMessage(
          "Live chat sozlanmagan. Iltimos, matnli chatdan foydalaning.",
          "Golosovoy chat ne nastroen. Pozhaluysta, ispol'zuyte tekstovyy chat."
        );
        return;
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });
      streamRef.current = stream;

      // Create audio context for playback
      const playbackCtx = new AudioContext({ sampleRate: 24000 });
      audioContextRef.current = playbackCtx;
      await playbackCtx.resume();
      nextStartTimeRef.current = 0;

      // Connect WebSocket to Gemini Live API
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[Live] WebSocket connected');

        // Send setup message
        const setupMsg = {
          setup: {
            model: `models/${model}`,
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: 'Kore'
                  }
                }
              }
            },
            systemInstruction: {
              parts: [{ text: getSystemInstruction() }]
            }
          }
        };
        ws.send(JSON.stringify(setupMsg));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.error) {
            const errorText = data.error?.message || 'Unknown Live API error';
            console.error('[Live] Server error:', data.error);
            pushLiveMessage(
              `Live chat xatosi: ${errorText}`,
              `Oshibka golosovogo chata: ${errorText}`
            );
            disconnectLive();
            return;
          }

          if (data.setupComplete) {
            console.log('[Live] Setup complete, starting audio capture');
            setIsLive(true);
            pushLiveMessage(
              'Ovozli chat ulandi. Gaplashing.',
              'Golosovoy chat podklyuchen. Govorite.'
            );
            startAudioCapture(ws, stream);
            return;
          }

          // Handle audio response
          if (data.serverContent?.modelTurn?.parts) {
            for (const part of data.serverContent.modelTurn.parts) {
              if (part.inlineData?.mimeType?.startsWith('audio/')) {
                playAudioChunk(part.inlineData.data);
              }
              if (part.text) {
                setMessages(prev => [...prev, { role: 'model', text: part.text }]);
              }
            }
          }

          // Handle turn complete
          if (data.serverContent?.turnComplete) {
            console.log('[Live] Turn complete');
          }

        } catch (err) {
          console.error('[Live] Parse error:', err);
        }
      };

      ws.onerror = (err) => {
        console.error('[Live] WebSocket error:', err);
        disconnectLive();
      };

      ws.onclose = (event) => {
        console.log('[Live] WebSocket closed', event.code, event.reason);
        setIsLive(false);
      };

    } catch (error: any) {
      console.error('[Live] Connection error:', error);
      pushLiveMessage(
        `Mikrofonga ulanib bo'lmadi: ${error.message}`,
        `Ne udalos' podklyuchit' mikrofon: ${error.message}`
      );
    }
  };

  const startAudioCapture = (ws: WebSocket, stream: MediaStream) => {
    const inputCtx = new AudioContext({ sampleRate: 16000 });
    inputAudioContextRef.current = inputCtx;
    void inputCtx.resume().catch(() => { });

    const source = inputCtx.createMediaStreamSource(stream);
    const processor = inputCtx.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;

    processor.onaudioprocess = (e) => {
      if (ws.readyState !== WebSocket.OPEN) return;

      const float32 = e.inputBuffer.getChannelData(0);
      const int16 = new Int16Array(float32.length);
      for (let i = 0; i < float32.length; i++) {
        int16[i] = Math.max(-1, Math.min(1, float32[i])) * 32767;
      }

      const base64 = uint8ToBase64(new Uint8Array(int16.buffer));

      const audioMsg = {
        realtimeInput: {
          audio: {
            data: base64,
            mimeType: 'audio/pcm;rate=16000'
          }
        }
      };

      ws.send(JSON.stringify(audioMsg));
    };

    source.connect(processor);
    processor.connect(inputCtx.destination);
  };
  const playAudioChunk = (base64Data: string) => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;

    const bytes = base64ToUint8(base64Data);
    const int16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16.length);

    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 32768.0;
    }

    const buffer = ctx.createBuffer(1, float32.length, 24000);
    buffer.getChannelData(0).set(float32);

    const sourceNode = ctx.createBufferSource();
    sourceNode.buffer = buffer;
    sourceNode.connect(ctx.destination);

    const startTime = Math.max(ctx.currentTime, nextStartTimeRef.current);
    sourceNode.start(startTime);
    nextStartTimeRef.current = startTime + buffer.duration;

    sourceNodesRef.current.add(sourceNode);
    sourceNode.onended = () => {
      sourceNodesRef.current.delete(sourceNode);
    };
  };

  const disconnectLive = () => {
    setIsLive(false);

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }

    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ realtimeInput: { audioStreamEnd: true } }));
      }
      wsRef.current.close();
      wsRef.current = null;
    }

    sourceNodesRef.current.forEach(node => {
      try { node.stop(); } catch { }
    });
    sourceNodesRef.current.clear();
    nextStartTimeRef.current = 0;
  };

  // Base64 helpers
  function uint8ToBase64(bytes: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function base64ToUint8(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  return (
    <div className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-[80] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-dark-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-gold-600/10 to-transparent shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/20">
                  <Sparkles size={20} className="text-black" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">LUXE Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-green-500'} `}></span>
                    <span className="text-xs text-gray-400">{isLive ? t('chat.voice_live') : t('chat.online_gemini')}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {isRegistered && (
                  <button
                    onClick={isLive ? disconnectLive : connectLive}
                    className={`p-2 rounded-full transition-colors ${isLive ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
                    title={isLive ? t('chat.end_chat') : t('chat.voice_chat')}
                  >
                    {isLive ? <PhoneOff size={20} /> : <Mic size={20} />}
                  </button>
                )}
                <button
                  onClick={() => {
                    disconnectLive();
                    setIsOpen(false);
                  }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {!isRegistered ? (
              <div className="flex-1 p-6 flex flex-col justify-center">
                <div className="text-center mb-8">
                  <h4 className="text-xl font-bold text-white mb-2">{t('chat.welcome_title')}</h4>
                  <p className="text-gray-400 text-sm">{t('chat.welcome_desc')}</p>
                </div>

                <form onSubmit={handleRegistration} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gold-400 font-medium ml-1">{t('chat.name_label')}</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black/40 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white focus:border-gold-400 focus:outline-none"
                        placeholder={t('chat.name_placeholder')}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gold-400 font-medium ml-1">{t('chat.phone_label')}</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <span className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-400">+998</span>
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{9,12}"
                        title="Telefon raqamni to'g'ri kiriting (masalan: 901234567)"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })}
                        className="w-full bg-black/40 border border-white/20 rounded-xl pl-24 pr-4 py-3 text-white focus:border-gold-400 focus:outline-none"
                        placeholder="90 123 45 67"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full bg-gold-400 text-black font-bold py-3.5 rounded-xl hover:bg-gold-500 transition-colors flex items-center justify-center gap-2 mt-4"
                  >
                    {formLoading ? (
                      <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                    ) : (
                      <>
                        {t('chat.start_btn')} <ChevronRight size={18} />
                      </>
                    )}
                  </button>
                </form>
                <p className="text-xs text-gray-600 text-center mt-6">
                  {t('chat.security_note')}
                </p>
              </div>
            ) : (
              <>
                <div
                  ref={scrollContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20"
                >
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                          ? 'bg-gold-500 text-black font-medium rounded-tr-sm'
                          : 'bg-white/10 text-gray-200 rounded-tl-sm border border-white/5'
                          }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isLoading && !isLive && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 p-4 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                      </div>
                    </div>
                  )}
                  {isLive && (
                    <div className="flex justify-center py-4">
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-3 bg-gold-400 animate-[pulse_1s_ease-in-out_infinite]"></span>
                        <span className="w-1 h-5 bg-gold-400 animate-[pulse_1.1s_ease-in-out_infinite]"></span>
                        <span className="w-1 h-8 bg-gold-400 animate-[pulse_1.2s_ease-in-out_infinite]"></span>
                        <span className="w-1 h-5 bg-gold-400 animate-[pulse_1.3s_ease-in-out_infinite]"></span>
                        <span className="w-1 h-3 bg-gold-400 animate-[pulse_1.4s_ease-in-out_infinite]"></span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-white/10 bg-dark-900/50">
                  {isLive ? (
                    <div className="flex items-center justify-center gap-3 text-sm text-gold-400">
                      <Mic className="animate-pulse" size={16} />
                      <span>{t('chat.listening')}</span>
                    </div>
                  ) : (
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder={t('chat.input_placeholder')}
                        className="w-full bg-white/5 border border-white/10 rounded-full pl-5 pr-12 py-3.5 text-sm text-white focus:outline-none focus:border-gold-400/50 focus:ring-1 focus:ring-gold-400/50 transition-all placeholder:text-gray-600"
                      />
                      <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 p-2 bg-gold-400 text-black rounded-full hover:bg-gold-500 disabled:opacity-50 disabled:hover:bg-gold-400 transition-colors"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full shadow-[0_0_30px_rgba(251,191,36,0.3)] hover:shadow-[0_0_50px_rgba(251,191,36,0.5)] transition-shadow"
      >
        <AnimatePresence mode='wait'>
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={28} className="text-black" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle size={28} className="text-black fill-black/10" />
            </motion.div>
          )}
        </AnimatePresence>

        {!isOpen && !isRegistered && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-black animate-pulse"></span>
        )}
      </motion.button>
    </div>
  );
};

export default AIChatAssistant;

