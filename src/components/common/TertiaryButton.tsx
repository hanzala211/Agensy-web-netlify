interface TertiaryButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  aria_label?: string;
}

export const TertiaryButton: React.FC<TertiaryButtonProps> = ({
  type = "button",
  onClick = () => null,
  className = "",
  children,
  disabled = false,
  aria_label,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={aria_label}
      title={aria_label}
      className={`${className} text-basicBlack border border-lightGray px-3 py-1.5 rounded-md bg-basicWhite transition-colors duration-200 text-sm font-medium shadow-sm flex items-center justify-center gap-1`}
    >
      {children}
    </button>
  );
};
