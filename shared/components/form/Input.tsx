interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  icon?: React.ReactNode;
  "aria-label"?: string;
  role?: string;
}

const Input = ({
  label,
  placeholder,
  value,
  onChange,
  className = "",
  icon,
  "aria-label": ariaLabel,
  role,
}: InputProps) => {
  return (
    <div className="flex flex-col gap-2 w-full relative">
      {label && <label htmlFor={label}>{label}</label>}
      <input
        type="text"
        value={value}
        onChange={onChange}
        className={`w-full p-2 border outline-none text-primary-800 bg-transparent border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${icon ? "pr-10" : ""} ${className}`}
        placeholder={placeholder}
        aria-label={ariaLabel}
        role={role}
      />
      {icon && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">{icon}</div>
      )}
    </div>
  );
};

export default Input;
