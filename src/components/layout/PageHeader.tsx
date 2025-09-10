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
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  buttonText = "Add",
  buttonAriaLabel,
  onButtonClick,
  showButton = true,
  showBackButton,
  className = "mb-6",
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className={`flex flex-col md:flex-row justify-between items-start md:items-center ${className}`}
    >
      <H1 className="text-xl md:my-4 sm:text-2xl md:text-3xl flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
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
            className="bg-basicBlue h-[25px] w-[25px] sm:h-[30px] sm:w-[30px] flex-shrink-0 flex items-center justify-center text-[12px] sm:text-[15px] rounded-full"
          >
            <ICONS.fullLeftArrow color={COLORS.basicWhite} />
          </button>
        )}
        <span className="flex-1 leading-tight">{title}</span>
      </H1>
      {showButton && (
        <PrimaryButton
          className="mt-4 md:mt-0 md:w-auto"
          onClick={onButtonClick}
          aria_label={buttonAriaLabel}
        >
          {buttonText}
        </PrimaryButton>
      )}
    </div>
  );
};

export default PageHeader;
