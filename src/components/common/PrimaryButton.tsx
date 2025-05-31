import { COLORS } from "@agensy/constants";
import { CommonLoader } from "./CommonLoader";

interface PrimaryButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: () => void;
  aria_label?: string;
  isLoading?: boolean;
  disabled?: boolean;
  ref?: React.RefObject<HTMLButtonElement | null>;
  form?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  type = "button",
  className,
  onClick = () => null,
  aria_label = "button",
  isLoading = false,
  disabled = false,
  ref,
  form,
}) => {
  return (
    <button
      ref={ref}
      aria-label={aria_label}
      disabled={isLoading || disabled}
      onClick={onClick}
      form={form}
      type={type}
      title={aria_label}
      className={`${className} text-basicWhite ${
        isLoading || disabled
          ? "bg-basicBlue"
          : "bg-primaryColor hover:text-blue-500 border border-blue-200 hover:bg-blue-50 hover:border-blue-300"
      } px-4 py-3 min-h-[48px] w-full text-[18px] font-medium rounded-full transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryColor touch-manipulation`}
    >
      {!isLoading ? children : <CommonLoader color={COLORS.basicWhite} />}
    </button>
  );
};
