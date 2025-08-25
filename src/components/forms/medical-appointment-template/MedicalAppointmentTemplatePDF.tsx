import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { MedicalAppointmentTemplateData } from "@agensy/types";
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
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{children ?? " "}</Text>
  </View>
);

const TableHeader = ({ columns }: { columns: string[] }) => (
  <View style={styles.tableHeader}>
    {columns.map((column, index) => (
      <Text key={index} style={styles.th}>
        {column}
      </Text>
    ))}
  </View>
);

const TableRow = ({
  cells,
  last = false,
}: {
  cells: string[];
  last?: boolean;
}) => (
  <View style={[styles.tableRow, last ? { borderBottomWidth: 0 } : {}]}>
    {cells.map((cell, index) => (
      <Text key={index} style={styles.td}>
        {cell}
      </Text>
    ))}
  </View>
);

const MedicalAppointmentTemplatePDF: React.FC<{
  data?: MedicalAppointmentTemplateData & {
    last_update: { updatedAt: string };
  };
}> = ({ data }) => {
  return (
    <Document title="Agensy Medical Appointment Template">
      <Page size="A4" style={styles.page}>
        <Text style={styles.formTitle}>Medical Appointment Template</Text>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <Field label="First Name">{data?.firstName}</Field>
          <Field label="Last Name">{data?.lastName}</Field>
          {data?.date && <Field label="Date">{data.date}</Field>}
          {data?.dateOfBirth && (
            <Field label="Date of Birth">{data.dateOfBirth}</Field>
          )}
        </View>

        {(data?.height ||
          data?.weight ||
          data?.blood_pressure ||
          data?.temperature ||
          data?.heart_rate ||
          data?.additional_vitals) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vital Signs</Text>
            {data.height && <Field label="Height">{data.height}</Field>}
            {data.weight && <Field label="Weight">{data.weight}</Field>}
            {data.blood_pressure && (
              <Field label="Blood Pressure">{data.blood_pressure}</Field>
            )}
            {data.temperature && (
              <Field label="Temperature">{data.temperature}</Field>
            )}
            {data.heart_rate && (
              <Field label="Heart Rate">{data.heart_rate}</Field>
            )}
            {data.additional_vitals && (
              <Field label="Additional Vitals">{data.additional_vitals}</Field>
            )}
          </View>
        )}

        {(data?.reason_for_visit ||
          data?.top_3_concerns ||
          data?.tests_labs_imaging ||
          data?.visit_notes) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Visit Information</Text>
            {data.reason_for_visit && (
              <Field label="Reason for Visit">{data.reason_for_visit}</Field>
            )}
            {data.top_3_concerns && (
              <Field label="Top 3 Concerns">{data.top_3_concerns}</Field>
            )}
            {data.tests_labs_imaging && (
              <Field label="Tests / Labs / Imaging">
                {data.tests_labs_imaging}
              </Field>
            )}
            {data.visit_notes && (
              <Field label="Visit Notes">{data.visit_notes}</Field>
            )}
          </View>
        )}

        {(data?.recommendations ||
          data?.referrals ||
          data?.follow_up ||
          data?.report_given_to) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommendations & Follow-up</Text>
            {data.recommendations && (
              <Field label="Recommendations">{data.recommendations}</Field>
            )}
            {data.referrals && (
              <Field label="Referrals">{data.referrals}</Field>
            )}
            {data.follow_up && data.follow_up.trim() !== "" && (
              <Field label="Follow-up Date">
                {DateUtils.formatDateToRequiredFormat(data.follow_up)}
              </Field>
            )}
            {data.report_given_to && (
              <Field label="Report Given To">{data.report_given_to}</Field>
            )}
          </View>
        )}

        {data?.diagnoses?.some((d) => d && d.diagnosis) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Diagnoses</Text>
            <Field label="Diagnoses">
              {data.diagnoses
                ?.filter((d) => d && d.diagnosis)
                ?.map((d) => d.diagnosis)
                .join(", ") ?? ""}
            </Field>
          </View>
        )}

        {data?.allergies?.some((a) => a && a.allergen) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Allergies</Text>
            <Field label="Allergies">
              {data.allergies
                ?.filter((a) => a && a.allergen)
                ?.map((a) => a.allergen)
                .join(", ") ?? ""}
            </Field>
          </View>
        )}

        {data?.surgical_history?.some((s) => s && s.surgicalHistory) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Surgical History</Text>
            <Field label="Surgical History">
              {data.surgical_history
                ?.filter((s) => s && s.surgicalHistory)
                ?.map((s) => s.surgicalHistory)
                .join(", ") ?? ""}
            </Field>
          </View>
        )}

        {data?.medications?.some((m) => m && m.medication_name) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medications</Text>
            <TableHeader
              columns={[
                "Medication Name",
                "Dosage",
                "Frequency",
                "Prescribing Doctor",
                "Start Date",
                "End Date",
                "Notes",
              ]}
            />
            {(data.medications ?? [])
              .filter((m) => m && m.medication_name)
              .map((m, i, arr) => (
                <TableRow
                  key={i}
                  cells={[
                    m.medication_name ?? "",
                    m.dosage ?? "",
                    m.frequency ?? "",
                    m.prescribing_doctor ?? "",
                    m.start_date && m.start_date.trim() !== ""
                      ? DateUtils.formatDateToRequiredFormat(m.start_date)
                      : "",
                    m.end_date && m.end_date.trim() !== ""
                      ? DateUtils.formatDateToRequiredFormat(m.end_date)
                      : "",
                    m.notes ?? "",
                  ]}
                  last={i === arr.length - 1}
                />
              ))}
          </View>
        )}

        {(data?.healthcareProvider?.providerName ||
          data?.healthcareProvider?.providerType ||
          data?.healthcareProvider?.specialty ||
          data?.healthcareProvider?.address ||
          data?.healthcareProvider?.phone ||
          data?.healthcareProvider?.follow_up ||
          data?.healthcareProvider?.notes) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Healthcare Provider</Text>
            {data.healthcareProvider?.providerName && (
              <Field label="Provider Name">
                {data.healthcareProvider.providerName}
              </Field>
            )}
            {data.healthcareProvider?.providerType && (
              <Field label="Provider Type">
                {data.healthcareProvider.providerType}
              </Field>
            )}
            {data.healthcareProvider?.specialty && (
              <Field label="Specialty">
                {data.healthcareProvider.specialty}
              </Field>
            )}
            {data.healthcareProvider?.address && (
              <Field label="Address">{data.healthcareProvider.address}</Field>
            )}
            {data.healthcareProvider?.phone && (
              <Field label="Phone">{data.healthcareProvider.phone}</Field>
            )}
            {data.healthcareProvider?.follow_up &&
              data.healthcareProvider.follow_up.trim() !== "" && (
                <Field label="Follow-up">
                  {DateUtils.formatDateToRequiredFormat(
                    data.healthcareProvider.follow_up
                  )}
                </Field>
              )}
            {data.healthcareProvider?.notes && (
              <Field label="Notes">{data.healthcareProvider.notes}</Field>
            )}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default MedicalAppointmentTemplatePDF;
