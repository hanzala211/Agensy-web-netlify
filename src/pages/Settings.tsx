import { PageHeader, TabLink } from "@agensy/components";
import { ROUTES } from "@agensy/constants";
import { Outlet } from "react-router-dom";

export const Settings = () => {
  return (
    <div className="overflow-y-auto h-[100dvh] max-h-[calc(100dvh-50px)] md:max-h-[calc(100dvh)] w-full px-4 py-6">
      <PageHeader title="Settings" showBackButton={false} showButton={false} />

      <div className="border-[1px] border-mediumGray px-2 sm:px-5 rounded-xl mt-4">
        <div className="flex flex-wrap md:flex-nowrap border-b border-mediumGray w-full">
          <TabLink to={`${ROUTES.settings}`} end>
            Profile
          </TabLink>
          <TabLink to={`${ROUTES.settings}/${ROUTES.profileNotifications}`}>
            Notifications
          </TabLink>
          <TabLink to={`${ROUTES.settings}/${ROUTES.profileSubscription}`}>
            Subscription
          </TabLink>
        </div>
      </div>
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Settings;
