interface SecondaryButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  aria_label?: string;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
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
      className={`${className} px-6 py-2 border border-gray-300 rounded-full transition-colors hover:bg-gray-50`}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
