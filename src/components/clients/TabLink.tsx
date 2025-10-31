import React from "react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";

interface TabLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  end?: boolean;
}

export const TabLink: React.FC<TabLinkProps> = ({
  to,
  children,
  className = "",
  end,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isRootPath = to === currentPath || to + "/" === currentPath;

  return (
    <React.Fragment>
      <RouterNavLink
        to={to}
        end={end}
        className={({ isActive: linkIsActive }) => {
          const isActiveLink = end ? isRootPath : linkIsActive;
          return `
            py-2 px-3 md:py-2.5 md:px-4 font-medium text-sm transition-all duration-300
            relative flex items-center justify-center flex-1 text-center
            ${
              isActiveLink
                ? "text-primaryColor font-semibold"
                : "text-gray-600 hover:text-primaryColor"
            }
            ${className}
          `;
        }}
      >
        {({ isActive: linkIsActive }) => {
          const isActiveLink = end ? isRootPath : linkIsActive;
          return (
            <React.Fragment>
              {children}
              <div
                className={`absolute bottom-0 left-0 right-0 h-[3px] bg-primaryColor transition-all duration-300 ease-out ${
                  isActiveLink
                    ? "opacity-100 scale-x-100"
                    : "opacity-0 scale-x-0"
                }`}
              />
            </React.Fragment>
          );
        }}
      </RouterNavLink>
    </React.Fragment>
  );
};

export default TabLink;
