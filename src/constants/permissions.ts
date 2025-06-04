import { APP_ACTIONS } from "./app_action";

export const PERMISSIONS = {
  primary_user: [
    APP_ACTIONS.BillingPage,
    APP_ACTIONS.EditClientBasicInfo,
    APP_ACTIONS.EditClientMedicalInfo,
    APP_ACTIONS.EditClientNotes,
    APP_ACTIONS.DeleteDocs,
    APP_ACTIONS.AddClient,
    APP_ACTIONS.AccessControl,
    APP_ACTIONS.ClientAppointmentInfoEdit,
    APP_ACTIONS.ChangeClientStatus,
    APP_ACTIONS.AddDocs,
  ],
  caregiver: [
    APP_ACTIONS.EditClientMedicalInfo,
    APP_ACTIONS.ClientAppointmentInfoEdit,
  ],
  family_admin: [""],
};
