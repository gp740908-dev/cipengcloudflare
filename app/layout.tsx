import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from 'next/font/google'
import "./globals.css";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import Providers from "@/components/Providers";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { createMetadata, getOrganizationSchema, getLocalBusinessSchema } from '@/lib/seo'

// Optimized font loading with next/font
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'serif'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#4A5D23",
};

export const metadata: Metadata = createMetadata({
  title: 'Luxury Villa Rentals in Ubud, Bali',
  description: 'Discover premium luxury villas in the heart of Ubud, Bali. Experience authentic Balinese hospitality, stunning rice terrace views, and world-class amenities. Book your perfect sanctuary today.',
  keywords: [
    'luxury villas ubud',
    'ubud accommodation',
    'bali villas',
    'ubud hotels',
    'luxury stay ubud',
    'private villas bali',
    'ubud resort',
    'indonesia luxury villas',
    'rice terrace view villas',
    'private pool villas ubud',
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = getOrganizationSchema()
  const localBusinessSchema = getLocalBusinessSchema()

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        {/* Structured Data - Local Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />

        {/* PWA Meta Tags */}
        <meta name="application-name" content="StayinUBUD" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="StayinUBUD" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS Prefetch for better performance */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body className="antialiased bg-cream text-primary">
        <Providers>
          <ServiceWorkerRegister />
          <AnalyticsTracker />
          {children}
        </Providers>
      </body>
    </html>
  );
}
