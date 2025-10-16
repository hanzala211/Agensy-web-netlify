import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { FaceSheetShortFormData } from "@agensy/types";
import {
  ADVANCE_DIRECTIVE_OPTIONS,
  CODE_STATUS_OPTIONS,
  RELATIONSHIP_TO_CLIENT,
  STATES,
} from "@agensy/constants";
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
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 14,
    marginTop: 5,
    color: BORDER,
  },
  headerDateBoxContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 5,
    gap: 5,
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
  cells: (string | undefined)[];
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

const FaceSheetShortFormPDF: React.FC<{
  data?: FaceSheetShortFormData & { last_update: { updatedAt: string } };
}> = ({ data }) => {
  return (
    <Document title="Agensy Face Sheet - Short Form">
      <Page size="A4" style={styles.page}>
        <Text style={styles.formTitle}>Agensy Face Sheet - Short Form</Text>
        <View style={styles.headerRow}>
          <Image src={logo} style={styles.headerLogo} />
          <View style={styles.headerDateBoxContainer}>
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
          <Text style={styles.sectionTitle}>Patient Information</Text>
          <Field label="Name">
            {data?.firstName} {data?.lastName}
          </Field>
          {data?.preferredName && (
            <Field label="Preferred name">{data.preferredName}</Field>
          )}
          {data?.dateOfBirth && (
            <Field label="Date of Birth">{data.dateOfBirth}</Field>
          )}
          {data?.phone && <Field label="Phone Number">{data.phone}</Field>}
          {data?.city && <Field label="City">{data.city}</Field>}
          {data?.state && (
            <Field label="State">
              {STATES.find((item) => item.value === data.state)?.label}
            </Field>
          )}
          {data?.zip && <Field label="Zip Code">{data.zip}</Field>}
          {data?.address && <Field label="Address">{data.address}</Field>}
          {data?.ssn && <Field label="SSN">{data.ssn}</Field>}
        </View>

        {(data?.emergencyContactFirstName ||
          data?.emergencyContactLastName ||
          data?.emergencyContactRelationship ||
          data?.emergencyContactPhone ||
          data?.emergencyContactEmail ||
          data?.emergencyContactAddress) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emergency Contact</Text>
            {(data.emergencyContactFirstName ||
              data.emergencyContactLastName) && (
              <Field label="Name">
                {data.emergencyContactFirstName} {data.emergencyContactLastName}
              </Field>
            )}
            {data.emergencyContactRelationship && (
              <Field label="Relationship">
                {
                  RELATIONSHIP_TO_CLIENT.find(
                    (item) => item.value === data.emergencyContactRelationship
                  )?.label
                }
              </Field>
            )}
            {data.emergencyContactPhone && (
              <Field label="Phone">{data.emergencyContactPhone}</Field>
            )}
            {data.emergencyContactEmail && (
              <Field label="Email">{data.emergencyContactEmail}</Field>
            )}
            {data.emergencyContactAddress && (
              <Field label="Address">{data.emergencyContactAddress}</Field>
            )}
          </View>
        )}

        {(data?.codeStatus || data?.advanceDirective) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medical Settings</Text>
            {data.codeStatus && (
              <Field label="Code Status">
                {
                  CODE_STATUS_OPTIONS.find(
                    (item) => item.value === data.codeStatus
                  )?.label
                }
              </Field>
            )}
            {data.advanceDirective && (
              <Field label="Advance Directive">
                {
                  ADVANCE_DIRECTIVE_OPTIONS.find(
                    (item) => item.value === data.advanceDirective
                  )?.label
                }
              </Field>
            )}
          </View>
        )}

        {(data?.hospitalPreference ||
          data?.hospitalAddress ||
          data?.hospitalPhoneNumber) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hospital Preference</Text>
            {data.hospitalPreference && (
              <Field label="Hospital Preference">
                {data.hospitalPreference}
              </Field>
            )}
            {data.hospitalAddress && (
              <Field label="Hospital Address">{data.hospitalAddress}</Field>
            )}
            {data.hospitalPhoneNumber && (
              <Field label="Hospital Phone">{data.hospitalPhoneNumber}</Field>
            )}
          </View>
        )}

        {(data?.insurance ||
          data?.groupNumber ||
          data?.idNumber ||
          data?.medicare) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Insurance Information</Text>
            {data.insurance && (
              <Field label="Insurance">{data.insurance}</Field>
            )}
            {data.groupNumber && (
              <Field label="Group Number">{data.groupNumber}</Field>
            )}
            {data.idNumber && <Field label="ID Number">{data.idNumber}</Field>}
            {data.medicare && <Field label="Medicare">{data.medicare}</Field>}
          </View>
        )}

        {(data?.pharmacyName ||
          data?.pharmacyAddress ||
          data?.pharmacyPhone ||
          data?.pharmacyFax) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pharmacy Information</Text>
            {data.pharmacyName && (
              <Field label="Pharmacy Name">{data.pharmacyName}</Field>
            )}
            {data.pharmacyAddress && (
              <Field label="Pharmacy Address">{data.pharmacyAddress}</Field>
            )}
            {data.pharmacyPhone && (
              <Field label="Pharmacy Phone">{data.pharmacyPhone}</Field>
            )}
            {data.pharmacyFax && (
              <Field label="Pharmacy Fax">{data.pharmacyFax}</Field>
            )}
          </View>
        )}

        {(data?.mpoaName || data?.mpoaPhone || data?.mpoaAddress) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>MPOA</Text>
            {data.mpoaName && <Field label="MPOA Name">{data.mpoaName}</Field>}
            {data.mpoaPhone && (
              <Field label="MPOA Phone">{data.mpoaPhone}</Field>
            )}
            {data.mpoaAddress && (
              <Field label="MPOA Address">{data.mpoaAddress}</Field>
            )}
          </View>
        )}

        {(data?.dpoaName || data?.dpoaPhone || data?.dpoaAddress) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DPOA</Text>
            {data.dpoaName && <Field label="DPOA Name">{data.dpoaName}</Field>}
            {data.dpoaPhone && (
              <Field label="DPOA Phone">{data.dpoaPhone}</Field>
            )}
            {data.dpoaAddress && (
              <Field label="DPOA Address">{data.dpoaAddress}</Field>
            )}
          </View>
        )}

        {data?.providers?.some((p) => p && p.providerName) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Healthcare Providers</Text>
            <TableHeader
              columns={[
                "Provider Name",
                "Specialty",
                "Phone / Fax",
                "Last / Next Visit",
              ]}
            />
            {(data.providers ?? [])
              .filter((p) => p && p.providerName)
              .map((p, i, arr) => (
                <TableRow
                  key={i}
                  cells={[
                    p.providerName ?? "",
                    p.specialty ?? "",
                    `${p.phone || ""} ${p.fax ? "/" : ""} ${p.fax || ""}`,
                    `${p.lastVisit || ""} / ${p.nextVisit || ""}`,
                  ]}
                  last={i === arr.length - 1}
                />
              ))}
          </View>
        )}

        {data?.medications?.some((m) => m && m.medicationName) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medications</Text>
            <TableHeader
              columns={[
                "Medication",
                "Dose",
                "Used to Treat",
                "Prescriber",
                "Refill Due",
                "Frequency",
              ]}
            />
            {(data.medications ?? [])
              .filter((m) => m && m.medicationName)
              .map((m, i, arr) => (
                <TableRow
                  key={i}
                  cells={[
                    m.medicationName ?? "",
                    m.dosage ?? "",
                    m.purpose ?? "",
                    m.prescribingDoctor ?? "",
                    m.refillDue ?? "",
                    m.frequency ?? "",
                  ]}
                  last={i === arr.length - 1}
                />
              ))}
          </View>
        )}

        {data?.diagnoses?.some((d) => d && d.diagnosis) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Diagnoses</Text>
            <Field label="Diagnoses">
              {data.diagnoses
                ?.filter((d) => d && d.diagnosis)
                ?.map((d) => d.diagnosis)
                .join(", ") ?? ""}
            </Field>
          </View>
        )}

        {data?.allergies?.some((a) => a && a.allergen) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Allergies</Text>
            <Field label="Allergies">
              {data.allergies
                ?.filter((a) => a && a.allergen)
                ?.map((a) => a.allergen)
                .join(", ") ?? ""}
            </Field>
          </View>
        )}

        {data?.surgicalHistory?.some((s) => s && s.surgicalHistory) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Surgical History</Text>
            <Field label="Surgical History">
              {data.surgicalHistory
                ?.filter((s) => s && s.surgicalHistory)
                ?.map((s) => s.surgicalHistory)
                .join(", ") ?? ""}
            </Field>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default FaceSheetShortFormPDF;
