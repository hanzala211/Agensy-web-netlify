import { ROUTES } from "@agensy/constants";

export const getPageTitle = (pathname: string): string => {
  // Remove query params and trailing slashes
  const cleanPath = pathname.split("?")[0].replace(/\/$/, "") || "/";

  // Dashboard
  if (cleanPath === "/") return "Dashboard";

  // Clients
  if (cleanPath === `/${ROUTES.clients}`) return "Care Recipients";
  if (
    cleanPath.includes(`/${ROUTES.clients}/`) &&
    cleanPath.includes(ROUTES.clientOverview)
  ) {
    return "Overview";
  }
  if (
    cleanPath.includes(`/${ROUTES.clients}/`) &&
    cleanPath.includes(ROUTES.clientMedical)
  ) {
    return "Medical";
  }
  if (
    cleanPath.includes(`/${ROUTES.clients}/`) &&
    cleanPath.includes(ROUTES.clientDocuments)
  ) {
    if (cleanPath.includes("/:documentId")) {
      return "Document Preview";
    }
    return "Documents";
  }
  if (
    cleanPath.includes(`/${ROUTES.clients}/`) &&
    cleanPath.includes(ROUTES.access)
  ) {
    return "Access";
  }
  if (
    cleanPath.includes(`/${ROUTES.clients}/`) &&
    cleanPath.includes(ROUTES.clientMessages)
  ) {
    return "Messages";
  }
  if (
    cleanPath.includes(`/${ROUTES.clients}/`) &&
    cleanPath.includes(ROUTES.agensyFormsFolders)
  ) {
    return "Agensy Forms";
  }
  if (
    cleanPath.includes(`/${ROUTES.clients}/`) &&
    cleanPath.includes(ROUTES.logs)
  ) {
    return "Logs";
  }
  if (cleanPath.includes(`/${ROUTES.clients}/`)) {
    // Generic client profile page
    return "Care Recipient Profile";
  }

  // Documents
  if (cleanPath === ROUTES.documents) return "Documents";
  if (
    cleanPath.includes(`${ROUTES.documents}/`) &&
    !cleanPath.endsWith(ROUTES.documents)
  ) {
    return "Document Preview";
  }

  // Appointments
  if (
    cleanPath === ROUTES.appointments ||
    cleanPath.includes(ROUTES.appointmentsCalendar)
  ) {
    return "Appointments";
  }
  if (cleanPath.includes(ROUTES.appointmentsList)) {
    return "Appointments";
  }

  // Messages
  if (
    cleanPath === ROUTES.messages ||
    cleanPath.includes(`${ROUTES.messages}/`)
  ) {
    return "Messages";
  }

  // Settings
  if (cleanPath === ROUTES.settings) return "Settings";
  if (cleanPath.includes(ROUTES.profileSubscription)) {
    return "Subscription & Billing";
  }

  // Templates
  if (cleanPath.includes(ROUTES.templates)) {
    return "Templates";
  }

  // Default
  return "Dashboard";
};
