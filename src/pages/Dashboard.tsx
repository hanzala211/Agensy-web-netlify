import React, { useEffect } from "react";
import {
  TodaysAppointmentsCard,
  RecentMessagesCard,
  QuickStatsCard,
  QuickAccessCareRecipientsCard,
  RecentDocumentsCard,
  CardSkeleton,
} from "@agensy/components";
import { useHeaderContext } from "@agensy/context";
import { useGetDashboardData } from "@agensy/api";

export const Dashboard: React.FC = () => {
  const { setHeaderConfig } = useHeaderContext();
  const {
    data: dashboardData,
    isLoading,
    isError,
    refetch,
  } = useGetDashboardData();

  useEffect(() => {
    refetch();
    setHeaderConfig({
      title: "Dashboard",
      showBackButton: false,
      showButton: false,
    });
  }, []);

  if (isLoading) {
    return (
      <div className="overflow-y-auto py-6 h-[100dvh] max-h-[calc(100dvh-75px)]">
        <div className="space-y-4 xl:max-w-[95%] lg:max-w-3xl max-w-[90%] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <CardSkeleton rows={3} />
            <CardSkeleton rows={3} />
            <CardSkeleton rows={6} className="md:col-span-2 xl:col-span-1" />
          </div>
          <CardSkeleton rows={4} />
          <CardSkeleton rows={3} />
        </div>
      </div>
    );
  }

  if (isError || !dashboardData) {
    return (
      <div className="overflow-y-auto py-6 h-[100dvh] max-h-[calc(100dvh-75px)]">
        <div className="space-y-4 xl:max-w-[95%] lg:max-w-3xl max-w-[90%] mx-auto">
          <div className="text-center text-gray-500 py-8">
            Failed to load dashboard data. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto py-6 h-[100dvh] max-h-[calc(100dvh-75px)]">
      <div className="space-y-4 xl:max-w-[95%] lg:max-w-3xl max-w-[90%] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <TodaysAppointmentsCard
            appointments={dashboardData.todayAppointments || []}
          />
          <RecentMessagesCard messages={dashboardData.recentMessages || []} />
          <QuickStatsCard
            quickStats={dashboardData.quickStats}
            className="md:col-span-2 xl:col-span-1"
          />
        </div>

        <QuickAccessCareRecipientsCard
          clients={dashboardData.quickAccessClients || []}
        />

        <RecentDocumentsCard documents={dashboardData.recentDocuments || []} />
      </div>
    </div>
  );
};

export default Dashboard;
