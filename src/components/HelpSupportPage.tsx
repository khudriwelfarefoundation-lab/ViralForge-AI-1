import React, { useState } from 'react';
import { Mail, LifeBuoy, Send, ShieldCheck, Copy, CheckCircle, Info, Heart } from 'lucide-react';

interface SupportTicket {
  id: string;
  userEmail: string;
  userName: string;
  title: string;
  message: string;
  urgency: 'low' | 'medium' | 'high';
  createdAt: string;
  reply?: string;
}

interface HelpSupportPageProps {
  currentUser: { email: string; name: string };
  tickets: SupportTicket[];
  onSubmitTicket: (ticket: { title: string; message: string; urgency: 'low' | 'medium' | 'high' }) => void;
}

export default function HelpSupportPage({ currentUser, tickets, onSubmitTicket }: HelpSupportPageProps) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [showSubSuccess, setShowSubSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const myTickets = tickets.filter(t => t.userEmail === currentUser.email);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    onSubmitTicket({
      title: title.trim(),
      message: message.trim(),
      urgency
    });

    setTitle('');
    setMessage('');
    setUrgency('medium');
    setShowSubSuccess(true);
    setTimeout(() => setShowSubSuccess(false), 3000);
  };

  const faqs = [
    {
      q: "How does the lifetime subscription unlock work?",
      a: "Simply complete the single $11.99 transfer via any of our 5 payment gateways to Muhammad Talha's designated node credentials. Input your transaction reference or last 4 digits of your card, and submit. The transfer triggers a real-time sound notification in Muhammad Talha's admin office. Once verified, Muhammad Talha accepts your payment, promoting your email instantly to Unlimited Lifetime VIP."
    },
    {
      q: "Which payment options are supported?",
      a: "We support: 1) Credit or Debit Card directly; 2) PayPal Smart wallets; 3) Google Pay / Wallet fast checkouts; 4) Cryptocurrency transfers (USDT on TRC-20); and 5) Local Bank Account bank wire transfers."
    },
    {
      q: "How long does Muhammad Talha take to activate accounts?",
      a: "Muhammad Talha reviews incoming payments multiple times daily. Activations are typically processed in under 1-2 hours. You can drop a support ticket below or email khudriwelfarefoundation@gmail.com directly for expedited VIP approval."
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Upper header */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-r from-[#11111f] to-zinc-950 border border-white/5 overflow-hidden text-left">
        <div className="absolute top-1/2 left-3/4 h-24 w-24 bg-cyan-400/5 rounded-full blur-2xl pointer-events-none" />
        <span className="text-[10px] font-black uppercase text-cyan-400 tracking-widest block">
          🔧 Assistance Center
        </span>
        <h2 className="text-lg font-black text-white tracking-tight uppercase mt-1">
          Direct Customer Help Desk
        </h2>
        <p className="text-xs text-gray-400 mt-1 max-w-xl">
          Get in touch directly with the App Owner, Muhammad Talha, submit activation inquiries, and track processing ticket statuses below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: FAQ & Direct Account Info Card */}
        <div className="space-y-6 lg:col-span-1 text-left">
          
          {/* Muhammad Talha direct details */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#12121e] to-black border border-white/10 relative">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="h-10 w-10 rounded-xl bg-violet-600/20 text-violet-300 font-bold flex items-center justify-center text-lg">
                👨‍💼
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-white tracking-wide">Muhammad Talha</h3>
                <p className="text-[10px] text-gray-400">Founder & Owner, Forge Studio</p>
              </div>
            </div>

            <div className="space-y-3.5 mt-4 border-t border-white/5 pt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Owner Email:</span>
                <span className="text-white font-mono hover:underline cursor-pointer select-all font-semibold">
                  khudriwelfarefoundation@gmail.com
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Response Speed:</span>
                <span className="text-emerald-400 font-bold">Very High (Instant Approval)</span>
              </div>
            </div>

            {/* Owner Payment Node details copy card */}
            <div className="mt-5 bg-violet-950/20 border border-violet-500/20 rounded-xl p-3.5 space-y-2">
              <span className="text-[9px] font-black text-violet-300 uppercase tracking-wider block">
                🏦 Muhammad Talha Account specification
              </span>
              <p className="text-[10.5px] text-gray-400 leading-normal font-medium">
                Use these direct card specifications to manually process mock lifetime upgrades:
              </p>
              <div className="space-y-1.5 text-[10.5px] bg-black/40 p-2.5 rounded-lg border border-white/5">
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-[10px]">Holder: Muhammad Talha</span>
                  <button 
                    onClick={() => handleCopy("Muhammad Talha", "holder")}
                    className="text-[9.5px] text-violet-400 hover:text-white"
                  >
                    {copiedField === 'holder' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-mono text-[10px]">Number: 4782 7800 3108 5668</span>
                  <button 
                    onClick={() => handleCopy("4782780031085668", "number")}
                    className="text-[9.5px] text-violet-400 hover:text-white"
                  >
                    {copiedField === 'number' ? 'Copied' : 'Copy'}
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-[10px]">Expiry: 02/29 | CVC: 994</span>
                  <button 
                    onClick={() => handleCopy("02/29, CVC: 994", "expiry")}
                    className="text-[9.5px] text-violet-400 hover:text-white"
                  >
                    {copiedField === 'expiry' ? 'Copied' : 'Copy'}
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Quick FAQ accordion */}
          <div className="p-5 rounded-2xl bg-[#0c0c14] border border-white/10 space-y-4">
            <h3 className="text-xs font-black uppercase text-white tracking-widest">
              Frequently Asked Support
            </h3>
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-[11px] font-bold text-violet-400 leading-normal font-sans">
                    Q: {f.q}
                  </p>
                  <p className="text-[10.5px] text-gray-400 leading-normal">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 2 columns: Input Form & Sent Tickets Tracker */}
        <div className="lg:col-span-2 space-y-6 text-left">
          
          {/* Submit ticket widget */}
          <div className="p-5 rounded-2xl bg-[#0c0c14] border border-white/10 space-y-4">
            <h3 className="text-xs font-black uppercase text-white tracking-widest flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              Open ticket resolution request
            </h3>

            {showSubSuccess && (
              <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Support ticket delivered directly to Muhammad Talha's admin terminal. Track updates below.</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[9.5px] text-gray-500 uppercase font-black tracking-wider block">Ticket Heading</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Activation Request - Crypto transfer receipt matching"
                    className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] text-gray-500 uppercase font-black tracking-wider block">Urgency Priority</label>
                  <select
                    value={urgency}
                    onChange={(e: any) => setUrgency(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-bold"
                  >
                    <option value="low">Low - General Inq</option>
                    <option value="medium">Medium - Activation</option>
                    <option value="high">High - Escalated VIP</option>
                  </select>
                </div>

              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] text-gray-500 uppercase font-black tracking-wider block">Detailed support advice request</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell Muhammad Talha about your payment or question. Write down transaction reference IDs, dates, and account emails here so he can verify transfer coordinates instantly in database..."
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-xs font-black uppercase py-2.5 px-6 rounded-xl text-white cursor-pointer transition shadow-md"
              >
                <span>Submit Ticket to Owner</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

          {/* User's existing ticket history */}
          <div className="p-5 rounded-2xl bg-[#0c0c14] border border-white/10 space-y-4">
            <h3 className="text-xs font-black uppercase text-white tracking-widest">
              My Sent Tickets History ({myTickets.length})
            </h3>

            {myTickets.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-white/5 bg-black/25 rounded-xl">
                <span className="text-lg">📬</span>
                <p className="text-xs font-bold text-gray-500 mt-2">No Support History</p>
                <p className="text-[10px] text-gray-600">You haven't submitted any inquiries yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myTickets.map((t) => (
                  <div key={t.id} className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white block">{t.title}</span>
                      <span className="text-[9px] text-zinc-500 font-mono">{t.createdAt}</span>
                    </div>

                    <p className="text-[10.5px] text-zinc-400 bg-zinc-950/40 p-2.5 rounded border border-white/5 whitespace-pre-wrap">
                      {t.message}
                    </p>

                    <div className="flex items-center gap-1.5 pt-1.5">
                      <span className="text-[9px] font-black uppercase text-zinc-500">Ticket Status:</span>
                      {t.reply ? (
                        <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase px-2 py-0.5 rounded">
                          RESOLVED ✓
                        </span>
                      ) : (
                        <span className="bg-amber-500/10 text-amber-400 text-[9px] font-black uppercase px-2 py-0.5 rounded animate-pulse">
                          PENDING OWNERS REVIEW
                        </span>
                      )}
                    </div>

                    {t.reply && (
                      <div className="mt-3 bg-zinc-900 border-l-2 border-cyan-500 p-3 rounded text-[10.5px]">
                        <span className="font-black uppercase text-cyan-400 block pb-1">Muhammad Talha Reply:</span>
                        <p className="text-zinc-200 italic">"{t.reply}"</p>
                      </div>
                    )}
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
