import React, { useState, useRef, useEffect } from 'react';
import { PlanView, Shot, Lang } from '../types/index.ts';
import { Wand2, Sparkles, Video, ShieldCheck, ArrowRight, RefreshCw, CheckCircle2, Sliders, Smartphone, Monitor, Mic, MicOff } from 'lucide-react';

interface RevisionConsoleProps {
  plan: PlanView;
  lang: Lang;
  onModifyPlan: (instruction: string, targetShotId?: string, aspectRatio?: '16:9' | '9:16') => Promise<void>;
  onGenerateVeoVideo: (prompt: string, aspectRatio: '16:9' | '9:16') => Promise<void>;
  isModifying: boolean;
  isGeneratingVeo: boolean;
  veoProgressText?: string;
  selectedShotId?: string;
  onClearSelectedShot?: () => void;
}

export const RevisionConsole: React.FC<RevisionConsoleProps> = ({
  plan,
  lang,
  onModifyPlan,
  onGenerateVeoVideo,
  isModifying,
  isGeneratingVeo,
  veoProgressText,
  selectedShotId,
  onClearSelectedShot
}) => {
  const [instruction, setInstruction] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>(
    plan.format?.aspect_ratio === '9:16' ? '9:16' : '16:9'
  );
  const [lastChangelog, setLastChangelog] = useState<string | null>(null);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API for voice instructions
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
          setInstruction(transcript);
        }
      };

      recognition.onend = () => {
        setIsVoiceListening(false);
      };

      recognition.onerror = () => {
        setIsVoiceListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (isVoiceListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsVoiceListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsVoiceListening(true);
        } catch (e) {
          console.warn('Recognition start error:', e);
        }
      } else {
        const spoken = window.prompt("Speech recognition not supported in browser. Type your spoken instructions:");
        if (spoken) setInstruction(spoken);
      }
    }
  };

  const quickPrompts = [
    'Add neon rain and speed up shot transitions',
    'Change lighting to warm golden hour sunset',
    'Make shot camera moves more dynamic with dolly-in',
    'Convert style to high-contrast anime cel',
    'Format for 9:16 vertical Reels with punchier cuts'
  ];

  const handleApplyModification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim() || isModifying) return;
    const currentText = instruction.trim();
    await onModifyPlan(currentText, selectedShotId, aspectRatio);
    setLastChangelog(`Updated storyboard and visual prompts for: "${currentText}"`);
    setInstruction('');
  };

  const handleTriggerVeo = async () => {
    if (isGeneratingVeo) return;
    const prompt = `${plan.title}. ${plan.logline}. Style: ${plan.style}. ${plan.look.color_arc}. Aspect ratio: ${aspectRatio}.`;
    await onGenerateVeoVideo(prompt, aspectRatio);
  };

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl bg-[#0f172a] border border-white/[0.08] shadow-xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-[#7a6bff]" />
          <h3 className="text-sm font-bold text-white font-display">
            Natural Language Director & Veo 3 Studio
          </h3>
        </div>

        {/* Aspect Ratio Switcher (16:9 Landscape / 9:16 Portrait) */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/[0.08] text-xs font-mono">
          <button
            type="button"
            onClick={() => setAspectRatio('16:9')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              aspectRatio === '16:9'
                ? 'bg-[#7a6bff] text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>16:9 Landscape</span>
          </button>
          <button
            type="button"
            onClick={() => setAspectRatio('9:16')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              aspectRatio === '9:16'
                ? 'bg-[#7a6bff] text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>9:16 Reel/Shorts</span>
          </button>
        </div>
      </div>

      {/* Target Scope Badge */}
      {selectedShotId && (
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#7a6bff]/10 border border-[#7a6bff]/30 text-xs text-[#a59bff] font-mono">
          <span>Targeting specific shot: #{selectedShotId}</span>
          <button
            type="button"
            onClick={onClearSelectedShot}
            className="text-slate-400 hover:text-white underline cursor-pointer"
          >
            Switch to Global Entire Video
          </button>
        </div>
      )}

      {/* Revision Text Form */}
      <form onSubmit={handleApplyModification} className="flex flex-col gap-3">
        <div className="relative">
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder={isVoiceListening ? "Listening... describe your changes now..." : "Type or speak any changes (e.g. 'Change lighting to sunset golden hour', 'Make camera dolly-in faster', 'Switch to vertical 9:16')..."}
            rows={2}
            className={`w-full p-3.5 pr-12 rounded-xl bg-white/[0.04] border text-xs text-white placeholder:text-slate-500 focus:outline-none transition-colors resize-none ${
              isVoiceListening
                ? 'border-red-400/80 bg-red-500/[0.04] animate-pulse ring-1 ring-red-400'
                : 'border-white/[0.1] focus:border-[#7a6bff]'
            }`}
          />
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            title={isVoiceListening ? "Stop voice listening" : "Speak changes with Web Speech API"}
            className={`absolute right-3 top-3 p-2 rounded-lg transition-all cursor-pointer ${
              isVoiceListening
                ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            {isVoiceListening ? (
              <MicOff className="w-4 h-4 text-white" />
            ) : (
              <Mic className="w-4 h-4 text-[#7a6bff]" />
            )}
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInstruction(p)}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-[11px] text-slate-400 hover:text-slate-200 border border-white/[0.04] transition-colors cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Action Buttons: Apply Text Changes OR Generate Veo 3 Video */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Copyright Safe Notice */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Copyright Safe: Transforms style & rhythm without copying assets</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* 1. Apply Text Change Button */}
            <button
              type="submit"
              disabled={!instruction.trim() || isModifying}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] disabled:opacity-40 text-xs font-semibold text-white border border-white/[0.1] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isModifying ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#7a6bff]" />
                  <span>Applying Text Edits...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5 text-[#7a6bff]" />
                  <span>Update Storyboard</span>
                </>
              )}
            </button>

            {/* 2. Generate with Veo 3 Button */}
            <button
              type="button"
              onClick={handleTriggerVeo}
              disabled={isGeneratingVeo}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7a6bff] via-[#e86bd2] to-[#ff9d5c] hover:opacity-95 disabled:opacity-50 text-xs font-bold text-white shadow-lg shadow-[#7a6bff]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isGeneratingVeo ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing (Veo 3)...</span>
                </>
              ) : (
                <>
                  <Video className="w-3.5 h-3.5" />
                  <span>Generate Video with Veo 3 ({aspectRatio})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Veo 3 Live Progress Banner */}
      {isGeneratingVeo && (
        <div className="p-3.5 rounded-xl bg-[#7a6bff]/10 border border-[#7a6bff]/30 flex items-center justify-between text-xs text-[#a59bff] animate-pulse">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#e86bd2] animate-spin" />
            <span>{veoProgressText || 'Veo 3 model (veo-3.1-fast-generate-preview) generating video frames...'}</span>
          </div>
          <span className="font-mono text-[10px] text-white">720p · {aspectRatio}</span>
        </div>
      )}

      {/* Last Changelog Feedback */}
      {lastChangelog && !isModifying && (
        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{lastChangelog}</span>
        </div>
      )}
    </div>
  );
};
