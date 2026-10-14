import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Shot, TimelineComment, PlanView } from '../types/index.ts';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, MessageSquare, Download, Check, Sparkles, Film, Video, Layers } from 'lucide-react';

interface VideoPlayerProps {
  plan: PlanView;
  shots: Shot[];
  duration: number;
  comments: TimelineComment[];
  onAddComment: (time: number, text: string, shotId?: string) => void;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  veoVideoUrl?: string;
  onGenerateVeoRequested?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  plan,
  shots,
  duration,
  comments,
  onAddComment,
  aspectRatio = '16:9',
  veoVideoUrl,
  onGenerateVeoRequested
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoElemRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [playerMode, setPlayerMode] = useState<'canvas' | 'veo'>(veoVideoUrl ? 'veo' : 'canvas');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [commentText, setCommentText] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [activeShot, setActiveShot] = useState<Shot | null>(shots[0] || null);
  const [cachedImages, setCachedImages] = useState<Record<string, HTMLImageElement>>({});

  const totalDuration = Math.max(duration || 0, shots.reduce((acc, s) => Math.max(acc, s.end_s), 0) || 30);

  // Switch to Veo mode when a new Veo video arrives
  useEffect(() => {
    if (veoVideoUrl) {
      setPlayerMode('veo');
    }
  }, [veoVideoUrl]);

