import { StyleEngineInfo, Project, DeconstructionReport, PlanView } from '../types/index.ts';

export const STYLE_ENGINES: StyleEngineInfo[] = [
  {
    id: 'hyperframes',
    name: 'Vector / Motion Graphics',
    nameZh: '向量動態圖形 (HyperFrames)',
    category: 'Motion Design',
    description: 'Crisp geometric vectors, kinetic typography, dynamic layout transitions, and punchy rhythmic zooms.',
    aesthetic: 'Ultra-clean edges, fluid shape morphing, modern bold color blocks, commercial product video feel.',
    bestFor: 'Product launches, explainers, tech reels, upbeat music promos, UI feature showcases.',
    color: '#7a6bff',
    tagline: 'High-energy kinetic motion with surgical timing.'
  },
  {
    id: 'painted-animation',
    name: 'Hand-Painted Watercolor',
    nameZh: '手繪水彩風格 (Painted Animation)',
    category: 'Traditional 2D',
    description: 'Lyrical watercolor washes, pigment granulation on textured paper, bleeding hues, and atmospheric light blooms.',
    aesthetic: 'Ethereal, nostalgic, poetic brush gestures with subtle frame-by-frame organic boiling.',
    bestFor: 'Emotional storytelling, ballad music videos, memory sequences, indie narrative shorts.',
    color: '#38bdf8',
    tagline: 'Delicate wet-on-wet pigments that breathe with life.'
  },
  {
    id: 'crayon-book',
    name: 'Crayon Picture Book',
    nameZh: '蠟筆繪本童趣風格',
    category: 'Illustrated Story',
    description: 'Chunky waxy crayon textures, hand-lettered cards, charmingly naive proportions, and warm paper tooth.',
    aesthetic: 'Playful, heartwarming, tactile warmth with wholesome children’s book charm.',
    bestFor: 'Pet stories, children’s tales, lighthearted comedy, quirky autobiographical vignettes.',
    color: '#fbbf24',
    tagline: 'Warm storybook illustrations full of innocent joy.'
  },
  {
    id: 'pixel-art',
    name: 'Retro 16-Bit Pixel Art',
    nameZh: '復古 16 位元點陣風格',
    category: 'Pixel Animation',
    description: 'Nostalgic pixelated sprites, limited index palettes, dithered gradient skies, and arcade parallax scrolling.',
    aesthetic: 'Retro futuristic, 90s JRPG and arcade nostalgia, rhythmic chiptune synchronization.',
    bestFor: 'Gaming clips, synthwave music videos, cyberpunk shorts, tech lore explainers.',
    color: '#a855f7',
    tagline: 'Crisp pixel grids and timeless arcade nostalgia.'
  },
  {
    id: 'paper-cutout',
    name: 'Paper Cut-Out Stop-Motion',
    nameZh: '剪紙定格偶動畫風格',
    category: 'Stop Motion',
    description: 'Layered construction paper silhouette edges, tactile drop shadows, 12fps stepped motion, and craft textures.',
    aesthetic: 'Handmade artisanal feel, dimensional paper theatre depth, charming mechanical joints.',
    bestFor: 'Folk tales, satirical comedy, artistic festival pieces, educational documentaries.',
    color: '#f97316',
    tagline: 'Tactile paper craft with charming stepped stop-motion.'
  },
  {
    id: 'whiteboard',
    name: 'Whiteboard & Marker Doodle',
    nameZh: '白板速寫塗鴉風格',
    category: 'Minimal Line Art',
    description: 'Dry-erase marker strokes, continuous hand-drawn line art, ink bleed, and dynamic schematic diagrams.',
    aesthetic: 'Spontaneous, clear, energetic brainstorming, minimalist black/color ink on clean slate.',
    bestFor: 'Conceptual pitches, speed-drawing stories, founder journey recaps, academic concepts.',
    color: '#10b981',
    tagline: 'Spontaneous marker strokes that unfold ideas in real time.'
  },
  {
    id: 'anime-cel',
    name: 'Anime Cel Animation',
    nameZh: '日系賽璐珞賽博風格',
    category: 'Cel Animation',
    description: 'Two-tone cel shading, intense dynamic action lines, cinematic Dutch angles, and high-impact keyframing.',
    aesthetic: 'Sharp contour inks, dramatic rim lighting, intense anime kinetic choreography.',
    bestFor: 'Action clips, sports anime montages, epic trailer teasers, dramatic character spotlights.',
    color: '#ec4899',
    tagline: 'High-octane dramatic cel animation with cinematic punch.'
  }
];

