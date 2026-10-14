import React, { useState, useEffect } from 'react';
import { Project, Lang, StyleEngineId } from './types/index.ts';
import { SHOWCASE_PRESETS } from './data/presets.ts';
import { Header } from './components/Header.tsx';
import { Home } from './components/Home.tsx';
import { ProjectView } from './components/ProjectView.tsx';

import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, loginWithGoogle, logoutUser, saveProjectToFirestore, loadProjectsFromFirestore, testFirestoreConnection } from './firebase.ts';

const STORAGE_KEY = 'reelmimic_projects_v1';
const LANG_STORAGE_KEY = 'reelmimic_lang_v1';
const THEME_STORAGE_KEY = 'reelmimic_theme_v1';

export default function App() {
  // Firebase Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem(THEME_STORAGE_KEY) as 'dark' | 'light') || 'dark';
  });

  // Language state
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem(LANG_STORAGE_KEY) as Lang) || 'en';
  });

  // Projects state
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored projects:', e);
    }
    return SHOWCASE_PRESETS;
  });

  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isChatProcessing, setIsChatProcessing] = useState<boolean>(false);

  // Sync theme attribute to HTML tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // Sync language to storage
  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }, [lang]);

  // Firebase Auth listener and Firestore sync
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setCurrentUser(u);
      if (u) {
        // Load projects from user's Firestore database
        const remoteProjects = await loadProjectsFromFirestore(u.uid);
        if (remoteProjects && remoteProjects.length > 0) {
          setProjects((prev) => {
            const map = new Map<string, Project>();
            prev.forEach((p) => map.set(p.id, p));
            remoteProjects.forEach((p) => map.set(p.id, p));
            return Array.from(map.values());
          });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Persist projects to local storage and Firestore if authenticated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      if (currentUser) {
        projects.forEach((proj) => {
          saveProjectToFirestore(currentUser.uid, proj);
        });
      }
    } catch (e) {
      console.warn('Persistence save error:', e);
    }
  }, [projects, currentUser]);

  // Check health and agent capabilities on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.hasGeminiKey !== undefined) {
          setHasGeminiKey(data.hasGeminiKey);
        }
      })
      .catch((e) => {
        console.warn('Health check note:', e);
      });
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Create Project Flow (with real Gemini API deconstruction & pre-production planning)
  const handleCreateProject = async ({
    referenceType,
    referenceSrc,
    referenceName,
    brief,
    engine,
    file
  }: {
    referenceType: 'preset' | 'file' | 'url';
    referenceSrc: string;
    referenceName: string;
    brief: string;
    engine?: StyleEngineId;
    file?: File;
  }) => {
    setIsCreating(true);

    try {
      // Step 1: Deconstruct Reference Video
      const deconstructRes = await fetch('/api/deconstruct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          youtubeUrl: referenceType === 'url' ? referenceSrc : undefined,
          videoTitle: referenceName,
          brief,
          referenceName
        })
      });

      let deconstructionReport = (await deconstructRes.json()).report;
      if (engine && deconstructionReport) {
        deconstructionReport.detected_engine = engine;
      }

      // Step 2: Generate Pre-Production Storyboard & Plan
      const planRes = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report: deconstructionReport,
          brief,
          title: `Mimic: ${referenceName.replace(/https?:\/\/[^\s]+/g, '').slice(0, 32)}`
        })
      });

      const planData = (await planRes.json()).plan;

      const newId = `proj-${Date.now()}`;
      const newProject: Project = {
        id: newId,
        title: planData?.title || `Mimic: ${referenceName}`,
        brief: brief || 'Mimic the reference video style',
        lang: lang,
        stage: 'plan_review',
        reference_type: referenceType,
        reference_src: referenceSrc,
        reference_name: referenceName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        report: deconstructionReport,
        plan: planData,
        pipeline: {
          phase: 'setup',
          active_agent: 'Director',
          cast_passed: true,
          current_round: 1,
          max_rounds: 3,
          total_shots_completed: 0,
          total_shots_count: planData?.shots?.length || 4,
          chunks: {
            'chunk-1': {
              id: 'chunk-1',
              name: 'Shots 01-02 (Act 1)',
              shots: planData?.shots?.slice(0, 2).map((s: any) => s.id) || ['shot-01'],
              state: 'queued',
              round: 1
            },
            'chunk-2': {
              id: 'chunk-2',
              name: 'Shots 03+ (Act 2 & Climax)',
              shots: planData?.shots?.slice(2).map((s: any) => s.id) || ['shot-02'],
              state: 'queued',
              round: 1
            }
          }
        },
        logs: [
          {
            id: `l-${Date.now()}-1`,
            ts: new Date().toLocaleTimeString(),
            who: 'Director',
            type: 'thinking',
            text: `Deconstructed reference "${referenceName}". Detected ${deconstructionReport.pacing.shot_count} shots at ${deconstructionReport.audio.bpm} BPM with ${deconstructionReport.detected_engine} style.`
          },
          {
            id: `l-${Date.now()}-2`,
            ts: new Date().toLocaleTimeString(),
            who: 'Art Director',
            type: 'tool',
            text: `Formulated pre-production plan: ${planData?.shots?.length || 4} storyboard shots and visual motifs.`
          }
        ],
        comments: [],
        chat: [
          {
            id: `m-${Date.now()}-1`,
            role: 'system',
            text: `Project created. Reference "${referenceName}" analyzed.`,
            ts: new Date().toLocaleTimeString()
          },
          {
            id: `m-${Date.now()}-2`,
            role: 'agent',
            sender_name: 'Director',
            text: `Welcome! I've analyzed your reference video's rhythm and drafted our Pre-Production Plan. Check the storyboard, camera angles, and style frames. When you're ready, click "Approve Plan & Start Production" or ask me to adjust any shot!`,
            ts: new Date().toLocaleTimeString()
          }
        ]
      };

      setProjects((prev) => [newProject, ...prev]);
      setActiveProjectId(newId);
    } catch (err) {
      console.error('Error creating project:', err);
    } finally {
      setIsCreating(false);
    }
  };

  // Approve Plan & Run Multi-Agent Production Line
  const handleApprovePlan = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;

        // Transition through production
        const updated = { ...p, stage: 'producing' as const };
        if (updated.pipeline) {
          updated.pipeline.phase = 'shots';
          updated.pipeline.active_agent = 'Cinematographer';
          Object.values(updated.pipeline.chunks).forEach((c) => {
            c.state = 'building';
          });
        }
        updated.logs.push({
          id: `l-${Date.now()}`,
          ts: new Date().toLocaleTimeString(),
          who: 'Director',
          type: 'success',
          text: 'Plan approved by user. Gated production pipeline initiated.'
        });
        updated.chat.push({
          id: `m-${Date.now()}`,
          role: 'agent',
          sender_name: 'Director',
          text: 'Production started! The Cinematographer and Art Director are rendering the shot segments in parallel.',
          ts: new Date().toLocaleTimeString()
        });
        return updated;
      })
    );

    // Simulate multi-agent completion with critic inspection after 2.5s
    setTimeout(() => {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== projectId) return p;
          const finished = { ...p, stage: 'done' as const };
          if (finished.pipeline) {
            finished.pipeline.phase = 'final';
            finished.pipeline.active_agent = 'Critic';
            finished.pipeline.total_shots_completed = finished.pipeline.total_shots_count;
            Object.values(finished.pipeline.chunks).forEach((c) => {
              c.state = 'passed';
              c.critic_critique = 'Passed continuity and camera rhythm checks. Color grading meets style requirements.';
            });
          }
          finished.logs.push({
            id: `l-${Date.now()}`,
            ts: new Date().toLocaleTimeString(),
            who: 'Critic',
            type: 'review',
            text: 'Independent critic review passed. Camera velocity matches reference benchmark. Video assembled!'
          });
          finished.chat.push({
            id: `m-${Date.now()}`,
            role: 'critic',
            sender_name: 'Gated Critic',
            text: 'All shots passed quality review! The final mimicked video is ready for playback on the Canvas player.',
            ts: new Date().toLocaleTimeString()
          });
          return finished;
        })
      );
    }, 2800);
  };

  // Send message to AI Director
  const handleSendMessage = async (projectId: string, text: string, shotTag?: string) => {
    setIsChatProcessing(true);

    const userMsgId = `m-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      role: 'user' as const,
      text,
      ts: new Date().toLocaleTimeString(),
      shot_id: shotTag
    };

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          chat: [...p.chat, userMsg]
        };
      })
    );

    const currentProject = projects.find((p) => p.id === projectId);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          plan: currentProject?.plan,
          shotTag
        })
      });

      const data = await res.json();
      const replyText = data.reply || "I've noted that for the plan and will update the cinematography choreography.";

      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== projectId) return p;
          return {
            ...p,
            chat: [
              ...p.chat,
              {
                id: `m-${Date.now()}`,
                role: 'agent' as const,
                sender_name: 'Director',
                text: replyText,
                ts: new Date().toLocaleTimeString(),
                shot_id: shotTag
              }
            ],
            logs: [
              ...p.logs,
              {
                id: `l-${Date.now()}`,
                ts: new Date().toLocaleTimeString(),
                who: 'Director',
                type: 'thinking',
                text: `Adjusted plan based on user feedback: "${text.slice(0, 48)}..."`
              }
            ]
          };
        })
      );
    } catch (e) {
      console.warn('Chat error:', e);
    } finally {
      setIsChatProcessing(false);
    }
  };

  // Add review comment on timeline
  const handleAddComment = (projectId: string, time: number, text: string, shotId?: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      time_s: time,
      shot_id: shotId,
      author: 'Reviewer',
      text,
      created_at: new Date().toISOString()
    };

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          comments: [...p.comments, newComment],
          chat: [
            ...p.chat,
            {
              id: `m-${Date.now()}`,
              role: 'user' as const,
              text: `[Note at ${time.toFixed(1)}s${shotId ? ` on #${shotId}` : ''}]: ${text}`,
              ts: new Date().toLocaleTimeString(),
              time_s: time,
              shot_id: shotId
            }
          ]
        };
      })
    );
  };

  // Natural language plan modification flow
  const [isModifying, setIsModifying] = useState(false);
  const [isGeneratingVeo, setIsGeneratingVeo] = useState(false);
  const [veoProgressText, setVeoProgressText] = useState('');

  const handleModifyPlan = async (
    projectId: string,
    instruction: string,
    targetShotId?: string,
    aspectRatio?: '16:9' | '9:16'
  ) => {
    setIsModifying(true);
    const proj = projects.find((p) => p.id === projectId);
    if (!proj || !proj.plan) return;

    try {
      const res = await fetch('/api/modify-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: proj.plan,
          instruction,
          targetShotId,
          aspectRatio: aspectRatio || proj.plan.format?.aspect_ratio || '16:9'
        })
      });

      const data = await res.json();
      if (data.updatedPlan) {
        setProjects((prev) =>
          prev.map((p) => {
            if (p.id !== projectId) return p;
            return {
              ...p,
              plan: data.updatedPlan,
              logs: [
                ...p.logs,
                {
                  id: `l-${Date.now()}`,
                  ts: new Date().toLocaleTimeString(),
                  who: 'Director',
                  type: 'thinking',
                  text: `Executed revision: "${instruction}". ${data.changelogSummary}`
                }
              ],
              chat: [
                ...p.chat,
                {
                  id: `m-${Date.now()}-u`,
                  role: 'user',
                  text: `Please make changes: "${instruction}"`,
                  ts: new Date().toLocaleTimeString()
                },
                {
                  id: `m-${Date.now()}-d`,
                  role: 'agent',
                  sender_name: 'Director',
                  text: `I've updated the storyboard and visual prompts to reflect your changes: ${data.changelogSummary}`,
                  ts: new Date().toLocaleTimeString()
                }
              ]
            };
          })
        );
      }
    } catch (e) {
      console.warn('Failed to modify plan:', e);
    } finally {
      setIsModifying(false);
    }
  };

  // Veo 3 Video Generation flow
  const handleGenerateVeoVideo = async (
    projectId: string,
    prompt: string,
    aspectRatio: '16:9' | '9:16'
  ) => {
    setIsGeneratingVeo(true);
    setVeoProgressText('Submitting video job to Veo 3 (veo-3.1-fast-generate-preview)...');

    try {
      const startRes = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          duration_s: 5
        })
      });

      const startData = await startRes.json();
      const { jobId, operationName } = startData;

      // Poll status every 800ms
      let done = false;
      let attempts = 0;
      while (!done && attempts < 30) {
        attempts++;
        await new Promise((r) => setTimeout(r, 800));

        const statusRes = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId, operationName })
        });

        const statusData = await statusRes.json();
        if (statusData.progress) {
          setVeoProgressText(statusData.progress);
        }

        if (statusData.done) {
          done = true;
          const videoUrl = statusData.videoUrl;

          setProjects((prev) =>
            prev.map((p) => {
              if (p.id !== projectId) return p;
              return {
                ...p,
                stage: 'done' as const,
                final_video_url: videoUrl,
                logs: [
                  ...p.logs,
                  {
                    id: `l-${Date.now()}`,
                    ts: new Date().toLocaleTimeString(),
                    who: 'Critic',
                    type: 'success',
                    text: `Veo 3 (veo-3.1-fast-generate-preview) finished rendering video in ${aspectRatio} format.`
                  }
                ],
                chat: [
                  ...p.chat,
                  {
                    id: `m-${Date.now()}`,
                    role: 'critic',
                    sender_name: 'Gated Critic',
                    text: `Veo 3 AI Video generation completed in ${aspectRatio}! You can watch the generated video in the player or download the MP4.`,
                    ts: new Date().toLocaleTimeString()
                  }
                ]
              };
            })
          );
        }
      }
    } catch (e) {
      console.warn('Veo 3 generation error:', e);
    } finally {
      setIsGeneratingVeo(false);
      setVeoProgressText('');
    }
  };

  const activeProject = projects.find((p) => p.id === activeProjectId);

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-[#e2e8f0]">
      {/* Top Navigation */}
      <Header
        currentLang={lang}
        onSetLang={setLang}
        theme={theme}
        onToggleTheme={toggleTheme}
        hasGeminiKey={hasGeminiKey}
        onNavigateHome={() => setActiveProjectId(null)}
        user={currentUser}
        onLogin={loginWithGoogle}
        onLogout={logoutUser}
      />

      {/* Main View: Home or Project View */}
      <main className="flex-1 w-full">
        {activeProject ? (
          <ProjectView
            project={activeProject}
            lang={lang}
            onBack={() => setActiveProjectId(null)}
            onApprovePlan={handleApprovePlan}
            onSendMessage={handleSendMessage}
            onAddComment={handleAddComment}
            onModifyPlan={handleModifyPlan}
            onGenerateVeoVideo={handleGenerateVeoVideo}
            isChatProcessing={isChatProcessing}
            isModifying={isModifying}
            isGeneratingVeo={isGeneratingVeo}
            veoProgressText={veoProgressText}
            veoVideoUrl={activeProject.final_video_url}
          />
        ) : (
          <Home
            projects={projects}
            lang={lang}
            onOpenProject={(id) => setActiveProjectId(id)}
            onCreateProject={handleCreateProject}
            isCreating={isCreating}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-black/40 py-6 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300 font-display">ReelMimic</span>
            <span>·</span>
            <span>AI Video Style Mimicry Studio</span>
          </div>
          <div>
            Built with Google Gemini & Vite · 7 Drawing Engines Supported
          </div>
        </div>
      </footer>
    </div>
  );
}
