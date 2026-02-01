"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { Lock } from "lucide-react";

export default function CoachLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/coach-portal");
    router.refresh();
  }

  return (
    <div className="min-h-screen pitch-bg flex items-center justify-center p-4">
      <div className="bg-[#111a2e] border border-white/10 rounded-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Lock className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-white">Coach Portal</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-[#1a2340] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
              placeholder="coach@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-[#1a2340] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-500 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
