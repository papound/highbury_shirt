"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default function V3Footer() {
  return (
    <footer className="w-full bg-[#07080B] text-white/60 py-16 sm:py-20 border-t border-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Row: Brand, Nav Links, Social Icons (Quantum Style) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-12 border-b border-white/10">
          {/* Brand & Subtitle */}
          <div className="space-y-1">
            <Link
              href="/"
              className="text-lg font-bold tracking-[0.22em] text-white uppercase font-sans"
            >
              HIGHBURY
            </Link>
            <p className="text-xs text-white/40">
              Tailored Asian-Fit Shirts for Modern Professionals
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs sm:text-sm font-medium text-white/70">
            <Link href="#models" className="hover:text-white transition-colors">
              Collection
            </Link>
            <Link href="#craftsmanship" className="hover:text-white transition-colors">
              Craftsmanship
            </Link>
            <Link href="#standards" className="hover:text-white transition-colors">
              Standards
            </Link>
            <Link href="#about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="https://lin.ee/highbury" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Support
            </Link>
          </nav>

          {/* Social Icons */}
          <div className="flex items-center gap-3 text-white/70">
            <Link
              href="https://lin.ee/highbury"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-white/10 hover:text-white transition-colors"
              aria-label="LINE Official"
            >
              <MessageSquare className="w-4 h-4" />
            </Link>

            {/* Instagram SVG */}
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </Link>

            {/* Facebook SVG */}
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Bottom Row: Legal Copyright & Terms (Quantum Style) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <div>
            © {new Date().getFullYear()} Highbury International. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-white/70 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-white/70 transition-colors">
              Terms of Service
            </Link>
            <Link href="/about" className="hover:text-white/70 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
