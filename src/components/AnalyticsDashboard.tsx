import React from 'react';
import { TrendingUp, Users, Play, Heart, Award, ArrowUpRight, BarChart3, Globe } from 'lucide-react';

export default function AnalyticsDashboard() {
  const metrics = [
    { title: 'Global Viral Outreach', value: '1,420,539', label: 'Cumulative views', delta: '+12.5%', icon: '🚀' },
    { title: 'Subscriber Amplification', value: '109,242', label: 'Linked network net', delta: '+8.4%', icon: '👥' },
    { title: 'Average Clickthrough (CTR)', value: '14.8%', label: 'Audience retention', delta: '+3.1%', icon: '📈' },
    { title: 'Aggregate Likes & Shares', value: '984,142', label: 'Social engagement', delta: '+15.2%', icon: '💖' },
  ];

  return (
    <div id="analytics-studios-dashboard" className="space-y-6">
      
      {/* Cards summary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-10 w-10 bg-violet-600/10 rounded-full blur-xl group-hover:scale-150 transition duration-500" />
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl">{m.icon}</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center">
                {m.delta} <ArrowUpRight className="h-3 w-3 ml-0.5" />
              </span>
            </div>

            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{m.title}</p>
            <h3 className="text-2xl font-black text-white mt-1 tracking-tight font-mono">{m.value}</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Retention graph container */}
        <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-violet-400">Viral Click Velocities Metric</h4>
              <p className="text-[11px] text-gray-500">Track view escalation rates throughout campaign cycles</p>
            </div>
            
            <span className="text-[10px] font-mono font-bold bg-black/60 px-2.5 py-1 rounded border border-white/5 text-gray-300 flex items-center gap-1">
              <BarChart3 className="h-3.5 w-3.5" /> Organic Traffic
            </span>
          </div>

          {/* Simple custom decorative high fidelity SVG line chart */}
          <div className="h-[220px] w-full bg-black/40 rounded-xl relative border border-white/5 flex items-end p-4">
            <svg className="absolute inset-0 h-full w-full p-4" viewBox="0 0 100 30" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              <line x1="0" y1="5" x2="100" y2="5" stroke="rgba(255,255,255,0.05)" strokeWidth="0.1" />
              <line x1="0" y1="15" x2="100" y2="15" stroke="rgba(255,255,255,0.05)" strokeWidth="0.1" />
              <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.05)" strokeWidth="0.1" />
              
              {/* Peak area */}
              <path d="M 0 30 Q 15 25, 30 18 T 60 10 T 90 2 Q 95 3, 100 4 L 100 30 Z" fill="url(#gradient)" />
              {/* Highlight path line */}
              <path d="M 0 28 C 15 25, 35 15, 60 7 S 85 4, 100 2" fill="none" stroke="url(#gradient)" strokeWidth="0.4" strokeLinecap="round" />
            </svg>

            {/* Labels overlay */}
            <div className="absolute bottom-1 left-2 right-2 flex justify-between text-[8px] font-mono text-gray-500">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
            
            {/* Value tooltip */}
            <div className="absolute top-8 right-24 bg-violet-650 bg-violet-600 border border-violet-400 text-white font-mono text-[9px] font-bold py-1 px-2 rounded shadow-md pointer-events-none">
              Peak: 242.4K views reached
            </div>
          </div>
        </div>

        {/* Channels optimization weights */}
        <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-violet-400">Channels Weighting Distribution</h4>
          <p className="text-[11px] text-gray-500">Relative allocation performance profiles</p>

          <div className="space-y-4.5 pt-2">
            {[
              { plat: 'TikTok Vertical Shorts', ratio: '42%', color: 'bg-[#00f2fe]', width: 'w-[42%]', total: '596,200 views' },
              { plat: 'Instagram Rails / Stories', ratio: '35%', color: 'bg-pink-500', width: 'w-[35%]', total: '497,100 views' },
              { plat: 'YouTube Cine Shorts', ratio: '18%', color: 'bg-red-500', width: 'w-[18%]', total: '255,600 views' },
              { plat: 'Facebook Meta Pages', ratio: '5%', color: 'bg-blue-500', width: 'w-[5%]', total: '71,639 views' }
            ].map((p, itemIdx) => (
              <div key={itemIdx} className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-semibold text-gray-200">{p.plat}</span>
                  <span className="font-mono text-gray-400">{p.ratio}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                  <div className={`h-full ${p.color} ${p.width} rounded-full`} />
                </div>
                <div className="text-[9px] text-gray-500 font-mono text-right">{p.total}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
