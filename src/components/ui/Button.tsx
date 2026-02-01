interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const base = "font-medium rounded-lg transition-all duration-200 disabled:opacity-50 cursor-pointer";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white",
    secondary: "bg-white/5 border border-white/10 text-white hover:bg-white/10",
    outline: "border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white",
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
