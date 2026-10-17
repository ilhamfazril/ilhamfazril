'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ThemeMode, 
  DeveloperSession, 
  SocialPlatform, 
  Project, 
  SkillItem, 
  NfcCardRecord, 
  MessageInquiry, 
  AnalyticsData, 
  AuthMethod,
  EducationItem,
  AnnouncementItem,
  ProfileConfig,
  IntroConfig
} from '../types';
import { 
  INITIAL_SOCIALS, 
  INITIAL_PROJECTS, 
  INITIAL_SKILLS, 
  INITIAL_NFC_CARDS, 
  INITIAL_ANALYTICS,
  INITIAL_EDUCATION,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_PROFILE
} from '../data/initialData';
import { sound } from '../utils/soundEffects';
import { DEV_SECRET_NFC_PAYLOAD, DEV_SECRET_QR_PAYLOAD } from '../utils/nfcAndQr';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

interface PortfolioContextType {
  // Firebase Realtime
  isFirebaseConnected: boolean;

  // Theme
  theme: ThemeMode;
  toggleTheme: () => void;

  // View Mode & Intros
  viewMode: 'public' | 'admin';
  setViewMode: (mode: 'public' | 'admin') => void;
  introConfig: IntroConfig;
  updateIntroConfig: (config: Partial<IntroConfig>) => Promise<void>;
  showWebsiteIntro: boolean;
  setShowWebsiteIntro: (show: boolean) => void;
  showNfcLoginIntro: boolean;
  setShowNfcLoginIntro: (show: boolean) => void;
  nfcIntroDetails: { uid: string; timestamp: string };
  setNfcIntroDetails: (details: { uid: string; timestamp: string }) => void;

  // Modals & Auth Dialogs
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalTab: 'credentials' | 'qr' | 'nfc';
  setAuthModalTab: (tab: 'credentials' | 'qr' | 'nfc') => void;
  showAuthSuccessModal: boolean;
  setShowAuthSuccessModal: (show: boolean) => void;
  authSuccessDetails: { method: 'credentials' | 'qr'; title: string; message: string };
  showLogoutConfirmModal: boolean;
  setShowLogoutConfirmModal: (show: boolean) => void;
  requestLogout: () => void;
  confirmLogout: () => void;

  // Legacy/Compatibility NFC Modal state
  showNfcSuccessModal: boolean;
  setShowNfcSuccessModal: (show: boolean) => void;
  nfcSuccessDetails: { uid: string; timestamp: string };
  setNfcSuccessDetails: (details: { uid: string; timestamp: string }) => void;

  // Sound
  soundEnabled: boolean;
  toggleSound: () => void;

  // Auth
  auth: DeveloperSession;
  loginWithCredentials: (username: string, pass: string) => { success: boolean; message: string };
  loginWithQr: (token: string) => { success: boolean; message: string };
  loginWithNfc: (uid: string, payload?: string) => { success: boolean; message: string };
  logout: () => void;

  // Socials Management
  socials: SocialPlatform[];
  addSocial: (social: Omit<SocialPlatform, 'id' | 'order'>) => void;
  updateSocial: (id: string, updated: Partial<SocialPlatform>) => void;
  deleteSocial: (id: string) => void;
  toggleSocialActive: (id: string) => void;
  resetSocials: () => void;

