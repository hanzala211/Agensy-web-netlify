import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { BurialInstructionsFormData } from "@agensy/types";
import { RELATIONSHIP_TO_CLIENT } from "@agensy/constants";
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

// Helper function to get display text for burial type
const getBurialTypeDisplay = (type?: string, other?: string) => {
  if (!type) return "";
  switch (type) {
    case "traditional-burial":
      return "Traditional Burial";
    case "green-burial":
      return "Green/Natural Burial";
    case "cremation":
      return "Cremation";
    case "other":
      return other ? `Other: ${other}` : "Other";
    default:
      return type;
  }
};

// Helper function to get display text for plot ownership
const getPlotOwnedDisplay = (owned?: string) => {
  if (!owned) return "";
  switch (owned) {
    case "yes":
      return "Yes";
    case "no":
      return "No";
    default:
      return owned;
  }
};

// Helper function to get display text for urn selection
const getUrnSelectionDisplay = (selection?: string) => {
  if (!selection) return "";
  switch (selection) {
    case "already-purchased":
      return "Already purchased";
    case "will-be-chosen-later":
      return "Will be chosen later";
    default:
      return selection;
  }
};

// Helper function to get display text for ashes disposition
const getAshesDispositionDisplay = (disposition?: string, other?: string) => {
  if (!disposition) return "";
  switch (disposition) {
    case "buried":
      return "Buried";
    case "scattered":
      return "Scattered";
    case "kept-by-family":
      return "Kept by family";
    case "other":
      return other ? `Other: ${other}` : "Other";
    default:
      return disposition;
  }
};

// Helper function to get display text for service type
const getServiceTypeDisplay = (type?: string) => {
  if (!type) return "";
  switch (type) {
    case "religious":
      return "Religious";
    case "spiritual":
      return "Spiritual";
    case "secular":
      return "Secular";
    case "celebration-of-life":
      return "Celebration of Life";
    case "no-service":
      return "No Service";
    default:
      return type;
  }
};

// Helper function to get relationship display text
const getRelationshipDisplay = (value?: string) => {
  if (!value) return "";
  const relationship = RELATIONSHIP_TO_CLIENT.find(
    (item) => item.value === value
  );
  return relationship?.label || value;
};

const BurialInstructionsPDF: React.FC<{
  data?: BurialInstructionsFormData & { last_update?: { updatedAt: string } };
}> = ({ data }) => {
  return (
    <Document title="Agensy Burial Instructions">
      <Page size="A4" style={styles.page}>
        <Text style={styles.formTitle}>Agensy Burial Instructions</Text>
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

        {/* Personal Identification Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Identification</Text>
          <Field label="Name">
            {data?.firstName} {data?.lastName}
          </Field>
          <Field label="Date of Birth">{data?.dateOfBirth}</Field>
          <Field label="Time of Death">{data?.timeOfDeath}</Field>
          <Field label="Date of Death">{data?.dateOfDeath}</Field>
          <Field label="County That Issued Death Certificate">
            {data?.countyThatIssuedDeathCertificate}
          </Field>
          <Field label="Number of Death Certificates Ordered">
            {data?.numberOfDeathCertificatesOrdered}
          </Field>
        </View>

        {/* Burial Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Burial Preferences</Text>
          <Field label="Burial Type">
            {getBurialTypeDisplay(data?.burialType, data?.burialTypeOther)}
          </Field>
          <Field label="Preferred Cemetery">{data?.preferredCemetery}</Field>
          <Field label="Plot Owned">
            {getPlotOwnedDisplay(data?.plotOwned)}
          </Field>
          {data?.plotOwned === "yes" && (
            <Field label="Plot Number/Location">
              {data?.plotNumberLocation}
            </Field>
          )}
          <Field label="Funeral Home">{data?.funeralHome}</Field>
          <Field label="Vault/Casket Preferences">
            {data?.vaultCasketPreferences}
          </Field>
          {data?.burialType === "cremation" && (
            <>
              <Field label="Urn Selection">
                {getUrnSelectionDisplay(data?.urnSelection)}
              </Field>
              <Field label="Ashes Disposition">
                {getAshesDispositionDisplay(
                  data?.ashesDisposition,
                  data?.ashesDispositionOther
                )}
              </Field>
            </>
          )}
        </View>

        {/* Service Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <Field label="Type of Service">
            {getServiceTypeDisplay(data?.typeOfService)}
          </Field>
          <Field label="Officiant/Speaker Requested">
            {data?.officiantSpeakerRequested}
          </Field>
          <Field label="Location of Service">{data?.locationOfService}</Field>
          <Field label="Special Requests">{data?.specialRequests}</Field>
        </View>

        {/* Key Contacts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Contacts</Text>
          <Field label="Person Responsible Name">
            {data?.personResponsibleName}
          </Field>
          <Field label="Person Responsible Phone">
            {data?.personResponsiblePhone}
          </Field>
          <Field label="Person Responsible Relationship">
            {getRelationshipDisplay(data?.personResponsibleRelationship)}
          </Field>
          <Field label="Legal/Medical Power of Attorney Name">
            {data?.legalMedicalPowerOfAttorneyName}
          </Field>
          <Field label="Legal/Medical Power of Attorney Phone">
            {data?.legalMedicalPowerOfAttorneyPhone}
          </Field>
          <Field label="Clergy/Spiritual Advisor Name">
            {data?.clergySpiritualAdvisorName}
          </Field>
          <Field label="Clergy/Spiritual Advisor Phone">
            {data?.clergySpiritualAdvisorPhone}
          </Field>
        </View>

        {/* Documents and Notes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documents and Notes</Text>
          <Field label="Will Location">{data?.willLocation}</Field>
          <Field label="Advance Directive Location">
            {data?.advanceDirectiveLocation}
          </Field>
          <Field label="Life Insurance Information">
            {data?.lifeInsuranceInfo}
          </Field>
          <Field label="Relationship">{data?.relationship}</Field>
          <Field label="Obituary Wishes">{data?.obituaryWishes}</Field>
        </View>
      </Page>
    </Document>
  );
};

export default BurialInstructionsPDF;
