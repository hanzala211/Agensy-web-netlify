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
  STATES,
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

const FaceSheetLongFormPDF: React.FC<{
  data: FaceSheetLongFormData & { last_update: { updatedAt?: string } };
}> = ({ data }) => (
  <Document title="Agensy Face Sheet">
    <Page size="A4" style={styles.page}>
      <Text style={styles.formTitle}>Agensy Face Sheet - Long Form</Text>
      <View style={styles.headerRow}>
        <Image src={logo} style={styles.headerLogo} />
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.headerDateBox}>
            {`Print Date: ${DateUtils.formatDateToRequiredFormat(
              new Date().toISOString()
            )}`}
          </Text>
          {data?.last_update.updatedAt && (
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
          {data.firstName} {data.lastName}
        </Field>
        {data.preferredName && (
          <Field label="Preferred name">{data.preferredName}</Field>
        )}
        {data.dateOfBirth && (
          <Field label="Date of Birth">{data.dateOfBirth}</Field>
        )}
        {data.phoneNumber && (
          <Field label="Phone Number">{data.phoneNumber}</Field>
        )}
        {data.city && <Field label="City">{data.city}</Field>}
        {data.state && (
          <Field label="State">
            {STATES.find((item) => item.value === data.state)?.label}
          </Field>
        )}
        {data.zip && <Field label="Zip Code">{data.zip}</Field>}
        {data.address && <Field label="Address">{data.address}</Field>}
        {data.ssn && <Field label="SSN">{data.ssn}</Field>}
      </View>

      {(data.emergencyContactFirstName ||
        data.emergencyContactLastName ||
        data.emergencyContactRelationship ||
        data.emergencyContactPhone ||
        data.emergencyContactEmail ||
        data.emergencyContactAddress) && (
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

      {(data.codeStatus || data.advanceDirective) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Code Status / Advance Directive
          </Text>
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

      {(data.hospitalPreference ||
        data.hospitalAddress ||
        data.hospitalPhoneNumber ||
        data.insurance ||
        data.groupNumber ||
        data.idNumber ||
        data.medicare) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hospital & Insurance</Text>
          {data.hospitalPreference && (
            <Field label="Hospital Preference">{data.hospitalPreference}</Field>
          )}
          {data.hospitalAddress && (
            <Field label="Hospital Address">{data.hospitalAddress}</Field>
          )}
          {data.hospitalPhoneNumber && (
            <Field label="Hospital Phone">{data.hospitalPhoneNumber}</Field>
          )}
          {data.insurance && <Field label="Insurance">{data.insurance}</Field>}
          {data.groupNumber && (
            <Field label="Group #">{data.groupNumber}</Field>
          )}
          {data.idNumber && <Field label="ID #">{data.idNumber}</Field>}
          {data.medicare && <Field label="Medicare">{data.medicare}</Field>}
        </View>
      )}

      {(data.pharmacyName ||
        data.pharmacyAddress ||
        data.pharmacyPhone ||
        data.pharmacyFax) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Pharmacy</Text>
          {data.pharmacyName && <Field label="Name">{data.pharmacyName}</Field>}
          {data.pharmacyAddress && (
            <Field label="Address">{data.pharmacyAddress}</Field>
          )}
          {data.pharmacyPhone && (
            <Field label="Phone">{data.pharmacyPhone}</Field>
          )}
          {data.pharmacyFax && <Field label="Fax">{data.pharmacyFax}</Field>}
        </View>
      )}

      {(data.mpoaName || data.mpoaPhone || data.mpoaAddress) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MPOA</Text>
          {data.mpoaName && <Field label="MPOA">{data.mpoaName}</Field>}
          {data.mpoaPhone && <Field label="Phone">{data.mpoaPhone}</Field>}
          {data.mpoaAddress && (
            <Field label="Address">{data.mpoaAddress}</Field>
          )}
        </View>
      )}

      {(data.dpoaName || data.dpoaPhone || data.dpoaAddress) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DPOA</Text>
          {data.dpoaName && <Field label="DPOA">{data.dpoaName}</Field>}
          {data.dpoaPhone && <Field label="Phone">{data.dpoaPhone}</Field>}
          {data.dpoaAddress && (
            <Field label="Address">{data.dpoaAddress}</Field>
          )}
        </View>
      )}

      {(data.diagnoses?.some((d) => d && d.diagnosis) ||
        data.allergies?.some((a) => a && a.allergen) ||
        data.dietaryRestrictions?.some((r) => r && r.dietaryRestrictions) ||
        data.surgicalHistory?.some((s) => s && s.surgicalHistory)) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health History</Text>
          {data.diagnoses?.some((d) => d && d.diagnosis) && (
            <Field label="Diagnoses">
              {data.diagnoses
                ?.filter((d) => d && d.diagnosis)
                ?.map((d) => d.diagnosis)
                .join(", ") ?? ""}
            </Field>
          )}
          {data.allergies?.some((a) => a && a.allergen) && (
            <Field label="Allergies">
              {data.allergies
                ?.filter((a) => a && a.allergen)
                ?.map((a) => a.allergen)
                .join(", ") ?? ""}
            </Field>
          )}
          {data.dietaryRestrictions?.some(
            (r) => r && r.dietaryRestrictions
          ) && (
            <Field label="Dietary Restrictions">
              {data.dietaryRestrictions
                ?.filter((r) => r && r.dietaryRestrictions)
                ?.map((r) => r.dietaryRestrictions)
                .join(", ") ?? ""}
            </Field>
          )}
          {data.surgicalHistory?.some((s) => s && s.surgicalHistory) && (
            <Field label="Surgical History">
              {data.surgicalHistory
                ?.filter((s) => s && s.surgicalHistory)
                ?.map((s) => s.surgicalHistory)
                .join(", ") ?? ""}
            </Field>
          )}
        </View>
      )}

      {data.medicalConditions?.some((m) => m && m.condition) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Conditions</Text>
          <TableHeader columns={["Condition", "Onset Date", "Notes"]} />
          {(data.medicalConditions ?? [])
            .filter((m) => m && m.condition)
            .map((m, i, arr) => (
              <TableRow
                key={i}
                cells={[
                  m.condition ?? "",
                  m.onsetDate && m.onsetDate.trim() !== ""
                    ? DateUtils.formatDateToRequiredFormat(m.onsetDate)
                    : "",
                  m.notes ?? "",
                ]}
                last={i === arr.length - 1}
              />
            ))}
        </View>
      )}

      {data.providers?.some((p) => p && p.providerName) && (
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
      )}

      {data.medications?.some((m) => m && m.medicationName) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medications</Text>
          <TableHeader
            columns={[
              "Medication",
              "Dose",
              "Used to Treat",
              "Frequency",
              "Prescriber",
              "Refill Due",
            ]}
          />
          {(data.medications ?? []).map((m, i, arr) => (
            <TableRow
              key={i}
              cells={[
                m.medicationName,
                m.dosage,
                m.purpose,
                m.frequency,
                m.prescriber,
                m.refillDue,
              ]}
              last={i === arr.length - 1}
            />
          ))}
        </View>
      )}

      {data.vaccinations?.some((v) => v && v.vaccineName) && (
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
      )}

      {(data.language ||
        data.race ||
        data.gender ||
        data.maritalStatus ||
        data.livingSituation ||
        data.dateOfLastCarePlan) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Demographics</Text>
          {data.language && (
            <Field label="Language">
              {
                LANGUAGE_OPTIONS.find((item) => item.value === data.language)
                  ?.label
              }
            </Field>
          )}
          {data.race && (
            <Field label="Race">
              {RACE_OPTIONS.find((item) => item.value === data.race)?.label}
            </Field>
          )}
          {data.gender && (
            <Field label="Gender">
              {GENDER_OPTIONS.find((item) => item.value === data.gender)?.label}
            </Field>
          )}
          {data.maritalStatus && (
            <Field label="Marital Status">
              {
                MARITAL_STATUS_OPTIONS.find(
                  (item) => item.value === data.maritalStatus
                )?.label
              }
            </Field>
          )}
          {data.livingSituation && (
            <Field label="Living Situation">
              {
                LIVING_SITUATION_OPTIONS.find(
                  (item) => item.value === data.livingSituation
                )?.label
              }
            </Field>
          )}
          {data.dateOfLastCarePlan && (
            <Field label="Date of Last Care Plan">
              {DateUtils.formatDateToRequiredFormat(
                data.dateOfLastCarePlan ?? ""
              )}
            </Field>
          )}
        </View>
      )}

      {(data.caregiverAgency ||
        data.caregiverAddress ||
        data.caregiverPhone ||
        data.caregiverSchedule ||
        data.caregiverDuties) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Caregiver Agency</Text>
          {data.caregiverAgency && (
            <Field label="Agency">{data.caregiverAgency}</Field>
          )}
          {data.caregiverAddress && (
            <Field label="Address">{data.caregiverAddress}</Field>
          )}
          {data.caregiverPhone && (
            <Field label="Phone">{data.caregiverPhone}</Field>
          )}
          {data.caregiverSchedule && (
            <Field label="Schedule">{data.caregiverSchedule}</Field>
          )}
          {data.caregiverDuties && (
            <Field label="Duties">{data.caregiverDuties}</Field>
          )}
        </View>
      )}

      {(data.homeHealthAgency ||
        data.homeHealthAddress ||
        data.homeHealthPhone ||
        data.homeHealthFax ||
        data.homeHealthSchedule ||
        data.homeHealthPrescribingDoctor ||
        data.homeHealthStartDate ||
        data.homeHealthDischargeDate) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Home Health Agency</Text>
          {data.homeHealthAgency && (
            <Field label="Agency">{data.homeHealthAgency}</Field>
          )}
          {data.homeHealthAddress && (
            <Field label="Address">{data.homeHealthAddress}</Field>
          )}
          {data.homeHealthPhone && (
            <Field label="Phone">{data.homeHealthPhone}</Field>
          )}
          {data.homeHealthFax && (
            <Field label="Fax">{data.homeHealthFax}</Field>
          )}
          {data.homeHealthSchedule && (
            <Field label="Schedule">{data.homeHealthSchedule}</Field>
          )}
          {data.homeHealthPrescribingDoctor && (
            <Field label="Prescribing Doctor">
              {data.homeHealthPrescribingDoctor}
            </Field>
          )}
          {data.homeHealthStartDate && (
            <Field label="Start Date">{data.homeHealthStartDate}</Field>
          )}
          {data.homeHealthDischargeDate && (
            <Field label="Discharge Date">{data.homeHealthDischargeDate}</Field>
          )}
        </View>
      )}
      {(data.mentalStatus ||
        data.cognitiveScreeningScore ||
        data.cognitiveScreeningDate ||
        data.notesAndConcerns) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mental Status</Text>
          {data.mentalStatus && (
            <Field label="Status">{data.mentalStatus}</Field>
          )}
          {(data.cognitiveScreeningScore || data.cognitiveScreeningDate) && (
            <Field label="Last Cognitive Screening">
              {data.cognitiveScreeningScore} on {data.cognitiveScreeningDate}
            </Field>
          )}
          {data.notesAndConcerns && (
            <Field label="Notes / Concerns">{data.notesAndConcerns}</Field>
          )}
        </View>
      )}

      {data.bloodwork?.some((b) => b && b.test) && (
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
      )}
    </Page>
  </Document>
);

export default FaceSheetLongFormPDF;
