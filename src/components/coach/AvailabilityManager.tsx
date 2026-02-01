"use client";

import { useEffect, useState } from "react";
import { AvailabilityRow } from "@/lib/types";
import { WEEKDAY_LABELS } from "@/lib/constants";
import DayToggle from "./DayToggle";
import TimeBlockEditor from "./TimeBlockEditor";
import Button from "@/components/ui/Button";
import { Settings, Save } from "lucide-react";

function getNextDate(weekday: number): string {
  const now = new Date();
  const current = now.getDay();
  let diff = weekday - current;
  if (diff < 0) diff += 7;
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  const next = new Date(now);
  next.setDate(now.getDate() + diff);
  return next.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function AvailabilityManager() {
  const [availability, setAvailability] = useState<AvailabilityRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/availability")
      .then((r) => r.json())
      .then((data) => setAvailability(data))
      .catch(() => {});
  }, []);

  function toggleDay(weekday: number) {
    setAvailability((prev) =>
      prev.map((a) =>
        a.weekday === weekday
          ? {
              ...a,
              enabled: !a.enabled,
              blocks: !a.enabled && a.blocks.length === 0
                ? [{ start: "09:00", end: "17:00" }]
                : a.blocks,
            }
          : a
      )
    );
    setSaved(false);
  }

  function updateBlocks(weekday: number, blocks: AvailabilityRow["blocks"]) {
    setAvailability((prev) =>
      prev.map((a) => (a.weekday === weekday ? { ...a, blocks } : a))
    );
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(availability),
      });
      setSaved(true);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <Settings className="w-5 h-5 text-slate-400" />
        Weekly Availability
      </h3>

      {/* Day toggles */}
      <div className="flex flex-wrap gap-2 mb-6">
        {availability.map((a) => (
          <DayToggle
            key={a.weekday}
            weekday={a.weekday}
            enabled={a.enabled}
            onToggle={toggleDay}
          />
        ))}
      </div>

      {/* Time blocks per enabled day */}
      <div className="space-y-4 mb-6">
        {availability
          .filter((a) => a.enabled)
          .map((a) => (
            <div key={a.weekday} className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <p className="font-medium text-sm text-white">
                  {WEEKDAY_LABELS[a.weekday]}
                </p>
                <span className="text-xs text-slate-500">
                  Next: {getNextDate(a.weekday)}
                </span>
              </div>
              <TimeBlockEditor
                blocks={a.blocks}
                onChange={(blocks) => updateBlocks(a.weekday, blocks)}
              />
            </div>
          ))}
      </div>

      <Button onClick={save} disabled={saving}>
        <span className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : saved ? "Saved!" : "Save Availability"}
        </span>
      </Button>
    </div>
  );
}
