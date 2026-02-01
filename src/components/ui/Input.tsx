interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">
        {label}
      </label>
      <input
        className={`w-full px-4 py-2 bg-[#1a2340] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition ${className}`}
        {...props}
      />
    </div>
  );
}
