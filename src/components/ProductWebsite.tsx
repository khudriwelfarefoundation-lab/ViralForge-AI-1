import React, { useState } from 'react';
import { 
  Sparkles, Film, Link2, Layers, Video, BarChart3, HelpCircle, 
  Menu, X, Smartphone, Globe, Info, ClipboardList, ShieldAlert, CheckCircle, Clock, 
  Mic, Play, Check, ChevronDown, MessageSquare, ArrowRight, Star, Heart, Lock, ShieldCheck, Mail
} from 'lucide-react';
import VocalSpeechEngine from './VocalSpeechEngine';

interface ProductWebsiteProps {
  currentUser: any;
  currentTier: 'Free' | 'Pro' | 'VIP' | 'Unlimited';
  onLaunchWorkspace: () => void;
  onOpenCheckout: () => void;
  onTriggerLogin: () => void;
  onSignOut: () => void;
}

export default function ProductWebsite({
  currentUser,
  currentTier,
  onLaunchWorkspace,
  onOpenCheckout,
  onTriggerLogin,
  onSignOut
}: ProductWebsiteProps) {
  
  // Local active state for custom FAQ accordion toggles
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Core feature data
  const featureList = [
    {
      id: 'timeline',
      title: 'Timeline Multi-Layer Editor',
      desc: 'Seamlessly align high-fidelity AI voice voiceovers with generated caption frames and custom background video paths.',
      icon: <Film className="h-6 w-6 text-violet-400" />,
      tag: 'Studio Forge'
    },
    {
      id: 'vocal',
      title: 'Interactive AI Vocal Core',
      desc: 'Synthesize perfect human-like speech. Tune deep bases, control elocution pacing, and export downloaded MP3 assets right away.',
      icon: <Mic className="h-6 w-6 text-cyan-400" />,
      tag: 'Speech Tech'
    },
    {
      id: 'bulk',
      title: 'Bulk Social Connect Hub',
      desc: 'Synchronize multiple video social channels in one dashboard. Direct scheduling to TikTok, YouTube Shorts, and Instagram Reels.',
      icon: <Link2 className="h-6 w-6 text-emerald-400" />,
      tag: 'Automation'
    },
    {
      id: 'campaign',
      title: 'Campaign Spreadsheet Forge',
      desc: 'Upload standard spreadsheet logs to generate, schedule, and schedule whole viral chapters automatically.',
      icon: <Layers className="h-6 w-6 text-pink-400" />,
      tag: 'Bulk Master'
    },
    {
      id: 'metrics',
      title: 'Analytics Performance Monitor',
      desc: 'Evaluate viral viewer retention metrics. Stagger high-pacing segments to retain audience watch times.',
      icon: <BarChart3 className="h-6 w-6 text-amber-400" />,
      tag: 'Audience Insight'
    },
    {
      id: 'support',
      title: "Direct Owner's Office Desk",
      desc: 'Connect immediately with provider Muhammad Talha. Real-time support and fast-pass manual transaction approval.',
      icon: <ShieldAlert className="h-6 w-6 text-rose-400" />,
      tag: 'Direct Gate'
    }
  ];

  // Pricing plans with exactly 2 paths as requested
  const pricingPlans = [
    {
      name: 'Free Starter License',
      price: '0',
      period: 'forever',
      desc: 'Test the base engine parameters with general sandbox parameters.',
      features: [
        'Access to basic system voice narrators',
        'Standard non-commercial workspace usage',
        'Local browser memory storage',
        '60s max preview timeline clips',
        'Standard resolution test exports'
      ],
      cta: 'Get Started (Free Console)',
      popular: false,
      tierCode: 'Free'
    },
    {
      name: 'Lifetime Unlimited Plan',
      price: '11.99',
      period: 'one-time payment',
      desc: 'Unlock premium high-fidelity voice profiles and limitless rendering slots.',
      features: [
        'All ultra realistic Voice Narrators unlocked',
        'Unlimited HD vocal downloads & video exports',
        'Direct Social Account API scheduling',
        'Spreadsheet Bulk Campaign Forge engine',
        'CARD SECURE PAYMENT ONLY gateway',
        'Direct priority support from Muhammad Talha',
        'Lifetime access - NO monthly recurring bills'
      ],
      cta: 'Buy Lifetime License ($11.99)',
      popular: true,
      tierCode: 'Unlimited'
    }
  ];

  // FAQ items representation
  const faqItems = [
    {
      q: 'How does the AI Vocal Narrator Speech Engine function?',
      a: 'The Vocal Core accepts any custom text script and utilizes native sound synthesis configurations to translate it into a chosen narrator voice style. You can customize the pitch rate, elocution pace, and instantly save or download computed MP3 narration samples.'
    },
    {
      q: 'How does secure CARD payment activation operate?',
      a: 'For our Unlimited license, we require secure Credit/Debit card payment exclusively. Simply fill in the sandbox or real card parameters. For security, coordinates are kept completely safe from the public. Muhammad Talha reviews submitted records for near-instant VIP authorization.'
    },
    {
      q: 'Are there any hidden monthly subscription charges?',
      a: 'Absolutely not. This is a special $11.99 Lifetime Upgrade. Once Muhammad Talha marks your status as approved, your workspace is permanently activated. There are no recurring fees.'
    },
    {
      q: 'Can I connect my TikTok and YouTube accounts in the platform?',
      a: 'Yes, the Connect Hub is designed to bind your channels safely so you can publish scheduled short campaigns on the fly without logging in manually multiple times.'
    }
  ];

  // User reviews
  const testimonials = [
    {
      name: 'Sarah Peterson',
      role: 'Viral Social Creator',
      msg: 'ViralForge turned my newsletter scripts into 30 sequential short-form reels with custom voiceovers in under 10 minutes. The dynamic waveforms and speed pitch sliders are perfect.',
      stars: 5,
      avatar: '👩‍💻'
    },
    {
      name: 'Dave Miller',
      role: 'Paid Acquisition Lead',
      msg: 'Paid exactly $11.99 by card and Muhammad Talha activated my account in minutes. Best investment for compiling organic short automation without high agency retainers.',
      stars: 5,
      avatar: '👨‍💼'
    },
    {
      name: 'Amina Khan',
      role: 'Indie Video Marketer',
      msg: 'The timeline editor is exceptionally responsive. I can align high-definition captions with the cinematic voices instantly. The UI layout represents true design craftsmanship.',
      stars: 5,
      avatar: '👩‍🎨'
    }
  ];

  const handleCtaClick = (tierCode: string) => {
    if (tierCode === 'Free') {
      if (currentUser) {
        onLaunchWorkspace();
      } else {
        onTriggerLogin();
      }
    } else {
      if (currentUser) {
        onOpenCheckout();
      } else {
        // Trigger login first, then we can checkout
        onTriggerLogin();
      }
    }
  };

  return (
    <div className="bg-[#0b0a11] text-gray-100 flex flex-col font-sans select-none overflow-x-hidden min-h-screen text-left">
      
      {/* 1. Header/Navbar */}
      <header className="sticky top-0 z-50 bg-[#0c0b15]/90 border-b border-white/5 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/10">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-black text-white block uppercase tracking-wider leading-none">ViralForge AI</span>
              <span className="text-[9.5px] font-mono text-violet-400 font-extrabold block mt-0.5 tracking-tight">VIP WEBSITE DESK</span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-black uppercase text-gray-400 font-mono tracking-wider">
            <a href="#features" className="hover:text-white transition">Core Features</a>
            <a href="#speech-engine" className="hover:text-white transition">Vocal Engine</a>
            <a href="#pricing" className="hover:text-white transition">Price Sheet</a>
            <a href="#faq" className="hover:text-white transition">FAQ Log</a>
            <a href="#contact" className="hover:text-white transition">Developer Office</a>
          </nav>

          {/* Nav Controls */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-[10px] text-gray-400 font-medium font-mono">{currentUser.email}</span>
                  <span className={`text-[9px] font-bold uppercase ${currentTier === 'Unlimited' ? 'text-amber-400' : 'text-zinc-500'}`}>
                    ★ {currentTier} Account
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onLaunchWorkspace}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-violet-600/20 uppercase tracking-wider font-mono"
                >
                  <span>Launch Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onTriggerLogin}
                className="bg-[#151322] border border-white/10 hover:border-violet-500/30 text-white font-extrabold text-xs px-4.5 py-2.5 rounded-xl transition cursor-pointer uppercase tracking-wider font-mono flex items-center gap-1.5"
              >
                <span>Member Sign In</span>
                <ArrowRight className="h-3.5 w-3.5 text-violet-400" />
              </button>
            )}
          </div>

        </div>
      </header>

      {/* 2. Hero Interactive Block Section */}
      <section className="relative pt-12 md:pt-20 pb-16 bg-gradient-to-b from-[#0e0c1a] to-[#0a0910] overflow-hidden px-6">
        {/* Glow ambient background elements */}
        <div className="absolute -top-40 -left-40 h-96 w-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-0 h-96 w-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 bg-[#1b192e] border border-violet-500/20 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-violet-300 mx-auto select-none">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>WEBSITE UPGRADED: DEDICATED AI VOCAL CORE INTERFACE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight">
            Forge Viral Video Content With &nbsp;
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Realistic Human Voice
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The ultimate responsive workspace designed for short-form video editors, marketing managers, and independent creators. Convert script logs to voice instantly with customizable pitch parameters, dynamics, and multi-layer timeline editors.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              onClick={() => {
                const playground = document.getElementById('speech-engine');
                if (playground) playground.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-xs px-6 py-4 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider font-mono shadow-lg shadow-violet-600/15"
            >
              <Mic className="h-4.5 w-4.5" />
              <span>Try Speech Playground 🔊</span>
            </button>

            <button
              onClick={currentUser ? onLaunchWorkspace : onTriggerLogin}
              className="w-full sm:w-auto bg-[#131121] border border-white/10 hover:bg-white/5 text-gray-100 hover:text-white font-extrabold text-xs px-6 py-4 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider font-mono"
            >
              <span>Launch Platform Console 🚀</span>
            </button>
          </div>

          {/* Pricing bullet summary */}
          <div className="pt-6 flex justify-center items-center gap-6 text-[11.5px] uppercase font-mono font-bold text-gray-500 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-400" />
              Standard Guest Plan ($0)
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-amber-400" />
              Lifetime Unlimited ($11.99)
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Lock className="h-3 w-3" />
              CARD DEBIT/CREDIT SECURED
            </span>
          </div>

          {/* Visual Platform Showcase Banner Mockup */}
          <div className="pt-10 max-w-5xl mx-auto select-none">
            <div className="bg-gradient-to-t from-zinc-950 to-[#12111f] border border-white/10 rounded-2xl shadow-2xl p-2 relative">
              {/* Corner buttons simulating browser window */}
              <div className="absolute top-4 left-4 flex gap-1.5 z-10">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500 opacity-60" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500 opacity-60" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 opacity-60" />
              </div>
              <div className="bg-black/90 p-3 sm:p-5 rounded-xl border border-white/5 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-white/5 pb-3 font-mono text-[10.5px]">
                  <span className="text-zinc-500 uppercase tracking-wider text-left">ViralForge AI Workspace Preview:</span>
                  <span className="text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20 font-bold uppercase font-mono">
                    ONLINE RENDERER ACTIVATED
                  </span>
                </div>
                {/* Horizontal row of three distinct mockup indicators */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-left">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold font-mono">STEP 1: TEXT TRANSCRIPT</p>
                    <p className="text-xs text-white/90 line-clamp-2 italic font-serif mt-1">"Take a deep breath and let the AI script forge cinematic narratives."</p>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-left">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold font-mono">STEP 2: VOCAL NARRATOR</p>
                    <p className="text-xs text-violet-300 font-bold font-mono mt-1">James (Deep Cinematic Male)</p>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-left">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold font-mono">STEP 3: MULTI-LAYER OUTPUT</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-xs text-emerald-400 font-mono font-bold uppercase">Ready for Publish</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Core Features Section */}
      <section id="features" className="py-20 bg-[#06050a] border-y border-white/5 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-[11px] bg-violet-950 text-violet-400 px-3 py-1 rounded font-black font-mono tracking-widest uppercase">
              ALL-IN-ONE SOLUTION OVERVIEW
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              A Complete Viral Video & Vocal Synthesis Ecosystem
            </h2>
            <p className="text-xs md:text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">
              We provide the core tools to bypass exhausting formatting steps. Render high-fidelity, high-contrast video tracks with instant synchronization.
            </p>
          </div>

          {/* Feature interactive grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureList.map((f) => (
              <div 
                key={f.id}
                className="bg-[#0f0e1a] border border-white/5 hover:border-violet-500/30 p-6 rounded-2xl transition duration-300 relative group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="inline-flex p-3 bg-black/40 border border-white/5 rounded-xl text-violet-400 group-hover:scale-110 transition duration-350">
                    {f.icon}
                  </div>
                  <div>
                    <span className="text-[9.5px] text-zinc-500 font-mono font-bold uppercase block tracking-wider">{f.tag}</span>
                    <h3 className="text-base font-black text-white mt-1">{f.title}</h3>
                    <p className="text-xs text-gray-400 mt-2.5 leading-relaxed">{f.desc}</p>
                  </div>
                </div>

                <div className="pt-5 flex items-center justify-between text-[11px] text-zinc-500 font-mono font-bold uppercase tracking-wider group-hover:text-violet-300 transition mt-4 border-t border-white/5">
                  <span>Engine Integrated</span>
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Dedicated Speech Engine Playground Section */}
      <section id="speech-engine" className="py-20 bg-gradient-to-b from-[#0a0910] via-[#0b0a12] to-[#040306] px-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-6xl mx-auto space-y-10 relative z-10">
          
          <div className="text-center space-y-3">
            <span className="text-[11px] bg-cyan-950 text-cyan-400 px-3 py-1 rounded font-black font-mono tracking-widest uppercase">
              LIVE SPEECH SYNTHESIS ENGINE
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              AI Vocal Narrator Sandbox Playground
            </h2>
            <p className="text-xs text-gray-400 max-w-xl mx-auto leading-relaxed">
              Synthesize natural narratives directly from your browser. Try adjusting vocal pitch rates, customized speed intervals, and select individual preset narrators.
            </p>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-3xl p-4 md:p-8 backdrop-blur-xl shadow-2xl">
            <VocalSpeechEngine 
              currentTier={currentTier}
              onOpenBilling={onOpenCheckout}
            />
          </div>

        </div>
      </section>

      {/* 5. User Testimonial Slider Row */}
      <section className="py-16 bg-[#040306] border-t border-white/5 px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-white">Loved By Independent Content Creators</h3>
            <p className="text-xs text-gray-500 tracking-wide font-mono uppercase">real creators, genuine lifetime upgrades</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-[#12111d] border border-white/5 rounded-2xl p-5 relative text-left flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex gap-1">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-300 italic leading-relaxed">"{t.msg}"</p>
                </div>
                
                <div className="flex items-center gap-3 pt-4 border-t border-white/5 mt-4">
                  <span className="text-2xl">{t.avatar}</span>
                  <div>
                    <h4 className="text-xs font-black text-white">{t.name}</h4>
                    <p className="text-[10px] text-violet-400 font-mono">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. Lifetime Pricing Section */}
      <section id="pricing" className="py-20 bg-[#0a0910] border-t border-white/5 px-6 relative">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 h-96 w-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-12 relative z-10">
          
          <div className="text-center space-y-3">
            <span className="text-[11px] bg-amber-950 text-amber-500 px-3 py-1 rounded font-black font-mono tracking-widest uppercase">
              TRANSPARENT VALUE MATRIX
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              One Tiny Lifetime Price. Instant Absolute Control.
            </h2>
            <p className="text-xs text-gray-400 max-w-xl mx-auto leading-relaxed">
              Standard plans can test workspace limits. Upgrade once for lifetime access with secure and direct Credit Card authorization reviewed by Muhammad Talha.
            </p>
          </div>

          {/* Pricing tier cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {pricingPlans.map((plan, idx) => {
              const isPurchased = plan.tierCode === currentTier;
              return (
                <div 
                  key={idx}
                  className={`border rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left relative transition duration-300 ${
                    plan.popular 
                      ? 'border-violet-500 bg-[#120f26]/80 shadow-xl shadow-violet-500/5 ring-1 ring-violet-500/30' 
                      : 'border-white/10 bg-black/60'
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3.5 right-6 bg-gradient-to-r from-violet-600 to-indigo-600 border border-violet-400 text-white text-[9px] font-black uppercase tracking-widest py-1 px-3.5 rounded-full shadow-md font-mono">
                      🌟 BEST VALUE (LIFETIME)
                    </span>
                  )}

                  <div className="space-y-6">
                    <div>
                      <span className="text-[11px] font-black text-violet-400 uppercase tracking-widest font-mono block">
                        {plan.name}
                      </span>
                      <div className="flex items-baseline gap-1 mt-2.5">
                        <span className="text-3xl sm:text-4xl font-black text-white">$</span>
                        <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">{plan.price}</span>
                        <span className="text-xs text-zinc-500 font-mono tracking-wider ml-1.5 capitalize">/ {plan.period}</span>
                      </div>
                      <p className="text-[11.5px] text-gray-400 mt-2.5 leading-relaxed">{plan.desc}</p>
                    </div>

                    {/* Features list */}
                    <div className="space-y-2.5 pt-3 border-t border-white/5">
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider font-mono">Included benefits:</p>
                      {plan.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs">
                          <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="text-gray-300 leading-tight">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      type="button"
                      onClick={() => handleCtaClick(plan.tierCode)}
                      disabled={isPurchased}
                      className={`w-full py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider font-mono transition cursor-pointer text-center ${
                        isPurchased
                          ? 'bg-emerald-950/40 border border-emerald-500/20 text-emerald-400'
                          : plan.popular
                          ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/10'
                          : 'bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-gray-200'
                      }`}
                    >
                      {isPurchased ? '✓ ACTIVE LICENSE' : plan.cta}
                    </button>
                    {plan.popular && (
                      <p className="text-[9.5px] text-gray-500 text-center uppercase tracking-wider mt-2.5 font-mono">
                        💳 CARD PAYMENT EXCLUSIVELY REQUIRED
                      </p>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 7. FAQ Accordion Section */}
      <section id="faq" className="py-20 bg-[#050409] border-t border-white/5 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-[10.5px] bg-zinc-900 border border-white/5 text-zinc-400 px-3.5 py-1 rounded font-bold font-mono tracking-widest uppercase">
              COMMON INQUIRIES
            </span>
            <h3 className="text-3xl font-black text-white tracking-tight">Interactive Knowledge Base</h3>
            <p className="text-xs text-gray-400">Everything you need to clarify regarding the ViralForge ecosystem.</p>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="bg-[#0e0d19] border border-white/5 hover:border-white/10 rounded-2xl transition cursor-pointer overflow-hidden p-4 text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-white pr-4">
                      {item.q}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-zinc-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {isOpen && (
                    <p className="text-[11.5px] sm:text-xs text-gray-400 mt-3 pt-3 border-t border-white/5 leading-relaxed">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 8. Contact & Developer Office Desk Grid */}
      <section id="contact" className="py-20 bg-gradient-to-b from-[#050409] to-[#010102] px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#121124] to-[#0c0a15] rounded-3xl border border-white/10 p-6 md:p-10 relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 h-40 w-40 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-4">
              <span className="text-[9.5px] bg-violet-950 text-violet-400 border border-violet-500/20 px-2.5 py-0.5 rounded font-black font-mono uppercase tracking-widest leading-none">
                DEVELOPER DISPATCH
              </span>
              <h4 className="text-2xl font-black text-white leading-tight">
                Connect Directly with Creator Muhammad Talha
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Have specific campaign requirements or custom speech narrator needs? Reach out to Muhammad Talha directly to request custom models, language updates, or register bulk institutional channels.
              </p>
              
              <div className="space-y-2 pt-2 text-xs font-mono text-gray-300">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-violet-400" />
                  <span>khudriwelfarefoundation@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Manual Card Verification: &lt; 2 hours</span>
                </div>
              </div>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-5 space-y-4 text-left">
              <h5 className="text-xs font-black text-white uppercase tracking-wider font-mono">Submit Fast-Pass Ticket</h5>
              <p className="text-[10px] text-zinc-500">Need immediate help with payment status matching? Submit a fast support ticket reviewed in real-time.</p>
              
              <button
                type="button"
                onClick={currentUser ? onLaunchWorkspace : onTriggerLogin}
                className="w-full py-3 bg-[#131121] hover:bg-violet-950/20 border border-violet-500/30 hover:border-violet-500/50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider font-mono text-center"
              >
                <MessageSquare className="h-4 w-4 text-violet-400" />
                <span>Submit Ticket Log</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 9. Site Footer */}
      <footer className="bg-[#020104] border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-xs font-black text-white uppercase tracking-wider">ViralForge AI</span>
          </div>

          <p className="text-[11px] text-gray-600 font-mono tracking-normal leading-relaxed text-center">
            © 2026 ViralForge AI Inc. Designed by Muhammad Talha. Real-time synthesized text-to-speech engine. All rights reserved.
          </p>

          <div className="flex gap-4 text-xs font-mono text-zinc-500">
            <span className="text-xs">Secure Card Only</span>
            <span>•</span>
            <span onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white cursor-pointer transition">Back to Top ↑</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
