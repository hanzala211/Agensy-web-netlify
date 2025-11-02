export type BaseSchema = {
  id: string | number | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface IUser extends BaseSchema {
  role?: string;
  active: boolean;
  cognito_id: string;
  email: string;
  email_verified: boolean;
  first_name: string;
  last_login: Date;
  last_name: string;
  phone?: string;
  avatar?: string;
  subscription_status?: "active" | "inactive" | "canceled";
  is_online?: boolean;
  Roles?: {
    client_id: string;
    role: string;
    primary_user: {
      email: string;
      subscription_status: string;
    };
  }[];
  UserRoles?: {
    client_id: string;
    role: string;
  }[];
}

export interface Client extends BaseSchema {
  primary_user_id: string;
  first_name: string;
  last_name: string;
  preferred_name?: string;
  date_of_birth: string;
  ssn: string | null;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string | null;
  relation: string | null;
  gender: string;
  marital_status: string;
  language: string | null;
  living_situation: string;
  code_status: string | null;
  advance_directive: string | null;
  preferred_hospital: string | null;
  hospital_address: string | null;
  hospital_phone: string | null;
  pharmacy_name: string | null;
  pharmacy_address: string | null;
  pharmacy_phone: string | null;
  pharmacy_fax: string | null;
  clientNotes: Note[];
  active: boolean;
  contacts: ClientContact[];
  medications: ClientMedications[];
  healthcareProviders: HealthcareProvider[];
  medical: ClientMedical;
  documents: Document[];
  Users: AccessInfo[];
}

export interface ClientContact extends BaseSchema {
  client_id: string;
  contact_type: "primary" | "secondary" | "emergency";
  first_name: string;
  last_name: string;
  relationship: string;
  phone: string;
  email: string | null;
  address: string | null;
  notes: Note[];
  active: true;
}

export interface Note extends BaseSchema {
  is_edited: boolean;
  text: string;
  client_id: string;
  user_id: string;
}

export interface ClientMedications extends BaseSchema {
  client_id?: number;
  medication_name?: string;
  dosage?: string;
  frequency?: string;
  purpose?: string;
  prescribing_doctor?: string;
  start_date?: string | null;
  end_date?: string;
  refill_due?: string;
  notes?: string;
  active?: boolean;
  indication?: string;
  side_effects?: string;
  pharmacy?: string;
  client_medication_id?: string;
}

export interface HealthcareProvider extends BaseSchema {
  client_id: number;
  provider_type: string;
  provider_name: string;
  specialty?: string;
  address?: string;
  phone?: string;
  fax?: string;
  last_visit?: string;
  next_visit?: string;
  notes?: string;
  follow_up?: string;
}

export interface ClientMedical extends BaseSchema {
  diagnoses: string;
  allergies: string;
  dietary_restrictions: string;
  surgical_history: string;
  cognitive_status: string;
  last_cognitive_screening: string;
  cognitive_score: string;
  notes: string;
  client_id: string;
  test_type?: string;
}

export interface ClientDocumentCategory extends BaseSchema {
  name: string;
  description: string;
  default_access_level: string;
  active: boolean;
}

export interface Document extends BaseSchema {
  active: boolean;
  category?: string;
  client_id: string;
  description: string;
  document_type: string;
  file_size: number;
  file_type: string;
  file_url: string;
  s3_bucket: string;
  title: string;
  uploadedBy: IUser;
  primary_user_id?: string;
  file_name: string;
  upload_type: "client" | "general";
  client?: Client;
}

export interface AccessInfo extends BaseSchema {
  first_name: string;
  last_name: string;
  relation: string;
  email: string;
  phone: string;
  cognito_id: string;
  UserRoles: { role: "family_member" | "caregiver" | "primary_user" | "admin" };
  subscription_status?: "active" | "inactive" | "canceled";
}

export interface Template extends BaseSchema {
  title: string;
  type: string;
  description: string;
  completedDate?: Date;
}

export interface Appointment extends BaseSchema {
  id: string;
  client_id: string;
  createdBy: IUser;
  title: string;
  appointment_type: string;
  provider_id: string;
  location: string;
  start_time: string;
  end_time: string;
  all_day: boolean;
  notes: string;
  reminder_sent: boolean;
  active: boolean;
  created_by?: string;
  healthcare_provider_id: string;
  post_appointment_notes?: string;
}

export interface Message extends BaseSchema {
  thread_id: string;
  sender_id: string;
  message: string;
  message_id?: string;
  read_at?: Date;
  thread?: Thread;
  sender?: IUser;
  read_by?: {
    read_at: string;
    user_id: string;
  }[];
  file_key?: string;
  file_url?: string;
  file_name?: string;
}

export interface Thread extends BaseSchema {
  primary_user_id?: string;
  user_id: string;
  started_at: Date;
  last_message?: string;
  last_message_time?: Date;
  last_message_sender_id?: string;
  client_id?: string;
  type: "general" | "client" | "broadcast";
  created_by: string;
  messages?: Message[];
  client?: Client | null;
  participants_ids: string[];
  has_unread_messages?: boolean;
  unread_count?: number;
  name?: string;
  participants?: IUser[];
  left_participants?: IUser[];
  left_participants_ids?: string[];
}

export interface BillingHistory extends BaseSchema {
  status: "active" | "inactive" | "canceled";
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  amount: number;
  currency: string;
  payment_method: {
    type: string;
    last4: string;
    brand: string;
    exp_month: number;
    exp_year: number;
  };
  latest_invoice: string;
}

export interface Bloodwork extends BaseSchema {
  name: string;
  date: string;
  results: string;
  ordered_by: string;
  repeat: string;
}

export interface Vaccine extends BaseSchema {
  name: string;
  date: string;
  next_vaccine: string;
}

export interface MedicalCondition extends BaseSchema {
  condition: string;
  onset_date: string;
  notes: string;
}

export interface DigitalAccount extends BaseSchema {
  account: string;
  user_name: string;
  password: string;
  notes: string;
}

export type LogFormType =
  | "essential_document"
  | "vitals_tracker"
  | "care_plan_checklist"
  | "health_history_form"
  | "medical_appointment_template";

export interface LogEntry {
  id: string;
  created_at: string;
  form_type: LogFormType;
  subtype_name: string;
  subtype_id: string;
  user: {
    first_name: string;
    last_name: string;
  };
}

export interface ActivityFeedEvent extends BaseSchema {
  user_name: string; // Name of user who performed action
  client_name: string; // Name of client the activity relates to
  category: "medical" | "messages" | "appointments" | "documents";
  action_type: string; // Description of action
  description: string; // Full activity description
  timestamp: string; // Relative time string (e.g., "2 mins ago", "1 hour ago")
}
