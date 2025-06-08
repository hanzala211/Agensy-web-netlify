import { NavLink } from "react-router-dom";
import type { ElementType } from "react";
import React from "react";
import { useAuthContext } from "@agensy/context";

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
  const { userData } = useAuthContext();

  return (
    <NavLink
      to={link}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-4 py-2.5 min-h-[48px] rounded-full transition-all duration-200 ${
          isActive
            ? "bg-primaryColor/10 text-primaryColor font-medium"
            : "text-darkGray hover:bg-lightGray"
        } ${
          userData?.subscription_status === "inactive"
            ? "cursor-not-allowed pointer-events-none"
            : ""
        } touch-manipulation focus:outline-none focus:ring-2 focus:ring-primaryColor/20`
      }
      onClick={onClick}
      aria-label={`${label} (current page)`}
      aria-current={"page"}
    >
      {({ isActive }) => (
        <React.Fragment>
          <div
            className={`${
              isActive
                ? "text-primaryColor"
                : "text-slateGrey group-hover:text-primaryColor/70"
            } transition-colors duration-200 flex-shrink-0`}
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
