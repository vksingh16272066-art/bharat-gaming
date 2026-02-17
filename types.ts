export enum Rank {
  BRONZE = 'Bronze',
  SILVER = 'Silver',
  GOLD = 'Gold',
  PLATINUM = 'Platinum',
  DIAMOND = 'Diamond',
  HEROIC = 'Heroic',
  MASTER = 'Master',
  GRANDMASTER = 'Grandmaster'
}

export type UserRole = 'buyer' | 'seller' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'verified';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  joinedAt: string;
  walletBalance: number;
  status: UserStatus;
  isVerified?: boolean;
  wishlist?: string[]; 
  lastLoginIp?: string;
  fraudScore?: number;
}

export interface AccountStats {
  level: number;
  badges: number;
  kda: number;
  headshotRate: string;
  booyahCount?: number;
}

export interface Account {
  id: string;
  sellerId: string;
  title: string;
  price: number;
  rank: Rank;
  level: number;
  diamonds: number;
  emotesCount: number;
  gunSkinsCount: number;
  rareSkins: string[]; 
  characters: number;
  characterList?: string[];
  evolutionGuns: number; // Count
  evoGunDetails?: string; // Text description of guns/levels
  rankSeason?: string; // e.g. "Season 38"
  imageUrl: string;
  screenshots?: string[];
  isVerified: boolean;
  isApproved: boolean; 
  rejectionReason?: string;
  sellerRating: number;
  stats: AccountStats;
  uid: string;
  bundles: string[];
  elitePass: boolean;
  description: string;
  isSold: boolean;
  isLocked?: boolean; 
  lockedUntil?: number; // Timestamp for auto-unlock
  server: string;
  views: number;
  fraudFlag?: boolean;
  loginType: 'Facebook' | 'Google' | 'VK' | 'Twitter';
  admin_listing?: boolean;
  createdAt?: number;
}

export enum OrderStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  APPROVED = 'Approved',
  DELIVERED = 'Delivered',
  REJECTED = 'Rejected',
  REFUNDED = 'Refunded',
  HELD = 'Held'
}

export interface Order {
  id: string;
  accountId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  transactionId: string;
  screenshotUrl?: string;
  status: OrderStatus;
  createdAt: string;
  credentialsDelivered?: boolean;
  loginId?: string;
  loginPass?: string;
  reviewGiven?: boolean;
  escrowReleased?: boolean;
}

export enum PayoutStatus {
  REQUESTED = 'Requested',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export interface Payout {
  id: string;
  sellerId: string;
  amount: number;
  upiId: string;
  status: PayoutStatus;
  createdAt: string;
}

export interface DisputeMessage {
  senderId: string;
  message: string;
  timestamp: string;
  role: UserRole;
}

export interface Dispute {
  id: string;
  orderId: string;
  initiatorId: string;
  reason: string;
  status: 'open' | 'resolved' | 'refunded';
  createdAt: string;
  chat: DisputeMessage[];
}

export interface SecurityLog {
  id: string;
  userId: string;
  action: string;
  ip: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

export interface AdminSettings {
  upiId: string;
  qrUrl: string;
  bankDetails: string;
  commissionRate: number;
  lastUpdated: string;
  maintenanceMode: boolean;
  broadcastMessage: string;
}

export interface SettingsHistory {
  id: string;
  changedBy: string;
  field: string;
  oldValue: string;
  newValue: string;
  timestamp: string;
}

export interface FilterState {
  search: string;
  minPrice: number;
  maxPrice: number;
  minLevel: number;
  rank: Rank | 'All';
  verifiedOnly: boolean;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  isVerified: boolean;
  idLevel?: number; 
}