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
  loaderColor?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  type = "button",
  className,
  onClick = () => null,
  aria_label = "button",
  isLoading = false,
  disabled = false,
  loaderColor = COLORS.basicWhite,
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
      className={`${className} inline-flex items-center justify-center gap-2.5 px-6 py-3 min-h-[48px] w-full text-[16px] font-semibold rounded-md transition-all duration-300 ease-in-out focus:outline-none touch-manipulation ${
        isLoading
          ? "bg-primaryColor text-white cursor-wait opacity-70 shadow-[0_0_12px_rgba(0,0,0,0.1)]"
          : disabled
          ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60 shadow-[0_0_10px_rgba(0,0,0,0.08)]"
          : "bg-primaryColor text-white shadow-[0_0_12px_rgba(0,0,0,0.1)] hover:shadow-[0_0_18px_rgba(0,0,0,0.15)] hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      }`}
    >
      {!isLoading ? children : <CommonLoader color={loaderColor} size={25} />}
    </button>
  );
};
