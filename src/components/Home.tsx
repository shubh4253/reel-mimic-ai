import React, { useState } from 'react';
import { Project, Lang, StyleEngineId } from '../types/index.ts';
import { STYLE_ENGINES, SHOWCASE_PRESETS } from '../data/presets.ts';
import { t } from '../i18n.ts';
import { Youtube, Upload, Film, Sparkles, ArrowRight, Play, Wand2, Check, Clock, Layers } from 'lucide-react';

interface HomeProps {
  projects: Project[];
  lang: Lang;
  onOpenProject: (projectId: string) => void;
  onCreateProject: (params: {
    referenceType: 'preset' | 'file' | 'url';
    referenceSrc: string;
    referenceName: string;
    brief: string;
    engine?: StyleEngineId;
    file?: File;
  }) => void;
  isCreating: boolean;
}

export const Home: React.FC<HomeProps> = ({
  projects,
  lang,
  onOpenProject,
  onCreateProject,
  isCreating
}) => {
  const [activeMode, setActiveMode] = useState<'youtube' | 'file' | 'preset'>('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubePreview, setYoutubePreview] = useState<{
    videoId: string;
    title: string;
    thumbnailUrl: string;
    authorName?: string;
  } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(SHOWCASE_PRESETS[0].id);
  const [brief, setBrief] = useState('');
  const [selectedEngine, setSelectedEngine] = useState<StyleEngineId | 'auto'>('auto');
  const [dragActive, setDragActive] = useState(false);
  const [isVerifyingUrl, setIsVerifyingUrl] = useState(false);

  // YouTube URL parsing & verification
  const handleUrlChange = async (url: string) => {
    setYoutubeUrl(url);
    const match = url.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([a-zA-Z0-9_-]{11})/);
    if (match) {
      setIsVerifyingUrl(true);
      const vid = match[1];
      try {
        const res = await fetch('/api/youtube-info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        });
        if (res.ok) {
          const data = await res.json();
          setYoutubePreview({
            videoId: data.videoId,
            title: data.title,
            thumbnailUrl: data.thumbnailUrl,
            authorName: data.authorName
          });
        } else {
          setYoutubePreview({
            videoId: vid,
            title: `YouTube Video (${vid})`,
            thumbnailUrl: `https://img.youtube.com/vi/${vid}/hqdefault.jpg`
          });
        }
      } catch (e) {
        setYoutubePreview({
          videoId: vid,
          title: `YouTube Video (${vid})`,
          thumbnailUrl: `https://img.youtube.com/vi/${vid}/hqdefault.jpg`
        });
      } finally {
        setIsVerifyingUrl(false);
      }
    } else {
      setYoutubePreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setActiveMode('file');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating) return;

    if (activeMode === 'youtube') {
      if (!youtubeUrl) return;
      onCreateProject({
        referenceType: 'url',
        referenceSrc: youtubeUrl,
        referenceName: youtubePreview?.title || 'YouTube Video Reference',
        brief: brief || 'Mimic the editing rhythm, camera movement, and pacing of this video',
        engine: selectedEngine === 'auto' ? undefined : selectedEngine
      });
    } else if (activeMode === 'file') {
      if (!selectedFile) return;
      onCreateProject({
        referenceType: 'file',
        referenceSrc: URL.createObjectURL(selectedFile),
        referenceName: selectedFile.name,
        brief: brief || 'Mimic the editing rhythm, camera movement, and pacing of this video',
        engine: selectedEngine === 'auto' ? undefined : selectedEngine,
        file: selectedFile
      });
    } else {
      const preset = SHOWCASE_PRESETS.find((p) => p.id === selectedPresetId) || SHOWCASE_PRESETS[0];
      onCreateProject({
        referenceType: 'preset',
        referenceSrc: preset.reference_src,
        referenceName: preset.reference_name,
        brief: brief || preset.brief,
        engine: selectedEngine === 'auto' ? preset.plan?.engine : selectedEngine
      });
    }
  };

  const suggestions = [
    'A 30-second commercial for our tech app with fast cuts',
    'Keep the rhythm and transitions, make it about coffee in space, vertical 9:16',
    'A comedic pet animation with zoom punches and funny sound effects',
    'An indie ballad narrative with lyrical watercolor dissolves'
  ];

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center pt-10 sm:pt-16 max-w-4xl mx-auto px-4">
        {/* Animated Glowing Orb Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full orb-glow -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-[#a59bff] mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#7a6bff]" />
          <span>AI Style Deconstruction & Autonomous Crew</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-tight">
          {t('tagline', lang).split('.')[0]}.
          <br />
          <span className="bg-gradient-to-r from-[#7a6bff] via-[#e86bd2] to-[#ff9d5c] bg-clip-text text-transparent">
            {t('tagline', lang).split('.')[1] || ''}
          </span>
        </h1>

        <p className="mt-5 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          {t('heroSub', lang)}
        </p>
      </section>

      {/* Main Studio Composer */}
      <section className="max-w-4xl w-full mx-auto px-4">
        <div className="rounded-3xl bg-[#0f172a]/90 border border-white/[0.1] shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
          {/* Mode Tabs */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-black/40 border border-white/[0.06] mb-6">
            <button
              onClick={() => setActiveMode('youtube')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeMode === 'youtube'
                  ? 'bg-[#7a6bff] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Youtube className="w-4 h-4 text-red-400" />
              <span>{t('pasteYoutube', lang)}</span>
            </button>

            <button
              onClick={() => setActiveMode('file')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeMode === 'file'
                  ? 'bg-[#7a6bff] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Upload className="w-4 h-4 text-[#00f0ff]" />
              <span>Upload Video</span>
            </button>

            <button
              onClick={() => setActiveMode('preset')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeMode === 'preset'
                  ? 'bg-[#7a6bff] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-4 h-4 text-[#ff9d5c]" />
              <span>Viral Showcases</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* YouTube Mode */}
            {activeMode === 'youtube' && (
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <Youtube className="w-5 h-5 text-red-500" />
                  </div>
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or https://youtube.com/shorts/..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#7a6bff] transition-colors"
                    required
                  />
                </div>

                {/* Instant YouTube Preview Card */}
                {youtubePreview && (
                  <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] animate-in fade-in">
                    <div className="w-24 h-16 rounded-xl overflow-hidden bg-black/60 shrink-0 border border-white/[0.1]">
                      <img
                        src={youtubePreview.thumbnailUrl}
                        alt={youtubePreview.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-white truncate">
                        {youtubePreview.title}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {youtubePreview.authorName || 'YouTube Reference Video'}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-1">
                        <Check className="w-3 h-3" />
                        Rhythm, BPM & shot cut analyzer ready
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* File Upload Mode */}
            {activeMode === 'file' && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${
                  dragActive
                    ? 'border-[#7a6bff] bg-[#7a6bff]/10'
                    : selectedFile
                    ? 'border-emerald-500/50 bg-emerald-500/5'
                    : 'border-white/[0.1] hover:border-white/[0.2] bg-white/[0.02]'
                }`}
                onClick={() => document.getElementById('video-file-input')?.click()}
              >
                <input
                  id="video-file-input"
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && setSelectedFile(e.target.files[0])}
                />

                <Upload className="w-10 h-10 text-[#7a6bff] mb-3 opacity-80" />
                <p className="text-sm font-medium text-white">
                  {selectedFile ? selectedFile.name : t('dropVideo', lang)}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {selectedFile
                    ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB · Ready for style deconstruction`
                    : t('videoFormatHint', lang)}
                </p>
              </div>
            )}

            {/* Presets Mode */}
            {activeMode === 'preset' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SHOWCASE_PRESETS.map((p) => {
                  const isSelected = selectedPresetId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPresetId(p.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                        isSelected
                          ? 'bg-[#7a6bff]/15 border-[#7a6bff] shadow-lg shadow-[#7a6bff]/20 ring-1 ring-[#7a6bff]'
                          : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.15]'
                      }`}
                    >
                      <div className="w-full h-24 rounded-xl overflow-hidden bg-black/40 relative">
                        <img
                          src={p.reference_src}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-white">
                          {p.report?.pacing.shot_count} shots · {p.report?.audio.bpm} BPM
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                          {p.brief}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Creative Brief */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Creative Brief & Narrative Direction</span>
                <span className="text-[11px] font-mono text-slate-500">What should the new video be about?</span>
              </label>

              <textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder={t('briefPlaceholder', lang)}
                rows={3}
                className="w-full p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#7a6bff] resize-none transition-colors"
              />

              {/* Suggestions Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setBrief(s)}
                    className="shrink-0 px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-[11px] text-slate-400 hover:text-slate-200 border border-white/[0.04] transition-colors cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Engine Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Production Style Engine</span>
                <span className="text-[11px] font-mono text-[#a59bff]">Auto-detect or manual choice</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedEngine('auto')}
                  className={`p-2.5 rounded-xl border text-left flex flex-col gap-0.5 transition-all cursor-pointer ${
                    selectedEngine === 'auto'
                      ? 'bg-[#7a6bff]/20 border-[#7a6bff] text-white shadow-sm'
                      : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-bold flex items-center gap-1">
                    <Wand2 className="w-3 h-3 text-[#7a6bff]" />
                    Auto-Detect
                  </span>
                  <span className="text-[10px] text-slate-500">Matches reference rhythm</span>
                </button>

                {STYLE_ENGINES.slice(0, 3).map((eng) => (
                  <button
                    key={eng.id}
                    type="button"
                    onClick={() => setSelectedEngine(eng.id)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col gap-0.5 transition-all cursor-pointer ${
                      selectedEngine === eng.id
                        ? 'bg-[#7a6bff]/20 border-[#7a6bff] text-white shadow-sm'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-bold truncate">{eng.name.split('/')[0]}</span>
                    <span className="text-[10px] text-slate-500 truncate">{eng.category}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Submit CTA */}
            <button
              type="submit"
              disabled={isCreating}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#7a6bff] via-[#6352f8] to-[#4338ca] hover:from-[#8b7eff] hover:to-[#5044d4] text-white font-bold text-sm tracking-wide shadow-xl shadow-[#7a6bff]/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              {isCreating ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>{t('analyzing', lang)}</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>{t('deconstructBtn', lang)}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Recent Projects Gallery */}
      {projects.length > 0 && (
        <section className="max-w-6xl w-full mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold font-display text-white">
                {t('recentProjects', lang)}
              </h2>
              <p className="text-xs text-slate-400">Jump back into your productions</p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => onOpenProject(proj.id)}
                className="group rounded-2xl bg-[#0f172a] border border-white/[0.08] hover:border-[#7a6bff]/40 overflow-hidden shadow-lg transition-all cursor-pointer flex flex-col"
              >
                <div className="relative w-full h-40 bg-black/60 overflow-hidden">
                  <img
                    src={proj.reference_src}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-mono text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{proj.stage.toUpperCase()}</span>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-[#00f0ff]">
                    {proj.report?.pacing.shot_count || 4} shots
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#a59bff] transition-colors truncate">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {proj.brief}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-[11px] font-mono text-slate-500">
                    <span>{proj.reference_name}</span>
                    <span className="text-[#7a6bff] group-hover:translate-x-1 transition-transform">
                      Open →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Style Engine Showcase Reference Section */}
      <section id="styles-section" className="max-w-6xl w-full mx-auto px-4 pt-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold font-display text-white">
            {t('sevenEngines', lang)}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            {t('sevenEnginesSub', lang)}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STYLE_ENGINES.map((eng) => (
            <div
              key={eng.id}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-[#7a6bff]/30 transition-all flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span
                  style={{ color: eng.color }}
                  className="text-xs font-mono font-bold uppercase tracking-wider"
                >
                  {eng.category}
                </span>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: eng.color }} />
              </div>

              <div>
                <h3 className="text-base font-bold text-white font-display">
                  {lang === 'zh-TW' || lang === 'zh-CN' ? eng.nameZh : eng.name}
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  {eng.description}
                </p>
              </div>

              <div className="pt-2 border-t border-white/[0.04] flex flex-col gap-1 text-[11px]">
                <span className="text-slate-500">Aesthetic:</span>
                <span className="text-slate-300">{eng.aesthetic}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
