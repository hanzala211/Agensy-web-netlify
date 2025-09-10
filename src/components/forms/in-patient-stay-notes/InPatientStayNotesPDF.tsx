import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { InPatientStayNotesFormData } from "@agensy/types";
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

  listContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: BORDER_LITE,
  },
  listTitle: {
    fontWeight: "bold",
    marginBottom: 3,
    color: BORDER,
  },
  listItem: {
    fontSize: 9,
    marginBottom: 2,
  },
  sectionContent: {
    padding: 4,
    fontSize: 8.5,
  },
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

const NotesLists: React.FC<{
  questions?: { question?: string }[];
  updates?: { update?: string }[];
  recommendations?: { recommendation?: string }[];
}> = ({ questions = [], updates = [], recommendations = [] }) => {
  // Only render if there's actual content
  const hasQuestions = questions?.some((q) => q?.question?.trim());
  const hasUpdates = updates?.some((u) => u?.update?.trim());
  const hasRecommendations = recommendations?.some((r) =>
    r?.recommendation?.trim()
  );

  if (!hasQuestions && !hasUpdates && !hasRecommendations) {
    return null;
  }

  return (
    <View>
      {hasQuestions && (
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Questions for Provider</Text>
          {questions
            ?.filter((q) => q?.question?.trim())
            .map((q, i) => (
              <Text key={i} style={styles.listItem}>{`- ${q.question}`}</Text>
            ))}
        </View>
      )}
      {hasUpdates && (
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Updates from Provider</Text>
          {updates
            ?.filter((u) => u?.update?.trim())
            .map((u, i) => (
              <Text key={i} style={styles.listItem}>{`- ${u.update}`}</Text>
            ))}
        </View>
      )}
      {hasRecommendations && (
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Recommendations / Next Steps</Text>
          {recommendations
            ?.filter((r) => r?.recommendation?.trim())
            .map((r, i) => (
              <Text
                key={i}
                style={styles.listItem}
              >{`- ${r.recommendation}`}</Text>
            ))}
        </View>
      )}
    </View>
  );
};

export const InPatientStayNotesPDF: React.FC<{
  data?: InPatientStayNotesFormData & { last_update?: { updatedAt?: string } };
}> = ({ data }) => {
  // Check if Entry 1 has any data
  const hasEntry1Data =
    data?.date1 ||
    data?.facilityName1 ||
    data?.medicalProvider1 ||
    data?.specialty1 ||
    data?.questionsForProvider1?.some((q) => q?.question?.trim()) ||
    data?.updatesFromProvider1?.some((u) => u?.update?.trim()) ||
    data?.recommendationsNextSteps1?.some((r) => r?.recommendation?.trim());

  // Check if Entry 2 has any data
  const hasEntry2Data =
    data?.date2 ||
    data?.facilityName2 ||
    data?.medicalProvider2 ||
    data?.specialty2 ||
    data?.questionsForProvider2?.some((q) => q?.question?.trim()) ||
    data?.updatesFromProvider2?.some((u) => u?.update?.trim()) ||
    data?.recommendationsNextSteps2?.some((r) => r?.recommendation?.trim());

  return (
    <Document title="Agensy In-Patient Stay Notes">
      <Page size="A4" style={styles.page}>
        <Text style={styles.formTitle}>Agensy In-Patient Stay Notes</Text>
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
          <Text
            style={styles.sectionContent}
          >{`Date of Birth: ${data?.dateOfBirth}`}</Text>
        </View>

        {/* Entry 1 Section - only show if it has data */}
        {hasEntry1Data && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Entry 1</Text>
            {data?.date1 && <Field label="Date">{data.date1}</Field>}
            {data?.facilityName1 && (
              <Field label="Facility Name">{data.facilityName1}</Field>
            )}
            {data?.medicalProvider1 && (
              <Field label="Medical Provider">{data.medicalProvider1}</Field>
            )}
            {data?.specialty1 && (
              <Field label="Specialty">{data.specialty1}</Field>
            )}
            <NotesLists
              questions={data?.questionsForProvider1}
              updates={data?.updatesFromProvider1}
              recommendations={data?.recommendationsNextSteps1}
            />
          </View>
        )}

        {/* Entry 2 Section - only show if it has data */}
        {hasEntry2Data && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Entry 2</Text>
            {data?.date2 && <Field label="Date">{data.date2}</Field>}
            {data?.facilityName2 && (
              <Field label="Facility Name">{data.facilityName2}</Field>
            )}
            {data?.medicalProvider2 && (
              <Field label="Medical Provider">{data.medicalProvider2}</Field>
            )}
            {data?.specialty2 && (
              <Field label="Specialty">{data.specialty2}</Field>
            )}
            <NotesLists
              questions={data?.questionsForProvider2}
              updates={data?.updatesFromProvider2}
              recommendations={data?.recommendationsNextSteps2}
            />
          </View>
        )}
      </Page>
    </Document>
  );
};
