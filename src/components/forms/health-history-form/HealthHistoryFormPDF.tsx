import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { HealthHistoryFormData } from "@agensy/types";
import { DateUtils } from "@agensy/utils";
import logo from "@agensy/assets/logo.png";

const BORDER = "#1f3d7a";
const BORDER_LITE = "#c5d2f2";
const HEADER_BG = "#e6f0ff";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 9.5,
    fontFamily: "Helvetica",
    lineHeight: 1.3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 14,
    marginTop: 5,
    color: BORDER,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  headerLogo: { width: 130, objectFit: "contain" },
  headerDateBox: {
    borderWidth: 1,
    borderColor: BORDER,
    padding: 4,
    fontSize: 9,
    minWidth: 110,
    textAlign: "right",
  },

  // Main form container with border
  mainFormContainer: {
    borderWidth: 2,
    borderColor: BORDER,
    marginTop: 10,
  },

  // Header section for name and DOB
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_LITE,
  },
  headerField: {
    flex: 1,
    marginRight: 10,
  },
  headerFieldLast: {
    flex: 1,
  },
  headerLabel: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 2,
  },
  headerInput: {
    borderWidth: 1,
    borderColor: BORDER_LITE,
    padding: 4,
    minHeight: 20,
  },

  // Two-column layout for main form fields
  fieldRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER_LITE,
    minHeight: 30,
  },
  label: {
    width: "35%",
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: BORDER_LITE,
    backgroundColor: "#f5f5f5",
    fontSize: 9,
    fontWeight: "bold",
    fontStyle: "italic",
    justifyContent: "center",
  },
  value: {
    flex: 1,
    padding: 6,
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },

  // Multi-line fields
  multiLineField: {
    minHeight: 60,
  },
  multiLineValue: {
    flex: 1,
    padding: 6,
    backgroundColor: "#ffffff",
    minHeight: 50,
  },

  // Large text areas
  largeTextArea: {
    minHeight: 100,
  },
  largeTextValue: {
    flex: 1,
    padding: 6,
    backgroundColor: "#ffffff",
    minHeight: 90,
  },

  // Medication sections
  medicationSection: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER_LITE,
  },
  medicationHeader: {
    backgroundColor: HEADER_BG,
    padding: 4,
    fontSize: 9,
    fontWeight: "bold",
    color: BORDER,
  },
});

