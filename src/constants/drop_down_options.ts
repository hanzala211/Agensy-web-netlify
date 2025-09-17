export const RELATIONSHIP_TO_CLIENT = [
  { label: "Daughter", value: "daughter" },
  { label: "Son", value: "son" },
  { label: "Spouse", value: "spouse" },
  { label: "Sibling", value: "sibling" },
  { label: "Parent", value: "parent" },
  { label: "Grandchild", value: "grandchild" },
  { label: "Legal Guardian", value: "legal_guardian" },
  { label: "Caregiver", value: "caregiver" },
  { label: "Other", value: "other" },
];

export const CLIENTS_FILTERS = [
  { value: "all", label: "All Care Recipients" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export const CLIENTS_SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "status", label: "Status" },
  { value: "dob", label: "Date of Birth" },
  { value: "living", label: "Living Situation" },
];

export const MARITAL_STATUS_OPTIONS = [
  { label: "Single", value: "single" },
  { label: "Married", value: "married" },
  { label: "Divorced", value: "divorced" },
  { label: "Widowed", value: "widowed" },
];

export const LIVING_SITUATION_OPTIONS = [
  { label: "Independent", value: "independent" },
  { label: "Assisted Living", value: "assisted" },
  { label: "Nursing Home", value: "nursing" },
  { label: "With Family", value: "family" },
];

export const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

export const MEDICATION_FREQUENCY_OPTIONS = [
  { label: "Once daily", value: "Once daily" },
  { label: "Twice daily", value: "Twice daily" },
  { label: "Three times daily", value: "Three times daily" },
  { label: "Four times daily", value: "Four times daily" },
  { label: "Every morning", value: "Every morning" },
  { label: "Every evening", value: "Every evening" },
  { label: "Every other day", value: "Every other day" },
  { label: "Once weekly", value: "Once weekly" },
  { label: "As needed", value: "As needed" },
  { label: "Other", value: "Other" },
];

export const DOCUMENT_SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "A-Z", value: "a-z" },
  { label: "Z-A", value: "z-a" },
];

export const DOCUMENT_CATEGORY_OPTIONS = [
  { label: "Medical Records", value: "Medical Records" },
  { label: "Legal Documents", value: "Legal Documents" },
  { label: "Financial Records", value: "Financial Records" },
  { label: "Insurance Information", value: "Insurance Information" },
  { label: "Care Plans", value: "Care Plans" },
  { label: "ID Cards & Vital Documents", value: "ID Cards & Vital Documents" },
  { label: "Notes & Correspondence", value: "Notes & Correspondence" },
  { label: "Miscellaneous/Other", value: "Miscellaneous/Other" },
];

export const DOCUMENT_UPLOAD_TYPE_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Care Recipient", value: "client" },
  { label: "General", value: "general" },
];

export const ACCESS_ROLE_OPTIONS = [
  { label: "Family Member", value: "family_member" },
  { label: "Caregiver", value: "caregiver" },
];

export const ACCESS_ROLE_FILTERS = [
  { label: "All Roles", value: "all" },
  { label: "Family Admin", value: "primary_user" },
  { label: "Family Member", value: "family_member" },
  { label: "Caregiver", value: "caregiver" },
];

export const ACCESS_SORT_OPTIONS = [
  { label: "Name (A-Z)", value: "name-asc" },
  { label: "Name (Z-A)", value: "name-desc" },
  { label: "Role", value: "role" },
  { label: "Relationship", value: "relationship" },
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
];

export const TEMPLATE_TYPE_OPTIONS = [
  { label: "Form", value: "form" },
  { label: "Checklist", value: "checklist" },
  { label: "Guide", value: "guide" },
];

export const TEMPLATE_SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "A-Z", value: "a-z" },
  { label: "Z-A", value: "z-a" },
];

export const APPOINTMENT_TYPE_FILTERS = [
  { label: "All", value: "all" },
  { label: "Regular Checkup", value: "regular checkup" },
  { label: "Dental", value: "dental" },
  { label: "Therapy", value: "therapy" },
  { label: "Laboratory", value: "laboratory" },
  { label: "Vision", value: "vision" },
  { label: "Other", value: "other" },
];

