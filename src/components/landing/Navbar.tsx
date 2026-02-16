"use client";

import { useState, useEffect, useRef } from "react";
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
  const [eggOpen, setEggOpen] = useState(false);
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleLogoClick(e: React.MouseEvent) {
    e.preventDefault();
    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    if (clickCount.current >= 5) {
      clickCount.current = 0;
      setEggOpen(true);
    } else {
      clickTimer.current = setTimeout(() => {
        if (clickCount.current < 5) window.location.href = "/";
        clickCount.current = 0;
      }, 400);
    }
  }

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
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
          <a href="/" onClick={handleLogoClick} className="select-none shrink-0">
            <img src="/logo.png" alt="CT19 Training" className="h-10 w-auto" />
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
              className="hidden md:inline-flex px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-lg transition"
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
                  className="block mt-2 text-center px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-lg transition"
                >
                  Book Now
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Easter egg */}
      <AnimatePresence>
        {eggOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center cursor-pointer"
            onClick={() => setEggOpen(false)}
          >
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              src="/easter-egg.jpg"
              alt="You found it!"
              loading="lazy"
              className="max-w-[90vw] max-h-[85vh] rounded-2xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
