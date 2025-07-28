import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { InitialCareAssessmentPlanFormData } from "@agensy/types";
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

  recommendationItem: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER_LITE,
    padding: 4,
  },
  recommendationTitle: {
    fontWeight: "bold",
    fontSize: 10,
    marginBottom: 2,
  },
  recommendationContent: {
    fontSize: 9,
    marginBottom: 2,
  },
  detailsList: {
    marginLeft: 10,
    fontSize: 8,
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
    {label && <Text style={styles.label}>{label}</Text>}
    <Text style={styles.value}>{children ?? " "}</Text>
  </View>
);

const InitialCareAssessmentPlanPDF: React.FC<{
  data?: InitialCareAssessmentPlanFormData & {
    last_update: { updatedAt: string };
  };
}> = ({ data }) => {
  return (
    <Document title="Initial Care Assessment Plan">
      <Page size="A4" style={styles.page}>
        <Text style={styles.formTitle}>Initial Care Assessment Plan</Text>
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
          <Text style={styles.sectionTitle}>Initial Care Assessment Plan</Text>
          <Field label="First Name">{data?.firstName}</Field>
          <Field label="Last Name">{data?.lastName}</Field>
          <Field label="Date of Birth">
            {data?.dateOfBirth
              ? DateUtils.formatDateToRequiredFormat(data.dateOfBirth)
              : ""}
          </Field>
          <Field label="Date of Assessment">
            {data?.dateOfAssessment
              ? DateUtils.formatDateToRequiredFormat(data.dateOfAssessment)
              : ""}
          </Field>
          <Field label="Date of Care Plan">
            {data?.dateOfCarePlan
              ? DateUtils.formatDateToRequiredFormat(data.dateOfCarePlan)
              : ""}
          </Field>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assessment Information</Text>
          <Field label="Person Completing Assessment">
            {data?.personCompletingAssessment}
          </Field>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assessment Details</Text>
          <Field label="Present for Assessment">
            {data?.presentForAssessment}
          </Field>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goals for Assessment</Text>
          <Field label="Goals for Assessment (comma separated)">
            {data?.goalsForAssessment}
          </Field>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Focused Recommendations</Text>
          {(data?.focusedRecommendations ?? [])
            .filter(
              (rec) =>
                rec &&
                (rec.name ||
                  rec.description ||
                  (rec.details && rec.details.length > 0))
            )
            .map((recommendation, index) => (
              <View key={index} style={styles.recommendationItem}>
                <Text style={styles.recommendationTitle}>
                  Option {index + 1}:{" "}
                  {recommendation.name || "Unnamed Recommendation"}
                </Text>
                {recommendation.description && (
                  <Text style={styles.recommendationContent}>
                    Description: {recommendation.description}
                  </Text>
                )}
                {recommendation.details &&
                  recommendation.details.length > 0 && (
                    <View>
                      <Text style={styles.recommendationContent}>Details:</Text>
                      {recommendation.details.map((detail, detailIndex) => (
                        <Text key={detailIndex} style={styles.detailsList}>
                          • {detail}
                        </Text>
                      ))}
                    </View>
                  )}
              </View>
            ))}
          {(data?.focusedRecommendations ?? []).filter(
            (rec) =>
              rec &&
              (rec.name ||
                rec.description ||
                (rec.details && rec.details.length > 0))
          ).length === 0 && <Field label="Recommendations">None</Field>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Functional</Text>
          <Field label="Activities of Daily Living (ADLs)">
            {data?.functionalAdls?.summary}
          </Field>
          <Field label="Independent Activities of Daily Living (IADLs)">
            {data?.functionalIadls?.summary}
          </Field>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Home Safety</Text>
          <Field label="Home Safety Summary">{data?.homeSafety?.summary}</Field>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Memory & Reasoning</Text>
          <Field label="Memory & Reasoning Summary">
            {data?.memoryAndRecommendations?.summary}
          </Field>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Geriatric Depression</Text>
          <Field label="Geriatric Depression Summary">
            {data?.geriatricDepression?.summary}
          </Field>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutritional Health</Text>
          <Field label="Nutritional Health Summary">
            {data?.nutritionalHealth?.summary}
          </Field>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal and Financial</Text>
          <Field label="Legal and Financial Summary">
            {data?.legalAndFinancial?.summary}
          </Field>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Caregiver Support</Text>
          <Field label="Caregiver Support Summary">
            {data?.caregiverSupport?.summary}
          </Field>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Steps - Care Recipient</Text>
          <Field label="Next Steps for Care Recipient">
            {(data?.nextStepCareRecipient ?? []).join(", ") || "None"}
          </Field>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Steps - Care Partner</Text>
          <Field label="Next Steps for Care Partner">
            {(data?.nextStepCarePartner ?? []).join(", ") || "None"}
          </Field>
        </View>
      </Page>
    </Document>
  );
};

export default InitialCareAssessmentPlanPDF;
