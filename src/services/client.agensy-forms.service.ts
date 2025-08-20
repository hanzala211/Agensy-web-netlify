import { sendRequest } from "@agensy/utils";

export const getFaceSheetShortForm = async (clientId: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/client/${clientId}/agensy-forms/face-sheet-short`,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [getFaceSheetShortForm] error: ${error}`
    );
    throw error;
  }
};

export const postFaceSheetShortForm = async (
  clientId: string,
  data: unknown
) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/client/${clientId}/agensy-forms/face-sheet-short`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [postFaceSheetShortForm] error: ${error}`
    );
    throw error;
  }
};

export const getFaceSheetLongForm = async (clientId: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/client/${clientId}/agensy-forms/face-sheet-long`,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [getFaceSheetLongForm] error: ${error}`
    );
    throw error;
  }
};

export const postFaceSheetLongForm = async (
  clientId: string,
  data: unknown
) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/client/${clientId}/agensy-forms/face-sheet-long`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [postFaceSheetLongForm] error: ${error}`
    );
    throw error;
  }
};

export const getHealthHistoryForm = async (clientId: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/client/${clientId}/agensy-forms/health-history`,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [getHealthHistoryForm] error: ${error}`
    );
    throw error;
  }
};

export const postHealthHistoryForm = async (
  clientId: string,
  data: unknown
) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/client/${clientId}/agensy-forms/health-history`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [postHealthHistoryForm] error: ${error}`
    );
    throw error;
  }
};

export const getChecklistsForms = async (param: string, clientId: string) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/client/${clientId}/agensy-forms/checklists/${param}`,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [getChecklistsForms] error: ${error}`
    );
    throw error;
  }
};

export const postChecklistForms = async (
  param: string,
  clientId: string,
  data: unknown
) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/client/${clientId}/agensy-forms/checklists/${param}`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [postChecklistForms] error: ${error}`
    );
    throw error;
  }
};

export const getEssentialDocumentsForAging = async (clientId: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/client/${clientId}/agensy-forms/essential-documents`,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [getEssentialDocumentsForAging] error: ${error}`
    );
    throw error;
  }
};

export const postEssentialDocumentsForAging = async (
  clientId: string,
  data: unknown
) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/client/${clientId}/agensy-forms/essential-documents`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [postEssentialDocumentsForAging] error: ${error}`
    );
    throw error;
  }
};

export const getCareRecipientQuestionnaire = async (clientId: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/client/${clientId}/agensy-forms/care-recipient-questionnaire`,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [getCareRecipientQuestionnaire] error: ${error}`
    );
    throw error;
  }
};

export const postCareRecipientQuestionaire = async (
  clientId: string,
  data: unknown
) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/client/${clientId}/agensy-forms/care-recipient-questionnaire`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [postCareRecipientQuestionaire] error: ${error}`
    );
    throw error;
  }
};

export const getClientCareGiverInformation = async (clientId: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/client/${clientId}/agensy-forms/caregiver-information-sheet`,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [getClientCareGiverInformation] error: ${error}`
    );
    throw error;
  }
};

export const postClientCaregiverInformation = async (
  clientId: string,
  data: unknown
) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/client/${clientId}/agensy-forms/caregiver-information-sheet`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [postClientCaregiverInformation] error: ${error}`
    );
    throw error;
  }
};

export const getMedicalAppointmentTemplate = async (clientId: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/client/${clientId}/agensy-forms/medical-template`,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [getMedicalAppointmentTemplate] error: ${error}`
    );
    throw error;
  }
};

export const postMedicalAppointmentTemplate = async (
  clientId: string,
  data: unknown
) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/client/${clientId}/agensy-forms/medical-template`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [postMedicalAppointmentTemplate] error: ${error}`
    );
    throw error;
  }
};

export const postInitialCareAssessmentPlan = async (
  clientId: string,
  data: unknown
) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/client/${clientId}/agensy-forms/initial-care-plan-assessment`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [postInitialCareAssessmentPlan] error: ${error}`
    );
    throw error;
  }
};

export const getInitialCareAssessmentPlan = async (clientId: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/client/${clientId}/agensy-forms/initial-care-plan-assessment`,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [getInitialCareAssessmentPlan] error: ${error}`
    );
    throw error;
  }
};

