import React, { useState, useEffect, useRef, useMemo } from "react";
import { ICONS } from "@agensy/constants";
import { HEADER_HEIGHT_PX } from "@agensy/components";
import { useActivityFeedContext, useClientContext } from "@agensy/context";
import { useGetActivitiesQuery } from "@agensy/api";
import { DateUtils } from "@agensy/utils";
import type { ActivityFeedEvent, FilterCategory } from "@agensy/types";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@agensy/constants";

interface ActivityApiResponse {
  id: string;
  client_id?: string;
  entity_type?: string;
  entity_id?: string;
  metadata?: {
    form_type?: string;
  };
  user?: {
    first_name?: string;
    last_name?: string;
  };
  client?: {
    first_name?: string;
    last_name?: string;
  };
  category: "medical" | "appointments" | "documents";
  description: string;
  createdAt: string;
  updatedAt: string;
}

const getFormNavigationPath = (entityType: string, subtypeId?: string) => {
  const formTypeMap: Record<string, { folder: string; form: string }> = {
    face_sheet_short: {
      folder: "essential-health-information",
      form: "face-sheet-short",
    },
    face_sheet_long: {
      folder: "essential-health-information",
      form: "face-sheet-long",
    },
    health_history: {
      folder: "essential-health-information",
      form: "health-history-form-medical",
    },
    initial_care_plan: {
      folder: "assessment",
      form: "initial-assessment",
    },
    comprehensive_care_plan: {
      folder: "assessment",
      form: "comprehensive-care-plan-assessment",
    },
    care_recipient_questionnaire: {
      folder: "assessment",
      form: "care-recipient-questionnaire",
    },
    caregiver_information_sheet: {
      folder: "guides-checklists",
      form: "caregiver-information",
    },
    initial_care_plan_assessment: {
      folder: "assessment",
      form: "initial-assessment",
    },
    comprehensive_care_plan_assessment: {
      folder: "assessment",
      form: "comprehensive-care-plan-assessment",
    },
    essential_document: {
      folder: "guides-checklists",
      form: "essential-document-for-aging",
    },
    labs_test_imaging_tracker: {
      folder: "essential-health-information",
      form: "labs-test-tracker",
    },
    burial_instructions: {
      folder: "essential-documents-for-aging",
      form: "burial-instructions",
    },
    in_patient_stay_notes: {
      folder: "essential-health-information",
      form: "in-patient-stay-notes",
    },
    comprehensive_medication_supplement_list: {
      folder: "essential-health-information",
      form: "comprehensive-medication-list",
    },
    personal_info_password_manager: {
      folder: "essential-documents-for-aging",
      form: "personal-info",
    },
    important_people: {
      folder: "essential-documents-for-aging",
      form: "important-people-in-life",
    },
    start_of_care: {
      folder: "guides-checklists",
      form: "start-of-care-checklist",
    },
    hospitalization: {
      folder: "guides-checklists",
      form: "hospital-checklist",
    },
    move_in: { folder: "guides-checklists", form: "move-in-checklist" },
    next_step_after_death: {
      folder: "guides-checklists",
      form: "next-steps-after-death",
    },
    vitals_tracker: {
      folder: "essential-health-information",
      form: "vitals-tracker",
    },
    care_plan: { folder: "guides-checklists", form: "care-plan-checklists" },
    medical_template: {
      folder: "medical-appointment-templates",
      form: "medical-appointment-templates",
    },
  };

  const path = formTypeMap[entityType];

  if (entityType === "medical_template" && subtypeId) {
    return {
      folder: "medical-appointment-templates",
      form: `medical-appointment-template_${subtypeId}`,
    };
  }

  return path;
};

const transformActivity = (
  activity: ActivityApiResponse
): ActivityFeedEvent & {
  client_id?: string;
  entity_type?: string;
  entity_id?: string;
  metadata?: { form_type?: string };
} => {
  const user_name =
    `${activity.user?.first_name || ""} ${
      activity.user?.last_name || ""
    }`.trim() || "System";
  const client_name =
    `${activity.client?.first_name || ""} ${
      activity.client?.last_name || ""
    }`.trim() || "Unknown";
  const timestamp = DateUtils.formatRelativeTime(activity.createdAt);

  return {
    id: activity.id,
    user_name,
    client_name,
    category: activity.category,
    description: activity.description,
    timestamp,
    createdAt: new Date(activity.createdAt),
    updatedAt: new Date(activity.updatedAt),
    client_id: activity.client_id,
    entity_type: activity.entity_type,
    entity_id: activity.entity_id,
    metadata: activity.metadata,
  };
};

const getCategoryIcon = (category: ActivityFeedEvent["category"]) => {
  switch (category) {
    case "medical":
      return ICONS.medicine;

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

    case "appointments":
      return "text-green-600";
    case "documents":
      return "text-primaryColor";
    default:
      return "text-slateGrey";
  }
};

const truncateName = (
  name: string | undefined,
  maxLength: number = 15
): string => {
  if (!name) return "";
  return name.length > maxLength ? name.substring(0, maxLength) + "..." : name;
};

