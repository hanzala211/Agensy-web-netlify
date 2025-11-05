import React from "react";
import { Card, DashboardWidget } from "@agensy/components";
import { ICONS } from "@agensy/constants";

interface QuickStatsCardProps {
  className?: string;
  quickStats?: {
    activeClients: number;
    deactivatedClients: number;
    upcomingAppointments: number;
    unreadMessages: number;
    recentDocuments: number;
    todayAppointments: number;
  };
}

export const QuickStatsCard: React.FC<QuickStatsCardProps> = ({
  className,
  quickStats,
}) => {
  if (!quickStats) {
    return null;
  }

  const {
    activeClients,
    deactivatedClients,
    upcomingAppointments,
    unreadMessages,
    recentDocuments,
    todayAppointments,
  } = quickStats;

  return (
    <Card
      title="Quick Stats"
      className={`border-gray-300 ${className}`}
      showButton={false}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DashboardWidget
          title="Active Care Recipients"
          value={activeClients}
          icon={<ICONS.users className="text-blue-500" size={22} />}
        />
        <DashboardWidget
          title="Inactive Care Recipients"
          value={deactivatedClients}
          icon={<ICONS.users className="text-orange-500" size={22} />}
        />
        <DashboardWidget
          title="Upcoming Appointments"
          value={upcomingAppointments}
          icon={<ICONS.calendar className="text-green-500" size={22} />}
        />
        <DashboardWidget
          title="Unread Messages"
          value={unreadMessages}
          icon={<ICONS.messageIcon className="text-purple-500" size={22} />}
        />
        <DashboardWidget
          title="Recent Documents"
          value={recentDocuments}
          icon={<ICONS.document className="text-indigo-500" size={22} />}
        />
        <DashboardWidget
          title="Today's Appointments"
          value={todayAppointments}
          icon={<ICONS.clockCircle className="text-red-500" size={22} />}
        />
      </div>
    </Card>
  );
};

export default QuickStatsCard;