  // Projects Management
  projects: Project[];
  addProject: (proj: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updated: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  resetProjects: () => void;

  // Education History
  education: EducationItem[];
  addEducation: (edu: Omit<EducationItem, 'id'>) => void;
  updateEducation: (id: string, updated: Partial<EducationItem>) => void;
  deleteEducation: (id: string) => void;
  resetEducation: () => void;

  // Announcements & Floating Broadcast
  announcements: AnnouncementItem[];
  addAnnouncement: (ann: Omit<AnnouncementItem, 'id' | 'createdAt'>) => void;
  updateAnnouncement: (id: string, updated: Partial<AnnouncementItem>) => void;
  deleteAnnouncement: (id: string) => void;
  toggleAnnouncementActive: (id: string) => void;
  dismissedAnnouncementIds: string[];
  dismissAnnouncement: (id: string) => void;
  resetDismissedAnnouncements: () => void;

  // Skills
  skills: SkillItem[];

  // NFC Cards
  nfcCards: NfcCardRecord[];
  registerNfcCard: (card: Omit<NfcCardRecord, 'id' | 'linkedAt' | 'status'>) => NfcCardRecord;
  deleteNfcCard: (id: string) => void;

  // Inquiries / Contact Messages
  inquiries: MessageInquiry[];
  addInquiry: (inquiry: Omit<MessageInquiry, 'id' | 'timestamp' | 'read' | 'status'>) => void;
  markInquiryRead: (id: string) => void;
  deleteInquiry: (id: string) => void;

  // Analytics
  analytics: AnalyticsData;
  trackProjectClick: (id: string) => void;
  trackContactClick: (platformName: string) => void;
  trackNfcTap: () => void;

  // Profile Settings
  profile: ProfileConfig;
  updateProfile: (updated: Partial<ProfileConfig>) => void;
  resetProfile: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  THEME: 'ilham_portfolio_theme',
  AUTH: 'ilham_portfolio_auth',
  SOCIALS: 'ilham_portfolio_socials',
  PROJECTS: 'ilham_portfolio_projects',
  EDUCATION: 'ilham_portfolio_education',
  ANNOUNCEMENTS: 'ilham_portfolio_announcements',
  NFC_CARDS: 'ilham_portfolio_nfc_cards',
  INQUIRIES: 'ilham_portfolio_inquiries',
  ANALYTICS: 'ilham_portfolio_analytics',
  SOUND: 'ilham_portfolio_sound',
  PROFILE: 'ilham_portfolio_profile',
};

const getStoredItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const getStoredSessionItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme State
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = getStoredItem(LOCAL_STORAGE_KEYS.THEME);
    return (saved as ThemeMode) || 'dark';
  });

  // Sound State
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = getStoredItem(LOCAL_STORAGE_KEYS.SOUND);
    return saved !== null ? saved === 'true' : true;
  });

  // Default Intro Configuration
  const DEFAULT_INTRO_CONFIG: IntroConfig = {
    enabled: true,
    frequency: 'every_refresh',
    videoUrl: '/intro.mp4',
    updatedAt: new Date().toISOString(),
  };

  // Intro Configuration State (syncs realtime with Firestore)
  const [introConfig, setIntroConfig] = useState<IntroConfig>(() => {
    const saved = getStoredItem('ilham_intro_config');
    if (saved) {
      try {
        return { ...DEFAULT_INTRO_CONFIG, ...JSON.parse(saved) };
      } catch {}
    }
    return DEFAULT_INTRO_CONFIG;
  });

  // Website Intro State (Modern Entrance)
  const [showWebsiteIntro, setShowWebsiteIntro] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const savedConfig = localStorage.getItem('ilham_intro_config');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig) as IntroConfig;
        if (parsed.enabled === false) return false;
        if (parsed.frequency === 'once_per_session') {
          const viewed = sessionStorage.getItem('ilham_intro_viewed');
          if (viewed) return false;
        }
      }
    } catch {}
    return true;
  });

  // NFC Login Intro State (Specialized 13.56 MHz Card Login Intro)
  const [showNfcLoginIntro, setShowNfcLoginIntro] = useState<boolean>(false);
  const [nfcIntroDetails, setNfcIntroDetails] = useState<{ uid: string; timestamp: string }>({
    uid: '04:A2:8B:C1:29:4F:80',
    timestamp: '10:00:00',
  });

  // View & Modal State
  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'credentials' | 'qr' | 'nfc'>('credentials');
  
  // Auth Success Modal (Modern pop-up when logging in via credentials or QR)
  const [showAuthSuccessModal, setShowAuthSuccessModal] = useState<boolean>(false);
  const [authSuccessDetails, setAuthSuccessDetails] = useState<{ method: 'credentials' | 'qr'; title: string; message: string }>({
    method: 'credentials',
    title: 'Login Developer Berhasil!',
    message: 'Selamat datang, Developer Ilham Fazril.',
  });

  // Logout Confirm Modal
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState<boolean>(false);

  // Floating Dismissed Announcements (sessionStorage)
  const [dismissedAnnouncementIds, setDismissedAnnouncementIds] = useState<string[]>(() => {
    try {
      const saved = getStoredSessionItem('ilham_dismissed_announcements');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Legacy/Compatibility NFC Modal state
  const [showNfcSuccessModal, setShowNfcSuccessModal] = useState<boolean>(false);
  const [nfcSuccessDetails, setNfcSuccessDetails] = useState<{ uid: string; timestamp: string }>({
    uid: '04:A2:8B:C1:29:4F:80',
    timestamp: '10:00:00',
  });

  // Auth State
  const [auth, setAuth] = useState<DeveloperSession>(() => {
    const saved = getStoredItem(LOCAL_STORAGE_KEYS.AUTH);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {
      isAuthenticated: false,
      method: null,
      developerName: 'Ilham Fazril',
      token: null,
      loginTimestamp: null,
    };
  });

  // Socials State
  const [socials, setSocials] = useState<SocialPlatform[]>(() => {
    const saved = getStoredItem(LOCAL_STORAGE_KEYS.SOCIALS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_SOCIALS;
  });

  // Projects State
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = getStoredItem(LOCAL_STORAGE_KEYS.PROJECTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_PROJECTS;
  });

  // Education State
  const [education, setEducation] = useState<EducationItem[]>(() => {
    const saved = getStoredItem(LOCAL_STORAGE_KEYS.EDUCATION);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If already saved, ensure it is chronologically ordered starting from edu-1 (PAUD) to edu-6 (PKL)
          return parsed.sort((a, b) => {
            const numA = parseInt(a.id.replace('edu-', ''), 10) || 0;
            const numB = parseInt(b.id.replace('edu-', ''), 10) || 0;
            return numA - numB;
          });
        }
      } catch {}
    }
    return INITIAL_EDUCATION;
  });

  // Announcements State
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() => {
    const saved = getStoredItem(LOCAL_STORAGE_KEYS.ANNOUNCEMENTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  // Skills State
  const [skills] = useState<SkillItem[]>(INITIAL_SKILLS);

  // NFC Cards State
  const [nfcCards, setNfcCards] = useState<NfcCardRecord[]>(() => {
    const saved = getStoredItem(LOCAL_STORAGE_KEYS.NFC_CARDS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_NFC_CARDS;
  });

  // Inquiries State
  const [inquiries, setInquiries] = useState<MessageInquiry[]>(() => {
    const saved = getStoredItem(LOCAL_STORAGE_KEYS.INQUIRIES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 'inq-sample-1',
        name: 'Alexander Sterling',
        email: 'alex@sterling-ventures.io',
        subject: 'Partnership: Arsitektur Sistem NFC & Web Platform',
        message: 'Halo Ilham, kami melihat portofolio Anda dan sangat terkesan dengan integrasi hardware NFC dan Web UI yang Anda bangun. Mari jadwalkan call eksklusif.',
        timestamp: '2026-08-19 18:30 WIB',
        read: false,
        status: 'new',
      },
    ];
  });

  // Analytics State
  const [analytics, setAnalytics] = useState<AnalyticsData>(() => {
    const saved = getStoredItem(LOCAL_STORAGE_KEYS.ANALYTICS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_ANALYTICS;
  });

  // Profile Configuration State
  const [profile, setProfile] = useState<ProfileConfig>(() => {
    const saved = getStoredItem(LOCAL_STORAGE_KEYS.PROFILE);
    if (saved) {
      try {
        return { ...INITIAL_PROFILE, ...JSON.parse(saved) };
      } catch {}
    }
    return INITIAL_PROFILE;
  });

  // Firebase Realtime Connection State
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);

  // Helper to remove any undefined values before writing to Firestore
  const cleanPayload = <T extends Record<string, any>>(obj: T): Record<string, any> => {
    const result: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      if (val !== undefined) {
        result[key] = val;
      }
    }
    return result;
  };

  // Real-Time Firebase Firestore Synchronization
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isMounted = true;

    // 1. Profile real-time listener
    const unsubProfile = onSnapshot(
      doc(db, 'profile', 'main'),
      (snap) => {
        if (!isMounted) return;
        setIsFirebaseConnected(true);
        if (snap.exists()) {
          const data = snap.data() as ProfileConfig;
          setProfile(prev => ({ ...prev, ...data }));
        } else {
          setDoc(doc(db, 'profile', 'main'), cleanPayload(INITIAL_PROFILE)).catch(() => {});
        }
      },
      (err) => {
        console.warn('Firestore profile sync fallback:', err);
      }
    );

    // 2. Projects real-time listener
    const unsubProjects = onSnapshot(
      collection(db, 'projects'),
      (snapshot) => {
        if (!isMounted) return;
        setIsFirebaseConnected(true);
        if (!snapshot.empty) {
          const remoteProjects: Project[] = [];
          snapshot.forEach((d) => {
            remoteProjects.push({ id: d.id, ...(d.data() as Omit<Project, 'id'>) });
          });
          setProjects(remoteProjects);
        } else {
          INITIAL_PROJECTS.forEach((p) => {
            setDoc(doc(db, 'projects', p.id), cleanPayload(p)).catch(() => {});
          });
        }
      },
      (err) => {
        console.warn('Firestore projects sync fallback:', err);
      }
    );

    // 3. Education real-time listener
    const unsubEducation = onSnapshot(
      collection(db, 'education'),
      (snapshot) => {
        if (!isMounted) return;
        setIsFirebaseConnected(true);
        if (!snapshot.empty) {
          const remoteEdu: EducationItem[] = [];
          snapshot.forEach((d) => {
            remoteEdu.push({ id: d.id, ...(d.data() as Omit<EducationItem, 'id'>) });
          });
          remoteEdu.sort((a, b) => {
            const numA = parseInt(a.id.replace('edu-', ''), 10) || 0;
            const numB = parseInt(b.id.replace('edu-', ''), 10) || 0;
            return numA - numB;
          });
          setEducation(remoteEdu);
        } else {
          INITIAL_EDUCATION.forEach((e) => {
            setDoc(doc(db, 'education', e.id), cleanPayload(e)).catch(() => {});
          });
        }
      },
      (err) => {
        console.warn('Firestore education sync fallback:', err);
      }
    );

    // 4. Announcements real-time listener
    const unsubBroadcasts = onSnapshot(
      collection(db, 'broadcasts'),
      (snapshot) => {
        if (!isMounted) return;
        setIsFirebaseConnected(true);
        if (!snapshot.empty) {
          const remoteAnn: AnnouncementItem[] = [];
          snapshot.forEach((d) => {
            remoteAnn.push({ id: d.id, ...(d.data() as Omit<AnnouncementItem, 'id'>) });
          });
          setAnnouncements(remoteAnn);
        }
      },
      (err) => {
        console.warn('Firestore broadcasts sync fallback:', err);
      }
    );

    // 5. Inquiries real-time listener
    const unsubInquiries = onSnapshot(
      collection(db, 'inquiries'),
      (snapshot) => {
        if (!isMounted) return;
        setIsFirebaseConnected(true);
        if (!snapshot.empty) {
          const remoteInq: MessageInquiry[] = [];
          snapshot.forEach((d) => {
            remoteInq.push({ id: d.id, ...(d.data() as Omit<MessageInquiry, 'id'>) });
          });
          setInquiries(remoteInq);
        }
      },
      (err) => {
        console.warn('Firestore inquiries sync fallback:', err);
      }
    );

    // 6. Socials / Kontak real-time listener
    const unsubSocials = onSnapshot(
      collection(db, 'socials'),
      (snapshot) => {
        if (!isMounted) return;
        setIsFirebaseConnected(true);
        if (!snapshot.empty) {
          const remoteSocials: SocialPlatform[] = [];
          snapshot.forEach((d) => {
            remoteSocials.push({ id: d.id, ...(d.data() as Omit<SocialPlatform, 'id'>) });
          });
          remoteSocials.sort((a, b) => (a.order || 0) - (b.order || 0));
          setSocials(remoteSocials);
        } else {
          // Auto-seed initial socials if empty
          INITIAL_SOCIALS.forEach((s) => {
            setDoc(doc(db, 'socials', s.id), cleanPayload(s)).catch(() => {});
          });
        }
      },
      (err) => {
        console.warn('Firestore socials sync fallback:', err);
      }
    );

    // 7. NFC Smart Cards real-time listener
    const unsubNfcCards = onSnapshot(
      collection(db, 'nfcCards'),
      (snapshot) => {
        if (!isMounted) return;
        setIsFirebaseConnected(true);
        if (!snapshot.empty) {
          const remoteCards: NfcCardRecord[] = [];
          snapshot.forEach((d) => {
            remoteCards.push({ id: d.id, ...(d.data() as Omit<NfcCardRecord, 'id'>) });
          });
          setNfcCards(remoteCards);
        } else {
          INITIAL_NFC_CARDS.forEach((card) => {
            setDoc(doc(db, 'nfcCards', card.id), cleanPayload(card)).catch(() => {});
          });
        }
      },
      (err) => {
        console.warn('Firestore nfcCards sync fallback:', err);
      }
    );

    // 8. Analytics real-time listener
    const unsubAnalytics = onSnapshot(
      doc(db, 'analytics', 'main'),
      (snap) => {
        if (!isMounted) return;
        setIsFirebaseConnected(true);
        if (snap.exists()) {
          const data = snap.data() as AnalyticsData;
          setAnalytics(prev => ({ ...prev, ...data }));
        } else {
          setDoc(doc(db, 'analytics', 'main'), cleanPayload(INITIAL_ANALYTICS)).catch(() => {});
        }
      },
      (err) => {
        console.warn('Firestore analytics sync fallback:', err);
      }
    );

    // 9. Intro settings real-time listener
    const unsubIntro = onSnapshot(
      doc(db, 'settings', 'introConfig'),
      (snap) => {
        if (!isMounted) return;
        setIsFirebaseConnected(true);
        if (snap.exists()) {
          const data = snap.data() as IntroConfig;
          setIntroConfig(prev => ({ ...prev, ...data }));
          if (data.enabled === false) {
            setShowWebsiteIntro(false);
          }
        } else {
          setDoc(doc(db, 'settings', 'introConfig'), cleanPayload(DEFAULT_INTRO_CONFIG)).catch(() => {});
        }
      },
      (err) => {
        console.warn('Firestore intro settings sync fallback:', err);
      }
    );

    return () => {
      isMounted = false;
      unsubProfile();
      unsubProjects();
      unsubEducation();
      unsubBroadcasts();
      unsubInquiries();
      unsubSocials();
      unsubNfcCards();
      unsubAnalytics();
      unsubIntro();
    };
  }, []);

  // Sync theme to DOM
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Sync Sound
  useEffect(() => {
    sound.enabled = soundEnabled;
    localStorage.setItem(LOCAL_STORAGE_KEYS.SOUND, String(soundEnabled));
  }, [soundEnabled]);

  // Sync persistence
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SOCIALS, JSON.stringify(socials));
  }, [socials]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.EDUCATION, JSON.stringify(education));
  }, [education]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.NFC_CARDS, JSON.stringify(nfcCards));
  }, [nfcCards]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
  }, [analytics]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH, JSON.stringify(auth));
  }, [auth]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  // Zero-Touch NFC Auto-Launch URL Detection (Phone Tap when unlocked opens website and triggers instant login modal)
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const nfcAuth = searchParams.get('nfc_auth') || searchParams.get('nfc');
      const token = searchParams.get('token') || searchParams.get('nfc_token');
      const uid = searchParams.get('uid') || searchParams.get('nfc_uid') || '04:A2:8B:C1:29:4F:80';
      const freq = searchParams.get('freq');

      const isNfcTriggered = 
        Boolean(nfcAuth) || 
        Boolean(token) || 
        Boolean(freq) || 
        window.location.search.includes('nfc') ||
        window.location.search.includes('token');

      if (isNfcTriggered) {
        // Execute instant developer login
        const session: DeveloperSession = {
          isAuthenticated: true,
          method: 'nfc',
          developerName: 'Ilham Fazril',
          token: `NFC_AUTO_TAP_${uid}_${Date.now()}`,
          loginTimestamp: new Date().toLocaleString('id-ID'),
        };
        setAuth(session);
        setViewMode('public');
        setShowAuthModal(false);
        setShowWebsiteIntro(false);
        setNfcIntroDetails({
          uid,
          timestamp: new Date().toLocaleTimeString('id-ID'),
        });
        setShowNfcLoginIntro(true);
        setAnalytics(prev => ({ ...prev, devLogins: prev.devLogins + 1, nfcTaps: prev.nfcTaps + 1 }));

        // Clean up URL parameters cleanly without refreshing
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch {
      // ignore
    }
  }, []);

  // Handlers
  const toggleTheme = () => {
    sound.playClick();
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      sound.enabled = next;
      if (next) sound.playClick();
      return next;
    });
  };

  // Auth: Manual Credentials (Username: "Ilham Fazril", Password: "IlhamFazrilDev99")
  const loginWithCredentials = (username: string, pass: string) => {
    const cleanUser = username.trim().toLowerCase().replace(/\s+/g, '');
    const cleanPass = pass.trim();

    if ((cleanUser === 'ilhamfazril' || cleanUser === 'ilham' || cleanUser === 'admin') && cleanPass === 'IlhamFazrilDev99') {
      const session: DeveloperSession = {
        isAuthenticated: true,
        method: 'credentials',
        developerName: 'Ilham Fazril',
        token: `AUTH_DEV_SESSION_${Date.now()}`,
        loginTimestamp: new Date().toLocaleString('id-ID'),
      };
      setAuth(session);
      setViewMode('public');
      setShowAuthModal(false);
      sound.playSuccess();
      setAnalytics(prev => ({ ...prev, devLogins: prev.devLogins + 1 }));
      setAuthSuccessDetails({
        method: 'credentials',
        title: 'Login Developer Berhasil!',
        message: 'Selamat datang, Developer Ilham Fazril. Akses penuh ke Control Center dan hak istimewa pengelolaan telah aktif.',
      });
      setShowAuthSuccessModal(true);
      return { success: true, message: 'Selamat datang kembali, Ilham Fazril!' };
    }

    sound.playError();
    return { success: false, message: 'Username atau password otentikasi developer salah. Silakan coba lagi.' };
  };

  // Auth: QR Code Login
  const loginWithQr = (token: string) => {
    const trimmed = token.trim();
    if (trimmed.includes(DEV_SECRET_QR_PAYLOAD) || trimmed === DEV_SECRET_QR_PAYLOAD) {
      const session: DeveloperSession = {
        isAuthenticated: true,
        method: 'qr',
        developerName: 'Ilham Fazril',
        token: `QR_VALIDATED_${Date.now()}`,
        loginTimestamp: new Date().toLocaleString('id-ID'),
      };
      setAuth(session);
      setViewMode('public');
      setShowAuthModal(false);
      sound.playSuccess();
      setAnalytics(prev => ({ ...prev, devLogins: prev.devLogins + 1 }));
      setAuthSuccessDetails({
        method: 'qr',
        title: 'Autentikasi QR Code Terverifikasi!',
        message: 'Token kriptografi QR Pass valid. Hak akses penuh Developer Ilham Fazril diberikan.',
      });
      setShowAuthSuccessModal(true);
      return { success: true, message: 'Autentikasi QR Code Terverifikasi! Akses Developer Diberikan.' };
    }

    sound.playError();
    return { success: false, message: 'QR Code tidak valid atau token kadaluarsa!' };
  };

  // Auth: NFC Login
  const loginWithNfc = (uid: string, payload?: string) => {
    const isMatchingPayload = payload && payload.includes(DEV_SECRET_NFC_PAYLOAD);
    const isMatchingCardUid = nfcCards.some(card => card.uid.toLowerCase() === uid.toLowerCase() && card.status === 'active');

    if (isMatchingPayload || isMatchingCardUid || uid.length >= 4) {
      const session: DeveloperSession = {
        isAuthenticated: true,
        method: 'nfc',
        developerName: 'Ilham Fazril',
        token: `NFC_AUTH_${uid}_${Date.now()}`,
        loginTimestamp: new Date().toLocaleString('id-ID'),
      };
      setAuth(session);
      setViewMode('public');
      setShowAuthModal(false);
      setAnalytics(prev => ({ ...prev, devLogins: prev.devLogins + 1, nfcTaps: prev.nfcTaps + 1 }));
      setNfcIntroDetails({
        uid,
        timestamp: new Date().toLocaleTimeString('id-ID'),
      });
      setShowNfcLoginIntro(true);
      return { success: true, message: `Kartu NFC Terdeteksi [UID: ${uid}]! Selamat Datang Developer Ilham Fazril.` };
    }

    sound.playError();
    return { success: false, message: 'Kartu NFC tidak terdaftar atau chip tidak berisi token developer yang valid.' };
  };

  const requestLogout = () => {
    sound.playClick();
    setShowLogoutConfirmModal(true);
  };

  const confirmLogout = () => {
    sound.playClick();
    setAuth({
      isAuthenticated: false,
      method: null,
      developerName: 'Ilham Fazril',
      token: null,
      loginTimestamp: null,
    });
    setShowLogoutConfirmModal(false);
    setViewMode('public');
  };

  const logout = () => {
    requestLogout();
  };

  const dismissAnnouncement = (id: string) => {
    setDismissedAnnouncementIds(prev => {
      const next = [...prev, id];
      try {
        sessionStorage.setItem('ilham_dismissed_announcements', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const resetDismissedAnnouncements = () => {
    setDismissedAnnouncementIds([]);
    try {
      sessionStorage.removeItem('ilham_dismissed_announcements');
    } catch {}
  };

  // Socials Actions
  const addSocial = (data: Omit<SocialPlatform, 'id' | 'order'>) => {
    sound.playSuccess();
    const id = `soc-${Date.now()}`;
    const newSocial: SocialPlatform = {
      ...data,
      id,
      order: socials.length + 1,
    };
    setSocials(prev => [...prev, newSocial]);
    setDoc(doc(db, 'socials', id), cleanPayload(newSocial)).catch((err) => {
      console.warn('Failed to sync added social to Firestore:', err);
    });
  };

  const updateSocial = (id: string, updated: Partial<SocialPlatform>) => {
    sound.playClick();
    setSocials(prev => {
      const next = prev.map(s => (s.id === id ? { ...s, ...updated } : s));
      const target = next.find(s => s.id === id);
      if (target) {
        setDoc(doc(db, 'socials', id), cleanPayload(target)).catch((err) => {
          console.warn('Failed to sync updated social to Firestore:', err);
        });
      }
      return next;
    });
  };

  const deleteSocial = (id: string) => {
    sound.playClick();
    setSocials(prev => prev.filter(s => s.id !== id));
    deleteDoc(doc(db, 'socials', id)).catch((err) => {
      console.warn('Failed to sync deleted social from Firestore:', err);
    });
  };

  const toggleSocialActive = (id: string) => {
    sound.playClick();
    setSocials(prev => {
      const next = prev.map(s => (s.id === id ? { ...s, active: !s.active } : s));
      const target = next.find(s => s.id === id);
      if (target) {
        setDoc(doc(db, 'socials', id), cleanPayload(target)).catch((err) => {
          console.warn('Failed to toggle social status in Firestore:', err);
        });
      }
      return next;
    });
  };

  const resetSocials = () => {
    sound.playClick();
    setSocials(INITIAL_SOCIALS);
    INITIAL_SOCIALS.forEach(s => {
      setDoc(doc(db, 'socials', s.id), cleanPayload(s)).catch(() => {});
    });
  };

  // Projects Actions
  const addProject = (data: Omit<Project, 'id'>) => {
    sound.playSuccess();
    const id = `proj-${Date.now()}`;
    const newProj: Project = {
      ...data,
      id,
    };
    setProjects(prev => [newProj, ...prev]);
    setDoc(doc(db, 'projects', id), cleanPayload(newProj)).catch((err) => {
      console.warn('Failed to sync added project to Firestore:', err);
    });
  };

  const updateProject = (id: string, updated: Partial<Project>) => {
    sound.playClick();
    setProjects(prev => {
      const next = prev.map(p => (p.id === id ? { ...p, ...updated } : p));
      const target = next.find(p => p.id === id);
      if (target) {
        setDoc(doc(db, 'projects', id), cleanPayload(target)).catch((err) => {
          console.warn('Failed to sync updated project to Firestore:', err);
        });
      }
      return next;
    });
  };

  const deleteProject = (id: string) => {
    sound.playClick();
    setProjects(prev => prev.filter(p => p.id !== id));
    deleteDoc(doc(db, 'projects', id)).catch((err) => {
      console.warn('Failed to sync deleted project from Firestore:', err);
    });
  };

  const resetProjects = () => {
    sound.playClick();
    setProjects(INITIAL_PROJECTS);
    INITIAL_PROJECTS.forEach(p => {
      setDoc(doc(db, 'projects', p.id), cleanPayload(p)).catch(() => {});
    });
  };

  // Education Actions
  const addEducation = (data: Omit<EducationItem, 'id'>) => {
    sound.playSuccess();
    const id = `edu-${Date.now()}`;
    const newEdu: EducationItem = {
      ...data,
      id,
    };
    setEducation(prev => [newEdu, ...prev]);
    setDoc(doc(db, 'education', id), cleanPayload(newEdu)).catch((err) => {
      console.warn('Failed to sync added education to Firestore:', err);
    });
  };

  const updateEducation = (id: string, updated: Partial<EducationItem>) => {
    sound.playClick();
    setEducation(prev => {
      const next = prev.map(e => (e.id === id ? { ...e, ...updated } : e));
      const target = next.find(e => e.id === id);
      if (target) {
        setDoc(doc(db, 'education', id), cleanPayload(target)).catch((err) => {
          console.warn('Failed to sync updated education to Firestore:', err);
        });
      }
      return next;
    });
  };

  const deleteEducation = (id: string) => {
    sound.playClick();
    setEducation(prev => prev.filter(e => e.id !== id));
    deleteDoc(doc(db, 'education', id)).catch((err) => {
      console.warn('Failed to sync deleted education from Firestore:', err);
    });
  };

  const resetEducation = () => {
    sound.playClick();
    setEducation(INITIAL_EDUCATION);
    INITIAL_EDUCATION.forEach(e => {
      setDoc(doc(db, 'education', e.id), cleanPayload(e)).catch(() => {});
    });
  };

  // Announcements Actions
  const addAnnouncement = (data: Omit<AnnouncementItem, 'id' | 'createdAt'>) => {
    sound.playSuccess();
    const id = `ann-${Date.now()}`;
    const newAnn: AnnouncementItem = {
      ...data,
      id,
      createdAt: new Date().toLocaleString('id-ID'),
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    setDoc(doc(db, 'broadcasts', id), cleanPayload(newAnn)).catch((err) => {
      console.warn('Failed to sync added announcement to Firestore:', err);
    });
  };

  const updateAnnouncement = (id: string, updated: Partial<AnnouncementItem>) => {
    sound.playClick();
    setAnnouncements(prev => {
      const next = prev.map(a => (a.id === id ? { ...a, ...updated } : a));
      const target = next.find(a => a.id === id);
      if (target) {
        setDoc(doc(db, 'broadcasts', id), cleanPayload(target)).catch((err) => {
          console.warn('Failed to sync updated announcement to Firestore:', err);
        });
      }
      return next;
    });
  };

  const deleteAnnouncement = (id: string) => {
    sound.playClick();
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    deleteDoc(doc(db, 'broadcasts', id)).catch((err) => {
      console.warn('Failed to sync deleted announcement from Firestore:', err);
    });
  };

  const toggleAnnouncementActive = (id: string) => {
    sound.playClick();
    const target = announcements.find(a => a.id === id);
    const nextActive = target ? !target.active : true;
    setAnnouncements(prev => prev.map(a => (a.id === id ? { ...a, active: nextActive } : a)));
    setDoc(doc(db, 'broadcasts', id), { active: nextActive }, { merge: true }).catch(() => {});
  };

  // NFC Card Management
  const registerNfcCard = (cardData: Omit<NfcCardRecord, 'id' | 'linkedAt' | 'status'>): NfcCardRecord => {
    sound.playSuccess();
    const id = `card-${Date.now()}`;
    const newCard: NfcCardRecord = {
      ...cardData,
      id,
      linkedAt: new Date().toLocaleString('id-ID'),
      status: 'active',
    };
    setNfcCards(prev => [newCard, ...prev]);
    setDoc(doc(db, 'nfcCards', id), cleanPayload(newCard)).catch((err) => {
      console.warn('Failed to sync registered NFC card to Firestore:', err);
    });
    return newCard;
  };

  const deleteNfcCard = (id: string) => {
    sound.playClick();
    setNfcCards(prev => prev.filter(c => c.id !== id));
    deleteDoc(doc(db, 'nfcCards', id)).catch((err) => {
      console.warn('Failed to delete NFC card from Firestore:', err);
    });
  };

  // Inquiries Actions
  const addInquiry = (inquiryData: Omit<MessageInquiry, 'id' | 'timestamp' | 'read' | 'status'>) => {
    sound.playSuccess();
    const id = `inq-${Date.now()}`;
    const newInquiry: MessageInquiry = {
      ...inquiryData,
      id,
      timestamp: new Date().toLocaleString('id-ID'),
      read: false,
      status: 'new',
    };
    setInquiries(prev => [newInquiry, ...prev]);
    setAnalytics(prev => {
      const next = { ...prev, contactClicks: prev.contactClicks + 1 };
      setDoc(doc(db, 'analytics', 'main'), cleanPayload(next), { merge: true }).catch(() => {});
      return next;
    });
    setDoc(doc(db, 'inquiries', id), cleanPayload(newInquiry)).catch((err) => {
      console.warn('Failed to sync added inquiry to Firestore:', err);
    });
  };

  const markInquiryRead = (id: string) => {
    setInquiries(prev => prev.map(inq => (inq.id === id ? { ...inq, read: true } : inq)));
    setDoc(doc(db, 'inquiries', id), { read: true }, { merge: true }).catch(() => {});
  };

  const deleteInquiry = (id: string) => {
    sound.playClick();
    setInquiries(prev => prev.filter(inq => inq.id !== id));
    deleteDoc(doc(db, 'inquiries', id)).catch((err) => {
      console.warn('Failed to sync deleted inquiry from Firestore:', err);
    });
  };

  // Trackers
  const trackProjectClick = () => {
    setAnalytics(prev => {
      const next = { ...prev, projectClicks: prev.projectClicks + 1 };
      setDoc(doc(db, 'analytics', 'main'), { projectClicks: next.projectClicks }, { merge: true }).catch(() => {});
      return next;
    });
  };

  const trackContactClick = () => {
    setAnalytics(prev => {
      const next = { ...prev, contactClicks: prev.contactClicks + 1 };
      setDoc(doc(db, 'analytics', 'main'), { contactClicks: next.contactClicks }, { merge: true }).catch(() => {});
      return next;
    });
  };

  const trackNfcTap = () => {
    setAnalytics(prev => {
      const next = { ...prev, nfcTaps: prev.nfcTaps + 1 };
      setDoc(doc(db, 'analytics', 'main'), { nfcTaps: next.nfcTaps }, { merge: true }).catch(() => {});
      return next;
    });
  };

  // Profile Management Actions
  const updateProfile = (updated: Partial<ProfileConfig>) => {
    sound.playSuccess();
    setProfile(prev => {
      const next: ProfileConfig = { ...prev, ...updated };
      setDoc(doc(db, 'profile', 'main'), cleanPayload(next)).catch((err) => {
        console.warn('Failed to sync profile update to Firestore:', err);
      });
      return next;
    });

    // If WhatsApp or phone was updated, also synchronize the WhatsApp social card
    if (updated.whatsapp || updated.phone) {
      const waSocial = socials.find(s => s.iconKey === 'whatsapp');
      if (waSocial) {
        updateSocial(waSocial.id, {
          url: updated.whatsapp || waSocial.url,
          username: updated.phone || waSocial.username,
        });
      }
    }

    // If Email was updated, also synchronize the Email social card
    if (updated.email) {
      const mailSocial = socials.find(s => s.iconKey === 'mail');
      if (mailSocial) {
        updateSocial(mailSocial.id, {
          url: `mailto:${updated.email}?subject=Project%20Inquiry%20-%20Ilham%20Fazril`,
          username: updated.email,
        });
      }
    }
  };

  const resetProfile = () => {
    sound.playClick();
    setProfile(INITIAL_PROFILE);
    setDoc(doc(db, 'profile', 'main'), cleanPayload(INITIAL_PROFILE)).catch(() => {});
  };

  // Intro Config Update Action
  const updateIntroConfig = async (newConfig: Partial<IntroConfig>) => {
    const updated: IntroConfig = {
      ...introConfig,
      ...newConfig,
      updatedAt: new Date().toISOString(),
    };
    setIntroConfig(updated);
    try {
      localStorage.setItem('ilham_intro_config', JSON.stringify(updated));
      await setDoc(doc(db, 'settings', 'introConfig'), cleanPayload(updated));
      await setDoc(doc(db, 'profile', 'introConfig'), cleanPayload(updated)).catch(() => {});
      sound.playSuccess();
    } catch (err) {
      console.error('Failed to sync intro config to Firestore:', err);
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        isFirebaseConnected,
        theme,
        toggleTheme,
        viewMode,
        setViewMode,
        introConfig,
        updateIntroConfig,
        showWebsiteIntro,
        setShowWebsiteIntro,
        showNfcLoginIntro,
        setShowNfcLoginIntro,
        nfcIntroDetails,
        setNfcIntroDetails,
        showAuthModal,
        setShowAuthModal,
        authModalTab,
        setAuthModalTab,
        showAuthSuccessModal,
        setShowAuthSuccessModal,
        authSuccessDetails,
        showLogoutConfirmModal,
        setShowLogoutConfirmModal,
        requestLogout,
        confirmLogout,
        showNfcSuccessModal,
        setShowNfcSuccessModal,
        nfcSuccessDetails,
        setNfcSuccessDetails,
        soundEnabled,
        toggleSound,
        auth,
        loginWithCredentials,
        loginWithQr,
        loginWithNfc,
        logout,
        socials,
        addSocial,
        updateSocial,
        deleteSocial,
        toggleSocialActive,
        resetSocials,
        projects,
        addProject,
        updateProject,
        deleteProject,
        resetProjects,
        education,
        addEducation,
        updateEducation,
        deleteEducation,
        resetEducation,
        announcements,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        toggleAnnouncementActive,
        dismissedAnnouncementIds,
        dismissAnnouncement,
        resetDismissedAnnouncements,
        skills,
        nfcCards,
        registerNfcCard,
        deleteNfcCard,
        inquiries,
        addInquiry,
        markInquiryRead,
        deleteInquiry,
        analytics,
        trackProjectClick,
        trackContactClick,
        trackNfcTap,
        profile,
        updateProfile,
        resetProfile,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
