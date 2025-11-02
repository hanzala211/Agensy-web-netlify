import React, { useEffect } from "react";
import {
  TodaysAppointmentsCard,
  RecentMessagesCard,
  QuickStatsCard,
  QuickAccessCareRecipientsCard,
  RecentDocumentsCard,
} from "@agensy/components";
import { useHeaderContext } from "@agensy/context";

export const Dashboard: React.FC = () => {
  const { setHeaderConfig } = useHeaderContext();

  useEffect(() => {
    setHeaderConfig({
      title: "Dashboard",
      showBackButton: false,
      showButton: false,
    });
  }, []);

  return (
    <div className="overflow-y-auto py-6 h-[100dvh] max-h-[calc(100dvh-75px)]">
      <div className="space-y-4 xl:max-w-[95%] lg:max-w-3xl max-w-[90%] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <TodaysAppointmentsCard />
          <RecentMessagesCard />
          <QuickStatsCard className="md:col-span-2 xl:col-span-1" />
        </div>

        <QuickAccessCareRecipientsCard />

        <RecentDocumentsCard />
      </div>
    </div>
  );
};

export default Dashboard;
