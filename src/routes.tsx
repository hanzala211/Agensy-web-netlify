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
  PaymentStatus,
  Subscription,
  Messages,
  ChatPage,
  ClientMessages,
} from "@agensy/pages";
import { useAuthContext } from "@agensy/context";
import { AgensyForms } from "./pages/AgensyForms";
import { ClientLogs } from "./pages/ClientLogs";
import { TermsAndConditions } from "./pages/TermsAndConditions";
import { PrivacyAndPolicy } from "./pages/PrivacyAndPolicy";

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
      <Route
        path={`/${ROUTES.termsAndConditions}`}
        element={<TermsAndConditions />}
      />
      <Route path={`/${ROUTES.privacyPolicy}`} element={<PrivacyAndPolicy />} />

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
          <Route path={ROUTES.profileSubscription} element={<Subscription />} />
        </Route>

        <Route path={ROUTES.clients} element={<Clients />} />
        <Route path={ROUTES.messages} element={<Messages />}>
          <Route path={`${ROUTES.messages}/:threadId`} element={<ChatPage />} />
        </Route>
        <Route
          path={`${ROUTES.profileSubscription}/${ROUTES.paymentStatus}`}
          element={<PaymentStatus />}
        />

        <Route path={`${ROUTES.clients}/:clientId`} element={<ClientProfile />}>
          <Route path={ROUTES.clientOverview} element={<ClientOverview />} />
          <Route path={ROUTES.clientMedical} element={<ClientMedical />} />
          <Route path={ROUTES.clientDocuments} element={<ClientDocuments />} />
          <Route
            path={`${ROUTES.clientDocuments}/:documentId`}
            element={<DocumentPreview />}
          />
          <Route path={ROUTES.access} element={<ClientAccess />} />
          <Route path={ROUTES.clientMessages} element={<ClientMessages />}>
            <Route path={`:threadId`} element={<ChatPage />} />
          </Route>
          <Route path={ROUTES.agensyFormsFolders} element={<AgensyForms />} />
          <Route path={ROUTES.agensyFormsForms} element={<AgensyForms />} />
          <Route path={ROUTES.agensyFormsForm} element={<AgensyForms />} />
          <Route path={ROUTES.logs} element={<ClientLogs />} />
        </Route>
      </Route>
    </RouterRoutes>
  );
};

export default Routes;
