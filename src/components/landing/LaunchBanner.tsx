import { ChevronRight } from "lucide-react";

export default function LaunchBanner() {
  return (
    <a
      href="#booking"
      className="block w-full bg-amber-500/90 hover:bg-amber-500 transition-colors py-2 px-4 text-center"
    >
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-black">
        Launch Special — Limited spots at discounted pricing
        <ChevronRight className="w-4 h-4" />
      </span>
    </a>
  );
}
