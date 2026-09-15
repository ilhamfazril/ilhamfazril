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
  AnnouncementItem
} from '../types';
import { 
  INITIAL_SOCIALS, 
  INITIAL_PROJECTS, 
  INITIAL_SKILLS, 
  INITIAL_NFC_CARDS, 
  INITIAL_ANALYTICS,
  INITIAL_EDUCATION,
  INITIAL_ANNOUNCEMENTS
} from '../data/initialData';
import { sound } from '../utils/soundEffects';
import { DEV_SECRET_NFC_PAYLOAD, DEV_SECRET_QR_PAYLOAD } from '../utils/nfcAndQr';

interface PortfolioContextType {
  // Theme
  theme: ThemeMode;
  toggleTheme: () => void;

  // View Mode & Intros
  viewMode: 'public' | 'admin';
  setViewMode: (mode: 'public' | 'admin') => void;
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

  // Education History
  education: EducationItem[];
  addEducation: (edu: Omit<EducationItem, 'id'>) => void;
  updateEducation: (id: string, updated: Partial<EducationItem>) => void;
  deleteEducation: (id: string) => void;

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
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme State
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
    return (saved as ThemeMode) || 'dark';
  });

  // Sound State
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SOUND);
    return saved !== null ? saved === 'true' : true;
  });

  // Website Intro State (Modern Entrance)
  const [showWebsiteIntro, setShowWebsiteIntro] = useState<boolean>(() => {
    try {
      const seen = sessionStorage.getItem('ilham_seen_website_intro');
      return !seen;
    } catch {
      return true;
    }
  });

  // NFC Login Intro State (Specialized 13.56 MHz Card Login Intro)
  const [showNfcLoginIntro, setShowNfcLoginIntro] = useState<boolean>(false);
  const [nfcIntroDetails, setNfcIntroDetails] = useState<{ uid: string; timestamp: string }>({
    uid: '04:A2:8B:C1:29:4F:80',
    timestamp: new Date().toLocaleTimeString('id-ID'),
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
      const saved = sessionStorage.getItem('ilham_dismissed_announcements');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Legacy/Compatibility NFC Modal state
  const [showNfcSuccessModal, setShowNfcSuccessModal] = useState<boolean>(false);
  const [nfcSuccessDetails, setNfcSuccessDetails] = useState<{ uid: string; timestamp: string }>({
    uid: '04:A2:8B:C1:29:4F:80',
    timestamp: new Date().toLocaleTimeString('id-ID'),
  });

  // Auth State
  const [auth, setAuth] = useState<DeveloperSession>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH);
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
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SOCIALS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_SOCIALS;
  });

  // Projects State
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PROJECTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_PROJECTS;
  });

  // Education State
  const [education, setEducation] = useState<EducationItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.EDUCATION);
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
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ANNOUNCEMENTS);
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
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.NFC_CARDS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_NFC_CARDS;
  });

  // Inquiries State
  const [inquiries, setInquiries] = useState<MessageInquiry[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.INQUIRIES);
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
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ANALYTICS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_ANALYTICS;
  });

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
    const newSocial: SocialPlatform = {
      ...data,
      id: `soc-${Date.now()}`,
      order: socials.length + 1,
    };
    setSocials(prev => [...prev, newSocial]);
  };

  const updateSocial = (id: string, updated: Partial<SocialPlatform>) => {
    sound.playClick();
    setSocials(prev => prev.map(s => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteSocial = (id: string) => {
    sound.playClick();
    setSocials(prev => prev.filter(s => s.id !== id));
  };

  const toggleSocialActive = (id: string) => {
    sound.playClick();
    setSocials(prev => prev.map(s => (s.id === id ? { ...s, active: !s.active } : s)));
  };

  const resetSocials = () => {
    sound.playClick();
    setSocials(INITIAL_SOCIALS);
  };

  // Projects Actions
  const addProject = (data: Omit<Project, 'id'>) => {
    sound.playSuccess();
    const newProj: Project = {
      ...data,
      id: `proj-${Date.now()}`,
    };
    setProjects(prev => [newProj, ...prev]);
  };

  const updateProject = (id: string, updated: Partial<Project>) => {
    sound.playClick();
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deleteProject = (id: string) => {
    sound.playClick();
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // Education Actions
  const addEducation = (data: Omit<EducationItem, 'id'>) => {
    sound.playSuccess();
    const newEdu: EducationItem = {
      ...data,
      id: `edu-${Date.now()}`,
    };
    setEducation(prev => [newEdu, ...prev]);
  };

  const updateEducation = (id: string, updated: Partial<EducationItem>) => {
    sound.playClick();
    setEducation(prev => prev.map(e => (e.id === id ? { ...e, ...updated } : e)));
  };

  const deleteEducation = (id: string) => {
    sound.playClick();
    setEducation(prev => prev.filter(e => e.id !== id));
  };

  // Announcements Actions
  const addAnnouncement = (data: Omit<AnnouncementItem, 'id' | 'createdAt'>) => {
    sound.playSuccess();
    const newAnn: AnnouncementItem = {
      ...data,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toLocaleString('id-ID'),
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const updateAnnouncement = (id: string, updated: Partial<AnnouncementItem>) => {
    sound.playClick();
    setAnnouncements(prev => prev.map(a => (a.id === id ? { ...a, ...updated } : a)));
  };

  const deleteAnnouncement = (id: string) => {
    sound.playClick();
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const toggleAnnouncementActive = (id: string) => {
    sound.playClick();
    setAnnouncements(prev => prev.map(a => (a.id === id ? { ...a, active: !a.active } : a)));
  };

  // NFC Card Management
  const registerNfcCard = (cardData: Omit<NfcCardRecord, 'id' | 'linkedAt' | 'status'>): NfcCardRecord => {
    sound.playSuccess();
    const newCard: NfcCardRecord = {
      ...cardData,
      id: `card-${Date.now()}`,
      linkedAt: new Date().toLocaleString('id-ID'),
      status: 'active',
    };
    setNfcCards(prev => [newCard, ...prev]);
    return newCard;
  };

  const deleteNfcCard = (id: string) => {
    sound.playClick();
    setNfcCards(prev => prev.filter(c => c.id !== id));
  };

  // Inquiries Actions
  const addInquiry = (inquiryData: Omit<MessageInquiry, 'id' | 'timestamp' | 'read' | 'status'>) => {
    sound.playSuccess();
    const newInquiry: MessageInquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      timestamp: new Date().toLocaleString('id-ID'),
      read: false,
      status: 'new',
    };
    setInquiries(prev => [newInquiry, ...prev]);
    setAnalytics(prev => ({ ...prev, contactClicks: prev.contactClicks + 1 }));
  };

  const markInquiryRead = (id: string) => {
    setInquiries(prev => prev.map(inq => (inq.id === id ? { ...inq, read: true } : inq)));
  };

  const deleteInquiry = (id: string) => {
    sound.playClick();
    setInquiries(prev => prev.filter(inq => inq.id !== id));
  };

  // Trackers
  const trackProjectClick = () => {
    setAnalytics(prev => ({ ...prev, projectClicks: prev.projectClicks + 1 }));
  };

  const trackContactClick = () => {
    setAnalytics(prev => ({ ...prev, contactClicks: prev.contactClicks + 1 }));
  };

  const trackNfcTap = () => {
    setAnalytics(prev => ({ ...prev, nfcTaps: prev.nfcTaps + 1 }));
  };

  return (
    <PortfolioContext.Provider
      value={{
        theme,
        toggleTheme,
        viewMode,
        setViewMode,
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
        education,
        addEducation,
        updateEducation,
        deleteEducation,
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
