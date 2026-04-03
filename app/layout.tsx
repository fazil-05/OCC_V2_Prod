import type { Metadata } from "next";
import "./globals.css";
import { Inter, Cormorant_Garamond } from "next/font/google"; // ADDED: High-end editorial serif
import { Toaster } from "sonner";

// Added professional weights for Inter
const inter = Inter({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: '--font-inter' 
});

// Added a Premium Serif for editorial accents
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: '--font-serif'
});

export const metadata: Metadata = {
  title: "OCC — Off Campus Clubs for Gen Z",
  description: "Off Campus Clubs connects students across colleges through clubs, gigs, events, and premium scroll-driven experiences.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <head>
        {process.env.NEXT_PUBLIC_FRAMES_CDN_BASE && (
          <link
            rel="dns-prefetch"
            href={process.env.NEXT_PUBLIC_FRAMES_CDN_BASE}
          />
        )}
        {process.env.NEXT_PUBLIC_FRAMES_CDN_BASE && (
          <link
            rel="preconnect"
            href={process.env.NEXT_PUBLIC_FRAMES_CDN_BASE}
            crossOrigin="anonymous"
          />
        )}
        <link rel="dns-prefetch" href="https://d8j0ntlcm91z4.cloudfront.net" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Toaster position="top-center" richColors theme="dark" />
        {children}
      </body>
    </html>
  );
}
