import type { Metadata, Viewport } from 'next';
import '../index.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://ilhamfazril.my.id'),
  title: 'Ilham Fazril - Luxury Portfolio & Dev Hub',
  description:
    'Ultra-luxurious portfolio and high-tech developer management hub for Ilham Fazril with NFC authentication, QR pass, and dynamic social media manager.',
  keywords:
    'Ilham Fazril, ilhamfazril.my.id, Web Developer Cimahi, UI UX Designer Bandung, Portofolio Ilham Fazril, NFC Smart Card, Pusdikhubad Cimahi, SMK Pusdikhub',
  authors: [{ name: 'Ilham Fazril' }],
  creator: 'Ilham Fazril',
  publisher: 'Ilham Fazril',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: 'https://ilhamfazril.my.id/',
  },
  openGraph: {
    type: 'website',
    url: 'https://ilhamfazril.my.id/',
    title: 'Ilham Fazril - Luxury Portfolio & Dev Hub',
    description:
      'Ultra-luxurious portfolio and high-tech developer management hub for Ilham Fazril with NFC authentication, QR pass, and dynamic social media manager.',
    siteName: 'Ilham Fazril - Luxury Portfolio & Dev Hub',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ilham Fazril - Luxury Portfolio & Dev Hub',
    description:
      'Ultra-luxurious portfolio and high-tech developer management hub for Ilham Fazril with NFC authentication, QR pass, and dynamic social media manager.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://ilhamfazril.my.id/#person',
      name: 'Ilham Fazril',
      jobTitle: 'Web Developer & UI/UX Specialist',
      url: 'https://ilhamfazril.my.id/',
      email: 'ilhamfazril042@gmail.com',
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'SMK Pusdikhubad Cimahi',
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
        'NFC 13.56 MHz Architecture',
        'Tailwind CSS',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://ilhamfazril.my.id/#website',
      url: 'https://ilhamfazril.my.id/',
      name: 'Ilham Fazril - Luxury Portfolio & Dev Hub',
      description: 'Portofolio resmi & Developer Command Center Ilham Fazril',
      publisher: {
        '@id': 'https://ilhamfazril.my.id/#person',
      },
      inLanguage: 'id-ID',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <head />
      <body className="bg-stone-950 text-stone-100 antialiased selection:bg-amber-500/30 selection:text-amber-200 min-h-screen">
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
