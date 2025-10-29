import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ROUTES, ICONS } from "@agensy/constants";
import { SidebarItem } from "./SidebarItem";
import { HEADER_HEIGHT_PX } from "@agensy/components";
import { useMessagesContext } from "@agensy/context";

export const Sidebar: React.FC = () => {
  const { threads } = useMessagesContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const sideBarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        sideBarRef.current &&
        !sideBarRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const totalUnreadCount = threads.reduce((total, thread) => {
    return total + (thread.unread_count || 0);
  }, 0);
  return (
    <React.Fragment>
      <aside
        ref={sideBarRef}
        className={`fixed lg:relative z-30 w-64 flex flex-col transition-transform duration-300
          ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:flex
          bg-white shadow-lg border-r border-gray-100`}
        style={{
          height: `calc(100dvh - ${HEADER_HEIGHT_PX}px)`,
        }}
      >
        <div className="flex-1 overflow-y-auto py-5 px-3">
          <div className="space-y-2">
            <SidebarItem link={"/"} icon={ICONS.homeIcon} label="Dashboard" />
            <SidebarItem
              link={`/${ROUTES.clients}`}
              icon={ICONS.users}
              label="Care Recipients"
            />
            <SidebarItem
              link={ROUTES.documents}
              icon={ICONS.fileIcon}
              label="Documents"
            />

            <SidebarItem
              link={ROUTES.appointments}
              icon={ICONS.calendarIcon}
              label="Appointments"
            />
            <SidebarItem
              link={ROUTES.messages}
              icon={ICONS.messageIcon}
              label="Messages"
              unreadCount={totalUnreadCount}
            />
          </div>
        </div>
      </aside>
    </React.Fragment>
  );
};

export default Sidebar;
