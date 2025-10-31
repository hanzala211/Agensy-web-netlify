import { NavLink } from "react-router-dom";
import type { ElementType } from "react";
import React from "react";
import { UnreadCountBadge } from "@agensy/components";

interface SidebarItemProps {
  link: string;
  icon: ElementType | string;
  label: string;
  onClick?: () => void;
  isIconType?: boolean;
  unreadCount?: number;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  link,
  icon: Icon,
  label,
  onClick,
  isIconType = false,
  unreadCount,
}) => {
  return (
    <NavLink
      to={link}
      className={({ isActive }) =>
        `group relative flex items-center gap-2.5 px-3.5 py-2.5 min-h-[42px] rounded-md transition-all duration-300 ${
          isActive
            ? "text-primaryColor font-medium !border-none"
            : "text-darkGray hover:text-primaryColor/70"
        } touch-manipulation`
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
              <img src={Icon as string} alt="" className="w-4 h-4" />
            ) : (
              <Icon size={16} />
            )}
          </div>
          <span className="text-sm">{label}</span>
          {unreadCount !== undefined && unreadCount > 0 && (
            <div className="absolute top-1/2 -translate-y-1/2 right-2.5">
              <UnreadCountBadge
                count={unreadCount}
                className="!min-w-[16px] !h-[16px] !text-[11px]"
              />
            </div>
          )}
        </React.Fragment>
      )}
    </NavLink>
  );
};

export default SidebarItem;
