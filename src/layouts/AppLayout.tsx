import { Sidebar, MobileNav } from "@agensy/components";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@agensy/constants";
import { useAuthContext } from "@agensy/context";

export const AppLayout: React.FC = () => {
  const { userData } = useAuthContext();

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
