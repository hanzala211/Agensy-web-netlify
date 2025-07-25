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
  data?: MedicalAppointmentTemplateData & { last_update: { updatedAt: string } };
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
          <Text style={styles.sectionTitle}>Patient Information</Text>
          <Field label="Name">
            {data?.firstName} {data?.lastName}
          </Field>
          <Field label="Date of Birth">{data?.dateOfBirth}</Field>
          <Field label="Appointment Date">{data?.date}</Field>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vital Signs</Text>
          <Field label="Height">{data?.height}</Field>
          <Field label="Weight">{data?.weight}</Field>
          <Field label="Blood Pressure">{data?.blood_pressure}</Field>
          <Field label="Temperature">{data?.temperature}</Field>
          <Field label="Heart Rate">{data?.heart_rate}</Field>
          <Field label="Additional Vitals">{data?.additional_vitals}</Field>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visit Information</Text>
          <Field label="Reason for Visit">{data?.reason_for_visit}</Field>
          <Field label="Top 3 Concerns">{data?.top_3_concerns}</Field>
          <Field label="Tests / Labs / Imaging">{data?.tests_labs_imaging}</Field>
          <Field label="Visit Notes">{data?.visit_notes}</Field>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diagnoses</Text>
          <Field label="Diagnoses">
            {data?.diagnoses
              ?.filter((d) => d && d.diagnosis)
              ?.map((d) => d.diagnosis)
              .join(", ") ?? ""}
          </Field>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Allergies</Text>
          <Field label="Allergies">
            {data?.allergies
              ?.filter((a) => a && a.allergen)
              ?.map((a) => a.allergen)
              .join(", ") ?? ""}
          </Field>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Surgical History</Text>
          <Field label="Surgical History">
            {data?.surgical_history
              ?.filter((s) => s && s.surgicalHistory)
              ?.map((s) => s.surgicalHistory)
              .join(", ") ?? ""}
          </Field>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medications</Text>
          <TableHeader columns={["Medication", "Dosage", "Frequency", "Prescribing Doctor", "Start Date", "End Date", "Notes"]} />
          {(data?.medications ?? [])
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Healthcare Providers</Text>
          <TableHeader columns={["Provider Name", "Specialty", "Address", "Phone", "Follow-up Date", "Notes"]} />
          {(data?.healthcareProviders ?? [])
            .filter((p) => p && p.provider_name)
            .map((p, i, arr) => (
              <TableRow
                key={i}
                cells={[
                  p.provider_name ?? "",
                  p.specialty ?? "",
                  p.address ?? "",
                  p.phone ?? "",
                  p.follow_up && p.follow_up.trim() !== ""
                    ? DateUtils.formatDateToRequiredFormat(p.follow_up)
                    : "",
                  p.notes ?? "",
                ]}
                last={i === arr.length - 1}
              />
            ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations & Follow-up</Text>
          <Field label="Recommendations">{data?.recommendations}</Field>
          <Field label="Referrals">{data?.referrals}</Field>
          <Field label="Follow-up Date">
            {data?.follow_up && data.follow_up.trim() !== ""
              ? DateUtils.formatDateToRequiredFormat(data.follow_up)
              : ""}
          </Field>
          <Field label="Report Given To">{data?.report_given_to}</Field>
        </View>
      </Page>
    </Document>
  );
};

export default MedicalAppointmentTemplatePDF;
