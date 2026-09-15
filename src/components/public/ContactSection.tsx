import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PlatformIcon } from '../common/PlatformIcon';
import { 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink, 
  MessageSquare, 
  Mail, 
  ShieldCheck,
  PhoneCall,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/soundEffects';

export const ContactSection: React.FC = () => {
  const { socials, addInquiry, trackContactClick } = usePortfolio();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Filter only active socials
  const activeSocials = socials.filter(s => s.active);

  const handleCopy = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePlatformClick = (platformName: string, url: string) => {
    sound.playClick();
    trackContactClick(platformName);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    sound.playClick();

    setTimeout(() => {
      addInquiry({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'Proyek Kolaborasi',
        message: formData.message,
      });

      setIsSubmitting(false);
      setSubmittedSuccess(true);
      sound.playSuccess();

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#D4AF37', '#FFD700', '#C59B27', '#F59E0B', '#FFFFFF'],
        });
      } catch {}

      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmittedSuccess(false), 6000);
    }, 600);
  };

  return (
    <section id="contact" className="py-24 relative">
      {/* Background glow */}
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[300px] bg-amber-500/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-mono-tech text-xs uppercase tracking-widest font-semibold">
            <PhoneCall size={13} />
            <span>Kanal Komunikasi Langsung</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif-luxury font-black text-stone-950 dark:text-white">
            Hubungi & <span className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 dark:from-cyan-300 dark:via-sky-200 dark:to-cyan-400 bg-clip-text text-transparent font-black">Mulai Kolaborasi</span>
          </h2>
          <p className="text-stone-800 dark:text-stone-200 text-sm sm:text-base font-normal leading-relaxed">
            Terhubung langsung melalui WhatsApp, LinkedIn, atau kirimkan proposal proyek arsitektur digital Anda melalui formulir di bawah.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Dynamic Social Media Shortcut Hub (Managed via Developer Dashboard) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
              <div className="space-y-0.5">
                <h3 className="text-lg font-serif-luxury font-bold text-stone-950 dark:text-white">
                  Tautan Media Sosial & Kontak Cepat
                </h3>
                <p className="text-xs font-mono-tech text-cyan-600 dark:text-cyan-300 font-bold">
                  Tersinkronisasi Real-Time dengan State Developer Hub
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono-tech bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-300 font-bold">
                {activeSocials.length} Jalur Aktif
              </span>
            </div>

            {/* Social Media Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeSocials.map(social => (
                <div
                  key={social.id}
                  id={`social-card-${social.id}`}
                  onMouseEnter={() => sound.playHover()}
                  onClick={() => handlePlatformClick(social.name, social.url)}
                  className="group relative p-5 rounded-2xl bg-stone-100/95 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 hover:border-cyan-500/60 backdrop-blur-xl shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1 hover:shadow-cyan-500/10"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      {/* Icon with custom platform styling */}
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm"
                        style={{ backgroundColor: `${social.color}20`, color: social.color }}
                      >
                        <PlatformIcon iconKey={social.iconKey} size={20} />
                      </div>

                      {/* Badge if present */}
                      {social.badge && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono-tech font-bold bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-100 border border-stone-300 dark:border-stone-700">
                          {social.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-serif-luxury font-black text-base text-stone-950 dark:text-white group-hover:text-cyan-400 transition-colors">
                        {social.name}
                      </h4>
                      <p className="text-xs font-mono-tech text-stone-700 dark:text-stone-300 truncate font-semibold">
                        {social.username}
                      </p>
                    </div>

                    {social.description && (
                      <p className="text-xs text-stone-800 dark:text-stone-100 line-clamp-2 leading-relaxed font-normal">
                        {social.description}
                      </p>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 mt-3 border-t border-stone-200 dark:border-stone-800/80 flex items-center justify-between text-xs font-mono-tech">
                    <span className="text-cyan-600 dark:text-cyan-300 group-hover:underline flex items-center gap-1 font-bold">
                      <span>Buka Tautan</span>
                      <ExternalLink size={13} />
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleCopy(social.id, social.url, e)}
                      className="p-1.5 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-cyan-400 transition-colors"
                      title="Salin URL / Nomor"
                    >
                      {copiedId === social.id ? (
                        <Check size={14} className="text-emerald-400" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct WhatsApp VIP Callout */}
            <div className="p-5 rounded-2xl bg-stone-100/95 dark:bg-stone-900/90 border border-emerald-500/40 backdrop-blur-md flex items-center justify-between gap-4 shadow-lg">
              <div className="space-y-1">
                <span className="text-xs font-mono-tech text-emerald-600 dark:text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  WhatsApp Direct Line
                </span>
                <p className="text-xs text-stone-800 dark:text-stone-200">
                  Konsultasi kilat arsitektur web, estimasi waktu, dan inquiry privat.
                </p>
              </div>
              <button
                onClick={() => {
                  const wa = socials.find(s => s.iconKey === 'whatsapp');
                  if (wa) handlePlatformClick('WhatsApp', wa.url);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono-tech transition-all cursor-pointer shrink-0 shadow-lg shadow-emerald-500/20"
              >
                Chat WhatsApp
              </button>
            </div>

          </div>

          {/* Direct Proposal Form */}
          <div className="lg:col-span-6">
            <div className="p-8 sm:p-10 rounded-3xl bg-stone-100/95 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 backdrop-blur-2xl shadow-2xl space-y-6">
              
              <div className="space-y-1 border-b border-stone-200 dark:border-stone-800 pb-4">
                <h3 className="text-xl sm:text-2xl font-serif-luxury font-black text-stone-950 dark:text-white">
                  Kirim Pesan & Proposal
                </h3>
                <p className="text-xs font-mono-tech text-stone-700 dark:text-stone-300">
                  Pesan langsung diteruskan ke Inbox Developer Dashboard Ilham Fazril
                </p>
              </div>

              {submittedSuccess && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-mono-tech flex items-center gap-3 animate-in fade-in duration-300">
                  <ShieldCheck size={20} className="shrink-0 text-emerald-400" />
                  <div>
                    <strong className="block font-bold">Pesan Terkirim dengan Sukses!</strong>
                    <span>Ilham Fazril akan meninjau dan merespon dalam waktu 1x24 jam.</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono-tech text-stone-700 dark:text-stone-300 uppercase tracking-wider font-bold">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Alexander Sterling"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 focus:border-cyan-500 focus:outline-none text-stone-900 dark:text-stone-100 text-sm font-sans transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono-tech text-stone-700 dark:text-stone-300 uppercase tracking-wider font-bold">
                      Alamat Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@enterprise.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 focus:border-cyan-500 focus:outline-none text-stone-900 dark:text-stone-100 text-sm font-sans transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono-tech text-stone-700 dark:text-stone-300 uppercase tracking-wider font-bold">
                    Topik / Subjek Proyek
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Pembuatan Sistem Web NFC & Executive Dashboard"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 focus:border-cyan-500 focus:outline-none text-stone-900 dark:text-stone-100 text-sm font-sans transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono-tech text-stone-700 dark:text-stone-300 uppercase tracking-wider font-bold">
                    Detail Pesan & Kebutuhan *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Deskripsikan ruang lingkup proyek, target timeline, atau pertanyaan teknis Anda..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 focus:border-cyan-500 focus:outline-none text-stone-900 dark:text-stone-100 text-sm font-sans transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 font-mono-tech"
                >
                  <Send size={16} />
                  <span>{isSubmitting ? 'Mengenkripsi & Mengirim...' : 'Kirim Pesan Sekarang'}</span>
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
