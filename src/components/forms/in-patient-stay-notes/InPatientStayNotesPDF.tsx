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
  // Get the in-patient stay notes array
  const inPatientStayNotes = data?.inPatientStayNotes || [];

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

        {/* In-Patient Stay Notes - render each note */}
        {inPatientStayNotes.length === 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>In-Patient Stay Notes</Text>
            <Text style={styles.sectionContent}>
              No in-patient stay notes available.
            </Text>
          </View>
        ) : (
          inPatientStayNotes.map((note, index) => {
            // Check if this note has any data
            const hasNoteData =
              note?.date ||
              note?.facilityName ||
              note?.medicalProvider ||
              note?.specialty ||
              note?.questionsForProvider?.some((q) => q?.question?.trim()) ||
              note?.updatesFromProvider?.some((u) => u?.update?.trim()) ||
              note?.recommendationsNextSteps?.some((r) =>
                r?.recommendation?.trim()
              );

            if (!hasNoteData) return null;

            return (
              <View key={note.id || index} style={styles.section}>
                <Text style={styles.sectionTitle}>
                  In-Patient Stay Note {index + 1}
                </Text>
                {note?.date && <Field label="Date">{note.date}</Field>}
                {note?.facilityName && (
                  <Field label="Facility Name">{note.facilityName}</Field>
                )}
                {note?.medicalProvider && (
                  <Field label="Medical Provider">{note.medicalProvider}</Field>
                )}
                {note?.specialty && (
                  <Field label="Specialty">{note.specialty}</Field>
                )}
                <NotesLists
                  questions={note?.questionsForProvider}
                  updates={note?.updatesFromProvider}
                  recommendations={note?.recommendationsNextSteps}
                />
              </View>
            );
          })
        )}
      </Page>
    </Document>
  );
};
