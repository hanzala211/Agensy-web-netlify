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

  section: {
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 10,
  },

  sectionTitle: {
    backgroundColor: HEADER_BG,
    color: BORDER,
    fontWeight: "bold",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    fontSize: 10,
  },

  fieldRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER_LITE,
  },
  label: {
    width: "32%",
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: BORDER_LITE,
    fontWeight: "bold",
  },
  value: { flex: 1, padding: 4 },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: HEADER_BG,
    borderBottomWidth: 1,
    borderColor: BORDER,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: BORDER_LITE,
  },
  th: {
    flex: 1,
    padding: 4,
    fontWeight: "bold",
    fontSize: 9,
  },
  td: { flex: 1, padding: 4, fontSize: 9 },
});

const Field = ({
  label,
  children,
}: {
  label: string;
  children?: React.ReactNode;
}) => (
  <View style={styles.fieldRow}>
    {label && <Text style={styles.label}>{label}</Text>}
    <Text style={styles.value}>{children ?? " "}</Text>
  </View>
);

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

        {data?.diagnoses?.some((d) => d?.diagnosis) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Diagnoses</Text>
            <Field label="Diagnoses">
              {(data.diagnoses ?? [])
                .filter((d) => d?.diagnosis)
                .map((d) => d.diagnosis)
                .join(", ") || "None"}
            </Field>
          </View>
        )}

        {data?.descriptionOfHealthConcern && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Description of Health Concern
            </Text>
            <Field label="Description of Health Concern">
              {data.descriptionOfHealthConcern}
            </Field>
          </View>
        )}

        {data?.onsetOfSymptoms && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Onset of Symptoms</Text>
            <Field label="Onset of Symptoms">{data.onsetOfSymptoms}</Field>
          </View>
        )}

        {data?.frequencyOfSymptoms && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequency of Symptoms</Text>
            <Field label="Frequency of Symptoms">
              {data.frequencyOfSymptoms}
            </Field>
          </View>
        )}

        {data?.severityOfSymptoms && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Severity of Symptoms</Text>
            <Field label="Severity of Symptoms">
              {data.severityOfSymptoms}
            </Field>
          </View>
        )}

        {(data?.admittingDiagnosis || data?.hospitalizationTreatment) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hospitalization</Text>
            {data.admittingDiagnosis && (
              <Field label="Admitting Diagnosis">
                {data.admittingDiagnosis}
              </Field>
            )}
            {data.hospitalizationTreatment && (
              <Field label="Hospitalization Treatment">
                {data.hospitalizationTreatment}
              </Field>
            )}
          </View>
        )}

        {data?.providers?.some(
          (provider) =>
            provider &&
            (provider.providerName ||
              provider.address ||
              provider.phone ||
              provider.notes ||
              provider.follow_up)
        ) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Healthcare Providers</Text>
            {(data.providers ?? [])
              .filter(
                (provider) =>
                  provider &&
                  (provider.providerName ||
                    provider.address ||
                    provider.phone ||
                    provider.notes ||
                    provider.follow_up)
              )
              .map((provider, index) => (
                <View key={index} style={styles.fieldRow}>
                  <Text style={styles.label}>Provider {index + 1}</Text>
                  <Text style={styles.value}>
                    {provider.providerName && `Name: ${provider.providerName}`}
                    {provider.address && `\nAddress: ${provider.address}`}
                    {provider.phone && `\nPhone: ${provider.phone}`}
                    {provider.notes && `\nNotes: ${provider.notes}`}
                    {provider.follow_up && `\nFollow Up: ${provider.follow_up}`}
                  </Text>
                </View>
              ))}
          </View>
        )}

        {data?.medicationsStarted?.some((m) => m.medicationName) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medication Started</Text>
            <Field label="Medication Name">
              {(data.medicationsStarted ?? [])
                .map((m) => m.medicationName)
                .join(", ")}
            </Field>
            <Field label="Dosage">
              {(data.medicationsStarted ?? []).map((m) => m.dosage).join(", ")}
            </Field>
            <Field label="Prescribing Doctor">
              {(data.medicationsStarted ?? [])
                .map((m) => m.prescribingDoctor)
                .join(", ")}
            </Field>
          </View>
        )}

        {data?.medicationsEnded?.some((m) => m.medicationName) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medication Ended</Text>
            <Field label="Medication Name">
              {(data.medicationsEnded ?? [])
                .map((m) => m.medicationName)
                .join(", ")}
            </Field>
            <Field label="Dosage">
              {(data.medicationsEnded ?? []).map((m) => m.dosage).join(", ")}
            </Field>
            <Field label="Prescribing Doctor">
              {(data.medicationsEnded ?? [])
                .map((m) => m.prescribingDoctor)
                .join(", ")}
            </Field>
          </View>
        )}

        {(data?.homeHealthName ||
          data?.homeHealthPhone ||
          data?.homeHealthAddress ||
          data?.homeHealthFax ||
          data?.homeHealthServiceReceived ||
          data?.homeHealthStartDate) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Home Health Agency</Text>
            {data.homeHealthName && (
              <Field label="Home Health Name">{data.homeHealthName}</Field>
            )}
            {data.homeHealthPhone && (
              <Field label="Home Health Phone">{data.homeHealthPhone}</Field>
            )}
            {data.homeHealthAddress && (
              <Field label="Home Health Address">
                {data.homeHealthAddress}
              </Field>
            )}
            {data.homeHealthFax && (
              <Field label="Home Health Fax">{data.homeHealthFax}</Field>
            )}
            {data.homeHealthServiceReceived && (
              <Field label="Home Health Service Received">
                {data.homeHealthServiceReceived}
              </Field>
            )}
            {data.homeHealthStartDate && (
              <Field label="Home Health Start Date">
                {data.homeHealthStartDate}
              </Field>
            )}
          </View>
        )}

        {data?.whatWorked && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What Worked</Text>
            <Field label="What Worked">{data.whatWorked}</Field>
          </View>
        )}

        {data?.healthHistoryNotes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health History Notes</Text>
            <Field label="Health History Notes">
              {data.healthHistoryNotes}
            </Field>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default HealthHistoryFormPDF;
