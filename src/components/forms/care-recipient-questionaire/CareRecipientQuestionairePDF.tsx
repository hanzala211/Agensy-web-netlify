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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Form Filler Information</Text>
          <Field label="Form Filler Name">{data?.formFillerName}</Field>
          <Field label="Form Filler Date">{data?.formFillerDate}</Field>
          <Field label="Filling For">
            {data?.fillingForOtherSpecify}
            {data?.fillingForOtherSpecify === "Other" &&
              data?.fillingForOtherSpecifyText &&
              ` - ${data.fillingForOtherSpecifyText}`}
          </Field>
        </View>

        {/* Care Recipient Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Care Recipient Personal Information
          </Text>
          <Field label="First Name">{data?.careRecipientFirstName}</Field>
          <Field label="Last Name">{data?.careRecipientLastName}</Field>
          <Field label="Address">{data?.careRecipientAddress}</Field>
          <Field label="City">{data?.careRecipientCity}</Field>
          <Field label="State">{data?.careRecipientState}</Field>
          <Field label="ZIP Code">{data?.careRecipientZip}</Field>
          <Field label="Date of Birth">{data?.careRecipientBirthdate}</Field>
          <Field label="Birthplace">{data?.careRecipientBirthplace}</Field>
          <Field label="SSN">{data?.careRecipientSSN}</Field>
          <Field label="Phone">{data?.careRecipientPhone}</Field>
          <Field label="Email">{data?.careRecipientEmail}</Field>
          <Field label="Cultural Background">
            {data?.careRecipientCulturalBackground}
          </Field>
          <Field label="Education">{data?.careRecipientEducation}</Field>
          <Field label="Religion">{data?.careRecipientReligion}</Field>
          <Field label="Active Religion Location">
            {data?.careRecipientActiveReligionLocation}
          </Field>
          <Field label="Marital Status">
            {data?.careRecipientMaritalStatus}
          </Field>
          <Field label="Date of Divorce/Widowhood">
            {data?.careRecipientDateOfDivorceOrWidowhood}
          </Field>
          <Field label="Loss Impact Description">
            {data?.careRecipientLossImpactDescription}
          </Field>
        </View>

        {/* Work and Retirement Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Work and Retirement Information
          </Text>
          <Field label="Occupation/Profession">
            {data?.occupationProfession}
          </Field>
          <Field label="Retirement Date">{data?.retirementDate}</Field>
          <Field label="Retirement Adjustment">
            {data?.retirementAdjustment}
          </Field>
        </View>

        {/* Insurance Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insurance Information</Text>
          <Field label="Medicare A">{data?.medicareA}</Field>
          <Field label="Medicare B">{data?.medicareB}</Field>
          <Field label="Medicare Numbers">{data?.medicareNumbers}</Field>
          <Field label="Medicare Supplement Plan">
            {data?.medicareSupplementPlan}
          </Field>
          <Field label="Insurance Provider">{data?.insuranceProvider}</Field>
          <Field label="Insurance Policy Number">
            {data?.insurancePolicyNumber}
          </Field>
          <Field label="Insurance Phone">{data?.insurancePhone}</Field>
          <Field label="Mental Health Coverage">
            {data?.mentalHealthCoverage}
          </Field>
          <Field label="HMO">{data?.hmo}</Field>
          <Field label="HMO Policy Number">{data?.hmoPolicyNumber}</Field>
          <Field label="HMO Phone">{data?.hmoPhone}</Field>
          <Field label="Long Term Care Insurance Name">
            {data?.longTermCareInsuranceName}
          </Field>
          <Field label="Long Term Care Insurance Policy Number">
            {data?.longTermCareInsurancePolicyNumber}
          </Field>
          <Field label="Long Term Care Insurance Phone">
            {data?.longTermCareInsurancePhone}
          </Field>
        </View>

        {/* Relatives Information */}
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
          {(data?.relatives ?? [])
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

        {/* Friends/Neighbors Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Friends/Neighbors Information</Text>
          <TableHeader
            columns={[
              "Name",
              "Address",
              "Relationship",
              "Phone",
              "Help Description",
            ]}
          />
          {(data?.friendsNeighbors ?? [])
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

        {/* Professional Contacts Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Professional Contacts Information
          </Text>
          <Field label="Lawyer Name">{data?.lawyerName}</Field>
          <Field label="Lawyer Phone">{data?.lawyerPhone}</Field>
          <Field label="Power of Attorney (Finances) Name">
            {data?.powerOfAttorneyFinancesName}
          </Field>
          <Field label="Power of Attorney (Finances) Phone">
            {data?.powerOfAttorneyFinancesPhone}
          </Field>
          <Field label="Power of Attorney (Healthcare) Name">
            {data?.powerOfAttorneyHealthcareName}
          </Field>
          <Field label="Power of Attorney (Healthcare) Phone">
            {data?.powerOfAttorneyHealthcarePhone}
          </Field>
          <Field label="Tax Professional Name">
            {data?.taxProfessionalName}
          </Field>
          <Field label="Tax Professional Phone">
            {data?.taxProfessionalPhone}
          </Field>
          <Field label="Accountant Name">{data?.accountantName}</Field>
          <Field label="Accountant Phone">{data?.accountantPhone}</Field>
          <Field label="Financial Advisor Name">
            {data?.financialAdvisorName}
          </Field>
          <Field label="Financial Advisor Phone">
            {data?.financialAdvisorPhone}
          </Field>
          <Field label="Significant Other 1 Name">
            {data?.significantOther1Name}
          </Field>
          <Field label="Significant Other 1 Phone">
            {data?.significantOther1Phone}
          </Field>
          <Field label="Significant Other 2 Name">
            {data?.significantOther2Name}
          </Field>
          <Field label="Significant Other 2 Phone">
            {data?.significantOther2Phone}
          </Field>
        </View>

        {/* Support System & Emergency Contacts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Support System & Emergency Contacts
          </Text>
          <Field label="Support System Rating">
            {data?.supportSystemRating}
          </Field>
          <Field label="Support System Problems">
            {data?.supportSystemProblems}
          </Field>
          <Field label="Emergency Contacts">{data?.emergencyContacts}</Field>
        </View>

        {/* In-Home Help Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>In-Home Help Services</Text>
          <Field label="House Cleaning Agency">
            {data?.houseCleaningAgency}
          </Field>
          <Field label="House Cleaning Satisfaction">
            {data?.houseCleaningSatisfaction}
          </Field>
          <Field label="House Cleaning Frequency">
            {data?.houseCleaningFrequency}
          </Field>
          <Field label="Home Aid Agency">{data?.homeAidAgency}</Field>
          <Field label="Home Aid Satisfaction">
            {data?.homeAidSatisfaction}
          </Field>
          <Field label="Home Aid Frequency">{data?.homeAidFrequency}</Field>
          <Field label="Home Health Agency">{data?.homeHealthAgency}</Field>
          <Field label="Home Health Satisfaction">
            {data?.homeHealthSatisfaction}
          </Field>
          <Field label="Home Health Frequency">
            {data?.homeHealthFrequency}
          </Field>
          <Field label="Maintenance Agency">{data?.maintenanceAgency}</Field>
          <Field label="Maintenance Satisfaction">
            {data?.maintenanceSatisfaction}
          </Field>
          <Field label="Maintenance Frequency">
            {data?.maintenanceFrequency}
          </Field>
          <Field label="Other Help Agency">{data?.otherHelpAgency}</Field>
          <Field label="Other Help Satisfaction">
            {data?.otherHelpSatisfaction}
          </Field>
          <Field label="Other Help Frequency">{data?.otherHelpFrequency}</Field>
          <Field label="Living Environment Type">
            {data?.livingEnvironmentType?.join(", ")}
          </Field>
          <Field label="Home Environment Adequacy">
            {data?.homeEnvironmentAdequacy}
          </Field>
        </View>

        {/* Healthcare Providers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Healthcare Providers</Text>
          <TableHeader
            columns={["Provider Name", "Phone", "For What Problem"]}
          />
          {(data?.healthcareProviders ?? [])
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

        {/* Medical Conditions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Conditions</Text>
          <TableHeader columns={["Problem", "Treatment", "Medications"]} />
          {(data?.medicalConditions ?? [])
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

        {/* Medical Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Information</Text>
          <Field label="Last Checkup Date">{data?.lastCheckupDate}</Field>
          <Field label="Allergies">{data?.allergies}</Field>
          <CheckboxField
            label="Recent Hospitalization"
            checked={data?.recentHospitalization === "true" ? true : false}
          />
          <Field label="Hospital Details">{data?.hospitalDetails}</Field>
          <Field label="Support System Thoughts">
            {data?.supportSystemThoughts}
          </Field>
        </View>

        {/* Problem Areas in Daily Living */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Problem Areas in Daily Living</Text>
          <Field label="Problem Areas">
            {data?.problemAreasDailyLiving?.join(", ")}
          </Field>
          <Field label="Problem Areas Explanation">
            {data?.problemAreasExplanation}
          </Field>
        </View>

        {/* Problems/Risks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Problems/Risks</Text>
          <Field label="Problems/Risks">
            {data?.problemsRisks?.join(", ")}
          </Field>
          <Field label="Nutrition Concerns">{data?.nutritionConcerns}</Field>
          <Field label="Self Care Capacity Summary">
            {data?.selfCareCapacitySummary}
          </Field>
        </View>

        {/* Memory, Orientation and Judgment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Memory, Orientation and Judgment
          </Text>
          <Field label="Memory Problems">{data?.memoryProblems}</Field>
        </View>

        {/* Emotional Health */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emotional Health</Text>
          <Field label="Emotional Health Notes">
            {data?.emotionalHealthNotes}
          </Field>
          <Field label="Personality/Coping">{data?.personalityCoping}</Field>
          <CheckboxField
            label="Recent Behavior Changes"
            checked={data?.recentBehaviorChanges === "true" ? true : false}
          />
          <CheckboxField
            label="Recipient Shares Concerns"
            checked={data?.recipientSharesConcerns === "true" ? true : false}
          />
          <Field label="Recipient Shares Concerns Notes">
            {data?.recipientSharesConcernsNotes}
          </Field>
          <CheckboxField
            label="Emotional Problems History"
            checked={data?.emotionalProblemsHistory === "true" ? true : false}
          />
          <CheckboxField
            label="Emotional Problems Treatment"
            checked={data?.emotionalProblemsTreatment === "true" ? true : false}
          />
          <Field label="Emotional Problems Notes">
            {data?.emotionalProblemsNotes}
          </Field>
          <Field label="Recent Losses Impact">{data?.recentLossesImpact}</Field>
        </View>

        {/* Social Life */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Life</Text>
          <Field label="Social Life Notes">{data?.socialLifeNotes}</Field>
        </View>

        {/* Other Pertinent Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Pertinent Information</Text>
          <Field label="Hospital Preference">{data?.hospitalPreference}</Field>
          <Field label="DNR">{data?.dnr}</Field>
          <Field label="Trust">{data?.trust}</Field>
          <Field label="Lifecare">{data?.lifecare}</Field>
          <Field label="Will">{data?.will}</Field>
          <Field label="Living Will">{data?.livingWill}</Field>
          <Field label="Funeral Arrangements">
            {data?.funeralArrangements}
          </Field>
          <Field label="Cemetery Plot">{data?.cemeteryPlot}</Field>
          <Field label="Monthly Income">{data?.monthlyIncome}</Field>
          <Field label="Spouse Income">{data?.spouseIncome}</Field>
          <Field label="Savings">{data?.savings}</Field>
          <Field label="Other Assets">{data?.otherAssets}</Field>
          <Field label="Financial Problems Description">
            {data?.financialProblemsDescription}
          </Field>
        </View>

        {/* Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary Section</Text>
          <Field label="Major Concerns and Assistance">
            {data?.majorConcernsAndAssistance}
          </Field>
          <Field label="Areas Accepting Help">{data?.areasAcceptingHelp}</Field>
        </View>
      </Page>
    </Document>
  );
};

export default CareRecipientQuestionairePDF;
