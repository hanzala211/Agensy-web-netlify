import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { ComprehensiveCarePlanFormData } from "@agensy/types";
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
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: BORDER,
    marginRight: 6,
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: BORDER,
  },
  checkboxLabel: {
    fontSize: 9,
  },
  listItem: {
    flexDirection: "row",
    padding: 2,
  },
  bullet: {
    width: 8,
    fontSize: 9,
    marginRight: 4,
  },
  listText: {
    flex: 1,
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
    <View style={styles.value}>{children || <Text>-</Text>}</View>
  </View>
);

const CheckboxField = ({
  label,
  checked,
}: {
  label: string;
  checked?: boolean;
}) => (
  <View style={styles.checkboxContainer}>
    <View style={[styles.checkbox, checked ? styles.checkboxChecked : {}]} />
    <Text style={styles.checkboxLabel}>{label}</Text>
  </View>
);

const TableHeader = ({ columns }: { columns: string[] }) => (
  <View style={styles.tableHeader}>
    {columns.map((column, index) => (
      <Text key={index} style={styles.th}>
        {column}
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
    {cells.map((cell, index) => (
      <Text key={index} style={styles.td}>
        {cell || "-"}
      </Text>
    ))}
  </View>
);

const ListItem = ({ text }: { text: string }) => (
  <View style={styles.listItem}>
    <Text style={styles.bullet}>•</Text>
    <Text style={styles.listText}>{text}</Text>
  </View>
);

const ComprehensiveCarePlanPDF: React.FC<{
  data?: ComprehensiveCarePlanFormData & {
    last_update: { updatedAt: string };
  };
}> = ({ data }) => {
  if (!data) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>No data available</Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Image src={logo} style={styles.headerLogo} />
          <View style={styles.headerDateBox}>
            <Text>
              {data.last_update?.updatedAt
                ? `Last Updated: ${DateUtils.formatDateToRequiredFormat(
                    data.last_update.updatedAt
                  )}`
                : "No update date"}
            </Text>
          </View>
        </View>

        <Text style={styles.formTitle}>Comprehensive Care Plan</Text>

        {/* Client Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client Information</Text>
          <Field label="First Name">
            <Text>{data.firstName || "-"}</Text>
          </Field>
          <Field label="Last Name">
            <Text>{data.lastName || "-"}</Text>
          </Field>
          <Field label="Date of Birth">
            <Text>
              {data.dateOfBirth
                ? DateUtils.formatDateToRequiredFormat(data.dateOfBirth)
                : "-"}
            </Text>
          </Field>
          <Field label="Preferred Hospital">
            <Text>{data.preferredHospital || "-"}</Text>
          </Field>
          <Field label="Pharmacy Name">
            <Text>{data.pharmacyName || "-"}</Text>
          </Field>
        </View>

        {/* Assessment Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assessment Information</Text>
          <Field label="Date of Assessment">
            <Text>
              {data.dateOfAssessment
                ? DateUtils.formatDateToRequiredFormat(data.dateOfAssessment)
                : "-"}
            </Text>
          </Field>
          <Field label="Date of Care Plan">
            <Text>
              {data.dateOfCarePlan
                ? DateUtils.formatDateToRequiredFormat(data.dateOfCarePlan)
                : "-"}
            </Text>
          </Field>
          <Field label="Person Completing Assessment">
            <Text>{data.personCompletingAssessment || "-"}</Text>
          </Field>
          <Field label="Present for Assessment">
            <Text>{data.presentForAssessment || "-"}</Text>
          </Field>
          <Field label="Goals for Assessment">
            {Array.isArray(data.goalsForAssessment) &&
            data.goalsForAssessment.length > 0 ? (
              data.goalsForAssessment.map((goal, index) => (
                <ListItem key={index} text={goal} />
              ))
            ) : (
              <Text>-</Text>
            )}
          </Field>
        </View>

        {/* Initial Request */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Initial Request</Text>
          <Field label="Initial Request">
            <Text>{data.initialRequest || "-"}</Text>
          </Field>
        </View>

        {/* Care Recipient Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Care Recipient Goals</Text>
          <Field label="Goals">
            <Text>{data.careRecipientGoals || "-"}</Text>
          </Field>
        </View>

        {/* Demographic and Historic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Demographic and Historic Information
          </Text>
          <Field label="Information">
            <Text>{data.demographicAndHistoricInformation || "-"}</Text>
          </Field>
        </View>

        {/* Medical History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical History</Text>
          <Field label="History">
            <Text>{data.medicalHistory || "-"}</Text>
          </Field>
        </View>

        {/* Medications */}
        {data.medications && data.medications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medications</Text>
            <TableHeader
              columns={[
                "Medication Name",
                "Dosage",
                "Frequency",
                "Start Date",
                "End Date",
                "Used to Treat",
              ]}
            />
            {data.medications.map((medication, index) => (
              <TableRow
                key={index}
                cells={[
                  medication.medicationName,
                  medication.dosage,
                  medication.frequency,
                  medication.startDate
                    ? DateUtils.formatDateToRequiredFormat(medication.startDate)
                    : "",
                  medication.endDate
                    ? DateUtils.formatDateToRequiredFormat(medication.endDate)
                    : "",
                  medication.usedToTreat,
                ]}
                last={index === data.medications!.length - 1}
              />
            ))}
          </View>
        )}

        {/* Allergies */}
        {data.allergies && data.allergies.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Allergies</Text>
            {data.allergies.map((allergy, index) => (
              <ListItem key={index} text={allergy.allergen || ""} />
            ))}
          </View>
        )}

        {/* Healthcare Providers */}
        {data.healthcareProviders && data.healthcareProviders.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Healthcare Providers</Text>
            <TableHeader
              columns={[
                "Provider Name",
                "Provider Type",
                "Specialty",
                "Address",
                "Phone",
              ]}
            />
            {data.healthcareProviders.map((provider, index) => (
              <TableRow
                key={index}
                cells={[
                  provider.providerName,
                  provider.providerType,
                  provider.specialty,
                  provider.address,
                  provider.phone,
                ]}
                last={index === data.healthcareProviders!.length - 1}
              />
            ))}
          </View>
        )}

        {/* Next Steps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Steps</Text>
          <Field label="Care Recipient Next Steps">
            {data.nextStepCareRecipient &&
            data.nextStepCareRecipient.length > 0 ? (
              <View>
                {data.nextStepCareRecipient.map((step, index) => (
                  <ListItem key={index} text={step} />
                ))}
              </View>
            ) : (
              <Text>-</Text>
            )}
          </Field>
          <Field label="Care Partner Next Steps">
            {data.nextStepCarePartner && data.nextStepCarePartner.length > 0 ? (
              <View>
                {data.nextStepCarePartner.map((step, index) => (
                  <ListItem key={index} text={step} />
                ))}
              </View>
            ) : (
              <Text>-</Text>
            )}
          </Field>
        </View>

        {/* Focused Recommendations */}
        {data.focusedRecommendations &&
          data.focusedRecommendations.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Focused Recommendations</Text>
              {data.focusedRecommendations.map((recommendation, index) => (
                <View key={index} style={styles.fieldRow}>
                  <Text style={styles.label}>Recommendation {index + 1}</Text>
                  <View style={styles.value}>
                    <Text style={{ fontWeight: "bold" }}>
                      {recommendation.name || "Unnamed Recommendation"}
                    </Text>
                    <Text>{recommendation.description || ""}</Text>
                    {recommendation.details &&
                      recommendation.details.length > 0 && (
                        <View style={{ marginTop: 4 }}>
                          {recommendation.details.map((detail, detailIndex) => (
                            <ListItem key={detailIndex} text={detail} />
                          ))}
                        </View>
                      )}
                  </View>
                </View>
              ))}
            </View>
          )}

        {/* Functional ADLs */}
        {data.functionalAdls && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Functional ADLs</Text>
            <Field label="Summary">
              <Text>{data.functionalAdls.summary || "-"}</Text>
            </Field>
            <Field label="Deficits Noted">
              <Text>
                {data.functionalAdls.deficitsNoted === "true" ? "Yes" : "No"}
              </Text>
            </Field>
            {data.functionalAdls.detailedTable && (
              <View style={{ marginTop: 10 }}>
                <TableHeader columns={["Activity", "Description", "Score"]} />
                {Object.entries(data.functionalAdls.detailedTable).map(
                  ([key, value]) => (
                    <TableRow
                      key={key}
                      cells={[
                        key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase()),
                        value?.description || "",
                        value?.score || "",
                      ]}
                    />
                  )
                )}
              </View>
            )}
          </View>
        )}

        {/* Functional IADLs */}
        {data.functionalIadls && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Functional IADLs</Text>
            <Field label="Summary">
              <Text>{data.functionalIadls.summary || "-"}</Text>
            </Field>
            {data.functionalIadls.detailedTable && (
              <View style={{ marginTop: 10 }}>
                <TableHeader columns={["Activity", "Description", "Score"]} />
                {Object.entries(data.functionalIadls.detailedTable).map(
                  ([key, value]) => (
                    <TableRow
                      key={key}
                      cells={[
                        key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase()),
                        value?.description || "",
                        value?.score || "",
                      ]}
                    />
                  )
                )}
              </View>
            )}
            {data.functionalIadls.additionalData && (
              <View style={{ marginTop: 10 }}>
                <Text style={[styles.sectionTitle, { fontSize: 9 }]}>
                  Additional Problems Identified
                </Text>
                {Object.entries(data.functionalIadls.additionalData).map(
                  ([key, problem]) => (
                    <View key={key} style={styles.fieldRow}>
                      <Text style={styles.label}>
                        Problem {key.replace("identifiedProblem", "")}
                      </Text>
                      <View style={styles.value}>
                        <Text style={{ fontWeight: "bold" }}>
                          {problem?.identifiedProblem || ""}
                        </Text>
                        <Text>Goal: {problem?.goal || ""}</Text>
                        <Text>
                          Intervention: {problem?.interventionAction || ""}
                        </Text>
                        <Text>Referral: {problem?.referralOptions || ""}</Text>
                      </View>
                    </View>
                  )
                )}
              </View>
            )}
          </View>
        )}

        {/* Home Safety */}
        {data.homeSafety && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Home Safety Assessment</Text>
            <Field label="Summary">
              <Text>{data.homeSafety.summary || "-"}</Text>
            </Field>
            <Field label="Deficits Noted">
              <Text>
                {data.homeSafety.deficitsNoted === "true" ? "Yes" : "No"}
              </Text>
            </Field>
            {data.homeSafety.detailedTable && (
              <View style={{ marginTop: 10 }}>
                <Text style={[styles.sectionTitle, { fontSize: 9 }]}>
                  Safety Checklist
                </Text>
                {Object.entries(data.homeSafety.detailedTable).map(
                  ([key, value]) => (
                    <CheckboxField
                      key={key}
                      label={key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                      checked={value}
                    />
                  )
                )}
              </View>
            )}
          </View>
        )}

        {/* Memory and Reasoning */}
        {data.memoryAndReasoning && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Memory and Reasoning</Text>
            <Field label="Summary">
              <Text>{data.memoryAndReasoning.summary || "-"}</Text>
            </Field>
            <Field label="Deficits Noted">
              <Text>
                {data.memoryAndReasoning.deficitsNoted === "true"
                  ? "Yes"
                  : "No"}
              </Text>
            </Field>
            {data.memoryAndReasoning.detailedTable && (
              <View style={{ marginTop: 10 }}>
                <Text style={[styles.sectionTitle, { fontSize: 9 }]}>
                  Identified Problems
                </Text>
                {Object.entries(data.memoryAndReasoning.detailedTable).map(
                  ([key, problem]) => (
                    <View key={key} style={styles.fieldRow}>
                      <Text style={styles.label}>
                        Problem {key.replace("identifiedProblem", "")}
                      </Text>
                      <View style={styles.value}>
                        <Text style={{ fontWeight: "bold" }}>
                          {problem?.identifiedProblem || ""}
                        </Text>
                        <Text>Goal: {problem?.goal || ""}</Text>
                        <Text>
                          Intervention: {problem?.interventionAction || ""}
                        </Text>
                        <Text>Referral: {problem?.referralOptions || ""}</Text>
                      </View>
                    </View>
                  )
                )}
              </View>
            )}
          </View>
        )}

        {/* Geriatric Depression */}
        {data.geriatricDepression && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Geriatric Depression</Text>
            <Field label="Summary">
              <Text>{data.geriatricDepression.summary || "-"}</Text>
            </Field>
            <Field label="Deficits Noted">
              <Text>
                {data.geriatricDepression.deficitsNoted === "true"
                  ? "Yes"
                  : "No"}
              </Text>
            </Field>
            {data.geriatricDepression.detailedTable && (
              <View style={{ marginTop: 10 }}>
                <Text style={[styles.sectionTitle, { fontSize: 9 }]}>
                  Identified Problems
                </Text>
                {Object.entries(data.geriatricDepression.detailedTable).map(
                  ([key, problem]) => (
                    <View key={key} style={styles.fieldRow}>
                      <Text style={styles.label}>
                        Problem {key.replace("identifiedProblem", "")}
                      </Text>
                      <View style={styles.value}>
                        <Text style={{ fontWeight: "bold" }}>
                          {problem?.identifiedProblem || ""}
                        </Text>
                        <Text>Goal: {problem?.goal || ""}</Text>
                        <Text>
                          Intervention: {problem?.interventionAction || ""}
                        </Text>
                        <Text>Referral: {problem?.referralOptions || ""}</Text>
                      </View>
                    </View>
                  )
                )}
              </View>
            )}
          </View>
        )}

        {/* Nutritional Health */}
        {data.nutritionalHealth && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nutritional Health</Text>
            <Field label="Summary">
              <Text>{data.nutritionalHealth.summary || "-"}</Text>
            </Field>
            <Field label="Deficits Noted">
              <Text>
                {data.nutritionalHealth.deficitsNoted === "true" ? "Yes" : "No"}
              </Text>
            </Field>
            {data.nutritionalHealth.detailedTable && (
              <View style={{ marginTop: 10 }}>
                <Text style={[styles.sectionTitle, { fontSize: 9 }]}>
                  Identified Problems
                </Text>
                {Object.entries(data.nutritionalHealth.detailedTable).map(
                  ([key, problem]) => (
                    <View key={key} style={styles.fieldRow}>
                      <Text style={styles.label}>
                        Problem {key.replace("identifiedProblem", "")}
                      </Text>
                      <View style={styles.value}>
                        <Text style={{ fontWeight: "bold" }}>
                          {problem?.identifiedProblem || ""}
                        </Text>
                        <Text>Goal: {problem?.goal || ""}</Text>
                        <Text>
                          Intervention: {problem?.interventionAction || ""}
                        </Text>
                        <Text>Referral: {problem?.referralOptions || ""}</Text>
                      </View>
                    </View>
                  )
                )}
              </View>
            )}
          </View>
        )}

        {/* Legal and Financial */}
        {data.legalAndFinancial && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legal and Financial</Text>
            <Field label="Summary">
              <Text>{data.legalAndFinancial.summary || "-"}</Text>
            </Field>
            <Field label="Deficits Noted">
              <Text>
                {data.legalAndFinancial.deficitsNoted === "true" ? "Yes" : "No"}
              </Text>
            </Field>
            {data.legalAndFinancial.detailedTable && (
              <View style={{ marginTop: 10 }}>
                <Text style={[styles.sectionTitle, { fontSize: 9 }]}>
                  Identified Problems
                </Text>
                {Object.entries(data.legalAndFinancial.detailedTable).map(
                  ([key, problem]) => (
                    <View key={key} style={styles.fieldRow}>
                      <Text style={styles.label}>
                        Problem {key.replace("identifiedProblem", "")}
                      </Text>
                      <View style={styles.value}>
                        <Text style={{ fontWeight: "bold" }}>
                          {problem?.identifiedProblem || ""}
                        </Text>
                        <Text>Goal: {problem?.goal || ""}</Text>
                        <Text>
                          Intervention: {problem?.interventionAction || ""}
                        </Text>
                        <Text>Referral: {problem?.referralOptions || ""}</Text>
                      </View>
                    </View>
                  )
                )}
              </View>
            )}
          </View>
        )}

        {/* Caregiver Support */}
        {data.careGiverSupport && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Caregiver Support</Text>
            <Field label="Summary">
              <Text>{data.careGiverSupport.summary || "-"}</Text>
            </Field>
            <Field label="Deficits Noted">
              <Text>
                {data.careGiverSupport.deficitsNoted === "true" ? "Yes" : "No"}
              </Text>
            </Field>
            {data.careGiverSupport.detailedTable && (
              <View style={{ marginTop: 10 }}>
                <Text style={[styles.sectionTitle, { fontSize: 9 }]}>
                  Identified Problems
                </Text>
                {Object.entries(data.careGiverSupport.detailedTable).map(
                  ([key, problem]) => (
                    <View key={key} style={styles.fieldRow}>
                      <Text style={styles.label}>
                        Problem {key.replace("identifiedProblem", "")}
                      </Text>
                      <View style={styles.value}>
                        <Text style={{ fontWeight: "bold" }}>
                          {problem?.identifiedProblem || ""}
                        </Text>
                        <Text>Goal: {problem?.goal || ""}</Text>
                        <Text>
                          Intervention: {problem?.interventionAction || ""}
                        </Text>
                        <Text>Referral: {problem?.referralOptions || ""}</Text>
                      </View>
                    </View>
                  )
                )}
              </View>
            )}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ComprehensiveCarePlanPDF;
