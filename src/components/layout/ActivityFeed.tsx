import React, { useState, useEffect } from "react";
import { ICONS, DUMMY_ACTIVITIES } from "@agensy/constants";
import { HEADER_HEIGHT_PX } from "@agensy/components";
import { useActivityFeedContext } from "@agensy/context";
import type { ActivityFeedEvent } from "@agensy/types";

type FilterCategory =
  | "all"
  | "documents"
  | "medical"
  | "messages"
  | "appointments";

const getCategoryIcon = (category: ActivityFeedEvent["category"]) => {
  switch (category) {
    case "medical":
      return ICONS.medicine;
    case "messages":
      return ICONS.messageIcon;
    case "appointments":
      return ICONS.calendarIcon;
    case "documents":
      return ICONS.document;
    default:
      return ICONS.document;
  }
};

const getCategoryColor = (category: ActivityFeedEvent["category"]) => {
  switch (category) {
    case "medical":
      return "bg-lightRed";
    case "messages":
      return "bg-purple-100";
    case "appointments":
      return "bg-lightGreen";
    case "documents":
      return "bg-lightBlue";
    default:
      return "bg-lightGray";
  }
};

const getCategoryIconColor = (category: ActivityFeedEvent["category"]) => {
  switch (category) {
    case "medical":
      return "text-red-600";
    case "messages":
      return "text-purple-600";
    case "appointments":
      return "text-green-600";
    case "documents":
      return "text-primaryColor";
    default:
      return "text-slateGrey";
  }
};

export const ActivityFeed: React.FC = () => {
  const { isActivityFeedOpen, closeActivityFeed } = useActivityFeedContext();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [isMounted, setIsMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Handle mount/unmount for animations with proper closing animation
  useEffect(() => {
    if (isActivityFeedOpen) {
      setShouldRender(true);
      // Small delay to trigger opening animation
      setTimeout(() => setIsMounted(true), 10);
    } else {
      // Trigger closing animation
      setIsMounted(false);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 350); // Match the animation duration (300ms + 50ms buffer)
      return () => clearTimeout(timer);
    }
  }, [isActivityFeedOpen]);

  const filteredActivities = (DUMMY_ACTIVITIES as ActivityFeedEvent[]).filter(
    (activity) => {
      if (activeFilter === "all") return true;
      return activity.category === activeFilter;
    }
  );

  const filterTabs: { id: FilterCategory; label: string }[] = [
    { id: "all", label: "All" },
    { id: "documents", label: "Documents" },
    { id: "medical", label: "Medical" },
    { id: "messages", label: "Messages" },
    { id: "appointments", label: "Appointments" },
  ];

  if (!shouldRender) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-darkGray/50 z-40 lg:hidden transition-opacity duration-350 ease-in-out ${
          isMounted ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeActivityFeed}
        aria-label="Close activity feed"
        role="button"
        tabIndex={isActivityFeedOpen ? 0 : -1}
      />

      {/* Activity Feed Sidebar/Drawer */}
      <aside
        className={`fixed right-0 z-50 lg:z-30 bg-basicWhite border-l border-mediumGray flex flex-col activity-feed-container ${
          isMounted ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        } w-full max-w-sm lg:w-80 lg:max-w-none`}
        style={{
          top: `0`,
          bottom: `0`,
          height: "100dvh",
          boxShadow: isMounted
            ? "0 0 1px rgba(0, 0, 0, 0.15)"
            : "0 0 0 rgba(0, 0, 0, 0)",
        }}
      >
        {/* Spacer for header on desktop */}
        <div
          className="hidden lg:block"
          style={{ height: `${HEADER_HEIGHT_PX}px` }}
        />

        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b border-mediumGray bg-white"
          style={{
            opacity: isMounted ? 1 : 0,
            transform: isMounted ? "translateY(0)" : "translateY(-10px)",
            transition: isMounted
              ? "opacity 0.35s ease-out 0.1s, transform 0.35s ease-out 0.1s"
              : "opacity 0.25s ease-in, transform 0.25s ease-in",
          }}
        >
          <h2 className="text-base sm:text-lg font-semibold text-darkGray">
            Activity Feed
          </h2>
          {/* Close button - visible on all screens */}
          <button
            onClick={closeActivityFeed}
            className="p-1.5 hover:bg-lightGray rounded-md transition-colors touch-manipulation"
            aria-label="Close activity feed"
          >
            <ICONS.close size={20} className="text-slateGrey" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-3 border-b border-mediumGray overflow-x-auto bg-white filter-tabs-container activity-feed-scroll-horizontal">
          {filterTabs.map((tab, index) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap touch-manipulation ${
                  isActive
                    ? "bg-primaryColor text-white"
                    : "text-slateGrey hover:bg-lightGray"
                }`}
                style={{
                  opacity: isMounted ? 1 : 0,
                  transform:
                    isActive && isMounted
                      ? "scale(1.05) translateY(0)"
                      : isMounted
                      ? "scale(1) translateY(0)"
                      : "scale(0.95) translateY(-5px)",
                  transition: isMounted
                    ? `opacity 0.35s ease-out ${
                        index * 20
                      }ms, transform 0.35s ease-out ${index * 20}ms`
                    : "opacity 0.25s ease-in, transform 0.25s ease-in",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Activity List */}
        <div className="flex-1 overflow-y-auto p-4 bg-basicWhite activity-feed-scroll">
          <div className="space-y-3">
            {filteredActivities.length === 0 ? (
              <div className="text-center text-slateGrey text-sm py-12">
                No activities found
              </div>
            ) : (
              filteredActivities.map((activity, index) => {
                const Icon = getCategoryIcon(activity.category);
                const bgColor = getCategoryColor(activity.category);
                const iconColor = getCategoryIconColor(activity.category);

                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-lightGray/50 transition-all duration-200 activity-feed-item"
                    style={{
                      opacity: isMounted ? 1 : 0,
                      transform: isMounted
                        ? "translateX(0)"
                        : "translateX(10px)",
                      transition: isMounted
                        ? `opacity 0.4s ease-out ${
                            index * 40
                          }ms, transform 0.4s ease-out ${index * 40}ms`
                        : "opacity 0.25s ease-in, transform 0.25s ease-in",
                    }}
                  >
                    <div
                      className={`flex-shrink-0 w-10 h-10 ${bgColor} rounded-full flex items-center justify-center`}
                    >
                      <Icon size={16} className={iconColor} />
                    </div>

                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-darkGray leading-relaxed">
                        {activity.description}
                      </p>
                      <p className="text-xs text-slateGrey mt-1 font-medium">
                        {activity.client_name}
                      </p>
                      <p className="text-xs text-slateGrey mt-0.5">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default ActivityFeed;
