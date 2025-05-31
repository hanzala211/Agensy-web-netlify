import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "@agensy/constants";
import { AuthLayout, AppLayout } from "@agensy/layouts";
import {
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  VerifyEmail,
  Dashboard,
  LoadingScreen,
  Clients,
  ClientProfile,
  ClientMedical,
  ClientOverview,
  DocumentPreview,
  Documents,
  ClientDocuments,
  DocumentsManager,
  ClientAccess,
  AppointmentsManager,
  AppointmentsCalendar,
  AppointmentsList,
  Settings,
  ProfileSettings,
} from "@agensy/pages";
import { useAuthContext } from "@agensy/context";

export const Routes: React.FC = () => {
  const { isAuthLoading } = useAuthContext();

  if (isAuthLoading) return <LoadingScreen />;

  return (
    <RouterRoutes>
      <Route path={ROUTES.auth} element={<AuthLayout />}>
        <Route path={ROUTES.login} element={<Login />} />
        <Route path={ROUTES.register} element={<Register />} />
        <Route path={ROUTES.forgotPassword} element={<ForgotPassword />} />
        <Route path={ROUTES.resetPassword} element={<ResetPassword />} />
        <Route path={ROUTES.verifyEmail} element={<VerifyEmail />} />
      </Route>

      <Route path="/" element={<AppLayout />}>
        <Route path="*" element={<Navigate to="/" />} />
        <Route index element={<Dashboard />} />
        <Route path={ROUTES.documents} element={<Documents />}>
          <Route index element={<DocumentsManager />} />
          <Route
            path={`${ROUTES.documents}/:documentId`}
            element={<DocumentPreview />}
          />
        </Route>

        <Route path={ROUTES.appointments} element={<AppointmentsManager />}>
          <Route index element={<AppointmentsCalendar />} />
          <Route
            path={ROUTES.appointmentsList}
            element={<AppointmentsList />}
          />
        </Route>

        <Route path={ROUTES.settings} element={<Settings />}>
          <Route index element={<ProfileSettings />} />
        </Route>

        <Route path={ROUTES.clients} element={<Clients />} />

        <Route path={`${ROUTES.clients}/:clientId`} element={<ClientProfile />}>
          <Route path={ROUTES.clientOverview} element={<ClientOverview />} />
          <Route path={ROUTES.clientMedical} element={<ClientMedical />} />
          <Route path={ROUTES.clientDocuments} element={<ClientDocuments />} />
          <Route
            path={`${ROUTES.clientDocuments}/:documentId`}
            element={<DocumentPreview />}
          />
          <Route path={ROUTES.access} element={<ClientAccess />} />
        </Route>
      </Route>
    </RouterRoutes>
  );
};

export default Routes;