export const APPOINTMENT_SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Title (A-Z)", value: "title-asc" },
  { label: "Title (Z-A)", value: "title-desc" },
];

export const APPOINTMENT_TYPES = [
  { label: "Regular Checkup", value: "regular checkup" },
  { label: "Dental", value: "dental" },
  { label: "Therapy", value: "therapy" },
  { label: "Laboratory", value: "laboratory" },
  { label: "Vision", value: "vision" },
  { label: "Other", value: "other" },
];

export const USER_ROLES = [
  { label: "Family Admin", value: "primary_user" },
  ...ACCESS_ROLE_OPTIONS,
];

export const MESSAGING_TYPES = [
  { label: "Care Recipient", value: "client" },
  { label: "General", value: "general" },
];

export const CODE_STATUS_OPTIONS = [
  { label: "Full Code", value: "full_code" },
  { label: "DNR", value: "dnr" },
  { label: "DNI", value: "dni" },
  { label: "Comfort Care", value: "comfort_care" },
];

export const ADVANCE_DIRECTIVE_OPTIONS = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
  { label: "Unknown", value: "unknown" },
];

export const SEVERITY_OPTIONS = [
  { label: "Mild", value: "mild" },
  { label: "Moderate", value: "moderate" },
  { label: "Severe", value: "severe" },
  { label: "Life-threatening", value: "life_threatening" },
];

export const RACE_OPTIONS = [
  {
    label: "American Indian or Alaska Native",
    value: "american_indian_alaska_native",
  },
  { label: "Asian", value: "asian" },
  { label: "Black or African American", value: "black_african_american" },
  { label: "Hispanic or Latino", value: "hispanic_latino" },
  {
    label: "Native Hawaiian or Other Pacific Islander",
    value: "native_hawaiian_pacific_islander",
  },
  { label: "White", value: "white" },
  { label: "Other", value: "other" },
  { label: "Prefer not to say", value: "prefer_not_to_say" },
];

export const LANGUAGE_OPTIONS = [
  { label: "English", value: "english" },
  { label: "Spanish", value: "spanish" },
  { label: "French", value: "french" },
  { label: "German", value: "german" },
  { label: "Italian", value: "italian" },
  { label: "Portuguese", value: "portuguese" },
  { label: "Russian", value: "russian" },
  { label: "Chinese (Mandarin)", value: "chinese_mandarin" },
  { label: "Chinese (Cantonese)", value: "chinese_cantonese" },
  { label: "Japanese", value: "japanese" },
  { label: "Korean", value: "korean" },
  { label: "Arabic", value: "arabic" },
  { label: "Hindi", value: "hindi" },
  { label: "Vietnamese", value: "vietnamese" },
  { label: "Tagalog", value: "tagalog" },
  { label: "Other", value: "other" },
];

export const COGNITIVE_STATUS = [
  { label: "Alert", value: "Alert" },
  { label: "Oriented", value: "Oriented" },
  { label: "Dementia", value: "Dementia" },
  { label: "Mild Cognitive Impairment", value: "Mild Cognitive Impairment" },
  { label: "Other", value: "Other" },
];

export const SPECIALTIES = [
  { label: "Family Medicine", value: "Family Medicine" },
  { label: "Internal Medicine", value: "Internal Medicine" },
  { label: "Pediatrics", value: "Pediatrics" },
  { label: "Cardiology", value: "Cardiology" },
  { label: "Endocrinology", value: "Endocrinology" },
  { label: "Gastroenterology", value: "Gastroenterology" },
  { label: "Neurology", value: "Neurology" },
  { label: "Orthopedic Surgery", value: "Orthopedic Surgery" },
  { label: "Obstetrics", value: "Obstetrics" },
  { label: "Gynecology", value: "Gynecology" },
  { label: "Psychiatry", value: "Psychiatry" },
  { label: "Dermatology", value: "Dermatology" },
  { label: "Ophthalmology", value: "Ophthalmology" },
  { label: "Emergency Medicine", value: "Emergency Medicine" },
  { label: "Pulmonology", value: "Pulmonology" },
  { label: "Oncology", value: "Oncology" },
  { label: "Urology", value: "Urology" },
  { label: "Radiology", value: "Radiology" },
  { label: "Physical Therapy", value: "Physical Therapy" },
  { label: "Other", value: "Other" },
];

