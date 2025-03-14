import type { Metadata } from "next";
import Script from "next/script";
import {
  PHProvider,
  PostHogPageview,
} from "@/components/providers/posthog-provider";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Trip Genie - Your AI-Powered Travel Planning Assistant",
  description:
    "Create personalized travel itineraries in minutes with our advanced AI technology. Get custom recommendations, save planning time, and explore destinations with confidence.",
  keywords:
    "AI travel planner, travel itinerary, trip planning, personalized travel, travel assistant, custom itinerary, travel recommendations",
  authors: [{ name: "Trip Genie" }],
  openGraph: {
    title: "Trip Genie - Your AI-Powered Travel Planning Assistant",
    description:
      "Create personalized travel itineraries in minutes with Trip Genie.",
    type: "website",
    locale: "en_US",
    url: "https://www.tripgenie.pro",
    images: [
      {
        url: "https://images.unsplash.com/photo-1530789253388-582c481c54b0",
        width: 2070,
        height: 1380,
        alt: "Trip Genie - AI Travel Planning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trip Genie - Your AI-Powered Travel Planning Assistant",
    description:
      "Create personalized travel itineraries in minutes with Trip Genie.",
    images: ["https://images.unsplash.com/photo-1530789253388-582c481c54b0"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: { url: "/apple-touch-icon.png" },
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1693110104960524');
          fbq('track', 'PageView');
        `}
      </Script>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90`}
      >
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1693110104960524&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <PHProvider>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "dummy-id"}
          >
            <div className="relative min-h-screen">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
              <div className="absolute inset-0 bg-gradient-to-tr from-background via-indigo-900/5 to-background -z-10" />

              <Header />
              <main className="relative">{children}</main>
              <PostHogPageview />
              <Toaster position="bottom-right" />
              <Footer />
            </div>
          </GoogleOAuthProvider>
        </PHProvider>
      </body>
    </html>
  );
}
