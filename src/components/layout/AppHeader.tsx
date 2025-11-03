import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, type To } from "react-router-dom";
import { ROUTES, ICONS, IMAGES } from "@agensy/constants";
import { PrimaryButton, SecondaryButton } from "@agensy/components";
import { NavItem } from "./NavItem";
import {
  useHeaderContext,
  useAuthContext,
  useMessagesContext,
  useActivityFeedContext,
} from "@agensy/context";
import { getPageTitle } from "@agensy/utils";

const HEADER_HEIGHT = 72; // Fixed header height in pixels

export const AppHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { headerConfig } = useHeaderContext();
  const { threads, setThreads } = useMessagesContext();
  const { toggleActivityFeed, isActivityFeedOpen } = useActivityFeedContext();
  const {
    userData,
    handleLogout: handleLogoutAuth,
    file,
    isLoggingOut,
  } = useAuthContext();
  const [isNavExpanded, setIsNavExpanded] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const navRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const totalUnreadCount = threads.reduce((total, thread) => {
    return total + (thread.unread_count || 0);
  }, 0);

  // Close nav and profile on route change
  useEffect(() => {
    setIsNavExpanded(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await handleLogoutAuth();
    setThreads([]);
    setIsProfileOpen(false);
  };

  // Handle outside clicks for mobile nav and profile
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
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
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isNavExpanded]);

  const NAV_SECTIONS = [
    {
      id: "navigation",
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
          label: "Care Recipients",
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

  const pageTitle = headerConfig.title || getPageTitle(location.pathname);

  const handleBackClick = () => {
    navigate(
      location.pathname.includes("/client") ? `/${ROUTES.clients}` : (-1 as To)
    );
  };

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100"
      style={{ height: `${HEADER_HEIGHT}px` }}
    >
      <div className="flex items-center justify-between h-full px-2 sm:px-3 md:px-4 lg:pr-6">
        {/* Left Section: Logo + Title */}
        <div className="flex items-center sm:gap-3 md:gap-4 lg:gap-6 min-w-0 flex-1">
          {/* Logo - Hidden on small mobile, shown on md+, stays on left edge */}
          <div className="hidden lg:flex items-center flex-shrink-0 lg:pl-6">
            <img
              src={IMAGES.logo}
              alt="Agensy Logo"
              className="h-12 w-auto cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="nav-toggle-button lg:hidden p-2 min-w-[40px] min-h-[40px] rounded-md text-primaryColor hover:bg-lightGray transition-colors touch-manipulation active:bg-lightGray/80 focus:outline-none focus:ring-2 focus:ring-primaryColor/20 flex-shrink-0 flex items-center justify-center mr-1"
            onClick={() => setIsNavExpanded(!isNavExpanded)}
            aria-label={
              isNavExpanded ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={isNavExpanded}
          >
            {isNavExpanded ? (
              <ICONS.close size={20} />
            ) : (
              <ICONS.menu size={20} />
            )}
          </button>

          {/* Page Title with Back Button - Starts after sidebar on desktop */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0 flex-1 lg:pl-20">
            {headerConfig.showBackButton && (
              <button
                onClick={handleBackClick}
                title="Back"
                className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 focus:outline-none"
              >
                <ICONS.leftArrow size={18} className="text-gray-600" />
              </button>
            )}
            <h1 className="text-sm sm:text-md md:text-base lg:text-xl xl:text-2xl font-bold text-darkGray truncate leading-tight">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Right Section: Buttons + Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
          {/* Primary Button - Always visible when showButton is true */}
          {headerConfig.showButton && headerConfig.onButtonClick && (
            <PrimaryButton
              className="text-xs sm:!py-2.5 !px-3 sm:px-1 !min-h-[35px] sm:text-sm whitespace-nowrap"
              onClick={headerConfig.onButtonClick}
              aria_label={
                headerConfig.buttonAriaLabel ||
                headerConfig.buttonText ||
                "Action button"
              }
              disabled={headerConfig.disabled}
            >
              <span className="hidden sm:inline">
                {headerConfig.buttonText || "Add"}
              </span>
              <span className="sm:hidden">
                <ICONS.plus />
              </span>
            </PrimaryButton>
          )}

          {/* Activity Feed Button - Always visible */}
          <SecondaryButton
            className={`rounded-md !py-2 !px-2.5 sm:p-2.5 flex items-center justify-center transition-all ${
              isActivityFeedOpen ? "bg-primaryColor/10 text-primaryColor" : ""
            }`}
            aria_label="Activity Feed"
            onClick={toggleActivityFeed}
          >
            <ICONS.activityFeed size={20} className="sm:w-5 sm:h-5" />
          </SecondaryButton>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              aria-label="Profile menu"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-primaryColor to-basicBlue text-white text-xs sm:text-sm font-medium shadow-sm hover:shadow-md transition-shadow touch-manipulation focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryColor/50 flex-shrink-0"
            >
              {userData?.avatar ? (
                <img
                  src={file ? URL.createObjectURL(file) : userData.avatar}
                  alt="profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-r from-primaryColor to-basicBlue text-white flex items-center justify-center text-xs sm:text-sm font-medium shadow-sm">
                  {(userData?.first_name?.[0]?.toUpperCase() || "") +
                    (userData?.last_name?.[0]?.toUpperCase() || "")}
                </div>
              )}
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-darkGray line-clamp-2 truncate">
                    {userData?.first_name} {userData?.last_name}
                  </p>
                  <p
                    className="text-xs text-slateGrey truncate"
                    title={userData?.email}
                  >
                    {userData?.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigate(ROUTES.settings);
                    setIsProfileOpen(false);
                  }}
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
                  {!isLoggingOut ? "Logout" : "Logging out..."}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div
        className={`absolute left-0 right-0 bg-white shadow-lg z-20 transition-all duration-200 overflow-hidden border-t border-gray-100 ${
          isNavExpanded
            ? "max-h-[80vh] overflow-y-auto opacity-100"
            : "max-h-0 opacity-0"
        }`}
        style={{ top: `${HEADER_HEIGHT}px` }}
        ref={navRef}
      >
        <div className="px-4 pb-6 pt-5 bg-basicWhite">
          {NAV_SECTIONS.map((section) => (
            <div
              key={section.id}
              className={section.id !== NAV_SECTIONS[0].id ? "mt-6" : ""}
            >
              <div className="space-y-3">
                {section.links.map((link) => (
                  <NavItem
                    key={link.id}
                    icon={<link.icon />}
                    label={link.label}
                    isActive={link.isActiveFn(location.pathname)}
                    onClick={() => {
                      navigate(link.path);
                      setIsNavExpanded(false);
                    }}
                    aria_label={`Go to ${link.label}`}
                    unreadCount={
                      link.id === "messages" ? totalUnreadCount : undefined
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <div
        className={`fixed inset-x-0 bottom-0 bg-darkGray/50 z-10 lg:hidden transition-opacity duration-200 ${
          isNavExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ top: `${HEADER_HEIGHT}px` }}
        onClick={() => setIsNavExpanded(false)}
        aria-label="Close navigation menu"
        role="button"
        tabIndex={isNavExpanded ? 0 : -1}
      ></div>
    </header>
  );
};

export const HEADER_HEIGHT_PX = HEADER_HEIGHT;

export default AppHeader;
