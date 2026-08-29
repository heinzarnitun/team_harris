import type { Metadata } from "next";
import { Inter, Noto_Sans_Myanmar } from "next/font/google";
import { AppProvider } from "@/components/AppProvider";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import AISnapToListModal from "@/components/AISnapToListModal";
import AuthModal from "@/components/AuthModal";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const myanmar = Noto_Sans_Myanmar({
  subsets: ["myanmar"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-myanmar",
});

export const metadata: Metadata = {
  title: "EcoLoop — Local circular marketplace",
  description:
    "AI-powered local second-hand marketplace for circular shopping, barter, and fair deals.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${myanmar.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-900">
        <AppProvider>
          <Navbar />
          <main className="pb-24 md:pb-8">{children}</main>
          <MobileNav />
          <AISnapToListModal />
          <AuthModal />
        </AppProvider>
      </body>
    </html>
  );
}
