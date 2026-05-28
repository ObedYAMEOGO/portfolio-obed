// app/layout.tsx

import type { Metadata } from "next";

import { ClerkProvider } from "@clerk/nextjs";
import { Sora, DM_Mono } from "next/font/google";

import "./globals.css";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/shared/Footer";
import NewsletterSubscribe from "@/components/newsletter/NewsletterSubscribe";
import AuthProvider from "@/components/providers/AuthProvider";
import UserSync from "@/components/providers/UserSync";
import WelcomeToast from "@/components/providers/WelcomeToast";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "600"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["300", "400"],
});

export const metadata: Metadata = {
  title: {
    default: "Obed Yameogo",
    template: "%s | Obed Yameogo",
  },
  description:
    "Machine Learning Engineer focused on production AI systems, LLM infrastructure, MLOps, and scalable intelligent applications.",
  keywords: [
    "Machine Learning Engineer",
    "AI Engineer",
    "LLM",
    "RAG",
    "MLOps",
    "Next.js",
    "FastAPI",
    "Obed Yameogo",
  ],
  authors: [{ name: "Obed Yameogo" }],
  creator: "Obed Yameogo",
  metadataBase: new URL("https://portfolio-obed-pi.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className="scroll-smooth"
        suppressHydrationWarning
      >
        <body
          className={`
            ${sora.variable}
            ${dmMono.variable}
            flex
            min-h-screen
            flex-col
            bg-[#f5f5f5]
            font-sans
            text-[#050505]
            antialiased
          `}
        >
          <AuthProvider>
            <UserSync />

            <Navbar />

            <div className="fixed right-4 top-18 z-50">
              <WelcomeToast />
            </div>

            <main className="flex-1 pt-16">
              {children}
            </main>

            <NewsletterSubscribe />
            <Footer />
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
