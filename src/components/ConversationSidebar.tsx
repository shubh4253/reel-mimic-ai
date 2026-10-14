import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, AgentLogEntry, PlanView, Shot } from '../types/index.ts';
import { Send, Sparkles, User, ShieldCheck, Terminal, MessageSquare, ChevronRight, CheckCircle2, AlertCircle, Mic, MicOff } from 'lucide-react';

interface ConversationSidebarProps {
  chat: ChatMessage[];
  logs: AgentLogEntry[];
  plan?: PlanView;
  onSendMessage: (text: string, shotTag?: string) => void;
  selectedShotId?: string;
  onSelectShot?: (shotId: string) => void;
  isProcessing?: boolean;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  chat,
  logs,
  plan,
  onSendMessage,
  selectedShotId,
  onSelectShot,
  isProcessing = false
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'logs'>('chat');
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const logsEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize browser Web Speech API
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInputMessage(transcript);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceCapture = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Could not start speech recognition:', e);
      }
    } else {
      // Fallback: prompt for simulated voice input or hint
      const voiceInput = window.prompt("Voice recognition not supported by browser. Type your spoken instruction:");
      if (voiceInput) {
        onSendMessage(voiceInput, selectedShotId);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    // Automatically pipe the transcribed text into the project chat to guide the AI Director
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim(), selectedShotId);
      setInputMessage('');
    }
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat, logs, activeTab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    onSendMessage(inputMessage.trim(), selectedShotId);
    setInputMessage('');
  };

  const quickPrompts = [
    'Make shot transitions faster',
    'Add more neon glow to the palette',
    'Change camera move to dynamic dolly-in',
    'Introduce a comedic character beat'
  ];

  return (
    <div className="flex flex-col h-full rounded-2xl bg-[#0f172a] border border-white/[0.08] overflow-hidden shadow-xl">
      {/* Top Tabs */}
      <div className="flex items-center border-b border-white/[0.08] p-1 bg-black/20">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'chat'
              ? 'bg-[#7a6bff] text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Director Chat</span>
          {chat.length > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/20">
              {chat.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-[#7a6bff] text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Agent Crew Logs</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'chat' ? (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {chat.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-500">
                <Sparkles className="w-8 h-8 text-[#7a6bff] mb-2 opacity-60" />
                <p className="text-xs text-slate-400 font-medium">Direct line to your AI Director</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                  Ask to alter shot choreography, tighten cutting rhythm, or ask why a specific engine was chosen.
                </p>
              </div>
            ) : (
              chat.map((msg) => {
                const isUser = msg.role === 'user';
                const isCritic = msg.role === 'critic';
                const isSystem = msg.role === 'system';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[90%] ${
                      isUser ? 'self-end' : 'self-start'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-400 font-mono">
                      {isUser ? (
                        <>
                          <span>You</span>
                          <User className="w-3 h-3 text-[#7a6bff]" />
                        </>
                      ) : isCritic ? (
                        <>
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Gated Critic</span>
                        </>
                      ) : isSystem ? (
                        <span className="text-slate-500">System Notice</span>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-[#7a6bff]" />
                          <span className="text-[#a59bff] font-bold">
                            {msg.sender_name || 'AI Director'}
                          </span>
                        </>
                      )}
                      <span className="text-slate-600">· {msg.ts}</span>
                    </div>

                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        isUser
                          ? 'bg-[#7a6bff] text-white rounded-tr-sm'
                          : isSystem
                          ? 'bg-white/[0.04] text-slate-400 border border-white/[0.06] rounded-tl-sm w-full font-mono text-[11px]'
                          : isCritic
                          ? 'bg-emerald-950/40 text-emerald-200 border border-emerald-500/30 rounded-tl-sm'
                          : 'bg-white/[0.06] text-slate-200 border border-white/[0.08] rounded-tl-sm'
                      }`}
                    >
                      {msg.shot_id && (
                        <div
                          onClick={() => onSelectShot && onSelectShot(msg.shot_id!)}
                          className="inline-flex items-center gap-1 mb-1.5 px-2 py-0.5 rounded bg-black/30 text-[10px] font-mono text-[#00f0ff] cursor-pointer hover:underline"
                        >
                          <span>Re: #{msg.shot_id}</span>
                          <ChevronRight className="w-2.5 h-2.5" />
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>
                  </div>
                );
              })
            )}

            {isProcessing && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.04] text-xs text-slate-400 animate-pulse">
                <Sparkles className="w-4 h-4 text-[#7a6bff] animate-spin" />
                <span>AI Director is thinking & recalculating storyboard...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Suggestions */}
          <div className="px-3 pt-2 pb-1 border-t border-white/[0.04] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((q) => (
              <button
                key={q}
                onClick={() => setInputMessage(q)}
                className="shrink-0 px-2 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-[10px] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-white/[0.08] bg-black/20">
            {selectedShotId && (
              <div className="flex items-center justify-between px-2 py-1 mb-2 rounded bg-[#7a6bff]/10 border border-[#7a6bff]/20 text-[10px] text-[#a59bff] font-mono">
                <span>Directing adjustments for #{selectedShotId}</span>
                <button
                  type="button"
                  onClick={() => onSelectShot && onSelectShot('')}
                  className="hover:underline cursor-pointer"
                >
                  Clear tag
                </button>
              </div>
            )}
            {/* Voice Recognition Status Banner */}
            {isListening && (
              <div className="flex items-center justify-between px-3 py-2 mb-2 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="font-medium">Listening... speak your instructions</span>
                </div>
                <button
                  type="button"
                  onClick={stopListening}
                  className="px-2 py-0.5 rounded bg-red-500/20 text-[10px] text-red-200 hover:bg-red-500/40 cursor-pointer"
                >
                  Done Speaking
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isListening ? "Listening to your voice..." : "Give feedback or click mic to speak..."}
                className="flex-1 px-3 py-2 rounded-xl bg-white/[0.06] border border-white/[0.1] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#7a6bff] transition-colors"
              />

              {/* Web Speech API Voice Button */}
              <button
                type="button"
                onClick={toggleVoiceCapture}
                title={isListening ? "Stop listening & send" : "Speak instructions with Web Speech API"}
                className={`p-2 rounded-xl transition-all cursor-pointer shrink-0 border ${
                  isListening
                    ? 'bg-red-500 text-white border-red-400 animate-pulse shadow-lg shadow-red-500/30'
                    : 'bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 hover:text-white border-white/[0.1]'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-white" />
                ) : (
                  <Mic className="w-4 h-4 text-[#7a6bff]" />
                )}
              </button>

              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2 rounded-xl bg-[#7a6bff] hover:bg-[#6b5ae8] disabled:opacity-40 disabled:hover:bg-[#7a6bff] text-white transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Agent Logs Stream */
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 font-mono text-[11px] bg-black/40">
          <div className="text-[10px] text-slate-500 pb-2 border-b border-white/[0.06] flex items-center justify-between">
            <span>MULTI-AGENT AUTONOMOUS RUNTIME</span>
            <span className="text-emerald-400">STATUS: ACTIVE</span>
          </div>

          {logs.map((log) => {
            const isDirector = log.who === 'Director';
            const isArt = log.who === 'Art Director';
            const isCritic = log.who === 'Critic';

            return (
              <div
                key={log.id}
                className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] flex flex-col gap-1"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span
                    className={`font-bold ${
                      isDirector
                        ? 'text-[#7a6bff]'
                        : isArt
                        ? 'text-[#e86bd2]'
                        : isCritic
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}
                  >
                    [{log.who}]
                  </span>
                  <span className="text-slate-600">{log.ts}</span>
                </div>
                <div className="text-slate-300 leading-relaxed">{log.text}</div>
                {log.detail && (
                  <div className="text-[10px] text-slate-500 bg-black/40 p-1.5 rounded mt-1 overflow-x-auto">
                    {log.detail}
                  </div>
                )}
              </div>
            );
          })}

          <div ref={logsEndRef} />
        </div>
      )}
    </div>
  );
};
