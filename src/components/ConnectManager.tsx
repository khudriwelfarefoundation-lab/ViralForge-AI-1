import React, { useState } from 'react';
import { 
  Users, Search, Plus, Trash2, CheckCircle2, XCircle, Info, ExternalLink, 
  Upload, Check, AlertTriangle, ArrowRight, RefreshCw, Smartphone, ListCollapse 
} from 'lucide-react';
import { SocialAccount, Platform } from '../types';

interface ConnectManagerProps {
  accounts: SocialAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<SocialAccount[]>>;
}

export default function ConnectManager({ accounts, setAccounts }: ConnectManagerProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [showCsvImport, setShowCsvImport] = useState(false);

  // Manual Account Input
  const [newNickName, setNewNickName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newAccountType, setNewAccountType] = useState('Business');
  const [newSubscribers, setNewSubscribers] = useState('10500');
  const [newFbCategory, setNewFbCategory] = useState('Digital Creator');
  const [newFbPageId, setNewFbPageId] = useState('');
  const [newTiktokVerified, setNewTiktokVerified] = useState('Standard');

  // CSV Import raw string state
  const [csvRaw, setCsvRaw] = useState(
    "nickname,username,platform,subscribers\nMini Vlogs,@mini_vlog,tiktok,14200\nTravel Hub,travel_hub_insta,instagram,30500\nGaming Page,page_id_81827,facebook,51200\nRetro Sounds,UCsounds_retro,youtube,109000"
  );
  const [csvSuccessMsg, setCsvSuccessMsg] = useState('');

  // Bulk actions checkbox selectors
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);

  const handleToggleSelectAll = (filteredList: SocialAccount[]) => {
    const allFilteredIds = filteredList.map(a => a.id);
    const someSelected = allFilteredIds.every(id => selectedAccountIds.includes(id));

    if (someSelected) {
      setSelectedAccountIds(selectedAccountIds.filter(id => !allFilteredIds.includes(id)));
    } else {
      setSelectedAccountIds([...new Set([...selectedAccountIds, ...allFilteredIds])]);
    }
  };

  const handleToggleSelectOne = (id: string) => {
    if (selectedAccountIds.includes(id)) {
      setSelectedAccountIds(selectedAccountIds.filter(x => x !== id));
    } else {
      setSelectedAccountIds([...selectedAccountIds, id]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedAccountIds.length === 0) return;
    setAccounts(prev => prev.filter(a => !selectedAccountIds.includes(a.id)));
    setSelectedAccountIds([]);
  };

  const handleBulkRefresh = () => {
    // Simulated connection status check
    const list = accounts.map(a => {
      if (selectedAccountIds.includes(a.id) || !selectedPlatform) {
        return { ...a, connected: Math.random() > 0.15 };
      }
      return a;
    });
    setAccounts(list);
  };

  // Add manually handler
  const handleAddAccountManually = (plat: Platform) => {
    if (!newNickName.trim() || !newUsername.trim()) return;

    const newAcc: SocialAccount = {
      id: `${plat}-${Math.floor(Math.random() * 100000)}`,
      platform: plat,
      name: newNickName,
      username: newUsername.startsWith('@') || plat === 'youtube' || plat === 'facebook' ? newUsername : '@' + newUsername,
      avatar: plat === 'tiktok' 
        ? 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=80&q=80'
        : plat === 'instagram'
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80'
        : plat === 'facebook'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80'
        : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
      connected: true,
      type: plat === 'instagram' ? newAccountType : plat === 'tiktok' ? newTiktokVerified : undefined,
      pageId: plat === 'facebook' ? (newFbPageId.trim() || `fb_pg_${Math.floor(Math.random() * 9000 + 1000)}`) : undefined,
      category: plat === 'facebook' ? newFbCategory : undefined,
      subscribers: plat === 'youtube' ? Number(newSubscribers) || 1200 : undefined,
      quota: plat === 'youtube' ? '0 / 10,000 units' : undefined
    };

    setAccounts(prev => [newAcc, ...prev]);
    setNewNickName('');
    setNewUsername('');
    setNewFbPageId('');
    setShowManualForm(false);
  };

  // Trigger login workflow simulation
  const handleLoginAuthorize = (plat: Platform) => {
    // Simulate OAuth popups
    const accountNick = `${plat === 'tiktok' ? 'Verified TikTok Account' : plat === 'instagram' ? 'Reels Publisher Pro' : plat === 'facebook' ? 'Viral Brands Page' : 'YouTube Channel Master'}`;
    const userHandle = `@auth_forge_${Math.floor(Math.random() * 900 + 100)}`;

    const newAcc: SocialAccount = {
      id: `${plat}-${Math.floor(Math.random() * 100000)}`,
      platform: plat,
      name: accountNick,
      username: userHandle,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
      connected: true,
      type: plat === 'instagram' ? 'Business' : undefined,
      pageId: plat === 'facebook' ? `page_auth_${Math.floor(Math.random() * 100000)}` : undefined,
      category: plat === 'facebook' ? 'Digital Creator' : undefined,
      subscribers: plat === 'youtube' ? 84000 : undefined,
      quota: plat === 'youtube' ? '12 / 10,000 units' : undefined,
    };

    setAccounts(prev => [newAcc, ...prev]);
    alert(`Success: Interactive OAuth 2.0 Auth Bridge returned valid publish token. Added "${accountNick}" instantly.`);
  };

  // CSV Import Parser
  const parseCsvImport = () => {
    try {
      const lines = csvRaw.split('\n');
      if (lines.length <= 1) return;
      const headers = lines[0].split(',');
      
      const newImportedList: SocialAccount[] = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const cols = lines[i].split(',');
        const rowData: Record<string, string> = {};
        for (let j = 0; j < headers.length; j++) {
          rowData[headers[j].trim().toLowerCase()] = cols[j]?.trim();
        }

        const rawPlat = (rowData.platform || 'tiktok').toLowerCase() as Platform;
        const nickname = rowData.nickname || `Bulk ${rawPlat.toUpperCase()}`;
        const handle = rowData.username || `@user_${Math.floor(Math.random() * 10000)}`;
        const subsVal = Number(rowData.subscribers) || 5000;

        newImportedList.push({
          id: `csv-${rawPlat}-${Math.floor(Math.random() * 100000)}`,
          platform: rawPlat,
          name: nickname,
          username: handle,
          avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=80&q=80',
          connected: true,
          type: rawPlat === 'instagram' ? 'Business' : undefined,
          subscribers: rawPlat === 'youtube' ? subsVal : undefined,
          pageId: rawPlat === 'facebook' ? 'page_bulk' : undefined,
          quota: rawPlat === 'youtube' ? '0/10,000' : undefined
        });
      }

      setAccounts(prev => [...newImportedList, ...prev]);
      setCsvSuccessMsg(`Successfully imported and authorized ${newImportedList.length} social publisher accounts from spreadsheet!`);
      setTimeout(() => setCsvSuccessMsg(''), 5000);
      setShowCsvImport(false);
    } catch {
      alert("Error parsing CSV. Please check formatting headers (nickname,username,platform,subscribers).");
    }
  };

  return (
    <div id="connect-platform-manager" className="space-y-6">
      {/* Upper Connect Intro cards */}
      <div className="grid grid-cols-1 select-none sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TikTok card */}
        <div 
          onClick={() => setSelectedPlatform('tiktok')}
          className={`group rounded-2xl border p-5 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden ${
            selectedPlatform === 'tiktok' 
              ? 'border-violet-500 bg-black/60 shadow-lg shadow-violet-500/10' 
              : 'border-white/10 bg-white/5 hover:bg-white/15'
          }`}
        >
          <div className="absolute top-0 right-0 h-16 w-16 bg-[#fe2c55]/10 rounded-full filter blur-xl group-hover:scale-125 transition duration-500" />
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-black border border-white/20 flex items-center justify-center text-xl font-bold font-mono text-[#00f2fe]">
              🎵
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-white/5 px-2 py-0.5 rounded">
              Unlimited VIP
            </span>
          </div>
          <h4 className="text-md font-extrabold text-white">TikTok Studio</h4>
          <p className="text-xs text-gray-400 mt-1">Manage vlogs, stitches, duets and viral captions</p>
          <div className="mt-4 flex items-center justify-between text-xs font-semibold text-violet-400">
            <span>{accounts.filter(a => a.platform === 'tiktok').length} accounts currently</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition duration-200" />
          </div>
        </div>

        {/* Instagram cards */}
        <div 
          onClick={() => setSelectedPlatform('instagram')}
          className={`group rounded-2xl border p-5 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden ${
            selectedPlatform === 'instagram' 
              ? 'border-pink-500 bg-black/60 shadow-lg shadow-pink-500/10' 
              : 'border-white/10 bg-white/5 hover:bg-white/15'
          }`}
        >
          <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] opacity-10 rounded-full filter blur-xl group-hover:scale-125 transition duration-500" />
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center text-xl font-bold font-mono text-white">
              📸
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-white/5 px-2 py-0.5 rounded">
              Unlimited Business API
            </span>
          </div>
          <h4 className="text-md font-extrabold text-white">Instagram Reels</h4>
          <p className="text-xs text-gray-400 mt-1">Publish Stories, Grid Reels & tag collaborations</p>
          <div className="mt-4 flex items-center justify-between text-xs font-semibold text-pink-400">
            <span>{accounts.filter(a => a.platform === 'instagram').length} accounts currently</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition duration-200" />
          </div>
        </div>

        {/* Facebook Page cards */}
        <div 
          onClick={() => setSelectedPlatform('facebook')}
          className={`group rounded-2xl border p-5 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden ${
            selectedPlatform === 'facebook' 
              ? 'border-blue-500 bg-black/60 shadow-lg shadow-blue-500/10' 
              : 'border-white/10 bg-white/5 hover:bg-white/15'
          }`}
        >
          <div className="absolute top-0 right-0 h-16 w-16 bg-[#1877f2]/10 rounded-full filter blur-xl group-hover:scale-125 transition duration-500" />
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-[#1877f2] flex items-center justify-center text-xl font-bold text-white font-serif">
              f
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-white/5 px-2 py-0.5 rounded">
              Unlimited Pages API
            </span>
          </div>
          <h4 className="text-md font-extrabold text-white">Facebook Pages</h4>
          <p className="text-xs text-gray-400 mt-1">Target audiences, budget boosting pages</p>
          <div className="mt-4 flex items-center justify-between text-xs font-semibold text-blue-400">
            <span>{accounts.filter(a => a.platform === 'facebook').length} accounts currently</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition duration-200" />
          </div>
        </div>

        {/* YouTube Channel card */}
        <div 
          onClick={() => setSelectedPlatform('youtube')}
          className={`group rounded-2xl border p-5 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden ${
            selectedPlatform === 'youtube' 
              ? 'border-red-500 bg-black/60 shadow-lg shadow-red-500/10' 
              : 'border-white/10 bg-white/5 hover:bg-white/15'
          }`}
        >
          <div className="absolute top-0 right-0 h-16 w-16 bg-[#ff0000]/10 rounded-full filter blur-xl group-hover:scale-125 transition duration-500" />
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-red-650 bg-red-600 flex items-center justify-center text-xl text-white">
              ▶️
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-white/5 px-2 py-0.5 rounded">
              Unlimited OAuth VIP
            </span>
          </div>
          <h4 className="text-md font-extrabold text-white">YouTube Channels</h4>
          <p className="text-xs text-gray-400 mt-1">Shorts, Public/Unlisted stream playlists & tags</p>
          <div className="mt-4 flex items-center justify-between text-xs font-semibold text-red-400">
            <span>{accounts.filter(a => a.platform === 'youtube').length} accounts currently</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition duration-200" />
          </div>
        </div>
      </div>

      {csvSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex gap-2 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{csvSuccessMsg}</span>
        </div>
      )}

      {/* Expanded Platform Detail Panel */}
      {selectedPlatform && (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 relative animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/15 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">
                {selectedPlatform === 'tiktok' ? '🎵' : selectedPlatform === 'instagram' ? '📸' : selectedPlatform === 'facebook' ? '👥' : '▶️'}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-white capitalize">{selectedPlatform} Management Space</h3>
                  <span className="text-xs bg-cyan-950/40 text-cyan-400 px-2.5 py-0.5 rounded-full border border-cyan-500/20 font-bold font-mono">
                    {accounts.filter(a => a.platform === selectedPlatform).length} linked (Unlimited Account Pool)
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Manage accounts, view status validation logs, and authorize custom APIs.
                </p>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => setShowCsvImport(!showCsvImport)}
                className="flex items-center gap-1.5 bg-white/5 hover:border-violet-400 border border-white/10 text-xs px-3 py-1.5 rounded-xl transition duration-150 cursor-pointer text-gray-300"
              >
                <Upload className="h-3.5 w-3.5" /> CSV Bulk Upload
              </button>

              <div className="relative">
                <button 
                  onClick={() => setShowAddMenu(!showAddMenu)}
                  className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl transition font-bold text-white shadow-md cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Link Account
                </button>
                {showAddMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-white/15 shadow-xl py-2 z-25 animate-fade-in text-left">
                    <button
                      onClick={() => {
                        setShowManualForm(true);
                        setShowAddMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-white/5 text-gray-200 hover:text-white"
                    >
                      Add Manually (Inputs)
                    </button>
                    <button
                      onClick={() => {
                        handleLoginAuthorize(selectedPlatform);
                        setShowAddMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-white/5 text-gray-200 hover:text-white"
                    >
                      Connect via Login (OAuth)
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedPlatform(null)}
                className="text-xs text-gray-400 hover:text-white px-2 py-1.5 border border-transparent hover:border-white/10 rounded-lg"
              >
                ✕ Close Workspace
              </button>
            </div>
          </div>

          {/* CSV Import Panel Drawer */}
          {showCsvImport && (
            <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-white/10 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Upload className="h-3.5 w-3.5 text-violet-400" /> Excel/CSV Bulk Authorizer
                </h5>
                <button onClick={() => setShowCsvImport(false)} className="text-[10px] text-gray-400 hover:text-white">✕ Dismiss</button>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Provide common comma-separated headers (<code>nickname,username,platform,subscribers</code>) values. You can load any number of accounts instantly.
              </p>
              <textarea
                value={csvRaw}
                onChange={(e) => setCsvRaw(e.target.value)}
                rows={5}
                className="w-full p-2.5 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-gray-300 focus:outline-none focus:border-violet-500 resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCsvImport(false)}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 text-xs px-3 py-1.5 rounded-lg text-gray-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={parseCsvImport}
                  className="bg-violet-600 hover:bg-violet-500 text-xs hover:border-violet-400 border border-transparent font-bold px-3.5 py-1.5 rounded-lg text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="h-3.5 w-3.5" /> Parse and Append Accounts
                </button>
              </div>
            </div>
          )}

          {/* Manual Form Toggle */}
          {showManualForm && (
            <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-white/10 space-y-3 max-w-xl animate-fade-in">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <h5 className="text-xs font-extrabold text-white">Manual Account Attributes</h5>
                <button onClick={() => setShowManualForm(false)} className="text-gray-400 hover:text-white text-[11px]">✕ Dismiss</button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Account Nickname</label>
                  <input
                    type="text"
                    value={newNickName}
                    onChange={(e) => setNewNickName(e.target.value)}
                    placeholder="e.g. Viral Shorts UK"
                    className="w-full bg-black border border-white/15 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-violet-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Username / Channel ID</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="e.g. @shorts_uk"
                    className="w-full bg-black border border-white/15 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-violet-400"
                  />
                </div>

                {selectedPlatform === 'instagram' && (
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Account Type</label>
                    <select
                      value={newAccountType}
                      onChange={(e) => setNewAccountType(e.target.value)}
                      className="w-full bg-black border border-white/15 rounded-lg p-2 text-xs text-white focus:outline-none"
                    >
                      <option value="Business">Business Pro</option>
                      <option value="Creator">Influencer/Creator</option>
                      <option value="Personal">Personal/Standard</option>
                    </select>
                  </div>
                )}

                {selectedPlatform === 'youtube' && (
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Initial Subscribers Count</label>
                    <input
                      type="number"
                      value={newSubscribers}
                      onChange={(e) => setNewSubscribers(e.target.value)}
                      className="w-full bg-black border border-white/15 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-violet-400"
                    />
                  </div>
                )}

                {selectedPlatform === 'facebook' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Facebook Page ID</label>
                      <input
                        type="text"
                        value={newFbPageId}
                        onChange={(e) => setNewFbPageId(e.target.value)}
                        placeholder="e.g. pg_91283812"
                        className="w-full bg-black border border-white/15 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-violet-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Page Category</label>
                      <select
                        value={newFbCategory}
                        onChange={(e) => setNewFbCategory(e.target.value)}
                        className="w-full bg-black border border-white/15 rounded-lg p-2 text-xs text-white focus:outline-none"
                      >
                        <option value="Digital Creator">Digital Creator</option>
                        <option value="Media/News Channel">Media/News Channel</option>
                        <option value="Entertainment Hub">Entertainment Hub</option>
                        <option value="Technology & Gaming">Technology & Gaming</option>
                        <option value="Personal Blog">Personal Blog</option>
                      </select>
                    </div>
                  </>
                )}

                {selectedPlatform === 'tiktok' && (
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Verification Level</label>
                    <select
                      value={newTiktokVerified}
                      onChange={(e) => setNewTiktokVerified(e.target.value)}
                      className="w-full bg-black border border-white/15 rounded-lg p-2 text-xs text-white focus:outline-none"
                    >
                      <option value="Verified Badge">Verified (Blue Check)</option>
                      <option value="Standard Creator">Standard Creator</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualForm(false)}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-xs px-3 py-1.5 rounded-lg text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleAddAccountManually(selectedPlatform)}
                  className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-xs font-bold px-4 py-1.5 rounded-lg text-white cursor-pointer"
                >
                  Simulate Connection
                </button>
              </div>
            </div>
          )}

          {/* Search bar and selection filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                id="search-accounts-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${selectedPlatform} accounts...`}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-1.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-violet-500 transition"
              />
            </div>

            {/* Bulk Actions Block */}
            {selectedAccountIds.length > 0 && (
              <div className="flex items-center gap-2 bg-violet-600/10 border border-violet-500/20 px-3 py-1.5 rounded-xl animate-fade-in">
                <span className="text-[11px] font-bold text-violet-300 font-mono">
                  {selectedAccountIds.length} chosen
                </span>
                <span className="h-4 w-[1px] bg-white/10" />
                <button
                  id="bulk-disconnect-btn"
                  onClick={handleBulkDelete}
                  className="text-[10px] text-red-400 hover:bg-red-500/15 font-semibold px-2 py-0.5 rounded transition flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" /> Disconnect Selected
                </button>
                <button
                  id="bulk-refresh-btn"
                  onClick={handleBulkRefresh}
                  className="text-[10px] text-cyan-300 hover:bg-cyan-500/15 font-semibold px-2 py-0.5 rounded transition flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" /> Refresh Status
                </button>
              </div>
            )}
          </div>

          {/* Grid list of platform items */}
          {accounts.filter(a => a.platform === selectedPlatform).length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-black/20">
              <Users className="h-10 w-10 text-gray-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-300">No accounts linked under {selectedPlatform.toUpperCase()}</p>
              <p className="text-[11px] text-gray-500 mt-1 max-w-sm mx-auto">
                Select "Link Account" or click "Connect via Login" to verify your secure authorization token and download page coordinates.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {accounts
                .filter(a => a.platform === selectedPlatform)
                .filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.username.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((acc) => {
                  const isChecked = selectedAccountIds.includes(acc.id);
                  return (
                    <div 
                      key={acc.id}
                      className={`rounded-xl border p-3.5 flex items-start justify-between gap-3 transition duration-200 bg-[#0e0e16]/80 ${
                        isChecked ? 'border-violet-500 bg-violet-950/10' : 'border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelectOne(acc.id)}
                          className="mt-1 sticky shrink-0 h-4.5 w-4.5 rounded border-white/10 text-violet-600 focus:ring-violet-500 bg-black"
                        />
                        <img 
                          src={acc.avatar} 
                          alt="avatar" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80';
                          }}
                          className="h-10 w-10 rounded-xl border border-white/10 object-cover shrink-0"
                        />
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-white leading-tight">{acc.name}</p>
                          <p className="text-[11px] text-gray-400 font-mono flex items-center gap-1">
                            {acc.username}
                          </p>

                          {/* Extra info context per platform as requested */}
                          {acc.platform === 'instagram' && acc.type && (
                            <span className="inline-block text-[9px] font-bold text-pink-400 uppercase bg-pink-950/25 px-1.5 py-0.5 rounded border border-pink-500/20">
                              {acc.type} Hub
                            </span>
                          )}
                          {acc.platform === 'facebook' && acc.pageId && (
                            <div className="text-[9px] text-gray-500 font-mono">
                              Page ID: <span className="text-gray-400">{acc.pageId}</span>
                              {acc.category && <span className="block italic text-blue-400">{acc.category}</span>}
                            </div>
                          )}
                          {acc.platform === 'youtube' && (
                            <div className="text-[9px] space-y-0.5 font-mono">
                              <span className="block text-red-400">{(acc.subscribers || 0).toLocaleString()} Subscribers</span>
                              <span className="block text-gray-500">Remaining Quota: {acc.quota || 'Unlimited VIP Pro Access'}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Connection status tag and action */}
                      <div className="flex flex-col items-end justify-between h-full space-y-6">
                        <div className="flex items-center gap-1 text-[10px]">
                          <span className={`inline-block h-2 w-2 rounded-full ${
                            acc.connected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                          }`} />
                          <span className={acc.connected ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                            {acc.connected ? 'Connected' : 'Token Expired'}
                          </span>
                        </div>

                        <button
                          onClick={() => setAccounts(prev => prev.filter(x => x.id !== acc.id))}
                          className="text-[10px] text-gray-500 hover:text-red-400 p-1 rounded hover:bg-white/5 transition"
                          title="Disconnect Account"
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
