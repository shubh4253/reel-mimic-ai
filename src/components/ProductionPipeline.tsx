import React from 'react';
import { PipelineProgress, Lang } from '../types/index.ts';
import { t } from '../i18n.ts';
import { ShieldCheck, CheckCircle2, Clock, Layers, ArrowRight, Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';

interface ProductionPipelineProps {
  pipeline: PipelineProgress;
  lang: Lang;
  onZoomImage?: (url: string) => void;
}

export const ProductionPipeline: React.FC<ProductionPipelineProps> = ({
  pipeline,
  lang,
  onZoomImage
}) => {
  const phases = [
    { id: 'setup', label: 'Setup', desc: 'Characters & Assets' },
    { id: 'cast', label: 'Cast Gate', desc: 'Model Sheet Review' },
    { id: 'shots', label: 'Shot Chunks', desc: 'Parallel Production' },
    { id: 'assemble', label: 'Assemble', desc: 'Sequence Timeline' },
    { id: 'final', label: 'Final Review', desc: 'Quality Inspection' }
  ];

  const currentPhaseIndex = phases.findIndex((p) => p.id === pipeline.phase);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Pipeline 5-Stage Stepper */}
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#7a6bff]" />
            <h3 className="text-sm font-bold text-white">Multi-Agent Production Line</h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Active Agent: {pipeline.active_agent}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {phases.map((ph, idx) => {
            const isCompleted = idx < currentPhaseIndex || pipeline.phase === 'final';
            const isCurrent = idx === currentPhaseIndex && pipeline.phase !== 'final';

            return (
              <div
                key={ph.id}
                className={`p-3 rounded-xl border flex flex-col gap-1 transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                    : isCurrent
                    ? 'bg-[#7a6bff]/15 border-[#7a6bff] text-white shadow-lg shadow-[#7a6bff]/20 ring-1 ring-[#7a6bff]/50'
                    : 'bg-white/[0.02] border-white/[0.04] text-slate-500 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span>Phase 0{idx + 1}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : isCurrent ? (
                    <RefreshCw className="w-3.5 h-3.5 text-[#7a6bff] animate-spin" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                </div>
                <span className="text-xs font-bold font-display">{ph.label}</span>
                <span className="text-[10px] text-slate-400 truncate">{ph.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chunks Production Cards */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Production Chunks & Gated Reviews</h3>
          <span className="text-xs font-mono text-slate-400">
            Completed: {pipeline.total_shots_completed}/{pipeline.total_shots_count} shots
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(pipeline.chunks).map((chunk) => {
            const isPassed = chunk.state === 'passed';
            const isBuilding = chunk.state === 'building';
            const isReviewing = chunk.state === 'reviewing';
            const isFixing = chunk.state === 'fixing';

            return (
              <div
                key={chunk.id}
                className={`p-4 rounded-xl border flex flex-col gap-3 transition-colors ${
                  isPassed
                    ? 'bg-white/[0.02] border-emerald-500/30'
                    : isFixing
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-white/[0.02] border-white/[0.06]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{chunk.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                      isPassed
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                        : isFixing
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        : isReviewing
                        ? 'bg-violet-500/10 text-violet-300 border border-violet-500/30'
                        : 'bg-white/[0.04] text-slate-400'
                    }`}
                  >
                    {chunk.state.toUpperCase()} · Round #{chunk.round}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span>Contains shots:</span>
                  <div className="flex items-center gap-1">
                    {chunk.shots.map((sh) => (
                      <span
                        key={sh}
                        className="px-1.5 py-0.2 rounded bg-white/[0.04] text-slate-300 text-[10px]"
                      >
                        #{sh}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Proof of Fix Diff or Inspection Verdict */}
                {chunk.critic_critique ? (
                  <div className="p-3 rounded-lg bg-black/40 border border-white/[0.04] text-xs text-slate-300 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-300 font-mono text-[10px] block">
                        Gated Reviewer Verdict:
                      </span>
                      <p className="mt-0.5 leading-relaxed">{chunk.critic_critique}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-black/40 border border-white/[0.04] text-xs text-slate-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Independent Critic verified continuity and camera pacing.</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
