import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-stone-100 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-bold text-cyan-400 mb-4 font-mono">404</h1>
      <h2 className="text-xl font-semibold mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-stone-400 mb-6 text-sm max-w-sm">
        Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-cyan-500/20"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
