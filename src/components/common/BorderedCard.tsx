import type { ReactNode } from "react";
import type React from "react";

interface BorderedCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const BorderedCard: React.FC<BorderedCardProps> = ({
  children,
  className,
  style,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`${className} p-5 bg-gradient-to-r from-white to-gray-50 border-l-4 border-blue-500 border-t border-r border-b rounded-lg shadow-sm hover:shadow-sm transition-all duration-300`}
      style={style}
    >
      {children}
    </div>
  );
};
