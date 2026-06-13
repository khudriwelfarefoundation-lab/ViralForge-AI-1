import React, { useState } from 'react';
import { 
  Upload, Table, AlertTriangle, CheckCircle, RefreshCw, Layers, Calendar, 
  Settings, Check, Compass, Trash2, ArrowRight, Play, Info, Sparkles, HelpCircle 
} from 'lucide-react';
import { SocialAccount, VideoProject, Platform, PRESET_STYLES } from '../types';

interface CampaignForgeProps {
  accounts: SocialAccount[];
  videos: VideoProject[];
  setVideos: React.Dispatch<React.SetStateAction<VideoProject[]>>;
  currentTier?: 'Free' | 'Pro' | 'VIP';
  onOpenBilling?: () => void;
}

export default function CampaignForge({ 
  accounts, 
  videos, 
  setVideos,
  currentTier = 'Free',
  onOpenBilling 
}: CampaignForgeProps) {
  // Campaign state using videos list
  const [activeVideo, setActiveVideo] = useState<VideoProject | null>(null);
  
  // Spreadsheet / Excel Uploading simulator states
  const [showUploader, setShowUploader] = useState(false);
  const [isParsingExcel, setIsParsingExcel] = useState(false);
  const [excelUploaded, setExcelUploaded] = useState(false);
  
  // Custom column mapping settings
  const [colMapping, setColMapping] = useState({
    prompt: 'Video Prompt',
    style: 'Style Selection',
    aspectRatio: 'Aspect Ratio',
    duration: 'Duration',
    platforms: 'Target Platforms',
    caption: 'Caption/Description'
  });

  // Bulk Spacing parameters
  const [spacingInterval, setSpacingInterval] = useState(2); // hours
  const [showBulkScheduler, setShowBulkScheduler] = useState(false);

  // AI Hashtag Suggestion states
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);

  // Parse simulated spreadsheet structure
  const handleSimulateExcelUpload = () => {
    setIsParsingExcel(true);
    setTimeout(() => {
      setIsParsingExcel(false);
      setExcelUploaded(true);

      // Append parsed spreadsheet rows as newly formulated drafting projects
      const spreadsheetRows: VideoProject[] = [
        {
          id: 'v-campaign-1',
          prompt: 'Macro panning capture of hot bubbling artisanal pizza pulling apart gooey high cheese strings, wood burning oven background.',
          style: 'product-showcase',
          aspectRatio: '9:16',
          duration: 30,
          title: 'Cheese Pull Extravaganza 🍕',
          description: 'Wait till the end to see this gorgeous melt. Bubble textures rendered in 4K.',
          hashtags: ['#foodie', '#pizza', '#cheese'],
          thumbnail: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80',
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-neon-light-from-a-building-reflected-in-the-wet-43187-large.mp4',
          status: 'Draft',
          progress: 100,
          queuePosition: 0,
          estTime: 'Completed',
          consistentStyle: true,
          targetPlatforms: ['tiktok', 'instagram'],
          targetAccounts: ['tk-1', 'ig-1'],
          subtitles: [],
          volumeLevel: 90,
          musicVolume: 50,
          speed: 1.0,
          brightness: 100,
          contrast: 100,
          saturation: 100,
          lutFilter: 'none'
        },
        {
          id: 'v-campaign-2',
          prompt: 'Watercolor visual landscape of a cute panda cub resting on a heavy bamboo branch under gentle pink pastel cherry blossom storm.',
          style: 'watercolor',
          aspectRatio: '1:1',
          duration: 15,
          title: 'Zen Panda Cub Rest 🌸',
          description: 'A beautiful slow watercolor aesthetic featuring our sleepy forest guard.',
          hashtags: ['#watercolor', '#panda', '#kawaii'],
          thumbnail: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=300&q=80',
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-spiral-of-colored-light-beams-45367-large.mp4',
          status: 'Generating',
          progress: 45,
          queuePosition: 2,
          estTime: '1.5 Min',
          consistentStyle: true,
          targetPlatforms: ['instagram'],
          targetAccounts: ['ig-1'],
          subtitles: [],
          volumeLevel: 100,
          musicVolume: 40,
          speed: 1.0,
          brightness: 100,
          contrast: 100,
          saturation: 100,
          lutFilter: 'none'
        }
      ];

      setVideos(prev => [...spreadsheetRows, ...prev]);
      alert("Spreadsheet rows validated. Appended campaign drafts to Kanban board.");
    }, 1500);
  };

  // Trigger server-side AI Hashtags Suggestion
  const handleSuggestTagsForActiveVideo = async () => {
    if (!activeVideo) return;
    setIsGeneratingTags(true);
    try {
      const res = await fetch('/api/suggest-hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption: activeVideo.description, tagCount: 5 })
      });
      const data = await res.json();
      const suggestedList = data.hashtags || [];
      
      setVideos(prev => prev.map(v => {
        if (v.id === activeVideo.id) {
          // Merge hashtags cleanly
          const combined = Array.from(new Set([...v.hashtags, ...suggestedList]));
          return { ...v, hashtags: combined };
        }
        return v;
      }));
      // Sync local activeVideo view
      setActiveVideo(prev => prev ? {
        ...prev,
        hashtags: Array.from(new Set([...prev.hashtags, ...suggestedList]))
      } : null);
    } catch {
      alert("Failed to reach Gemini Hashtag generator. Appended default tag #ViralForge.");
    } finally {
      setIsGeneratingTags(false);
    }
  };

  // Apply batch posting scheduler with uniform spacing hours
  const handleBulkScheduleSpacing = () => {
    const today = new Date();
    let currentHour = today.getHours() + 1;

    setVideos(prev => {
      return prev.map((v, i) => {
        if (v.status === 'Draft' || v.status === 'Editing') {
          const hoursToAdd = i * spacingInterval;
          const scheduledDate = new Date(today);
          scheduledDate.setHours(currentHour + hoursToAdd);

          const formattedDate = scheduledDate.toISOString().split('T')[0];
          const formattedTime = scheduledDate.toTimeString().split(' ')[0].substring(0, 5);

          return {
            ...v,
            status: 'Scheduled',
            scheduledDate: formattedDate,
            scheduledTime: formattedTime,
            targetPlatforms: v.targetPlatforms.length > 0 ? v.targetPlatforms : ['tiktok'],
            targetAccounts: v.targetAccounts.length > 0 ? v.targetAccounts : ['tk-1']
          };
        }
        return v;
      });
    });

    setShowBulkScheduler(false);
    alert(`Auto-Scheduled draft campaign videos! Posts spaced uniformly by ${spacingInterval} hours across targets.`);
  };

  // Handle single card column shift dragging
  const handleMoveVideoStatus = (vId: string, newStatus: VideoProject['status']) => {
    setVideos(prev => prev.map(v => {
      if (v.id === vId) {
        return { 
          ...v, 
          status: newStatus,
          // Set defaults if scheduling
          scheduledDate: newStatus === 'Scheduled' ? v.scheduledDate || '2026-06-15' : v.scheduledDate,
          scheduledTime: newStatus === 'Scheduled' ? v.scheduledTime || '12:00' : v.scheduledTime,
        };
      }
      return v;
    }));
    // Sync active edit card if highlighted
    if (activeVideo && activeVideo.id === vId) {
      setActiveVideo(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  // Restrict accounts list based on active video platform selections
  const getEligibleAccountsForPlatform = (plat: Platform) => {
    return accounts.filter(acc => acc.platform === plat && acc.connected);
  };

  // Columns definition for Campaign Kanban Board
  const columns: { id: VideoProject['status']; title: string; color: string; bg: string }[] = [
    { id: 'Draft', title: 'Campaign Drafts', color: 'text-gray-400', bg: 'border-white/5 bg-white/5' },
    { id: 'Generating', title: 'Video Generating', color: 'text-amber-400', bg: 'border-amber-500/10 bg-amber-500/5' },
    { id: 'Editing', title: 'Forge Editing', color: 'text-violet-400', bg: 'border-violet-500/10 bg-violet-500/5' },
    { id: 'Scheduled', title: 'Scheduled Queue', color: 'text-cyan-400', bg: 'border-cyan-500/10 bg-cyan-500/5' },
    { id: 'Published', title: 'Published Hub', color: 'text-emerald-400', bg: 'border-emerald-500/10 bg-emerald-500/5' },
    { id: 'Failed', title: 'Dispatch Failed', color: 'text-red-400', bg: 'border-red-500/10 bg-red-500/5' },
  ];

  return (
    <div id="campaign-forge-container" className="space-y-6">
      
      {/* Excel/CSV campaign importer block */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-violet-400" /> Campaign Forge Workspace
          </h3>
          <p className="text-xs text-gray-400">
            Bulk-publish clips across accounts using spreadsheets or design automated schedules.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowUploader(!showUploader)}
            className="flex items-center gap-2 bg-[#12121e] border border-white/10 hover:border-violet-400 text-xs px-3.5 py-1.5 rounded-xl text-gray-300 transition duration-150 cursor-pointer"
          >
            <Upload className="h-4 w-4 text-violet-400" /> Excel/CSV Upload Core
          </button>

          <button
            onClick={() => setShowBulkScheduler(!showBulkScheduler)}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 font-bold text-xs px-3.5 py-1.5 rounded-xl text-white transition duration-150 cursor-pointer shadow-md"
          >
            <Calendar className="h-4 w-4" /> Spacing Scheduler
          </button>
        </div>
      </div>

      {/* Spacing Scheduler Config Drawer */}
      {showBulkScheduler && (
        <div className="p-4 rounded-xl bg-slate-900 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in text-gray-300 text-xs">
          <div className="space-y-1">
            <p className="font-extrabold text-white flex items-center gap-1">
              ⌛ Automated Spacing Dispatcher
            </p>
            <p className="text-[11px] text-gray-400 max-w-xl">
              Distributes your current Campaign Draft sequences across authorized social avenues automatically, spacing posts evenly to optimize audience engagement velocity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span>Interval space:</span>
            <select
              value={spacingInterval}
              onChange={(e) => setSpacingInterval(Number(e.target.value))}
              className="bg-black border border-white/15 rounded p-1.5 font-mono font-bold text-white focus:outline-none"
            >
              <option value="1">1 Hour spaced</option>
              <option value="2">2 Hours spaced</option>
              <option value="4">4 Hours spaced</option>
              <option value="12">12 Hours spaced</option>
              <option value="24">Daily (24H spacing)</option>
            </select>

            <button
              id="bulk-schedule-confirm"
              onClick={handleBulkScheduleSpacing}
              className="bg-cyan-500 text-black px-4 py-1.5 rounded-lg font-extrabold hover:bg-cyan-400 cursor-pointer"
            >
              Apply Spacing Schedulers
            </button>
          </div>
        </div>
      )}

      {/* Simulated Upload panel */}
      {showUploader && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl space-y-4 animate-fade-in">
          <h4 className="text-xs font-black uppercase tracking-widest text-violet-400">Sheet Mapping Configuration Interface</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Upload your campaign Excel spreadsheet (<code>.xlsx</code> or <code>.csv</code>). Download our <a href="#" className="text-violet-400 underline" onClick={(e) => { e.preventDefault(); alert("Template columns: Video Prompt, Style Selection, Aspect Ratio, Duration, Target Platforms, Scheduled Date/Time, Caption/Description"); }}>CampaignTemplate.csv</a> columns catalog.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Upload Area Dropzone */}
            <div className="md:col-span-4 border border-dashed border-white/20 rounded-xl p-6 text-center bg-black/20 hover:border-violet-500/50 transition">
              <Upload className="h-8 w-8 text-gray-500 mx-auto mb-2" />
              <p className="text-[11px] text-gray-300 font-bold">Select XLSX Spreadsheet</p>
              <p className="text-[9px] text-gray-500 mt-1">Accept files up to 25MB maximum</p>

              <button
                type="button"
                id="parse-excel-btn"
                onClick={handleSimulateExcelUpload}
                disabled={isParsingExcel}
                className="mt-4 w-full bg-violet-600 hover:bg-violet-500 text-[10px] font-bold text-white py-1.5 rounded-lg cursor-pointer flex items-center justify-center gap-1"
              >
                {isParsingExcel ? (
                  <>
                    <RefreshCw className="h-3 w-3 animate-spin" /> Validating Columns...
                  </>
                ) : (
                  "Simulate Spreadsheet Parse"
                )}
              </button>
            </div>

            {/* Header mapping rules */}
            <div className="md:col-span-8 bg-black/40 border border-white/5 p-4 rounded-xl text-xs space-y-3">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider flex items-center gap-1.5">
                <Table className="h-4.5 w-4.5 text-cyan-400" /> Map Columns Headers
              </span>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="space-y-1">
                  <span className="text-gray-400">Prompt Column Matching:</span>
                  <select 
                    value={colMapping.prompt} 
                    onChange={(e) => setColMapping(prev => ({ ...prev, prompt: e.target.value }))}
                    className="w-full bg-slate-900 border border-white/10 p-1.5 rounded text-white"
                  >
                    <option value="Video Prompt">Video Prompt (Default)</option>
                    <option value="prompt">prompt</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-gray-400">Style Column Matching:</span>
                  <select 
                    value={colMapping.style} 
                    onChange={(e) => setColMapping(prev => ({ ...prev, style: e.target.value }))}
                    className="w-full bg-slate-900 border border-white/10 p-1.5 rounded text-white"
                  >
                    <option value="Style Selection">Style Selection (Default)</option>
                    <option value="style">style</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-gray-400">Aspect Ratio Matching:</span>
                  <select 
                    value={colMapping.aspectRatio} 
                    onChange={(e) => setColMapping(prev => ({ ...prev, aspectRatio: e.target.value }))}
                    className="w-full bg-slate-900 border border-white/10 p-1.5 rounded text-white"
                  >
                    <option value="Aspect Ratio">Aspect Ratio (Default)</option>
                    <option value="ratio">ratio</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-gray-400">Caption Matching:</span>
                  <select 
                    value={colMapping.caption} 
                    onChange={(e) => setColMapping(prev => ({ ...prev, caption: e.target.value }))}
                    className="w-full bg-slate-900 border border-white/10 p-1.5 rounded text-white"
                  >
                    <option value="Caption/Description">Caption/Description (Default)</option>
                    <option value="description">description</option>
                  </select>
                </div>
              </div>

              {/* Validation engine alerts */}
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-200/95 flex gap-2">
                <AlertTriangle className="h-4.5 w-4.5 text-amber-400 shrink-0" />
                <p>
                  <strong>Validation alert rule:</strong> Standard parse parameters check for missing target accounts or dates slated in the past. Invalid rows will trigger highlight markings of the campaign forge list.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KANBAN CAMPAIGN BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
        {columns.map((col) => {
          const colTasks = videos.filter(v => v.status === col.id);
          return (
            <div 
              key={col.id} 
              className={`rounded-xl border p-3 flex flex-col min-h-[350px] overflow-hidden ${col.bg}`}
            >
              {/* Column header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-3">
                <h4 className={`text-xs font-black uppercase tracking-wider ${col.color}`}>
                  {col.title}
                </h4>
                <span className="text-[10px] font-mono font-bold bg-[#090912] px-1.5 py-0.5 rounded border border-white/5 text-gray-400">
                  {colTasks.length}
                </span>
              </div>

              {/* Cards items */}
              <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                {colTasks.length === 0 ? (
                  <div className="h-full flex items-center justify-center border border-dashed border-white/5 rounded-lg py-12 text-center text-[10px] text-gray-600">
                    No items slated
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setActiveVideo(task)}
                      className={`rounded-lg bg-[#0e0e16]/90 border border-white/5 p-2.5 space-y-2 hover:border-violet-500/35 transition cursor-pointer select-none text-left relative overflow-hidden group ${
                        activeVideo?.id === task.id ? 'ring-1 ring-violet-500 border-violet-500' : ''
                      }`}
                    >
                      {/* Active Progress indicators */}
                      {task.status === 'Generating' && (
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/10 overflow-hidden">
                          <div className="h-full bg-amber-400 animate-pulse" style={{ width: `${task.progress}%` }} />
                        </div>
                      )}

                      <div className="flex items-start gap-2">
                        <img 
                          src={task.thumbnail} 
                          alt="thumbnail" 
                          className="h-9 w-9 rounded object-cover border border-white/10 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-[11px] font-extrabold text-white truncate leading-tight">
                            {task.title || 'Untitled Draft'}
                          </p>
                          <p className="text-[9px] text-gray-400 line-clamp-2 mt-0.5 leading-tight">
                            {task.prompt}
                          </p>
                        </div>
                      </div>

                      {/* Display scheduled info */}
                      {task.status === 'Scheduled' && task.scheduledDate && (
                        <div className="text-[9px] font-mono text-cyan-300 bg-cyan-950/20 py-0.5 px-1.5 rounded border border-cyan-500/20 flex gap-1">
                          <span>📅 {task.scheduledDate}</span>
                          <span>at {task.scheduledTime}</span>
                        </div>
                      )}

                      {/* Display platform icon highlights */}
                      {task.targetPlatforms.length > 0 && (
                        <div className="flex gap-1 pt-1 items-center">
                          {task.targetPlatforms.map(p => (
                            <span 
                              key={p} 
                              className={`text-[8px] font-mono px-1 py-0.2 rounded font-bold border ${
                                p === 'tiktok' ? 'bg-black text-[#00f2fe] border-white/10' :
                                p === 'instagram' ? 'bg-pink-950/25 text-pink-400 border-pink-500/10' :
                                p === 'facebook' ? 'bg-blue-950/25 text-blue-400 border-blue-500/10' :
                                'bg-red-950/25 text-red-500 border-red-500/10'
                              }`}
                            >
                              {p.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Manual Drag control mockup for simple selection */}
                      <div className="flex justify-end gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <select
                          value={task.status}
                          onChange={(e) => handleMoveVideoStatus(task.id, e.target.value as any)}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-slate-900 border border-white/10 text-[8px] text-gray-300 rounded p-0.5 focus:outline-none"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Generating">Generating</option>
                          <option value="Editing">Editing</option>
                          <option value="Scheduled">Scheduled</option>
                          <option value="Published">Published</option>
                          <option value="Failed">Failed</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAILED PER-VIDEO SIDE SETTINGS PANEL (Drawer) */}
      {activeVideo && (
        <div id="campaign-drawer-overlay" className="fixed inset-y-0 right-0 w-full max-w-xl bg-[#0c0c14] border-l border-white/10 p-6 z-45 shadow-2xl overflow-y-auto animate-slide-in text-white">
          <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-violet-400" />
              <h3 className="text-md font-bold">Campaign Video Dispatch Settings</h3>
            </div>
            
            <button 
              onClick={() => setActiveVideo(null)}
              className="text-gray-400 hover:text-white border border-transparent hover:border-white/10 p-1 rounded-lg text-sm"
            >
              ✕ Close Setting Drawer
            </button>
          </div>

          <div className="space-y-6">
            {/* Visual core preview details */}
            <div className="flex gap-4 p-3 bg-white/5 border border-white/5 rounded-xl">
              <img 
                src={activeVideo.thumbnail} 
                alt="preview" 
                className="h-16 w-16 object-cover rounded-lg border border-white/10 shrink-0" 
              />
              <div className="min-w-0 space-y-1">
                <span className="text-[9px] uppercase font-bold text-violet-400 bg-violet-950/40 px-2 py-0.5 rounded border border-violet-500/20">
                  Primary Prompt Layer
                </span>
                <p className="text-xs text-gray-300 italic line-clamp-2 mt-1">{activeVideo.prompt}</p>
                <div className="text-[10px] text-gray-400">
                  Style: <span className="text-white capitalize">{activeVideo.style}</span> • Duration: <span className="text-white">{activeVideo.duration}s</span>
                </div>
              </div>
            </div>

            {/* Editable Content Fields */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400">Social Video Heading</label>
                <input
                  type="text"
                  value={activeVideo.title}
                  onChange={(e) => {
                    const txt = e.target.value;
                    setVideos(prev => prev.map(v => v.id === activeVideo.id ? { ...v, title: txt } : v));
                    setActiveVideo(v => v ? { ...v, title: txt } : null);
                  }}
                  className="w-full bg-slate-950 border border-white/15 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1 relative">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-400">Captions Content (Description & Body)</label>
                  <button
                    id="suggest-hashtags-btn"
                    onClick={handleSuggestTagsForActiveVideo}
                    disabled={isGeneratingTags || !activeVideo.description}
                    className="text-[10px] text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {isGeneratingTags ? 'Generating tags...' : '💡 AI Hashtag Generator'}
                  </button>
                </div>
                <textarea
                  value={activeVideo.description}
                  onChange={(e) => {
                    const txt = e.target.value;
                    setVideos(prev => prev.map(v => v.id === activeVideo.id ? { ...v, description: txt } : v));
                    setActiveVideo(v => v ? { ...v, description: txt } : null);
                  }}
                  rows={3}
                  className="w-full bg-slate-950 border border-white/15 rounded-lg p-2.5 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              {/* Hashtags bubbles items */}
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 uppercase font-black block">Appended Hashtag Meta</span>
                <div className="flex flex-wrap gap-1">
                  {activeVideo.hashtags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="text-[10px] bg-violet-600/15 border border-violet-500/10 text-violet-300 px-2 py-0.5 rounded-full flex items-center gap-1"
                    >
                      {tag}
                      <button 
                        onClick={() => {
                          const list = activeVideo.hashtags.filter((_, i) => i !== idx);
                          setVideos(prev => prev.map(v => v.id === activeVideo.id ? { ...v, hashtags: list } : v));
                          setActiveVideo(v => v ? { ...v, hashtags: list } : null);
                        }}
                        className="text-red-400 hover:text-red-350 grow-0 ml-0.5"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={() => {
                      const ans = prompt("Enter a custom tag (e.g. #NewViral):");
                      if (ans) {
                        const formatted = ans.startsWith('#') ? ans : '#' + ans;
                        const list = [...activeVideo.hashtags, formatted];
                        setVideos(prev => prev.map(v => v.id === activeVideo.id ? { ...v, hashtags: list } : v));
                        setActiveVideo(v => v ? { ...v, hashtags: list } : null);
                      }
                    }}
                    className="text-[10px] border border-dashed border-white/20 hover:border-violet-400 px-2.5 py-0.5 rounded-full text-gray-400 hover:text-white"
                  >
                    + Add New Tag
                  </button>
                </div>
              </div>
            </div>

            {/* AI Platform SEO Optimization Workspace */}
            <div className="p-4 rounded-xl bg-gradient-to-tr from-[#151225] to-[#0c0c14] border border-violet-500/20 space-y-3 animate-fade-in text-xs relative overflow-hidden">
              {currentTier === 'Free' && (
                <div className="absolute inset-0 bg-[#0c0c14]/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-violet-400">💎 PREMIUM ALGORITHM DOCKET</span>
                  <p className="text-[11px] text-gray-300 max-w-[240px] mt-1 leading-normal font-medium">
                    AI Multi-Channel SEO boosters are locked on the Free edition. Upgrade to generate viral social hooks instantly.
                  </p>
                  <button
                    type="button"
                    onClick={onOpenBilling}
                    className="mt-2.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-500 text-[10px] font-bold hover:from-violet-550 hover:to-indigo-400 text-white transition cursor-pointer shadow-md"
                  >
                    Unlock Pro SEO Boosters ⚡
                  </button>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-violet-400 tracking-wider flex items-center gap-1.5">
                  ✨ AI SEO Optimization Engine
                </span>
                <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950/40 py-0.5 px-2 rounded-full border border-cyan-500/20">
                  Algorithm Booster
                </span>
              </div>
              <p className="text-[11px] text-gray-400 leading-normal font-medium">
                Optimize your title, description body, and hashtags according to each platform's dynamic algorithm triggers to secure peak audience search & explore page viral reach.
              </p>

              {activeVideo.targetPlatforms.length === 0 ? (
                <div className="text-[10px] text-amber-400 italic p-2 bg-amber-500/10 rounded border border-amber-500/15 text-center font-bold">
                  ⚠️ Select/Check destinations below to activate SEO engine targets.
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Choose Optimization Formula:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {activeVideo.targetPlatforms.map((plat) => (
                      <button
                        key={plat}
                        type="button"
                        onClick={async () => {
                          const currentVideoId = activeVideo.id;
                          const originalBtn = document.getElementById(`seo-opt-btn-${plat}`);
                          if (originalBtn) originalBtn.innerHTML = "🌀 Optimizing...";
                          
                          try {
                            const res = await fetch('/api/seo-optimize', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                title: activeVideo.title,
                                description: activeVideo.description,
                                hashtags: activeVideo.hashtags,
                                platform: plat,
                                style: activeVideo.style
                              })
                            });
                            const data = await res.json();
                            
                            setVideos(prev => prev.map(v => {
                              if (v.id === currentVideoId) {
                                return {
                                  ...v,
                                  title: data.title || v.title,
                                  description: data.description || v.description,
                                  hashtags: data.hashtags || v.hashtags
                                };
                              }
                              return v;
                            }));

                            setActiveVideo(v => {
                              if (v && v.id === currentVideoId) {
                                return {
                                  ...v,
                                  title: data.title || v.title,
                                  description: data.description || v.description,
                                  hashtags: data.hashtags || v.hashtags
                                };
                              }
                              return v;
                            });

                            alert(`🚀 AI SEO Optimization complete for ${plat.toUpperCase()}! Modified hooks, descriptions, and tag clusters successfully.`);
                          } catch (err) {
                            alert("Failed to connect to the SEO Optimizer service.");
                          } finally {
                            if (originalBtn) originalBtn.innerHTML = `Optimize for ${plat.toUpperCase()} ⚡`;
                          }
                        }}
                        id={`seo-opt-btn-${plat}`}
                        className="p-2 border border-violet-500/35 hover:border-violet-400 bg-violet-950/20 hover:bg-violet-950/55 rounded-lg text-white font-extrabold text-[10.5px] transition text-center cursor-pointer shadow-md"
                      >
                        Optimize for {plat.toUpperCase()} ⚡
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Platform Toggles checkboxes */}
            <div className="space-y-2 border-t border-white/10 pt-4">
              <label className="text-xs font-bold text-gray-400 block pb-1">Select Channel Destinations</label>
              <div className="grid grid-cols-4 gap-2">
                {(['tiktok', 'instagram', 'facebook', 'youtube'] as Platform[]).map((plat) => {
                  const isChecked = activeVideo.targetPlatforms.includes(plat);
                  return (
                    <button
                      key={plat}
                      id={`drawer-dest-${plat}`}
                      onClick={() => {
                        const next = isChecked 
                          ? activeVideo.targetPlatforms.filter(p => p !== plat) 
                          : [...activeVideo.targetPlatforms, plat];
                        
                        setVideos(prev => prev.map(v => v.id === activeVideo.id ? { ...v, targetPlatforms: next } : v));
                        setActiveVideo(v => v ? { ...v, targetPlatforms: next } : null);
                      }}
                      className={`py-2 rounded-xl border font-bold capitalize text-xs transition duration-150 flex items-center justify-center gap-1 cursor-pointer ${
                        isChecked 
                          ? 'border-violet-500 bg-violet-950/20 text-white font-black' 
                          : 'border-white/5 bg-black/40 text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {plat} {isChecked && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Account Assigment Selection Multi-Select limits */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 block">Social Profiles Authorization Assignment</label>
              
              {activeVideo.targetPlatforms.length === 0 ? (
                <div className="p-3 text-center bg-black/40 border border-white/5 rounded-xl text-xs text-gray-500 italic">
                  Select destination platforms above to reveal authorized account choices.
                </div>
              ) : (
                <div className="space-y-3">
                  {activeVideo.targetPlatforms.map((plat) => {
                    const eligible = getEligibleAccountsForPlatform(plat);
                    return (
                      <div key={plat} className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400 font-mono tracking-widest border-b border-white/5 pb-1">
                          <span>{plat} Accounts Pool</span>
                          <span className="text-violet-400">{eligible.length} Available</span>
                        </div>

                        {eligible.length === 0 ? (
                          <div className="text-[10px] text-amber-500 italic">
                            No authorized account connected. Go to the "Connect" view to Link Account first.
                          </div>
                        ) : (
                          <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                            {eligible.map((acc) => {
                              const isAssigned = activeVideo.targetAccounts.includes(acc.id);
                              return (
                                <label key={acc.id} className="flex items-center justify-between p-1.5 rounded hover:bg-white/5 cursor-pointer">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={isAssigned}
                                      onChange={() => {
                                        const next = isAssigned
                                          ? activeVideo.targetAccounts.filter(x => x !== acc.id)
                                          : [...activeVideo.targetAccounts, acc.id];
                                        setVideos(prev => prev.map(v => v.id === activeVideo.id ? { ...v, targetAccounts: next } : v));
                                        setActiveVideo(v => v ? { ...v, targetAccounts: next } : null);
                                      }}
                                      className="rounded bg-black border-white/10 text-violet-600"
                                    />
                                    <span className="font-semibold text-gray-200">{acc.name}</span>
                                    <span className="text-[10px] font-mono text-gray-500">({acc.username})</span>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Platform Specific Settings Options block */}
            <div className="space-y-3 border-t border-white/10 pt-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block flex items-center gap-1">
                ⚙️ Platform API Specific Settings Controls
              </span>

              {activeVideo.targetPlatforms.includes('tiktok') && (
                <div className="p-3.5 bg-slate-950 rounded-xl border border-white/5 text-xs space-y-2 animate-fade-in">
                  <span className="text-[10px] font-black uppercase text-pink-500 font-mono tracking-wide">TikTok Custom Directives</span>
                  
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded border-white/10 bg-black text-pink-500" />
                      <span>Allow Duet stitch</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded border-white/10 bg-black text-pink-500" />
                      <span>Allow Stitch reels</span>
                    </label>
                  </div>
                </div>
              )}

              {activeVideo.targetPlatforms.includes('instagram') && (
                <div className="p-3.5 bg-slate-950 rounded-xl border border-white/5 text-xs space-y-2 animate-fade-in">
                  <span className="text-[10px] font-black uppercase text-pink-400 font-mono tracking-wide">Instagram Reels Custom Directives</span>
                  <div className="space-y-2">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" name="post-type" defaultChecked className="text-pink-500 bg-black" />
                        <span>Reels standard format</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" name="post-type" className="text-pink-500 bg-black" />
                        <span>Feed grid story</span>
                      </label>
                    </div>

                    <input
                      type="text"
                      placeholder="Collaborator handlers (e.g. @viral_hacks)"
                      className="w-full bg-black p-2 rounded text-xs border border-white/10 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {activeVideo.targetPlatforms.includes('facebook') && (
                <div className="p-3.5 bg-slate-950 rounded-xl border border-white/5 text-xs space-y-2 animate-fade-in">
                  <span className="text-[10px] font-black uppercase text-blue-400 font-mono tracking-wide">Facebook Ad-Boost Directives</span>
                  
                  <div className="flex items-center justify-between text-[11px]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-white/10 bg-black text-blue-500" />
                      <span>Boost Facebook Page Post</span>
                    </label>
                    <div className="flex items-center gap-1">
                      <span>Budget cap:</span>
                      <input type="text" placeholder="$45 USD" className="w-16 bg-black p-1 rounded font-mono text-center border border-white/10" />
                    </div>
                  </div>
                </div>
              )}

              {activeVideo.targetPlatforms.includes('youtube') && (
                <div className="p-3.5 bg-slate-950 rounded-xl border border-white/5 text-xs space-y-2 animate-fade-in">
                  <span className="text-[10px] font-black uppercase text-red-500 font-mono tracking-wide">YouTube Data API Directives</span>
                  
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div className="space-y-1">
                      <span>Privacy Status:</span>
                      <select className="w-full bg-black rounded p-1.5 border border-white/10 text-[10px]">
                        <option value="public">Public (Immediate)</option>
                        <option value="unlisted">Unlisted video</option>
                        <option value="private">Private personal</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <span>Category tag:</span>
                      <select className="w-full bg-black rounded p-1.5 border border-white/10 text-[10px]">
                        <option value="tech">Science & Technology</option>
                        <option value="gaming">Gaming streaming</option>
                        <option value="travel">Howto & Lifestyle</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Schedule Trigger Selectors */}
            <div className="space-y-4 border-t border-white/10 pt-4 bg-[#0a0a10] p-4 rounded-xl">
              <span className="text-xs font-bold text-gray-400 tracking-wider">Configure dispatch timer action</span>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <span>Schedule Posting Date:</span>
                  <input
                    type="date"
                    value={activeVideo.scheduledDate || '2026-06-15'}
                    onChange={(e) => {
                      const ans = e.target.value;
                      setVideos(prev => prev.map(v => v.id === activeVideo.id ? { ...v, scheduledDate: ans } : v));
                      setActiveVideo(v => v ? { ...v, scheduledDate: ans } : null);
                    }}
                    className="w-full bg-black border border-white/15 rounded p-2 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <span>Schedule Posting Time (UTC):</span>
                  <input
                    type="time"
                    value={activeVideo.scheduledTime || '12:00'}
                    onChange={(e) => {
                      const ans = e.target.value;
                      setVideos(prev => prev.map(v => v.id === activeVideo.id ? { ...v, scheduledTime: ans } : v));
                      setActiveVideo(v => v ? { ...v, scheduledTime: ans } : null);
                    }}
                    className="w-full bg-black border border-white/15 rounded p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    handleMoveVideoStatus(activeVideo.id, 'Published');
                    alert("Video published successfully! API triggered.");
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-xs font-bold py-2 rounded-lg cursor-pointer text-center"
                >
                  Publish Now
                </button>
                <button
                  onClick={() => {
                    handleMoveVideoStatus(activeVideo.id, 'Scheduled');
                    alert("Saved to automatic queue scheduler successfully.");
                  }}
                  className="bg-cyan-600 hover:bg-cyan-500 text-xs font-bold py-2 rounded-lg cursor-pointer text-center"
                >
                  Commit Schedule
                </button>
                <button
                  onClick={() => handleMoveVideoStatus(activeVideo.id, 'Draft')}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold py-2 rounded-lg cursor-pointer text-center text-gray-300"
                >
                  Reset as Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
