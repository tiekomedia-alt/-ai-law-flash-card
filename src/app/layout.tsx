import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0F1520",
};

export const metadata: Metadata = {
  title: "TeamShuffle — Fair Teams. One Tap.",
  description: "The world's most transparent team shuffler. Randomly assign players to teams with verifiable serial numbers. Used by football clubs, schools, and corporate teams in 30+ countries.",
  keywords: "team shuffler, random team generator, fair team maker, football team picker, squad randomizer, team builder, sports team shuffle",
  authors: [{ name: "Tieko Media Limited" }],
  robots: "index, follow",
  alternates: {
    canonical: "https://teamshuffle.vercel.app/",
  },
  icons: {
    icon: [
      { url: "https://res.cloudinary.com/dspngcwzj/image/upload/w_32,h_32,c_fill/v1773368448/enlarged_logo_team_shuf_g1bmvq.png", sizes: "32x32", type: "image/png" },
      { url: "https://res.cloudinary.com/dspngcwzj/image/upload/w_16,h_16,c_fill/v1773368448/enlarged_logo_team_shuf_g1bmvq.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "https://res.cloudinary.com/dspngcwzj/image/upload/w_180,h_180,c_fill/v1773368448/enlarged_logo_team_shuf_g1bmvq.png", sizes: "180x180" },
    ],
  },
  openGraph: {
    type: "website",
    title: "TeamShuffle — Fair Teams. One Tap.",
    description: "The world's most transparent team shuffler. Randomly assign players to teams with verifiable serial numbers. Free to use.",
    url: "https://teamshuffle.vercel.app/",
    siteName: "TeamShuffle",
    locale: "en_US",
    images: [
      {
        url: "https://res.cloudinary.com/dspngcwzj/image/upload/w_1200,h_630,c_pad,b_rgb:0F1520,g_center/v1773368448/enlarged_logo_team_shuf_g1bmvq.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "TeamShuffle Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TeamShuffle — Fair Teams. One Tap.",
    description: "The world's most transparent team shuffler. Used by football clubs, schools, and teams in 30+ countries.",
    creator: "@tiekomedia",
    site: "@tiekomedia",
    images: ["https://res.cloudinary.com/dspngcwzj/image/upload/w_1200,h_630,c_pad,b_rgb:0F1520,g_center/v1773368448/enlarged_logo_team_shuf_g1bmvq.png"],
  },
  other: {
    "msapplication-TileColor": "#0F1520",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "TeamShuffle",
  "url": "https://teamshuffle.vercel.app",
  "description": "The world's most transparent team shuffler. Randomly assign players to teams with verifiable serial numbers.",
  "applicationCategory": "SportsApplication",
  "operatingSystem": "Web",
  "image": "https://res.cloudinary.com/dspngcwzj/image/upload/v1773368448/enlarged_logo_team_shuf_g1bmvq.png",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "author": {
    "@type": "Organization",
    "name": "Tieko Media Limited",
    "url": "https://www.instagram.com/tiekomedia",
    "sameAs": [
      "https://www.instagram.com/tiekomedia",
      "https://x.com/tiekomedia"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Lagos",
      "addressCountry": "NG"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "120"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
