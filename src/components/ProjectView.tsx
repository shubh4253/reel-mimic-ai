import React, { useState } from 'react';
import { Project, Lang, Stage } from '../types/index.ts';
import { t } from '../i18n.ts';
import { ReferenceBreakdown } from './ReferenceBreakdown.tsx';
import { PlanReview } from './PlanReview.tsx';
import { ProductionPipeline } from './ProductionPipeline.tsx';
import { VideoPlayer } from './VideoPlayer.tsx';
import { ConversationSidebar } from './ConversationSidebar.tsx';
import { RevisionConsole } from './RevisionConsole.tsx';
import { ArrowLeft, Check, Sparkles, AlertCircle, Play, Layers, Film, Scan, X, Sliders, ShieldCheck } from 'lucide-react';

interface ProjectViewProps {
  project: Project;
  lang: Lang;
  onBack: () => void;
  onApprovePlan: (projectId: string) => void;
  onSendMessage: (projectId: string, message: string, shotTag?: string) => void;
  onAddComment: (projectId: string, time: number, text: string, shotId?: string) => void;
  onModifyPlan: (projectId: string, instruction: string, targetShotId?: string, aspectRatio?: '16:9' | '9:16') => Promise<void>;
  onGenerateVeoVideo: (projectId: string, prompt: string, aspectRatio: '16:9' | '9:16') => Promise<void>;
  isChatProcessing?: boolean;
  isModifying?: boolean;
  isGeneratingVeo?: boolean;
  veoProgressText?: string;
  veoVideoUrl?: string;
}

