import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
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

  categoryHeader: {
    backgroundColor: "#f8f9fa",
    padding: 6,
    fontWeight: "bold",
    fontSize: 10,
    color: BORDER,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_LITE,
  },

  documentRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER_LITE,
    padding: 4,
  },

  documentName: {
    flex: 2,
    padding: 4,
    fontSize: 9,
  },

  inPlace: {
    flex: 1,
    padding: 4,
    fontSize: 9,
    textAlign: "center",
  },

  notes: {
    flex: 2,
    padding: 4,
    fontSize: 9,
  },

  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: BORDER_LITE,
    padding: 4,
  },

  tableHeaderCell: {
    flex: 1,
    padding: 4,
    fontWeight: "bold",
    fontSize: 8,
    textAlign: "center",
  },

  tableHeaderCellDocument: {
    flex: 2,
    padding: 4,
    fontWeight: "bold",
    fontSize: 8,
  },

  tableHeaderCellNotes: {
    flex: 2,
    padding: 4,
    fontWeight: "bold",
    fontSize: 8,
  },

  instructions: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 10,
    color: "#666",
  },
});

interface AdvanceCareDocument {
  id?: string;
  category: string;
  document_name: string;
  in_place: boolean;
  notes?: string | null;
}

interface EssentialDocumentsData {
  essential_documents: AdvanceCareDocument[];
  last_update?: { updatedAt: string };
}

const EssentialDocumentsForAgingPDF: React.FC<{
  data?: EssentialDocumentsData;
}> = ({ data }) => {
  const groupedDocuments =
    data?.essential_documents?.reduce((acc, doc) => {
      if (!acc[doc.category]) {
        acc[doc.category] = [];
      }
      acc[doc.category].push(doc);
      return acc;
    }, {} as Record<string, AdvanceCareDocument[]>) || {};

  const categories = Object.keys(groupedDocuments);

  return (
    <Document title="Agensy Essential Documents for Aging">
      <Page size="A4" style={styles.page}>
        <Text style={styles.formTitle}>Essential Documents for Aging</Text>
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
          <Text style={styles.sectionTitle}>Instructions</Text>
          <View style={{ padding: 8 }}>
            <Text style={styles.instructions}>
              It's essential for care recipients to have all of their legal
              documents completed and up to date to ensure their wishes are
              honored and to avoid delays or confusion during a medical or
              financial crisis. Each state has its own laws and forms for
              documents like advance directives, powers of attorney, and DNR
              orders, so it's important that care recipients either consult an
              attorney or, at minimum, verify they are using the correct forms
              by checking their state government's website. If they plan to move
              to another state, their documents may need to be updated to remain
              valid.
            </Text>
            <Text style={styles.instructions}>
              Care recipients should also inform their designated powers of
              attorney where these documents are kept and how to access them. In
              some cases, such as out-of-hospital DNR orders, state regulations
              may require that the documents be posted in a visible location
              like the refrigerator to be honored by emergency responders.
              Keeping these documents accurate, accessible, and state-compliant
              helps ensure peace of mind for both the individual and their loved
              ones.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Essential Documents Checklist</Text>

          <View style={styles.tableHeaderRow}>
            <Text style={styles.tableHeaderCellDocument}>Document Name</Text>
            <Text style={styles.tableHeaderCell}>In place? Yes / No</Text>
            <Text style={styles.tableHeaderCellNotes}>
              Notes (Where is the document kept. Who has a copy)
            </Text>
          </View>

          {categories.map((category) => (
            <View key={category}>
              <Text style={styles.categoryHeader}>{category}</Text>

              {groupedDocuments[category].map((document, index) => (
                <View key={document.id || index} style={styles.documentRow}>
                  <Text style={styles.documentName}>
                    {document.document_name}
                  </Text>
                  <Text style={styles.inPlace}>
                    {document.in_place ? "✓ Yes" : "✗ No"}
                  </Text>
                  <Text style={styles.notes}>{document.notes || " "}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default EssentialDocumentsForAgingPDF;
