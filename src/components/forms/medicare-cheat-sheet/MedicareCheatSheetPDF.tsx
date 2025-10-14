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
import { medicareCheatSheetSchema } from "@agensy/config";

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

  groupContent: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    fontSize: 9,
    lineHeight: 1.2,
  },

  linkContainer: {
    paddingVertical: 3,
    paddingHorizontal: 6,
  },

  linkText: {
    fontSize: 9,
    lineHeight: 1.3,
  },

  linkUrl: {
    color: "#2563eb",
    textDecoration: "underline",
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

  indentLevel4: {
    marginLeft: 60,
  },

  indentLevel5: {
    marginLeft: 75,
  },

  // Table styles
  tableSection: {
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 10,
  },

  tableTitle: {
    backgroundColor: HEADER_BG,
    color: BORDER,
    fontWeight: "bold",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    fontSize: 12,
    textAlign: "center",
  },

  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
  },

  tableHeader: {
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },

  tableHeaderCell: {
    padding: 6,
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#000",
    color: BORDER,
  },

  tableHeaderCellLast: {
    padding: 6,
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
    color: BORDER,
  },

  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },

  tableRowAlt: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    backgroundColor: "#f8f9fa",
  },

  tableCell: {
    padding: 6,
    fontSize: 7,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#000",
    lineHeight: 1.2,
  },

  tableCellLast: {
    padding: 6,
    fontSize: 7,
    textAlign: "center",
    lineHeight: 1.2,
  },

  tableCellFirst: {
    padding: 6,
    fontSize: 7,
    textAlign: "left",
    borderRightWidth: 1,
    borderRightColor: "#000",
    lineHeight: 1.2,
    fontWeight: "bold",
    color: "#000",
  },
});

interface ChecklistFormData {
  [key: string]: boolean | string;
}

interface MedicareCheatSheetPDFProps {
  data?: ChecklistFormData & { last_update: { updatedAt: string } };
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

const GroupField: React.FC<{
  field: ChecklistField;
  schema: ChecklistField[];
  nestingLevel: number;
}> = ({ field, schema, nestingLevel }) => {
  const childFields = getFieldsByParent(field.id, schema);
  const indentStyle =
    nestingLevel === 1
      ? styles.indentLevel1
      : nestingLevel === 2
      ? styles.indentLevel2
      : nestingLevel === 3
      ? styles.indentLevel3
      : nestingLevel === 4
      ? styles.indentLevel4
      : nestingLevel >= 5
      ? styles.indentLevel5
      : {};

  return (
    <View>
      <View style={[styles.groupContent, indentStyle]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RightArrow />
          <Text style={styles.groupContent}>{field.label}</Text>
        </View>
      </View>
      {childFields.map((childField) => (
        <FieldRenderer key={childField.id} field={childField} schema={schema} />
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
      : nestingLevel === 3
      ? styles.indentLevel3
      : nestingLevel === 4
      ? styles.indentLevel4
      : nestingLevel >= 5
      ? styles.indentLevel5
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
    <View style={[styles.linkContainer, indentStyle]}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <RightArrow />
        <Text style={styles.linkText}>
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
  );
};

const FieldRenderer: React.FC<{
  field: ChecklistField;
  schema: ChecklistField[];
}> = ({ field, schema }) => {
  const nestingLevel = getNestingLevel(field.id, schema);

  if (field.type === "group") {
    return (
      <GroupField field={field} schema={schema} nestingLevel={nestingLevel} />
    );
  }

  if (field.type === "link") {
    return <LinkField field={field} nestingLevel={nestingLevel} />;
  }

  return null;
};

const MedicareComparisonTable: React.FC = () => {
  const tableData = [
    {
      feature: "Premium Cost",
      traditional: "Part B premium",
      ppo: "Part B premium and plan premium",
      hmo: "Part B premium and plan premium",
    },
    {
      feature: "Prescription Drug Plan",
      traditional: "Not included",
      ppo: "Included",
      hmo: "Included",
    },
    {
      feature:
        "Referrals (PCP has to send a referral to a specialist for you to be able to schedule an app!)",
      traditional: "No referrals needed",
      ppo: "No referrals needed",
      hmo: "Referrals needed",
    },
    {
      feature: "Doctors",
      traditional: "Can see anyone in the U.S. that accepts Medicare",
      ppo: "Restrictions apply – must be in-network and within service area",
      hmo: "Restrictions apply – must be in-network and within service area",
    },
    {
      feature: "Hospitals",
      traditional: "Can go anywhere in the U.S. that takes Medicare",
      ppo: "Restrictions apply",
      hmo: "Restrictions apply",
    },
    {
      feature:
        "Service Area (can I use it out of state if I'm traveling or visiting relatives?)",
      traditional: "Nationwide",
      ppo: "May be restricted to particular service areas",
      hmo: "May be restricted to particular service areas",
    },
    {
      feature: "Out-Of-Pocket Yearly Limit",
      traditional: "No limit",
      ppo: "Limit",
      hmo: "Limit",
    },
  ];

  return (
    <View style={styles.tableSection}>
      <Text style={styles.tableTitle}>
        TRADITIONAL MEDICINE VS MEDICARE ADVANTAGE PLANS
      </Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}></Text>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>
              Traditional Medicare
            </Text>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>
              Medicare Advantage PPO
            </Text>
            <Text style={[styles.tableHeaderCellLast, { flex: 2 }]}>
              Medicare Advantage HMO
            </Text>
          </View>
        </View>
        {tableData.map((row, index) => (
          <View
            key={index}
            style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.tableCellFirst, { flex: 2 }]}>
                {row.feature}
              </Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                {row.traditional}
              </Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>{row.ppo}</Text>
              <Text style={[styles.tableCellLast, { flex: 2 }]}>{row.hmo}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export const MedicareCheatSheetPDF: React.FC<MedicareCheatSheetPDFProps> = ({
  data,
  schema = medicareCheatSheetSchema,
}) => {
  const headings = schema.filter((field) => field.type === "heading");

  return (
    <Document title="Agensy Medicare Cheat Sheet">
      <Page size="A4" style={styles.page}>
        <Text style={styles.formTitle}>Agensy Medicare Cheat Sheet</Text>
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

        {headings.map((heading) => {
          const headingFields = getFieldsByHeading(heading.headingId, schema);
          const rootFields = headingFields.filter((field) => !field.parentId);

          return (
            <View key={heading.id} style={styles.section}>
              <Text style={styles.sectionTitle}>{heading.label}</Text>
              {rootFields.map((field) => (
                <FieldRenderer key={field.id} field={field} schema={schema} />
              ))}
            </View>
          );
        })}

        <MedicareComparisonTable />
      </Page>
    </Document>
  );
};
