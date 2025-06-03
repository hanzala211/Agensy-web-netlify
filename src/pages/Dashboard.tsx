import React from "react";
import {
  WelcomeDashboardCard,
  ClientsDashboardCard,
  AppointmentsDashboardCard,
  MessagesDashboardCard,
  DocumentsDashboardCard,
  DashboardWidget,
} from "@agensy/components";
import { ICONS } from "@agensy/constants";

export const Dashboard: React.FC = () => {
  return (
    <div className="overflow-y-auto py-6 h-[100dvh] max-h-[calc(100dvh-50px)] md:max-h-[100dvh]">
      <div className="space-y-6 2xl:max-w-[90%] xl:max-w-5xl lg:max-w-3xl md:max-w-[33rem] max-w-[90%] mx-auto">
        <WelcomeDashboardCard />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <DashboardWidget
            title="Total Clients"
            value="248"
            icon={<ICONS.users color="gray" />}
          />
          <DashboardWidget
            title="Upcoming Appointments"
            value="1"
            icon={<ICONS.calendar color="gray" />}
          />
          <DashboardWidget
            title="Total Documents"
            value="6"
            icon={<ICONS.document color="gray" />}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ClientsDashboardCard />
          <AppointmentsDashboardCard />
          <MessagesDashboardCard />
          <DocumentsDashboardCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
