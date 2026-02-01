"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl transition-colors duration-300"
      style={{
        background: scrolled
          ? "rgba(11, 17, 32, 0.95)"
          : "rgba(11, 17, 32, 0.8)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="text-xl font-bold text-white tracking-tight">
          CT <span className="text-blue-500">Training</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-slate-400 hover:text-white transition"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <a
            href="/#booking"
            className="hidden md:inline-flex px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition"
          >
            Book Now
          </a>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-slate-400 hover:text-white cursor-pointer"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden overflow-hidden border-t border-white/5"
          >
            <div className="px-4 pb-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-sm text-slate-400 hover:text-white transition"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/#booking"
                onClick={() => setOpen(false)}
                className="block mt-2 text-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition"
              >
                Book Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
