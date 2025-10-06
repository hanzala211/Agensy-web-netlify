import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { CareRecipientQuestionnaireData } from "@agensy/types";
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

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
  },

  checkboxIcon: {
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: BORDER,
    marginRight: 6,
    backgroundColor: "white",
  },

  checkboxChecked: {
    backgroundColor: BORDER,
  },

  checkboxLabel: {
    fontSize: 9,
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
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{children ?? " "}</Text>
  </View>
);

const CheckboxField = ({
  label,
  checked,
}: {
  label: string;
  checked?: boolean;
}) => (
  <View style={styles.fieldRow}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.checkboxContainer}>
      <View
        style={[
          styles.checkboxIcon,
          ...(checked ? [styles.checkboxChecked] : []),
        ]}
      />
      <Text style={styles.checkboxLabel}>{checked ? "Yes" : "No"}</Text>
    </View>
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

const CareRecipientQuestionairePDF: React.FC<{
  data?: CareRecipientQuestionnaireData & {
    last_update: { updatedAt: string };
  };
}> = ({ data }) => {
  return (
    <Document title="Agensy Care Recipient Questionnaire">
      <Page size="A4" style={styles.page}>
        <Text style={styles.formTitle}>
          Agensy Care Recipient Questionnaire
        </Text>
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

        {/* Form Filler Information */}
        {(data?.formFillerName ||
          data?.formFillerDate ||
          data?.fillingForOtherSpecify) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Form Filler Information</Text>
            {data.formFillerName && (
              <Field label="Form Filler Name">{data.formFillerName}</Field>
            )}
            {data.formFillerDate && (
              <Field label="Form Filler Date">{data.formFillerDate}</Field>
            )}
            {data.fillingForOtherSpecify && (
              <Field label="Filling For">
                {data.fillingForOtherSpecify}
                {data.fillingForOtherSpecify === "Other" &&
                  data.fillingForOtherSpecifyText &&
                  ` - ${data.fillingForOtherSpecifyText}`}
              </Field>
            )}
          </View>
        )}

        {/* Care Recipient Personal Information */}
        {(data?.careRecipientFirstName ||
          data?.careRecipientLastName ||
          data?.careRecipientPreferredName ||
          data?.careRecipientAddress ||
          data?.careRecipientCity ||
          data?.careRecipientState ||
          data?.careRecipientZip ||
          data?.careRecipientBirthdate ||
          data?.careRecipientBirthplace ||
          data?.careRecipientSSN ||
          data?.careRecipientPhone ||
          data?.careRecipientEmail ||
          data?.careRecipientCulturalBackground ||
          data?.careRecipientEducation ||
          data?.careRecipientReligion ||
          data?.careRecipientActiveReligionLocation ||
          data?.careRecipientMaritalStatus ||
          data?.careRecipientDateOfDivorceOrWidowhood ||
          data?.careRecipientLossImpactDescription) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Care Recipient Personal Information
            </Text>

            {/* Name Line */}
            {(data.careRecipientFirstName ||
              data.careRecipientLastName ||
              data.careRecipientPreferredName) && (
              <Field label="Name">
                {[data.careRecipientFirstName, data.careRecipientLastName]
                  .filter(Boolean)
                  .join(" ")}
                {data.careRecipientPreferredName &&
                  ` (Preferred: ${data.careRecipientPreferredName})`}
              </Field>
            )}

            {/* Address Line */}
            {(data.careRecipientAddress ||
              data.careRecipientCity ||
              data.careRecipientState ||
              data.careRecipientZip) && (
              <Field label="Address">
                {[
                  data.careRecipientAddress,
                  data.careRecipientCity,
                  data.careRecipientState,
                  data.careRecipientZip,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </Field>
            )}

            {/* Birth Info Line */}
            {(data.careRecipientBirthdate || data.careRecipientBirthplace) && (
              <Field label="Birth Information">
                {data.careRecipientBirthdate &&
                  `DOB: ${data.careRecipientBirthdate}`}
                {data.careRecipientBirthdate &&
                  data.careRecipientBirthplace &&
                  " | "}
                {data.careRecipientBirthplace &&
                  `Birthplace: ${data.careRecipientBirthplace}`}
              </Field>
            )}

            {/* Contact Info Line */}
            {(data.careRecipientPhone ||
              data.careRecipientEmail ||
              data.careRecipientSSN) && (
              <Field label="Contact Information">
                {data.careRecipientPhone && `Phone: ${data.careRecipientPhone}`}
                {data.careRecipientPhone && data.careRecipientEmail && " | "}
                {data.careRecipientEmail && `Email: ${data.careRecipientEmail}`}
                {data.careRecipientSSN && ` | SSN: ${data.careRecipientSSN}`}
              </Field>
            )}

            {/* Religious Info Line */}
            {(data.careRecipientReligion ||
              data.careRecipientActiveReligionLocation) && (
              <Field label="Religious Information">
                {data.careRecipientReligion &&
                  `Religion: ${data.careRecipientReligion}`}
                {data.careRecipientReligion &&
                  data.careRecipientActiveReligionLocation &&
                  " | "}
                {data.careRecipientActiveReligionLocation &&
                  `Active Location: ${data.careRecipientActiveReligionLocation}`}
              </Field>
            )}

            {/* Background Info Line */}
            {(data.careRecipientCulturalBackground ||
              data.careRecipientEducation) && (
              <Field label="Background Information">
                {data.careRecipientCulturalBackground &&
                  `Cultural Background: ${data.careRecipientCulturalBackground}`}
                {data.careRecipientCulturalBackground &&
                  data.careRecipientEducation &&
                  " | "}
                {data.careRecipientEducation &&
                  `Education: ${data.careRecipientEducation}`}
              </Field>
            )}

            {/* Marital Status Line */}
            {(data.careRecipientMaritalStatus ||
              data.careRecipientDateOfDivorceOrWidowhood) && (
              <Field label="Marital Status">
                {data.careRecipientMaritalStatus &&
                  `Status: ${data.careRecipientMaritalStatus}`}
                {data.careRecipientMaritalStatus &&
                  data.careRecipientDateOfDivorceOrWidowhood &&
                  " | "}
                {data.careRecipientDateOfDivorceOrWidowhood &&
                  `Date of Change: ${data.careRecipientDateOfDivorceOrWidowhood}`}
              </Field>
            )}

            {data.careRecipientLossImpactDescription && (
              <Field label="Loss Impact Description">
                {data.careRecipientLossImpactDescription}
              </Field>
            )}
          </View>
        )}

        {/* Work and Retirement Information */}
        {(data?.occupationProfession ||
          data?.retirementDate ||
          data?.retirementAdjustment) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Work and Retirement Information
            </Text>
            {data.occupationProfession && (
              <Field label="Occupation/Profession">
                {data.occupationProfession}
              </Field>
            )}
            {data.retirementDate && (
              <Field label="Retirement Date">{data.retirementDate}</Field>
            )}
            {data.retirementAdjustment && (
              <Field label="Retirement Adjustment">
                {data.retirementAdjustment}
              </Field>
            )}
          </View>
        )}

        {/* Insurance Information */}
        {(data?.medicareA ||
          data?.medicareB ||
          data?.medicareNumbers ||
          data?.medicareSupplementPlan ||
          data?.insuranceProvider ||
          data?.insurancePolicyNumber ||
          data?.insurancePhone ||
          data?.mentalHealthCoverage ||
          data?.hmo ||
          data?.hmoPolicyNumber ||
          data?.hmoPhone ||
          data?.longTermCareInsuranceName ||
          data?.longTermCareInsurancePolicyNumber ||
          data?.longTermCareInsurancePhone) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Insurance Information</Text>

            {/* Medicare Information */}
            {(data.medicareA ||
              data.medicareB ||
              data.medicareNumbers ||
              data.medicareSupplementPlan) && (
              <Field label="Medicare Information">
                {data.medicareA && `Medicare A: ${data.medicareA}`}
                {data.medicareA && data.medicareB && " | "}
                {data.medicareB && `Medicare B: ${data.medicareB}`}
                {data.medicareNumbers && ` | Numbers: ${data.medicareNumbers}`}
                {data.medicareSupplementPlan &&
                  ` | Supplement: ${data.medicareSupplementPlan}`}
              </Field>
            )}

            {/* Primary Insurance */}
            {(data.insuranceProvider ||
              data.insurancePolicyNumber ||
              data.insurancePhone) && (
              <Field label="Primary Insurance">
                {data.insuranceProvider &&
                  `Provider: ${data.insuranceProvider}`}
                {data.insuranceProvider && data.insurancePolicyNumber && " | "}
                {data.insurancePolicyNumber &&
                  `Policy: ${data.insurancePolicyNumber}`}
                {data.insurancePhone && ` | Phone: ${data.insurancePhone}`}
              </Field>
            )}

            {/* HMO Information */}
            {(data.hmo || data.hmoPolicyNumber || data.hmoPhone) && (
              <Field label="HMO Information">
                {data.hmo && `HMO: ${data.hmo}`}
                {data.hmo && data.hmoPolicyNumber && " | "}
                {data.hmoPolicyNumber && `Policy: ${data.hmoPolicyNumber}`}
                {data.hmoPhone && ` | Phone: ${data.hmoPhone}`}
              </Field>
            )}

            {/* Long Term Care Insurance */}
            {(data.longTermCareInsuranceName ||
              data.longTermCareInsurancePolicyNumber ||
              data.longTermCareInsurancePhone) && (
              <Field label="Long Term Care Insurance">
                {data.longTermCareInsuranceName &&
                  `Provider: ${data.longTermCareInsuranceName}`}
                {data.longTermCareInsuranceName &&
                  data.longTermCareInsurancePolicyNumber &&
                  " | "}
                {data.longTermCareInsurancePolicyNumber &&
                  `Policy: ${data.longTermCareInsurancePolicyNumber}`}
                {data.longTermCareInsurancePhone &&
                  ` | Phone: ${data.longTermCareInsurancePhone}`}
              </Field>
            )}

            {/* Mental Health Coverage */}
            {data.mentalHealthCoverage && (
              <Field label="Mental Health Coverage">
                {data.mentalHealthCoverage}
              </Field>
            )}

            {/* Additional Insurance Notes */}
            <Field label="Additional Insurance Notes">
              [Space for additional insurance information]
            </Field>
          </View>
        )}

        {/* Relatives Information */}
        {data?.relatives?.some((r) => r && r.name) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Relatives Information</Text>
            <TableHeader
              columns={[
                "Name",
                "Address",
                "Home Phone",
                "Work Phone",
                "Relationship",
                "Email",
              ]}
            />
            {(data.relatives ?? [])
              .filter((r) => r && r.name)
              .map((r, i, arr) => (
                <TableRow
                  key={i}
                  cells={[
                    r.name ?? "",
                    r.address ?? "",
                    r.homePhone ?? "",
                    r.workPhone ?? "",
                    r.relationship ?? "",
                    r.email ?? "",
                  ]}
                  last={i === arr.length - 1}
                />
              ))}
          </View>
        )}

        {/* Friends/Neighbors Information */}
        {data?.friendsNeighbors?.some((f) => f && f.name) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Friends/Neighbors Information
            </Text>
            <TableHeader
              columns={[
                "Name",
                "Address",
                "Relationship",
                "Phone",
                "Help Description",
              ]}
            />
            {(data.friendsNeighbors ?? [])
              .filter((f) => f && f.name)
              .map((f, i, arr) => (
                <TableRow
                  key={i}
                  cells={[
                    f.name ?? "",
                    f.address ?? "",
                    f.relationship ?? "",
                    f.phone ?? "",
                    f.helpDescription ?? "",
                  ]}
                  last={i === arr.length - 1}
                />
              ))}
          </View>
        )}

        {/* Professional Contacts Information */}
        {(data?.lawyerName ||
          data?.lawyerPhone ||
          data?.powerOfAttorneyFinancesName ||
          data?.powerOfAttorneyFinancesPhone ||
          data?.powerOfAttorneyHealthcareName ||
          data?.powerOfAttorneyHealthcarePhone ||
          data?.taxProfessionalName ||
          data?.taxProfessionalPhone ||
          data?.accountantName ||
          data?.accountantPhone ||
          data?.financialAdvisorName ||
          data?.financialAdvisorPhone ||
          data?.significantOther1Name ||
          data?.significantOther1Phone ||
          data?.significantOther2Name ||
          data?.significantOther2Phone) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Professional Contacts Information
            </Text>

            {/* Lawyer */}
            {(data.lawyerName || data.lawyerPhone) && (
              <Field label="Lawyer">
                {data.lawyerName && `Name: ${data.lawyerName}`}
                {data.lawyerName && data.lawyerPhone && " | "}
                {data.lawyerPhone && `Phone: ${data.lawyerPhone}`}
              </Field>
            )}

            {/* Power of Attorney - Finances */}
            {(data.powerOfAttorneyFinancesName ||
              data.powerOfAttorneyFinancesPhone) && (
              <Field label="Power of Attorney (Finances)">
                {data.powerOfAttorneyFinancesName &&
                  `Name: ${data.powerOfAttorneyFinancesName}`}
                {data.powerOfAttorneyFinancesName &&
                  data.powerOfAttorneyFinancesPhone &&
                  " | "}
                {data.powerOfAttorneyFinancesPhone &&
                  `Phone: ${data.powerOfAttorneyFinancesPhone}`}
              </Field>
            )}

            {/* Power of Attorney - Healthcare */}
            {(data.powerOfAttorneyHealthcareName ||
              data.powerOfAttorneyHealthcarePhone) && (
              <Field label="Power of Attorney (Healthcare)">
                {data.powerOfAttorneyHealthcareName &&
                  `Name: ${data.powerOfAttorneyHealthcareName}`}
                {data.powerOfAttorneyHealthcareName &&
                  data.powerOfAttorneyHealthcarePhone &&
                  " | "}
                {data.powerOfAttorneyHealthcarePhone &&
                  `Phone: ${data.powerOfAttorneyHealthcarePhone}`}
              </Field>
            )}

            {/* Tax Professional */}
            {(data.taxProfessionalName || data.taxProfessionalPhone) && (
              <Field label="Tax Professional">
                {data.taxProfessionalName &&
                  `Name: ${data.taxProfessionalName}`}
                {data.taxProfessionalName && data.taxProfessionalPhone && " | "}
                {data.taxProfessionalPhone &&
                  `Phone: ${data.taxProfessionalPhone}`}
              </Field>
            )}

            {/* Accountant */}
            {(data.accountantName || data.accountantPhone) && (
              <Field label="Accountant">
                {data.accountantName && `Name: ${data.accountantName}`}
                {data.accountantName && data.accountantPhone && " | "}
                {data.accountantPhone && `Phone: ${data.accountantPhone}`}
              </Field>
            )}

            {/* Financial Advisor */}
            {(data.financialAdvisorName || data.financialAdvisorPhone) && (
              <Field label="Financial Advisor">
                {data.financialAdvisorName &&
                  `Name: ${data.financialAdvisorName}`}
                {data.financialAdvisorName &&
                  data.financialAdvisorPhone &&
                  " | "}
                {data.financialAdvisorPhone &&
                  `Phone: ${data.financialAdvisorPhone}`}
              </Field>
            )}

            {/* Significant Other 1 */}
            {(data.significantOther1Name || data.significantOther1Phone) && (
              <Field label="Significant Other 1">
                {data.significantOther1Name &&
                  `Name: ${data.significantOther1Name}`}
                {data.significantOther1Name &&
                  data.significantOther1Phone &&
                  " | "}
                {data.significantOther1Phone &&
                  `Phone: ${data.significantOther1Phone}`}
              </Field>
            )}

            {/* Significant Other 2 */}
            {(data.significantOther2Name || data.significantOther2Phone) && (
              <Field label="Significant Other 2">
                {data.significantOther2Name &&
                  `Name: ${data.significantOther2Name}`}
                {data.significantOther2Name &&
                  data.significantOther2Phone &&
                  " | "}
                {data.significantOther2Phone &&
                  `Phone: ${data.significantOther2Phone}`}
              </Field>
            )}
          </View>
        )}

        {/* Support System & Emergency Contacts */}
        {(data?.supportSystemRating ||
          data?.supportSystemProblems ||
          data?.emergencyContacts) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Support System & Emergency Contacts
            </Text>
            {data.supportSystemRating && (
              <Field label="Support System Rating">
                {data.supportSystemRating}
              </Field>
            )}
            {data.supportSystemProblems && (
              <Field label="Support System Problems">
                {data.supportSystemProblems}
              </Field>
            )}
            {data.emergencyContacts && (
              <Field label="Emergency Contacts">{data.emergencyContacts}</Field>
            )}
          </View>
        )}

        {/* In-Home Help Services */}
        {(data?.houseCleaningAgency ||
          data?.houseCleaningSatisfaction ||
          data?.houseCleaningFrequency ||
          data?.homeAidAgency ||
          data?.homeAidSatisfaction ||
          data?.homeAidFrequency ||
          data?.homeHealthAgency ||
          data?.homeHealthSatisfaction ||
          data?.homeHealthFrequency ||
          data?.maintenanceAgency ||
          data?.maintenanceSatisfaction ||
          data?.maintenanceFrequency ||
          data?.otherHelpAgency ||
          data?.otherHelpSatisfaction ||
          data?.otherHelpFrequency ||
          data?.livingEnvironmentType ||
          data?.homeEnvironmentAdequacy) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>In-Home Help Services</Text>

            {/* In-Home Help Services Table */}
            <TableHeader
              columns={["Service", "Agency/Phone", "Satisfaction", "Frequency"]}
            />

            {/* House Cleaning */}
            {(data.houseCleaningAgency ||
              data.houseCleaningSatisfaction ||
              data.houseCleaningFrequency) && (
              <TableRow
                cells={[
                  "House Cleaning",
                  data.houseCleaningAgency || "",
                  data.houseCleaningSatisfaction || "",
                  data.houseCleaningFrequency || "",
                ]}
              />
            )}

            {/* Home Aid */}
            {(data.homeAidAgency ||
              data.homeAidSatisfaction ||
              data.homeAidFrequency) && (
              <TableRow
                cells={[
                  "Home Aid",
                  data.homeAidAgency || "",
                  data.homeAidSatisfaction || "",
                  data.homeAidFrequency || "",
                ]}
              />
            )}

            {/* Home Health */}
            {(data.homeHealthAgency ||
              data.homeHealthSatisfaction ||
              data.homeHealthFrequency) && (
              <TableRow
                cells={[
                  "Home Health",
                  data.homeHealthAgency || "",
                  data.homeHealthSatisfaction || "",
                  data.homeHealthFrequency || "",
                ]}
              />
            )}

            {/* Maintenance */}
            {(data.maintenanceAgency ||
              data.maintenanceSatisfaction ||
              data.maintenanceFrequency) && (
              <TableRow
                cells={[
                  "Maintenance",
                  data.maintenanceAgency || "",
                  data.maintenanceSatisfaction || "",
                  data.maintenanceFrequency || "",
                ]}
              />
            )}

            {/* Other Help */}
            {(data.otherHelpAgency ||
              data.otherHelpSatisfaction ||
              data.otherHelpFrequency) && (
              <TableRow
                cells={[
                  "Other Help",
                  data.otherHelpAgency || "",
                  data.otherHelpSatisfaction || "",
                  data.otherHelpFrequency || "",
                ]}
                last={true}
              />
            )}

            {/* Living Environment */}
            {data.livingEnvironmentType && (
              <Field label="Living Environment Type">
                {data.livingEnvironmentType.join(", ")}
              </Field>
            )}
            {data.homeEnvironmentAdequacy && (
              <Field label="Home Environment Adequacy">
                {data.homeEnvironmentAdequacy}
              </Field>
            )}
          </View>
        )}

        {/* Healthcare Providers */}
        {data?.healthcareProviders?.some((p) => p && p.providerName) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Healthcare Providers</Text>
            <TableHeader
              columns={["Provider Name", "Phone", "For What Problem"]}
            />
            {(data.healthcareProviders ?? [])
              .filter((p) => p && p.providerName)
              .map((p, i, arr) => (
                <TableRow
                  key={i}
                  cells={[
                    p.providerName ?? "",
                    p.phone ?? "",
                    p.forWhatProblem ?? "",
                  ]}
                  last={i === arr.length - 1}
                />
              ))}
          </View>
        )}

        {/* Medical Conditions */}
        {data?.medicalConditions?.some((m) => m && m.problem) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medical Conditions</Text>
            <TableHeader columns={["Problem", "Treatment", "Medications"]} />
            {(data.medicalConditions ?? [])
              .filter((m) => m && m.problem)
              .map((m, i, arr) => (
                <TableRow
                  key={i}
                  cells={[
                    m.problem ?? "",
                    m.treatment ?? "",
                    m.medications ?? "",
                  ]}
                  last={i === arr.length - 1}
                />
              ))}
          </View>
        )}

        {/* Medications */}
        {data?.medications?.some((m) => m && m.medicationName) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medications</Text>
            <TableHeader
              columns={[
                "Medication Name",
                "Dosage",
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
                    m.usedToTreat ?? "",
                    m.prescribingDoctor ?? "",
                    m.refillDue ?? "",
                    m.frequency ?? "",
                  ]}
                  last={i === arr.length - 1}
                />
              ))}
          </View>
        )}

        {/* Medical Info */}
        {(data?.lastCheckupDate ||
          data?.allergies ||
          data?.recentHospitalization ||
          data?.hospitalDetails ||
          data?.supportSystemThoughts) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medical Information</Text>
            {data.lastCheckupDate && (
              <Field label="Last Checkup Date">{data.lastCheckupDate}</Field>
            )}
            {data.allergies && (
              <Field label="Allergies">{data.allergies}</Field>
            )}
            {data.recentHospitalization && (
              <CheckboxField
                label="Recent Hospitalization"
                checked={data.recentHospitalization === "true" ? true : false}
              />
            )}
            {data.hospitalDetails && (
              <Field label="Hospital Details">{data.hospitalDetails}</Field>
            )}
            {data.supportSystemThoughts && (
              <Field label="Support System Thoughts">
                {data.supportSystemThoughts}
              </Field>
            )}
          </View>
        )}

        {/* Problem Areas in Daily Living */}
        {(data?.problemAreasDailyLiving || data?.problemAreasExplanation) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Problem Areas in Daily Living
            </Text>
            {data.problemAreasDailyLiving && (
              <Field label="Problem Areas">
                {data.problemAreasDailyLiving.join(", ")}
              </Field>
            )}
            {data.problemAreasExplanation && (
              <Field label="Problem Areas Explanation">
                {data.problemAreasExplanation}
              </Field>
            )}
          </View>
        )}

        {/* Problems/Risks */}
        {(data?.problemsRisks ||
          data?.nutritionConcerns ||
          data?.selfCareCapacitySummary) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Problems/Risks</Text>
            {data.problemsRisks && (
              <Field label="Problems/Risks">
                {data.problemsRisks.join(", ")}
              </Field>
            )}
            {data.nutritionConcerns && (
              <Field label="Nutrition Concerns">{data.nutritionConcerns}</Field>
            )}
            {data.selfCareCapacitySummary && (
              <Field label="Self Care Capacity Summary">
                {data.selfCareCapacitySummary}
              </Field>
            )}
          </View>
        )}

        {/* Memory, Orientation and Judgment */}
        {data?.memoryProblems && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Memory, Orientation and Judgment
            </Text>
            <Field label="Memory Problems">{data.memoryProblems}</Field>
          </View>
        )}

        {/* Emotional Health */}
        {(data?.emotionalHealthNotes ||
          data?.personalityCoping ||
          data?.recentBehaviorChanges ||
          data?.recipientSharesConcerns ||
          data?.recipientSharesConcernsNotes ||
          data?.emotionalProblemsHistory ||
          data?.emotionalProblemsTreatment ||
          data?.emotionalProblemsNotes ||
          data?.recentLossesImpact) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emotional Health</Text>

            {/* Emotional Health Notes */}
            {data.emotionalHealthNotes && (
              <Field label="Emotional Health Notes">
                {data.emotionalHealthNotes}
              </Field>
            )}

            {/* Personality/Coping */}
            {data.personalityCoping && (
              <Field label="Personality/Coping">{data.personalityCoping}</Field>
            )}

            {/* Recent Behavior Changes */}
            {data.recentBehaviorChanges && (
              <Field label="Recent Behavior Changes">
                {data.recentBehaviorChanges === "true" ? "Yes" : "No"}
              </Field>
            )}

            {/* Recipient Shares Concerns */}
            {data.recipientSharesConcerns && (
              <Field label="Recipient Shares Concerns">
                {data.recipientSharesConcerns === "true" ? "Yes" : "No"}
              </Field>
            )}

            {/* Recipient Shares Concerns Notes */}
            {data.recipientSharesConcernsNotes && (
              <Field label="Recipient Shares Concerns Notes">
                {data.recipientSharesConcernsNotes}
              </Field>
            )}

            {/* Emotional Problems History */}
            {data.emotionalProblemsHistory && (
              <Field label="Emotional Problems History">
                {data.emotionalProblemsHistory === "true" ? "Yes" : "No"}
              </Field>
            )}

            {/* Emotional Problems Treatment */}
            {data.emotionalProblemsTreatment && (
              <Field label="Emotional Problems Treatment">
                {data.emotionalProblemsTreatment === "true" ? "Yes" : "No"}
              </Field>
            )}

            {/* Emotional Problems Notes */}
            {data.emotionalProblemsNotes && (
              <Field label="Emotional Problems Notes">
                {data.emotionalProblemsNotes}
              </Field>
            )}

            {/* Recent Losses Impact */}
            {data.recentLossesImpact && (
              <Field label="Recent Losses Impact">
                {data.recentLossesImpact}
              </Field>
            )}
          </View>
        )}

        {/* Social Life */}
        {data?.socialLifeNotes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Social Life</Text>
            <Field label="Social Life Notes">{data.socialLifeNotes}</Field>
          </View>
        )}

        {/* Other Pertinent Information */}
        {(data?.hospitalPreference ||
          data?.dnr ||
          data?.trust ||
          data?.lifecare ||
          data?.will ||
          data?.livingWill ||
          data?.funeralArrangements ||
          data?.cemeteryPlot ||
          data?.monthlyIncome ||
          data?.spouseIncome ||
          data?.savings ||
          data?.otherAssets ||
          data?.financialProblemsDescription) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Other Pertinent Information</Text>
            {data.hospitalPreference && (
              <Field label="Hospital Preference">
                {data.hospitalPreference}
              </Field>
            )}
            {data.dnr && <Field label="DNR">{data.dnr}</Field>}
            {data.trust && <Field label="Trust">{data.trust}</Field>}
            {data.lifecare && <Field label="Lifecare">{data.lifecare}</Field>}
            {data.will && <Field label="Will">{data.will}</Field>}
            {data.livingWill && (
              <Field label="Living Will">{data.livingWill}</Field>
            )}
            {data.funeralArrangements && (
              <Field label="Funeral Arrangements">
                {data.funeralArrangements}
              </Field>
            )}
            {data.cemeteryPlot && (
              <Field label="Cemetery Plot">{data.cemeteryPlot}</Field>
            )}
            {data.monthlyIncome && (
              <Field label="Monthly Income">{data.monthlyIncome}</Field>
            )}
            {data.spouseIncome && (
              <Field label="Spouse Income">{data.spouseIncome}</Field>
            )}
            {data.savings && <Field label="Savings">{data.savings}</Field>}
            {data.otherAssets && (
              <Field label="Other Assets">{data.otherAssets}</Field>
            )}
            {data.financialProblemsDescription && (
              <Field label="Financial Problems Description">
                {data.financialProblemsDescription}
              </Field>
            )}
          </View>
        )}

        {/* Summary Section */}
        {(data?.majorConcernsAndAssistance || data?.areasAcceptingHelp) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary Section</Text>
            {data.majorConcernsAndAssistance && (
              <Field label="Major Concerns and Assistance">
                {data.majorConcernsAndAssistance}
              </Field>
            )}
            {data.areasAcceptingHelp && (
              <Field label="Areas Accepting Help">
                {data.areasAcceptingHelp}
              </Field>
            )}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default CareRecipientQuestionairePDF;
