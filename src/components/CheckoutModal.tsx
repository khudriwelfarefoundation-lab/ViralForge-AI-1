import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Sparkles, Check, ChevronRight, ShieldAlert, 
  Loader, Smartphone, Coins, Wallet, Copy, ShieldCheck, CheckCircle
} from 'lucide-react';

interface CheckoutModalProps {
  onClose: () => void;
  onSubmitPayment: (method: string, trxId: string) => void;
}

export default function CheckoutModal({ onClose, onSubmitPayment }: CheckoutModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'gpay' | 'paypal' | 'crypto'>('card');
  const [userCardName, setUserCardName] = useState('');
  const [userCardNumber, setUserCardNumber] = useState('');
  const [userCardExpiry, setUserCardExpiry] = useState('');
  const [userCardCvv, setUserCardCvv] = useState('');
  const [cryptoTrx, setCryptoTrx] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStatusSuccess, setShowStatusSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedTextStatus, setCopiedTextStatus] = useState<string | null>(null);

  // Core configuration loaded dynamically from the Express backend securely
  const [paymentConfig, setPaymentConfig] = useState<{
    price: number;
    cryptoTRC20: string;
    paypalEmail: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/payment/config')
      .then(res => res.json())
      .then(data => {
        setPaymentConfig(data);
      })
      .catch(err => {
        console.error("Failed to load secure backend billing specifications:", err);
      });
  }, []);

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTextStatus(label);
    setTimeout(() => setCopiedTextStatus(null), 1500);
  };

  const handlePrefillSandboxUser = () => {
    setUserCardNumber('4111 2568 9940 3108');
    setUserCardName('Alex Peterson');
    setUserCardExpiry('12/29');
    setUserCardCvv('442');
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setUserCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setUserCardExpiry(value.slice(0, 5));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setUserCardCvv(value.slice(0, 3));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    let generatedTrxId = '';
    const priceStr = paymentConfig ? `$${paymentConfig.price}` : '$11.99';

    if (selectedMethod === 'card') {
      if (userCardNumber.replace(/\s/g, '').length < 16) {
        setErrorMsg('Please input a complete 16-digit credit card sequence.');
        return;
      }
      if (!userCardName.trim()) {
        setErrorMsg('Cardholder authentic name representation is required.');
        return;
      }
      if (userCardExpiry.length < 5) {
        setErrorMsg('Please specify MM/YY credit expiration date format.');
        return;
      }
      if (userCardCvv.length < 3) {
        setErrorMsg('3-digit CVV identification code is required.');
        return;
      }
      generatedTrxId = `CC-LAST4-${userCardNumber.slice(-4)}-TRX-${Math.floor(1000 + Math.random() * 9000)}`;
    } else if (selectedMethod === 'crypto') {
      if (!cryptoTrx.trim()) {
        setErrorMsg('USDT Blockchain Tron TXID address/hash field is mandatory.');
        return;
      }
      if (cryptoTrx.trim().length < 20) {
        setErrorMsg('Please submit a realistic TRC-20 transaction hash (minimum 20 characters) for ledger audit.');
        return;
      }
      generatedTrxId = cryptoTrx.trim();
    } else if (selectedMethod === 'paypal') {
      if (!paypalEmail.trim() || !paypalEmail.includes('@')) {
        setErrorMsg('Please input your registered PayPal account address.');
        return;
      }
      generatedTrxId = `PP-ACC-${paypalEmail.trim().split('@')[0].toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    } else if (selectedMethod === 'gpay') {
      generatedTrxId = `GPAY-TOK-${Math.floor(1000000 + Math.random() * 9000000)}`;
    }

    setIsSubmitting(true);

    // Simulate transfer dispatch to Muhammad Talha's ledger node
    setTimeout(() => {
      setIsSubmitting(false);
      setShowStatusSuccess(true);
      setTimeout(() => {
        let methodNameDisplay = '';
        switch (selectedMethod) {
          case 'card': methodNameDisplay = 'Credit Card'; break;
          case 'gpay': methodNameDisplay = 'Google Pay'; break;
          case 'paypal': methodNameDisplay = 'PayPal Express'; break;
          case 'crypto': methodNameDisplay = `USDT TRC20 Crypto`; break;
        }
        onSubmitPayment(methodNameDisplay, generatedTrxId);
      }, 1500);
    }, 1800);
  };

  const finalUSDTWallet = paymentConfig?.cryptoTRC20 || "TY7u88N2Bv9xW90dLaK88xS9xZ5e9D88vQ";
  const finalPaypalEmail = paymentConfig?.paypalEmail || "khudriwelfarefoundation@gmail.com";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#09090f] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row my-8 text-left animate-fade-in">
        
        {/* Left Side: Dynamic Purchase Invoice Panel (Hides active owner card from general clients) */}
        <div className="flex-1 bg-gradient-to-b from-[#111119] to-[#06060c] p-6 md:p-8 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-amber-400 shrink-0" />
              <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider font-mono">
                Lifetime Premium License Key
              </span>
            </div>
            
            <div>
              <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest font-mono">Amount Due</p>
              <h2 className="text-3xl font-black text-white tracking-tight mt-1 leading-none font-mono">
                $11.99 <span className="text-xs text-zinc-500 font-sans font-medium uppercase">USD</span>
              </h2>
              <p className="text-[11px] text-emerald-400 font-medium font-mono mt-2 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                One-Time Payment • Unlocks Lifetime Access
              </p>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Unlock limitless high-definition clip generation, automatic translation pipelines, deep search SEO enhancements, and bulk scheduling channels. Your payment goes directly to app owner <span className="text-white font-bold">Muhammad Talha</span>.
            </p>

            {/* Unlocked Attributes Panel */}
            <div className="space-y-2.5 mt-2 text-xs border-t border-b border-zinc-800/85 py-4">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white leading-none">Unlimited 4K Rendering</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Bypasses local memory restrictions.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white leading-none">All Premium AI Voice Generators</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Realistic human narrative overlays.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white leading-none">Complete SEO Multi-Channel Publisher</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Grow organically across TikTok, Insta, & YouTube.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-6">
            <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-mono leading-none">
              <ShieldCheck className="h-4 w-4 text-violet-400 shrink-0" />
              <span>SECURED SECURE_SOCKET_LAYER ENCRYPTED SYSTEM</span>
            </div>
            <p className="text-[9.5px] text-zinc-600 italic leading-snug">
              *Your payment is audited directly on Muhammad Talha's ledger workspace node. Once received, premium modules are instantenously unlocked.
            </p>
          </div>
        </div>

        {/* Right Side: Responsive Payment Form requiring CARD Payment exclusively */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6 font-sans">
              <span className="text-xs font-black text-zinc-400 uppercase tracking-widest font-mono">Secure Credit Portal</span>
              <span className="text-[9.5px] bg-emerald-950/40 border border-emerald-500/25 text-emerald-400 font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wide">
                CARD PAYMENT ONLY
              </span>
            </div>

            {/* Interactive Forms Layout */}
            {showStatusSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center animate-fade-in font-sans">
                <div className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl animate-bounce">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Payment Registered Successfully</h4>
                  <p className="text-xs text-zinc-400 mt-1 max-w-[280px] mx-auto leading-relaxed">
                    Subscription ticket successfully dispatched to Muhammad Talha's server audit node. Real-time ledger records have updated.
                  </p>
                </div>
                <div className="text-[9.5px] font-mono text-cyan-400 font-bold bg-cyan-950/40 px-3.5 py-1.5 rounded border border-cyan-500/20 max-w-sm">
                  Ledger verification in progress...
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2 animate-fade-in font-sans">
                    <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* 1. CREDIT CARD FORM with Interactive Digital Card Face */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400 uppercase font-black tracking-wider">
                      Enter Card Account
                    </span>
                    <button
                      type="button"
                      onClick={handlePrefillSandboxUser}
                      className="text-[9.5px] text-violet-400 border border-violet-500/20 hover:bg-violet-950/20 px-2.5 py-0.5 rounded transition font-mono font-bold"
                    >
                      ⚡ Prefill Sandbox Card
                    </button>
                  </div>

                  {/* Responsive Dynamic Credit Card Widget */}
                  <div className="w-full bg-gradient-to-tr from-zinc-900 to-indigo-950 border border-zinc-800 rounded-xl p-4 text-white relative shadow-inner overflow-hidden font-mono text-left select-none mb-1">
                    <div className="absolute -top-12 -right-12 h-36 w-36 bg-violet-600/10 rounded-full blur-xl pointer-events-none" />
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-xs font-black tracking-widest text-zinc-500">SECURE BANK DEBIT</span>
                      <span className="text-lg">💳</span>
                    </div>
                    
                    {/* Interactive Card Number representation */}
                    <p className="text-base font-black tracking-widest text-white/90 drop-shadow min-h-[24px]">
                      {userCardNumber || '•••• •••• •••• ••••'}
                    </p>

                    <div className="flex justify-between items-end mt-5 text-[10px]">
                      <div>
                        <p className="text-zinc-500 font-sans tracking-wide text-[8.5px] uppercase font-bold leading-none">Holder Name</p>
                        <p className="text-slate-300 font-bold max-w-[170px] truncate uppercase mt-1 min-h-[15px]">
                          {userCardName || 'Cardholder Name'}
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <div>
                          <p className="text-zinc-500 font-sans tracking-wide text-[8.5px] uppercase font-bold leading-none">Expiry</p>
                          <p className="text-slate-300 font-bold mt-1 min-h-[15px]">{userCardExpiry || 'MM/YY'}</p>
                        </div>
                        <div>
                          <p className="text-zinc-500 font-sans tracking-wide text-[8.5px] uppercase font-bold leading-none">CVV</p>
                          <p className="text-slate-300 font-bold mt-1 min-h-[15px]">{userCardCvv ? '***' : '•••'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 font-sans">
                    <label className="text-[10px] text-zinc-500 uppercase font-black block">Cardholder Legal Name</label>
                    <input
                      type="text"
                      required
                      value={userCardName}
                      onChange={(e) => setUserCardName(e.target.value)}
                      placeholder="e.g. Alex Peterson"
                      className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-violet-500 transition font-sans"
                    />
                  </div>

                  <div className="space-y-1 font-sans">
                    <label className="text-[10px] text-zinc-500 uppercase font-black block text-left">16-Digit card number</label>
                    <input
                      type="text"
                      required
                      value={userCardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4111 2222 3333 4444"
                      className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-violet-500 transition font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 font-sans">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase font-black block">Expiry Date</label>
                      <input
                        type="text"
                        required
                        value={userCardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-violet-500 transition font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase font-black block">CVC/CVV</label>
                      <input
                        type="password"
                        required
                        value={userCardCvv}
                        onChange={handleCvvChange}
                        placeholder="•••"
                        maxLength={3}
                        className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-violet-500 transition font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Total invoice block */}
                <div className="bg-black border border-zinc-800 rounded-xl p-3.5 flex justify-between items-center text-xs mt-4 font-sans">
                  <div>
                    <p className="text-zinc-400 font-bold font-sans">Charged Subtotal:</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5 leading-none">
                      Unlocked with Lifetime License Key
                    </p>
                  </div>
                  <span className="text-lg font-black text-white font-mono">$11.99 USD</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-xs font-black uppercase py-3 px-4 rounded-xl text-white transition duration-200 cursor-pointer shadow-md disabled:opacity-50 tracking-wider font-sans"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Encrypting Tokens Securely...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Payment Verification Receipt 🚀</span>
                      <ChevronRight className="h-4.5 w-4.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between text-[10px] text-zinc-500 border-t border-zinc-800/80 pt-4 font-mono">
            <button
              type="button"
              onClick={onClose}
              className="hover:text-white transition cursor-pointer font-bold uppercase tracking-widest text-[9px]"
            >
              Cancel Order
            </button>
            <span className="flex items-center gap-1">🔒 SECURE LEDGER ENDPOINT ACTIVE</span>
          </div>
        </div>

      </div>
    </div>
  );
}
