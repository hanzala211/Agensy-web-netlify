import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  ICONS,
  ACTIVITY_ACTIONS,
  ENTITY_TYPES,
  FORM_TYPE_OPTIONS,
} from "@agensy/constants";
import { HEADER_HEIGHT_PX } from "@agensy/components";
import {
  useActivityFeedContext,
  useClientContext,
  useSocketContext,
  useAuthContext,
} from "@agensy/context";
import { useGetActivitiesQuery } from "@agensy/api";
import { DateUtils } from "@agensy/utils";
import type { ActivityFeedEvent, FilterCategory } from "@agensy/types";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@agensy/constants";
import { useQueryClient } from "@tanstack/react-query";

interface ActivityApiResponse {
  id: string;
  client_id?: string;
  entity_type?: string;
  entity_id?: string;
  metadata?: {
    form_type?: string;
    start_time?: string | null;
    appointment_type?: string;
    [key: string]: unknown;
  };
  user?: {
    first_name?: string;
    last_name?: string;
    id?: string;
    avatar?: string;
    email?: string;
  };
  client?: {
    first_name?: string;
    last_name?: string;
    id?: string;
  };
  category: "medical" | "appointments" | "documents";
  action_type?: string;
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
  action_type?: string;
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
    action_type: activity.action_type,
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

const getActionTypeColor = (actionType?: string) => {
  if (!actionType) return "bg-lightGray";

  switch (actionType.toLowerCase()) {
    case ACTIVITY_ACTIONS.CREATED:
      return "bg-green-100";
    case ACTIVITY_ACTIONS.UPDATED:
      return "bg-blue-100";
    case ACTIVITY_ACTIONS.DELETED:
      return "bg-red-100";
    case ACTIVITY_ACTIONS.CANCELLED:
      return "bg-orange-100";
    default:
      return "bg-lightGray";
  }
};

const getActionTypeIconColor = (actionType?: string) => {
  if (!actionType) return "text-slateGrey";

  switch (actionType.toLowerCase()) {
    case ACTIVITY_ACTIONS.CREATED:
      return "text-green-600";
    case ACTIVITY_ACTIONS.UPDATED:
      return "text-blue-600";
    case ACTIVITY_ACTIONS.DELETED:
      return "text-red-600";
    case ACTIVITY_ACTIONS.CANCELLED:
      return "text-orange-600";
    default:
      return "text-slateGrey";
  }
};

const getEntityTypeLabel = (
  entityType?: string,
  category?: "medical" | "appointments" | "documents"
): string => {
  if (entityType) {
    const formOption = FORM_TYPE_OPTIONS.find(
      (option) => option.value === entityType
    );
    if (formOption) {
      return formOption.label;
    }

    const entityLabelMap: Record<string, string> = {
      [ENTITY_TYPES.APPOINTMENTS]: "Appointment",
      [ENTITY_TYPES.DOCUMENTS]: "Document",
      [ENTITY_TYPES.MEDICATION]: "Medication",
      [ENTITY_TYPES.HEALTHCARE_PROVIDER]: "Healthcare Provider",
      [ENTITY_TYPES.FACE_SHEET_SHORT]: "Face Sheet Short",
      [ENTITY_TYPES.FACE_SHEET_LONG]: "Face Sheet Long",
      [ENTITY_TYPES.HEALTH_HISTORY]: "Health History",
      [ENTITY_TYPES.INITIAL_CARE_PLAN]: "Initial Care Plan",
      [ENTITY_TYPES.COMPREHENSIVE_CARE_PLAN]: "Comprehensive Care Plan",
    };

    if (entityLabelMap[entityType]) {
      return entityLabelMap[entityType];
    }

    return entityType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  if (category) {
    const categoryLabelMap: Record<string, string> = {
      medical: "Medical",
      appointments: "Appointment",
      documents: "Document",
    };
    return (
      categoryLabelMap[category] ||
      category.charAt(0).toUpperCase() + category.slice(1)
    );
  }

  return "";
};

const getActivityTitle = (
  entityType?: string,
  actionType?: string,
  category?: "medical" | "appointments" | "documents"
): string | null => {
  const entityLabel = getEntityTypeLabel(entityType, category);

  if (!entityLabel) {
    return null;
  }

  if (actionType) {
    const normalizedActionType = actionType.toLowerCase();

    // Special cases for created actions
    if (normalizedActionType === ACTIVITY_ACTIONS.CREATED.toLowerCase()) {
      if (
        entityType === ENTITY_TYPES.APPOINTMENTS ||
        category === "appointments"
      ) {
        return "Appointment Scheduled";
      }
      if (entityType === ENTITY_TYPES.DOCUMENTS || category === "documents") {
        return "Document Uploaded";
      }
      if (entityType === ENTITY_TYPES.MEDICATION) {
        return "Medication Added";
      }
      if (entityType === ENTITY_TYPES.HEALTHCARE_PROVIDER) {
        return "Health Care Provider Added";
      }
    }

    const capitalizedActionType =
      actionType.charAt(0).toUpperCase() + actionType.slice(1);
    return `${entityLabel} ${capitalizedActionType}`;
  }

  return entityLabel;
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
  const { selectedClient, selectedClientId } = useClientContext();
  const { clients: authClients } = useAuthContext();
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [isMounted, setIsMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const params = useParams();
  const observerTarget = useRef<HTMLDivElement>(null);

  const clientIdForQuery =
    selectedClientId || (params.clientId ? String(params.clientId) : undefined);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useGetActivitiesQuery({
    client_id: clientIdForQuery,
    category: activeFilter === "all" ? undefined : activeFilter,
    limit: 50,
  });

  // Get the client to display - use selectedClient from context or find from authClients
  const displayClient = useMemo(() => {
    if (selectedClient) return selectedClient;
    if (selectedClientId && authClients) {
      return authClients.find(
        (client) => client?.id?.toString() === selectedClientId
      );
    }
    return null;
  }, [selectedClient, selectedClientId, authClients]);

  const allActivities = useMemo(() => {
    if (!data?.pages) return [];
    const transformed = data.pages.flatMap((page) =>
      (page?.activities || []).map(transformActivity)
    );

    // Filter by selectedClientId if present
    if (selectedClientId) {
      return transformed.filter(
        (activity) => activity.client_id?.toString() === selectedClientId
      );
    }

    return transformed;
  }, [data, selectedClientId]);

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
  }, [activeFilter, selectedClientId, isActivityFeedOpen, refetch]);

  useEffect(() => {
    if (socket) {
      const handleActivityFeedUpdate = (activityData: unknown) => {
        console.log("🟢 [SOCKET] Activity feed update received:", activityData);

        const activity = activityData as ActivityApiResponse;

        if (!activity?.id || !activity?.category || !activity?.createdAt) {
          return;
        }

        const normalizedActivity: ActivityApiResponse = {
          ...activity,
          user: activity.user || {},
          client: activity.client || {},
        };

        const queryCache = queryClient.getQueryCache();
        const allQueries = queryCache.getAll();

        const activityQueries = allQueries.filter((query) => {
          const queryKey = query.queryKey;
          return (
            Array.isArray(queryKey) &&
            queryKey[0] === "activities" &&
            queryKey[1]
          );
        });

        activityQueries.forEach((query) => {
          const params = query.queryKey[1] as {
            client_id?: string;
            category?: "medical" | "messages" | "appointments" | "documents";
            limit?: number;
            entity_type?: string;
          };

          const matchesClient =
            !params.client_id ||
            String(normalizedActivity.client_id) === String(params.client_id);
          const matchesCategory =
            !params.category || normalizedActivity.category === params.category;

          if (matchesClient && matchesCategory) {
            const currentData = queryClient.getQueryData<{
              pages: Array<{
                pagination: {
                  page: number;
                  limit: number;
                  total: number;
                  totalPages: number;
                };
                activities: ActivityApiResponse[];
              }>;
              pageParams: unknown[];
            }>(query.queryKey);

            if (currentData?.pages && currentData.pages.length > 0) {
              const exists = currentData.pages.some((page) =>
                page.activities.some((a) => a.id === normalizedActivity.id)
              );

              if (exists) {
                console.log(
                  `⚠️ [SOCKET] Activity ${normalizedActivity.id} already exists in cache, skipping.`
                );
                return;
              }

              console.log(
                `🟢 [SOCKET] Updating query cache for query:`,
                query.queryKey
              );

              const firstPage = { ...currentData.pages[0] };
              const existingActivities = [...firstPage.activities];

              const updatedActivities = [
                normalizedActivity,
                ...existingActivities,
              ];

              const limit = params.limit || 20;
              const limitedActivities =
                updatedActivities.length > limit
                  ? updatedActivities.slice(0, limit)
                  : updatedActivities;

              const updatedFirstPage = {
                ...firstPage,
                activities: limitedActivities,
                pagination: {
                  ...firstPage.pagination,
                  total: firstPage.pagination.total + 1,
                },
              };

              queryClient.setQueryData(query.queryKey, {
                ...currentData,
                pages: [updatedFirstPage, ...currentData.pages.slice(1)],
              });
            } else {
              console.log(
                `⚠️ [SOCKET] Query data doesn't exist yet for query:`,
                query.queryKey,
                "- Invalidating to trigger refetch"
              );
              queryClient.invalidateQueries({ queryKey: query.queryKey });
            }
          }
        });
      };

      socket.on("activityFeedUpdate", handleActivityFeedUpdate);

      return () => {
        socket.off("activityFeedUpdate", handleActivityFeedUpdate);
      };
    }
  }, [socket, queryClient]);

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
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-darkGray">
              Activity Feed
            </h2>
            {(params.clientId || selectedClientId) && displayClient && (
              <p className="text-sm text-slateGrey">
                <span className="font-semibold">Re:</span>{" "}
                {truncateName(
                  `${displayClient?.first_name} ${displayClient?.last_name}`
                )}
              </p>
            )}
          </div>

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
                  const activityWithExtras = activity as ActivityFeedEvent & {
                    client_id?: string;
                    entity_type?: string;
                    entity_id?: string;
                    metadata?: { form_type?: string };
                    action_type?: string;
                  };
                  const bgColor = getActionTypeColor(
                    activityWithExtras.action_type
                  );
                  const iconColor = getActionTypeIconColor(
                    activityWithExtras.action_type
                  );

                  const handleActivityClick = () => {
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
                        {(() => {
                          const activityTitle = getActivityTitle(
                            activityWithExtras.entity_type,
                            activityWithExtras.action_type,
                            activity.category
                          );
                          return activityTitle ? (
                            <p className="text-sm font-semibold text-darkGray mb-1">
                              {activityTitle}
                            </p>
                          ) : null;
                        })()}
                        <p className="text-sm text-darkGray leading-relaxed line-clamp-5 break-words">
                          {activity.description}
                        </p>
                        <p className="text-xs text-slateGrey mt-1 font-medium">
                          Re: {truncateName(activity.client_name)}
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
