import { PageHeader, TabLink } from "@agensy/components";
import { ROLES, ROUTES } from "@agensy/constants";
import { useAuthContext } from "@agensy/context";
import { Outlet } from "react-router-dom";

export const Settings = () => {
  const { userData } = useAuthContext();
  const isNotAdmin =
    userData?.Roles?.find((item) => item.role === ROLES.ADMIN)?.role !==
    ROLES.ADMIN;
  return (
    <div className="overflow-y-auto h-[100dvh] max-h-[calc(100dvh-50px)] md:max-h-[calc(100dvh)] w-full px-4 py-6">
      <PageHeader
        className={`mb-2`}
        title="Settings"
        showBackButton={false}
        showButton={false}
      />

      <div className="border-[1px] border-mediumGray px-2 sm:px-5 rounded-xl mt-4">
        <div className="flex flex-wrap md:flex-nowrap border-b border-mediumGray w-full">
          <TabLink to={`${ROUTES.settings}`} end>
            Profile
          </TabLink>
          {isNotAdmin && (
            <TabLink to={`${ROUTES.settings}/${ROUTES.profileSubscription}`}>
              Billing
            </TabLink>
          )}
        </div>
      </div>
      <div className={`mt-4`}>
        <Outlet />
      </div>
    </div>
  );
};

export default Settings;
