"use client";

import { TimeBlock } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";

interface TimeBlockEditorProps {
  blocks: TimeBlock[];
  onChange: (blocks: TimeBlock[]) => void;
}

export default function TimeBlockEditor({ blocks, onChange }: TimeBlockEditorProps) {
  function addBlock() {
    onChange([...blocks, { start: "09:00", end: "17:00" }]);
  }

  function removeBlock(index: number) {
    onChange(blocks.filter((_, i) => i !== index));
  }

  function updateBlock(index: number, field: "start" | "end", value: string) {
    const updated = blocks.map((b, i) =>
      i === index ? { ...b, [field]: value } : b
    );
    onChange(updated);
  }

  return (
    <div className="space-y-2">
      {blocks.map((block, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="time"
            value={block.start}
            onChange={(e) => updateBlock(i, "start", e.target.value)}
            className="px-3 py-1.5 bg-[#1a2340] border border-white/10 rounded-lg text-sm text-white [color-scheme:dark]"
          />
          <span className="text-slate-500 text-sm">to</span>
          <input
            type="time"
            value={block.end}
            onChange={(e) => updateBlock(i, "end", e.target.value)}
            className="px-3 py-1.5 bg-[#1a2340] border border-white/10 rounded-lg text-sm text-white [color-scheme:dark]"
          />
          <button
            onClick={() => removeBlock(i)}
            className="text-red-400 hover:text-red-500 transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        onClick={addBlock}
        className="flex items-center gap-1 text-sm text-brand-500 hover:text-brand-400 transition cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Add time block
      </button>
    </div>
  );
}
