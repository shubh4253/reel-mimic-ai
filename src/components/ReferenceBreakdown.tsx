import React from 'react';
import { DeconstructionReport, Lang } from '../types/index.ts';
import { STYLE_ENGINES } from '../data/presets.ts';
import { t } from '../i18n.ts';
import { Activity, Clock, Film, Palette, Camera, Wand2, Compass, Layers, CheckCircle2 } from 'lucide-react';

interface ReferenceBreakdownProps {
  report: DeconstructionReport;
  referenceUrl?: string;
  referenceName: string;
  lang: Lang;
}

export const ReferenceBreakdown: React.FC<ReferenceBreakdownProps> = ({
  report,
  referenceUrl,
  referenceName,
  lang
}) => {
  const matchedEngine = STYLE_ENGINES.find((e) => e.id === report.detected_engine) || STYLE_ENGINES[0];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Banner: Detected Style Engine Recommendation */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#7a6bff]/20 via-[#0f172a] to-[#0f172a] border border-[#7a6bff]/30 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#7a6bff]/20 border border-[#7a6bff]/40 flex items-center justify-center shrink-0">
              <Wand2 className="w-6 h-6 text-[#7a6bff]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono uppercase tracking-wider text-[#a59bff]">
                  {t('detectedEngine', lang)}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {report.engine_confidence}% {t('confidence', lang)}
                </span>
              </div>
              <h2 className="text-xl font-bold font-display text-white">
                {lang === 'zh-TW' || lang === 'zh-CN' ? matchedEngine.nameZh : matchedEngine.name}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {report.engine_rationale}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className="text-[11px] font-mono text-slate-400">ENGINE ID</span>
            <span className="px-3 py-1 rounded-lg bg-white/[0.06] border border-white/[0.1] text-xs font-mono font-bold text-[#00f0ff]">
              {matchedEngine.id}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Cinematography & Rhythm Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Activity className="w-4 h-4 text-[#7a6bff]" />
            <span>{t('bpm', lang)}</span>
          </div>
          <span className="text-2xl font-bold font-mono text-white">
            {report.audio.bpm}
          </span>
          <span className="text-[11px] text-slate-500 font-mono truncate">
            {report.audio.mood}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Film className="w-4 h-4 text-[#00f0ff]" />
            <span>{t('shotCount', lang)}</span>
          </div>
          <span className="text-2xl font-bold font-mono text-white">
            {report.pacing.shot_count} shots
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {report.video.duration}s duration
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{t('meanShot', lang)}</span>
          </div>
          <span className="text-2xl font-bold font-mono text-white">
            {report.pacing.mean_shot_s}s
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            Fastest: {report.pacing.fastest_shot_s}s
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>{t('tempo', lang)}</span>
          </div>
          <span className="text-2xl font-bold font-display uppercase tracking-wider text-emerald-400">
            {report.pacing.tempo}
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {report.video.aspect_ratio} · {report.video.fps} fps
          </span>
        </div>
      </div>

      {/* Two Column Layout: Camera Choreography & Color Arc */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Camera Moves Distribution */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Camera className="w-4 h-4 text-[#7a6bff]" />
              <span>{t('cameraMoves', lang)}</span>
            </div>
            <span className="text-xs font-mono text-slate-400">Cinematography</span>
          </div>

          <div className="flex flex-col gap-3">
            {Object.entries(report.cinematography.camera_movement_distribution).map(([move, pct]) => (
              <div key={move} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-300 capitalize">
                    {move.replace('_', ' ')}
                  </span>
                  <span className="font-mono font-bold text-white">{pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-gradient-to-r from-[#7a6bff] to-[#00f0ff] rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs text-slate-400">
            <span>Primary Transition:</span>
            <span className="font-mono text-white">
              Cut ({report.cinematography.transitions.cut || 60}%) · Whip ({report.cinematography.transitions.whip || 25}%)
            </span>
          </div>
        </div>

        {/* Color Palette & Arc Progression */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Palette className="w-4 h-4 text-[#e86bd2]" />
              <span>{t('colorArc', lang)}</span>
            </div>
            <span className="text-xs font-mono text-slate-400">Color Grading</span>
          </div>

          {/* Extracted Swatches */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-slate-400">EXTRACTED REFERENCE SWATCHES</span>
            <div className="grid grid-cols-5 gap-2">
              {report.look.palette.map((color, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    style={{ backgroundColor: color }}
                    className="w-full h-12 rounded-xl shadow-md border border-white/[0.1] hover:scale-105 transition-transform"
                  />
                  <span className="text-[10px] font-mono text-slate-400">{color}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
            <span className="text-[11px] font-mono text-slate-400">COLOR PROGRESSION ARC</span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {report.look.color_arc}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Lighting Language:</span>
            <span className="text-slate-200">{report.look.lighting}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
