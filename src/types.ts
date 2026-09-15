export type ThemeMode = 'dark' | 'light';

export type AuthMethod = 'credentials' | 'qr' | 'nfc' | 'recovery';

export interface SocialPlatform {
  id: string;
  name: string;
  iconKey: 'whatsapp' | 'instagram' | 'linkedin' | 'github' | 'twitter' | 'telegram' | 'discord' | 'mail' | 'globe' | 'youtube' | 'tiktok';
  url: string;
  username: string;
  badge?: string;
  color: string; // tailwind or hex color
  active: boolean;
  order: number;
  description?: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'Full-Stack' | 'AI & Cloud' | 'Mobile & IoT' | 'Hardware/NFC' | 'Creative Tech';
  tags: string[];
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  metrics?: string;
  year: string;
  architectureHighlights?: string[];
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Frontend & Architecture' | 'Backend & Cloud Systems' | 'Mobile & Hardware NFC' | 'AI & Creative Tech';
  level: number; // 0 to 100
  iconName: string;
  yearsExp: string;
  highlight: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  level: string;
  location: string;
  period: string;
  description: string;
  skillsFocus: string[];
  iconType: 'preschool' | 'kindergarten' | 'elementary' | 'junior' | 'vocational' | 'internship';
  badge?: string;
  credentialUrl?: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  badge?: string;
  type: 'info' | 'release' | 'urgent' | 'collaboration';
  active: boolean;
  createdAt: string;
  linkUrl?: string;
  linkText?: string;
  dismissible: boolean;
}

export interface NfcCardRecord {
  id: string;
  uid: string;
  label: string;
  linkedAt: string;
  secretPayload: string;
  status: 'active' | 'revoked';
  deviceModel?: string;
}

export interface MessageInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
  status: 'new' | 'replied' | 'archived';
}

export interface AnalyticsData {
  pageViews: number;
  projectClicks: number;
  contactClicks: number;
  nfcTaps: number;
  devLogins: number;
  uptimeHours: number;
  lastActive: string;
}

export interface DeveloperSession {
  isAuthenticated: boolean;
  method: AuthMethod | null;
  developerName: string;
  token: string | null;
  loginTimestamp: string | null;
}
