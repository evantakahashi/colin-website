"use client";

import { LOCATIONS, Location } from "@/lib/constants";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface LocationSelectorProps {
  selected?: Location;
  onSelect: (location: Location) => void;
}

export default function LocationSelector({ selected, onSelect }: LocationSelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-slate-400" />
        Select Location
      </h3>
      <div className="flex flex-col gap-3">
        {LOCATIONS.map((loc) => (
          <motion.button
            key={loc.id}
            onClick={() => onSelect(loc)}
            whileTap={{ scale: 0.95 }}
            className={`p-4 rounded-lg text-left transition-all duration-200 cursor-pointer ${
              selected?.id === loc.id
                ? "bg-white ring-2 ring-brand-400"
                : "bg-brand-600 hover:bg-brand-500"
            }`}
          >
            <span className={`text-base font-semibold ${selected?.id === loc.id ? "text-brand-600" : "text-white"}`}>
              {loc.name}
            </span>
            <p className={`text-sm mt-1 ${selected?.id === loc.id ? "text-brand-500/70" : "text-brand-100/70"}`}>
              {loc.address}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
