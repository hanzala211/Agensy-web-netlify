import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { LabsTrackerFormData } from "@agensy/types";
import { DateUtils } from "@agensy/utils";
import logo from "@agensy/assets/logo.png";

const BORDER = "#1f3d7a";
const BORDER_LITE = "#c5d2f2";
const HEADER_BG = "#e6f0ff";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 9,
    fontFamily: "Helvetica",
    lineHeight: 1.25,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
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
    padding: 3,
    fontWeight: "bold",
    fontSize: 8.5,
    borderRightWidth: 1,
    borderRightColor: BORDER_LITE,
  },
  td: {
    padding: 3,
    fontSize: 8.5,
    borderRightWidth: 1,
    borderRightColor: BORDER_LITE,
  },
  sectionContent: {
    padding: 4,
    fontSize: 8.5,
  },
});

const columns = [
  { key: "date", label: "Date", flex: 1 },
  { key: "doctorName", label: "Doctor Name", flex: 1.2 },
  { key: "type", label: "Type", flex: 1 },
  { key: "providerCompanyUsed", label: "Provider / Company", flex: 1.3 },
  { key: "purpose", label: "Purpose", flex: 1.2 },
  { key: "results", label: "Results", flex: 1.4 },
] as const;

const getValue = (
  data: LabsTrackerFormData | undefined,
  idx: number,
  key: string
) => {
  if (!data?.labs || !data.labs[idx]) return "";

  const lab = data.labs[idx];
  switch (key) {
    case "date":
      return lab.date ?? "";
    case "doctorName":
      return lab.doctorName ?? "";
    case "type":
      return lab.type ?? "";
    case "providerCompanyUsed":
      return lab.providerCompanyUsed ?? "";
    case "purpose":
      return lab.purpose ?? "";
    case "results":
      return lab.results ?? "";
    default:
      return "";
  }
};

// Helper function to check if a row has any data
const hasRowData = (data: LabsTrackerFormData | undefined, idx: number) => {
  if (!data?.labs || !data.labs[idx]) return false;

  const lab = data.labs[idx];
  return (
    lab.date ||
    lab.doctorName ||
    lab.type ||
    lab.providerCompanyUsed ||
    lab.purpose ||
    lab.results
  );
};

export const LabsTrackerPDF: React.FC<{
  data?: LabsTrackerFormData & { last_update?: { updatedAt?: string } };
}> = ({ data }) => {
  // Filter rows that have data
  const rowsWithData = data?.labs
    ? data.labs.map((_, index) => index).filter((idx) => hasRowData(data, idx))
    : [];

  return (
    <Document title="Agensy Labs Tracker">
      <Page size="A4" style={styles.page}>
        <Text style={styles.formTitle}>Agensy Labs Tracker</Text>
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
          <Text style={styles.sectionContent}>
            {`${data?.firstName} ${data?.lastName}`}
          </Text>
          <Text style={styles.sectionContent}>
            {`Date of Birth: ${data?.dateOfBirth}`}
          </Text>
        </View>

        {/* Only show the section if there are rows with data */}
        {rowsWithData.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Labs Tests & Imaging ({rowsWithData.length}{" "}
              {rowsWithData.length === 1 ? "entry" : "entries"})
            </Text>
            <View style={styles.tableHeader}>
              {columns.map((c, i) => (
                <Text key={i} style={[styles.th, { flex: c.flex }]}>
                  {c.label}
                </Text>
              ))}
            </View>
            {rowsWithData.map((idx) => (
              <View key={idx} style={styles.tableRow}>
                {columns.map((c, j) => (
                  <Text key={j} style={[styles.td, { flex: c.flex }]}>
                    {getValue(data, idx, c.key)}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export const LabsTrackerPDf = LabsTrackerPDF;
