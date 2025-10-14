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
      className={`${className} p-5 bg-white rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] transition-all duration-300`}
      style={style}
    >
      {children}
    </div>
  );
};
