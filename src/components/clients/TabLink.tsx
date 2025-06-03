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
            py-2 px-3 md:py-3 md:px-5 font-medium text-xs lg:text-sm transition-colors duration-200
            relative flex items-center justify-center flex-1 text-center
            ${
              isActiveLink
                ? "text-primary font-semibold"
                : "text-gray-600 hover:text-primary"
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
                className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-primaryColor transition-[width] duration-300 ease-out ${
                  isActiveLink ? "w-full" : "w-0"
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
