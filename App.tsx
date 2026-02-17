import React, { useState, useMemo, useEffect } from 'react';
import { Account, FilterState, Rank, UserRole, Order, OrderStatus, Payout, PayoutStatus, User, Review, Dispute, SecurityLog, AdminSettings, SettingsHistory } from './types.ts';
import { supabase } from './lib/supabase.ts';
import AccountCard from './components/AccountCard';
import UPICheckout from './components/UPICheckout.tsx';
import AuthPage from './components/AuthPage.tsx';
import AddAccountModal from './components/AddAccountModal.tsx';
import SellerDashboard from './components/SellerDashboard.tsx';
import BuyerDashboard from './components/BuyerDashboard.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import TrustSection from './components/TrustSection.tsx';
import ReviewSlider from './components/ReviewSlider.tsx';
import ReviewSystem from './components/ReviewSystem.tsx';
import Header from './components/Header.tsx';
import AccountDetailsModal from './components/AccountDetailsModal.tsx';
import InformationBlocks from './components/InformationBlocks.tsx';
import AboutSection from './components/AboutSection.tsx';
import { 
  Search, SlidersHorizontal, Flame, ShieldCheck, ArrowUpDown, Store, UserPlus, Gamepad2, ShieldAlert, RotateCcw, ShieldCheck as ShieldIcon, Zap, AlertCircle, AlertTriangle, ChevronLeft, ChevronRight, Radio, Info, Terminal, Timer, Gift, MessageCircle, Headset, Send, Sparkles, LayoutGrid
} from 'lucide-react';

const INITIAL_USERS: User[] = [
  { id: 'admin-1', name: 'Master Admin', email: 'bharatgaming2026@gmail.com', role: 'admin', joinedAt: '2024-01-01', walletBalance: 150000, status: 'active', lastLoginIp: '103.24.45.12' },
  { id: 'sel-1', name: 'Rahul Sharma', email: 'rahul@gmail.com', role: 'seller', joinedAt: '2024-02-15', walletBalance: 12450, status: 'active', isVerified: true },
  { id: 'buy-1', name: 'Suresh Gamer', email: 'suresh@mail.com', role: 'buyer', joinedAt: '2024-04-05', walletBalance: 0, status: 'active', wishlist: ['market-2'] },
];

const MOCK_REVIEWS: Review[] = [
  { id: 'rev-1', userName: 'Aryan Gupta', rating: 5, comment: 'Bhai ekdum OP account mila! Trusted marketplace hai.', date: '12 May 2024', isVerified: true, idLevel: 72 },
  { id: 'rev-2', userName: 'Siddharth Mehra', rating: 5, comment: 'Escrow safe hai, koi tension nahi. UPI payment quickly verify ho gaya.', date: '15 May 2024', isVerified: true, idLevel: 65 },
  { id: 'rev-3', userName: 'Rahul Verma', rating: 5, comment: 'Fast delivery, credentials working perfectly. Trusted admin.', date: '18 May 2024', isVerified: true, idLevel: 74 },
  { id: 'rev-4', userName: 'Amit Singh', rating: 5, comment: 'Sakura bundle account secured! Best price in India.', date: '20 May 2024', isVerified: true, idLevel: 78 },
  { id: 'rev-5', userName: 'Priya Das', rating: 4, comment: 'Payment verification took some time but got the ID. Support is helpful.', date: '21 May 2024', idLevel: 62, isVerified: true },
  { id: 'rev-6', userName: 'Rohan Mehra', rating: 5, comment: 'Best site for FF ID. No scam, only real IDs.', date: '22 May 2024', idLevel: 69, isVerified: true },
  { id: 'rev-7', userName: 'Karan Malhotra', rating: 5, comment: 'Evolution guns maxed out! Value for money.', date: '23 May 2024', idLevel: 71, isVerified: true },
  { id: 'rev-8', userName: 'Sneha Roy', rating: 5, comment: 'Trusted marketplace. UPI payment makes it very easy.', date: '24 May 2024', idLevel: 66, isVerified: true },
  { id: 'rev-9', userName: 'Vikram Rathore', rating: 5, comment: 'Hip Hop account successfully transferred. Happy buyer!', date: '25 May 2024', idLevel: 80, isVerified: true },
  { id: 'rev-10', userName: 'Deepak Kumar', rating: 5, comment: 'Genuine sellers and safe escrow system. Recommended.', date: '26 May 2024', idLevel: 75, isVerified: true },
  { id: 'rev-11', userName: 'Ankit Gupta', rating: 5, comment: 'Best customer service. They helped me with the login issues.', date: '27 May 2024', idLevel: 73, isVerified: true },
  { id: 'rev-12', userName: 'Manoj Patel', rating: 4, comment: 'Good deal. A bit of delay in reply but overall smooth.', date: '28 May 2024', idLevel: 68, isVerified: true },
];

