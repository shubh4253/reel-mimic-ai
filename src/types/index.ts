export type Lang = 'en' | 'zh-TW' | 'zh-CN';

export type Stage =
  | 'new'
  | 'analyzing'
  | 'styled'
  | 'planning'
  | 'plan_review'
  | 'producing'
  | 'needs_input'
  | 'critiquing'
  | 'revising'
  | 'done'
  | 'error';

export type StyleEngineId =
  | 'hyperframes'
  | 'painted-animation'
  | 'crayon-book'
  | 'pixel-art'
  | 'paper-cutout'
  | 'whiteboard'
  | 'anime-cel';

export interface StyleEngineInfo {
  id: StyleEngineId;
  name: string;
  nameZh: string;
  category: string;
  description: string;
  aesthetic: string;
  bestFor: string;
  color: string;
  tagline: string;
}

export interface CameraMove {
  move: 'static' | 'pan_left' | 'pan_right' | 'tilt_up' | 'tilt_down' | 'dolly_in' | 'dolly_out' | 'tracking' | 'whip_pan' | 'dutch_angle';
  lens?: string;
  pace?: 'slow' | 'medium' | 'fast' | 'whip';
  description?: string;
}

export interface Shot {
  id: string;
  index: number;
  start_s: number;
  end_s: number;
  duration_s: number;
  summary: string;
  action: string;
  camera: CameraMove;
  camera_note?: string;
  ref_shot?: number | string;
  ref_what?: string;
  transition_in?: string;
  transition_out?: string;
  reads?: string[]; // what the audience reads/feels from this shot
  text_overlay?: { text: string; position?: 'center' | 'bottom' | 'top' }[];
  assets?: string[];
  visual_prompt?: string;
  frame_url?: string;
  rendered_frame?: string;
  status?: 'queued' | 'rendering' | 'reviewing' | 'passed' | 'revising';
  critic_score?: number;
  critic_notes?: string;
}

export interface CharacterSheet {
  id: string;
  name: string;
  role: string;
  design: string;
  arc: string;
  color_motif: string;
  image_url: string;
}

export interface StyleFrame {
  id: string;
  title: string;
  timestamp: string;
  medium: string;
  palette: string[];
  image_url: string;
  description: string;
}

export interface DeconstructionReport {
  video: {
    duration: number;
    width: number;
    height: number;
    fps: number;
    aspect_ratio: '16:9' | '9:16' | '1:1' | '4:3';
  };
  audio: {
    bpm: number;
    present: boolean;
    has_vocals: boolean;
    mood: string;
  };
  pacing: {
    shot_count: number;
    mean_shot_s: number;
    fastest_shot_s: number;
    longest_shot_s: number;
    tempo: 'rapid' | 'moderate' | 'cinematic' | 'deliberate';
  };
  cinematography: {
    camera_movement_distribution: Record<string, number>; // e.g. { pan: 35, dolly: 25, static: 40 }
    framing_distribution: Record<string, number>; // e.g. { close_up: 45, wide: 30, medium: 25 }
    transitions: Record<string, number>;
  };
  look: {
    palette: string[];
    color_arc: string;
    lighting: string;
    medium: string;
  };
  detected_engine: StyleEngineId;
  engine_confidence: number;
  engine_rationale: string;
}

export interface PlanView {
  title: string;
  logline: string;
  brief: string;
  style: string;
  engine: StyleEngineId;
  format: {
    width: number;
    height: number;
    duration_s: number;
    aspect_ratio: '16:9' | '9:16' | '1:1';
  };
  look: {
    palette: string[];
    medium: string;
    color_arc: string;
    grain_or_texture?: string;
  };
  borrowed_from_reference: string[];
  music: {
    bpm: number;
    genre: string;
    mood: string;
    lyrics_or_vo?: string[];
  };
  characters: CharacterSheet[];
  style_frames: StyleFrame[];
  shots: Shot[];
  open_questions: string[];
  changelog: string[];
}

export interface ChunkProgress {
  id: string;
  name: string;
  shots: string[];
  state: 'queued' | 'building' | 'reviewing' | 'fixing' | 'passed';
  round: number;
  before_frame?: string;
  after_frame?: string;
  critic_critique?: string;
}

export interface PipelineProgress {
  phase: 'setup' | 'cast' | 'shots' | 'assemble' | 'final';
  active_agent: string;
  cast_passed: boolean;
  chunks: Record<string, ChunkProgress>;
  current_round: number;
  max_rounds: number;
  total_shots_completed: number;
  total_shots_count: number;
}

export interface TimelineComment {
  id: string;
  time_s: number;
  shot_id?: string;
  author: string;
  text: string;
  created_at: string;
  resolved?: boolean;
}

export interface AgentLogEntry {
  id: string;
  ts: string;
  who: 'Director' | 'Cinematographer' | 'Art Director' | 'Sound Designer' | 'Critic' | 'System';
  type: 'thinking' | 'tool' | 'review' | 'fix' | 'success' | 'warn';
  text: string;
  detail?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent' | 'builder' | 'critic' | 'system';
  sender_name?: string;
  text: string;
  ts: string;
  shot_id?: string;
  time_s?: number;
  notes?: { t: number; text: string }[];
}

export interface Project {
  id: string;
  title: string;
  brief: string;
  lang: Lang;
  stage: Stage;
  reference_type: 'preset' | 'file' | 'url';
  reference_src: string;
  reference_name: string;
  created_at: string;
  updated_at: string;
  report?: DeconstructionReport;
  plan?: PlanView;
  pipeline?: PipelineProgress;
  logs: AgentLogEntry[];
  comments: TimelineComment[];
  chat: ChatMessage[];
  final_video_url?: string;
}
