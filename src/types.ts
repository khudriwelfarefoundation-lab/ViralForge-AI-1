export type Platform = 'tiktok' | 'instagram' | 'facebook' | 'youtube';

export interface SocialAccount {
  id: string;
  platform: Platform;
  name: string;
  username: string; // e.g. @username or Channel ID
  avatar: string;
  connected: boolean;
  type?: string;        // Business/Creator/Personal (Instagram)
  pageId?: string;      // Page ID (Facebook)
  category?: string;    // Category (Facebook/YouTube)
  subscribers?: number; // Subscriber count (YouTube)
  quota?: string;       // Quota used, e.g. "45/10,000 units" (YouTube)
  isSelected?: boolean;
}

export interface Subtitle {
  id: string;
  timeStart: number; // in seconds
  timeEnd: number;   // in seconds
  text: string;
  effect?: 'typewriter' | 'fade' | 'slide' | 'none';
}

export interface TimelineTrack {
  id: string;
  type: 'video' | 'audio' | 'text' | 'effects' | 'transitions';
  name: string;
  items: Array<{
    id: string;
    startTime: number; // in seconds
    duration: number; // in seconds
    color: string;
    label: string;
    secondaryLabel?: string;
  }>;
}

export interface VideoProject {
  id: string;
  prompt: string;
  style: string;
  aspectRatio: string; // "9:16" | "1:1" | "16:9" | "4:5" | "21:9" | "custom"
  customRatio?: string;
  duration: number; // in seconds (e.g. 15, 30, 60, 180, etc.)
  title: string;
  description: string;
  hashtags: string[];
  thumbnail: string;
  videoUrl: string; // Playback URL or Mocked frame loop
  status: 'Draft' | 'Generating' | 'Editing' | 'Scheduled' | 'Published' | 'Failed';
  progress: number; // 0 to 100
  queuePosition: number;
  estTime: string; // Estimated generation time
  consistentStyle: boolean;
  
  // Publish/Schedule details
  targetPlatforms: Platform[];
  targetAccounts: string[]; // List of SocialAccount ID
  scheduledDate?: string; // YYYY-MM-DD
  scheduledTime?: string; // HH:mm
  
  // Platform specific options
  options?: {
    tiktok?: {
      allowDuet: boolean;
      allowStitch: boolean;
      commentPermission: 'everyone' | 'friends' | 'no_one';
      privacy: 'public' | 'friends' | 'private';
    };
    instagram?: {
      postType: 'reel' | 'feed' | 'story';
      tagProducts: string;
      collaborationTags: string;
    };
    facebook?: {
      boostPost: boolean;
      boostBudget: number;
      targetingAudience: string;
    };
    youtube?: {
      privacy: 'public' | 'unlisted' | 'private';
      playlistId: string;
      tags: string;
      category: string;
    };
  };

  // Editing controls
  subtitles: Subtitle[];
  musicId?: string;
  voiceId?: string; // AI Speech Narration Vocalist
  volumeLevel: number; // 0 - 100
  musicVolume: number; // 0 - 100
  speed: number;       // 0.25 - 4.0
  brightness: number;  // 50 - 150 (100 base)
  contrast: number;    // 50 - 150 (100 base)
  saturation: number;  // 50 - 150 (100 base)
  lutFilter: string;   // 'none' | 'cyberpunk' | 'vintage' | 'teal-orange' | 'noir' | 'warm_sun'
  aiReframed?: boolean;
  aiUpscaled?: boolean;
  bgRemoved?: boolean;
}

export interface BulkCampaign {
  id: string;
  name: string;
  uploadedAt: string;
  fileName: string;
  rowCount: number;
  status: 'validating' | 'ready' | 'processing' | 'completed' | 'errors';
  headers: string[];
  validRows: number;
  invalidRows: number;
  rows: Array<{
    id: string;
    isValid: boolean;
    errors: string[];
    data: {
      prompt: string;
      style: string;
      aspectRatio: string;
      duration: string;
      platforms: string;
      accountIds: string;
      scheduledDateTime: string;
      caption: string;
      hashtags: string;
      thumbnailPrompt?: string;
      customMusic?: string;
    };
  }>;
  mapping: {
    promptColumn: string;
    styleColumn: string;
    aspectRatioColumn: string;
    durationColumn: string;
    platformsColumn: string;
    accountsColumn: string;
    datetimeColumn: string;
    captionColumn: string;
    hashtagsColumn: string;
  };
}

export interface VideoStyle {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
  tag: string;
}

