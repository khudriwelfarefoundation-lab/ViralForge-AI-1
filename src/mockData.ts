import { SocialAccount, VideoProject, BulkCampaign } from './types';

export const INITIAL_ACCOUNTS: SocialAccount[] = [
  {
    id: 'tk-1',
    platform: 'tiktok',
    name: 'TechBytes Daily',
    username: '@techbytes_daily',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
    connected: true,
  },
  {
    id: 'tk-2',
    platform: 'tiktok',
    name: 'Aesthetic Travels',
    username: '@wander_dreamer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
    connected: true,
  },
  {
    id: 'ig-1',
    platform: 'instagram',
    name: 'Metropolis Culture',
    username: '@metropolis.culture',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
    connected: true,
    type: 'Business',
  },
  {
    id: 'ig-2',
    platform: 'instagram',
    name: 'Minimalist Spaces',
    username: '@minimal_concept',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&q=80',
    connected: false,
    type: 'Creator',
  },
  {
    id: 'fb-1',
    platform: 'facebook',
    name: 'AI Future Tech Page',
    username: '1092837492837',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
    connected: true,
    pageId: 'page_902381',
    category: 'Science & Technology',
  },
  {
    id: 'yt-1',
    platform: 'youtube',
    name: 'Vivid Cinematic Labs',
    username: 'UCxYj8880_YT_Channel',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80',
    connected: true,
    subscribers: 142000,
    quota: '142 / Unlimited units',
  },
  {
    id: 'yt-2',
    platform: 'youtube',
    name: 'Chill Beats Studio',
    username: 'UCbeats_lofi_ambient',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80',
    connected: true,
    subscribers: 28400,
    quota: '5 / Unlimited units',
  }
];

export const INITIAL_VIDEOS: VideoProject[] = [
  {
    id: 'v-1',
    prompt: 'A sleek retro futuristic sports car speeding along an infinite bridge through a cyberpunk city with neon holograms at night, synthwave mood.',
    style: 'cyberpunk',
    aspectRatio: '9:16',
    duration: 15,
    title: 'Speeding into the Cyberpunk Future!',
    description: 'This is what the year 2099 looks like. Speeding past rain-soaked neon lanes in an absolute dream synth machine. Built entirely using ViralForge AI.',
    hashtags: ['#cyberpunk', '#synthwave', '#scifi', '#future', '#aiart', '#shorts'],
    thumbnail: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=300&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-neon-light-from-a-building-reflected-in-the-wet-43187-large.mp4',
    status: 'Scheduled',
    progress: 100,
    queuePosition: 0,
    estTime: '3.5 min',
    consistentStyle: true,
    targetPlatforms: ['tiktok', 'instagram'],
    targetAccounts: ['tk-1', 'ig-1'],
    scheduledDate: '2026-06-14',
    scheduledTime: '18:30',
    options: {
      tiktok: {
        allowDuet: true,
        allowStitch: true,
        commentPermission: 'everyone',
        privacy: 'public'
      },
      instagram: {
        postType: 'reel',
        tagProducts: '',
        collaborationTags: '@futurecars'
      }
    },
    subtitles: [
      { id: 'sub-1', timeStart: 0, timeEnd: 4, text: 'Welcome to the neon-drenched future of 2099...', effect: 'typewriter' },
      { id: 'sub-2', timeStart: 4, timeEnd: 9, text: 'This synthwave machine glides across wet asphalt layers.', effect: 'fade' },
      { id: 'sub-3', timeStart: 9, timeEnd: 15, text: 'Follow us to witness more AI-built futuristic worlds!', effect: 'slide' }
    ],
    volumeLevel: 90,
    musicVolume: 60,
    musicId: 'synthwave',
    speed: 1.0,
    brightness: 105,
    contrast: 110,
    saturation: 115,
    lutFilter: 'cyberpunk'
  },
  {
    id: 'v-2',
    prompt: 'Charming close-up of an astronaut cat floating in open space, catching a floating cosmic tuna can, stars sparkling in the background, Pixar 3D style.',
    style: '3d-animation',
    aspectRatio: '1:1',
    duration: 30,
    title: 'Meow-space Expedition 🌌🐈',
    description: 'An astronaut kitty floating gracefully in zero-G, chasing the ultimate cosmic tuna can of the stars. Perfect cute Pixar aesthetic!',
    hashtags: ['#astronaut', '#spacecat', '#3danimation', '#pixel', '#retro', '#cute'],
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-rotating-ball-of-light-with-beams-and-sparks-45371-large.mp4',
    status: 'Published',
    progress: 100,
    queuePosition: 0,
    estTime: '4.2 min',
    consistentStyle: false,
    targetPlatforms: ['youtube', 'facebook'],
    targetAccounts: ['yt-1', 'fb-1'],
    scheduledDate: '2026-06-12',
    scheduledTime: '10:15',
    subtitles: [
      { id: 'sub-4', timeStart: 0, timeEnd: 6, text: 'Floating aimlessly in the beautiful silent cosmos...', effect: 'fade' },
      { id: 'sub-5', timeStart: 6, timeEnd: 15, text: 'Our furry cadet spot a rare legendary snack.', effect: 'typewriter' },
      { id: 'sub-6', timeStart: 15, timeEnd: 25, text: 'He lunges forward, defying the laws of gravity!', effect: 'slide' },
      { id: 'sub-7', timeStart: 25, timeEnd: 30, text: 'Mission completed: Cosmic Salmon retrieved.', effect: 'none' }
    ],
    volumeLevel: 80,
    musicVolume: 50,
    musicId: 'lofi_dream',
    speed: 1.2,
    brightness: 110,
    contrast: 100,
    saturation: 100,
    lutFilter: 'warm_sun'
  }
];

