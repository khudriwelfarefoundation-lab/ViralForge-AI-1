/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Film, Link2, Layers, Video, BarChart3, HelpCircle, 
  Menu, X, Smartphone, Globe, Info, ClipboardList, ShieldAlert, CheckCircle, Clock, Mic
} from 'lucide-react';

import HeaderSettings from './components/HeaderSettings';
import StudioCreate from './components/StudioCreate';
import VocalSpeechEngine from './components/VocalSpeechEngine';
import ForgeStudio from './components/ForgeStudio';
import ConnectManager from './components/ConnectManager';
import CampaignForge from './components/CampaignForge';
import LibraryView from './components/LibraryView';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import CheckoutModal from './components/CheckoutModal';
import ProductWebsite from './components/ProductWebsite';

import AuthScreen from './components/AuthScreen';
import OwnerAdminPanel from './components/OwnerAdminPanel';
import HelpSupportPage from './components/HelpSupportPage';

import { INITIAL_ACCOUNTS, INITIAL_VIDEOS } from './mockData';
import { SocialAccount, VideoProject } from './types';

export default function App() {
  const [viewMode, setViewMode] = useState<'website' | 'workspace'>('website');
  const [showAuthScreen, setShowAuthScreen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('create');
  
  // Pricing/Monetization state control
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  
  // App-level state management elements
  const [accounts, setAccounts] = useState<SocialAccount[]>(INITIAL_ACCOUNTS);
  const [videos, setVideos] = useState<VideoProject[]>(INITIAL_VIDEOS);

  // Sync state for the Post-Edition Forge Studio track
  const [activeEditingVideo, setActiveEditingVideo] = useState<VideoProject | null>(INITIAL_VIDEOS[0]);

  // Mobile menu toggle
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Durable client-side database synchronization with seed info
  const [usersDb, setUsersDb] = useState<any[]>(() => {
    const saved = localStorage.getItem('forge_users_db3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Guarantee that only 'khudriwelfarefoundation@gmail.com' can be admin, other than this gmail all must be in customer category
        return parsed.map((u: any) => ({
          ...u,
          role: u.email.toLowerCase().trim() === 'khudriwelfarefoundation@gmail.com' ? 'admin' : 'user'
        }));
      } catch (e) {}
    }

    // Initial pre-populated data of sandbox users and their states
    const initial = [
      {
        email: 'khudriwelfarefoundation@gmail.com',
        name: 'Muhammad Talha (Owner)',
        role: 'admin',
        tier: 'Unlimited',
        paymentStatus: 'approved'
      },
      {
        email: 'creator_test@gmail.com',
        name: 'Sarah Peterson',
        role: 'user',
        tier: 'Free',
        paymentStatus: 'none'
      },
      {
        email: 'talhasocials_google@gmail.com',
        name: 'Google User Alex',
        role: 'user',
        tier: 'Free',
        paymentStatus: 'none'
      },
      {
        email: 'dave@miller.com',
        name: 'Dave Miller',
        role: 'user',
        tier: 'Unlimited',
        paymentStatus: 'approved',
        paymentMethod: 'Credit Card',
        trxId: 'CC-LAST4-5668-MOCK-9214'
      },
      {
        email: 'amina.khan@gmail.com',
        name: 'Amina Khan',
        role: 'user',
        tier: 'Free',
        paymentStatus: 'pending',
        paymentMethod: 'USDT TRC20 Crypto',
        trxId: '0x78ea7fbc9901df2a001bbcf88921a92e'
      }
    ];
    localStorage.setItem('forge_users_db3', JSON.stringify(initial));
    return initial;
  });

  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem('forge_user3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          role: parsed.email.toLowerCase().trim() === 'khudriwelfarefoundation@gmail.com' ? 'admin' : 'user'
        };
      } catch (e) {}
    }
    return null;
  });

  const [tickets, setTickets] = useState<any[]>(() => {
    const saved = localStorage.getItem('forge_tickets_db3');
    if (saved) return JSON.parse(saved);

    const initial = [
      {
        id: 'TKT-101',
        userEmail: 'amina.khan@gmail.com',
        userName: 'Amina Khan',
        title: 'Crypto USDT payment matching support',
        message: 'I transferred exactly $11.99 USDT to Muhammad Talha TRC-20 wallet provided. Could you please review and activate my lifetime plan? Thank you!',
        urgency: 'high',
        createdAt: '2026-06-13 11:24'
      },
      {
        id: 'TKT-102',
        userEmail: 'creator_test@gmail.com',
        userName: 'Sarah Peterson',
        title: 'Cinematic Styles Query',
        message: 'Application is amazing! Could we expand the default cinematic style profiles to bundle higher contrast highlights?',
        urgency: 'medium',
        createdAt: '2026-06-12 15:40',
        reply: 'Thank you Sarah! Great request. Added to our pipeline. Check out Forge controls to tweak contrast manually too.'
      }
    ];
    localStorage.setItem('forge_tickets_db3', JSON.stringify(initial));
    return initial;
  });

  // Keep state synchronized
  const saveUsersDb = (newDb: any[]) => {
    setUsersDb(newDb);
    localStorage.setItem('forge_users_db3', JSON.stringify(newDb));

    if (currentUser) {
      const match = newDb.find(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
      if (match) {
        setCurrentUser(match);
        localStorage.setItem('forge_user3', JSON.stringify(match));
      }
    }
  };

  const saveTickets = (newTickets: any[]) => {
    setTickets(newTickets);
    localStorage.setItem('forge_tickets_db3', JSON.stringify(newTickets));
  };

  const handleLogin = (user: any) => {
    const existing = usersDb.find(u => u.email.toLowerCase() === user.email.toLowerCase());
    let syncedUser = user;

    if (existing) {
      syncedUser = existing;
    } else {
      const updatedDb = [...usersDb, user];
      setUsersDb(updatedDb);
      localStorage.setItem('forge_users_db3', JSON.stringify(updatedDb));
    }

    setCurrentUser(syncedUser);
    localStorage.setItem('forge_user3', JSON.stringify(syncedUser));
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('forge_user3');
    setActiveTab('create');
  };

  // Payment triggers
  const handlePaymentSubmit = (method: string, trxId: string) => {
    const updatedDb = usersDb.map(u => {
      if (u.email.toLowerCase() === currentUser.email.toLowerCase()) {
        return {
          ...u,
          paymentStatus: 'pending',
          paymentMethod: method,
          trxId: trxId,
          submittedAt: new Date().toLocaleTimeString()
        };
      }
      return u;
    });
    saveUsersDb(updatedDb);
    setShowCheckoutModal(false);
  };

  // Admin approval handlers
  const handleApprovePayment = (email: string) => {
    const updatedDb = usersDb.map(u => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        return {
          ...u,
          tier: 'Unlimited',
          paymentStatus: 'approved'
        };
      }
      return u;
    });
    saveUsersDb(updatedDb);
  };

  const handleRejectPayment = (email: string) => {
    const updatedDb = usersDb.map(u => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        return {
          ...u,
          paymentStatus: 'rejected'
        };
      }
      return u;
    });
    saveUsersDb(updatedDb);
  };

  const handleInstantUpgrade = (email: string) => {
    const updatedDb = usersDb.map(u => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        return {
          ...u,
          tier: 'Unlimited',
          paymentStatus: 'approved'
        };
      }
      return u;
    });
    saveUsersDb(updatedDb);
  };

  const handleReplyTicket = (ticketId: string, replyText: string) => {
    const updatedTickets = tickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          reply: replyText
        };
      }
      return t;
    });
    saveTickets(updatedTickets);
  };

  const handleSubmitTicket = (ticketInfo: { title: string; message: string; urgency: 'low' | 'medium' | 'high' }) => {
    const newTicket = {
      id: `TKT-${Math.floor(100 + Math.random() * 900)}`,
      userEmail: currentUser.email,
      userName: currentUser.name,
      title: ticketInfo.title,
      message: ticketInfo.message,
      urgency: ticketInfo.urgency,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    saveTickets([newTicket, ...tickets]);
  };

  // Decide whether to show AuthScreen selection or product website
  const isGuest = !currentUser;

  if (showAuthScreen || (viewMode === 'workspace' && isGuest)) {
    return (
      <AuthScreen 
        onLogin={(user) => {
          handleLogin(user);
          setViewMode('workspace');
          setShowAuthScreen(false);
        }} 
        onClose={() => {
          setShowAuthScreen(false);
          setViewMode('website');
        }}
      />
    );
  }

  // Otherwise, if viewMode is website, render the brand product landing page
  if (viewMode === 'website') {
    return (
      <ProductWebsite 
        currentUser={currentUser}
        currentTier={currentUser ? (currentUser.tier || 'Free') : 'Free'}
        onLaunchWorkspace={() => {
          if (currentUser) {
            setViewMode('workspace');
          } else {
            setShowAuthScreen(true);
          }
        }}
        onOpenCheckout={() => {
          if (currentUser) {
            setShowCheckoutModal(true);
            setViewMode('workspace');
          } else {
            setShowAuthScreen(true);
          }
        }}
        onTriggerLogin={() => {
          setShowAuthScreen(true);
        }}
        onSignOut={handleSignOut}
      />
    );
  }

  // Active membership tier level
  const currentTier = currentUser.tier || 'Free';

  // When a video completes generation, append to the core active list
  const handleVideoGenerated = (newProject: VideoProject) => {
    setVideos(prev => [newProject, ...prev]);
    setActiveEditingVideo(newProject);
  };

  const handleSaveToLibrary = (updatedProject: VideoProject) => {
    setVideos(prev => {
      const idx = prev.findIndex(v => v.id === updatedProject.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = updatedProject;
        return copy;
      } else {
        return [updatedProject, ...prev];
      }
    });
    setActiveEditingVideo(updatedProject);
  };

  // Sidebar link definition
  const navigationItems = [
    { id: 'create', label: 'Create AI Workspace', desc: 'Text Prompt Studio', icon: <Sparkles className="h-5 w-5" /> },
    { id: 'vocal-engine', label: 'AI Vocal Engine 🎙️', desc: 'Interactive Text to Speech', icon: <Mic className="h-5 w-5 text-violet-400" /> },
    { id: 'forge', label: 'Forge Studio', desc: 'Timeline Multi-Layer Editor', icon: <Film className="h-5 w-5" />, highlightBadge: true },
    { id: 'connect', label: 'Connect Hub', desc: 'Social Account Manager', icon: <Link2 className="h-5 w-5" />, badgeValue: accounts.length },
    { id: 'campaigns', label: 'Campaign Forge', desc: 'Bulk Spreadsheet Automation', icon: <Layers className="h-5 w-5" />, badgeValue: videos.filter(v => v.status === 'Draft' || v.status === 'Scheduled').length },
    { id: 'library', label: 'Ready Library', desc: 'Publish Asset Center', icon: <Video className="h-5 w-5" />, badgeValue: videos.length },
    { id: 'analytics', label: 'Analytics Performance', desc: 'Audience Metrics Tracker', icon: <BarChart3 className="h-5 w-5" /> },
    currentUser.role === 'admin' ? { 
      id: 'admin', 
      label: "Owner's Desk 👑", 
      desc: 'Muhammad Talha office', 
      icon: <ShieldAlert className="h-5 w-5 text-amber-400" />, 
      badgeValue: usersDb.filter(u => u.paymentStatus === 'pending').length 
    } : null,
    { id: 'help', label: 'Help & Support 💬', desc: 'Connect with Owner', icon: <HelpCircle className="h-5 w-5" /> }
  ].filter(Boolean) as any[];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      
      {/* Upper Status Header */}
      <HeaderSettings 
        userEmail={currentUser.email} 
        currentTier={currentTier}
        onOpenBilling={() => setShowCheckoutModal(true)}
        onSignOut={handleSignOut}
        onReturnToWebsite={() => setViewMode('website')}
      />

      {/* Floating System Guidance Banner */}
      {currentUser.role !== 'admin' && (
        <div className="bg-black/60 border-b border-white/5 py-2 px-6 flex justify-center text-xs animate-fade-in">
          {currentUser.paymentStatus === 'pending' ? (
            <div className="flex items-center gap-2 text-rose-300 font-semibold">
              <Clock className="h-3.5 w-3.5 text-rose-400 shrink-0 animate-spin" />
              <span>
                Your $11.99 Lifetime Upgrade payment metadata is under review by Muhammad Talha.
              </span>
              <button 
                onClick={() => setActiveTab('help')}
                className="underline text-white hover:text-cyan-400 ml-1.5 transition font-bold"
              >
                Track ticket in Help Desk 💬
              </button>
            </div>
          ) : currentUser.paymentStatus === 'approved' ? (
            <div className="flex items-center gap-2 text-emerald-300 font-semibold">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>
                Congratulations! Muhammad Talha accepted your transfer. Premium lifetime license unlocked! ★
              </span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-2 text-gray-400">
              <span className="text-[10px] bg-zinc-800 text-zinc-300 font-bold px-1.5 py-0.5 rounded mr-1">
                DEMO GUEST WORKSPACE
              </span>
              <span>
                Unlimited features are currently locked. Paid subscription is exactly $11.99 for lifetime use.
              </span>
              <button
                onClick={() => setShowCheckoutModal(true)}
                className="text-violet-400 font-black hover:underline hover:text-white ml-2 cursor-pointer transition uppercase tracking-wider text-[11px]"
              >
                Activate Unlimited Lifetime License Now 🚀
              </button>
            </div>
          )}
        </div>
      )}

      {showCheckoutModal && (
        <CheckoutModal 
          onClose={() => setShowCheckoutModal(false)}
          onSubmitPayment={handlePaymentSubmit}
        />
      )}

      {/* Main Unified Website-Style Studio Console Container */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0e0c1a] via-[#09080e] to-[#040306] px-4 py-8 md:px-12 md:py-10">
        
        {/* Unified Top Glowing Operations Navigator Bar (Horizontal) */}
        <div className="max-w-7xl mx-auto mb-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#1b192e] border border-violet-500/20 px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold text-violet-300 mx-auto select-none">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>VIRALFORGE AI CREATOR SUITE • ACTIVE OPERATIVE CONSOLE</span>
          </div>
          
          {/* Horizontal navigation buttons */}
          <div className="bg-[#12111d]/90 border border-white/10 rounded-2xl p-2.5 max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-1.5 shadow-2xl backdrop-blur-md">
            {navigationItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`horizontal-tab-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-extrabold shadow-lg shadow-violet-600/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 font-semibold text-xs'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-gray-400'}>
                    {item.icon}
                  </span>
                  <span className="text-[11.5px] uppercase font-mono tracking-wider">{item.label.split(' ')[0]}</span>
                  
                  {item.badgeValue !== undefined && item.badgeValue > 0 && (
                    <span className={`text-[10px] font-mono font-black px-1.5 py-0.2 rounded border ${
                      isActive 
                        ? 'bg-black/40 border-white/10 text-white' 
                        : 'bg-zinc-800 border-white/5 text-gray-300'
                    }`}>
                      {item.badgeValue}
                    </span>
                  )}
                  
                  {item.highlightBadge && activeEditingVideo && !isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content canvas container pane with full spacious desk rendering */}
        <div id="workspace-stage-wrapper" className="max-w-7xl mx-auto pb-16 animate-fade-in text-left">
          <div className="animate-fade-in max-w-7xl mx-auto">
            {activeTab === 'create' && (
              <StudioCreate 
                onVideoGenerated={handleVideoGenerated}
                activeVideo={activeEditingVideo}
                setActiveVideo={setActiveEditingVideo}
                setActiveTab={setActiveTab}
                currentTier={currentTier}
                onOpenBilling={() => setShowCheckoutModal(true)}
              />
            )}

            {activeTab === 'vocal-engine' && (
              <VocalSpeechEngine 
                currentTier={currentTier}
                onOpenBilling={() => setShowCheckoutModal(true)}
              />
            )}

            {activeTab === 'forge' && (
              <ForgeStudio 
                activeVideo={activeEditingVideo}
                setActiveVideo={setActiveEditingVideo}
                onSaveToLibrary={handleSaveToLibrary}
              />
            )}

            {activeTab === 'connect' && (
              <ConnectManager 
                accounts={accounts}
                setAccounts={setAccounts}
              />
            )}

            {activeTab === 'campaigns' && (
              <CampaignForge 
                accounts={accounts}
                videos={videos}
                setVideos={setVideos}
                currentTier={currentTier}
                onOpenBilling={() => setShowCheckoutModal(true)}
              />
            )}

            {activeTab === 'library' && (
              <LibraryView 
                videos={videos}
                setVideos={setVideos}
                setActiveVideo={setActiveEditingVideo}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsDashboard />
            )}

            {/* NEW ADD: Owner Administrator Center tab */}
            {activeTab === 'admin' && currentUser.role === 'admin' && (
              <OwnerAdminPanel 
                users={usersDb}
                tickets={tickets}
                onApprovePayment={handleApprovePayment}
                onRejectPayment={handleRejectPayment}
                onInstantUpgrade={handleInstantUpgrade}
                onReplyTicket={handleReplyTicket}
              />
            )}

            {/* NEW ADD: Technical Support Page tab */}
            {activeTab === 'help' && (
              <HelpSupportPage 
                currentUser={currentUser}
                tickets={tickets}
                onSubmitTicket={handleSubmitTicket}
              />
            )}

          </div>
        </div>
      </div>

      {/* Bottom bar Navigation specifically for mobile devices */}
      <footer id="mobile-tab-navigation-bar" className="lg:hidden sticky bottom-0 z-30 bg-[#0c0c14]/95 border-t border-white/10 px-4 py-2 flex items-center justify-around backdrop-blur-xl">
        {[
          { id: 'create', icon: <Sparkles className="h-5 w-5" />, label: 'Create' },
          { id: 'forge', icon: <Film className="h-5 w-5" />, label: 'Forge' },
          { id: 'connect', icon: <Link2 className="h-5 w-5" />, label: 'Connect' },
          { id: 'campaigns', icon: <Layers className="h-5 w-5" />, label: 'Campaign' },
          { id: 'library', icon: <Video className="h-5 w-5" />, label: 'Library' },
          { id: 'help', icon: <HelpCircle className="h-5 w-5" />, label: 'Support' }
        ].map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 transition-colors cursor-pointer ${
                isActive ? 'text-violet-400' : 'text-gray-400'
              }`}
            >
              {item.icon}
              <span className="text-[9px] font-black mt-1 leading-none tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </footer>
    </div>
  );
}
