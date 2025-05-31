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
  { value: "all", label: "All Clients" },
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
  { label: "Client", value: "client" },
  { label: "General", value: "general" },
];

export const ACCESS_ROLE_OPTIONS = [
  { label: "Family Member", value: "family_member" },
  { label: "Caregiver", value: "caregiver" },
];

export const ACCESS_ROLE_FILTERS = [
  { label: "All Roles", value: "all" },
  ...ACCESS_ROLE_OPTIONS,
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
  { label: "Primary User", value: "primary_user" },
  ...ACCESS_ROLE_OPTIONS,
];