export const ActivityFeed: React.FC = () => {
  const { isActivityFeedOpen, closeActivityFeed } = useActivityFeedContext();
  const { selectedClient } = useClientContext();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [isMounted, setIsMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useGetActivitiesQuery({
    client_id: selectedClient?.id ? String(selectedClient.id) : undefined,
    category: activeFilter === "all" ? undefined : activeFilter,
    limit: 20,
  });

  const allActivities = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) =>
      (page?.activities || []).map(transformActivity)
    );
  }, [data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (isActivityFeedOpen) {
      setShouldRender(true);
      setTimeout(() => setIsMounted(true), 10);
      refetch();
    } else {
      setIsMounted(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 350); // Match the animation duration (300ms + 50ms buffer)
      return () => clearTimeout(timer);
    }
  }, [isActivityFeedOpen]);

  useEffect(() => {
    if (isActivityFeedOpen) {
      refetch();
    }
  }, [activeFilter, selectedClient?.id, isActivityFeedOpen]);

  const filterTabs: { id: FilterCategory; label: string }[] = [
    { id: "all", label: "All" },
    { id: "documents", label: "Documents" },
    { id: "medical", label: "Medical" },
    { id: "appointments", label: "Appointments" },
  ];

  if (!shouldRender) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-darkGray/50 z-40 lg:hidden transition-opacity duration-350 ease-in-out ${
          isMounted ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeActivityFeed}
        aria-label="Close activity feed"
        role="button"
        tabIndex={isActivityFeedOpen ? 0 : -1}
      />

      <aside
        className={`fixed right-0 z-50 lg:z-30 bg-basicWhite border-l border-mediumGray flex flex-col activity-feed-container ${
          isMounted ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        } w-full max-w-sm lg:w-[22rem] lg:max-w-none`}
        style={{
          top: `0`,
          bottom: `0`,
          height: "100dvh",
          boxShadow: isMounted
            ? "0 0 1px rgba(0, 0, 0, 0.15)"
            : "0 0 0 rgba(0, 0, 0, 0)",
        }}
      >
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
            {isLoading ? (
              <div className="text-center text-slateGrey text-sm py-12">
                Loading activities...
              </div>
            ) : allActivities.length === 0 ? (
              <div className="text-center text-slateGrey text-sm py-12">
                No activities found
              </div>
            ) : (
              <>
                {allActivities.map((activity, index) => {
                  const Icon = getCategoryIcon(activity.category);
                  const bgColor = getCategoryColor(activity.category);
                  const iconColor = getCategoryIconColor(activity.category);

                  const handleActivityClick = () => {
                    const activityWithExtras = activity as ActivityFeedEvent & {
                      client_id?: string;
                      entity_type?: string;
                      entity_id?: string;
                      metadata?: { form_type?: string };
                    };
                    const entityType = activityWithExtras.entity_type;
                    const clientId =
                      activityWithExtras.client_id || selectedClient?.id;

                    if (!entityType) return;

                    // Handle form navigation
                    if (
                      entityType === "face_sheet_short" ||
                      entityType === "face_sheet_long" ||
                      entityType === "health_history" ||
                      entityType === "initial_care_plan" ||
                      entityType === "comprehensive_care_plan"
                    ) {
                      const formPath = getFormNavigationPath(
                        entityType,
                        activityWithExtras.entity_id
                      );
                      if (formPath && clientId && "folder" in formPath) {
                        if (formPath.form.includes("/")) {
                          const [parentFolder, formSlug] =
                            formPath.form.split("/");
                          navigate(
                            `/clients/${clientId}/${ROUTES.agensyFormsFolders}/${formPath.folder}/${parentFolder}/${formSlug}`
                          );
                        } else {
                          navigate(
                            `/clients/${clientId}/${ROUTES.agensyFormsFolders}/${formPath.folder}/${formPath.form}`
                          );
                        }
                        closeActivityFeed();
                      }
                    }
                    // Handle appointments
                    else if (entityType === "appointments") {
                      navigate(`${ROUTES.appointments}`);
                      closeActivityFeed();
                    }
                    // Handle medication and healthcare provider
                    else if (
                      entityType === "medication" ||
                      entityType === "healthcare_provider"
                    ) {
                      if (clientId) {
                        navigate(
                          `/${ROUTES.clients}/${clientId}/${ROUTES.clientMedical}`
                        );
                        closeActivityFeed();
                      }
                    }
                    // Handle documents
                    else if (entityType === "documents") {
                      if (clientId && activityWithExtras.entity_id) {
                        navigate(
                          `/${ROUTES.clients}/${clientId}/${ROUTES.clientDocuments}/${activityWithExtras.entity_id}`
                        );
                        closeActivityFeed();
                      }
                    }
                  };

                  const activityWithExtras = activity as ActivityFeedEvent & {
                    entity_type?: string;
                  };
                  const isClickable = !!activityWithExtras.entity_type;

                  return (
                    <div
                      key={activity.id}
                      className={`flex items-start gap-3 p-2 rounded-md transition-all duration-200 activity-feed-item ${
                        isClickable
                          ? "hover:bg-lightGray/50 cursor-pointer"
                          : "hover:bg-lightGray/50"
                      }`}
                      onClick={isClickable ? handleActivityClick : undefined}
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
                        <p className="text-sm text-darkGray leading-relaxed line-clamp-5 break-words">
                          {activity.description}
                        </p>
                        <p className="text-xs text-slateGrey mt-1 font-medium">
                          {truncateName(activity.client_name)}
                        </p>
                        <p className="text-xs text-slateGrey mt-0.5">
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {/* Intersection Observer Target */}
                <div ref={observerTarget} className="h-4" />
                {/* Loading More Indicator */}
                {isFetchingNextPage && (
                  <div className="text-center text-slateGrey text-sm py-4">
                    Loading more...
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default ActivityFeed;
