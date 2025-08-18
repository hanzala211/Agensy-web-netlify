import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { PersonalInfoFormData } from "@agensy/types";
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

const TableHeader = ({ columns }: { columns: string[] }) => (
  <View style={styles.tableHeader}>
    {columns.map((c, i) => (
      <Text key={i} style={styles.th}>
        {c}
      </Text>
    ))}
  </View>
);

const TableRow = ({
  cells,
  last,
}: {
  cells: (string | undefined | null)[];
  last?: boolean;
}) => (
  <View style={[styles.tableRow, last ? { borderBottomWidth: 0 } : {}]}>
    {cells.map((c, i) => (
      <Text key={i} style={styles.td}>
        {c ?? " "}
      </Text>
    ))}
  </View>
);

export const PersonalInfoPDF: React.FC<{
  data?: PersonalInfoFormData & { last_update?: { updatedAt?: string } };
}> = ({ data }) => (
  <Document title="Agensy Personal Information">
    <Page size="A4" style={styles.page}>
      <Text style={styles.formTitle}>Agensy Personal Information</Text>

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
        <Text style={styles.sectionTitle}>Personal Identification</Text>
        <Field label="First Name">{data?.firstName}</Field>
        <Field label="Last Name">{data?.lastName}</Field>
        <Field label="Date of Birth">{data?.dateOfBirth}</Field>
        <Field label="Social Security Number">
          {data?.socialSecurityNumber}
        </Field>
        <Field label="Driver's License Number">
          {data?.driversLicenseNumber}
        </Field>
        <Field label="Driver's License State">
          {data?.driversLicenseState}
        </Field>
        <Field label="Passport Number">{data?.passportNumber}</Field>
        <Field label="Passport Expiration Date">
          {data?.passportExpirationDate}
        </Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Information</Text>
        <Field label="First Name">{data?.emergencyContactFirstName}</Field>
        <Field label="Last Name">{data?.emergencyContactLastName}</Field>
        <Field label="Phone">{data?.emergencyContactPhone}</Field>
        <Field label="Relationship">{data?.emergencyContactRelationship}</Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Accounts</Text>
        <Field label="Bank Name">{data?.bankName}</Field>
        <Field label="Bank Account Type">{data?.bankAccountType}</Field>
        <Field label="Bank Account (partial)">
          {data?.bankAccountNumberPartial}
        </Field>
        <Field label="Bank Online Login Info">
          {data?.bankOnlineLoginInfo}
        </Field>
        <Field label="Credit Card Issuer">{data?.creditCardIssuer}</Field>
        <Field label="Credit Card Last 4">
          {data?.creditCardLastFourDigits}
        </Field>
        <Field label="Credit Card Online Login Info">
          {data?.creditCardOnlineLoginInfo}
        </Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Utilities & Subscriptions</Text>
        <Field label="Electricity Provider">{data?.electricityProvider}</Field>
        <Field label="Electricity Username">{data?.electricityUsername}</Field>
        <Field label="Electricity Password">{data?.electricityPassword}</Field>
        <Field label="Internet Provider">{data?.internetProvider}</Field>
        <Field label="Internet Username">{data?.internetUsername}</Field>
        <Field label="Internet Password">{data?.internetPassword}</Field>
        <Field label="Phone Provider">{data?.phoneProvider}</Field>
        <Field label="Phone Username">{data?.phoneUsername}</Field>
        <Field label="Phone Password">{data?.phonePassword}</Field>
        <Field label="Streaming Services">{data?.streamingServices}</Field>
        <Field label="Streaming Username">{data?.streamingUsername}</Field>
        <Field label="Streaming Password">{data?.streamingPassword}</Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Digital Accounts & Passwords</Text>
        <TableHeader
          columns={["Website / App", "Username / Email", "Password", "Notes"]}
        />
        {(data?.digitalAccounts ?? []).map((acc, i, arr) => (
          <TableRow
            key={i}
            cells={[
              acc?.accountWebsite ?? "",
              acc?.usernameEmail ?? "",
              acc?.password ?? "",
              acc?.notes ?? "",
            ]}
            last={i === (arr?.length || 0) - 1}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Common Questions</Text>
        <Field label="Banking History (Institutions)">
          {data?.bankingHistoryInstitutions}
        </Field>
        <Field label="Monthly Car/Mortgage Payment">
          {data?.monthlyCarMortgagePayment}
        </Field>
        <Field label="Previous Street Names">{data?.previousStreetNames}</Field>
        <Field label="Credit Card Institutions">
          {data?.creditCardInstitutions}
        </Field>
        <Field label="Mother's Maiden Name">{data?.mothersMaidenName}</Field>
        <Field label="Social Security Question">
          {data?.socialSecurityQuestion}
        </Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes & Backup Contacts</Text>
        <Field label="Trusted Person Name">{data?.trustedPersonName}</Field>
        <Field label="Trusted Person Phone">{data?.trustedPersonPhone}</Field>
        <Field label="Additional Notes">{data?.additionalNotes}</Field>
      </View>
    </Page>
  </Document>
);