export const SHOWCASE_PRESETS: Project[] = [
  {
    id: 'sugar-rush-showcase',
    title: 'Sugar Rush — Neon Kinetic Pop',
    brief: 'A vibrant 58-second pop motion reel about an astronaut craving candy on Mars, vertical 9:16 format with bouncy kinetic cuts.',
    lang: 'en',
    stage: 'done',
    reference_type: 'preset',
    reference_src: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    reference_name: 'Sugar Rush (Original Pop Video)',
    created_at: '2026-10-14T01:00:00Z',
    updated_at: '2026-10-14T01:15:00Z',
    final_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-bright-neon-tunnel-movement-loop-41908-large.mp4',
    report: {
      video: { duration: 58, width: 1080, height: 1920, fps: 30, aspect_ratio: '9:16' },
      audio: { bpm: 128, present: true, has_vocals: true, mood: 'Electric, sugary, energetic pop' },
      pacing: { shot_count: 14, mean_shot_s: 4.1, fastest_shot_s: 1.8, longest_shot_s: 6.2, tempo: 'rapid' },
      cinematography: {
        camera_movement_distribution: { whip_pan: 35, dolly_in: 30, tracking: 25, static: 10 },
        framing_distribution: { close_up: 50, medium: 35, wide: 15 },
        transitions: { whip: 40, cut: 45, zoom: 15 }
      },
      look: {
        palette: ['#FF2A85', '#00F0FF', '#FFE600', '#7A6BFF', '#120024'],
        color_arc: 'High-contrast neon magenta and electric cyan shifting toward warm golden climax.',
        lighting: 'Neon tube rim-light, holographic chromatic aberration',
        medium: 'Vector kinetic motion graphics with particle sparkles'
      },
      detected_engine: 'hyperframes',
      engine_confidence: 96,
      engine_rationale: 'High BPM, precise vector geometric cuts, kinetic typography overlays, and zero hand-drawn grain make HyperFrames the ideal production skill.'
    },
    plan: {
      title: 'Sugar Rush: Mars Confectionery',
      logline: 'An adventurous space explorer breaks protocol on a desolate red planet when emergency sugar cravings unlock an otherworldly candy galaxy.',
      brief: 'Replicate the rhythm, rapid whip pans, and punchy pop cuts of the reference, swapping live dancers for an animated explorer.',
      style: 'HyperFrames Vector Motion Graphics',
      engine: 'hyperframes',
      format: { width: 1080, height: 1920, duration_s: 58, aspect_ratio: '9:16' },
      look: {
        palette: ['#FF2A85', '#00F0FF', '#FFE600', '#7A6BFF', '#090D16'],
        medium: 'Vector motion design with sharp neon glow shaders',
        color_arc: 'Monochromatic red desert opening -> neon cyan spark -> rainbow explosion climax'
      },
      borrowed_from_reference: [
        '128 BPM beat-synced whip cuts',
        '3D rotating typography cards on chorus beat drops',
        'Camera crash-zoom on facial expressions',
        'Split-screen vertical rhythm strips'
      ],
      music: {
        bpm: 128,
        genre: 'Hyperpop / Electro',
        mood: 'Euphoric & bouncy',
        lyrics_or_vo: [
          'Houston, we have a sugar dip',
          'Locking coordinates to the sweet galaxy',
          'Zero gravity, 100% glucose rush!'
        ]
      },
      characters: [
        {
          id: 'char-1',
          name: 'Astro Lou',
          role: 'Protagonist Space Scout',
          design: 'Retro-futuristic bubble helmet with tinted visor displaying neon emoji eyes, sleek white suit with violet stripes.',
          arc: 'Bored rover pilot transformed into ecstatic cosmic confectioner.',
          color_motif: '#00F0FF',
          image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
        },
        {
          id: 'char-2',
          name: 'Gummy Bot',
          role: 'Cosmic Companion',
          design: 'Translucent gelatinous robot emitting pastel glow with floating candy gear cogs inside.',
          arc: 'Dispenses rocket-powered lollipops during the chorus drop.',
          color_motif: '#FF2A85',
          image_url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&auto=format&fit=crop&q=80'
        }
      ],
      style_frames: [
        {
          id: 'sf-1',
          title: 'Opening Mars Desolation',
          timestamp: '00:00 - 00:08',
          medium: 'Vector landscape with glowing purple dunes',
          palette: ['#120024', '#7A6BFF', '#FF2A85'],
          image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
          description: 'Astro Lou gazes at empty horizon through helmet visor reflecting monotone dust.'
        },
        {
          id: 'sf-2',
          title: 'The Glucose Gateway',
          timestamp: '00:24 - 00:36',
          medium: 'Kinetic vector kaleidoscope',
          palette: ['#00F0FF', '#FFE600', '#FF2A85'],
          image_url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80',
          description: 'Neon candy warp tunnel accelerating with kinetic typography dancing on the beat.'
        }
      ],
      shots: [
        {
          id: 'shot-01',
          index: 1,
          start_s: 0,
          end_s: 4.2,
          duration_s: 4.2,
          summary: 'Astro Lou helmet close-up in Martian dust storm',
          action: 'Lou wipes dust from helmet visor, blinking tired eyes at HUD alert: "GLUCOSE CRITICAL".',
          camera: { move: 'dolly_in', pace: 'slow', lens: '50mm portrait' },
          camera_note: 'Slow creep toward visor reflection',
          ref_shot: 1,
          ref_what: 'Opening eye reflection match',
          transition_out: 'whip_pan',
          reads: ['isolation', 'weariness', 'sudden curiosity'],
          text_overlay: [{ text: 'ENERGY: 2%', position: 'top' }],
          status: 'passed',
          rendered_frame: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80'
        },
        {
          id: 'shot-02',
          index: 2,
          start_s: 4.2,
          end_s: 7.8,
          duration_s: 3.6,
          summary: 'Gummy Bot emerges from rover storage bay',
          action: 'Translucent gelatinous bot pops out holding glowing radioactive gummy bear.',
          camera: { move: 'tilt_up', pace: 'medium' },
          ref_shot: 2,
          transition_in: 'whip_pan',
          transition_out: 'cut',
          reads: ['comic relief', 'intrigue'],
          status: 'passed',
          rendered_frame: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80'
        },
        {
          id: 'shot-03',
          index: 3,
          start_s: 7.8,
          end_s: 12.0,
          duration_s: 4.2,
          summary: 'The sugar bite & neural shockwave',
          action: 'Lou consumes gummy bear; helmet visor flashes rainbow neon; gravity starts lifting.',
          camera: { move: 'dolly_out', pace: 'fast' },
          ref_shot: 3,
          transition_in: 'cut',
          transition_out: 'whip_pan',
          reads: ['electrifying rush', 'tempo pickup'],
          status: 'passed',
          rendered_frame: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
        },
        {
          id: 'shot-04',
          index: 4,
          start_s: 12.0,
          end_s: 17.5,
          duration_s: 5.5,
          summary: 'Chorus Beat Drop: Neon Candy Hyperspace',
          action: 'Mars explodes into floating giant peppermint rings, sour belt highways, and dancing star clusters.',
          camera: { move: 'tracking', pace: 'fast' },
          ref_shot: 4,
          transition_in: 'whip_pan',
          transition_out: 'cut',
          reads: ['pure euphoria', 'visual climax'],
          text_overlay: [{ text: 'SUGAR RUSH', position: 'center' }],
          status: 'passed',
          rendered_frame: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80'
        }
      ],
      open_questions: [],
      changelog: ['Increased shot 04 speed to sync with 128 BPM bass drop', 'Adjusted Lou visor hue from amber to cyan']
    },
    pipeline: {
      phase: 'final',
      active_agent: 'Critic',
      cast_passed: true,
      current_round: 1,
      max_rounds: 3,
      total_shots_completed: 4,
      total_shots_count: 4,
      chunks: {
        'chunk-1': { id: 'chunk-1', name: 'Shots 01-02 (Pre-Chorus)', shots: ['shot-01', 'shot-02'], state: 'passed', round: 1 },
        'chunk-2': { id: 'chunk-2', name: 'Shots 03-04 (Chorus Drop)', shots: ['shot-03', 'shot-04'], state: 'passed', round: 1 }
      }
    },
    logs: [
      { id: 'l1', ts: '01:02:10', who: 'Director', type: 'thinking', text: 'Analyzing reference audio waveform: sharp transients detected at 128 BPM. Planning whip pans at bar breaks.' },
      { id: 'l2', ts: '01:04:30', who: 'Art Director', type: 'tool', text: 'Generated 2 character model sheets and 2 key style frames in HyperFrames vector style.' },
      { id: 'l3', ts: '01:08:45', who: 'Cinematographer', type: 'review', text: 'Rendered Shot 01 (Visor Close-Up). Motion vector conforms to reference camera curve.' },
      { id: 'l4', ts: '01:12:20', who: 'Critic', type: 'success', text: 'Gated inspection passed. Pacing deviation is <0.12s from reference benchmark. Ready for assembly.' }
    ],
    comments: [
      { id: 'c1', time_s: 14.5, author: 'Creative Director', text: 'The typography hit on the bass drop is perfect. Keep the cyan rim light.', created_at: '2026-10-14T01:14:00Z', resolved: true }
    ],
    chat: [
      { id: 'm1', role: 'system', text: 'Project initialized from reference "Sugar Rush (Original Pop Video)". Style engine matched: HyperFrames Vector Motion Graphics.', ts: '01:00:15' },
      { id: 'm2', role: 'agent', sender_name: 'Director', text: 'I broke down the reference video: 14 shots, 128 BPM, heavy whip pan transitions. I drafted our pre-production plan with Astro Lou on Mars. Take a look at the storyboard!', ts: '01:01:20' }
    ]
  },
  {
    id: 'sunshine-boy-showcase',
    title: 'Sunshine Boy — Poetic Watercolor',
    brief: 'A gentle 63-second watercolor narrative about a lighthouse keeper tending sunflowers on a foggy coastal cliff.',
    lang: 'en',
    stage: 'done',
    reference_type: 'preset',
    reference_src: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    reference_name: 'Sunshine Boy (Indie Ballad)',
    created_at: '2026-10-14T00:30:00Z',
    updated_at: '2026-10-14T00:52:00Z',
    final_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-hand-painting-with-watercolors-43288-large.mp4',
    report: {
      video: { duration: 63, width: 1920, height: 1080, fps: 24, aspect_ratio: '16:9' },
      audio: { bpm: 78, present: true, has_vocals: true, mood: 'Contemplative, acoustic, warm' },
      pacing: { shot_count: 9, mean_shot_s: 7.0, fastest_shot_s: 4.5, longest_shot_s: 11.0, tempo: 'deliberate' },
      cinematography: {
        camera_movement_distribution: { dolly_out: 40, pan_right: 35, static: 25 },
        framing_distribution: { wide: 55, medium: 30, close_up: 15 },
        transitions: { cut: 20, zoom: 10, crossfade: 70 }
      },
      look: {
        palette: ['#F59E0B', '#3B82F6', '#D97706', '#E0E7FF', '#1E293B'],
        color_arc: 'Muted cerulean sea fog warming into rich golden sunflower amber',
        lighting: 'Diffused morning coastal mist with soft amber shafts',
        medium: 'Wet-on-wet watercolor with cold-press paper grain'
      },
      detected_engine: 'painted-animation',
      engine_confidence: 98,
      engine_rationale: 'Slow pacing, painterly edge blooms, heavy dissolve transitions, and watercolor pigment textures correspond to the painted-animation engine.'
    },
    plan: {
      title: 'Sunshine Boy: The Cliffside Garden',
      logline: 'An aging keeper on an isolated misty rock transforms harsh ocean winds into a sea of sunflowers, guided by the morning lighthouse beam.',
      brief: 'Recreate the lyrical watercolor dissolves and steady contemplative tracking shots of Sunshine Boy.',
      style: 'Hand-painted Watercolor Animation',
      engine: 'painted-animation',
      format: { width: 1920, height: 1080, duration_s: 63, aspect_ratio: '16:9' },
      look: {
        palette: ['#F59E0B', '#3B82F6', '#D97706', '#E0E7FF', '#0F172A'],
        medium: 'Cold-press hand-painted watercolor with salt texture blooms',
        color_arc: 'Indigo fog -> Pale lavender dawn -> Radiant golden noon'
      },
      borrowed_from_reference: [
        'Soft 1.5s cross-dissolves between distant horizons',
        'Fluid camera pans revealing vertical landscape layers',
        'Watercolor pigment bleed transitions'
      ],
      music: {
        bpm: 78,
        genre: 'Acoustic Folk',
        mood: 'Nostalgic and comforting'
      },
      characters: [
        {
          id: 'char-sb1',
          name: 'The Old Keeper',
          role: 'Protagonist',
          design: 'Thick navy knitted sweater, weathered gentle smile, carrying a copper watering pail.',
          arc: 'Patiently coaxes yellow petals from salted earth.',
          color_motif: '#D97706',
          image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'
        }
      ],
      style_frames: [
        {
          id: 'sf-sb1',
          title: 'Morning Fog at Beacon Point',
          timestamp: '00:00 - 00:15',
          medium: 'Watercolor wash with indigo granulations',
          palette: ['#1E293B', '#3B82F6', '#E0E7FF'],
          image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
          description: 'Lighthouse tower peeking above sea fog as waves dissolve into pale washes.'
        }
      ],
      shots: [
        {
          id: 'sb-shot-01',
          index: 1,
          start_s: 0,
          end_s: 8.5,
          duration_s: 8.5,
          summary: 'Ocean fog clinging to jagged black cliffs',
          action: 'Waves roll in with gentle painted watercolor foam; distant fog horn resonates.',
          camera: { move: 'pan_right', pace: 'slow', lens: '35mm landscape' },
          camera_note: 'Unrushed lateral drift',
          ref_shot: 1,
          ref_what: 'Opening atmospheric pan',
          transition_out: 'crossfade',
          reads: ['solitude', 'calm majesty'],
          status: 'passed',
          rendered_frame: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80'
        },
        {
          id: 'sb-shot-02',
          index: 2,
          start_s: 8.5,
          end_s: 18.0,
          duration_s: 9.5,
          summary: 'First sunflower bloom caught in sunrise ray',
          action: 'A brilliant yellow blossom unfurls as gold wash bleeds over the damp paper background.',
          camera: { move: 'dolly_out', pace: 'slow' },
          ref_shot: 2,
          transition_in: 'crossfade',
          transition_out: 'crossfade',
          reads: ['hope', 'quiet miracle'],
          status: 'passed',
          rendered_frame: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80'
        }
      ],
      open_questions: [],
      changelog: ['Maintained gentle 78 BPM pacing throughout']
    },
    pipeline: {
      phase: 'final',
      active_agent: 'Critic',
      cast_passed: true,
      current_round: 1,
      max_rounds: 3,
      total_shots_completed: 2,
      total_shots_count: 2,
      chunks: {
        'chunk-sb1': { id: 'chunk-sb1', name: 'Shots 01-02 (Awakening)', shots: ['sb-shot-01', 'sb-shot-02'], state: 'passed', round: 1 }
      }
    },
    logs: [
      { id: 'lsb1', ts: '00:32:00', who: 'Director', type: 'thinking', text: 'Reference uses 1.5s cross-dissolves and 7-second average shot duration. Calibrating brush pass timing.' },
      { id: 'lsb2', ts: '00:45:00', who: 'Critic', type: 'success', text: 'Checked watercolor grain consistency. Edge blooms match style spec.' }
    ],
    comments: [],
    chat: []
  },
  {
    id: 'bath-time-showcase',
    title: 'Bath Time — Whimsical Crayon Comic',
    brief: 'A punchy 30-second comic about an energetic golden retriever negotiating bath time with dramatic puppy-dog eyes.',
    lang: 'en',
    stage: 'done',
    reference_type: 'preset',
    reference_src: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80',
    reference_name: 'Bath Time (Comic Short)',
    created_at: '2026-10-14T00:10:00Z',
    updated_at: '2026-10-14T00:25:00Z',
    final_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-little-dog-getting-a-bath-42777-large.mp4',
    report: {
      video: { duration: 30, width: 1080, height: 1080, fps: 30, aspect_ratio: '1:1' },
      audio: { bpm: 96, present: true, has_vocals: true, mood: 'Whimsical, comedic, playful' },
      pacing: { shot_count: 6, mean_shot_s: 5.0, fastest_shot_s: 2.5, longest_shot_s: 7.0, tempo: 'moderate' },
      cinematography: {
        camera_movement_distribution: { static: 50, dolly_in: 35, whip_pan: 15 },
        framing_distribution: { close_up: 60, medium: 30, wide: 10 },
        transitions: { cut: 80, whip: 20 }
      },
      look: {
        palette: ['#F59E0B', '#3B82F6', '#EF4444', '#10B981', '#FEF3C7'],
        color_arc: 'Primary toy hues on off-white textured paper',
        lighting: 'Bright flat picture-book lighting',
        medium: 'Textured waxy crayon sketches with hand-drawn comic panel borders'
      },
      detected_engine: 'crayon-book',
      engine_confidence: 95,
      engine_rationale: 'Comic panel framing, bold waxy strokes, dramatic zoom-punch cuts, and first-person humorous voiceover.'
    },
    plan: {
      title: 'Bath Time: Operation Soap Evasion',
      logline: 'Buster the pup devises 4 strategic escape maneuvers before realizing warm suds come with peanut butter treats.',
      brief: 'Mimic the snappy comic panel cuts and expressive crayon lines of Bath Time.',
      style: 'Crayon Picture Book Animation',
      engine: 'crayon-book',
      format: { width: 1080, height: 1080, duration_s: 30, aspect_ratio: '1:1' },
      look: {
        palette: ['#F59E0B', '#3B82F6', '#EF4444', '#FEF3C7', '#1E293B'],
        medium: 'Waxy crayon on cream storybook paper',
        color_arc: 'Comic panel warmth with expressive hand-lettering'
      },
      borrowed_from_reference: [
        'Comic book panel box transitions',
        'Instant dramatic crash zooms on puppy eyes',
        'Hand-drawn speed lines and sweat drops'
      ],
      music: {
        bpm: 96,
        genre: 'Acoustic Whistling & Tiptoe Marimba',
        mood: 'Playful suspense'
      },
      characters: [
        {
          id: 'char-bt1',
          name: 'Buster',
          role: 'Mastermind Dog',
          design: 'Scruffy golden retriever with comically oversized ears and expressive crayon brows.',
          arc: 'Resistance fighter turned clean, cozy champion.',
          color_motif: '#F59E0B',
          image_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80'
        }
      ],
      style_frames: [
        {
          id: 'sf-bt1',
          title: 'The Menacing Towel Appears',
          timestamp: '00:00 - 00:06',
          medium: 'Crayon sketch with yellow speech bubble',
          palette: ['#FEF3C7', '#3B82F6', '#EF4444'],
          image_url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80',
          description: 'Buster eyes the bath towel with classic cartoon shock marks.'
        }
      ],
      shots: [
        {
          id: 'bt-shot-01',
          index: 1,
          start_s: 0,
          end_s: 5.0,
          duration_s: 5.0,
          summary: 'Buster hears the bathroom faucet squeak',
          action: 'Ears perk straight up like radar dishes; crayon shock lines vibrate overhead.',
          camera: { move: 'dolly_in', pace: 'fast' },
          camera_note: 'Comic crash zoom',
          ref_shot: 1,
          transition_out: 'cut',
          reads: ['suspicion', 'alert'],
          text_overlay: [{ text: 'CODE RED: THE WATER MONSTER', position: 'bottom' }],
          status: 'passed',
          rendered_frame: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80'
        }
      ],
      open_questions: [],
      changelog: []
    },
    pipeline: {
      phase: 'final',
      active_agent: 'Critic',
      cast_passed: true,
      current_round: 1,
      max_rounds: 3,
      total_shots_completed: 1,
      total_shots_count: 1,
      chunks: {
        'chunk-bt1': { id: 'chunk-bt1', name: 'Opening Gag', shots: ['bt-shot-01'], state: 'passed', round: 1 }
      }
    },
    logs: [
      { id: 'lbt1', ts: '00:12:00', who: 'Director', type: 'thinking', text: 'Structuring comic speech bubble layout with 96 BPM tiptoe cadence.' }
    ],
    comments: [],
    chat: []
  }
];
