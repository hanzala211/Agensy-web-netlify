import { Sidebar, MobileNav } from "@agensy/components";
import { Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "@agensy/constants";
import { useAuthContext } from "@agensy/context";
import { useEffect } from "react";

export const AppLayout: React.FC = () => {
  const { userData } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isSubscriptionPage = location.pathname.includes(
      ROUTES.profileSubscription
    );
    if (userData?.subscription_status === "inactive" && !isSubscriptionPage) {
      navigate(`${ROUTES.settings}`);
    }
  }, [userData, location.pathname]);

  if (!userData) return <Navigate to={`${ROUTES.auth}/${ROUTES.login}`} />;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MobileNav />

      <div className="flex flex-1">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="flex-1 transition-all duration-300">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
