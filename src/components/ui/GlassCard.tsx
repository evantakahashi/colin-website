interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div className={`bg-[#111a2e] border border-white/10 rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
}
