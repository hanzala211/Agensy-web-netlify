import React from "react";
import { H1, PrimaryButton } from "@agensy/components";
import { ICONS } from "@agensy/constants";
import { COLORS, ROUTES } from "@agensy/constants";
import { type To, useLocation, useNavigate } from "react-router-dom";
interface PageHeaderProps {
  title: string;
  buttonText?: string;
  buttonAriaLabel?: string;
  onButtonClick?: () => void;
  showButton?: boolean;
  showBackButton?: boolean;
  className?: string;
  disabled?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  buttonText = "Add",
  buttonAriaLabel,
  onButtonClick,
  showButton = true,
  showBackButton,
  className = "mb-6",
  disabled,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-3 ${className}`}
    >
      <H1 className="text-lg sm:text-xl md:text-2xl flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
        {showBackButton && (
          <button
            onClick={() =>
              navigate(
                location.pathname.includes("/client")
                  ? `/${ROUTES.clients}`
                  : (-1 as To)
              )
            }
            title="Back"
            className="h-[32px] w-[32px] flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-300"
          >
            <ICONS.fullLeftArrow color={COLORS.primaryColor} size={18} />
          </button>
        )}
        <h1 className="flex-1 leading-tight text-[24px]">{title}</h1>
      </H1>
      {showButton && (
        <PrimaryButton
          className="mt-2 md:mt-0 md:w-auto !min-h-[40px] !text-[14px] !px-3 !py-0"
          onClick={onButtonClick}
          aria_label={buttonAriaLabel}
          disabled={disabled}
        >
          {buttonText}
        </PrimaryButton>
      )}
    </div>
  );
};

export default PageHeader;
