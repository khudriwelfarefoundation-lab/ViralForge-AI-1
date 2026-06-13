import React, { useState, useEffect } from 'react';
import { Settings, Shield, User, CreditCard, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

interface HeaderSettingsProps {
  userEmail: string;
  currentTier: 'Free' | 'Pro' | 'VIP' | 'Unlimited';
  onOpenBilling: () => void;
  onSignOut?: () => void;
}

export default function HeaderSettings({ userEmail, currentTier, onOpenBilling, onSignOut }: HeaderSettingsProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [status, setStatus] = useState({ status: 'checking', aiStatus: 'checking', message: '' });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStatus = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setStatus(data);
    } catch {
      setStatus({ status: 'error', aiStatus: 'local-fallback', message: 'Local Offline Engine' });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#0a0a0f]/80 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 font-mono text-xl font-black text-white shadow-lg shadow-violet-500/20">
            ⚡
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              ViralForge <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-sm font-extrabold text-transparent">AI STUDIO</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3.5">
          {/* Host Health */}
          <div 
            onClick={fetchStatus}
            className="hidden xl:flex cursor-pointer items-center space-x-2 rounded-full border border-white/10 bg-white/5 py-1.5 px-3 text-xs hover:bg-white/10 transition-all duration-300"
          >
            <span className={`h-2.5 w-2.5 rounded-full animate-pulse ${
              status.aiStatus === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'
            }`} />
            <span className="text-gray-300 font-mono">
              {status.aiStatus === 'connected' ? 'Server-Side Gemini 3.5' : 'Local Forge Emulation'}
            </span>
            <RefreshCw className={`h-3 w-3 text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          </div>

          {/* Upgrade Trigger Button */}
          {currentTier === 'Free' ? (
            <button
              onClick={onOpenBilling}
              className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-[10px] font-black uppercase tracking-wider py-1.5 px-3 rounded-lg text-white transition-all cursor-pointer shadow-lg animate-pulse"
            >
              Upgrade ⚡
            </button>
          ) : (
            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded border ${
              currentTier === 'Unlimited'
                ? 'bg-amber-950/40 text-amber-400 border-amber-500/30'
                : currentTier === 'VIP' 
                ? 'bg-amber-950/40 text-amber-300 border-amber-500/20' 
                : 'bg-violet-950/40 text-violet-300 border-violet-500/20'
            }`}>
              {currentTier === 'Unlimited' ? '★ LIFETIME UNLIMITED' : `${currentTier} Active`}
            </span>
          )}

          {/* Profile Button */}
          <button 
            id="profile-dropdown-btn"
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center space-x-2.5 rounded-xl bg-white/5 border border-white/10 p-1.5 pr-2.5 hover:bg-white/10 transition duration-300 cursor-pointer"
          >
            <div className={`flex h-7.5 w-7.5 items-center justify-center rounded-lg text-xs font-bold uppercase ${
              currentTier === 'Unlimited'
                ? 'bg-amber-600/30 text-amber-200'
                : currentTier === 'VIP' 
                ? 'bg-amber-600/30 text-amber-200' 
                : currentTier === 'Pro'
                ? 'bg-cyan-600/30 text-cyan-200'
                : 'bg-violet-600/30 text-violet-200'
            }`}>
              {userEmail.charAt(0) || 'U'}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold text-white truncate max-w-[110px]">{userEmail.split('@')[0]}</p>
              <p className="text-[9px] text-gray-400 leading-none uppercase tracking-wide font-mono mt-0.5">
                {currentTier === 'Unlimited' ? 'Lifetime VIP' : currentTier === 'VIP' ? 'VIP Unlimited' : currentTier === 'Pro' ? 'Pro Creator' : 'Trial Active'}
              </p>
            </div>
            <Settings className="h-4 w-4 text-gray-400 ml-1 shrink-0" />
          </button>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <div id="settings-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c14] text-white shadow-2xl animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-950/40 to-[#0c0c14] px-6 py-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-violet-400" />
                <h3 className="text-lg font-bold">Studio Configurations</h3>
              </div>
              <button 
                id="close-settings-btn"
                onClick={() => setShowSettings(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition duration-200"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Account Overview */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" /> Subscriber Profile
                </h4>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Account Owner:</span>
                    <span className="font-semibold text-white">{userEmail}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Tier Status:</span>
                    <span className={`rounded px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                      currentTier === 'Unlimited'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/35 font-mono'
                        : currentTier === 'VIP' 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono' 
                        : currentTier === 'Pro' 
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                        : 'bg-zinc-500/20 text-zinc-300 border border-zinc-500/30'
                    }`}>
                      {currentTier === 'Unlimited' ? '★ LIFETIME UNLIMITED' : currentTier === 'VIP' ? '★ VIP UNLIMITED' : currentTier === 'Pro' ? '✦ PRO PLAN' : '⌨ FREE TRIAL'}
                    </span>
                  </div>
                  {currentTier === 'Free' && (
                    <button
                      onClick={() => {
                        setShowSettings(false);
                        onOpenBilling();
                      }}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-xs font-bold hover:from-violet-500 hover:to-cyan-400 text-white transition text-center cursor-pointer block"
                    >
                      Upgrade To Premium Studio 🚀
                    </button>
                  )}
                  {onSignOut && (
                    <button
                      onClick={() => {
                        setShowSettings(false);
                        onSignOut();
                      }}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs text-rose-300 font-bold transition text-center cursor-pointer block uppercase tracking-wide"
                    >
                      Sign Out of Workspace ⎋
                    </button>
                  )}
                </div>
              </div>

              {/* API and Integration Status */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" /> API Keys & Secret Variables
                </h4>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">GEMINI_API_KEY</p>
                      <p className="text-xs text-gray-400">Injected via AI Studio Secrets</p>
                    </div>
                    <div>
                      {status.aiStatus === 'connected' ? (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                          Active Ready
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-300 border border-amber-500/20">
                          Mock Fallback
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {status.aiStatus !== 'connected' && (
                    <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-2.5 text-xs text-amber-200/90 flex gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <p>
                        To enable real server-side AI content rendering, configure your <strong>GEMINI_API_KEY</strong> inside the <strong>Secrets panel</strong> on the right in AI Studio!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Billing & Quota Usage */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5" /> Billing & Render Limits
                </h4>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Server Video Quota (4K/1080p)</span>
                      <span>
                        {currentTier === 'VIP' 
                          ? '159 / Unlimited VIP Render Seconds' 
                          : currentTier === 'Pro' 
                          ? '115 / 300 Render Seconds' 
                          : '29 / 30 Free Trial Seconds'}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full transition-all duration-500" 
                        style={{ width: currentTier === 'VIP' ? '15%' : currentTier === 'Pro' ? '38%' : '96%' }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Social Posts Dispatch Cap</span>
                      <span>
                        {currentTier === 'VIP' 
                          ? '420 / Unlimited Posts' 
                          : currentTier === 'Pro' 
                          ? '72 / 150 Social dispatches' 
                          : '4 / 5 Trail Dispatches'}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full transition-all duration-500" 
                        style={{ width: currentTier === 'VIP' ? '30%' : currentTier === 'Pro' ? '48%' : '80%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#08080f] border-t border-white/10 px-6 py-4 flex justify-between items-center text-xs text-gray-400">
              <span className="flex items-center gap-1 text-violet-400 font-medium">
                <Sparkles className="h-3.5 w-3.5" /> Powered by Gemini
              </span>
              <span>v1.2.0-Alpha PRO</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
