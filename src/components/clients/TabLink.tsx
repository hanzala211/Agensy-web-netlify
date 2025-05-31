import React from "react";
import { NavLink as RouterNavLink } from "react-router-dom";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  end?: boolean;
}

export const TabLink: React.FC<NavLinkProps> = ({
  to,
  children,
  className = "",
  end,
}) => {
  return (
    <React.Fragment>
      <RouterNavLink
        to={to}
        end={end}
        className={({ isActive: linkIsActive }) => {
          return `
            py-2 px-3 md:py-3 md:px-5 font-medium text-xs lg:text-sm transition-colors duration-200
            relative flex items-center justify-center flex-1 text-center
            ${
              linkIsActive
                ? "text-primary font-semibold"
                : "text-gray-600 hover:text-primary"
            }
            ${className}
          `;
        }}
      >
        {({ isActive: linkIsActive }) => {
          return (
            <React.Fragment>
              {children}
              <div
                className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-primaryColor transition-[width] duration-300 ease-out ${
                  linkIsActive ? "w-full" : "w-0"
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
