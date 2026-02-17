import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ContentSection from "@/components/landing/ContentSection";
import BookingFlow from "@/components/landing/BookingFlow";
import AnimateOnScroll from "@/components/landing/AnimateOnScroll";

export default function Home() {
  return (
    <main id="main" className="min-h-screen pitch-bg">
      <Navbar />
      <HeroSection />
      <ContentSection />

      {/* Booking section */}
      <section id="booking" className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <AnimateOnScroll>
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-400 text-sm font-medium">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                Launch Special — Limited spots at intro pricing
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white text-center mb-2">
              Book Your Session
            </h2>
            <p className="text-slate-400 text-center mb-4">
              Select a date, choose your session length, and secure your spot.
            </p>
            <div className="max-w-md mx-auto mb-10 p-3 rounded-lg bg-brand-600/10 border border-brand-500/20 text-center">
              <p className="text-sm text-brand-400 font-medium">
                Book a session and get a personal follow from
              </p>
              <p className="text-sm text-white font-semibold mt-1 inline-flex items-center gap-2 justify-center">
                @colintakahashi
                <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.76a8.28 8.28 0 004.76 1.5v-3.4a4.85 4.85 0 01-1-.17z" /></svg>
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.2}>
            <BookingFlow />
          </AnimateOnScroll>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} CT19 Training. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="/contact" className="text-sm text-slate-500 hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
