import {
  Sidebar,
  AppHeader,
  HEADER_HEIGHT_PX,
  ActivityFeed,
} from "@agensy/components";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@agensy/constants";
import {
  useAuthContext,
  HeaderProvider,
  ActivityFeedProvider,
} from "@agensy/context";

export const AppLayout: React.FC = () => {
  const { userData } = useAuthContext();

  if (!userData) return <Navigate to={`${ROUTES.auth}/${ROUTES.login}`} />;

  return (
    <HeaderProvider>
      <ActivityFeedProvider>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <AppHeader />

          <div
            className="flex flex-1 relative"
            style={{ marginTop: `${HEADER_HEIGHT_PX}px` }}
          >
            <div className="hidden lg:block">
              <Sidebar />
            </div>

            <div className="flex-1 transition-all duration-300">
              <Outlet />
            </div>

            <ActivityFeed />
          </div>
        </div>
      </ActivityFeedProvider>
    </HeaderProvider>
  );
};

export default AppLayout;
