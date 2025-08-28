import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { VitalsTrackerFormData } from "@agensy/types";
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
});

const columns = [
  { key: "date", label: "Date", flex: 1.1 },
  { key: "heartRate", label: "Heart Rate (bpm)", flex: 1.1 },
  { key: "oxygen", label: "Oxygen (%)", flex: 1 },
  { key: "bloodPressure", label: "Blood Pressure (mmHg)", flex: 1.4 },
  { key: "bloodType", label: "Blood Type", flex: 0.9 },
  { key: "temperature", label: "Temp (°F)", flex: 0.9 },
  { key: "weight", label: "Weight (lbs)", flex: 1 },
  { key: "height", label: "Height (in)", flex: 1 },
  { key: "other", label: "Other", flex: 1.3 },
] as const;

const getValue = (
  vital: { [key: string]: string | null | undefined },
  key: string
) => {
  return vital?.[key] || "";
};

export const VitalsTrackerPDF: React.FC<{
  data?: VitalsTrackerFormData & { last_update?: { updatedAt?: string } };
}> = ({ data }) => {
  const vitals = data?.vitals || [];

  // Filter out completely empty entries and only show rows with data
  const nonEmptyVitals = vitals.filter(
    (vital) =>
      vital.date ||
      vital.heartRate ||
      vital.oxygen ||
      vital.bloodPressure ||
      vital.bloodType ||
      vital.temperature ||
      vital.weight ||
      vital.height ||
      vital.other
  );

  const totalEntries = nonEmptyVitals.length;

  return (
    <Document title="Agensy Vitals Tracker">
      <Page size="A4" style={styles.page}>
        <Text style={styles.formTitle}>Agensy Vitals Tracker</Text>
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
          <Text style={styles.sectionTitle}>
            Vitals ({totalEntries} entries)
          </Text>
          {totalEntries > 0 ? (
            <>
              <View style={styles.tableHeader}>
                {columns.map((c, i) => (
                  <Text key={i} style={[styles.th, { flex: c.flex }]}>
                    {c.label}
                  </Text>
                ))}
              </View>
              {nonEmptyVitals.map((vital, i) => (
                <View key={i} style={styles.tableRow}>
                  {columns.map((c, j) => (
                    <Text key={j} style={[styles.td, { flex: c.flex }]}>
                      {getValue(vital, c.key)}
                    </Text>
                  ))}
                </View>
              ))}
            </>
          ) : (
            <View style={styles.tableRow}>
              <Text style={[styles.td, { flex: 9.7, textAlign: "center" }]}>
                No vitals data available
              </Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};
