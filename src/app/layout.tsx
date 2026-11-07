import type { Metadata } from "next";
import { Playfair_Display, JetBrains_Mono, Inter } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Grantly — Frictionless Scholarship Discovery & Kanban Tracker",
  description:
    "Grantly is a frictionless, visually immersive dashboard that revolutionizes how students discover and manage scholarships. It combines a personalized, fast-scrolling discovery feed with an interactive, drag-and-drop Kanban tracker, transforming a traditionally complex bureaucratic process into a seamless, highly secure digital journey.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jetbrainsMono.variable} ${inter.variable} antialiased`}
    >
      <body className={`${inter.className} min-h-screen selection:bg-[#FF3366] selection:text-white relative`} style={{ backgroundColor: "var(--canvas)", color: "var(--ink)" }}>
        {/* Buttery smooth scrolling initialized with SSR safety */}
        <SmoothScroll />

        {/* Global tactile grain / noise overlay across the entire viewport */}
        <div className="grain-overlay" aria-hidden="true" />

        {children}
      </body>
    </html>
  );
}
