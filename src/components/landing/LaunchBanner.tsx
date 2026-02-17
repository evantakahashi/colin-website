"use client";

import { useState } from "react";
import { ChevronRight, X } from "lucide-react";

export default function LaunchBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative w-full bg-amber-500/90 hover:bg-amber-500 transition-colors py-2 px-4">
      <a href="#booking" className="block text-center">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-black">
          Launch Special — Limited spots at discounted pricing
          <ChevronRight className="w-4 h-4" />
        </span>
      </a>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-black/60 hover:text-black transition-colors cursor-pointer"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
