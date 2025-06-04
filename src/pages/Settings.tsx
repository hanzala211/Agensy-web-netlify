import { ErrorMessage, PageHeader, TabLink } from "@agensy/components";
import { APP_ACTIONS, PERMISSIONS, ROUTES } from "@agensy/constants";
import { useAuthContext } from "@agensy/context";
import { Outlet } from "react-router-dom";

export const Settings = () => {
  const { userData } = useAuthContext();
  const userPermissions =
    PERMISSIONS[userData?.role as keyof typeof PERMISSIONS] || [];

  return (
    <div className="overflow-y-auto h-[100dvh] max-h-[calc(100dvh-50px)] md:max-h-[calc(100dvh)] w-full px-4 py-6">
      <PageHeader title="Settings" showBackButton={false} showButton={false} />
      {!userPermissions.includes(APP_ACTIONS.BillingPage) &&
        userData?.subscription_status === "inactive" && (
          <ErrorMessage error="Your family admin has not activated the plan" />
        )}

      <div className="border-[1px] border-mediumGray px-2 sm:px-5 rounded-xl mt-4">
        <div className="flex flex-wrap md:flex-nowrap border-b border-mediumGray w-full">
          <TabLink to={`${ROUTES.settings}`} end>
            Profile
          </TabLink>
          {userPermissions.includes(APP_ACTIONS.BillingPage) && (
            <TabLink to={`${ROUTES.settings}/${ROUTES.profileSubscription}`}>
              Billing
            </TabLink>
          )}
        </div>
      </div>
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Settings;
