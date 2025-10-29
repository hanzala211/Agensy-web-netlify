import { TabLink } from "@agensy/components";
import { ROLES, ROUTES } from "@agensy/constants";
import { useAuthContext, useHeaderContext } from "@agensy/context";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export const Settings = () => {
  const { setHeaderConfig } = useHeaderContext();
  const { userData } = useAuthContext();
  const isAdmin = userData?.role === ROLES.ADMIN;

  useEffect(() => {
    setHeaderConfig({
      showBackButton: false,
      showButton: false,
      title: "Settings",
    });
  }, []);
  return (
    <div className="overflow-y-auto h-[100dvh] max-h-[calc(100dvh-75px)] w-full px-4 py-6 pt-0">
      <div
        className={`${
          isAdmin ? "" : "border-[1px] border-mediumGray mt-4"
        } px-2 sm:px-5 rounded-md `}
      >
        <div
          className={`${
            isAdmin ? "hidden" : "flex border-b border-mediumGray"
          } flex-wrap md:flex-nowrap w-full`}
        >
          <TabLink to={`${ROUTES.settings}`} end>
            Profile
          </TabLink>
          {!isAdmin && (
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
