import { BorderedCard } from "@agensy/components";
import { FORM_TYPE_OPTIONS, ICONS } from "@agensy/constants";
import type { LogEntry } from "@agensy/types";
import { DateUtils } from "@agensy/utils";
import { useParams } from "react-router-dom";
import { ROUTES } from "@agensy/constants";

const getFormNavigationPath = (formType: string, subtypeId?: string) => {
  const formTypeMap: Record<string, { folder: string; form: string }> = {
    face_sheet_short: {
      folder: "essential-health-information",
      form: "face-sheet-short",
    },
    face_sheet_long: {
      folder: "essential-health-information",
      form: "face-sheet-long",
    },
    health_history: {
      folder: "essential-health-information",
      form: "health-history-form-medical",
    },
    care_recipient_questionnaire: {
      folder: "assessment",
      form: "care-recipient-questionnaire",
    },
    caregiver_information_sheet: {
      folder: "guides-checklists",
      form: "caregiver-information",
    },
    initial_care_plan_assessment: {
      folder: "assessment",
      form: "initial-assessment",
    },
    comprehensive_care_plan_assessment: {
      folder: "assessment",
      form: "comprehensive-care-plan-assessment",
    },
    essential_document: {
      folder: "guides-checklists",
      form: "essential-document-for-aging",
    },
    labs_test_imaging_tracker: {
      folder: "essential-health-information",
      form: "labs-test-tracker",
    },
    burial_instructions: {
      folder: "essential-documents-for-aging",
      form: "burial-instructions",
    },
    in_patient_stay_notes: {
      folder: "essential-health-information",
      form: "in-patient-stay-notes",
    },
    comprehensive_medication_supplement_list: {
      folder: "essential-health-information",
      form: "comprehensive-medication-list",
    },
    personal_info_password_manager: {
      folder: "essential-documents-for-aging",
      form: "personal-info",
    },
    important_people: {
      folder: "essential-documents-for-aging",
      form: "important-people-in-life",
    },
    start_of_care: {
      folder: "guides-checklists",
      form: "start-of-care-checklist",
    },
    hospitalization: {
      folder: "guides-checklists",
      form: "hospital-checklist",
    },
    move_in: { folder: "guides-checklists", form: "move-in-checklist" },
    next_step_after_death: {
      folder: "guides-checklists",
      form: "next-steps-after-death",
    },
    vitals_tracker: {
      folder: "essential-health-information",
      form: "vitals-tracker",
    },
    care_plan: { folder: "guides-checklists", form: "care-plan-checklists" },
    medical_template: {
      folder: "medical-appointment-templates",
      form: "medical-appointment-templates",
    },
  };

  const path = formTypeMap[formType];

  if (formType === "medical_template" && subtypeId) {
    return {
      folder: "medical-appointment-templates",
      form: `medical-appointment-template_${subtypeId}`,
    };
  }

  return path;
};

export const LogsCard = (log: LogEntry) => {
  const { clientId } = useParams();

  const label =
    FORM_TYPE_OPTIONS.find((o) => o.value === log.form_type)?.label ||
    log.form_type;

  const displayLabel = log.subtype_name || label;

  const userName = `${log.user.first_name} ${log.user.last_name}`;

  const handleFormClick = () => {
    const formPath = getFormNavigationPath(log.form_type, log.subtype_id);
    if (formPath && clientId && "folder" in formPath) {
      if (formPath.form.includes("/")) {
        const [parentFolder, formSlug] = formPath.form.split("/");
        return `/clients/${clientId}/${ROUTES.agensyFormsFolders}/${formPath.folder}/${parentFolder}/${formSlug}`;
      }
      return `/clients/${clientId}/${ROUTES.agensyFormsFolders}/${formPath.folder}/${formPath.form}`;
    }
  };

  return (
    <BorderedCard
      key={log.id}
      className="flex items-start justify-between gap-4"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-lightBlue flex items-center justify-center">
          <ICONS.fileTextIcon className="text-primaryColor" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <a
              className="font-medium text-darkGray cursor-pointer hover:text-primaryColor transition-colors"
              href={handleFormClick()}
            >
              {displayLabel}
            </a>
          </div>
          <div className="text-sm text-slateGrey mt-1">
            <span>By {userName}</span>
            <span className="mx-2">•</span>
            <span title={DateUtils.formatDateTime(log.created_at)}>
              {DateUtils.formatRelativeTime(log.created_at)}
            </span>
          </div>
        </div>
      </div>
    </BorderedCard>
  );
};
