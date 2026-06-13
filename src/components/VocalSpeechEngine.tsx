import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, Play, Pause, Download, RotateCcw, Sparkles, 
  Settings2, Music, Check, UserCheck, AlertCircle, Headphones, Trash2, Mic, Save, Activity
} from 'lucide-react';
import { PRESET_VOICES, VoiceNarrator } from '../types';

interface VocalSpeechEngineProps {
  currentTier?: 'Free' | 'Pro' | 'VIP' | 'Unlimited';
  onOpenBilling?: () => void;
}

interface SavedAudioTrack {
  id: string;
  title: string;
  text: string;
  voiceName: string;
  voiceId: string;
  gender: string;
  avatar: string;
  pitch: number;
  speed: number;
  volume: number;
  createdAt: string;
}

export default function VocalSpeechEngine({ currentTier = 'Free', onOpenBilling }: VocalSpeechEngineProps) {
  const [text, setText] = useState('Welcome to the AI Vocal Narrator Speech Engine. Enter any custom phrase here to convert it into natural, high-fidelity human narration instantly.');
  const [selectedVoice, setSelectedVoice] = useState('deep_cinema');
  const [pitch, setPitch] = useState(1.0);
  const [speed, setSpeed] = useState(1.0);
  const [volume, setVolume] = useState(100);
  const [emphasis, setEmphasis] = useState<'standard' | 'dramatic' | 'whisper' | 'energetic'>('standard');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Waveform visualization canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [savedTracks, setSavedTracks] = useState<SavedAudioTrack[]>(() => {
    const saved = localStorage.getItem('forge_tts_tracks');
    return saved ? JSON.parse(saved) : [
      {
        id: 'track-1',
        title: 'Project Narration Intro',
        text: 'This is the voice of James, directing your technical startup launch campaign.',
        voiceName: 'James (Deep Cinematic)',
        voiceId: 'deep_cinema',
        gender: 'Male',
        avatar: '🎙️',
        pitch: 1.0,
        speed: 1.0,
        volume: 100,
        createdAt: '2026-06-13 14:15'
      }
    ];
  });

  // Track presets
  const textPresets = [
    { label: '🔥 Motivational Quote', text: 'Success is not final, failure is not fatal: it is the courage to continue that counts. Rise copywriters and builders.' },
    { label: '📘 Explainer/Tutorial', text: 'In this step-by-step breakdown, we will discover how multi-layered timeline systems execute secure cloud transactions in less than two seconds.' },
    { label: '🎬 Movie Trailer Intro', text: 'In a world controlled by algorithmic streams, one creative mind dares to forge original content. Coming this summer.' },
    { label: '💫 Calm Meditation', text: 'Take a deep breath in. Let go of all the tension in your shoulders, and gently steady your mind to the silent natural rhythms.' }
  ];

  // Save tracks to storage on change
  useEffect(() => {
    localStorage.setItem('forge_tts_tracks', JSON.stringify(savedTracks));
  }, [savedTracks]);

  // Cancel any speaker on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Web Speech API Voice Selection Support
  const getSpeechVoice = (narrator: VoiceNarrator) => {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    
    // Attempt custom matched search
    const matchingVoice = voices.find(v => {
      const vName = v.name.toLowerCase();
      const nName = narrator.name.toLowerCase().split(' ')[0]; // match James, Chloe, etc.
      return vName.includes(nName);
    });

    if (matchingVoice) return matchingVoice;

    // Direct gender fallbacks
    const fallbackList = voices.filter(v => {
      const vName = v.name.toLowerCase();
      if (narrator.gender === 'Male') {
        return vName.includes('male') || vName.includes('david') || vName.includes('microsoft') || vName.includes('google us english') || vName.includes('en-us');
      } else {
        return vName.includes('female') || vName.includes('zira') || vName.includes('hazel') || vName.includes('google uk english female') || vName.includes('en-gb');
      }
    });

    return fallbackList.length > 0 ? fallbackList[0] : null;
  };

  // Draw simulated or active waveform
  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width;
    let height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Gradient styling for frequency elements
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#8b5cf6'); // Violet-500
    gradient.addColorStop(0.5, '#06b6d4'); // Cyan-500
    gradient.addColorStop(1, '#ec4899'); // Pink-500

    ctx.fillStyle = gradient;

    const barWidth = 3;
    const gap = 2;
    const barCount = Math.floor(width / (barWidth + gap));
    const renderTime = Date.now() / 150;

    for (let i = 0; i < barCount; i++) {
      // Dynamic noise calculation depending on playing state
      let ratio = 0.15;
      if (isPlaying) {
        // Higher activity peaks with mathematical sinus wave combinations
        ratio = 0.3 + 0.6 * Math.abs(
          Math.sin(i * 0.15 + renderTime) * Math.cos(i * 0.05 - renderTime * 0.8)
        );
        // Custom emphasis multiplication
        if (emphasis === 'dramatic') ratio *= 1.35;
        if (emphasis === 'whisper') ratio *= 0.45;
        if (emphasis === 'energetic') ratio *= 1.5;
      } else {
        // Idle heartbeat wave
        ratio = 0.05 + 0.08 * Math.sin(i * 0.1 + Date.now() / 1000);
      }

      // Constrain ratio
      ratio = Math.max(0.02, Math.min(ratio, 0.95));
      const barHeight = height * ratio;
      const x = i * (barWidth + gap);
      const y = (height - barHeight) / 2;

      ctx.fillRect(x, y, barWidth, barHeight);
    }

    animationRef.current = requestAnimationFrame(drawWaveform);
  };

  // Trigger continuous rendering animation loop on mount or state toggling
  useEffect(() => {
    drawWaveform();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, emphasis]);

  const handleSpeechAction = () => {
    if (!('speechSynthesis' in window)) {
      alert('Local browser Speech Synthesis APIs are disabled or unsupported in this sandboxed layout.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    if (!text.trim()) return;

    window.speechSynthesis.cancel();
    
    // Parse current choice
    const voiceObject = PRESET_VOICES.find(v => v.id === selectedVoice) || PRESET_VOICES[0];
    
    // Create new voice speech instance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Establish configurations
    utterance.volume = volume / 100;
    
    // Map custom tags
    let modifierPitch = pitch;
    let modifierRate = speed;

    if (emphasis === 'dramatic') {
      modifierPitch = pitch * 0.85;
      modifierRate = speed * 0.85;
    } else if (emphasis === 'whisper') {
      modifierPitch = pitch * 1.15;
      modifierRate = speed * 0.75;
    } else if (emphasis === 'energetic') {
      modifierPitch = pitch * 1.05;
      modifierRate = speed * 1.25;
    }

    utterance.pitch = modifierPitch;
    utterance.rate = modifierRate;

    // Apply exact target language voice
    const chosenVoiceProfile = getSpeechVoice(voiceObject);
    if (chosenVoiceProfile) {
      utterance.voice = chosenVoiceProfile;
    }

    // Handlers
    utterance.onend = () => {
      setIsPlaying(false);
    };
    utterance.onerror = () => {
      setIsPlaying(false);
    };

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleExportSample = () => {
    if (!text.trim()) return;
    setIsExporting(true);

    // Simulate high-definition TTS generation
    setTimeout(() => {
      const voiceObject = PRESET_VOICES.find(v => v.id === selectedVoice) || PRESET_VOICES[0];
      const newTrack: SavedAudioTrack = {
        id: 'track-' + Math.floor(Math.random() * 1000000),
        title: text.split(' ').slice(0, 4).join(' ') + '...',
        text: text.trim(),
        voiceName: voiceObject.name,
        voiceId: voiceObject.id,
        gender: voiceObject.gender,
        avatar: voiceObject.avatar,
        pitch: pitch,
        speed: speed,
        volume: volume,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };

      setSavedTracks(prev => [newTrack, ...prev]);
      setIsExporting(false);
    }, 2000);
  };

  const deleteTrack = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedTracks(prev => prev.filter(t => t.id !== id));
  };

  const loadTrack = (track: SavedAudioTrack) => {
    setText(track.text);
    setSelectedVoice(track.voiceId);
    setPitch(track.pitch);
    setSpeed(track.speed);
    setVolume(track.volume);
  };

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <span className="text-[10px] bg-violet-950 text-violet-400 border border-violet-500/20 px-2.5 py-1 rounded font-black font-mono uppercase tracking-widest leading-none">
            🎙️ VOCAL CORES ACTIVATED
          </span>
          <h1 className="text-2xl font-black text-white mt-2 tracking-tight">
            AI Vocal Narrator Speech Engine
          </h1>
          <p className="text-xs text-gray-400 max-w-xl mt-1 leading-relaxed">
            Synthesize real-human voiceovers directly from narrative script logs. Our vocal engine utilizes localized sound synthesis libraries for perfect pacing.
          </p>
        </div>

        {/* Free Tier Callout if not unlimited */}
        {currentTier !== 'Unlimited' && (
          <div className="bg-[#14121b] border border-amber-500/20 p-3 rounded-xl flex items-center gap-3">
            <Headphones className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-[10px] text-amber-400 uppercase font-black tracking-wider leading-none">Free Voice Pipeline Mode</p>
              <p className="text-[11px] text-zinc-400 mt-0.5 leading-none">Upgrade to unlock ultra high-definition audio exports.</p>
            </div>
            {onOpenBilling && (
              <button 
                onClick={onOpenBilling}
                className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[10px] px-2.5 py-1 rounded-md transition cursor-pointer"
              >
                Upgrade
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grid Layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Interactive Input & Voice Controls Pane */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main TTS Input section */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] text-gray-400 uppercase font-bold tracking-widest font-mono flex items-center gap-1.5">
                <Mic className="h-4 w-4 text-violet-400" />
                Script Text Formulation
              </span>
              <span className="text-[10.5px] font-mono text-zinc-500">
                {text.length} characters
              </span>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Input transcript voice script, movie dialogue, or educational slides text right here..."
              className="w-full h-36 bg-black/60 border border-white/10 rounded-xl p-4 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition resize-none leading-relaxed"
            />

            {/* Quick Presets row */}
            <div className="space-y-2">
              <p className="text-[9.5px] text-gray-500 uppercase font-bold tracking-wider font-mono">Quick Action Script Prompts:</p>
              <div className="flex flex-wrap gap-2">
                {textPresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => setText(preset.text)}
                    className="text-[10.5px] bg-[#141421] border border-white/5 hover:border-violet-500/25 text-gray-300 hover:text-white px-2.5 py-1 rounded-md transition cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Parameters & Waveform Visualisation Row */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <span className="text-[10.5px] text-gray-400 uppercase font-bold tracking-widest font-mono flex items-center gap-1.5">
                <Settings2 className="h-4 w-4 text-cyan-400" />
                Sound Parameter Controller
              </span>
              <span className="text-[10px] text-cyan-400 font-mono tracking-wider font-extrabold flex items-center gap-1">
                <span className={`h-2 w-2 rounded-full ${isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-cyan-500'}`} />
                {isPlaying ? 'RENDER STREAMING ACTIVE' : 'NODE READY'}
              </span>
            </div>

            {/* Live Canvas visualizer */}
            <div className="bg-black/80 rounded-xl p-4 border border-zinc-800/80 relative flex flex-col justify-center items-center h-28 overflow-hidden">
              <canvas 
                ref={canvasRef} 
                width={500} 
                height={80} 
                className="w-full max-w-lg h-20 opacity-85" 
              />
              <span className="absolute bottom-2 text-[9px] font-mono text-zinc-500 lowercase tracking-widest">
                {isPlaying ? 'active frequency modular analyzer (WebSpeech)' : 'idle heartbeat frequency monitor'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Vocal Pitch Level</span>
                  <span className="font-mono text-violet-400 font-bold">{pitch.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="1.5" 
                  step="0.1" 
                  value={pitch} 
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full accent-violet-500 bg-zinc-800 rounded-lg appearance-none h-1.5"
                />
                <p className="text-[9px] text-gray-500 leading-none">Controls deep cinematic base vs high acute sound pitch.</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Elocution Pace/Speed</span>
                  <span className="font-mono text-cyan-400 font-bold">{speed.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="2.0" 
                  step="0.1" 
                  value={speed} 
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 bg-zinc-800 rounded-lg appearance-none h-1.5"
                />
                <p className="text-[9px] text-gray-500 leading-none">Adjust pronunciation narration speed intervals.</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Vocal Volume</span>
                  <span className="font-mono text-pink-400 font-bold">{volume}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={volume} 
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-full accent-pink-500 bg-zinc-800 rounded-lg appearance-none h-1.5"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-medium block">Intonation Style</label>
                <div className="grid grid-cols-2 gap-1.5 mt-2">
                  {(['standard', 'dramatic', 'whisper', 'energetic'] as const).map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setEmphasis(style)}
                      className={`py-1.5 px-2 rounded-lg text-[10px] font-bold text-center border capitalize transition cursor-pointer ${
                        emphasis === style 
                          ? 'bg-violet-950/40 border-violet-500 text-white' 
                          : 'bg-black/30 border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Vocal Execution Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleSpeechAction}
                disabled={!text.trim()}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl font-bold uppercase text-xs flex items-center justify-center gap-2 cursor-pointer transition text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4 text-black fill-black" />
                    <span>Halt Vocal Narration</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 text-black fill-black" />
                    <span>Speak/Synthesize Narration 🔊</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleExportSample}
                disabled={isExporting || !text.trim()}
                className="w-full sm:w-auto py-3 px-5 rounded-xl font-bold uppercase text-xs flex items-center justify-center gap-2 cursor-pointer border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white transition disabled:opacity-50 font-mono"
              >
                {isExporting ? (
                  <>
                    <Activity className="h-4 w-4 animate-spin text-violet-400" />
                    <span>Compiling...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 text-violet-400" />
                    <span>Save Audio Track</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

        {/* Right Voice Actress Selector / Saved Records Panel (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Preset voice catalog */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 font-mono">
              Available Narrators ({PRESET_VOICES.length})
            </h4>

            <div className="space-y-3">
              {PRESET_VOICES.map((voice) => {
                const isProLock = (voice.id === 'motivation_coach' || voice.id === 'scenic_teller') && currentTier === 'Free';
                const isVipLock = voice.id === 'tech_expert' && currentTier !== 'Unlimited';
                const isLocked = isProLock || isVipLock;
                const isChosen = selectedVoice === voice.id;

                return (
                  <div
                    key={voice.id}
                    onClick={() => {
                      if (isLocked) {
                        if (onOpenBilling) {
                          onOpenBilling();
                        } else {
                          alert("Premium voice overs require upgrade.");
                        }
                      } else {
                        setSelectedVoice(voice.id);
                      }
                    }}
                    className={`flex items-start justify-between p-3 rounded-xl border transition cursor-pointer text-left relative ${
                      isLocked 
                        ? 'border-dashed border-white/5 bg-black/15 hover:border-violet-500/30 opacity-75'
                        : isChosen 
                        ? 'border-violet-500 bg-violet-950/25 shadow-lg shadow-violet-500/5' 
                        : 'border-white/5 bg-black/30 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex gap-3 min-w-0">
                      <span className="text-2xl mt-1 shrink-0">{voice.avatar}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-white leading-none">{voice.name}</span>
                          <span className={`text-[8.5px] px-1 py-0.2 rounded uppercase font-mono font-bold shrink-0 ${
                            voice.gender === 'Male' ? 'bg-blue-950 text-blue-400 border border-blue-500/15' : 'bg-pink-950 text-pink-400 border border-pink-500/15'
                          }`}>
                            {voice.gender}
                          </span>
                          {isProLock && (
                            <span className="text-[8px] bg-violet-950/60 text-violet-400 border border-violet-500/35 px-1 py-0.2 rounded font-black font-mono">
                              PRO 🔒
                            </span>
                          )}
                          {isVipLock && (
                            <span className="text-[8px] bg-amber-950/60 text-amber-400 border border-amber-500/35 px-1 py-0.2 rounded font-black font-mono">
                              VIP 🔒
                            </span>
                          )}
                        </div>
                        <p className="text-[9.5px] text-violet-300 font-mono mt-1">{voice.style}</p>
                        <p className="text-[10px] text-gray-400 line-clamp-2 mt-1.5 font-medium leading-relaxed">{voice.description}</p>
                      </div>
                    </div>

                    {isChosen && !isLocked && (
                      <span className="h-5 w-5 rounded-full bg-violet-500/10 border border-violet-500/40 flex items-center justify-center shrink-0 self-center ml-2">
                        <Check className="h-3 w-3 text-violet-400" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Saved Narration Tracks library */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center justify-between font-mono">
              <span>Saved Audio Tracks ({savedTracks.length})</span>
              <span className="text-[9px] text-zinc-500 font-sans tracking-tight">saved locally</span>
            </h4>

            {savedTracks.length === 0 ? (
              <div className="py-8 text-center text-zinc-600 text-xs border border-dashed border-white/5 rounded-xl">
                No custom speech cards computed yet.
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {savedTracks.map((track) => (
                  <div
                    key={track.id}
                    onClick={() => loadTrack(track)}
                    className="p-3 bg-black/40 border border-white/5 hover:border-white/10 rounded-xl transition text-left cursor-pointer flex justify-between items-center group gap-2"
                  >
                    <div className="min-w-0 flex items-center gap-3">
                      <span className="text-xl bg-zinc-900 border border-zinc-800 p-1.5 rounded-lg shrink-0">
                        {track.avatar}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate leading-none">{track.title}</p>
                        <p className="text-[9.5px] text-zinc-500 mt-1 flex items-center gap-1 truncate">
                          <span>{track.voiceName}</span>
                          <span>•</span>
                          <span>{track.text.split(' ').length} words</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Simulates browser mp3 downloading
                          const link = document.createElement('a');
                          link.href = '#';
                          alert(`Simulating HD MP3 download for track: "${track.title}" (Voice: ${track.voiceName})`);
                        }}
                        className="p-1 px-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-violet-400 hover:text-white rounded text-[10px] transition cursor-pointer flex items-center gap-1"
                        title="Download speech track as MP3"
                      >
                        <Download className="h-3 w-3" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => deleteTrack(track.id, e)}
                        className="p-1 text-zinc-600 hover:text-rose-400 transition cursor-pointer"
                        title="Delete track"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
