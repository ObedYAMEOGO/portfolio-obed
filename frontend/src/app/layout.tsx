import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Cormorant_Garamond } from "next/font/google";

import Navbar from "@/components/shared/Navbar";

import "./globals.css";
import Footer from "@/components/shared/Footer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Obed Yameogo",
  description: "Machine Learning Engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <body
          className={`${cormorant.variable} bg-[#f5f5f5] font-serif antialiased text-[#050505] flex flex-col min-h-screen`}
        >
          {/* PERSISTENT NAVIGATION */}
          <Navbar />

          {/* MAIN CONTENT AREA */}
          {/* pt-16 accounts for the fixed height of the Navbar */}
          <main className="grow">
            {children}
          </main>
          <Footer/>
        </body>
      </html>
    </ClerkProvider>
  );
}