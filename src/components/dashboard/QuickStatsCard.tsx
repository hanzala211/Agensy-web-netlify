import React from "react";
import { Card, DashboardWidget } from "@agensy/components";
import {
  ICONS,
  DASHBOARD_CLIENT_STATS,
  DASHBOARD_TODAYS_APPOINTMENTS,
  DASHBOARD_RECENT_MESSAGES,
  DASHBOARD_RECENT_DOCUMENTS,
} from "@agensy/constants";

export const QuickStatsCard: React.FC<{ className?: string }> = ({
  className,
}) => {
  const {
    activeClients,
    deactivatedClients,
    upcomingAppointments,
    unreadMessages,
    recentDocuments,
    todaysAppointments,
  } = DASHBOARD_CLIENT_STATS;

  const now = new Date();
  const upcomingCount = DASHBOARD_TODAYS_APPOINTMENTS.filter((appt) => {
    if (!appt.active) return false;
    const startTime = new Date(appt.start_time);
    return startTime > now;
  }).length;

  const actualUnreadCount = DASHBOARD_RECENT_MESSAGES.reduce(
    (total, thread) => {
      return total + (thread.unread_count || 0);
    },
    0
  );

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentDocsCount = DASHBOARD_RECENT_DOCUMENTS.filter((doc) => {
    const docDate = new Date(doc.createdAt);
    return docDate >= sevenDaysAgo;
  }).length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setDate(todayEnd.getDate() + 1);
  const todaysCount = DASHBOARD_TODAYS_APPOINTMENTS.filter((appt) => {
    const apptDate = new Date(appt.start_time);
    apptDate.setHours(0, 0, 0, 0);
    return (
      apptDate.getTime() >= today.getTime() &&
      apptDate.getTime() < todayEnd.getTime() &&
      appt.active
    );
  }).length;

  return (
    <Card
      title="Quick Stats"
      className={`border-gray-300 ${className}`}
      showButton={false}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DashboardWidget
          title="Active Clients"
          value={activeClients}
          icon={<ICONS.users className="text-blue-500" size={32} />}
        />
        <DashboardWidget
          title="Deactivated Clients"
          value={deactivatedClients}
          icon={<ICONS.users className="text-orange-500" size={32} />}
        />
        <DashboardWidget
          title="Upcoming Appointments"
          value={upcomingCount || upcomingAppointments}
          icon={<ICONS.calendar className="text-green-500" size={32} />}
        />
        <DashboardWidget
          title="Unread Messages"
          value={actualUnreadCount || unreadMessages}
          icon={<ICONS.messageIcon className="text-purple-500" size={32} />}
        />
        <DashboardWidget
          title="Recent Documents"
          value={recentDocsCount || recentDocuments}
          icon={<ICONS.document className="text-indigo-500" size={32} />}
        />
        <DashboardWidget
          title="Today's Appointments"
          value={todaysCount || todaysAppointments}
          icon={<ICONS.clockCircle className="text-red-500" size={32} />}
        />
      </div>
    </Card>
  );
};

export default QuickStatsCard;
