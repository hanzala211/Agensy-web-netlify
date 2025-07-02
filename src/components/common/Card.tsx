import React from "react";
import type { ReactNode } from "react";
import SecondaryButton from "./SecondaryButton";

interface CardProps {
  children: ReactNode;
  title?: string;
  buttonText?: React.ReactNode;
  onButtonClick?: () => void;
  className?: string;
  ariaLabel?: string;
  showButton?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  buttonText,
  onButtonClick,
  className = "",
  ariaLabel,
  showButton = true,
}) => {
  return (
    <div
      className={`bg-basicWhite/90 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-all duration-300 overflow-hidden h-full flex flex-col ${className}`}
    >
      {title && (
        <div className="px-6 pt-6 pb-3 border-b flex justify-between items-center border-gray-200 bg-gradient-to-r from-white to-gray-50/80">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            {title}
          </h2>
          {buttonText && showButton && (
            <div className="flex">
              <SecondaryButton
                aria_label={ariaLabel}
                onClick={onButtonClick}
                className="hover:!bg-gray-100"
              >
                {buttonText}
              </SecondaryButton>
            </div>
          )}
        </div>
      )}

      <div className="md:p-6 p-4 flex-1">{children}</div>
    </div>
  );
};

export default Card;
