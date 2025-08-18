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

export const ImportantPeopleInLifePDF: React.FC<{
  data?: ImportantPeopleInLifeFormData & {
    last_update?: { updatedAt?: string };
  };
}> = ({ data }) => (
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medical Power of Attorney</Text>
        <Field label="Name">{data?.medicalPOAName}</Field>
        <Field label="Phone">{data?.medicalPOAPhone}</Field>
        <Field label="Relationship">
          {
            RELATIONSHIP_TO_CLIENT.find(
              (item) => item.value === data?.medicalPOARelationship
            )?.label
          }
        </Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Power of Attorney</Text>
        <Field label="Name">{data?.financialPOAName}</Field>
        <Field label="Phone">{data?.financialPOAPhone}</Field>
        <Field label="Relationship">
          {
            RELATIONSHIP_TO_CLIENT.find(
              (item) => item.value === data?.financialPOARelationship
            )?.label
          }
        </Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lawyer</Text>
        <Field label="Name">{data?.lawyerName}</Field>
        <Field label="Phone">{data?.lawyerPhone}</Field>
        <Field label="Firm">{data?.lawyerFirm}</Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accountant or Tax Preparer</Text>
        <Field label="Name">{data?.accountantName}</Field>
        <Field label="Phone">{data?.accountantPhone}</Field>
        <Field label="Firm">{data?.accountantFirm}</Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Advisor</Text>
        <Field label="Name">{data?.financialAdvisorName}</Field>
        <Field label="Phone">{data?.financialAdvisorPhone}</Field>
        <Field label="Firm">{data?.financialAdvisorFirm}</Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trust Officer</Text>
        <Field label="Name">{data?.trustOfficerName}</Field>
        <Field label="Phone">{data?.trustOfficerPhone}</Field>
        <Field label="Agency">{data?.trustOfficerAgency}</Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contact #1</Text>
        <Field label="Name">{data?.emergencyContactOneName}</Field>
        <Field label="Phone">{data?.emergencyContactOnePhone}</Field>
        <Field label="Relationship">
          {
            RELATIONSHIP_TO_CLIENT.find(
              (item) => item.value === data?.emergencyContactOneRelationship
            )?.label
          }
        </Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contact #2</Text>
        <Field label="Name">{data?.emergencyContactTwoName}</Field>
        <Field label="Phone">{data?.emergencyContactTwoPhone}</Field>
        <Field label="Relationship">
          {
            RELATIONSHIP_TO_CLIENT.find(
              (item) => item.value === data?.emergencyContactTwoRelationship
            )?.label
          }
        </Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Neighbor</Text>
        <Field label="Name">{data?.neighborName}</Field>
        <Field label="Phone">{data?.neighborPhone}</Field>
        <Field label="Address">{data?.neighborAddress}</Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Close Friend or Relative</Text>
        <Field label="Name">{data?.closeFriendName}</Field>
        <Field label="Phone">{data?.closeFriendPhone}</Field>
        <Field label="Relationship">
          {
            RELATIONSHIP_TO_CLIENT.find(
              (item) => item.value === data?.closeFriendRelationship
            )?.label
          }
        </Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Faith or Spiritual Contact</Text>
        <Field label="Name">{data?.faithContactName}</Field>
        <Field label="Phone">{data?.faithContactPhone}</Field>
        <Field label="Affiliation">{data?.faithContactAffiliation}</Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Club or Group</Text>
        <Field label="Name">{data?.clubName}</Field>
        <Field label="Contact">{data?.clubPhone}</Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes and Reminders</Text>
        <Field label="Notes and Reminders">{data?.notesAndReminders}</Field>
      </View>
    </Page>
  </Document>
);
