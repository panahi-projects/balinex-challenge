interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: any) => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "primary" | "secondary" | "info" | "success" | "danger";
  size?: "small" | "medium" | "large";
  outline?: boolean;
}

const Button = ({
  children,
  onClick,
  className,
  type,
  disabled,
  variant,
  size,
  outline,
}: ButtonProps) => {
  const variantClass =
    variant === "primary"
      ? "bg-primary-500 text-white"
      : variant === "secondary"
        ? "bg-secondary-800 text-white"
        : variant === "info"
          ? "bg-secondary-text-200 text-white"
          : variant === "success"
            ? "bg-success-500 text-white"
            : "bg-error-800 text-white";
  const sizeClass =
    size === "small" ? "text-sm" : size === "medium" ? "text-base" : "text-lg";
  const outlineClass = outline
    ? "border border-primary-500 text-primary-500"
    : "";

  const defaultClasses = `rounded-md ${size === "small" ? "px-2 py-1" : size === "medium" ? "px-4 py-1" : "px-6 py-3"}`;
  const classes = `${defaultClasses} ${className} ${variantClass} ${sizeClass} ${outlineClass}`;
  return (
    <div className="flex flex-row gap-2">
      <button
        onClick={onClick}
        className={classes}
        type={type}
        disabled={disabled}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
