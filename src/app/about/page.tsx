import Navbar from "@/components/landing/Navbar";
import AboutSection from "@/components/landing/AboutSection";

export default function AboutPage() {
  return (
    <main className="min-h-screen pitch-bg">
      <Navbar />
      <AboutSection />

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} CT Training. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-slate-500 hover:text-white transition">Privacy</a>
            <a href="#" className="text-sm text-slate-500 hover:text-white transition">Terms</a>
            <a href="/contact" className="text-sm text-slate-500 hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
