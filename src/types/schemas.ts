export type BaseSchema = {
  id: string | number;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface IUser extends BaseSchema {
  active: boolean;
  cognito_id: string;
  email: string;
  email_verified: boolean;
  first_name: string;
  last_login: Date;
  last_name: string;
  phone?: string;
  avatar?: string;
  role?: string;
}

export interface Client extends BaseSchema {
  primary_user_id: string;
  first_name: string;
  last_name: string;
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
  role: "family_member" | "caregiver" | "primary_user";
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
