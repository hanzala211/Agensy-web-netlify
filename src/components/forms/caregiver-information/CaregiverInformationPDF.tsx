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
  ChecklistField,
  CaregiverInformationFormData,
} from "@agensy/types";
import { DateUtils } from "@agensy/utils";
import logo from "@agensy/assets/logo.png";
import { caregiverInformationSchema } from "@agensy/config";

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
    marginBottom: 15,
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
    width: "32%",
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: BORDER_LITE,
    fontWeight: "bold",
  },
  value: { flex: 1, padding: 4 },

  groupContainer: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER_LITE,
  },

  groupLabel: {
    fontSize: 9,
    lineHeight: 1.2,
    fontStyle: "italic",
  },

  nestedContainer: {
    marginLeft: 12,
    marginTop: 2,
  },

  personalInfoSection: {
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 10,
  },

  personalInfoTitle: {
    backgroundColor: HEADER_BG,
    color: BORDER,
    fontWeight: "bold",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    fontSize: 12,
  },

  personalInfoContent: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 10,
    lineHeight: 1.3,
  },
});

const getFieldsByHeading = (headingId: string, schema: ChecklistField[]) => {
  return schema.filter((field) => field.headingId === headingId);
};

const formatTime = (timeValue: string | null | undefined): string => {
  if (!timeValue) return "N/A";

  // If the time already has the correct format (HH:MM), return it
  if (timeValue.includes(":") && timeValue.split(":").length === 2) {
    return timeValue;
  }

  // If it has seconds (HH:MM:SS), remove them
  if (timeValue.includes(":") && timeValue.split(":").length === 3) {
    const parts = timeValue.split(":");
    return `${parts[0]}:${parts[1]}`;
  }

  return timeValue;
};

const GroupField: React.FC<{
  field: ChecklistField;
  schema: ChecklistField[];
}> = ({ field }) => {
  return (
    <View style={styles.groupContainer}>
      <Text style={styles.groupLabel}>{field.label}</Text>
    </View>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <View style={styles.fieldRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{children || "N/A"}</Text>
  </View>
);

interface CaregiverInformationPDFProps {
  data?: CaregiverInformationFormData & {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    last_update: { updatedAt: string };
  };
  schema?: ChecklistField[];
}

export const CaregiverInformationPDF: React.FC<
  CaregiverInformationPDFProps
> = ({ data, schema = caregiverInformationSchema }) => {
  const headings = schema.filter((field) => field.type === "heading");

  return (
    <Document title="Agensy Caregiver Information">
      <Page size="A4" style={styles.page}>
        <Text style={styles.formTitle}>Agensy Caregiver Information</Text>
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

        {/* Personal Information Section */}
        {(data?.firstName || data?.lastName || data?.dateOfBirth) && (
          <View style={styles.personalInfoSection}>
            <Text style={styles.personalInfoTitle}>Personal Information</Text>
            <View style={styles.personalInfoContent}>
              {(data?.firstName || data?.lastName) && (
                <Text>
                  {`${data?.firstName || ""} ${data?.lastName || ""}`.trim()}
                </Text>
              )}
              {data?.dateOfBirth && (
                <Text style={{ marginTop: 4 }}>
                  {`Date of Birth: ${DateUtils.formatDateToRequiredFormat(
                    data.dateOfBirth
                  )}`}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Caregiver Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Caregiver Information</Text>
          <Field label="Name">{data?.name}</Field>
          {data?.nickname_preferred_name && (
            <Field label="Nickname/Preferred Name">
              {data.nickname_preferred_name}
            </Field>
          )}
        </View>

        {/* Schedule Section */}
        {(data?.wake_time ||
          data?.sleep_time ||
          data?.breakfast_time ||
          data?.lunch_time ||
          data?.snacks_time ||
          data?.activity_time ||
          data?.nap_time ||
          data?.dinner_time ||
          data?.medication_time) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Schedule</Text>
            {data.wake_time && (
              <Field label="Wake Time">{formatTime(data.wake_time)}</Field>
            )}
            {data.sleep_time && (
              <Field label="Sleep Time">{formatTime(data.sleep_time)}</Field>
            )}
            {data.breakfast_time && (
              <Field label="Breakfast Time">
                {formatTime(data.breakfast_time)}
              </Field>
            )}
            {data.lunch_time && (
              <Field label="Lunch Time">{formatTime(data.lunch_time)}</Field>
            )}
            {data.snacks_time && (
              <Field label="Snacks Time">{formatTime(data.snacks_time)}</Field>
            )}
            {data.activity_time && (
              <Field label="Activity Time">
                {formatTime(data.activity_time)}
              </Field>
            )}
            {data.nap_time && (
              <Field label="Nap Time">{formatTime(data.nap_time)}</Field>
            )}
            {data.dinner_time && (
              <Field label="Dinner Time">{formatTime(data.dinner_time)}</Field>
            )}
            {data.medication_time && (
              <Field label="Medication Time">
                {formatTime(data.medication_time)}
              </Field>
            )}
          </View>
        )}

        {/* Likes Section */}
        {data?.likes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Likes</Text>
            <Field label="Likes">{data.likes}</Field>
          </View>
        )}

        {/* Dislikes Section */}
        {data?.dislikes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dislikes</Text>
            <Field label="Dislikes">{data.dislikes}</Field>
          </View>
        )}

        {/* Redirection Techniques Section */}
        {data?.redirection_techniques && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Redirection Techniques</Text>
            <Field label="Redirection Techniques">
              {data.redirection_techniques}
            </Field>
          </View>
        )}

        {/* Triggers Section */}
        {data?.triggers && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Triggers</Text>
            <Field label="Triggers">{data.triggers}</Field>
          </View>
        )}

        {/* Helpful Information Section */}
        {data?.helpful_information && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Helpful Information</Text>
            <Field label="Helpful Information">
              {data.helpful_information}
            </Field>
          </View>
        )}

        {/* Documentation Section */}
        {data?.documentation && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Documentation</Text>
            <Field label="Documentation">{data.documentation}</Field>
          </View>
        )}

        {/* Schema-based Sections */}
        {headings.map((heading) => {
          const headingFields = getFieldsByHeading(
            heading.headingId as string,
            schema
          );
          const rootFields = headingFields.filter((field) => !field.parentId);

          // Only show schema-based sections if they have fields with data
          if (rootFields.length === 0) return null;

          return (
            <View key={heading.id} style={styles.section}>
              <Text style={styles.sectionTitle}>{heading.label}</Text>
              {rootFields.map((field) => (
                <GroupField key={field.id} field={field} schema={schema} />
              ))}
            </View>
          );
        })}
      </Page>
    </Document>
  );
};