const INITIAL_SETTINGS: AdminSettings = {
  upiId: 'viveksingh200494@ybl',
  qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=viveksingh200494@ybl%26pn=BHARAT_GAMING%26am=0%26cu=INR',
  bankDetails: 'Bank: HDFC, Name: Bharat Gaming Hub, A/C: 501004562391, IFSC: HDFC0001243',
  commissionRate: 0.20,
  lastUpdated: '2024-05-24',
  maintenanceMode: false,
  broadcastMessage: 'Welcome to India’s most secure Free Fire account portal. Use UPI for instant verification!'
};

const ITEMS_PER_PAGE = 6;

const generateMarketAccounts = (count: number): Account[] => {
  const ranks = Object.values(Rank);
  const bundles = ['Hip Hop', 'Sakura', 'Skull Hunter', 'Arctic Blue', 'Criminal Blue', 'Cobra', 'Zombie Samurai', 'Golden Shade'];
  const titles = [
    'Old Season Rare Account', 'Cobra Max Evolution ID', 'OG Hip Hop Profile', 'Level 70+ Heroic ID',
    'Criminal Bundle Special', 'Sakura Full Set Account', 'Diamond 💎 Loaded ID', 'Elite Pass Season 1-5'
  ];
  const loginTypes = ['Facebook', 'Google', 'VK', 'Twitter'] as const;
  
  return Array.from({ length: count }).map((_, i) => ({
    id: `market-${i}`,
    sellerId: `sel-${(i % 3) + 1}`,
    title: titles[Math.floor(Math.random() * titles.length)] + ` #${i+1}`,
    price: Math.floor(Math.random() * (5000 - 500 + 1)) + 500,
    rank: ranks[Math.floor(Math.random() * ranks.length)],
    level: Math.floor(Math.random() * 45) + 35,
    diamonds: Math.floor(Math.random() * 3000),
    emotesCount: Math.floor(Math.random() * 60),
    gunSkinsCount: Math.floor(Math.random() * 150),
    rareSkins: bundles.slice(0, Math.floor(Math.random() * 3) + 1),
    characters: Math.floor(Math.random() * 30) + 20,
    evolutionGuns: Math.floor(Math.random() * 8),
    imageUrl: `https://picsum.photos/seed/ff-market-${i}/800/600`,
    screenshots: Array.from({ length: 5 }).map((_, j) => `https://picsum.photos/seed/ff-ss-${i}-${j}/1200/900`),
    isVerified: true,
    isApproved: true, 
    sellerRating: 4.2 + Math.random() * 0.8,
    stats: { level: 40 + (i%30), badges: 500 + (i*10), kda: 2.1 + (i*0.1), headshotRate: `${30 + (i)}%` },
    uid: `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    bundles: bundles.slice(0, 2),
    elitePass: true,
    description: 'Premium Indian Free Fire account with verified assets and secure handshaking.',
    isSold: false,
    isLocked: false,
    server: 'India',
    views: Math.floor(Math.random() * 2000),
    loginType: loginTypes[Math.floor(Math.random() * loginTypes.length)],
    createdAt: Date.now() - (i * 3600000) // Mock timestamps
  }));
};

export default function App() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [logs, setLogs] = useState<SecurityLog[]>([
    { id: 'log-1', userId: 'admin-1', action: 'ADMIN_OVERRIDE_AUTH', ip: '103.24.45.12', timestamp: '2024-05-24 14:22', severity: 'low' },
  ]);
  
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(INITIAL_SETTINGS);
  const [settingsHistory, setSettingsHistory] = useState<SettingsHistory[]>([
    { id: 'h-1', changedBy: 'admin-1', field: 'Commission', oldValue: '0.15', newValue: '0.20', timestamp: '2024-05-24' }
  ]);

  const [user, setUser] = useState<User | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [detailAccount, setDetailAccount] = useState<Account | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup' | '2fa' | 'admin-login'>('login');
  const [view, setView] = useState<'market' | 'dashboard' | 'admin-dashboard' | 'checkout'>('market');
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingAction, setPendingAction] = useState<{ account: Account; action: 'buy' | 'view' } | null>(null);

  const [offerExpiry, setOfferExpiry] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Sync with Supabase on mount
  useEffect(() => {
    const fetchData = async () => {
      // Fetch Orders
      const { data: ordersData, error: ordersError } = await supabase.from('orders').select('*');
      if (ordersData && !ordersError) {
        setOrders(ordersData as Order[]);
      }

      // Fetch Accounts
      const { data: accountsData, error: accountsError } = await supabase.from('accounts').select('*');
      if (accountsData && accountsData.length > 0 && !accountsError) {
        setAccounts(accountsData as Account[]);
      } else {
        setAccounts(generateMarketAccounts(30));
      }

      // Fetch Users
      const { data: usersData, error: usersError } = await supabase.from('users').select('*');
      if (usersData && !usersError) {
        setUsers(prev => [...prev, ...(usersData as User[])]);
      }
      
      // Fetch Payouts
      const { data: payoutsData, error: payoutsError } = await supabase.from('payouts').select('*');
      if (payoutsData && !payoutsError) {
        setPayouts(payoutsData as Payout[]);
      }
    };
    fetchData();
  }, []);

  // Global ID Lock Checker (Auto-unlock after 15 mins)
  useEffect(() => {
    const lockTimer = setInterval(() => {
      const now = Date.now();
      setAccounts(prev => prev.map(acc => {
        if (acc.isLocked && !acc.isSold && acc.lockedUntil && now > acc.lockedUntil) {
          return { ...acc, isLocked: false, lockedUntil: undefined };
        }
        return acc;
      }));
    }, 30000);
    return () => clearInterval(lockTimer);
  }, []);

  useEffect(() => {
    if (!offerExpiry) return;
    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((offerExpiry - now) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) setOfferExpiry(null);
    }, 1000);
    return () => clearInterval(timer);
  }, [offerExpiry]);

  const handleAuthSuccess = async (userData: { name: string; role: UserRole; email: string; isNewUser?: boolean }) => {
    let finalRole = userData.role;
    if (userData.email.toLowerCase() === 'bharatgaming2026@gmail.com') {
      finalRole = 'admin';
    }

    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    const newUser = existing ? { ...existing, role: finalRole } : { 
      id: `${finalRole}-${Date.now()}`, 
      ...userData, 
      role: finalRole,
      joinedAt: new Date().toISOString(), 
      walletBalance: 0, 
      status: 'active' as any, 
      wishlist: [] 
    } as User;

    // Persist User to Supabase
    try {
      const { error } = await supabase.from('users').upsert([newUser]);
      if (error) console.error("Supabase user sync failed:", error);
    } catch (err) {
      console.error("Critical user sync error:", err);
    }
    
    setUser(newUser);
    if (userData.isNewUser && finalRole === 'buyer') {
      setOfferExpiry(Date.now() + 10 * 60 * 1000);
    }
    
    setShowAuth(false);
    
    // Check for pending action from guest
    if (pendingAction) {
      if (pendingAction.action === 'buy') {
        setSelectedAccount(pendingAction.account);
        setView('checkout');
      } else {
        setDetailAccount(pendingAction.account);
      }
      setPendingAction(null);
    } else {
      if (newUser.role === 'admin') {
        setView('admin-dashboard');
      } else if (newUser.role === 'seller') {
        setView('dashboard');
      } else {
        setView('market');
      }
    }
  };

  const handleUpdateAccount = async (id: string, data: Partial<Account>) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    try {
      const { error } = await supabase.from('accounts').update(data).eq('id', id);
      if (error) console.error("Supabase account update failed:", error);
    } catch (err) {
      console.error("Supabase error:", err);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
    try {
      const { error } = await supabase.from('accounts').delete().eq('id', id);
      if (error) console.error("Supabase account delete failed:", error);
    } catch (err) {
      console.error("Supabase error:", err);
    }
  };

  const handleUpdateOrder = async (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
      if (error) console.error("Supabase order update failed:", error);
    } catch (err) {
      console.error("Supabase error:", err);
    }
  };

  const handleUpdatePayout = async (payoutId: string, status: PayoutStatus) => {
    setPayouts(prev => prev.map(p => p.id === payoutId ? { ...p, status } : p));
    try {
      const { error } = await supabase.from('payouts').update({ status }).eq('id', payoutId);
      if (error) console.error("Supabase payout update failed:", error);
    } catch (err) {
      console.error("Supabase error:", err);
    }
  };
  
  const handleOrderReviewSubmit = (orderId: string, reviewData: Partial<Review>) => {
    if (!user) return;
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      userName: user.name,
      rating: reviewData.rating || 5,
      comment: reviewData.comment || '',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      isVerified: true,
      idLevel: reviewData.idLevel
    };
    setReviews([newReview, ...reviews]);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, reviewGiven: true } : o));
  };

  const marketAccounts = useMemo(() => accounts.filter(a => !a.isSold && a.isApproved), [accounts]);
  
  const totalPages = Math.ceil(marketAccounts.length / ITEMS_PER_PAGE);
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return marketAccounts.slice(start, start + ITEMS_PER_PAGE);
  }, [marketAccounts, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    document.getElementById('market-listings')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddAccountListing = async (a: Partial<Account>) => {
    const newAcc = { ...a, sellerId: user?.id || 'guest-node' } as Account;
    setAccounts([newAcc, ...accounts]);
    try {
      const { error } = await supabase.from('accounts').insert([newAcc]);
      if (error) console.error("Supabase account listing sync failed:", error);
    } catch (err) {
      console.error("Critical account listing sync error:", err);
    }
  };

  return (
    <div className={`min-h-screen h-auto flex flex-col custom-scrollbar overflow-x-hidden overflow-y-visible relative ${adminSettings.maintenanceMode && user?.role !== 'admin' ? 'grayscale' : ''}`}>
      
      {offerExpiry && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[70] w-[90%] max-w-sm animate-in slide-in-from-bottom-10 duration-700">
           <div className="bg-gradient-to-r from-rose-600 to-rose-700 p-4 rounded-[1.5rem] shadow-[0_0_40px_rgba(225,29,72,0.4)] border border-rose-400/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                 <div className="bg-white/20 p-2 rounded-xl">
                    <Gift className="text-white animate-bounce" size={20} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-white uppercase italic leading-none">Welcome Bonus: 20% OFF!</p>
                    <p className="text-[8px] font-bold text-white/70 uppercase tracking-widest mt-1">First ID Purchase Discount</p>
                 </div>
              </div>
              <div className="bg-slate-950/40 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                 <Timer size={14} className="text-white animate-pulse" />
                 <span className="text-sm font-black text-white font-mono">{Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2, '0')}</span>
              </div>
           </div>
        </div>
      )}

      {adminSettings.broadcastMessage && view !== 'admin-dashboard' && (
        <div className="bg-blue-600 text-white py-2 overflow-hidden relative z-[60] border-b border-blue-500/30">
           <div className="animate-broadcast-float flex items-center gap-12">
              <div className="flex items-center gap-3">
                <Radio size={14} className="animate-pulse shrink-0" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">{adminSettings.broadcastMessage}</p>
              </div>
              <div className="flex items-center gap-3">
                <Radio size={14} className="animate-pulse shrink-0" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">{adminSettings.broadcastMessage}</p>
              </div>
           </div>
        </div>
      )}

      {view !== 'checkout' && view !== 'admin-dashboard' && (
        <Header 
          user={user} 
          onLogout={() => { setUser(null); setView('market'); setOfferExpiry(null); }} 
          onViewChange={(v) => {
            setPendingAction(null);
            setView(v as any);
          }} 
          onAddClick={() => setShowAddModal(true)} 
          onAuthClick={() => {
            setPendingAction(null);
            setAuthInitialMode('login');
            setShowAuth(true);
          }} 
          onAdminTrigger={() => {
            setAuthInitialMode('admin-login');
            setShowAuth(true);
          }}
        />
      )}
      
      <div className="flex-grow h-auto">
        {view === 'checkout' && selectedAccount ? (
          <UPICheckout 
            account={selectedAccount} 
            isDiscountActive={!!offerExpiry}
            onClose={() => { setSelectedAccount(null); setView('market'); }} 
            onOrderSubmit={async ({ transactionId, screenshot }) => {
              if (!user) return;
              const newOrder: Order = {
                id: `ord-${Date.now()}`,
                accountId: selectedAccount.id,
                buyerId: user.id,
                sellerId: selectedAccount.sellerId,
                amount: offerExpiry ? selectedAccount.price * 0.8 : selectedAccount.price,
                transactionId,
                screenshotUrl: screenshot,
                status: OrderStatus.PAID,
                createdAt: new Date().toLocaleDateString('en-IN')
              };
              
              try {
                const { error } = await supabase.from('orders').insert([newOrder]);
                if (error) console.error("Supabase payment sync failed:", error);
              } catch (err) {
                console.error("Critical database error:", err);
              }

              setOrders(prev => [newOrder, ...prev]);
              setOfferExpiry(null);
              setSelectedAccount(null);
              setView('market');
            }} 
          />
        ) : (user?.role === 'admin' && view === 'admin-dashboard') ? (
          <AdminDashboard 
            users={users}
            accounts={accounts}
            orders={orders}
            payouts={payouts}
            disputes={disputes}
            logs={logs}
            settings={adminSettings}
            settingsHistory={settingsHistory}
            onUpdateUser={() => {}}
            onUpdateAccount={handleUpdateAccount}
            onUpdateOrder={handleUpdateOrder}
            onUpdatePayout={handleUpdatePayout}
            onDeleteAccount={handleDeleteAccount}
            onUpdateSettings={() => {}}
            onSwitchView={(v) => setView(v as any)}
            onAddAdminListing={handleAddAccountListing}
          />
        ) : view === 'dashboard' && user?.role === 'seller' ? (
          <SellerDashboard 
            accounts={accounts.filter(a => a.sellerId === user.id)} 
            orders={orders.filter(o => o.sellerId === user.id)}
            payouts={payouts.filter(p => p.sellerId === user.id)} 
            onAddListing={() => setShowAddModal(true)} 
            onDeleteListing={handleDeleteAccount} 
            onDeliverCredentials={(oid) => handleUpdateOrder(oid, OrderStatus.DELIVERED)} 
            onWithdrawRequest={async (amount, upiId) => {
               const newPayout: Payout = {
                 id: `pay-${Date.now()}`,
                 sellerId: user.id,
                 amount,
                 upiId,
                 status: PayoutStatus.REQUESTED,
                 createdAt: new Date().toLocaleDateString('en-IN')
               };
               setPayouts(prev => [newPayout, ...prev]);
               await supabase.from('payouts').insert([newPayout]);
            }}
          />
        ) : view === 'dashboard' && (user?.role === 'buyer' || user?.role === 'admin') ? (
          <BuyerDashboard 
            orders={orders.filter(o => o.buyerId === user.id)} 
            accounts={accounts} 
            wishlist={user.wishlist || []}
            reviews={reviews} 
            onReviewSubmit={handleOrderReviewSubmit} 
            onViewMarket={() => setView('market')} 
            onBuy={(a) => setDetailAccount(a)}
            onViewSeller={() => {}}
          />
        ) : (view === 'market') ? (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 flex flex-col gap-10 h-auto">
            <div className="relative bg-slate-900/40 neon-border-red rounded-[3.5rem] p-12 lg:py-20 overflow-hidden flex flex-col items-center text-center gap-10">
               <div className="relative z-10 w-full flex flex-col items-center">
                 <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-amber-600/10 border border-amber-600/20 rounded-full text-amber-500 text-[10px] font-black uppercase tracking-widest italic">
                    <ShieldCheck size={14} /> Official Indian Node
                 </div>
                 <div className="inline-block bg-[#0f172a]/60 backdrop-blur-xl border border-slate-800 px-8 lg:px-12 py-8 lg:py-12 rounded-[2.5rem] mb-10 shadow-2xl relative">
                    <h2 className="text-3xl lg:text-5xl font-black font-orbitron text-white italic uppercase tracking-tighter leading-[1.1] text-center">
                       THE <br/> 
                       ULTIMATE <br/>
                       <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600">ACCOUNT HUB</span>
                    </h2>
                 </div>
                 <p className="text-slate-500 text-sm font-bold uppercase tracking-widest max-w-lg mx-auto leading-relaxed">
                   100% Safe Admin-Escrow. Buy premium Accounts or cash out your Free Fire legacy today.
                 </p>
                 <div className="flex flex-col sm:flex-row gap-4 mt-12 justify-center items-stretch sm:items-center w-full">
                    <button 
                      onClick={() => document.getElementById('market-listings')?.scrollIntoView({ behavior: 'smooth' })} 
                      className="px-12 py-5 bg-gradient-to-r from-rose-600 to-rose-700 backdrop-blur-md border border-rose-400/30 text-white font-black rounded-3xl text-[16px] uppercase tracking-[0.3em] transition-all italic flex items-center justify-center gap-3 w-full sm:w-72"
                    >
                       <Gamepad2 size={18} className="text-white" /> BROWSE FF IDs
                    </button>
                 </div>
               </div>
            </div>

            <TrustSection />
            
            <div id="market-listings" className="space-y-12 pt-10">
               <div className="flex items-center justify-between border-b border-slate-900 pb-6">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-blue-600/10 rounded-lg border border-blue-600/20">
                        <LayoutGrid className="text-blue-500" size={20} />
                     </div>
                     <h3 className="text-xl font-black font-orbitron text-white italic uppercase tracking-tighter">COMBAT <span className="text-blue-500">ARSENAL</span></h3>
                  </div>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 min-h-[600px]">
                  {currentItems.map(acc => (
                    <AccountCard 
                      key={acc.id} 
                      account={acc} 
                      onBuy={(a) => {
                        if (!user) {
                          setPendingAction({ account: a, action: 'buy' });
                          setAuthInitialMode('signup');
                          setShowAuth(true);
                        } else {
                          setSelectedAccount(a);
                          setView('checkout');
                        }
                      }} 
                      onViewDetails={(a) => {
                        if (!user) {
                          setPendingAction({ account: a, action: 'view' });
                          setAuthInitialMode('signup');
                          setShowAuth(true);
                        } else {
                          setDetailAccount(a);
                        }
                      }} 
                      onViewSeller={() => {}}
                    />
                  ))}
               </div>
               {totalPages > 1 && (
                 <div className="flex items-center justify-center gap-3 py-10 mt-6 border-t border-slate-900">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-white disabled:opacity-30 transition-all"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-white disabled:opacity-30 transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                 </div>
               )}
            </div>

            <ReviewSlider reviews={reviews} />

            <InformationBlocks />
            <AboutSection />
          </div>
        ) : null}
      </div>

      <footer className="bg-slate-950 border-t border-slate-900 py-16 text-center h-auto mt-auto footer">
          <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-red-600 p-2 rounded-xl">
                 <Flame className="text-white" size={24} fill="white" />
              </div>
              <span className="font-black font-orbitron text-xl text-white italic uppercase tracking-tighter text-center">BHARAT GAMING</span>
          </div>
          <p className="text-slate-700 text-[9px] font-black uppercase tracking-widest px-4">© 2024–2026 INDIA'S ELITE GAMING NODE. ALL RIGHTS RESERVED.</p>
      </footer>

      {/* FLOATING SUPPORT TRIGGER */}
      <div className="fixed bottom-24 right-6 z-[60] flex flex-col items-end gap-3 pointer-events-none">
         <a 
           href="https://t.me/grow100k" 
           target="_blank" 
           rel="noopener noreferrer"
           className="pointer-events-auto w-14 h-14 bg-sky-500 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:scale-110 transition-all group"
         >
           <Send size={24} className="group-hover:-rotate-12 transition-transform ml-[-2px]" fill="white" />
         </a>
         <button 
            onClick={() => {
              const el = document.querySelector('.support-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="pointer-events-auto w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-110 transition-all group"
         >
            <Headset size={28} className="group-hover:-rotate-12 transition-transform" />
         </button>
      </div>

      <ReviewSystem 
          reviews={reviews} 
          currentUser={user} 
          onDeleteReview={(id) => setReviews(prev => prev.filter(r => r.id !== id))} 
          onAddReview={(rev) => setReviews(prev => [rev as Review, ...prev])} 
      />

      {detailAccount && (
        <AccountDetailsModal 
          account={detailAccount} 
          role={user?.role || 'buyer'} 
          isWishlisted={false} 
          allAccounts={marketAccounts}
          onClose={() => setDetailAccount(null)} 
          onBuy={() => {
            setSelectedAccount(detailAccount);
            setDetailAccount(null);
            setView('checkout');
          }} 
          onSelectAccount={(a) => setDetailAccount(a)}
          onToggleWishlist={() => {}} 
          onMarkSold={() => handleUpdateAccount(detailAccount.id, { isSold: true })} 
          onDelete={() => handleDeleteAccount(detailAccount.id)} 
        />
      )}

      {showAuth && (
        <AuthPage 
          key={authInitialMode}
          initialMode={authInitialMode}
          onClose={() => { setShowAuth(false); setPendingAction(null); }} 
          onSuccess={handleAuthSuccess} 
        />
      )}
      {showAddModal && (
        <AddAccountModal 
          onClose={() => setShowAddModal(false)} 
          onAdd={handleAddAccountListing} 
        />
      )}
    </div>
  );
}