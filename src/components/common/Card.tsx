import React from "react";
import type { ReactNode } from "react";
import SecondaryButton from "./SecondaryButton";

interface CardProps {
  children: ReactNode;
  title?: string;
  buttonText?: React.ReactNode;
  onButtonClick?: () => void;
  secondaryButtonText?: React.ReactNode;
  onSecondaryButtonClick?: () => void;
  className?: string;
  ariaLabel?: string;
  showButton?: boolean;
  showSecondaryButton?: boolean;
  childrenClasses?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  buttonText,
  onButtonClick,
  secondaryButtonText,
  onSecondaryButtonClick,
  className = "",
  ariaLabel,
  showButton = true,
  showSecondaryButton = false,
  childrenClasses = "",
}) => {
  return (
    <div
      className={`bg-white rounded-md shadow-[0_0_15px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] transition-all duration-300 overflow-hidden h-full flex flex-col ${className}`}
    >
      {title && (
        <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            {title}
          </h2>
          {(buttonText || secondaryButtonText) &&
            (showButton || showSecondaryButton) && (
              <div className="flex gap-1.5">
                {secondaryButtonText && showSecondaryButton && (
                  <SecondaryButton
                    aria_label={ariaLabel}
                    onClick={onSecondaryButtonClick}
                    className="hover:!bg-gray-100 !rounded-md"
                  >
                    {secondaryButtonText}
                  </SecondaryButton>
                )}
                {buttonText && showButton && (
                  <SecondaryButton
                    aria_label={ariaLabel}
                    onClick={onButtonClick}
                    className="hover:!bg-gray-100 !rounded-md"
                  >
                    {buttonText}
                  </SecondaryButton>
                )}
              </div>
            )}
        </div>
      )}

      <div className={`md:p-4 p-3 flex-1 ${childrenClasses}`}>{children}</div>
    </div>
  );
};

export default Card;
