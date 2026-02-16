interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  topBar?: React.ReactNode;
}

export default function GlassCard({ children, className = "", topBar }: GlassCardProps) {
  return (
    <div className={`bg-[#111a2e] border border-white/10 rounded-xl overflow-hidden ${className}`}>
      {topBar}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
