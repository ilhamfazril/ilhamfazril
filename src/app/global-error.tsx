'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body className="bg-stone-950 text-stone-100 flex items-center justify-center min-h-screen font-sans">
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400 font-bold">
            !
          </div>
          <h2 className="text-xl font-bold mb-2 text-stone-100">
            Terjadi Kesalahan Sistem
          </h2>
          <p className="text-stone-400 mb-6 text-sm">
            {error?.message || 'Gagal memuat sistem portofolio.'}
          </p>
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
          >
            Muat Ulang
          </button>
        </div>
      </body>
    </html>
  );
}
