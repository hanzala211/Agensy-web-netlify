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
            {data.careRecipientFirstName && (
              <Field label="First Name">{data.careRecipientFirstName}</Field>
            )}
            {data.careRecipientLastName && (
              <Field label="Last Name">{data.careRecipientLastName}</Field>
            )}
            {data.careRecipientPreferredName && (
              <Field label="Preferred Name">
                {data.careRecipientPreferredName}
              </Field>
            )}
            {data.careRecipientAddress && (
              <Field label="Address">{data.careRecipientAddress}</Field>
            )}
            {data.careRecipientCity && (
              <Field label="City">{data.careRecipientCity}</Field>
            )}
            {data.careRecipientState && (
              <Field label="State">{data.careRecipientState}</Field>
            )}
            {data.careRecipientZip && (
              <Field label="ZIP Code">{data.careRecipientZip}</Field>
            )}
            {data.careRecipientBirthdate && (
              <Field label="Date of Birth">{data.careRecipientBirthdate}</Field>
            )}
            {data.careRecipientBirthplace && (
              <Field label="Birthplace">{data.careRecipientBirthplace}</Field>
            )}
            {data.careRecipientSSN && (
              <Field label="SSN">{data.careRecipientSSN}</Field>
            )}
            {data.careRecipientPhone && (
              <Field label="Phone">{data.careRecipientPhone}</Field>
            )}
            {data.careRecipientEmail && (
              <Field label="Email">{data.careRecipientEmail}</Field>
            )}
            {data.careRecipientCulturalBackground && (
              <Field label="Cultural Background">
                {data.careRecipientCulturalBackground}
              </Field>
            )}
            {data.careRecipientEducation && (
              <Field label="Education">{data.careRecipientEducation}</Field>
            )}
            {data.careRecipientReligion && (
              <Field label="Religion">{data.careRecipientReligion}</Field>
            )}
            {data.careRecipientActiveReligionLocation && (
              <Field label="Active Religion Location">
                {data.careRecipientActiveReligionLocation}
              </Field>
            )}
            {data.careRecipientMaritalStatus && (
              <Field label="Marital Status">
                {data.careRecipientMaritalStatus}
              </Field>
            )}
            {data.careRecipientDateOfDivorceOrWidowhood && (
              <Field label="Date of Divorce/Widowhood">
                {data.careRecipientDateOfDivorceOrWidowhood}
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
            {data.medicareA && (
              <Field label="Medicare A">{data.medicareA}</Field>
            )}
            {data.medicareB && (
              <Field label="Medicare B">{data.medicareB}</Field>
            )}
            {data.medicareNumbers && (
              <Field label="Medicare Numbers">{data.medicareNumbers}</Field>
            )}
            {data.medicareSupplementPlan && (
              <Field label="Medicare Supplement Plan">
                {data.medicareSupplementPlan}
              </Field>
            )}
            {data.insuranceProvider && (
              <Field label="Insurance Provider">{data.insuranceProvider}</Field>
            )}
            {data.insurancePolicyNumber && (
              <Field label="Insurance Policy Number">
                {data.insurancePolicyNumber}
              </Field>
            )}
            {data.insurancePhone && (
              <Field label="Insurance Phone">{data.insurancePhone}</Field>
            )}
            {data.mentalHealthCoverage && (
              <Field label="Mental Health Coverage">
                {data.mentalHealthCoverage}
              </Field>
            )}
            {data.hmo && <Field label="HMO">{data.hmo}</Field>}
            {data.hmoPolicyNumber && (
              <Field label="HMO Policy Number">{data.hmoPolicyNumber}</Field>
            )}
            {data.hmoPhone && <Field label="HMO Phone">{data.hmoPhone}</Field>}
            {data.longTermCareInsuranceName && (
              <Field label="Long Term Care Insurance Name">
                {data.longTermCareInsuranceName}
              </Field>
            )}
            {data.longTermCareInsurancePolicyNumber && (
              <Field label="Long Term Care Insurance Policy Number">
                {data.longTermCareInsurancePolicyNumber}
              </Field>
            )}
            {data.longTermCareInsurancePhone && (
              <Field label="Long Term Care Insurance Phone">
                {data.longTermCareInsurancePhone}
              </Field>
            )}
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
            {data.lawyerName && (
              <Field label="Lawyer Name">{data.lawyerName}</Field>
            )}
            {data.lawyerPhone && (
              <Field label="Lawyer Phone">{data.lawyerPhone}</Field>
            )}
            {data.powerOfAttorneyFinancesName && (
              <Field label="Power of Attorney (Finances) Name">
                {data.powerOfAttorneyFinancesName}
              </Field>
            )}
            {data.powerOfAttorneyFinancesPhone && (
              <Field label="Power of Attorney (Finances) Phone">
                {data.powerOfAttorneyFinancesPhone}
              </Field>
            )}
            {data.powerOfAttorneyHealthcareName && (
              <Field label="Power of Attorney (Healthcare) Name">
                {data.powerOfAttorneyHealthcareName}
              </Field>
            )}
            {data.powerOfAttorneyHealthcarePhone && (
              <Field label="Power of Attorney (Healthcare) Phone">
                {data.powerOfAttorneyHealthcarePhone}
              </Field>
            )}
            {data.taxProfessionalName && (
              <Field label="Tax Professional Name">
                {data.taxProfessionalName}
              </Field>
            )}
            {data.taxProfessionalPhone && (
              <Field label="Tax Professional Phone">
                {data.taxProfessionalPhone}
              </Field>
            )}
            {data.accountantName && (
              <Field label="Accountant Name">{data.accountantName}</Field>
            )}
            {data.accountantPhone && (
              <Field label="Accountant Phone">{data.accountantPhone}</Field>
            )}
            {data.financialAdvisorName && (
              <Field label="Financial Advisor Name">
                {data.financialAdvisorName}
              </Field>
            )}
            {data.financialAdvisorPhone && (
              <Field label="Financial Advisor Phone">
                {data.financialAdvisorPhone}
              </Field>
            )}
            {data.significantOther1Name && (
              <Field label="Significant Other 1 Name">
                {data.significantOther1Name}
              </Field>
            )}
            {data.significantOther1Phone && (
              <Field label="Significant Other 1 Phone">
                {data.significantOther1Phone}
              </Field>
            )}
            {data.significantOther2Name && (
              <Field label="Significant Other 2 Name">
                {data.significantOther2Name}
              </Field>
            )}
            {data.significantOther2Phone && (
              <Field label="Significant Other 2 Phone">
                {data.significantOther2Phone}
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
            {data.houseCleaningAgency && (
              <Field label="House Cleaning Agency">
                {data.houseCleaningAgency}
              </Field>
            )}
            {data.houseCleaningSatisfaction && (
              <Field label="House Cleaning Satisfaction">
                {data.houseCleaningSatisfaction}
              </Field>
            )}
            {data.houseCleaningFrequency && (
              <Field label="House Cleaning Frequency">
                {data.houseCleaningFrequency}
              </Field>
            )}
            {data.homeAidAgency && (
              <Field label="Home Aid Agency">{data.homeAidAgency}</Field>
            )}
            {data.homeAidSatisfaction && (
              <Field label="Home Aid Satisfaction">
                {data.homeAidSatisfaction}
              </Field>
            )}
            {data.homeAidFrequency && (
              <Field label="Home Aid Frequency">{data.homeAidFrequency}</Field>
            )}
            {data.homeHealthAgency && (
              <Field label="Home Health Agency">{data.homeHealthAgency}</Field>
            )}
            {data.homeHealthSatisfaction && (
              <Field label="Home Health Satisfaction">
                {data.homeHealthSatisfaction}
              </Field>
            )}
            {data.homeHealthFrequency && (
              <Field label="Home Health Frequency">
                {data.homeHealthFrequency}
              </Field>
            )}
            {data.maintenanceAgency && (
              <Field label="Maintenance Agency">{data.maintenanceAgency}</Field>
            )}
            {data.maintenanceSatisfaction && (
              <Field label="Maintenance Satisfaction">
                {data.maintenanceSatisfaction}
              </Field>
            )}
            {data.maintenanceFrequency && (
              <Field label="Maintenance Frequency">
                {data.maintenanceFrequency}
              </Field>
            )}
            {data.otherHelpAgency && (
              <Field label="Other Help Agency">{data.otherHelpAgency}</Field>
            )}
            {data.otherHelpSatisfaction && (
              <Field label="Other Help Satisfaction">
                {data.otherHelpSatisfaction}
              </Field>
            )}
            {data.otherHelpFrequency && (
              <Field label="Other Help Frequency">
                {data.otherHelpFrequency}
              </Field>
            )}
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
            {data.emotionalHealthNotes && (
              <Field label="Emotional Health Notes">
                {data.emotionalHealthNotes}
              </Field>
            )}
            {data.personalityCoping && (
              <Field label="Personality/Coping">{data.personalityCoping}</Field>
            )}
            {data.recentBehaviorChanges && (
              <CheckboxField
                label="Recent Behavior Changes"
                checked={data.recentBehaviorChanges === "true" ? true : false}
              />
            )}
            {data.recipientSharesConcerns && (
              <CheckboxField
                label="Recipient Shares Concerns"
                checked={data.recipientSharesConcerns === "true" ? true : false}
              />
            )}
            {data.recipientSharesConcernsNotes && (
              <Field label="Recipient Shares Concerns Notes">
                {data.recipientSharesConcernsNotes}
              </Field>
            )}
            {data.emotionalProblemsHistory && (
              <CheckboxField
                label="Emotional Problems History"
                checked={
                  data.emotionalProblemsHistory === "true" ? true : false
                }
              />
            )}
            {data.emotionalProblemsTreatment && (
              <CheckboxField
                label="Emotional Problems Treatment"
                checked={
                  data.emotionalProblemsTreatment === "true" ? true : false
                }
              />
            )}
            {data.emotionalProblemsNotes && (
              <Field label="Emotional Problems Notes">
                {data.emotionalProblemsNotes}
              </Field>
            )}
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
