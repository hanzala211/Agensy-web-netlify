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
      className={`${className} p-5 bg-white rounded-md transition-all duration-300`}
      style={style}
    >
      {children}
    </div>
  );
};
