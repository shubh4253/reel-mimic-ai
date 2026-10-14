import React, { useState } from 'react';
import { PlanView, Shot, CharacterSheet, StyleFrame, Lang } from '../types/index.ts';
import { t } from '../i18n.ts';
import { CheckCircle2, ArrowRight, Eye, Film, Sparkles, User, Palette, Camera, Layers, Zap } from 'lucide-react';

interface PlanReviewProps {
  plan: PlanView;
  lang: Lang;
  onApprove: () => void;
  isApproved: boolean;
  onSelectShotForFeedback?: (shotId: string) => void;
  onZoomImage?: (url: string) => void;
}

export const PlanReview: React.FC<PlanReviewProps> = ({
  plan,
  lang,
  onApprove,
  isApproved,
  onSelectShotForFeedback,
  onZoomImage
}) => {
  const [selectedTab, setSelectedTab] = useState<'shots' | 'characters' | 'frames'>('shots');

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Approval Action Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#7a6bff] via-[#6352f8] to-[#4338ca] p-6 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-violet-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pre-Production Plan Review</span>
            </div>
            <h2 className="text-xl font-bold font-display">{plan.title}</h2>
            <p className="text-xs text-violet-100 leading-relaxed">
              {plan.logline}
            </p>
          </div>

          <button
            onClick={onApprove}
            disabled={isApproved}
            className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg cursor-pointer shrink-0 ${
              isApproved
                ? 'bg-emerald-500/30 text-emerald-100 border border-emerald-400/50 cursor-default'
                : 'bg-white text-[#4338ca] hover:bg-slate-100 hover:scale-105 active:scale-95 shadow-black/20'
            }`}
          >
            {isApproved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>{t('planApproved', lang)}</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current text-amber-400" />
                <span>{t('approveAndProduce', lang)}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Borrowed Techniques Accordion */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#a59bff] mb-2.5">
          <Layers className="w-3.5 h-3.5 text-[#7a6bff]" />
          <span>{t('borrowedTechniques', lang)}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {plan.borrowed_from_reference.map((tech, i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.04] text-xs text-slate-300 flex items-start gap-2"
            >
              <span className="font-mono text-[#7a6bff] font-bold">0{i + 1}.</span>
              <span>{tech}</span>
            </div>
          ))}
        </div>
      </div>

      {/* View Segmented Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1">
        <button
          onClick={() => setSelectedTab('shots')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            selectedTab === 'shots'
              ? 'bg-white/[0.08] text-white border border-white/[0.1]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Film className="w-3.5 h-3.5 text-[#7a6bff]" />
          <span>{t('storyboard', lang)} ({plan.shots.length})</span>
        </button>

        <button
          onClick={() => setSelectedTab('characters')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            selectedTab === 'characters'
              ? 'bg-white/[0.08] text-white border border-white/[0.1]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5 text-[#e86bd2]" />
          <span>{t('characters', lang)} ({plan.characters.length})</span>
        </button>

        <button
          onClick={() => setSelectedTab('frames')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            selectedTab === 'frames'
              ? 'bg-white/[0.08] text-white border border-white/[0.1]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span>{t('styleFrames', lang)} ({plan.style_frames.length})</span>
        </button>
      </div>

      {/* Storyboard Shots List */}
      {selectedTab === 'shots' && (
        <div className="flex flex-col gap-4">
          {plan.shots.map((shot) => (
            <div
              key={shot.id}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-[#7a6bff]/40 transition-colors flex flex-col md:flex-row gap-5"
            >
              {/* Left: Shot Preview or Procedural Canvas Thumbnail */}
              <div
                onClick={() => onZoomImage && onZoomImage(shot.rendered_frame || shot.frame_url || '')}
                className="w-full md:w-56 h-36 rounded-lg bg-black/60 border border-white/[0.08] overflow-hidden relative group shrink-0 cursor-pointer"
              >
                {shot.rendered_frame || shot.frame_url ? (
                  <img
                    src={shot.rendered_frame || shot.frame_url}
                    alt={shot.summary}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-tr from-[#7a6bff]/20 to-black">
                    <Film className="w-6 h-6 text-[#7a6bff] mb-1 opacity-60" />
                    <span className="text-[10px] font-mono text-slate-400">Rendering Frame</span>
                  </div>
                )}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-white">
                  Shot #{shot.index.toString().padStart(2, '0')}
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-[#00f0ff]">
                  {shot.duration_s}s
                </div>
              </div>

              {/* Middle: Details */}
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{shot.summary}</span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {shot.action}
                    </p>
                  </div>

                  {onSelectShotForFeedback && (
                    <button
                      onClick={() => onSelectShotForFeedback(shot.id)}
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.08] transition-colors cursor-pointer shrink-0"
                    >
                      Director Note
                    </button>
                  )}
                </div>

                {/* Cinematography Badges & Reference Match */}
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded bg-[#7a6bff]/10 border border-[#7a6bff]/30 text-[10px] font-mono text-[#a59bff]">
                    {shot.camera.move.toUpperCase()} {shot.camera.lens ? `· ${shot.camera.lens}` : ''}
                  </span>

                  {shot.transition_out && (
                    <span className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] font-mono text-slate-400">
                      TRANS: {shot.transition_out.toUpperCase()}
                    </span>
                  )}

                  {shot.ref_what && (
                    <span className="px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 text-[10px] font-mono text-amber-300">
                      REF #{shot.ref_shot}: {shot.ref_what}
                    </span>
                  )}
                </div>

                {/* Viewer Emotion / Reads */}
                {shot.reads && shot.reads.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                    <span className="text-slate-500">Viewer reads:</span>
                    {shot.reads.map((r, idx) => (
                      <span key={idx} className="text-slate-300">
                        {r}{idx < shot.reads!.length - 1 ? ' · ' : ''}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Characters Sheets */}
      {selectedTab === 'characters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.characters.map((char) => (
            <div
              key={char.id}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-4"
            >
              <div
                onClick={() => onZoomImage && onZoomImage(char.image_url)}
                className="w-24 h-28 rounded-xl bg-black/40 overflow-hidden relative group shrink-0 cursor-pointer border border-white/[0.08]"
              >
                <img
                  src={char.image_url}
                  alt={char.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="flex flex-col gap-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{char.name}</h3>
                  <span
                    style={{ backgroundColor: `${char.color_motif}20`, borderColor: `${char.color_motif}40`, color: char.color_motif }}
                    className="px-2 py-0.5 rounded text-[10px] font-mono border font-medium"
                  >
                    {char.role}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {char.design}
                </p>
                <div className="text-[11px] text-slate-400 mt-1">
                  <span className="font-medium text-slate-300">Narrative Arc:</span> {char.arc}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Style Frames */}
      {selectedTab === 'frames' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plan.style_frames.map((frame) => (
            <div
              key={frame.id}
              onClick={() => onZoomImage && onZoomImage(frame.image_url)}
              className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-[#7a6bff]/40 transition-colors flex flex-col gap-2.5 cursor-pointer group"
            >
              <div className="w-full h-48 rounded-lg overflow-hidden bg-black/40 relative">
                <img
                  src={frame.image_url}
                  alt={frame.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-white">
                  {frame.timestamp}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-xs font-bold text-white group-hover:text-[#a59bff] transition-colors">
                  {frame.title}
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {frame.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
