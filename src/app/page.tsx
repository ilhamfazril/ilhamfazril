'use client';

import dynamic from 'next/dynamic';

const App = dynamic(() => import('../App'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black text-stone-200 flex flex-col justify-between p-6 md:p-12 select-none">
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-4 border-b border-stone-800/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400 text-sm">
            IF
          </div>
          <span className="font-semibold text-lg text-white tracking-wide">Ilham Fazril</span>
        </div>
        <div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
      </header>

      <main className="max-w-4xl mx-auto w-full my-auto py-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-6">
          Web Developer &amp; UI/UX Specialist
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
          Ilham Fazril
        </h1>
        <p className="text-lg md:text-xl text-stone-400 max-w-2xl leading-relaxed mb-8">
          Website Portofolio resmi dan pusat profil developer Ilham Fazril. Spesialis pengembangan web modern, Next.js, React, TypeScript, UI/UX Design, serta arsitektur NFC Smart Card. Lulusan SMK Pusdikhubad Cimahi, Jawa Barat.
        </p>
        <div className="flex flex-wrap gap-2 text-xs font-mono text-stone-400">
          <span className="px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-cyan-300">Next.js &amp; React</span>
          <span className="px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-cyan-300">TypeScript</span>
          <span className="px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-cyan-300">UI/UX Design</span>
          <span className="px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-cyan-300">NFC Smart Card</span>
          <span className="px-2.5 py-1 rounded bg-stone-900 border border-stone-800">SMK Pusdikhubad Cimahi</span>
          <span className="px-2.5 py-1 rounded bg-stone-900 border border-stone-800">Cimahi &amp; Bandung</span>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto w-full text-center text-xs text-stone-600 py-4 border-t border-stone-900">
        &copy; {new Date().getFullYear()} Ilham Fazril. All rights reserved. | ilhamfazril.my.id
      </footer>
    </div>
  ),
});

export default function Page() {
  return <App />;
}