export const postComprehensiveCarePlan = async (
  clientId: string,
  data: unknown
) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/client/${clientId}/agensy-forms/comprehensive-care-plan-assessment`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [postComprehensiveCarePlan] error: ${error}`
    );
    throw error;
  }
};

export const getComprehensiveCarePlan = async (clientId: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/client/${clientId}/agensy-forms/comprehensive-care-plan-assessment`,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [postComprehensiveCarePlan] error: ${error}`
    );
    throw error;
  }
};

export const getBurialInstructions = async (clientId: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/client/${clientId}/agensy-forms/burial-instructions`,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [getBurialInstructions] error: ${error}`
    );
    throw error;
  }
};

export const postBurialInstructions = async (
  clientId: string,
  data: unknown
) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/client/${clientId}/agensy-forms/burial-instructions`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [postBurialInstructions] error: ${error}`
    );
    throw error;
  }
};

export const getPersonalInfo = async (clientId: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/client/${clientId}/agensy-forms/personal-info-password-manager`,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [getPersonalInfo] error: ${error}`
    );
    throw error;
  }
};

export const postPersonalInfo = async (clientId: string, data: unknown) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/client/${clientId}/agensy-forms/personal-info-password-manager`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [postPersonalInfo] error: ${error}`
    );
    throw error;
  }
};

export const getImportantPeopleInLife = async (clientId: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/client/${clientId}/agensy-forms/important-people`,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [getImportantPeopleInLife] error: ${error}`
    );
    throw error;
  }
};

export const postImportantPeopleInLife = async (
  clientId: string,
  data: unknown
) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/client/${clientId}/agensy-forms/important-people`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [postImportantPeopleInLife] error: ${error}`
    );
    throw error;
  }
};

export const getVitalsTrackerForm = async (clientId: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/client/${clientId}/agensy-forms/vitals-trackers`,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [getVitalsTrackerForm] error: ${error}`
    );
    throw error;
  }
};

export const postVitalsTracker = async (clientId: string, data: unknown) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/client/${clientId}/agensy-forms/vitals-trackers`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [postVitalsTracker] error: ${error}`
    );
    throw error;
  }
};

export const getLabsTracker = async (clientId: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/client/${clientId}/agensy-forms/labs-test-imaging-trackers`,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Agensy Forms Service [getLabsTracker] error: ${error}`);
    throw error;
  }
};

export const postLabsTracker = async (clientId: string, data: unknown) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/client/${clientId}/agensy-forms/labs-test-imaging-trackers`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [postVitalsTracker] error: ${error}`
    );
    throw error;
  }
};

export const getInPatientStayNotes = async (clientId: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/client/${clientId}/agensy-forms/in-patient-stay-notes`,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [getInPatientStayNotes] error: ${error}`
    );
    throw error;
  }
};

export const postInPatientStayNotes = async (
  clientId: string,
  data: unknown
) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/client/${clientId}/agensy-forms/in-patient-stay-notes`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [postInPatientStayNotes] error: ${error}`
    );
    throw error;
  }
};

export const getComprehensiveMedicationList = async (clientId: string) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/client/${clientId}/agensy-forms/comprehensive-medication-supplement-list`,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [getComprehensiveMedicationList] error: ${error}`
    );
    throw error;
  }
};

export const postComprehensiveMedicationList = async (
  clientId: string,
  data: unknown
) => {
  try {
    const response = await sendRequest({
      method: "POST",
      url: `/client/${clientId}/agensy-forms/comprehensive-medication-supplement-list`,
      data,
    });
    return response.data.data;
  } catch (error) {
    console.log(
      `Client Agensy Forms Service [postComprehensiveMedicationList] error: ${error}`
    );
    throw error;
  }
};

export const getAuditLogs = async (
  clientId: string,
  params?: Record<string, unknown>
) => {
  try {
    const response = await sendRequest({
      method: "GET",
      url: `/client/${clientId}/agensy-forms/audits`,
      params,
    });
    return response.data.data;
  } catch (error) {
    console.log(`Client Agensy Forms Service [getAuditLogs] error: ${error}`);
    throw error;
  }
};
