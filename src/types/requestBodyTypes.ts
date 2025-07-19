export interface ClientAddRequestData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  marital_status: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  living_situation: string;
  preferred_hospital: string;
  hospital_address: string;
  hospital_phone: string;
  pharmacy_name: string;
  pharmacy_address: string;
  pharmacy_phone: string;
  pharmacy_fax: string;
}

export interface ContactAddRequestData {
  contact_type: string;
  first_name: string;
  last_name: string;
  relationship: string;
  phone: string;
  client_id?: string;
}

export interface ClientMedicationAddRequestData {
  medication_name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  prescribing_doctor: string;
  start_date: string;
  end_date: string;
  refill_due: string;
}

export interface ClientMedicalHistoryRequestData {
  diagnoses: string;
  allergies: string;
  dietary_restrictions: string;
  surgical_history: string;
  cognitive_status: string;
  last_cognitive_screening: string;
  cognitive_score: string;
  notes: string;
  test_type?: string;
}

export interface ClientHealthcareRequestData {
  preferred_hospital: string;
  hospital_address: string;
  hospital_phone: string;
  pharmacy_name: string;
  pharmacy_address: string;
  pharmacy_phone: string;
}