const Field = ({
  label,
  children,
  isMultiLine = false,
  isLargeTextArea = false,
}: {
  label: string;
  children?: React.ReactNode;
  isMultiLine?: boolean;
  isLargeTextArea?: boolean;
}) => {
  const fieldStyle = [
    styles.fieldRow,
    ...(isMultiLine ? [styles.multiLineField] : []),
    ...(isLargeTextArea ? [styles.largeTextArea] : []),
  ];

  const valueStyle = [
    isMultiLine ? styles.multiLineValue : styles.value,
    ...(isLargeTextArea ? [styles.largeTextValue] : []),
  ];

  return (
    <View style={fieldStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Text style={valueStyle}>{children ?? " "}</Text>
    </View>
  );
};

const HeaderField = ({
  label,
  children,
}: {
  label: string;
  children?: React.ReactNode;
}) => (
  <View style={styles.headerField}>
    <Text style={styles.headerLabel}>{label}</Text>
    <View style={styles.headerInput}>
      <Text>{children ?? " "}</Text>
    </View>
  </View>
);

const MedicationField = ({
  medications,
  label,
}: {
  medications: Array<{
    medicationName?: string;
    dosage?: string;
    prescribingDoctor?: string;
  }>;
  label: string;
}) => {
  const medicationText =
    medications
      ?.filter((m) => m.medicationName)
      ?.map(
        (m) =>
          `${m.medicationName}${m.dosage ? `, ${m.dosage}` : ""}${
            m.prescribingDoctor ? `, ${m.prescribingDoctor}` : ""
          }`
      )
      ?.join("; ") || "";

  return <Field label={label}>{medicationText}</Field>;
};

const HealthHistoryFormPDF: React.FC<{
  data?: HealthHistoryFormData & { last_update: { updatedAt: string } };
}> = ({ data }) => {
  return (
    <Document title="Agensy Health History Form">
      <Page size="A4" style={styles.page}>
        <Text style={styles.formTitle}>Agensy Health History Form</Text>
        <View style={styles.headerRow}>
          <Image src={logo} style={styles.headerLogo} />
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.headerDateBox}>
              {`Print Date: ${DateUtils.formatDateToRequiredFormat(
                new Date().toISOString()
              )}`}
            </Text>
            {data?.last_update?.updatedAt && (
              <Text style={[styles.headerDateBox, { marginTop: 5 }]}>
                {`Update Date: ${DateUtils.formatDateToRequiredFormat(
                  data.last_update.updatedAt
                )}`}
              </Text>
            )}
          </View>
        </View>

        {/* Main Form Container */}
        <View style={styles.mainFormContainer}>
          {/* Header Section - Name and Date of Birth */}
          <View style={styles.headerSection}>
            <HeaderField label="Name:">
              {data?.firstName && data?.lastName
                ? `${data.firstName} ${data.lastName}`
                : data?.firstName || data?.lastName || ""}
            </HeaderField>
            <HeaderField label="Date of Birth:">
              {data?.healthHistoryDate || ""}
            </HeaderField>
          </View>

          {/* Date Field */}
          <Field label="Date">{data?.healthHistoryDate || ""}</Field>

          {/* Diagnosis Field */}
          <Field label="Diagnosis">
            {(data?.diagnoses ?? [])
              .filter((d) => d?.diagnosis)
              .map((d) => d.diagnosis)
              .join(", ") || ""}
          </Field>

          {/* Description of Health Concern */}
          <Field label="Description of Health Concern" isMultiLine>
            {data?.descriptionOfHealthConcern || ""}
          </Field>

          {/* Onset of Symptoms */}
          <Field label="Onset of Symptoms">{data?.onsetOfSymptoms || ""}</Field>

          {/* Frequency of Symptoms */}
          <Field label="Frequency of Symptoms">
            {data?.frequencyOfSymptoms || ""}
          </Field>

          {/* Severity of Symptoms */}
          <Field label="Severity of Symptoms">
            {data?.severityOfSymptoms || ""}
          </Field>

          {/* Hospitalization */}
          <Field label="Hospitalization">
            {data?.admittingDiagnosis && data?.hospitalizationTreatment
              ? `${data.admittingDiagnosis}, ${data.hospitalizationTreatment}`
              : data?.admittingDiagnosis ||
                data?.hospitalizationTreatment ||
                ""}
          </Field>

          {/* Specialty Provider */}
          <Field label="Specialty Provider">
            {(data?.providers ?? [])
              .filter(
                (provider) =>
                  provider &&
                  (provider.providerName ||
                    provider.address ||
                    provider.phone ||
                    provider.notes ||
                    provider.follow_up)
              )
              .map(
                (provider) =>
                  `${provider.providerName || ""}${
                    provider.address ? `, ${provider.address}` : ""
                  }${provider.phone ? `, ${provider.phone}` : ""}${
                    provider.notes ? `, ${provider.notes}` : ""
                  }${provider.follow_up ? `, ${provider.follow_up}` : ""}`
              )
              .join("; ") || ""}
          </Field>

          {/* Medication Started */}
          <MedicationField
            medications={data?.medicationsStarted || []}
            label="Medication Started"
          />

          {/* Medication Stopped */}
          <MedicationField
            medications={data?.medicationsEnded || []}
            label="Medication Stopped"
          />

          {/* Medication and Anesthesia Reactions and Side Effects */}
          <Field
            label="Medication and Anesthesia Reactions and Side Effects"
            isMultiLine
          >
            {(data?.anesthesia ?? [])
              .filter((a) => a?.anesthesia)
              .map((a) => a.anesthesia)
              .join(", ") || ""}
          </Field>

          {/* Home Health */}
          <Field label="Home Health">
            {[
              data?.homeHealthName,
              data?.homeHealthServiceReceived,
              data?.homeHealthPhone,
              data?.homeHealthAddress,
              data?.homeHealthStartDate,
              data?.homeHealthDischargeDate,
            ]
              .filter(Boolean)
              .join(", ") || ""}
          </Field>

          {/* What Worked */}
          <Field label="What Worked" isLargeTextArea>
            {data?.whatWorked || ""}
          </Field>

          {/* Notes */}
          <Field label="Notes" isLargeTextArea>
            {data?.healthHistoryNotes || ""}
          </Field>
        </View>
      </Page>
    </Document>
  );
};

export default HealthHistoryFormPDF;
