import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Scissors, AlignCenter, Music, Sparkles, Sliders, Volume2, 
  Trash2, Plus, RefreshCw, Type, Eye, Download, Grid, Maximize, Languages, Smile 
} from 'lucide-react';
import { VideoProject, Subtitle, PRESET_MUSIC, PRESET_VOICES } from '../types';

interface ForgeStudioProps {
  activeVideo: VideoProject | null;
  setActiveVideo: (video: VideoProject | null) => void;
  onSaveToLibrary: (video: VideoProject) => void;
}

export default function ForgeStudio({ activeVideo, setActiveVideo, onSaveToLibrary }: ForgeStudioProps) {
  if (!activeVideo) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center max-w-xl mx-auto space-y-4">
        <div className="h-14 w-14 rounded-full bg-violet-600/15 flex items-center justify-center text-2xl mx-auto shadow-inner text-violet-300">
          🎬
        </div>
        <div>
          <h3 className="text-md font-extrabold text-white">Active Video Project Not Selected</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
            Before entering the Forge Studio editing track, first describe a script in the <strong>Create Workspace</strong>, or click <strong>Edit</strong> on a previously generated clip in the library.
          </p>
        </div>
      </div>
    );
  }

  // Local Copy of Video Project details
  const [project, setProject] = useState<VideoProject>({ ...activeVideo });
  const [activeTab, setActiveTab] = useState<'visual' | 'audio' | 'captions' | 'ai'>('visual');
  
  // Player control states
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadTime, setPlayheadTime] = useState(3.5); // Current playhead state (in seconds)
  
  // Captions workflow
  const [subtitleText, setSubtitleText] = useState('');
  const [subtitleStart, setSubtitleStart] = useState('0.0');
  const [subtitleEnd, setSubtitleEnd] = useState('3.0');
  const [subtitleEffect, setSubtitleEffect] = useState<'typewriter' | 'fade' | 'slide' | 'none'>('typewriter');
  const [captionLanguage, setCaptionLanguage] = useState('en');
  const [subFont, setSubFont] = useState('Inter Bold');
  const [subColor, setSubColor] = useState('#ffffff');
  const [subBg, setSubBg] = useState('rgba(0,0,0,0.75)');

  // Selected tracks tracking states
  const [selectedTrackItem, setSelectedTrackItem] = useState<{ trackId: string; itemId: string } | null>({
    trackId: 'video',
    itemId: 'video-main'
  });

  // Export settings states
  const [exportQuality, setExportQuality] = useState<'720p' | '1080p' | '4K'>('1080p');
  const [exportFormat, setExportFormat] = useState<'mp4' | 'mov'>('mp4');
  const [exportingProgress, setExportingProgress] = useState<number | null>(null);

  // Sync state if activeVideo shifts
  useEffect(() => {
    setProject({ ...activeVideo });
    setPlayheadTime(0);
    setIsPlaying(false);
  }, [activeVideo]);

  // Handle Playback Simulation Timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setPlayheadTime(prev => {
          if (prev >= project.duration) {
            setIsPlaying(false);
            return 0;
          }
          return parseFloat((prev + 0.15).toFixed(1));
        });
      }, 150);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, project.duration]);

  // Trim playhead left/right tools
  const handleTrimLeft = () => {
    if (playheadTime > 0) {
      const remainingTime = project.duration - playheadTime;
      setProject(prev => ({
        ...prev,
        duration: remainingTime,
        subtitles: prev.subtitles.map(sub => ({
          ...sub,
          timeStart: Math.max(0, sub.timeStart - playheadTime),
          timeEnd: Math.max(0, sub.timeEnd - playheadTime)
        })).filter(sub => sub.timeEnd > 0)
      }));
      setPlayheadTime(0);
      alert("Trimmed preceding frames. Remaining sequence duration updated.");
    }
  };

  const handleTrimRight = () => {
    if (playheadTime < project.duration) {
      setProject(prev => ({
        ...prev,
        duration: playheadTime,
        subtitles: prev.subtitles.filter(sub => sub.timeStart < playheadTime)
      }));
      setPlayheadTime(Math.max(0, playheadTime - 0.5));
      alert("Trimmed subsequent frames. Duration capped at active playhead.");
    }
  };

  const handleSplitTimeline = () => {
    alert(`Split sequence triggered at ${playheadTime}s. Render frame segments separated. Ready for transition insertion.`);
  };

  const handleRippleDelete = () => {
    alert("Ripple Deleted active silent segment. Preceding play items snapped forward.");
  };

  // Subtitle creation
  const handleAddSubtitle = () => {
    if (!subtitleText.trim()) return;
    const start = parseFloat(subtitleStart) || 0;
    const end = parseFloat(subtitleEnd) || project.duration;

    const newSub: Subtitle = {
      id: `sub-user-${Math.floor(Math.random() * 100000)}`,
      timeStart: start,
      timeEnd: end,
      text: subtitleText,
      effect: subtitleEffect
    };

    setProject(prev => ({
      ...prev,
      subtitles: [...prev.subtitles, newSub].sort((a,b) => a.timeStart - b.timeStart)
    }));

    setSubtitleText('');
  };

  const handleRemoveSubtitle = (subId: string) => {
    setProject(prev => ({
      ...prev,
      subtitles: prev.subtitles.filter(s => s.id !== subId)
    }));
  };

  // Auto Caption Translation Engine Simulation
  const handleAutoCaptionGenerate = () => {
    const speechMap: Record<string, string[]> = {
      en: [
        "Unleashing the ultimate viral rendering matrix...",
        "Perfect visual design, locked style continuity.",
        "Your metrics are guaranteed to spike!"
      ],
      es: [
        "Desatando la matriz de renderizado viral definitiva...",
        "Diseño visual ideal, consistencia de estilo perfecto.",
        "¡Tus métricas de audiencia están aseguradas!"
      ],
      fr: [
        "Libérer la matrice de rendu viral ultime...",
        "Conception visuelle propre, continuité globale.",
        "Vos statistiques vont exploser !"
      ],
      de: [
        "Entfesseln der ultimativen viralen Render-Matrix...",
        "Perfektes visuelles Design, absolute Stabilität.",
        "Ihre Zuschauerzahlen werden jetzt steigen!"
      ],
      zh: [
        "释放终极病毒式视频渲染矩阵...",
        "极具视觉冲击力的画面设计，保持角色连贯性。",
        "即刻引爆社交媒体平台关注度！"
      ]
    };

    const targetSentences = speechMap[captionLanguage] || speechMap['en'];
    const interval = project.duration / targetSentences.length;

    const autoSubs: Subtitle[] = targetSentences.map((spoken, i) => {
      const start = parseFloat((i * interval).toFixed(1));
      const end = parseFloat(((i + 1) * interval).toFixed(1));
      return {
        id: `auto-sub-${captionLanguage}-${i}`,
        timeStart: start,
        timeEnd: end,
        text: spoken,
        effect: 'typewriter'
      };
    });

    setProject(prev => ({
      ...prev,
      subtitles: autoSubs
    }));
    alert(`AI Speech-to-Text transcribed successfully into ${captionLanguage.toUpperCase()}! Auto-captions injected.`);
  };

  // Export pipeline
  const handleExport = () => {
    setExportingProgress(1);
    
    const interval = setInterval(() => {
      setExportingProgress(prev => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setExportingProgress(null);
            // Save project
            onSaveToLibrary({
              ...project,
              status: 'Draft',
              videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-spiral-of-colored-light-beams-45367-large.mp4',
            });
            alert(`Project exported successfully in cinematic ${exportQuality} (${exportFormat.toUpperCase()}). File saved to "Ready to Publish" library!`);
          }, 800);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15 + 5);
      });
    }, 200);
  };

  // Render video frame styling based on current editor sliders
  const getFilterStyle = () => {
    let brightness = `brightness(${project.brightness}%)`;
    let contrast = `contrast(${project.contrast}%)`;
    let saturation = `saturate(${project.saturation}%)`;
    let extraFilter = '';

    switch (project.lutFilter) {
      case 'cyberpunk':
        extraFilter = 'hue-rotate(60deg) saturate(140%) contrast(110%)';
        break;
      case 'vintage':
        extraFilter = 'sepia(35%) hue-rotate(-20deg) contrast(90%)';
        break;
      case 'teal-orange':
        extraFilter = 'hue-rotate(180deg) saturate(120%) contrast(105%)';
        break;
      case 'noir':
        extraFilter = 'grayscale(100%) contrast(130%)';
        break;
      case 'warm_sun':
        extraFilter = 'sepia(20%) saturate(110%) hue-rotate(10deg)';
        break;
    }

    return {
      filter: `${brightness} ${contrast} ${saturation} ${extraFilter}`,
      transform: project.aiReframed ? 'scale(1.2) translateY(5%)' : 'none',
      transition: 'all 0.2s ease-out'
    };
  };

  // Get active subtitle text according to playheadTime
  const activeSubtitle = project.subtitles.find(
    s => playheadTime >= s.timeStart && playheadTime <= s.timeEnd
  );

  return (
    <div id="forge-studio-workspace" className="space-y-6">
      {/* Upper Preview and Control Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Playback Canvas Monitor (Left) */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-white/10 bg-black/40 p-4 relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-mono text-gray-400 font-bold uppercase tracking-widest">
                Preview Player Monitor • WebGL Render Active
              </span>
            </div>
            
            <div className="flex gap-1.5">
              {project.aiReframed && (
                <span className="text-[9px] font-bold text-violet-300 bg-violet-950/40 px-2 py-0.5 rounded border border-violet-500/20 uppercase font-mono">Reframe Target Locked</span>
              )}
              {project.aiUpscaled && (
                <span className="text-[9px] font-bold text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20 uppercase font-mono">4K Upscaled</span>
              )}
            </div>
          </div>

          {/* Actual video monitor mock canvas styled dynamically */}
          <div className="relative overflow-hidden rounded-xl bg-black flex items-center justify-center border border-white/5 aspect-video w-full group">
            {/* The actual video tag */}
            <video
              id="monitor-video-tag"
              src={project.videoUrl}
              className="w-full h-full object-cover max-h-[380px]"
              style={getFilterStyle()}
              muted
              playsInline
            />

            {/* Glowing background replacement for chromakey / bg removal */}
            {project.bgRemoved && (
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950 via-slate-900 to-indigo-950 opacity-80 mix-blend-color-dodge transition-all pointer-events-none" />
            )}

            {/* Subtitle overlay container */}
            {activeSubtitle && (
              <div 
                className="absolute left-6 right-6 bottom-8 text-center pointer-events-none drop-shadow-md z-15 animate-fade-in"
                style={{
                  fontFamily: subFont === 'Inter Bold' ? 'sans-serif' : 'monospace',
                  color: subColor,
                  fontSize: '15px',
                  fontWeight: 'bold',
                }}
              >
                <span 
                  className="px-3 py-1.5 rounded"
                  style={{ backgroundColor: subBg }}
                >
                  {activeSubtitle.text}
                </span>
              </div>
            )}

            {/* Overlay Playhead Play indicator */}
            {!isPlaying && (
              <div 
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center cursor-pointer transition group-hover:bg-black/50"
              >
                <div className="h-14 w-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white text-xl transition-transform hover:scale-110 shadow-lg">
                  <Play className="h-6 w-6 ml-1" />
                </div>
              </div>
            )}
          </div>

          {/* Playback controller & trimming trigger buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-white/10 bg-[#09090f] p-3 rounded-xl">
            <div className="flex items-center gap-3">
              <button
                id="toggle-playback-btn"
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </button>

              <div className="text-xs font-mono font-bold text-gray-300">
                <span>{playheadTime.toFixed(1)}s</span>
                <span className="text-gray-500 mx-1">/</span>
                <span>{project.duration.toFixed(1)}s</span>
              </div>
            </div>

            {/* Editing Segment Trimmers requested */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={handleTrimLeft}
                className="text-[11px] font-bold text-gray-300 hover:text-white bg-white/5 border border-white/10 hover:border-white/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                title="Trim all frames before playhead"
              >
                ← Trim Left
              </button>
              <button
                onClick={handleTrimRight}
                className="text-[11px] font-bold text-gray-300 hover:text-white bg-white/5 border border-white/10 hover:border-white/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                title="Trim all subsequent frames"
              >
                Trim Right →
              </button>
              <button
                id="split-playhead-btn"
                onClick={handleSplitTimeline}
                className="text-[11px] font-bold text-cyan-300 hover:text-cyan-200 bg-cyan-950/20 border border-cyan-500/20 hover:border-cyan-500/40 px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                title="Split segment track"
              >
                <Scissors className="h-3 w-3" /> Split Track
              </button>
              <button
                onClick={handleRippleDelete}
                className="text-[11px] font-bold text-red-400 hover:text-red-300 bg-red-950/20 border border-red-500/10 px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                title="Ripple delete slot"
              >
                <Trash2 className="h-3 w-3" /> Ripple Del
              </button>
            </div>
          </div>
        </div>

        {/* Studio Controls Drawer (Right) */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl relative">
          <div>
            {/* Header tab switcher */}
            <div className="flex border-b border-white/10 gap-2 mb-4">
              {[
                { id: 'visual', label: 'Color & LUTs', icon: <Sliders className="h-3.5 w-3.5" /> },
                { id: 'audio', label: 'Audio Suite', icon: <Volume2 className="h-3.5 w-3.5" /> },
                { id: 'captions', label: 'Caption Engine', icon: <Type className="h-3.5 w-3.5" /> },
                { id: 'ai', label: 'AI Enhancer', icon: <Sparkles className="h-3.5 w-3.5" /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 text-xs font-bold pb-2 border-b-2 px-1 transition duration-150 cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-violet-500 text-white'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* TAB 1: Visual Color Tuning */}
            {activeTab === 'visual' && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Cinematic Filter LUT Preset</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'none', label: 'Raw Flat Profile', icon: '📷' },
                      { id: 'cyberpunk', label: 'Cyberpunk Neon Matrix', icon: '🌆' },
                      { id: 'vintage', label: 'VHS Vintage Warmth', icon: '💿' },
                      { id: 'teal-orange', label: 'Hollywood Blockbuster', icon: '🍊' },
                      { id: 'noir', label: 'Grayscale Mystery', icon: '🖤' },
                      { id: 'warm_sun', label: 'Golden Hour Flare', icon: '☀️' }
                    ].map(lut => (
                      <button
                        key={lut.id}
                        onClick={() => setProject(prev => ({ ...prev, lutFilter: lut.id }))}
                        className={`text-left p-2 rounded-lg border text-xs flex items-center gap-2 transition cursor-pointer ${
                          project.lutFilter === lut.id
                            ? 'border-cyan-400 bg-cyan-950/20 text-cyan-300'
                            : 'border-white/5 bg-black/20 hover:bg-white/5 text-gray-300'
                        }`}
                      >
                        <span>{lut.icon}</span>
                        <span className="font-semibold truncate">{lut.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  {/* Color Adjust sliders */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Brightness Factor</span>
                      <span className="font-mono text-cyan-400">{project.brightness}%</span>
                    </div>
                    <input
                      type="range" min="50" max="150" value={project.brightness}
                      onChange={(e) => setProject(prev => ({ ...prev, brightness: Number(e.target.value) }))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Contrast Balance</span>
                      <span className="font-mono text-cyan-400">{project.contrast}%</span>
                    </div>
                    <input
                      type="range" min="50" max="150" value={project.contrast}
                      onChange={(e) => setProject(prev => ({ ...prev, contrast: Number(e.target.value) }))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Saturated Color Depth</span>
                      <span className="font-mono text-cyan-400">{project.saturation}%</span>
                    </div>
                    <input
                      type="range" min="50" max="150" value={project.saturation}
                      onChange={(e) => setProject(prev => ({ ...prev, saturation: Number(e.target.value) }))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>

                  {/* Speed ramping */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Speed Ramping Factor</span>
                      <span className="font-mono text-violet-400 font-bold">{project.speed}x multiplier</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[0.25, 0.5, 1.0, 2.0, 4.0].map(sFactor => (
                        <button
                          key={sFactor}
                          onClick={() => setProject(prev => ({ ...prev, speed: sFactor }))}
                          className={`py-1 text-[10px] font-mono rounded font-bold transition cursor-pointer ${
                            project.speed === sFactor
                              ? 'bg-violet-650 bg-violet-600 text-white border border-violet-400'
                              : 'bg-white/5 text-gray-400 hover:text-white'
                          }`}
                        >
                          {sFactor === 1.0 ? 'Normal' : `${sFactor}x`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Audio Suite */}
            {activeTab === 'audio' && (
              <div className="space-y-4 animate-fade-in text-xs text-gray-300">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">🎙️ AI Vocal Narrator Speech Voice</label>
                  <select
                    value={project.voiceId || 'deep_cinema'}
                    onChange={(e) => setProject(prev => ({ ...prev, voiceId: e.target.value }))}
                    className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    {PRESET_VOICES.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.avatar} {v.name} ({v.gender}) • {v.style}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Music Dub Track Library</label>
                  <select
                    value={project.musicId || 'none'}
                    onChange={(e) => setProject(prev => ({ ...prev, musicId: e.target.value }))}
                    className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="none">🔇 No background music track (Audio Flat)</option>
                    {PRESET_MUSIC.map(m => (
                      <option key={m.id} value={m.id}>
                        🎵 {m.name} ({m.genre} ) • mood: {m.mood}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Simulated Audio ducking and sliders */}
                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Synthesizer Master Level</span>
                      <span className="font-mono font-bold text-cyan-400">{project.volumeLevel}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100" value={project.volumeLevel}
                      onChange={(e) => setProject(prev => ({ ...prev, volumeLevel: Number(e.target.value) }))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Music Mix Overlay Ducking Factor</span>
                      <span className="font-mono font-bold text-cyan-400">{project.musicVolume}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100" value={project.musicVolume}
                      onChange={(e) => setProject(prev => ({ ...prev, musicVolume: Number(e.target.value) }))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>
                </div>

                {/* Audio features shortcuts */}
                <div className="rounded-xl border border-white/5 bg-black/20 p-3 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block">AI Vocal Optimizers</span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input type="checkbox" defaultChecked className="rounded border-white/10 bg-black text-violet-600 focus:ring-violet-500" />
                      <span>Smart Audio Ducking (Auto volume compression during speech)</span>
                    </label>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input type="checkbox" defaultChecked className="rounded border-white/10 bg-black text-violet-600 focus:ring-violet-500" />
                      <span>Studio De-Noise (Remove background static hiss)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Captions Studio */}
            {activeTab === 'captions' && (
              <div className="space-y-4 animate-fade-in">
                {/* Auto caption generator */}
                <div className="p-3.5 rounded-xl bg-violet-950/20 border border-violet-500/20 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-violet-300 font-bold">
                    <Languages className="h-4 w-4" />
                    <span>AI Voice-to-Subtitle Auto-Captioner</span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Will parse structural timeline audio markers to map, slice and render visual headings instantly.
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <select
                      value={captionLanguage}
                      onChange={(e) => setCaptionLanguage(e.target.value)}
                      className="bg-black border border-white/10 rounded-lg p-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="en">🇺🇸 English</option>
                      <option value="es">🇪🇸 Spanish (Español)</option>
                      <option value="fr">🇫🇷 French (Français)</option>
                      <option value="de">🇩🇪 German (Deutsch)</option>
                      <option value="zh">🇨🇳 Mandarin (中文)</option>
                    </select>

                    <button
                      onClick={handleAutoCaptionGenerate}
                      className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-bold py-1.5 px-3 rounded-lg text-xs tracking-wide cursor-pointer transition text-center"
                    >
                      Generate Closed-Captions
                    </button>
                  </div>
                </div>

                {/* Subtitle styles */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Style Typography</label>
                    <select 
                      value={subFont} 
                      onChange={(e) => setSubFont(e.target.value)}
                      className="w-full bg-black border border-white/10 p-1.5 rounded-lg text-[11px]"
                    >
                      <option value="Inter Bold">Inter Bold (Sans)</option>
                      <option value="JetBrains Mono">JetBrains Mono (Sleek)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Caption Animation</label>
                    <select 
                      value={subtitleEffect} 
                      onChange={(e) => setSubtitleEffect(e.target.value as any)}
                      className="w-full bg-black border border-white/10 p-1.5 rounded-lg text-[11px]"
                    >
                      <option value="typewriter">Typewriter flow</option>
                      <option value="fade">Smooth Fade-in</option>
                      <option value="slide">Slide up overlay</option>
                      <option value="none">Flat Static subtitle</option>
                    </select>
                  </div>
                </div>

                {/* Manual subtitling list */}
                <div className="space-y-2 border-t border-white/10 pt-3">
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Manual Captions Tracks</span>
                  <div className="max-h-[140px] overflow-y-auto pr-1 space-y-1.5">
                    {project.subtitles.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between gap-2 p-1.5 rounded bg-black/30 border border-white/5 text-[11px]">
                        <span className="text-gray-400 shrink-0 font-mono">[{sub.timeStart}-{sub.timeEnd}s]</span>
                        <span className="text-white truncate flex-1">{sub.text}</span>
                        <button
                          onClick={() => handleRemoveSubtitle(sub.id)}
                          className="text-red-400 hover:text-red-300 p-0.5"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Mini Manual Sub Add Form */}
                  <div className="flex gap-1">
                    <input
                      type="text"
                      placeholder="Add a custom manual caption..."
                      value={subtitleText}
                      onChange={(e) => setSubtitleText(e.target.value)}
                      className="flex-1 bg-black text-xs border border-white/10 p-1.5 rounded-lg text-white"
                    />
                    <button
                      onClick={handleAddSubtitle}
                      className="bg-cyan-500 text-black text-xs font-bold px-2.5 py-1 rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: AI Enhancement tools */}
            {activeTab === 'ai' && (
              <div className="space-y-3 animate-fade-in text-xs text-gray-300">
                <p className="text-[11px] text-gray-400 leading-relaxed mb-1">
                  Inject high-performance algorithmic enhancers running on our GPU server farms.
                </p>

                {/* AI Reframe */}
                <div 
                  onClick={() => setProject(prev => ({ ...prev, aiReframed: !prev.aiReframed }))}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition duration-150 ${
                    project.aiReframed 
                      ? 'border-violet-500 bg-violet-950/20' 
                      : 'border-white/5 bg-black/20 hover:border-white/10'
                  }`}
                >
                  <div className="space-y-0.5 pr-4">
                    <p className="font-bold text-white flex items-center gap-1">
                      🤖 AI Smart Re-Frame (Vertical Focus)
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Auto-tracks face centroids and main motion dynamics to crop widescreen 16:9 videos into clean focal-centered vertical reels.
                    </p>
                  </div>
                  <span className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${
                    project.aiReframed ? 'bg-violet-500 border-violet-400 text-white' : 'border-white/20'
                  }`}>
                    {project.aiReframed && '✓'}
                  </span>
                </div>

                {/* AI Upscaler */}
                <div 
                  onClick={() => setProject(prev => ({ ...prev, aiUpscaled: !prev.aiUpscaled }))}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition duration-150 ${
                    project.aiUpscaled 
                      ? 'border-cyan-400 bg-cyan-950/20' 
                      : 'border-white/5 bg-black/20 hover:border-white/10'
                  }`}
                >
                  <div className="space-y-0.5 pr-4">
                    <p className="font-bold text-white flex items-center gap-1">
                      🌟 AI 4K Upscaler-Enhancer
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Super-resolves generative low count macroblocks into pristine high detail pixel streams.
                    </p>
                  </div>
                  <span className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${
                    project.aiUpscaled ? 'bg-cyan-500 border-cyan-400 text-black' : 'border-white/20'
                  }`}>
                    {project.aiUpscaled && '✓'}
                  </span>
                </div>

                {/* AI Background removal */}
                <div 
                  onClick={() => setProject(prev => ({ ...prev, bgRemoved: !prev.bgRemoved }))}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition duration-150 ${
                    project.bgRemoved 
                      ? 'border-pink-500 bg-pink-950/20' 
                      : 'border-white/5 bg-black/20 hover:border-white/10'
                  }`}
                >
                  <div className="space-y-0.5 pr-4">
                    <p className="font-bold text-white flex items-center gap-1">
                      🟢 ChromaKey Background Replacement
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Mask transparent silhouettes, separating background textures from foreground objects cleanly.
                    </p>
                  </div>
                  <span className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${
                    project.bgRemoved ? 'bg-pink-500 border-pink-400 text-white' : 'border-white/20'
                  }`}>
                    {project.bgRemoved && '✓'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Export block */}
          <div className="pt-6 border-t border-white/10 space-y-3 bg-[#0c0c16] p-4 rounded-xl mt-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Export Sequence Settings</span>
            <div className="flex gap-2">
              <select
                value={exportQuality}
                onChange={(e) => setExportQuality(e.target.value as any)}
                className="bg-black text-xs text-white border border-white/10 p-2 rounded-lg"
              >
                <option value="720p">720p HD Standard</option>
                <option value="1080p">1080p Full HD</option>
                <option value="4K">4K Ultra HD (VIP Unlimited)</option>
              </select>

              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as any)}
                className="bg-black text-xs text-white border border-white/10 p-2 rounded-lg"
              >
                <option value="mp4">Format: MP4</option>
                <option value="mov">Format: MOV</option>
              </select>

              <button
                id="export-render-btn"
                onClick={handleExport}
                className="flex-1 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-xs text-white font-bold py-2 rounded-lg hover:brightness-110 cursor-pointer shadow-md transition text-center flex items-center justify-center gap-1.5"
              >
                <Download className="h-4.5 w-4.5" /> Export Render
              </button>
            </div>

            {exportingProgress !== null && (
              <div className="space-y-1.5 pt-2 animate-fade-in">
                <div className="flex justify-between text-[10px] text-cyan-300 font-mono">
                  <span>Rendering static multiplex packets...</span>
                  <span>{exportingProgress}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-400" style={{ width: `${exportingProgress}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HORIZONTAL MULTI-LAYER TIMELINE (Bottom Section) */}
      <div id="multi-layer-timeline-track" className="rounded-2xl border border-white/10 bg-[#07070d]/95 p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Grid className="h-4.5 w-4.5 text-violet-400" />
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Multi-Layer Timeline Track Editor</h4>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
            <span>Playhead: <strong className="text-cyan-400">{playheadTime.toFixed(2)}s</strong></span>
            <span>Total: <strong className="text-gray-300">{project.duration.toFixed(1)}s</strong></span>
          </div>
        </div>

        {/* Timeline Tracks board */}
        <div className="space-y-2 select-none overflow-x-auto min-w-full">
          {[
            { id: 'video', name: '🎥 Video Track', color: 'from-violet-600/30 to-violet-500/20', label: 'Primary Video sequence', detail: 'Main Gen Matrix' },
            { id: 'audio', name: '🎵 Audio Dubs', color: 'from-cyan-600/30 to-cyan-500/20', label: project.musicId ? `BGM: ${project.musicId}` : 'Raw Native Mic/Camera Feed', detail: 'Volume leveling 100%' },
            { id: 'text', name: '💬 Overlays', color: 'from-amber-600/30 to-amber-500/20', label: `Subtitles: ${project.subtitles.length} triggers`, detail: 'Captions mapped flat' },
            { id: 'effects', name: '✨ LUT Filters', color: 'from-pink-600/30 to-pink-500/20', label: `Active LUT: ${project.lutFilter}`, detail: 'Shader profile applied' },
            { id: 'transitions', name: '💫 Transitions', color: 'from-emerald-600/30 to-emerald-500/20', label: '100+ Fade Presets mapped', detail: 'Cross dissolve' }
          ].map((track) => (
            <div 
              key={track.id}
              onClick={() => setSelectedTrackItem({ trackId: track.id, itemId: `${track.id}-item` })}
              className={`flex items-center gap-4 p-2 rounded-xl border transition-all duration-150 ${
                selectedTrackItem?.trackId === track.id ? 'bg-white/5 border-violet-500/50' : 'bg-black/20 border-white/5 hover:border-white/10'
              }`}
            >
              {/* Left track headers */}
              <div className="w-[120px] shrink-0 text-left">
                <span className="text-[10px] font-black text-white block uppercase tracking-wide">{track.name}</span>
                <span className="text-[9px] text-gray-500 block leading-tight">{track.detail}</span>
              </div>

              {/* Right timeline blocks strip representing total duration */}
              <div className="flex-1 h-10 rounded-lg bg-black/40 border border-white/5 relative overflow-hidden flex items-center px-4">
                {/* Simulated playback playhead bar indicator */}
                <div 
                  className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-10 transition-all duration-150"
                  style={{ left: `${(playheadTime / project.duration) * 100}%` }}
                />

                {/* Main block bar representing content span */}
                <div 
                  className={`h-7 rounded-md bg-gradient-to-r ${track.color} border border-white/10 flex items-center justify-between px-3 text-[10px] transition duration-200 cursor-pointer w-full`}
                >
                  <span className="font-bold text-white truncate">{track.label}</span>
                  <span className="text-gray-400 font-mono">{project.duration}s</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline controls metrics description */}
        <div className="text-[10px] text-gray-500 flex justify-between items-center bg-black/20 p-2 rounded-xl">
          <span>💡 Pro Tip: Click any row track header to shift focus. Double click items to edit properties in the sidebar.</span>
          <span>Timeline Lock: ON 🔒</span>
        </div>
      </div>
    </div>
  );
}
