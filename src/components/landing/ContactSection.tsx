"use client";

import { useRef, useState } from "react";
import { MapPin, Phone } from "lucide-react";
import { motion, useInView } from "framer-motion";

export default function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    // TODO: wire up to an API route or email service
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("sent");
    setForm({ name: "", email: "", phone: "", message: "" });
  }

  return (
    <section id="contact" className="py-20" ref={ref}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden mb-14"
        >
          <div className="absolute inset-0 bg-[#111a2e]" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent" />
          <div className="relative py-16 px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Get in Touch
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Whether you&apos;re ready to start training or just have a
              question, I&apos;m here to help you take the next step.
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Form — 3 cols */}
          <motion.div
            className="md:col-span-3"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
              Send a Message
            </span>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Name<span className="text-red-400">*</span>
                </label>
                <input
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 bg-[#1a2340] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Email<span className="text-red-400">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your email"
                  className="w-full px-4 py-2.5 bg-[#1a2340] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Phone
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Your phone number (optional)"
                  className="w-full px-4 py-2.5 bg-[#1a2340] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Message<span className="text-red-400">*</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your message"
                  className="w-full px-4 py-2.5 bg-[#1a2340] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg transition cursor-pointer"
              >
                {status === "sending"
                  ? "Sending..."
                  : status === "sent"
                    ? "Message Sent!"
                    : "Send Message"}
              </button>
            </form>
          </motion.div>

          {/* Sidebar — 2 cols */}
          <motion.div
            className="md:col-span-2 space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            {/* Contact info card */}
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
                Contact Information
              </span>
              <div className="bg-[#111a2e] border border-white/10 rounded-xl p-6 space-y-5">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-white text-sm">San Jose, CA</p>
                    <p className="text-slate-500 text-sm">Bay Area</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                  <a
                    href="tel:+14084999643"
                    className="text-white text-sm hover:text-blue-400 transition"
                  >
                    (408) 499-9643
                  </a>
                </div>
              </div>
            </div>

            {/* Follow Us */}
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
                Follow Us
              </span>
              <div className="flex gap-4">
                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@Colintakahashi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@colintakahashi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.76a8.28 8.28 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.17z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/colintakahashi19/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
