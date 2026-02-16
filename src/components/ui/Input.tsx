interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({ label, className = "", ...props }: InputProps) {
  const id = props.id || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
        {label}{props.required && <span className="text-red-400"> *</span>}
      </label>
      <input
        id={id}
        className={`w-full px-4 py-2 bg-[#1a2340] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-600 focus:border-transparent outline-none transition ${className}`}
        {...props}
      />
    </div>
  );
}
