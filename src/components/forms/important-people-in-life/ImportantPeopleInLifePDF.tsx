import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { ImportantPeopleInLifeFormData } from "@agensy/types";
import { DateUtils } from "@agensy/utils";
import logo from "@agensy/assets/logo.png";
import { RELATIONSHIP_TO_CLIENT } from "@agensy/constants";

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

// Helper function to get relationship display text
const getRelationshipDisplay = (value?: string) => {
  if (!value) return "";
  const relationship = RELATIONSHIP_TO_CLIENT.find(
    (item) => item.value === value
  );
  return relationship?.label || value;
};

// Helper function to get section title based on person type
const getSectionTitle = (type: string) => {
  switch (type) {
    case "medical_poa":
      return "Medical Power of Attorney";
    case "financial_poa":
      return "Financial Power of Attorney";
    case "lawyer":
      return "Lawyer";
    case "accountant":
      return "Accountant or Tax Preparer";
    case "financial_advisor":
      return "Financial Advisor";
    case "trust_officer":
      return "Trust Officer";
    case "emergency_contact_1":
      return "Emergency Contact #1";
    case "emergency_contact_2":
      return "Emergency Contact #2";
    case "neighbor":
      return "Neighbor";
    case "close_friend":
      return "Close Friend or Relative";
    case "faith_contact":
      return "Faith or Spiritual Contact";
    case "club_group":
      return "Club or Group";
    default:
      return "Important Person";
  }
};

export const ImportantPeopleInLifePDF: React.FC<{
  data?: ImportantPeopleInLifeFormData & {
    last_update?: { updatedAt?: string };
  };
}> = ({ data }) => {
  // Group people by type for better organization
  const groupedPeople =
    data?.importantPeople?.reduce((acc, person) => {
      if (person.type && person.name) {
        if (!acc[person.type]) {
          acc[person.type] = [];
        }
        acc[person.type].push(person);
      }
      return acc;
    }, {} as Record<string, typeof data.importantPeople>) || {};

  return (
    <Document title="Agensy Important People in Life">
      <Page size="A4" style={styles.page}>
        <Text style={styles.formTitle}>Agensy Important People in Life</Text>

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

        {/* Render grouped sections */}
        {Object.entries(groupedPeople).map(([type, people]) => (
          <View key={type} style={styles.section}>
            <Text style={styles.sectionTitle}>{getSectionTitle(type)}</Text>
            {people?.map((person, index) => (
              <React.Fragment key={index}>
                {person.name && <Field label="Name">{person.name}</Field>}
                {person.phone && <Field label="Phone">{person.phone}</Field>}
                {person.relationship && (
                  <Field label="Relationship">
                    {getRelationshipDisplay(person.relationship)}
                  </Field>
                )}
                {person.firm && <Field label="Firm">{person.firm}</Field>}
                {person.agency && <Field label="Agency">{person.agency}</Field>}
                {person.affiliation && (
                  <Field label="Affiliation">{person.affiliation}</Field>
                )}
                {person.address && (
                  <Field label="Address">{person.address}</Field>
                )}
              </React.Fragment>
            ))}
          </View>
        ))}

        {/* Notes and Reminders Section */}
        {data?.notesAndReminders && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes and Reminders</Text>
            <Field label="Notes and Reminders">{data.notesAndReminders}</Field>
          </View>
        )}
      </Page>
    </Document>
  );
};
