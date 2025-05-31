import type React from "react";
import { Link } from "react-router-dom";

interface CommonLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const CommonLink: React.FC<CommonLinkProps> = ({
  to,
  children,
  className = "",
  onClick,
}) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`${className} text-primaryColor font-medium hover:underline transition-colors`}
    >
      {children}
    </Link>
  );
};

export default CommonLink;
