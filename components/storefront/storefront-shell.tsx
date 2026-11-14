"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import HeaderV3 from "./v3/header-v3";
import V3Footer from "./v3/v3-footer";
import SmartSizeGuideModal from "./v3/smart-size-guide-modal";
import "./v3/v3.css";

export interface StorefrontV3ContextType {
  theme: "dark" | "light";
  toggleTheme: () => void;
  lang: "th" | "en";
  toggleLang: () => void;
  isSizeGuideOpen: boolean;
  openSizeGuide: () => void;
  closeSizeGuide: () => void;
}

const StorefrontV3Context = createContext<StorefrontV3ContextType | null>(null);

export function useStorefrontV3() {
  const ctx = useContext(StorefrontV3Context);
  if (!ctx) {
    throw new Error("useStorefrontV3 must be used within StorefrontShell");
  }
  return ctx;
}

export function useStorefrontV3Safe(): StorefrontV3ContextType | null {
  return useContext(StorefrontV3Context);
}

interface StorefrontShellProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}

export default function StorefrontShell({ children }: StorefrontShellProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/" || pathname === "/v3";

  // Global Theme: 'dark' (Quantum standard) or 'light' (Architectural Tailoring)
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [lang, setLang] = useState<"th" | "en">("th");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Initialize theme from URL query param (?theme=light) or localStorage
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTheme = params.get("theme");
      if (urlTheme === "light" || urlTheme === "dark") {
        setTheme(urlTheme);
        localStorage.setItem("highbury-theme", urlTheme);
        return;
      }

      const stored = localStorage.getItem("highbury-theme");
      if (stored === "light" || stored === "dark") {
        setTheme(stored);
      }
    } catch {}
  }, []);

  // Sync with color-scheme meta tag and HTML element class for shadcn UI components
  useEffect(() => {
    try {
      let meta = document.querySelector('meta[name="color-scheme"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "color-scheme");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", theme === "light" ? "light" : "dark");

      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("highbury-theme", next);
      } catch {}
      return next;
    });
  };

  const toggleLang = () => {
    setLang((prev) => (prev === "th" ? "en" : "th"));
  };

  const openSizeGuide = () => setIsSizeGuideOpen(true);
  const closeSizeGuide = () => setIsSizeGuideOpen(false);

  const contextValue: StorefrontV3ContextType = {
    theme,
    toggleTheme,
    lang,
    toggleLang,
    isSizeGuideOpen,
    openSizeGuide,
    closeSizeGuide,
  };

  return (
    <StorefrontV3Context.Provider value={contextValue}>
      <div
        data-theme={theme}
        className={`v3-page-wrapper min-h-screen flex flex-col w-full antialiased transition-colors duration-200 ${
          theme === "light"
            ? "bg-[#FFFFFF] text-[#0F172A] selection:bg-[#2563EB] selection:text-white"
            : "bg-[#07080B] text-white selection:bg-white selection:text-black"
        }`}
      >
        {/* Unified Floating Quantum Glass Header */}
        <HeaderV3
          onOpenSizeGuide={openSizeGuide}
          lang={lang}
          onToggleLang={toggleLang}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Main Content Area */}
        <main
          className={`flex-1 w-full ${
            isHomePage ? "" : "pt-24 sm:pt-28 min-h-[calc(100vh-280px)]"
          }`}
        >
          {children}
        </main>

        {/* Unified V3 Footer */}
        <V3Footer />

        {/* Global Smart Size Guide Modal */}
        <SmartSizeGuideModal
          isOpen={isSizeGuideOpen}
          onClose={closeSizeGuide}
          theme={theme}
        />

        <Toaster richColors position="top-right" closeButton />
      </div>
    </StorefrontV3Context.Provider>
  );
}
