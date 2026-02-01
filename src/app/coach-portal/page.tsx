"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import AvailabilityManager from "@/components/coach/AvailabilityManager";
import RecentBookings from "@/components/coach/RecentBookings";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { LogOut, Shield } from "lucide-react";

export default function CoachPortalPage() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/coach-portal/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen pitch-bg">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Coach Portal</h1>
          </div>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            <span className="flex items-center gap-1">
              <LogOut className="w-4 h-4" />
              Logout
            </span>
          </Button>
        </div>

        <div className="space-y-6">
          <GlassCard>
            <AvailabilityManager />
          </GlassCard>

          <GlassCard>
            <RecentBookings />
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
