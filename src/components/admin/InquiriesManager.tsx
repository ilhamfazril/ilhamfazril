import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  Mail, 
  Trash2, 
  Check, 
  MessageSquare, 
  Clock, 
  User, 
  Send,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const InquiriesManager: React.FC = () => {
  const { inquiries, markInquiryRead, deleteInquiry } = usePortfolio();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-stone-900/80 border border-amber-500/30 backdrop-blur-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-stone-100 flex items-center gap-2">
            <span>Pesan Masuk & Inquiry Proposal Proyek</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-tech bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {inquiries.length} Pesan
            </span>
          </h2>
          <p className="text-xs sm:text-sm font-mono-tech text-stone-400 mt-1">
            Diterima secara langsung dari formulir kontak publik pengunjung website Ilham Fazril.
          </p>
        </div>
      </div>

      {/* Inquiries List */}
      {inquiries.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-stone-900/50 border border-stone-800 space-y-3 font-mono-tech text-stone-400">
          <MessageSquare size={36} className="mx-auto text-amber-500/40" />
          <p>Belum ada pesan inquiry baru.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map(inq => (
            <div
              key={inq.id}
              className={`p-6 rounded-3xl border transition-all duration-300 space-y-4 ${
                inq.read
                  ? 'bg-stone-900/60 border-stone-800 opacity-80'
                  : 'bg-stone-900/95 border-amber-500/40 shadow-xl'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <User size={16} />
                  </div>
                  <div>
                    <h4 className="font-serif-luxury font-bold text-base text-stone-100">
                      {inq.name}
                    </h4>
                    <a
                      href={`mailto:${inq.email}`}
                      className="text-xs font-mono-tech text-amber-400 hover:underline"
                    >
                      {inq.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono-tech text-stone-500 flex items-center gap-1">
                    <Clock size={12} />
                    {inq.timestamp}
                  </span>

                  {!inq.read && (
                    <button
                      onClick={() => markInquiryRead(inq.id)}
                      className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono-tech hover:bg-emerald-500/20"
                      title="Tandai Sudah Dibaca"
                    >
                      Tandai Dibaca
                    </button>
                  )}

                  <button
                    onClick={() => deleteInquiry(inq.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Hapus Pesan"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="space-y-1 font-mono-tech text-xs">
                <span className="text-amber-300 font-bold block text-sm font-serif-luxury">
                  {inq.subject}
                </span>
                <p className="text-stone-300 leading-relaxed font-sans text-sm p-3 rounded-xl bg-stone-950 border border-stone-800">
                  {inq.message}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <a
                  href={`mailto:${inq.email}?subject=Re:%20${encodeURIComponent(inq.subject)}`}
                  className="px-4 py-2 rounded-xl luxury-gold-gradient text-stone-950 font-bold text-xs font-mono-tech flex items-center gap-2"
                >
                  <Send size={13} />
                  <span>Balas via Email Resmi</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
