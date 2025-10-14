import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Svg,
  Path,
} from "@react-pdf/renderer";
import type { ChecklistField } from "@agensy/types";
import { DateUtils } from "@agensy/utils";
import logo from "@agensy/assets/logo.jpg";
import { carePlanChecklistSchema } from "@agensy/config";

const BORDER = "#1f3d7a";
const BORDER_LITE = "#c5d2f2";
const HEADER_BG = "#e6f0ff";

const RightArrow = () => (
  <Svg
    width="8"
    height="8"
    viewBox="0 0 24 24"
    style={{ marginRight: 4, marginTop: 1 }}
  >
    <Path d="M8 5v14l11-7z" fill={BORDER} />
  </Svg>
);

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

  groupTitle: {
    backgroundColor: "#f8fafc",
    color: BORDER,
    fontWeight: "bold",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_LITE,
    fontSize: 10,
  },

  groupText: {
    color: BORDER,
    fontWeight: "normal",
    fontSize: 9,
    lineHeight: 1.2,
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER_LITE,
  },

  checkboxIcon: {
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: BORDER,
    marginRight: 6,
    marginTop: 1,
    backgroundColor: "white",
  },

  checkboxChecked: {
    backgroundColor: BORDER,
  },

  checkboxLabel: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.2,
  },

  radioContainer: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER_LITE,
  },

  radioLabel: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 3,
  },

  radioOption: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginLeft: 10,
    marginBottom: 2,
  },

  radioIcon: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: BORDER,
    marginRight: 6,
    marginTop: 2,
    backgroundColor: "white",
  },

  radioSelected: {
    backgroundColor: BORDER,
  },

  radioOptionLabel: {
    flex: 1,
    fontSize: 8,
    lineHeight: 1.2,
  },

  indentLevel1: {
    marginLeft: 15,
  },

  indentLevel2: {
    marginLeft: 30,
  },

  indentLevel3: {
    marginLeft: 45,
  },

  linkContainer: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER_LITE,
  },

  linkText: {
    fontSize: 9,
    lineHeight: 1.3,
  },

  linkUrl: {
    color: "#2563eb",
    textDecoration: "underline",
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

interface ChecklistFormData {
  [key: string]: boolean | string;
}

interface CarePlanChecklistPDFProps {
  data?: ChecklistFormData & {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    last_update: { updatedAt: string };
  };
  schema?: ChecklistField[];
}

// Get nesting level based on parentId chain
const getNestingLevel = (
  fieldId: string | undefined,
  schema: ChecklistField[]
): number => {
  if (!fieldId) return 0;

  let level = 0;
  let currentField = schema.find((f: ChecklistField) => f.id === fieldId);

  while (currentField?.parentId) {
    level++;
    currentField = schema.find(
      (f: ChecklistField) => f.id === currentField!.parentId
    );
  }

  return level;
};

const getFieldsByParent = (
  parentId: string | null,
  schema: ChecklistField[]
): ChecklistField[] => {
  return schema.filter((field: ChecklistField) => field.parentId === parentId);
};

const getFieldsByHeading = (
  headingId: string | undefined,
  schema: ChecklistField[]
): ChecklistField[] => {
  if (!headingId) return [];
  return schema.filter(
    (field: ChecklistField) =>
      field.headingId === headingId && field.type !== "heading"
  );
};

const CheckboxField: React.FC<{
  field: ChecklistField;
  data?: ChecklistFormData;
  schema: ChecklistField[];
  nestingLevel: number;
}> = ({ field, data, schema, nestingLevel }) => {
  const isChecked = field.id ? Boolean(data?.[field.id]) : false;
  const childFields = getFieldsByParent(field.id, schema);
  const indentStyle =
    nestingLevel === 1
      ? styles.indentLevel1
      : nestingLevel === 2
      ? styles.indentLevel2
      : nestingLevel >= 3
      ? styles.indentLevel3
      : {};

  return (
    <View>
      <View style={[styles.checkboxContainer, indentStyle]}>
        <View
          style={[
            styles.checkboxIcon,
            ...(isChecked ? [styles.checkboxChecked] : []),
          ]}
        />
        <Text style={styles.checkboxLabel}>{field.label}</Text>
      </View>
      {childFields.map((childField) => (
        <FieldRenderer
          key={childField.id}
          field={childField}
          data={data}
          schema={schema}
        />
      ))}
    </View>
  );
};

const RadioField: React.FC<{
  field: ChecklistField;
  data?: ChecklistFormData;
  schema: ChecklistField[];
  nestingLevel: number;
}> = ({ field, data, schema, nestingLevel }) => {
  const selectedValue = field.id ? data?.[field.id] : null;
  const childFields = getFieldsByParent(field.id, schema);
  const indentStyle =
    nestingLevel === 1
      ? styles.indentLevel1
      : nestingLevel === 2
      ? styles.indentLevel2
      : nestingLevel >= 3
      ? styles.indentLevel3
      : {};

  return (
    <View>
      <View style={[styles.radioContainer, indentStyle]}>
        {field.label && <Text style={styles.radioLabel}>{field.label}</Text>}
        {field.options?.map((option, index) => (
          <View key={index} style={styles.radioOption}>
            <View
              style={[
                styles.radioIcon,
                ...(selectedValue === option ? [styles.radioSelected] : []),
              ]}
            />
            <Text style={styles.radioOptionLabel}>{option}</Text>
          </View>
        ))}
      </View>
      {childFields.map((childField) => (
        <FieldRenderer
          key={childField.id}
          field={childField}
          data={data}
          schema={schema}
        />
      ))}
    </View>
  );
};

const GroupField: React.FC<{
  field: ChecklistField;
  data?: ChecklistFormData;
  schema: ChecklistField[];
  nestingLevel: number;
}> = ({ field, data, schema, nestingLevel }) => {
  const childFields = getFieldsByParent(field.id, schema);
  const indentStyle =
    nestingLevel === 1
      ? styles.indentLevel1
      : nestingLevel === 2
      ? styles.indentLevel2
      : nestingLevel >= 3
      ? styles.indentLevel3
      : {};

  return (
    <View>
      <View style={[styles.groupTitle, indentStyle]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RightArrow />
          <Text style={styles.groupText}>{field.label}</Text>
        </View>
      </View>
      {childFields.map((childField) => (
        <FieldRenderer
          key={childField.id}
          field={childField}
          data={data}
          schema={schema}
        />
      ))}
    </View>
  );
};

const LinkField: React.FC<{
  field: ChecklistField;
  nestingLevel: number;
}> = ({ field, nestingLevel }) => {
  const indentStyle =
    nestingLevel === 1
      ? styles.indentLevel1
      : nestingLevel === 2
      ? styles.indentLevel2
      : nestingLevel >= 3
      ? styles.indentLevel3
      : {};

  // Extract URLs from text for PDF display
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const segments: Array<{ text: string; url?: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = urlRegex.exec(field.label)) !== null) {
    // Add text before the URL
    if (match.index > lastIndex) {
      segments.push({ text: field.label.slice(lastIndex, match.index) });
    }

    // Add the URL segment
    segments.push({ text: match[1], url: match[1] });

    lastIndex = match.index + match[1].length;
  }

  // Add remaining text after the last URL
  if (lastIndex < field.label.length) {
    segments.push({ text: field.label.slice(lastIndex) });
  }

  return (
    <View>
      <View style={[styles.groupTitle, indentStyle]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RightArrow />
          <Text style={styles.groupTitle}>
            {segments.map((segment, index) => (
              <Text key={index}>
                {segment.url ? (
                  <Text style={styles.linkUrl}>{segment.text}</Text>
                ) : (
                  segment.text
                )}
              </Text>
            ))}
          </Text>
        </View>
      </View>
    </View>
  );
};

const FieldRenderer: React.FC<{
  field: ChecklistField;
  data?: ChecklistFormData;
  schema: ChecklistField[];
}> = ({ field, data, schema }) => {
  const nestingLevel = getNestingLevel(field.id, schema);

  if (field.type === "group") {
    return (
      <GroupField
        field={field}
        data={data}
        schema={schema}
        nestingLevel={nestingLevel}
      />
    );
  }

  if (field.type === "checkbox") {
    return (
      <CheckboxField
        field={field}
        data={data}
        schema={schema}
        nestingLevel={nestingLevel}
      />
    );
  }

  if (field.type === "radio") {
    return (
      <RadioField
        field={field}
        data={data}
        schema={schema}
        nestingLevel={nestingLevel}
      />
    );
  }

  if (field.type === "link") {
    return <LinkField field={field} nestingLevel={nestingLevel} />;
  }

  return null;
};

export const CarePlanChecklistPDF: React.FC<CarePlanChecklistPDFProps> = ({
  data,
  schema = carePlanChecklistSchema,
}) => {
  const headings = schema.filter((field) => field.type === "heading");

  return (
    <Document title="Agensy Care Plan Checklist">
      <Page size="A4" style={styles.page}>
        <Text style={styles.formTitle}>Agensy Care Plan Checklist</Text>
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

        {headings.map((heading) => {
          const headingFields = getFieldsByHeading(heading.headingId, schema);
          const rootFields = headingFields.filter((field) => !field.parentId);

          return (
            <View key={heading.id} style={styles.section}>
              <Text style={styles.sectionTitle}>{heading.label}</Text>
              {rootFields.map((field) => (
                <FieldRenderer
                  key={field.id}
                  field={field}
                  data={data}
                  schema={schema}
                />
              ))}
            </View>
          );
        })}
      </Page>
    </Document>
  );
};
