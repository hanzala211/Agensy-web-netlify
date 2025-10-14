import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type {
  ClientMedications,
  ComprehensiveMedicationListFormData,
} from "@agensy/types";
import { DateUtils } from "@agensy/utils";
import logo from "@agensy/assets/logo.jpg";

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
    fontSize: 18,
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
    marginBottom: 10,
  },
  headerLogo: { width: 130, objectFit: "contain" },
  headerDateBoxContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
  },
  headerDateBox: {
    borderWidth: 1,
    borderColor: BORDER,
    padding: 4,
    fontSize: 9,
    minWidth: 120,
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
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    fontSize: 12,
  },
  fieldRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER_LITE,
  },
  label: {
    width: "35%",
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
    {columns.map((c, i) => (
      <Text key={i} style={styles.th}>
        {c}
      </Text>
    ))}
  </View>
);

const TableRow = ({
  cells,
  last,
}: {
  cells: (string | undefined)[];
  last?: boolean;
}) => (
  <View style={[styles.tableRow, last ? { borderBottomWidth: 0 } : {}]}>
    {cells.map((c, i) => (
      <Text key={i} style={styles.td}>
        {c ?? " "}
      </Text>
    ))}
  </View>
);

export const ComprehensiveMedicationListPDF: React.FC<{
  data?: ComprehensiveMedicationListFormData & {
    last_update?: { updatedAt?: string };
    printStoppedMedications?: boolean;
  };
  clientMedications?: ClientMedications[];
}> = ({ data, clientMedications = [] }) => {
  const isMedicationStopped = (medicationId: string) => {
    if (!medicationId) return false;

    const foundMedication = clientMedications.find(
      (med) => med.id === medicationId
    );

    if (foundMedication) {
      return false;
    }

    return true;
  };

  return (
    <Document title="Agensy Comprehensive Medication & Supplement List">
      <Page size="A4" style={styles.page}>
        <Text style={styles.formTitle}>
          Agensy Comprehensive Medication & Supplement List
        </Text>
        <View style={styles.headerRow}>
          <Image src={logo} style={styles.headerLogo} />
          <View style={styles.headerDateBoxContainer}>
            <Text style={styles.headerDateBox}>
              {`Print Date: ${DateUtils.formatDateToRequiredFormat(
                new Date().toISOString()
              )}`}
            </Text>
            {data?.last_update?.updatedAt && (
              <Text style={styles.headerDateBox}>
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
          {data?.dateOfBirth && (
            <Field label="Date of Birth">{data.dateOfBirth}</Field>
          )}
        </View>

        {/* Active Medications Section */}
        {data?.medications?.some(
          (m) => !isMedicationStopped(m.medicationId || "")
        ) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medications</Text>
            <TableHeader
              columns={[
                "Medication",
                "Dose",
                "Used to Treat",
                "Frequency",
                "Prescriber",
                "Refill Due",
              ]}
            />
            {(data.medications ?? [])
              .filter((m) => !isMedicationStopped(m.medicationId || ""))
              .map((m, i, arr) => (
                <TableRow
                  key={i}
                  cells={[
                    m.medicationName ?? "",
                    m.dosage ?? "",
                    m.usedToTreat ?? "",
                    m.frequency ?? "",
                    m.prescriber ?? "",
                    m.refillDue ?? "",
                  ]}
                  last={i === arr.length - 1}
                />
              ))}
          </View>
        )}

        {/* Stopped Medications Section - Only show if checkbox is checked */}
        {data?.printStoppedMedications &&
          data?.medications?.some((m) =>
            isMedicationStopped(m.medicationId || "")
          ) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Stopped Medications</Text>
              <TableHeader
                columns={[
                  "Medication",
                  "Dose",
                  "Used to Treat",
                  "Frequency",
                  "Prescriber",
                  "Refill Due",
                ]}
              />
              {(data.medications ?? [])
                .filter((m) => isMedicationStopped(m.medicationId || ""))
                .map((m, i, arr) => (
                  <TableRow
                    key={i}
                    cells={[
                      m.medicationName ?? "",
                      m.dosage ?? "",
                      m.usedToTreat ?? "",
                      m.frequency ?? "",
                      m.prescriber ?? "",
                      m.refillDue ?? "",
                    ]}
                    last={i === arr.length - 1}
                  />
                ))}
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
      </Page>
    </Document>
  );
};
