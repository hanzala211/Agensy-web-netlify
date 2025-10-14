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
      className={`bg-white rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] transition-all duration-300 overflow-hidden h-full flex flex-col ${className}`}
    >
      {title && (
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            {title}
          </h2>
          {(buttonText || secondaryButtonText) &&
            (showButton || showSecondaryButton) && (
              <div className="flex gap-2">
                {secondaryButtonText && showSecondaryButton && (
                  <SecondaryButton
                    aria_label={ariaLabel}
                    onClick={onSecondaryButtonClick}
                    className="hover:!bg-gray-100"
                  >
                    {secondaryButtonText}
                  </SecondaryButton>
                )}
                {buttonText && showButton && (
                  <SecondaryButton
                    aria_label={ariaLabel}
                    onClick={onButtonClick}
                    className="hover:!bg-gray-100"
                  >
                    {buttonText}
                  </SecondaryButton>
                )}
              </div>
            )}
        </div>
      )}

      <div className={`md:p-6 p-4 flex-1 ${childrenClasses}`}>{children}</div>
    </div>
  );
};

export default Card;