  // Preload shot images for Canvas Sequencer
  useEffect(() => {
    const images: Record<string, HTMLImageElement> = {};
    shots.forEach((shot) => {
      const src = shot.rendered_frame || shot.frame_url;
      if (src && !images[shot.id]) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = src;
        img.onload = () => {
          setCachedImages((prev) => ({ ...prev, [shot.id]: img }));
        };
      }
    });
  }, [shots]);

  // Find current shot by time
  const getCurrentShot = useCallback((time: number): Shot | null => {
    const found = shots.find((s) => time >= s.start_s && time <= s.end_s);
    return found || shots[shots.length - 1] || null;
  }, [shots]);

  // Update active shot when time changes
  useEffect(() => {
    const shot = getCurrentShot(currentTime);
    if (shot && shot.id !== activeShot?.id) {
      setActiveShot(shot);
    }
  }, [currentTime, getCurrentShot, activeShot]);

  // Playback timer loop for Canvas mode
  useEffect(() => {
    if (playerMode !== 'canvas') return;

    let animId: number;
    let lastStamp: number | null = null;

    const tick = (now: number) => {
      if (lastStamp !== null) {
        const delta = ((now - lastStamp) / 1000) * playbackSpeed;
        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return next;
        });
      }
      lastStamp = now;
      if (isPlaying) {
        animId = requestAnimationFrame(tick);
      }
    };

    if (isPlaying) {
      animId = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, playbackSpeed, totalDuration, playerMode]);

  // Handle native video sync in Veo mode
  useEffect(() => {
    const video = videoElemRef.current;
    if (!video || playerMode !== 'veo') return;

    if (isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlaying, playerMode]);

  const handleNativeTimeUpdate = () => {
    if (videoElemRef.current && playerMode === 'veo') {
      setCurrentTime(videoElemRef.current.currentTime);
    }
  };

  // Canvas render loop for procedural motion
  useEffect(() => {
    if (playerMode !== 'canvas') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    const shot = getCurrentShot(currentTime);
    const shotDuration = shot ? shot.end_s - shot.start_s : 1;
    const shotProgress = shot ? Math.min(1, Math.max(0, (currentTime - shot.start_s) / (shotDuration || 1))) : 0;

    // Clear background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    const img = shot ? cachedImages[shot.id] : null;

    ctx.save();

    // Camera movement simulation
    const move = shot?.camera?.move || 'dolly_in';
    let scale = 1.0;
    let translateX = 0;
    let translateY = 0;

    if (move === 'dolly_in') {
      scale = 1.0 + shotProgress * 0.18;
    } else if (move === 'dolly_out') {
      scale = 1.18 - shotProgress * 0.18;
    } else if (move === 'pan_left') {
      scale = 1.1;
      translateX = (shotProgress - 0.5) * w * 0.1;
    } else if (move === 'pan_right') {
      scale = 1.1;
      translateX = (0.5 - shotProgress) * w * 0.1;
    } else if (move === 'tilt_up') {
      scale = 1.1;
      translateY = (shotProgress - 0.5) * h * 0.1;
    } else if (move === 'tilt_down') {
      scale = 1.1;
      translateY = (0.5 - shotProgress) * h * 0.1;
    } else if (move === 'whip_pan') {
      scale = 1.15;
      translateX = (Math.sin(shotProgress * Math.PI) * w * 0.2);
    }

    ctx.translate(w / 2, h / 2);
    ctx.scale(scale, scale);
    ctx.translate(-w / 2 + translateX, -h / 2 + translateY);

    if (img && img.complete) {
      const imgAspect = img.width / img.height;
      const canvasAspect = w / h;
      let drawW = w;
      let drawH = h;
      let drawX = 0;
      let drawY = 0;

      if (imgAspect > canvasAspect) {
        drawW = h * imgAspect;
        drawX = (w - drawW) / 2;
      } else {
        drawH = w / imgAspect;
        drawY = (h - drawH) / 2;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    } else {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      const palette = plan?.look?.palette || ['#7A6BFF', '#00F0FF', '#090D16'];
      grad.addColorStop(0, palette[0] || '#7A6BFF');
      grad.addColorStop(0.5, palette[1] || '#00F0FF');
      grad.addColorStop(1, palette[2] || '#090D16');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
    }

    ctx.restore();

    // Cinematic vignette
    const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.4, w / 2, h / 2, h * 0.9);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.65)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);

    // Text Overlay
    if (shot?.text_overlay && shot.text_overlay.length > 0) {
      shot.text_overlay.forEach((to) => {
        ctx.save();
        ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const textY = to.position === 'top' ? h * 0.15 : to.position === 'center' ? h * 0.5 : h * 0.82;
        ctx.shadowColor = 'rgba(122, 107, 255, 0.8)';
        ctx.shadowBlur = 18;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(to.text, w / 2, textY);
        ctx.restore();
      });
    }

    ctx.save();
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText(`REELMIMIC · ${plan.engine.toUpperCase()}`, 24, h - 24);
    ctx.restore();

  }, [currentTime, cachedImages, getCurrentShot, plan, playerMode]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const target = ratio * totalDuration;
    setCurrentTime(target);
    if (videoElemRef.current && playerMode === 'veo') {
      videoElemRef.current.currentTime = target;
    }
  };

  const submitComment = () => {
    if (!commentText.trim()) return;
    onAddComment(currentTime, commentText.trim(), activeShot?.id);
    setCommentText('');
    setShowCommentBox(false);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Player Frame Header Mode Selector */}
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase text-slate-400">PLAYER ENGINE:</span>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/[0.08] text-xs font-mono">
            <button
              onClick={() => setPlayerMode('canvas')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                playerMode === 'canvas'
                  ? 'bg-[#7a6bff] text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Real-Time Canvas Sequencer</span>
            </button>

            {veoVideoUrl && (
              <button
                onClick={() => setPlayerMode('veo')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  playerMode === 'veo'
                    ? 'bg-gradient-to-r from-[#7a6bff] to-[#e86bd2] text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Veo 3 AI Video Output</span>
              </button>
            )}
          </div>
        </div>

        {/* Aspect Ratio Badge */}
        <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-[#00f0ff]">
          {aspectRatio}
        </span>
      </div>

      {/* Main Screen Player Frame */}
      <div
        ref={containerRef}
        className="relative w-full rounded-2xl overflow-hidden bg-black/95 border border-white/[0.08] shadow-2xl flex items-center justify-center"
        style={{
          aspectRatio: aspectRatio === '9:16' ? '9/16' : aspectRatio === '1:1' ? '1/1' : '16/9',
          maxHeight: '680px'
        }}
      >
        {playerMode === 'veo' && veoVideoUrl ? (
          <video
            ref={videoElemRef}
            src={veoVideoUrl}
            playsInline
            muted={isMuted}
            loop
            onTimeUpdate={handleNativeTimeUpdate}
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-full h-full object-contain cursor-pointer"
          />
        ) : (
          <canvas
            ref={canvasRef}
            width={aspectRatio === '9:16' ? 720 : 1280}
            height={aspectRatio === '9:16' ? 1280 : 720}
            className="w-full h-full object-contain cursor-pointer"
            onClick={() => setIsPlaying(!isPlaying)}
          />
        )}

        {/* Top Floating Badge: Active Mode & Shot Info */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/[0.1] text-xs font-mono text-slate-200">
          <Film className="w-3.5 h-3.5 text-[#7a6bff]" />
          <span>
            {playerMode === 'veo'
              ? 'Veo 3 Fast Preview (720p)'
              : activeShot
              ? `Shot #${activeShot.index.toString().padStart(2, '0')} · ${activeShot.camera?.move.replace('_', ' ').toUpperCase()}`
              : 'Procedural Sequencer'}
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-[#00f0ff]">{activeShot ? activeShot.summary : ''}</span>
        </div>

        {/* Big Centered Play Button Overlay when paused */}
        {!isPlaying && (
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#7a6bff]/90 hover:bg-[#7a6bff] text-white flex items-center justify-center shadow-xl shadow-[#7a6bff]/40 hover:scale-110 transition-all cursor-pointer z-20"
          >
            <Play className="w-7 h-7 translate-x-0.5 fill-current" />
          </button>
        )}
      </div>

      {/* Scrubbable Timeline & Transport Controls */}
      <div className="flex flex-col gap-2.5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
        {/* Scrubber Bar */}
        <div className="relative flex flex-col gap-1">
          <div
            onClick={handleSeek}
            className="relative w-full h-7 bg-white/[0.06] rounded-lg overflow-hidden cursor-pointer group flex items-center"
          >
            {shots.map((shot) => {
              const leftPercent = (shot.start_s / totalDuration) * 100;
              const widthPercent = ((shot.end_s - shot.start_s) / totalDuration) * 100;
              const isCurrent = activeShot?.id === shot.id;

              return (
                <div
                  key={shot.id}
                  style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                  className={`absolute h-full border-r border-black/40 flex items-center justify-center px-1 transition-colors ${
                    isCurrent ? 'bg-[#7a6bff]/30' : 'hover:bg-white/[0.1]'
                  }`}
                  title={`Shot ${shot.index}: ${shot.summary} (${shot.start_s}s - ${shot.end_s}s)`}
                >
                  <span className="text-[10px] font-mono text-slate-400 truncate opacity-60 group-hover:opacity-100">
                    #{shot.index}
                  </span>
                </div>
              );
            })}

            {/* Current progress fill */}
            <div
              style={{ width: `${(currentTime / totalDuration) * 100}%` }}
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#7a6bff] to-[#e86bd2] opacity-40 pointer-events-none"
            />

            {/* Scrubber Playhead Thumb */}
            <div
              style={{ left: `${(currentTime / totalDuration) * 100}%` }}
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] pointer-events-none z-10"
            />

            {/* Comment Pointers */}
            {comments.map((c) => (
              <div
                key={c.id}
                style={{ left: `${(c.time_s / totalDuration) * 100}%` }}
                className="absolute top-1 w-2.5 h-2.5 -translate-x-1/2 rounded-full bg-amber-400 border border-black shadow-sm z-20 cursor-pointer"
                title={`Note at ${c.time_s.toFixed(1)}s by ${c.author}: ${c.text}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <span className="text-slate-600">Click timeline to scrub & review</span>
            <span>{formatTime(totalDuration)}</span>
          </div>
        </div>

        {/* Transport Toolbar */}
        <div className="flex items-center justify-between gap-4 pt-1 border-t border-white/[0.04]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg bg-[#7a6bff] hover:bg-[#6c5be8] text-white transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 translate-x-0.5 fill-current" />}
            </button>
            <button
              onClick={() => {
                setCurrentTime(0);
                if (videoElemRef.current) videoElemRef.current.currentTime = 0;
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
              title="Restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-1 text-xs font-mono text-slate-400 ml-2">
              {[0.5, 1, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    playbackSpeed === speed ? 'bg-white/[0.1] text-white font-bold' : 'hover:text-slate-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsPlaying(false);
                setShowCommentBox(!showCommentBox);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Add Note at {formatTime(currentTime)}</span>
            </button>

            {/* Download / Export Button */}
            {playerMode === 'veo' && veoVideoUrl ? (
              <a
                href={veoVideoUrl}
                download={`reelmimic-${plan.title.replace(/\s+/g, '-').toLowerCase()}-veo3.mp4`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-[#7a6bff] to-[#e86bd2] text-white hover:opacity-90 shadow-md transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Veo MP4</span>
              </a>
            ) : (
              <button
                onClick={() => {
                  const canvas = canvasRef.current;
                  if (!canvas) return;
                  const link = document.createElement('a');
                  link.download = `reelmimic-${plan.title.replace(/\s+/g, '-').toLowerCase()}-preview.png`;
                  link.href = canvas.toDataURL('image/png');
                  link.click();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.06] text-slate-300 hover:text-white hover:bg-white/[0.1] border border-white/[0.08] transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Snapshot</span>
              </button>
            )}
          </div>
        </div>

        {/* Timestamped Comment Input Drawer */}
        {showCommentBox && (
          <div className="mt-2 p-3 rounded-lg bg-[#0f172a] border border-amber-500/30 flex flex-col gap-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs text-amber-300">
              <span className="font-medium">Leave Note for AI Director at {formatTime(currentTime)}</span>
              <span className="font-mono text-slate-400">Linked to Shot #{activeShot?.index || '1'}</span>
            </div>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="e.g. Speed up the transition cut here, or dial down the camera tilt..."
              className="w-full h-16 p-2 rounded-md bg-black/40 border border-white/[0.1] text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCommentBox(false)}
                className="px-2.5 py-1 rounded text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={submitComment}
                className="px-3 py-1 rounded text-xs font-medium bg-amber-500 hover:bg-amber-400 text-black transition-colors cursor-pointer"
              >
                Submit Note to Director
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Timeline Comments List */}
      {comments.length > 0 && (
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-2 text-xs font-medium text-slate-300">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>Timeline Review Notes ({comments.length})</span>
          </div>
          <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
            {comments.map((comm) => (
              <div
                key={comm.id}
                onClick={() => {
                  setCurrentTime(comm.time_s);
                  if (videoElemRef.current) videoElemRef.current.currentTime = comm.time_s;
                }}
                className="flex items-start justify-between gap-3 p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] cursor-pointer text-xs transition-colors"
              >
                <div className="flex items-baseline gap-2">
                  <span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-amber-400/10 text-amber-300">
                    {formatTime(comm.time_s)}
                  </span>
                  <span className="text-slate-200">{comm.text}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">
                  {comm.author}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