export const TEST_TYPES = [
  {
    label: "MMSE",
    value: "MMSE",
  },
  {
    label: "Mini-Cog",
    value: "Mini-Cog",
  },
  {
    label: "MoCA",
    value: "MoCA",
  },

  {
    label: "SLUMS",
    value: "SLUMS",
  },
];

export const FILLING_FOR_OPTIONS = [
  { label: "Self", value: "Self" },
  { label: "Mother", value: "Mother" },
  { label: "Father", value: "Father" },
  { label: "Both", value: "Both" },
  { label: "Other", value: "Other" },
];

export const OCR_DOCUMENT_TYPES = [
  { label: "ID Card", value: "id_card" },
  { label: "Insurance Card", value: "insurance_card" },
  { label: "Driver License", value: "driver_license" },
  { label: "Medical Record", value: "medical_record" },
];

export const ACCOUNT_TYPE_OPTIONS = [
  { value: "checking", label: "Checking" },
  { value: "savings", label: "Savings" },
];

export const BURIAL_TYPES = {
  TRADITIONAL_BURIAL: "traditional-burial",
  GREEN_BURIAL: "green-burial",
  CREMATION: "cremation",
  OTHER: "other",
};

export const FORM_TYPE_OPTIONS: {
  label: string;
  value: string;
}[] = [
  { label: "All", value: "all" },
  {
    label: "Face sheet short",
    value: "face_sheet_short",
  },
  {
    label: "Face sheet long",
    value: "face_sheet_long",
  },
  {
    label: "Health history form",
    value: "health_history",
  },
  {
    label: "Care recipient questionnaire",
    value: "care_recipient_questionnaire",
  },
  {
    label: "Caregiver information sheet",
    value: "caregiver_information_sheet",
  },
  {
    label: "Initial care plan assessment",
    value: "initial_care_plan_assessment",
  },
  {
    label: "Comprehensive care plan assessment",
    value: "comprehensive_care_plan_assessment",
  },
  {
    label: "Essential Document for Aging",
    value: "essential_document",
  },
  {
    label: "Labs test imaging tracker",
    value: "labs_test_imaging_tracker",
  },
  {
    label: "Burial instructions",
    value: "burial_instructions",
  },
  {
    label: "In patient stay notes",
    value: "in_patient_stay_notes",
  },
  {
    label: "Comprehensive medication supplement list",
    value: "comprehensive_medication_supplement_list",
  },
  {
    label: "Personal info password manager",
    value: "personal_info_password_manager",
  },
  {
    label: "Trusted Network Directory",
    value: "important_people",
  },
  {
    label: "Start of care",
    value: "start_of_care",
  },
  {
    label: "Hospitalization Checklist",
    value: "hospitalization",
  },
  {
    label: "Move in",
    value: "move_in",
  },
  {
    label: "Next step after death",
    value: "next_step_after_death",
  },
  {
    label: "Vitals Tracker",
    value: "vitals_tracker",
  },
  {
    label: "When to call a care plan",
    value: "care_plan",
  },
  {
    label: "Medical Appointment Template",
    value: "medical_template",
  },
  {
    label: "Long Term Care Insurance Policy",
    value: "long_term_care_insurance_policy",
  },
];

export const SORT_OPTIONS = [
  { label: "Newest first", value: "DESC" },
  { label: "Oldest first", value: "ASC" },
];

export const PROVIDER_TYPES = [
  { label: "Primary Care", value: "Primary Care" },
  { label: "Specialist", value: "Specialist" },
  { label: "Urgent Care", value: "Urgent Care" },
  { label: "Hospital", value: "Hospital" },
  { label: "Home Health", value: "Home Health" },
  { label: "Therapist", value: "Therapist" },
  { label: "Other", value: "Other" },
];
