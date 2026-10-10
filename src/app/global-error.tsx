'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body className="bg-stone-950 text-stone-100 flex items-center justify-center min-h-screen">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Terjadi kesalahan teknis</h2>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-amber-500 text-stone-950 font-semibold rounded-lg hover:bg-amber-400 transition"
          >
            Muat ulang
          </button>
        </div>
      </body>
    </html>
  );
}
