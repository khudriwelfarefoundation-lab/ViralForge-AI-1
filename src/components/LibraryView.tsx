import React, { useState, useRef } from 'react';
import { 
  Play, Scissors, Trash2, Calendar, CheckSquare, Search, Filter, 
  ShieldCheck, Film, Globe, UploadCloud, X, Check, Loader2, Plus, Image, Smartphone
} from 'lucide-react';
import { VideoProject } from '../types';

interface LibraryViewProps {
  videos: VideoProject[];
  setVideos: React.Dispatch<React.SetStateAction<VideoProject[]>>;
  setActiveVideo: (video: VideoProject) => void;
  setActiveTab: (tab: string) => void;
}

export default function LibraryView({ videos, setVideos, setActiveVideo, setActiveTab }: LibraryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Custom Video File Upload states
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Upload Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrompt, setFormPrompt] = useState('');
  const [formStyle, setFormStyle] = useState('vlog');
  const [formAspectRatio, setFormAspectRatio] = useState('9:16');
  const [formDuration, setFormDuration] = useState(30);
  const [formPlatforms, setFormPlatforms] = useState<string[]>(['tiktok', 'instagram']);
  const [formThumbnail, setFormThumbnail] = useState('https://images.unsplash.com/photo-1542204172-e7052809a86e?auto=format&fit=crop&w=300&q=80');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const thumbnailPool = [
    { name: 'Sunset Drive', url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=300&q=80' },
    { name: 'Neon Arcade', url: 'https://images.unsplash.com/photo-1542204172-e7052809a86e?auto=format&fit=crop&w=300&q=80' },
    { name: 'Cyberpunk Alley', url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=300&q=80' },
    { name: 'Digital Matrix', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80' },
    { name: 'Ambient Cinema', url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=300&q=80' }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file) return;
    setUploadedFile(file);
    setIsUploading(true);
    setUploadProgress(15);
    
    // Auto-populate Title based on file name (removing suffix extensions)
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    setFormTitle(baseName.charAt(0).toUpperCase() + baseName.slice(1));
    setFormDescription(`Manual video upload representing raw camera asset folder footage: "${file.name}". Ready for immediate multi-network deployment.`);
    setFormPrompt(`Local imported source asset: ${file.name}. Fully initialized in ViralForge Ready Library.`);

    // Randomize duration between 15-60 seconds for placeholder default values
    const randDuration = [15, 30, 45, 60][Math.floor(Math.random() * 4)];
    setFormDuration(randDuration);

    // Pick a matching category thumbnail
    const randThumb = thumbnailPool[Math.floor(Math.random() * thumbnailPool.length)].url;
    setFormThumbnail(randThumb);

    // Simulate high-fidelity upload progress bar loops
    let progress = 15;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
        }, 405);
      }
      setUploadProgress(progress);
    }, 120);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleTogglePlatform = (plat: string) => {
    setFormPlatforms(prev => 
      prev.includes(plat) ? prev.filter(p => p !== plat) : [...prev, plat]
    );
  };

  const handleAddVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert("A visual identifier (Title) is mandatory for custom video assets! Please provide one.");
      return;
    }

    const newProject: VideoProject = {
      id: 'v-' + Math.floor(Math.random() * 1000000),
      prompt: formPrompt || 'Custom video clip upload',
      style: formStyle,
      aspectRatio: formAspectRatio,
      duration: formDuration,
      title: formTitle,
      description: formDescription || 'Uploaded master clip ready to deploy.',
      hashtags: ['#ImportedCap', '#ViralForge', '#RawAsset', `#${formStyle.toUpperCase()}`],
      thumbnail: formThumbnail,
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-spiral-of-colored-light-beams-45367-large.mp4',
      status: 'Draft',
      progress: 100,
      queuePosition: 0,
      estTime: 'Completed',
      consistentStyle: false,
      targetPlatforms: formPlatforms as any[],
      targetAccounts: [],
      subtitles: [
        { id: 'sub-0', timeStart: 0, timeEnd: Math.min(6, formDuration), text: `Imported scene title: ${formTitle}` },
        { id: 'sub-1', timeStart: Math.min(6, formDuration), timeEnd: formDuration, text: 'Custom uploaded raw track assets.' }
      ],
      volumeLevel: 100,
      musicVolume: 50,
      speed: 1.0,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      lutFilter: 'none'
    };

    setVideos(prev => [newProject, ...prev]);
    setSavedSuccess(true);
    
    setTimeout(() => {
      setSavedSuccess(false);
      setIsUploadFormOpen(false);
      // Reset State values
      setUploadedFile(null);
      setFormTitle('');
      setFormDescription('');
      setFormPrompt('');
    }, 1200);
  };

  const filteredVideos = videos
    .filter(v => selectedStatus === 'all' ? true : v.status === selectedStatus)
    .filter(v => v.title.toLowerCase().includes(searchTerm.toLowerCase()) || v.prompt.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this video asset from your Ready to Publish library? This is irreversible.")) {
      setVideos(prev => prev.filter(x => x.id !== id));
    }
  };

  return (
    <div id="ready-library-container" className="space-y-6">
      
      {/* Search and status filter header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              id="library-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search prompt descriptions, captions or video titles in library..."
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-white focus:outline-none focus:border-violet-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-gray-400 shrink-0 hidden md:block" />
            <select
              id="library-filter-dropdown"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 w-full sm:w-44"
            >
              <option value="all">📁 All Generation States</option>
              <option value="Draft">📝 Draft</option>
              <option value="Generating">⚡ Generating</option>
              <option value="Editing">🎬 Editing</option>
              <option value="Scheduled">📅 Scheduled</option>
              <option value="Published">✅ Published</option>
              <option value="Failed">❌ Failed</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setIsUploadFormOpen(!isUploadFormOpen)}
          className="w-full md:w-auto bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-xs font-black py-2.5 px-4 rounded-xl text-white transition flex items-center justify-center gap-2 shadow-lg shrink-0 cursor-pointer"
        >
          {isUploadFormOpen ? <X className="h-4 w-4" /> : <UploadCloud className="h-4 w-4" />}
          {isUploadFormOpen ? 'Close Asset Importer' : 'Upload Custom Video'}
        </button>
      </div>

      {/* Expanded Custom Video Upload Box */}
      {isUploadFormOpen && (
        <div className="rounded-2xl border border-violet-500/30 bg-[#0c0c16]/90 p-6 shadow-xl relative overflow-hidden animate-fade-in space-y-6">
          <div className="absolute top-0 right-0 h-32 w-32 bg-violet-600/10 rounded-full filter blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <UploadCloud className="text-cyan-400 h-5 w-5 animate-bounce" />
                Local HD Video Asset Importer
              </h3>
              <p className="text-[11px] text-gray-400">Import your external footage assets so they display inside Forge Studio and scheduler workflows.</p>
            </div>
            <span className="text-[9px] uppercase font-mono bg-violet-950 text-violet-400 border border-violet-500/20 rounded px-2 py-0.5">
              Unlimited Importations
            </span>
          </div>

          <form onSubmit={handleAddVideoSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column Drag and Drop */}
              <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[180px] ${
                    dragActive 
                      ? 'border-cyan-400 bg-cyan-950/10' 
                      : uploadedFile 
                        ? 'border-emerald-500/65 bg-emerald-950/5' 
                        : 'border-white/10 hover:border-violet-500 hover:bg-white/5'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  {isUploading ? (
                    <div className="space-y-3 w-full">
                      <Loader2 className="h-8 w-8 text-cyan-400 animate-spin mx-auto" />
                      <div>
                        <p className="text-xs font-bold text-white">Uploading "{uploadedFile?.name}"...</p>
                        <p className="text-[10px] text-gray-400">Local stream parsing</p>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-400" style={{ width: `${uploadProgress}%` }} />
                      </div>
                      <span className="text-[10px] text-cyan-400 font-mono font-bold">{uploadProgress}%</span>
                    </div>
                  ) : uploadedFile ? (
                    <div className="space-y-2">
                      <div className="h-10 w-10 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                        <Check className="h-5 w-5 text-emerald-400" />
                      </div>
                      <p className="text-xs font-bold text-white truncate max-w-[200px]">{uploadedFile.name}</p>
                      <p className="text-[10px] text-emerald-400">File processed • Click to swap</p>
                      <span className="text-[9px] bg-white/5 text-gray-400 px-1.5 py-0.5 rounded">
                        {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2 select-none">
                      <UploadCloud className="h-10 w-10 text-gray-400 mx-auto group-hover:text-violet-400" />
                      <p className="text-xs font-bold text-gray-200">Drag & Drop raw MP4 or MOV file</p>
                      <p className="text-[10px] text-gray-500">or click to browse local folders</p>
                      <p className="text-[9px] text-gray-500 pt-2">Vite-supported media containers up to 10 GB limits are optimized.</p>
                    </div>
                  )}
                </div>

                {/* Aspect ratio and style config parameters */}
                <div className="space-y-3">
                  <span className="text-[10px] text-gray-400 uppercase font-black block tracking-wider">Aspect Dimension Ratio</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['9:16', '1:1', '16:9'].map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setFormAspectRatio(r)}
                        className={`py-1.5 rounded-lg text-xs font-extrabold border transition ${
                          formAspectRatio === r 
                            ? 'border-cyan-400 bg-cyan-950/20 text-cyan-300 font-bold' 
                            : 'border-white/5 bg-black/40 text-gray-400 hover:text-white'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>

                  <div className="pt-1.5">
                    <span className="text-[10px] text-gray-400 uppercase font-black block tracking-wider mb-2">Platform Target Channels</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['tiktok', 'instagram', 'youtube', 'facebook'].map(p => {
                        const isChecked = formPlatforms.includes(p);
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => handleTogglePlatform(p)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition border flex items-center gap-1.5 ${
                              isChecked 
                                ? 'bg-violet-950/40 text-violet-300 border-violet-500/40' 
                                : 'bg-black/40 text-gray-500 border-white/5'
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${isChecked ? 'bg-violet-400' : 'bg-gray-600'}`} />
                            {p}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column Fields */}
              <div className="lg:col-span-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase font-black tracking-wider block">Video Asset Title</label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. Autumn mountain stream 4K"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-violet-500 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 uppercase font-black tracking-wider block">Duration Target (Seconds)</label>
                    <select
                      value={formDuration}
                      onChange={(e) => setFormDuration(Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                    >
                      <option value={15}>15 seconds (TikTok short)</option>
                      <option value={30}>30 seconds (Standard Reel)</option>
                      <option value={60}>60 seconds (Short video)</option>
                      <option value={180}>180 seconds (3 minute vlog)</option>
                      <option value={600}>900 seconds (15 minute VIP compile)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-black tracking-wider block">Description / Viral Caption</label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Provide a description snippet that will be used for automated social media dispatcher schedules..."
                    rows={2}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-black tracking-wider block">Simulation Reference Prompt</label>
                  <input
                    type="text"
                    value={formPrompt}
                    onChange={(e) => setFormPrompt(e.target.value)}
                    placeholder="Describe original visual scene instruction parameters (optional)"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-violet-500 transition"
                  />
                </div>

                {/* Thumbnail Preset selection */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[10px] text-gray-400 uppercase font-black tracking-wider block">Set Card Graphic Cover Preview</label>
                  <div className="grid grid-cols-5 gap-2">
                    {thumbnailPool.map((thumb, idx) => (
                      <div
                        key={idx}
                        onClick={() => setFormThumbnail(thumb.url)}
                        className={`relative rounded-lg overflow-hidden h-14 border cursor-pointer transition ${
                          formThumbnail === thumb.url 
                            ? 'border-violet-400 ring-1 ring-violet-400' 
                            : 'border-white/5 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={thumb.url} alt="preset" className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/60 text-[7px] text-white py-0.5 px-1 rounded block truncate max-w-[90%] font-mono">
                          {thumb.name.split(' ')[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confirm submit actions */}
                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUploadFormOpen(false);
                      setUploadedFile(null);
                    }}
                    className="text-xs font-bold text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    disabled={savedSuccess || isUploading}
                    className="bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 font-black text-xs text-white py-2 px-5 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-400 animate-pulse" /> Asset Registered!
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" /> Add Custom Asset to Ready Library
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Grid of video projects */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-black/20">
          <Film className="h-12 w-12 text-gray-600 mx-auto mb-2 animate-pulse" />
          <p className="text-sm font-extrabold text-gray-300">No Asset Records Match Your Search</p>
          <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
            You have not generated or saved any video sequences that match this filter status. Begin a new sequence in the <strong>Create View</strong>.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredVideos.map((item) => (
            <div 
              key={item.id}
              onClick={() => {
                setActiveVideo(item);
                setActiveTab('forge');
              }}
              className="group rounded-2xl border border-white/5 bg-[#0a0a10]/80 overflow-hidden hover:border-violet-500/40 hover:bg-[#0c0c16]/95 transition duration-300 cursor-pointer relative flex flex-col justify-between"
            >
              {/* Preview block container */}
              <div className="relative aspect-video bg-black overflow-hidden border-b border-white/5 shrink-0">
                <img 
                  src={item.thumbnail} 
                  alt="thumbnail" 
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Status Badge */}
                <span className={`absolute top-2.5 left-2.5 text-[9px] font-black uppercase font-mono px-2 py-0.5 rounded border ${
                    item.status === 'Published' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' :
                    item.status === 'Scheduled' ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300' :
                    item.status === 'Generating' ? 'bg-amber-500/20 border-amber-500/30 text-amber-300 animate-pulse' :
                    item.status === 'Failed' ? 'bg-red-500/20 border-red-500/30 text-red-400' :
                    'bg-gray-500/20 border-gray-500/30 text-gray-300'
                }`}>
                  {item.status}
                </span>

                {/* Aspect ratio label */}
                <span className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-sm text-[8px] font-mono text-gray-300 px-1.5 py-0.5 rounded border border-white/5">
                  {item.aspectRatio} • {item.duration}s
                </span>
                
                {/* Hover overlay play item */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="text-[11px] font-bold bg-violet-600 border border-violet-400 text-white rounded-lg px-3 py-1.5 flex items-center gap-1">
                    <Scissors className="h-3.5 w-3.5" /> Forge Studio Edit
                  </span>
                </div>
              </div>

              {/* Data body block */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white group-hover:text-violet-400 transition truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-gray-400 line-clamp-2 leading-tight">
                    {item.prompt}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/5">
                  {/* Platforms slated */}
                  {item.targetPlatforms.length > 0 && (
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="text-[8px] text-gray-500 font-bold uppercase mr-1">To Channels:</span>
                      {item.targetPlatforms.map(p => (
                        <span key={p} className="text-[8px] bg-white/5 px-1.5 py-0.5 rounded font-bold uppercase text-gray-300">
                          {p}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Date details */}
                  {item.status === 'Scheduled' && item.scheduledDate && (
                    <p className="text-[9px] font-mono text-cyan-300 bg-cyan-950/20 py-0.5 px-2 rounded border border-cyan-500/10 inline-block">
                      📅 Post: {item.scheduledDate} {item.scheduledTime}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[9px] text-gray-500 font-mono">
                      ID: #{item.id.replace('v-', '')}
                    </span>

                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="text-gray-500 hover:text-red-400 p-1 rounded hover:bg-white/5 transition"
                      title="Delete Video Asset"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