export const PRESET_STYLES: VideoStyle[] = [
  { id: 'cinematic', name: 'Cinematic', tag: 'Cinematic', thumbnail: '🎬', description: 'Hollywood lighting and deep focus style' },
  { id: 'anime', name: 'Anime', tag: 'Anime', thumbnail: '🎌', description: 'Classic cel-shaded hand-drawn dynamic Anime' },
  { id: '3d-animation', name: '3D Animation', tag: '3D Animation', thumbnail: '🧸', description: 'Pixar-style cute, stylized 3D models and lighting' },
  { id: 'pixel-art', name: 'Pixel Art', tag: 'Pixel Art', thumbnail: '👾', description: 'Retro 8-bit or 16-bit console styled sprites' },
  { id: 'documentary', name: 'Documentary', tag: 'Documentary', thumbnail: '🌍', description: 'Realist narration look, authentic real world' },
  { id: 'vlog', name: 'Vlog', tag: 'Vlog', thumbnail: '🤳', description: 'Handheld first-person vlog aesthetic' },
  { id: 'product-showcase', name: 'Product Showcase', tag: 'Product Showcase', thumbnail: '💎', description: 'Super sharp closeups with soft ambient neon studio lights' },
  { id: 'educational', name: 'Educational', tag: 'Educational', thumbnail: '🧠', description: 'Visual diagrams, high clarity infographic style' },
  { id: 'gaming', name: 'Gaming', tag: 'Gaming', thumbnail: '🎮', description: 'High FPS energetic console game stream style' },
  { id: 'luxury', name: 'Luxury', tag: 'Luxury', thumbnail: '⚜️', description: 'Gold and deep black color grades, yachts, watches' },
  { id: 'minimalist', name: 'Minimalist', tag: 'Minimalist', thumbnail: '◻️', description: 'Pure clean whites, high contrast compositions' },
  { id: 'retro', name: 'Retro', tag: 'Retro', thumbnail: '💿', description: 'VHS tracking static, 80s synthesizer theme colors' },
  { id: 'cyberpunk', name: 'Cyberpunk', tag: 'Cyberpunk', thumbnail: '🌆', description: 'Rainy asphalt, glaring purple & cyan neon signs' },
  { id: 'watercolor', name: 'Watercolor', tag: 'Watercolor', thumbnail: '🎨', description: 'Fading handpainted pastel colors with paper textures' },
  { id: 'claymation', name: 'Claymation', tag: 'Claymation', thumbnail: '🦕', description: 'Tactile stop-motion figures with physical frame jitters' },
  { id: 'custom-style', name: 'Custom Style', tag: 'Custom Style', thumbnail: '📤', description: 'Upload style preset metadata or images' }
];

export const PRESET_MUSIC = [
  { id: 'lofi_dream', name: 'Lofi Dreamscape', genre: 'Chill/Lofi', mood: 'Relaxed', duration: '3min' },
  { id: 'synthwave', name: 'Neon Outrun', genre: 'Electronic/80s', mood: 'Energetic', duration: '4min' },
  { id: 'inspire_piano', name: 'Ethereal Uplift', genre: 'Classical/Piano', mood: 'Inspirational', duration: '2.5min' },
  { id: 'epic_orchestral', name: 'Legendary Forge', genre: 'Orchestral/Movie', mood: 'Powerful', duration: '5min' },
  { id: 'trap_beats', name: 'Viral Hype', genre: 'Hip Hop/Trap', mood: 'Confident', duration: '3min' },
];

export interface VoiceNarrator {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Neutral';
  style: string;
  description: string;
  avatar: string;
  audioSampleUrl?: string;
}

export const PRESET_VOICES: VoiceNarrator[] = [
  { id: 'deep_cinema', name: 'James (Deep Cinematic)', gender: 'Male', style: 'Rich, cinematic, commanding', description: 'Perfect for epic trailers, high-production reels, and dramatic storytelling.', avatar: '🎙️' },
  { id: 'viral_hype', name: 'Chloe (Energetic Host)', gender: 'Female', style: 'High energy, fast-paced, youth-centered', description: 'Optimized for TikTok trends, reactions, fast lifestyle vlogs, and product hype.', avatar: '💃' },
  { id: 'motivation_coach', name: 'Marcus (Motivational Coach)', gender: 'Male', style: 'Deep, inspirational, paced delivery', description: 'Suited for self-improvement niche, gym workouts, and daily wisdom capsules.', avatar: '🦁' },
  { id: 'scenic_teller', name: 'Aria (Calm Storyteller)', gender: 'Female', style: 'Soothing, whispery, serene, slow-paced', description: 'Brings out authentic travel narratives, cozy vlogs, art watercolor sessions, and relaxation channels.', avatar: '🌸' },
  { id: 'tech_expert', name: 'Dexter (Tech Expert)', gender: 'Male', style: 'Clean, informative, direct, neutral', description: 'Excellent for tutorials, software guides, product comparisons, and educational shorts.', avatar: '🤖' }
];
