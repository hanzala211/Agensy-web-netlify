import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { FaceSheetLongFormData } from "@agensy/types";
import { DateUtils } from "@agensy/utils";
import {
  ADVANCE_DIRECTIVE_OPTIONS,
  CODE_STATUS_OPTIONS,
  LANGUAGE_OPTIONS,
  RELATIONSHIP_TO_CLIENT,
  RACE_OPTIONS,
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  LIVING_SITUATION_OPTIONS,
} from "@agensy/constants";
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
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
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

const FaceSheetLongFormPDF: React.FC<{ data: FaceSheetLongFormData }> = ({
  data,
}) => (
  <Document title="Agensy Face Sheet">
    <Page size="A4" style={styles.page}>
      <Text style={styles.formTitle}>Agensy Face Sheet - Long Form</Text>
      <View style={styles.headerRow}>
        <Image src={logo} style={styles.headerLogo} />
        <Text style={styles.headerDateBox}>
          Date: {DateUtils.formatDateToRequiredFormat(new Date().toISOString())}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient Information</Text>
        <Field label="Name">
          {data.firstName} {data.lastName}
        </Field>
        <Field label="Date of Birth">{data.dateOfBirth}</Field>
        <Field label="Phone Number">{data.phoneNumber}</Field>
        <Field label="Address">{data.address}</Field>
        <Field label="SSN">{data.ssn}</Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contact</Text>
        <Field label="Name">
          {data.emergencyContactFirstName} {data.emergencyContactLastName}
        </Field>
        <Field label="Relationship">
          {
            RELATIONSHIP_TO_CLIENT.find(
              (item) => item.value === data.emergencyContactRelationship
            )?.label
          }
        </Field>
        <Field label="Phone">{data.emergencyContactPhone}</Field>
        <Field label="Email">{data.emergencyContactEmail}</Field>
        <Field label="Address">{data.emergencyContactAddress}</Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Code Status / Advance Directive</Text>
        <Field label="Code Status">
          {
            CODE_STATUS_OPTIONS.find((item) => item.value === data.codeStatus)
              ?.label
          }
        </Field>
        <Field label="Advance Directive">
          {
            ADVANCE_DIRECTIVE_OPTIONS.find(
              (item) => item.value === data.advanceDirective
            )?.label
          }
        </Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hospital & Insurance</Text>
        <Field label="Hospital Preference">{data.hospitalPreference}</Field>
        <Field label="Hospital Address">{data.hospitalAddress}</Field>
        <Field label="Hospital Phone">{data.hospitalPhoneNumber}</Field>
        <Field label="Insurance">{data.insurance}</Field>
        <Field label="Group #">{data.groupNumber}</Field>
        <Field label="ID #">{data.idNumber}</Field>
        <Field label="Medicare">{data.medicare}</Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferred Pharmacy</Text>
        <Field label="Name">{data.pharmacyName}</Field>
        <Field label="Address">{data.pharmacyAddress}</Field>
        <Field label="Phone">{data.pharmacyPhone}</Field>
        <Field label="Fax">{data.pharmacyFax}</Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MPOA</Text>
        <Field label="MPOA">{data.mpoaName}</Field>
        <Field label="Phone">{data.mpoaPhone}</Field>
        <Field label="Address">{data.mpoaAddress}</Field>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DPOA</Text>
        <Field label="DPOA">{data.dpoaName}</Field>
        <Field label="Phone">{data.dpoaPhone}</Field>
        <Field label="Address">{data.dpoaAddress}</Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health History</Text>
        <Field label="Diagnoses">
          {data.diagnoses
            ?.filter((d) => d && d.diagnosis)
            ?.map((d) => d.diagnosis)
            .join(", ") ?? ""}
        </Field>
        <Field label="Allergies">
          {data.allergies
            ?.filter((a) => a && a.allergen)
            ?.map((a) => a.allergen)
            .join(", ") ?? ""}
        </Field>
        <Field label="Dietary Restrictions">
          {data.dietaryRestrictions
            ?.filter((r) => r && r.dietaryRestrictions)
            ?.map((r) => r.dietaryRestrictions)
            .join(", ") ?? ""}
        </Field>
        <Field label="Surgical History">
          {data.surgicalHistory
            ?.filter((s) => s && s.surgicalHistory)
            ?.map((s) => s.surgicalHistory)
            .join(", ") ?? ""}
        </Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medical Conditions</Text>
        <TableHeader columns={["Condition", "Onset Date", "Notes"]} />
        {(data.medicalConditions ?? [])
          .filter((m) => m && m.condition)
          .map((m, i, arr) => (
            <TableRow
              key={i}
              cells={[
                m.condition ?? "",
                DateUtils.formatDateToRequiredFormat(m.onsetDate ?? ""),
                m.notes ?? "",
              ]}
              last={i === arr.length - 1}
            />
          ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Healthcare Providers</Text>
        <TableHeader
          columns={[
            "Provider",
            "Specialty",
            "Phone / Fax",
            "Last / Next visit",
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
                `${p.phone ?? ""} ${p.fax ? "/" : ""} ${p.fax ?? ""}`,
                `${p.lastVisit ?? ""} / ${p.nextVisit ?? ""}`,
              ]}
              last={i === arr.length - 1}
            />
          ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medications</Text>
        <TableHeader columns={["Medication", "Dose", "Used to Treat"]} />
        {(data.medications ?? []).map((m, i, arr) => (
          <TableRow
            key={i}
            cells={[m.medicationName, m.dose, m.usedToTreat]}
            last={i === arr.length - 1}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vaccinations</Text>
        <TableHeader columns={["Vaccination", "Date", "Next Vaccine"]} />
        {(data.vaccinations ?? [])
          .filter((v) => v && v.vaccineName)
          .map((v, i, arr) => (
            <TableRow
              key={i}
              cells={[v.vaccineName ?? "", v.date ?? "", v.nextVaccine ?? ""]}
              last={i === arr.length - 1}
            />
          ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Demographics</Text>
        <Field label="Language">
          {LANGUAGE_OPTIONS.find((item) => item.value === data.language)?.label}
        </Field>
        <Field label="Race">
          {RACE_OPTIONS.find((item) => item.value === data.race)?.label}
        </Field>
        <Field label="Gender">
          {GENDER_OPTIONS.find((item) => item.value === data.gender)?.label}
        </Field>
        <Field label="Marital Status">
          {
            MARITAL_STATUS_OPTIONS.find(
              (item) => item.value === data.maritalStatus
            )?.label
          }
        </Field>
        <Field label="Living Situation">
          {
            LIVING_SITUATION_OPTIONS.find(
              (item) => item.value === data.livingSituation
            )?.label
          }
        </Field>
        <Field label="Date of Last Care Plan">
          {DateUtils.formatDateToRequiredFormat(data.dateOfLastCarePlan ?? "")}
        </Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Caregiver Agency</Text>
        <Field label="Agency">{data.caregiverAgency}</Field>
        <Field label="Address">{data.caregiverAddress}</Field>
        <Field label="Phone">{data.caregiverPhone}</Field>
        <Field label="Point of Contact">{data.caregiverPhone}</Field>
        <Field label="Schedule">{data.caregiverSchedule}</Field>
        <Field label="Duties">{data.caregiverDuties}</Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mental Status</Text>
        <Field label="Status">{data.mentalStatus}</Field>
        <Field label="Last Cognitive Screening">
          {data.cognitiveScreeningScore}/{data.cognitiveScreeningScoreOutOf} on{" "}
          {data.cognitiveScreeningDate}
        </Field>
        <Field label="Notes / Concerns">{data.notesAndConcerns}</Field>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bloodwork</Text>
        <TableHeader columns={["Date", "Results", "Ordered By", "Repeat"]} />
        {(data.bloodwork ?? [])
          .filter((b) => b && b.test)
          .map((b, i, arr) => (
            <TableRow
              key={i}
              cells={[
                b.date ?? "",
                b.results ?? "",
                b.orderedBy ?? "",
                b.repeat ?? "",
              ]}
              last={i === arr.length - 1}
            />
          ))}
      </View>
    </Page>
  </Document>
);

export default FaceSheetLongFormPDF;
