import React, { useState } from 'react';
import { 
  Users, DollarSign, Clock, Check, X, ShieldAlert, Award, 
  Send, RefreshCw, MessageSquare, AlertCircle, ClipboardList, Zap 
} from 'lucide-react';

interface UserRecord {
  email: string;
  name: string;
  role: 'admin' | 'user';
  tier: 'Free' | 'Unlimited';
  paymentStatus: 'none' | 'pending' | 'approved' | 'rejected';
  submittedAt?: string;
  paymentMethod?: string;
  trxId?: string;
}

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

interface OwnerAdminPanelProps {
  users: UserRecord[];
  tickets: SupportTicket[];
  onApprovePayment: (email: string) => void;
  onRejectPayment: (email: string) => void;
  onInstantUpgrade: (email: string) => void;
  onReplyTicket: (id: string, replyText: string) => void;
}

export default function OwnerAdminPanel({
  users,
  tickets,
  onApprovePayment,
  onRejectPayment,
  onInstantUpgrade,
  onReplyTicket
}: OwnerAdminPanelProps) {
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'approved'>('all');
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);

  // Calculate financials based on approved lifetime upgrades ($11.99 each)
  const approvedUsersCount = users.filter(u => u.paymentStatus === 'approved' && u.role !== 'admin').length;
  const pendingUsersCount = users.filter(u => u.paymentStatus === 'pending').length;
  const totalRevenue = approvedUsersCount * 11.99;

  const handleSendReply = (ticketId: string) => {
    const text = replyTextMap[ticketId] || '';
    if (!text.trim()) return;
    onReplyTicket(ticketId, text.trim());
    setReplyTextMap(prev => ({ ...prev, [ticketId]: '' }));
    setActiveTicketId(null);
  };

  const filteredUsers = users.filter(u => {
    if (filterMode === 'pending') return u.paymentStatus === 'pending';
    if (filterMode === 'approved') return u.paymentStatus === 'approved';
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Banner Intro */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-r from-violet-950/40 via-purple-950/35 to-zinc-950 border border-violet-500/30 overflow-hidden">
        <div className="absolute top-0 right-0 h-24 w-24 bg-violet-600/10 rounded-full blur-2xl animate-pulse" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">👑</span>
              <h2 className="text-lg font-black text-white tracking-tight uppercase">Muhammad Talha • App Owner Console</h2>
            </div>
            <p className="text-xs text-violet-300 font-medium leading-normal mt-1 max-w-2xl">
              Manage multi-channel client accounts, verify manual $11.99 subscriptions, trigger instant upgrades, and reply to client inquiries in real time.
            </p>
          </div>

          <div className="border border-amber-500/20 bg-amber-950/40 px-3.5 py-2.5 rounded-xl text-left shrink-0 max-w-sm">
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 block mb-1">
              🏦 Remittance Account benchmark details
            </span>
            <p className="text-[10.5px] text-gray-300 font-mono">
              Cardholder: <span className="text-white font-bold">Muhammad Talha</span>
            </p>
            <p className="text-[10.5px] text-gray-300 font-mono">
              Card Number: <span className="text-white font-bold">4782 7800 3108 5668</span>
            </p>
            <p className="text-[10.5px] text-gray-300 font-mono">
              Exp: <span className="text-white font-bold">02/29</span> | CVV: <span className="text-white font-bold">994</span>
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Key Admin KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl bg-[#0c0c14] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Approved Lifetime Licenses</span>
            <Award className="h-5 w-5 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{approvedUsersCount}</span>
            <span className="text-xs text-gray-500">owners</span>
          </div>
          <div className="mt-2 text-[10px] text-gray-500 font-medium font-mono leading-none">
            Lifetime access ($11.99)
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0c0c14] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between animate-pulse">
            <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider text-violet-400">Pending Activations</span>
            <Clock className="h-5 w-5 text-violet-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-rose-400">{pendingUsersCount}</span>
            <span className="text-xs text-gray-500">awaiting</span>
          </div>
          <div className="mt-2 text-[10px] text-rose-400/80 font-bold font-mono leading-none">
            {pendingUsersCount > 0 ? '● Real-time verification needed' : 'All user subscriptions vetted'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0c0c14] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Total Accumulated Funds</span>
            <DollarSign className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-400">${totalRevenue.toFixed(2)}</span>
            <span className="text-xs text-gray-500">USD</span>
          </div>
          <div className="mt-2 text-[10px] text-emerald-400/70 font-semibold font-mono leading-none">
            Sent directly to Muhammad Talha
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0c0c14] border border-white/10 relative overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Open Support Inquiries</span>
            <MessageSquare className="h-5 w-5 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-cyan-400">{tickets.filter(t => !t.reply).length}</span>
            <span className="text-xs text-gray-500">open tickets</span>
          </div>
          <div className="mt-2 text-[10px] text-gray-500 font-medium font-mono leading-none">
            {tickets.length} total customer tickets
          </div>
        </div>

      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: User Management & Subscription Requests */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Pending Subscriptions Queue */}
          <div className="p-5 rounded-2xl bg-[#0c0c14] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <span className="text-[11px] font-black uppercase text-rose-400 tracking-wider flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                  Subscription Verification queue ({pendingUsersCount})
                </span>
                <p className="text-[10.5px] text-gray-400 mt-1">
                  Users who processed payment of $11.99 via their choice of payment method. Review details and approve to unlock their applet.
                </p>
              </div>
            </div>

            {pendingUsersCount === 0 ? (
              <div className="text-center py-8 border border-dashed border-white/5 bg-black/25 rounded-xl">
                <span className="text-2xl">☕</span>
                <h4 className="text-xs font-bold text-gray-300 mt-2">Verification Queue Clear</h4>
                <p className="text-[10px] text-gray-500 mt-1">No pending subscription requests found at this hour.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {users.filter(u => u.paymentStatus === 'pending').map((pUser, index) => (
                  <div 
                    key={index} 
                    className="p-4 rounded-xl bg-gradient-to-tr from-black/60 to-zinc-900/60 border border-violet-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in"
                  >
                    <div>
                      <div className="flex items-center gap-2 font-black text-xs text-white">
                        <span>{pUser.name}</span>
                        <span className="text-[10px] font-mono text-zinc-400 font-normal">({pUser.email})</span>
                      </div>
                      
                      <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-1 bg-black/40 p-2 rounded-lg border border-white/5 text-[10.5px]">
                        <div>
                          <span className="text-gray-500 block text-[9px] uppercase tracking-wider font-extrabold">Amount</span>
                          <span className="font-bold text-emerald-400">$11.99 Lifetime</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-[9px] uppercase tracking-wider font-extrabold">Payment Method</span>
                          <span className="font-bold text-violet-300 uppercase">{pUser.paymentMethod || 'Credit Card'}</span>
                        </div>
                        <div className="col-span-2 mt-1 border-t border-white/5 pt-1">
                          <span className="text-gray-500 block text-[9px] uppercase tracking-wider font-extrabold">Transaction ID / Proof</span>
                          <span className="font-mono text-gray-300 text-[10px] break-all">{pUser.trxId || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 sm:self-center">
                      <button
                        type="button"
                        onClick={() => onApprovePayment(pUser.email)}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[10px] uppercase py-1.5 px-3 rounded-lg cursor-pointer transition shadow-md"
                      >
                        <Check className="h-3.5 w-3.5 bold" />
                        <span>Accept Payment</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onRejectPayment(pUser.email)}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1 bg-rose-950/40 border border-rose-500/30 hover:bg-rose-900/30 text-rose-300 font-bold text-[10px] uppercase py-1.5 px-2 rounded-lg cursor-pointer transition"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Deny</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Database Directory */}
          <div className="p-5 rounded-2xl bg-[#0c0c14] border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
              <div>
                <span className="text-[11px] font-black uppercase text-violet-400 tracking-wider">
                  👥 Master User Database ({users.length})
                </span>
                <p className="text-[10px] text-gray-400 mt-1">
                  Overview of all registered workspace nodes and license credentials.
                </p>
              </div>

              {/* Filtering tabs */}
              <div className="flex items-center bg-black rounded-lg border border-white/10 p-1 self-start">
                {(['all', 'pending', 'approved'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setFilterMode(tab)}
                    className={`px-2.5 py-1 rounded text-[10.5px] font-bold uppercase transition ${
                      filterMode === tab ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-[10.5px] uppercase font-black">
                    <td className="py-2">User Details</td>
                    <td className="py-2">Privilege Level</td>
                    <td className="py-2">Payment State</td>
                    <td className="py-2 text-right">Actions</td>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {filteredUsers.map((pUser, index) => {
                    const isOwner = pUser.email === 'khudriwelfarefoundation@gmail.com' || pUser.role === 'admin';
                    return (
                      <tr key={index} className="hover:bg-white/2 transition">
                        <td className="py-3 pr-3">
                          <p className="font-bold text-white text-xs">{pUser.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5">{pUser.email}</p>
                        </td>
                        <td className="py-3">
                          {isOwner ? (
                            <span className="px-2 py-0.5 rounded text-[9.5px] font-black uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
                              ♛ MASTER ADMIN
                            </span>
                          ) : pUser.tier === 'Unlimited' ? (
                            <span className="px-2 py-0.5 rounded text-[9.5px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              ⚡ LIFETIME UNLIMITED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[9.5px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-400">
                              ⌨ FREE TRIAL
                            </span>
                          )}
                        </td>
                        <td className="py-3">
                          <span className={`text-[10px] font-black uppercase font-mono px-2 py-0.5 rounded ${
                            pUser.paymentStatus === 'approved' 
                              ? 'bg-emerald-500/10 text-emerald-400' 
                              : pUser.paymentStatus === 'pending'
                              ? 'bg-rose-500/10 text-rose-400 animate-pulse'
                              : pUser.paymentStatus === 'rejected'
                              ? 'bg-zinc-800 text-zinc-500 line-through'
                              : 'bg-black/40 text-gray-600'
                          }`}>
                            {pUser.paymentStatus === 'approved' ? 'APPROVED' : pUser.paymentStatus === 'pending' ? 'PENDING' : pUser.paymentStatus === 'rejected' ? 'REJECTED' : 'NONE'}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          {!isOwner && pUser.tier !== 'Unlimited' && (
                            <button
                              onClick={() => onInstantUpgrade(pUser.email)}
                              className="px-2.5 py-1 text-[9.5px] font-bold uppercase rounded bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white cursor-pointer transition shadow-sm inline-flex items-center gap-1"
                              title="Instant upgrade bypassing payments"
                            >
                              <Zap className="h-3 w-3 shrink-0" />
                              <span>Instant Activate</span>
                            </button>
                          )}
                          {isOwner && (
                            <span className="text-[10px] text-gray-500 italic">Self-Owner</span>
                          )}
                          {!isOwner && pUser.tier === 'Unlimited' && (
                            <span className="text-[10px] text-emerald-400 font-bold">Uncompromised ★</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

        </div>

        {/* Right Column: Customer Assistance Desk */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#0c0c14] border border-white/10 space-y-4">
            <div>
              <span className="text-[11px] font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                <ClipboardList className="h-4 w-4 text-cyan-400" />
                Customer Help Desk ({tickets.length})
              </span>
              <p className="text-[10px] text-gray-400 mt-1">
                Tickets dispatched by clients experiencing payment hiccups or requiring system assist.
              </p>
            </div>

            {tickets.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-white/5 bg-black/25 rounded-xl">
                <span className="text-xl">📬</span>
                <p className="text-xs font-bold text-gray-300 mt-2">Help Desk Inbox Clear</p>
                <p className="text-[10px] text-gray-500 mt-1">No pending customer issues reported.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {tickets.map((t) => (
                  <div 
                    key={t.id} 
                    className={`p-3.5 border rounded-xl space-y-2 transition ${
                      t.reply 
                        ? 'border-white/5 bg-black/20 opacity-80' 
                        : 'border-cyan-500/30 bg-[#0f1722]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[8.5px] font-black uppercase font-mono px-1.5 py-0.2 rounded ${
                        t.urgency === 'high' 
                          ? 'bg-rose-500/20 text-rose-300' 
                          : t.urgency === 'medium'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {t.urgency} priority
                      </span>
                      <span className="text-[9.5px] text-gray-500 font-mono">{t.createdAt}</span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">{t.title}</h4>
                      <p className="text-[10px] text-gray-400 mt-1 bg-black/40 p-2 rounded border border-white/5 whitespace-pre-wrap">{t.message}</p>
                    </div>

                    <div className="text-[10.5px] text-zinc-400">
                      From: <span className="text-zinc-200 font-semibold">{t.userName}</span> <span className="text-[10px] font-mono text-zinc-500">({t.userEmail})</span>
                    </div>

                    {t.reply ? (
                      <div className="mt-2 bg-emerald-950/20 border-l-2 border-emerald-500 p-2 rounded">
                        <span className="text-[8.5px] font-black uppercase text-emerald-400 block tracking-wider">Muhammad Talha's Reply:</span>
                        <p className="text-[10px] text-emerald-200 italic mt-0.5">"{t.reply}"</p>
                      </div>
                    ) : (
                      <div className="mt-3 pt-2 border-t border-white/5">
                        {activeTicketId === t.id ? (
                          <div className="space-y-2">
                            <textarea
                              rows={2}
                              value={replyTextMap[t.id] || ''}
                              onChange={(e) => setReplyTextMap(prev => ({ ...prev, [t.id]: e.target.value }))}
                              placeholder="Type advice or resolution notification..."
                              className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 font-mono"
                            />
                            <div className="flex items-center gap-1.5 justify-end">
                              <button
                                onClick={() => setActiveTicketId(null)}
                                className="px-2 py-1 rounded text-[10px] text-gray-400 hover:text-white cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSendReply(t.id)}
                                className="px-2.5 py-1 rounded bg-cyan-700 hover:bg-cyan-600 text-[10px] text-white font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Send className="h-2.5 w-2.5" />
                                <span>Send Advice</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setActiveTicketId(t.id)}
                            className="w-full py-1 bg-cyan-950/40 hover:bg-cyan-900/30 border border-cyan-500/20 rounded text-[10px] font-bold text-cyan-300 hover:text-white text-center cursor-pointer transition block"
                          >
                            💬 Write Resolution Reply
                          </button>
                        )}
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
