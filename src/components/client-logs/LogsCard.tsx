import { BorderedCard } from "@agensy/components";
import { FORM_TYPE_OPTIONS, ICONS } from "@agensy/constants";
import type { LogEntry } from "@agensy/types";
import { DateUtils } from "@agensy/utils";
import { useParams } from "react-router-dom";
import { ROUTES } from "@agensy/constants";

const getFormNavigationPath = (formType: string, subtypeId?: string) => {
  const formTypeMap: Record<string, { folder: string; form: string }> = {
    face_sheet_short: { folder: "medical", form: "face-sheet-short" },
    face_sheet_long: { folder: "medical", form: "face-sheet-long" },
    health_history: { folder: "medical", form: "health-history-form-medical" },
    care_recipient_questionnaire: {
      folder: "assessment",
      form: "care-recipient-questionnaire",
    },
    caregiver_information_sheet: {
      folder: "caregiver",
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
      folder: "checklists",
      form: "essential-document-for-aging",
    },
    labs_test_imaging_tracker: {
      folder: "records-trackers",
      form: "labs-test-tracker",
    },
    burial_instructions: { folder: "checklists", form: "burial-instructions" },
    in_patient_stay_notes: {
      folder: "records-trackers",
      form: "in-patient-stay-notes",
    },
    comprehensive_medication_supplement_list: {
      folder: "records-trackers",
      form: "comprehensive-medication-list",
    },
    personal_info_password_manager: {
      folder: "records-trackers",
      form: "personal-info",
    },
    important_people: {
      folder: "records-trackers",
      form: "important-people-in-life",
    },
    start_of_care: { folder: "start-of-care", form: "start-of-care-checklist" },
    hospitalization: { folder: "checklists", form: "hospital-checklist" },
    move_in: { folder: "checklists", form: "move-in" },
    next_step_after_death: {
      folder: "checklists",
      form: "next-steps-after-death",
    },
    vitals_tracker: { folder: "records-trackers", form: "vitals-tracker" },
    care_plan: { folder: "care-plans", form: "care-plan-checklists" },
    medical_template: {
      folder: "medical",
      form: "medical-appointment-template",
    },
  };

  const path = formTypeMap[formType];

  if (formType === "medical_template" && subtypeId) {
    return {
      ...path,
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
    if (formPath && clientId) {
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
