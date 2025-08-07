import type {
  ClientMedications,
  HealthcareProvider,
  OCRField,
} from "@agensy/types";

export const capitalizeFirstLetter = (str: string): string => {
  if (!str || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const filterAndJoinWithCommas = <T>(
  array: T[] | undefined | null,
  accessor: (item: T) => string
): string | null => {
  return array && array.length > 0
    ? (() => {
        const filteredValues = array
          ?.filter((item) => {
            const value = accessor(item);
            return value && value.trim() !== "";
          })
          .map(accessor)
          .join(", ");
        return filteredValues || null;
      })()
    : null;
};

export const extractLinksFromText = (
  text: string
): Array<{ text: string; url?: string }> => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const segments: Array<{ text: string; url?: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index) });
    }

    segments.push({ text: match[1], url: match[1] });

    lastIndex = match.index + match[1].length;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex) });
  }

  return segments;
};

export const formatKeyLabel = (key: string) => {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char: string) => char.toUpperCase());
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isFilled(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string" && value.trim() === "") return false;
  if (Array.isArray(value) && value.length === 0) return false;
  if (
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0
  )
    return false;
  return true;
}

export const mapExtractedDataToFormValues = (
  extractedData: OCRField[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formDefaults: Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentFormValues: Record<string, any> = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filledValues: Record<string, any> = {};

  extractedData.forEach(({ key, value }) => {
    if (key in formDefaults && isFilled(value) && !Array.isArray(value)) {
      filledValues[key] = value;
    } else if (key === "diagnosis") {
      const existingDiagnoses = currentFormValues.diagnoses || [];
      const newDiagnoses = !Array.isArray(value)
        ? value.split(", ").map((item: string) => ({
            diagnosis: item,
          }))
        : value.map((item) => ({
            diagnosis: item,
          }));

      filledValues["diagnoses"] = [...existingDiagnoses, ...newDiagnoses];
    } else if (key === "allergies") {
      const existingAllergies = currentFormValues.allergies || [];
      const newAllergies = !Array.isArray(value)
        ? value.split(", ").map((item: string) => ({
            allergen: item,
          }))
        : value.map((item) => ({
            allergen: item,
          }));

      filledValues["allergies"] = [...existingAllergies, ...newAllergies];
    } else if (
      key === "medications" &&
      (formDefaults.medicationsStarted || formDefaults.medicationsEnded)
    ) {
      const existingMedicationsStarted =
        currentFormValues.medicationsStarted || [];
      const existingMedicationsEnded = currentFormValues.medicationsEnded || [];

      const today = new Date();
      const todayISO = today.toISOString().split("T")[0];

      const medicationsStarted: ClientMedications[] = [];
      const medicationsEnded: ClientMedications[] = [];

      value.forEach((item: ClientMedications) => {
        const medicationData = {
          medicationName: item.medication_name ? item.medication_name : "",
          dosage: item.dosage ? item.dosage : "",
          prescribingDoctor: item.prescribing_doctor
            ? item.prescribing_doctor
            : "",
          id: item.id ? item.id : null,
          startDate: item.start_date ? item.start_date : "",
          endDate: item.end_date ? item.end_date : "",
          frequency: item.frequency ? item.frequency : "",
          purpose: item.purpose ? item.purpose : "",
          indication: item.indication ? item.indication : "",
          refillDue: item.refill_due ? item.refill_due : "",
        };

        if (item.end_date && item.end_date < todayISO) {
          medicationsEnded.push(medicationData);
        } else {
          medicationsStarted.push(medicationData);
        }
      });

      filledValues["medicationsStarted"] = [
        ...existingMedicationsStarted,
        ...medicationsStarted,
      ];
      filledValues["medicationsEnded"] = [
        ...existingMedicationsEnded,
        ...medicationsEnded,
      ];
    } else if (key === "medications" && formDefaults.medications) {
      const existingMedications = currentFormValues.medications || [];
      const newMedications: ClientMedications[] = [];

      value.forEach((item: ClientMedications) => {
        const newMedication = {
          medicationName: item.medication_name ? item.medication_name : "",
          dosage: item.dosage ? item.dosage : "",
          prescribingDoctor: item.prescribing_doctor
            ? item.prescribing_doctor
            : "",
          id: item.id ? item.id : null,
          startDate: item.start_date ? item.start_date : "",
          endDate: item.end_date ? item.end_date : "",
          frequency: item.frequency ? item.frequency : "",
          purpose: item.purpose ? item.purpose : "",
          indication: item.indication ? item.indication : "",
          refillDue: item.refill_due ? item.refill_due : "",
        };
        newMedications.push(newMedication);
      });

      filledValues["medications"] = [...existingMedications, ...newMedications];
    } else if (
      key === "healthcareProviders" &&
      (formDefaults.providers || formDefaults.healthcareProviders)
    ) {
      const existingProviders = currentFormValues.providers || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newProviders: any[] = [];

      value.forEach((item: HealthcareProvider) => {
        const newProvider = {
          providerName: item.provider_name ? item.provider_name : "",
          providerType: item.provider_type ? item.provider_type : "",
          address: item.address ? item.address : "",
          phone: item.phone ? item.phone : "",
          fax: item.fax ? item.fax : "",
          follow_up: item.follow_up ? item.follow_up : "",
          notes: item.notes ? item.notes : "",
          id: item.id ? item.id : null,
          specialty: item.specialty ? item.specialty : "",
        };
        newProviders.push(newProvider);
      });

      filledValues[
        formDefaults.providers ? "providers" : "healthcare_providers"
      ] = [...existingProviders, ...newProviders];
    }
  });

  return filledValues;
};