export const ProjectView: React.FC<ProjectViewProps> = ({
  project,
  lang,
  onBack,
  onApprovePlan,
  onSendMessage,
  onAddComment,
  onModifyPlan,
  onGenerateVeoVideo,
  isChatProcessing,
  isModifying = false,
  isGeneratingVeo = false,
  veoProgressText,
  veoVideoUrl
}) => {
  const defaultTab = project.stage === 'done'
    ? 'result'
    : project.stage === 'producing' || project.stage === 'critiquing'
    ? 'pipe'
    : project.stage === 'plan_review' || project.stage === 'planning'
    ? 'plan'
    : 'ref';

  const [activeTab, setActiveTab] = useState<'ref' | 'plan' | 'pipe' | 'result'>(defaultTab);
  const [selectedShotForChat, setSelectedShotForChat] = useState<string>('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const steps = [
    { id: 'ref', label: t('stepRef', lang), done: !!project.report },
    { id: 'style', label: t('stepDecon', lang), done: !!project.report },
    { id: 'plan', label: t('stepPlan', lang), done: project.stage !== 'new' && project.stage !== 'analyzing' },
    { id: 'prod', label: t('stepProd', lang), done: project.stage === 'producing' || project.stage === 'done' },
    { id: 'result', label: t('stepResult', lang), done: project.stage === 'done' }
  ];

  const currentVeoUrl = veoVideoUrl || project.final_video_url;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Top Header / Breadcrumb */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('backToProjects', lang)}</span>
          </button>

          {/* Current Stage Indicator */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7a6bff]/10 border border-[#7a6bff]/30 text-xs font-mono text-[#a59bff]">
              <span className={`w-2 h-2 rounded-full ${project.stage === 'done' ? 'bg-emerald-400' : 'bg-[#7a6bff] animate-pulse'}`} />
              <span>{project.stage.toUpperCase()}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            {project.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
            {project.brief}
          </p>
        </div>
      </div>

      {/* 5-Step Progress Track */}
      <div className="grid grid-cols-5 gap-2 p-1.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
        {steps.map((st, i) => (
          <div
            key={st.id}
            className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-xs font-medium transition-colors ${
              st.done
                ? 'bg-emerald-500/10 text-emerald-300 font-mono'
                : 'text-slate-500 font-mono opacity-60'
            }`}
          >
            {st.done ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <span className="text-[10px]">0{i + 1}</span>
            )}
            <span className="truncate">{st.label}</span>
          </div>
        ))}
      </div>

      {/* Natural Language Revision & Veo 3 Studio Console */}
      {project.plan && (
        <RevisionConsole
          plan={project.plan}
          lang={lang}
          onModifyPlan={(instruction, targetShotId, aspectRatio) =>
            onModifyPlan(project.id, instruction, targetShotId, aspectRatio)
          }
          onGenerateVeoVideo={(prompt, aspectRatio) =>
            onGenerateVeoVideo(project.id, prompt, aspectRatio)
          }
          isModifying={isModifying}
          isGeneratingVeo={isGeneratingVeo}
          veoProgressText={veoProgressText}
          selectedShotId={selectedShotForChat}
          onClearSelectedShot={() => setSelectedShotForChat('')}
        />
      )}

      {/* Main Split Grid: Views on Left (65%), AI Director & Logs on Right (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Studio Views */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Studio Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('ref')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'ref'
                  ? 'bg-[#7a6bff] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Scan className="w-4 h-4" />
              <span>{t('tabRef', lang)}</span>
            </button>

            {project.plan && (
              <button
                onClick={() => setActiveTab('plan')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'plan'
                    ? 'bg-[#7a6bff] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>{t('tabPlan', lang)}</span>
                {project.stage === 'plan_review' && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
            )}

            {project.pipeline && (
              <button
                onClick={() => setActiveTab('pipe')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'pipe'
                    ? 'bg-[#7a6bff] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{t('tabPipe', lang)}</span>
              </button>
            )}

            {project.plan && (
              <button
                onClick={() => setActiveTab('result')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'result'
                    ? 'bg-[#7a6bff] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Play className="w-4 h-4" />
                <span>{t('tabResult', lang)}</span>
                {project.stage === 'done' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </button>
            )}
          </div>

          {/* Active Tab Panel */}
          <div className="flex flex-col gap-6">
            {activeTab === 'ref' && project.report && (
              <ReferenceBreakdown
                report={project.report}
                referenceUrl={project.reference_src}
                referenceName={project.reference_name}
                lang={lang}
              />
            )}

            {activeTab === 'plan' && project.plan && (
              <PlanReview
                plan={project.plan}
                lang={lang}
                onApprove={() => onApprovePlan(project.id)}
                isApproved={project.stage !== 'plan_review' && project.stage !== 'planning'}
                onSelectShotForFeedback={(shotId) => setSelectedShotForChat(shotId)}
                onZoomImage={(url) => setLightboxImage(url)}
              />
            )}

            {activeTab === 'pipe' && project.pipeline && (
              <ProductionPipeline
                pipeline={project.pipeline}
                lang={lang}
                onZoomImage={(url) => setLightboxImage(url)}
              />
            )}

            {activeTab === 'result' && project.plan && (
              <VideoPlayer
                plan={project.plan}
                shots={project.plan.shots}
                duration={project.plan.format.duration_s}
                comments={project.comments}
                onAddComment={(time, text, shotId) => onAddComment(project.id, time, text, shotId)}
                aspectRatio={project.plan.format.aspect_ratio}
                veoVideoUrl={currentVeoUrl}
              />
            )}
          </div>
        </div>

        {/* Right Column: AI Director & Agent Logs Sidebar */}
        <div className="lg:col-span-4 sticky top-20 h-[720px]">
          <ConversationSidebar
            chat={project.chat}
            logs={project.logs}
            plan={project.plan}
            selectedShotId={selectedShotForChat}
            onSelectShot={setSelectedShotForChat}
            onSendMessage={(msg, shotTag) => onSendMessage(project.id, msg, shotTag)}
            isProcessing={isChatProcessing}
          />
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-white/[0.1] shadow-2xl">
            <img
              src={lightboxImage}
              alt="Zoomed Asset"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
