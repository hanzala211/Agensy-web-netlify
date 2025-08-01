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
}