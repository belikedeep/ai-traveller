import type { Metadata } from "next";
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
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90`}
      >
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
