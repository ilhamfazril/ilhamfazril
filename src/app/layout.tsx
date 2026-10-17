import type { Metadata, Viewport } from 'next';
import '../index.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://ilhamfazril.my.id'),
  title: 'Ilham Fazril | Website Portofolio & Web Developer',
  description:
    'Website Portofolio resmi Ilham Fazril - Web Developer dan UI/UX Designer alumni SMK Pusdikhubad Cimahi. Proyek web modern, Next.js, React, TypeScript, dan arsitektur NFC Smart Card.',
  keywords: [
    'Ilham',
    'Ilham Fazril',
    'Website Ilham',
    'Website Ilham Fazril',
    'Ilham Developer',
    'Ilham Web Developer',
    'Ilham Fazril Cimahi',
    'Portofolio Ilham Fazril',
    'ilhamfazril.my.id',
    'Web Developer Cimahi',
    'Web Developer Bandung',
    'UI UX Designer Bandung',
    'SMK Pusdikhubad Cimahi',
    'SMK Pusdikhub',
    'NFC Smart Card',
  ],
  authors: [{ name: 'Ilham Fazril', url: 'https://ilhamfazril.my.id' }],
  creator: 'Ilham Fazril',
  publisher: 'Ilham Fazril',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://ilhamfazril.my.id/',
  },
  openGraph: {
    type: 'website',
    url: 'https://ilhamfazril.my.id/',
    title: 'Ilham Fazril | Website Portofolio & Web Developer',
    description:
      'Website Portofolio resmi Ilham Fazril - Web Developer dan UI/UX Designer alumni SMK Pusdikhubad Cimahi. Proyek web modern, Next.js, React, TypeScript, dan arsitektur NFC Smart Card.',
    siteName: 'Ilham Fazril',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ilham Fazril | Website Portofolio & Web Developer',
    description:
      'Website Portofolio resmi Ilham Fazril - Web Developer dan UI/UX Designer alumni SMK Pusdikhubad Cimahi.',
  },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      'JIuRwhZ93Nhidw3RA2ROMOUkwet_tqwqbvXQKh98msk',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://ilhamfazril.my.id/#person',
      name: 'Ilham Fazril',
      alternateName: [
        'Ilham',
        'Ilham Developer',
        'Website Ilham',
        'Website Ilham Fazril',
      ],
      jobTitle: 'Web Developer & UI/UX Specialist',
      url: 'https://ilhamfazril.my.id/',
      email: 'ilhamfazril042@gmail.com',
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'SMK Pusdikhubad Cimahi',
        alternateName: 'SMK Pusdikhub Cimahi',
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Cimahi',
        addressRegion: 'Jawa Barat',
        addressCountry: 'ID',
      },
      knowsAbout: [
        'Web Development',
        'Next.js',
        'React',
        'TypeScript',
        'UI/UX Design',
        'Tailwind CSS',
        'NFC Smart Card Architecture',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://ilhamfazril.my.id/#website',
      url: 'https://ilhamfazril.my.id/',
      name: 'Ilham Fazril - Website & Portfolio Developer',
      alternateName: [
        'Website Ilham',
        'Website Ilham Fazril',
        'Portofolio Ilham Fazril',
        'Ilham Developer',
      ],
      description: 'Website resmi dan portofolio profesional Ilham Fazril, Web Developer & UI/UX Specialist.',
      publisher: {
        '@id': 'https://ilhamfazril.my.id/#person',
      },
      inLanguage: 'id-ID',
    },
    {
      '@type': 'ProfilePage',
      '@id': 'https://ilhamfazril.my.id/#profilepage',
      url: 'https://ilhamfazril.my.id/',
      name: 'Profil Ilham Fazril',
      mainEntity: {
        '@id': 'https://ilhamfazril.my.id/#person',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <head />
      <body 
        className="bg-black text-stone-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200 min-h-screen"
        suppressHydrationWarning
      >
        <script
          key="schema-jsonld"
          id="schema-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
