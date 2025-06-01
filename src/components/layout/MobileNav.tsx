import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES, ICONS, IMAGES } from "@agensy/constants";
import { NavItem } from "./NavItem";
import { useAuthContext } from "@agensy/context";

export const MobileNav: React.FC = () => {
  const { userData, handleLogout, file } = useAuthContext();
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isNavExpanded, setIsNavExpanded] = useState<boolean>(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsNavExpanded(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        isNavExpanded &&
        navRef.current &&
        !navRef.current.contains(e.target as Node) &&
        headerRef.current &&
        !headerRef.current.contains(e.target as Node) &&
        e.target instanceof Node &&
        !e.target.parentElement?.classList.contains("nav-toggle-button")
      ) {
        setIsNavExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isNavExpanded]);

  const NAV_SECTIONS = [
    {
      id: "navigation",
      category: "Navigation",
      links: [
        {
          id: "dashboard",
          icon: ICONS.homeIcon,
          label: "Dashboard",
          path: "/",
          isActiveFn: (path: string) => path === "/",
        },
        {
          id: "clients",
          icon: ICONS.users,
          label: "Clients",
          path: ROUTES.clients,
          isActiveFn: (path: string) => path.includes(ROUTES.clients),
        },
        {
          id: "documents",
          icon: ICONS.fileIcon,
          label: "Documents",
          path: ROUTES.documents,
          isActiveFn: (path: string) => path.includes(ROUTES.documents),
        },
      ],
    },
    {
      id: "workflow",
      category: "Workflow",
      links: [
        // {
        //   id: "templates",
        //   icon: ICONS.fileTextIcon,
        //   label: "Templates",
        //   path: ROUTES.templates,
        //   isActiveFn: (path: string) => path.includes(ROUTES.templates),
        // },
        {
          id: "appointments",
          icon: ICONS.calendarIcon,
          label: "Appointments",
          path: ROUTES.appointments,
          isActiveFn: (path: string) => path.includes(ROUTES.appointments),
        },
        {
          id: "messages",
          icon: ICONS.messageIcon,
          label: "Messages",
          path: ROUTES.messages,
          isActiveFn: (path: string) => path.includes(ROUTES.messages),
        },
      ],
    },
  ];

  return (
    <React.Fragment>
      <header
        className="md:hidden sticky top-0 z-40 bg-white shadow-md h-[56px]"
        ref={headerRef}
      >
        <div className="px-4 py-3 flex items-center justify-between bg-basicWhite h-full">
          <div className="flex items-center">
            <img src={IMAGES.logo} alt="Logo" className="w-8 h-8 mr-2" />
            <h1 className="text-base font-semibold text-primaryColor">
              Agensy
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative" ref={profileRef}>
              <button
                aria-label="profile"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-primaryColor to-basicBlue text-white text-sm font-medium shadow-sm hover:shadow-md transition-shadow touch-manipulation focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryColor/50"
              >
                <div>
                  {userData?.avatar ? (
                    <img
                      src={file ? URL.createObjectURL(file) : userData.avatar}
                      alt="profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primaryColor to-basicBlue text-white flex items-center justify-center text-sm font-medium shadow-sm">
                      {(userData?.first_name?.[0]?.toUpperCase() || "") +
                        (userData?.last_name?.[0]?.toUpperCase() || "")}
                    </div>
                  )}
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-darkGray">
                      User Profile
                    </p>
                    <p
                      className="text-xs text-slateGrey truncate"
                      title={userData?.email}
                    >
                      {userData?.email}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(ROUTES.settings)}
                    className="w-full text-left px-4 py-3 min-h-[44px] text-sm text-darkGray hover:bg-lightGray hover:text-primaryColor active:bg-lightGray/80 touch-manipulation focus:outline-none focus:bg-lightGray/30"
                    aria-label="Go to settings"
                  >
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 min-h-[44px] text-sm text-darkGray hover:bg-lightGray hover:text-primaryColor active:bg-lightGray/80 touch-manipulation focus:outline-none focus:bg-lightGray/30"
                    aria-label="Logout from account"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            <button
              className="nav-toggle-button p-2.5 min-w-[44px] min-h-[44px] rounded-md text-primaryColor hover:bg-lightGray transition-colors touch-manipulation active:bg-lightGray/80 focus:outline-none focus:ring-2 focus:ring-primaryColor/20"
              onClick={() => {
                setIsNavExpanded(!isNavExpanded);
                if (!isNavExpanded) setIsProfileOpen(false);
              }}
              aria-label={
                isNavExpanded ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={isNavExpanded}
            >
              {isNavExpanded ? (
                <ICONS.close size={24} />
              ) : (
                <ICONS.menu size={24} />
              )}
            </button>
          </div>
        </div>
        <div
          className={`fixed inset-x-0 bottom-0 bg-darkGray/50 z-10 md:hidden transition-opacity duration-200 ${
            isNavExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{ top: `56px` }}
          onClick={() => setIsNavExpanded(false)}
          aria-label="Close navigation menu"
          role="button"
          tabIndex={isNavExpanded ? 0 : -1}
        ></div>

        <div
          ref={navRef}
          className={`absolute left-0 right-0 bg-white shadow-lg z-20 transition-all duration-200 overflow-hidden border-t border-gray-100 ${
            isNavExpanded
              ? "max-h-[80vh] overflow-y-auto opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pb-6 pt-5 bg-basicWhite">
            {NAV_SECTIONS.map((section) => (
              <div
                key={section.id}
                className={section.id !== NAV_SECTIONS[0].id ? "mt-6" : ""}
              >
                <div className="flex items-center mb-3">
                  <div className="w-1.5 h-4 bg-primaryColor rounded-full mr-2"></div>
                  <p className="text-xs uppercase text-primaryColor tracking-widest font-medium">
                    {section.category}
                  </p>
                </div>
                <div className="space-y-2">
                  {section.links.map((link) => (
                    <NavItem
                      key={link.id}
                      icon={<link.icon />}
                      label={link.label}
                      isActive={link.isActiveFn(location.pathname)}
                      onClick={() => navigate(link.path)}
                      aria-label={`Go to ${link.label}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

export default MobileNav;
