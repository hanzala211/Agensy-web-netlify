import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES, ICONS, IMAGES } from "@agensy/constants";
import { SidebarItem } from "./SidebarItem";
import { MdClose } from "react-icons/md";
import { PrimaryButton } from "@agensy/components";
import { useAuthContext } from "@agensy/context";

export const Sidebar: React.FC = () => {
  const { userData, handleLogout, file } = useAuthContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const sideBarRef = useRef<HTMLDivElement>(null);
  const sideBarButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        sideBarRef.current &&
        !sideBarRef.current.contains(e.target as Node) &&
        sideBarButtonRef.current &&
        !sideBarButtonRef.current.contains(e.target as Node)
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

  return (
    <React.Fragment>
      <PrimaryButton
        ref={sideBarButtonRef}
        className={`md:hidden fixed top-4 left-4 p-3 min-w-[48px] min-h-[48px] z-50 transition-all duration-300
          bg-white rounded-full shadow-lg touch-manipulation focus:outline-none focus:ring-2 focus:ring-primaryColor/30 active:shadow-md ${
            isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        onClick={() => setIsOpen(!isOpen)}
        aria_label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        <ICONS.menu size={20} className="text-primaryColor" />
      </PrimaryButton>

      <aside
        ref={sideBarRef}
        className={`fixed md:relative h-[100dvh] z-50 w-64 flex flex-col transition-transform duration-300
          ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:flex
          bg-white shadow-lg border-r border-gray-100`}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center">
            <img src={IMAGES.logo} alt="Logo" className="w-9 h-9 mr-3" />
            <h1 className="text-lg font-semibold text-darkGray tracking-wide">
              Agensy
            </h1>
          </div>
          <button
            className="md:hidden text-darkGray hover:text-primaryColor transition-colors p-2.5 min-w-[44px] min-h-[44px] rounded-md touch-manipulation focus:outline-none focus:ring-2 focus:ring-primaryColor/20 active:bg-lightGray/10"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          >
            <MdClose size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-5 px-3">
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase text-slateGrey tracking-widest font-medium mb-3 ml-3">
                Navigation
              </p>
              <nav className="space-y-1">
                <SidebarItem
                  link={"/"}
                  icon={ICONS.homeIcon}
                  label="Dashboard"
                />
                <SidebarItem
                  link={`/${ROUTES.clients}`}
                  icon={ICONS.users}
                  label="Clients"
                />
                <SidebarItem
                  link={ROUTES.documents}
                  icon={ICONS.fileIcon}
                  label="Documents"
                />
              </nav>
            </div>

            <div>
              <p className="text-xs uppercase text-slateGrey tracking-widest font-medium mb-3 ml-3">
                Workflow
              </p>
              <nav className="space-y-1">
                {/* <SidebarItem
                  link={ROUTES.templates}
                  icon={ICONS.fileTextIcon}
                  label="Templates"
                /> */}
                <SidebarItem
                  link={ROUTES.appointments}
                  icon={ICONS.calendarIcon}
                  label="Appointments"
                />
                <SidebarItem
                  link={ROUTES.messages}
                  icon={ICONS.messageIcon}
                  label="Messages"
                />
              </nav>
            </div>
          </div>
        </div>

        {userData?.subscription_status === "inactive" && (
          <div className="border-t p-2 border-gray-100">
            <SidebarItem
              link={`${ROUTES.settings}/${ROUTES.profileSubscription}`}
              icon={ICONS.subscription}
              label="Subscribe"
            />
          </div>
        )}
        <div className="p-4 border-t border-gray-100">
          <div
            className="flex items-center p-2 rounded-full cursor-pointer hover:bg-lightGray transition-all mb-3"
            onClick={() => navigate(ROUTES.settings)}
            role="button"
            tabIndex={0}
            aria-label="View user profile settings"
          >
            <div>
              {userData?.avatar ? (
                <img
                  src={file ? URL.createObjectURL(file) : userData.avatar}
                  alt="profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primaryColor to-basicBlue text-white flex items-center justify-center text-sm font-medium shadow-sm">
                  {(userData?.first_name?.[0]?.toUpperCase() || "") +
                    (userData?.last_name?.[0]?.toUpperCase() || "")}
                </div>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-darkGray line-clamp-2 truncate max-w-[9rem] overflow-hidden">
                {userData?.first_name} {userData?.last_name}
              </p>
              <p className="text-xs text-slateGrey">View account</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 min-h-[48px] rounded-full text-darkGray hover:bg-lightGray hover:text-primaryColor transition-all touch-manipulation focus:outline-none focus:ring-2 focus:ring-primaryColor/20 active:bg-lightGray/80"
            aria-label="Logout from account"
          >
            <ICONS.logoutIcon size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </React.Fragment>
  );
};

export default Sidebar;