export const INITIAL_CAMPAIGNS: BulkCampaign[] = [
  {
    id: 'c-1',
    name: 'Summer AI Tech Highlights',
    uploadedAt: '2026-06-13 11:30',
    fileName: 'summer_highlights_campaign.xlsx',
    rowCount: 5,
    status: 'ready',
    validRows: 4,
    invalidRows: 1,
    headers: ['Video Prompt', 'Style Selection', 'Aspect Ratio', 'Duration', 'Target Platforms', 'Account IDs', 'Scheduled Date/Time', 'Caption/Description', 'Hashtags'],
    mapping: {
      promptColumn: 'Video Prompt',
      styleColumn: 'Style Selection',
      aspectRatioColumn: 'Aspect Ratio',
      durationColumn: 'Duration',
      platformsColumn: 'Target Platforms',
      accountsColumn: 'Account IDs',
      datetimeColumn: 'Scheduled Date/Time',
      captionColumn: 'Caption/Description',
      hashtagsColumn: 'Hashtags'
    },
    rows: [
      {
        id: 'r-1',
        isValid: true,
        errors: [],
        data: {
          prompt: 'A breathtaking drone shot of a high-altitude train crossing a red bridge over a misty pine valley in autumn, dramatic natural light.',
          style: 'Cinematic',
          aspectRatio: '16:9',
          duration: '60s',
          platforms: 'youtube,facebook',
          accountIds: 'yt-1,fb-1',
          scheduledDateTime: '2026-06-15 14:00',
          caption: 'Autumn train crossings look absolutely magnificent in 4K realism.',
          hashtags: '#nature,#cinematic,#valley,#traintravel,#outdoors'
        }
      },
      {
        id: 'r-2',
        isValid: true,
        errors: [],
        data: {
          prompt: 'Cute animated pastel robot offering a pink daisy flower, watercolor paint texture background, gentle wind blowing.',
          style: 'Watercolor',
          aspectRatio: '1:1',
          duration: '15s',
          platforms: 'instagram',
          accountIds: 'ig-1',
          scheduledDateTime: '2026-06-16 09:30',
          caption: 'A little kindness block from a watercolor helper! 🤖🌸',
          hashtags: '#watercolor,#pastel,#robot,#flowers,#cuteart'
        }
      },
      {
        id: 'r-3',
        isValid: true,
        errors: [],
        data: {
          prompt: 'Sizzling hot premium smashburger dripping with cheese and caramel onions, visual macro lens sliding showcase.',
          style: 'Product Showcase',
          aspectRatio: '9:16',
          duration: '30s',
          platforms: 'tiktok,instagram',
          accountIds: 'tk-1,ig-1',
          scheduledDateTime: '2026-06-17 12:00',
          caption: 'Is this the best burger render you have ever seen? Hungry yet?',
          hashtags: '#burger,#foodporn,#cooking,#aiart,#foryou'
        }
      },
      {
        id: 'r-4',
        isValid: false,
        errors: ['Target Account IDs is empty or invalid for requested platforms.'],
        data: {
          prompt: 'Dynamic gaming setup showing rgb mechanical keyboard typing violently, electronic matrix grid overlays, pixel art.',
          style: 'Pixel Art',
          aspectRatio: '9:16',
          duration: '30s',
          platforms: 'tiktok',
          accountIds: 'invalid-id-here',
          scheduledDateTime: '2026-06-18 20:00',
          caption: 'Type at full speed on this mech masterpiece!',
          hashtags: '#mechanicalkeyboard,#typing,#rgbsetup,#pixelart'
        }
      },
      {
        id: 'r-5',
        isValid: true,
        errors: [],
        data: {
          prompt: 'Cyberpunk hackers coding in dark glowing database room with complex holo-charts, glowing wires.',
          style: 'Cyberpunk',
          aspectRatio: '9:16',
          duration: '60s',
          platforms: 'tiktok,instagram',
          accountIds: 'tk-2',
          scheduledDateTime: '2026-06-19 16:30',
          caption: 'Hacking the matrix grid one command at a time. Coding till sunrise.',
          hashtags: '#hacker,#cyberpunkstyle,#programming,#neonvibe'
        }
      }
    ]
  }
];
