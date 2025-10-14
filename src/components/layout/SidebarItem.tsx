import { NavLink } from "react-router-dom";
import type { ElementType } from "react";
import React from "react";

interface SidebarItemProps {
  link: string;
  icon: ElementType | string;
  label: string;
  onClick?: () => void;
  isIconType?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  link,
  icon: Icon,
  label,
  onClick,
  isIconType = false,
}) => {
  return (
    <NavLink
      to={link}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-lg transition-all duration-300 ${
          isActive
            ? "text-primaryColor font-medium outline-none border-none"
            : "text-darkGray hover:text-primaryColor/70"
        } touch-manipulation focus-visible:outline-none active:!outline-none [&:focus]:outline-none`
      }
      onClick={onClick}
      aria-label={`${label} (current page)`}
      aria-current={"page"}
    >
      {({ isActive }) => (
        <React.Fragment>
          {isActive && (
            <div className="absolute -right-3 top-0 bottom-0 w-1 bg-primaryColor rounded-l-full" />
          )}
          <div
            className={`${
              isActive
                ? "text-primaryColor"
                : "text-slateGrey group-hover:text-primaryColor/70"
            } transition-colors duration-300 flex-shrink-0`}
            aria-hidden="true"
          >
            {isIconType ? (
              <img src={Icon as string} alt="" className="w-5 h-5" />
            ) : (
              <Icon size={18} />
            )}
          </div>
          <span className="text-sm">{label}</span>
        </React.Fragment>
      )}
    </NavLink>
  );
};

export default SidebarItem;
