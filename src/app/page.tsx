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
            <h2 className="text-3xl font-bold text-white text-center mb-2">
              Book Your Session
            </h2>
            <p className="text-slate-400 text-center mb-10">
              Select a date, choose your session length, and secure your spot.
            </p>
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
