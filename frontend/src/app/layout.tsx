// app/layout.tsx

import type { Metadata } from "next";

import { ClerkProvider } from "@clerk/nextjs";

import { Cormorant_Garamond } from "next/font/google";

import "./globals.css";

import Navbar from "@/components/navbar/Navbar";

import Footer from "@/components/shared/Footer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],

  variable: "--font-serif",

  display: "swap",

  weight: [
    "300",
    "400",
    "500",
    "600",
    "700",
  ],
});

export const metadata: Metadata = {
  title: {
    default: "Obed Yameogo",

    template:
      "%s | Obed Yameogo",
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

  authors: [
    {
      name: "Obed Yameogo",
    },
  ],

  creator: "Obed Yameogo",

  metadataBase: new URL(
    "http://localhost:3000",
  ),
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
            ${cormorant.variable}
            flex
            min-h-screen
            flex-col
            bg-[#f5f5f5]
            font-serif
            text-[#050505]
            antialiased
          `}
        >
          {/* NAVBAR */}
          <Navbar />

          {/* MAIN */}
          <main className="flex-1 pt-16">
            {children}
          </main>

          {/* FOOTER */}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}