import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-bold text-amber-400 mb-4">404</h1>
      <h2 className="text-xl font-semibold mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-stone-400 mb-6 text-sm max-w-sm">
        Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-amber-500/20"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
