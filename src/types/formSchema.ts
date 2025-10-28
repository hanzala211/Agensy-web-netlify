import { z } from "zod";
import zxcvbn from "zxcvbn";

const trimString = (val: string) => val.trim();

export const signUpSchema = z.object({
  first_name: z.string().min(1, "First name is required").transform(trimString),
  last_name: z.string().min(1, "Last name is required").transform(trimString),
  email_address: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Invalid email address" })
    .transform(trimString),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .refine((val) => zxcvbn(val).score >= 3, {
      message: "Password is too weak (must score 3 or more)",
    }),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email_address: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Invalid email address" })
    .transform(trimString),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .transform(trimString),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    code: z.string().min(1, "Verification code is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .refine((val) => zxcvbn(val).score >= 3, {
        message: "Password is too weak (must score 3 or more)",
      }),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const verificationSchema = z.object({
  code: z.string().min(1, "Verification code is required"),
});

export type VerificationFormData = z.infer<typeof verificationSchema>;

export const hospitalSchema = z.object({
  preferred_hospital: z.string().optional(),
  hospital_address: z.string().optional(),
  hospital_phone: z.string().optional(),
  pharmacy_name: z.string().optional(),
  pharmacy_address: z.string().optional(),
  pharmacy_phone: z.string().optional(),
  pharmacy_fax: z.string().optional(),
});

export type HospitalFormData = z.infer<typeof hospitalSchema>;

export const clientSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "First name is required" })
      .transform(trimString),
    lastName: z
      .string()
      .min(2, { message: "Last name is required" })
      .transform(trimString),
    preferredName: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    maritalStatus: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    livingSituation: z.string().optional(),
    pharmacy_name: z.string().optional(),
    pharmacy_address: z.string().optional(),
    pharmacy_phone: z.string().optional(),
    pharmacy_fax: z.string().optional(),
    preferred_hospital: z.string().optional(),
    hospital_address: z.string().optional(),
    hospital_phone: z.string().optional(),
    isEdit: z.boolean().optional(),
    familyAdminId: z.string().optional(),
    showFamilyAdmin: z.boolean().optional(),
  })
  .refine((data) => (data.showFamilyAdmin ? data.familyAdminId : true), {
    message: "Family admin is required",
    path: ["familyAdminId"],
  });

export type ClientFormData = z.infer<typeof clientSchema>;

export const contactSchema = z.object({
  contact_type: z.enum(["primary", "secondary", "emergency"]),
  first_name: z.string().min(1, "First name is required").transform(trimString),
  last_name: z.string().min(1, "Last name is required").transform(trimString),
  relationship: z
    .string()
    .min(1, "Relationship is required")
    .transform(trimString),
  phone: z.string().min(1, "Phone number is required").transform(trimString),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const noteSchema = z.object({
  note: z
    .string()
    .min(1, { message: "Note is required" })
    .transform(trimString),
});

export type NoteFormData = z.infer<typeof noteSchema>;

export const medicationSchema = z
  .object({
    medication_name: z
      .string()
      .min(1, { message: "Medication name is required" })
      .transform(trimString),
    dosage: z.string().optional(),
    frequency: z.string().optional(),
    purpose: z
      .string()
      .min(3, { message: "Purpose is required (min 3 characters)" })
      .transform(trimString),
    prescribing_doctor: z.string().optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    refill_due: z.string().optional(),
    notes: z
      .string()
      .optional()
      .transform((val) => (val ? trimString(val) : val)),
  })
  .refine(
    (data) => {
      if (!data.start_date || !data.end_date) return true;
      return new Date(data.start_date) <= new Date(data.end_date);
    },
    {
      message: "End date cannot be before start date",
      path: ["end_date"],
    }
  )
  .refine(
    (data) => {
      if (!data.start_date || !data.refill_due) return true;
      return new Date(data.start_date) <= new Date(data.refill_due);
    },
    {
      message: "Refill due date cannot be before Start date",
      path: ["refill_due"],
    }
  )
  .refine(
    (data) => {
      if (!data.refill_due || !data.end_date) return true;
      return new Date(data.refill_due) <= new Date(data.end_date);
    },
    {
      message: "Refill due date cannot be after end date",
      path: ["refill_due"],
    }
  );

export type MedicationFormData = z.infer<typeof medicationSchema>;

export const clientHealthProviderSchema = z
  .object({
    provider_type: z.string().optional(),
    provider_name: z
      .string()
      .min(1, "Provider name is required")
      .transform(trimString),
    specialty: z.string().optional(),
    specialty_custom: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    fax: z.string().optional(),
    last_visit: z.string().optional(),
    next_visit: z.string().optional(),
    notes: z
      .string()
      .optional()
      .transform((val) => (val ? trimString(val) : val)),
  })
  .refine(
    (data) => {
      if (!data.last_visit || !data.next_visit) return true;
      const last = new Date(data.last_visit);
      const next = new Date(data.next_visit);
      return last <= next;
    },
    {
      message: "Last visit must be on or before the next visit",
      path: ["next_visit"],
    }
  );

export type ClientHealthProviderFormData = z.infer<
  typeof clientHealthProviderSchema
>;

export const medicalHistorySchema = z.object({
  diagnoses: z.array(z.string().optional()).optional(),
  allergies: z.array(z.string().optional()).optional(),
  dietary_restrictions: z.array(z.string().optional()).optional(),
  surgical_history: z.array(z.string().optional()).optional(),
  cognitive_status: z.string().optional(),
  cognitive_status_text: z.string().optional(),
  test_type: z.string().optional(),
  last_cognitive_screening: z.string().optional(),
  cognitive_score: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const pattern = /^\d{1,2}\/\d{1,2}$/;
        return pattern.test(val);
      },
      {
        message: "Score must be in format 'score/total' (e.g., '26/30')",
      }
    ),
  notes: z.string().optional(),
});

export type MedicalHistoryFormData = z.infer<typeof medicalHistorySchema>;

export const documentSchema = z
  .object({
    documentType: z
      .string()
      .min(1, "Category is required")
      .transform(trimString),
    title: z.string().min(1, "Title is required").transform(trimString),
    description: z.string().optional(),
    file: z.instanceof(File, { message: "File is required" }),
    primaryUserId: z.string().optional(),
    showPrimaryUser: z.boolean().optional(),
  })
  .refine((data) => (data.showPrimaryUser ? data.primaryUserId : true), {
    message: "Family admin is required",
    path: ["primaryUserId"],
  });

export type DocumentFormData = z.infer<typeof documentSchema>;

export const accessSchema = z.object({
  first_name: z.string().min(1, "First Name is required").transform(trimString),
  last_name: z.string().min(1, "Last Name is required").transform(trimString),
  relation: z.string().min(1, "Relationship is required").transform(trimString),
  email: z.string().email("Valid email is required").transform(trimString),
  phone: z.string().optional(),
  role: z.string().min(1, "Role is required").transform(trimString),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type AccessFormData = z.infer<typeof accessSchema>;

export const editAccessSchema = z.object({
  first_name: z.string().min(1, "First Name is required").transform(trimString),
  last_name: z.string().min(1, "Last Name is required").transform(trimString),
  relation: z.string().min(1, "Relationship is required").transform(trimString),
  phone: z.string().optional(),
  role: z.string().min(1, "Role is required").transform(trimString),
});

export type EditAccessFormData = z.infer<typeof editAccessSchema>;

export const appointmentSchema = z
  .object({
    title: z.string().transform(trimString),
    appointment_type: z.string().transform(trimString),
    location: z.string().transform(trimString),
    start_time: z.string().transform(trimString),
    end_time: z.string().transform(trimString),
    notes: z
      .string()
      .optional()
      .transform((val) => (val ? trimString(val) : val)),
    clientId: z
      .string()
      .min(1, "Care Recipient is Required")
      .transform(trimString),
    healthcare_provider_id: z.string().transform(trimString),
    post_appointment_notes: z
      .string()
      .optional()
      .transform((val) => (val ? trimString(val) : val)),
  })
  .refine(
    (data) => {
      if (!data.start_time || !data.end_time) return true;
      const start = new Date(data.start_time);
      const end = new Date(data.end_time);
      return start <= end;
    },
    {
      message: "End time must be after start time",
      path: ["end_time"],
    }
  );

export type AppointmentFormData = z.infer<typeof appointmentSchema>;

export const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required").transform(trimString),
  last_name: z.string().min(1, "Last name is required").transform(trimString),
  phone: z.string().min(1, "Phone number is required").transform(trimString),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .refine((val) => zxcvbn(val).score >= 3, {
        message: "Password is too weak (must score 3 or more)",
      }),
    confirm_password: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export type PasswordFormData = z.infer<typeof passwordSchema>;

export const addThreadFormSchema = z
  .object({
    client_id: z
      .string()
      .optional()
      .transform((val) => (val ? trimString(val) : val)),
    type: z.string().min(1, "Type is Required").transform(trimString),
    participant_ids: z.array(z.string()).optional(),
    name: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === "broadcast") {
        return (
          !data.client_id &&
          (!data.participant_ids || data.participant_ids.length === 0)
        );
      }
      return true;
    },
    {
      message: "Broadcast messages cannot have participants or clients",
      path: ["participant_ids"],
    }
  )
  .refine(
    (data) => {
      if (data.type !== "broadcast" && data.type !== "client") {
        return data.participant_ids && data.participant_ids.length > 0;
      }
      return true;
    },
    {
      message: "At least one participant is required",
      path: ["participant_ids"],
    }
  )
  .refine(
    (data) => {
      if (data.type === "client") {
        return data.client_id && data.client_id.length > 0;
      }
      return true;
    },
    {
      message: "Care Recipient is Required",
      path: ["client_id"],
    }
  )
  .refine((data) => {
    if (data.type === "broadcast") {
      return data.name && data.name.length > 0;
    }
    return true;
  }, {
    message: "Name is Required",
    path: ["name"],
  });

export type AddThreadFormData = z.infer<typeof addThreadFormSchema>;

export const faceSheetShortFormSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  preferredName: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  ssn: z.string().optional(),

  // Emergency Contact
  emergencyContactFirstName: z.string().optional(),
  emergencyContactLastName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  emergencyContactEmail: z.string().optional(),
  emergencyContactAddress: z.string().optional(),

  // Medical Settings
  codeStatus: z.string().optional(),
  advanceDirective: z.string().optional(),

  // Hospital Preference
  hospitalPreference: z.string().optional(),
  hospitalAddress: z.string().optional(),
  hospitalPhoneNumber: z.string().optional(),

  // Insurance
  insurance: z.string().optional(),
  groupNumber: z.string().optional(),
  idNumber: z.string().optional(),
  medicare: z.string().optional(),

  // Pharmacy
  pharmacyName: z.string().optional(),
  pharmacyAddress: z.string().optional(),
  pharmacyPhone: z.string().optional(),
  pharmacyFax: z.string().optional(),

  // MPOA/DPOA
  mpoaName: z.string().optional(),
  mpoaAddress: z.string().optional(),
  mpoaPhone: z.string().optional(),
  dpoaName: z.string().optional(),
  dpoaAddress: z.string().optional(),
  dpoaPhone: z.string().optional(),

  // Dynamic Arrays - all in one schema
  providers: z
    .array(
      z.object({
        providerName: z.string().optional(),
        specialty: z.string().optional(),
        specialty_custom: z.string().optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
        fax: z.string().optional(),
        lastVisit: z.string().optional(),
        nextVisit: z.string().optional(),
        id: z.string().optional().nullish().nullable(),
        providerType: z.string().optional().nullable(),
      })
    )
    .optional(),

  medications: z
    .array(
      z.object({
        medicationName: z.string().optional(),
        dosage: z.string().optional(),
        purpose: z.string().optional(),
        prescribingDoctor: z.string().optional(),
        refillDue: z.string().optional(),
        id: z.string().optional().nullable().nullish(),
        frequency: z.string().optional(),
      })
    )
    .optional(),

  diagnoses: z
    .array(
      z.object({
        diagnosis: z.string().optional(),
      })
    )
    .optional(),

  allergies: z
    .array(
      z.object({
        allergen: z.string().optional(),
      })
    )
    .optional(),

  surgicalHistory: z
    .array(
      z.object({
        surgicalHistory: z.string().optional(),
      })
    )
    .optional(),
});

export type FaceSheetShortFormData = z.infer<typeof faceSheetShortFormSchema>;

export const faceSheetLongFormSchema = z
  .object({
    // Personal Information
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    preferredName: z.string().optional(),
    phone: z.string().optional(),
    dateOfBirth: z.string().optional(),
    ssn: z.string().optional(),

    // Additional Personal Information
    gender: z.string().optional(),
    race: z.string().optional(),
    language: z.string().optional(),
    maritalStatus: z.string().optional(),
    livingSituation: z.string().optional(),
    dateOfLastCarePlan: z.string().optional(),

    // Emergency Contact
    emergencyContactFirstName: z.string().optional(),
    emergencyContactLastName: z.string().optional(),
    emergencyContactPhone: z.string().optional(),
    emergencyContactRelationship: z.string().optional(),
    emergencyContactEmail: z.string().optional(),
    emergencyContactAddress: z.string().optional(),

    // Medical Settings
    codeStatus: z.string().optional(),
    advanceDirective: z.string().optional(),

    // Hospital Preference
    hospitalPreference: z.string().optional(),
    hospitalAddress: z.string().optional(),
    hospitalPhoneNumber: z.string().optional(),

    // Insurance
    insurance: z.string().optional(),
    groupNumber: z.string().optional(),
    idNumber: z.string().optional(),
    medicare: z.string().optional(),

    // Pharmacy
    pharmacyName: z.string().optional(),
    pharmacyAddress: z.string().optional(),
    pharmacyPhone: z.string().optional(),
    pharmacyFax: z.string().optional(),

    // MPOA/DPOA
    mpoaName: z.string().optional(),
    mpoaAddress: z.string().optional(),
    mpoaPhone: z.string().optional(),
    dpoaName: z.string().optional(),
    dpoaAddress: z.string().optional(),
    dpoaPhone: z.string().optional(),

    // Caregiver Agency
    caregiverAgency: z.string().optional(),
    caregiverAddress: z.string().optional(),
    caregiverPhone: z.string().optional(),
    caregiverPointOfContact: z.string().optional(),
    caregiverSchedule: z.string().optional(),
    caregiverDuties: z.string().optional(),
    importantInformationForCaregivers: z.string().optional(),

    // Home Health Agency
    homeHealthAgency: z.string().optional(),
    homeHealthAddress: z.string().optional(),
    homeHealthPhone: z.string().optional(),
    homeHealthFax: z.string().optional(),
    homeHealthSchedule: z.string().optional(),
    homeHealthPrescribingDoctor: z.string().optional(),
    homeHealthStartDate: z.string().optional(),
    homeHealthDischargeDate: z.string().optional(),

    // Mental Status
    mentalStatus: z.string().optional(),
    mentalStatusText: z.string().optional(),
    cognitiveScreeningDate: z.string().optional(),
    test_type: z.string().optional(),
    cognitiveScreeningScore: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          const pattern = /^\d{1,2}\/\d{1,2}$/;
          return pattern.test(val);
        },
        {
          message: "Score must be in format 'score/total' (e.g., '26/30')",
        }
      ),
    notesAndConcerns: z.string().optional(),

    // Dynamic Arrays
    providers: z
      .array(
        z.object({
          providerName: z.string().optional(),
          specialty: z.string().optional().nullable().nullish(),
          specialty_custom: z.string().optional(),
          address: z.string().optional(),
          phone: z.string().optional(),
          fax: z.string().optional(),
          lastVisit: z.string().optional(),
          nextVisit: z.string().optional(),
          id: z.string().optional().nullish().nullable(),
          providerType: z.string().optional().nullable(),
        })
      )
      .optional(),

    medications: z
      .array(
        z.object({
          medicationName: z.string().optional(),
          dosage: z.string().optional(),
          purpose: z.string().optional(),
          id: z.string().optional().nullable().nullish(),
          frequency: z.string().optional(),
          prescribingDoctor: z.string().optional(),
          refillDue: z.string().optional(),
        })
      )
      .optional(),

    diagnoses: z
      .array(
        z.object({
          diagnosis: z.string().optional(),
        })
      )
      .optional(),

    allergies: z
      .array(
        z.object({
          allergen: z.string().optional(),
        })
      )
      .optional(),

    surgicalHistory: z
      .array(
        z.object({
          surgicalHistory: z.string().optional(),
        })
      )
      .optional(),

    // Medical Conditions
    medicalConditions: z
      .array(
        z.object({
          condition: z.string().optional(),
          onsetDate: z.string().optional(),
          notes: z.string().optional(),
          id: z.string().optional().nullish().nullable(),
        })
      )
      .optional(),

    // Vaccinations
    vaccinations: z
      .array(
        z.object({
          vaccineName: z.string().optional(),
          date: z.string().optional(),
          nextVaccine: z.string().optional(),
          id: z.string().optional().nullish().nullable(),
        })
      )
      .optional(),

    // Bloodwork
    bloodwork: z
      .array(
        z.object({
          test: z.string().optional(),
          date: z.string().optional(),
          results: z.string().optional(),
          orderedBy: z.string().optional(),
          repeat: z.string().optional(),
          id: z.string().optional().nullish().nullable(),
        })
      )
      .optional(),

    // Dietary Restrictions
    dietaryRestrictions: z
      .array(
        z.object({
          dietaryRestrictions: z.string().optional(),
          id: z.string().optional().nullish().nullable(),
        })
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.homeHealthStartDate || !data.homeHealthDischargeDate)
        return true;
      const start = data.homeHealthStartDate
        ? new Date(data.homeHealthStartDate)
        : null;
      const end = data.homeHealthDischargeDate
        ? new Date(data.homeHealthDischargeDate)
        : null;
      return start && end && start <= end;
    },
    {
      message: "Home health discharge date cannot be before start date",
      path: ["homeHealthDischargeDate"],
    }
  );

export type FaceSheetLongFormData = z.infer<typeof faceSheetLongFormSchema>;

// Health History Form Schema
export const healthHistoryFormSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  diagnoses: z
    .array(
      z.object({
        diagnosis: z.string().optional(),
      })
    )
    .optional(),

  anesthesia: z
    .array(
      z.object({
        anesthesia: z.string().optional(),
      })
    )
    .optional(),

  surgicalHistory: z
    .array(
      z.object({
        surgicalHistory: z.string().optional(),
      })
    )
    .optional(),

  // Medications Started
  medicationsStarted: z
    .array(
      z.object({
        medicationName: z.string().optional(),
        dosage: z.string().optional(),
        prescribingDoctor: z.string().optional(),
        id: z.string().optional().nullish().nullable(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .optional(),

  // Medications Ended
  medicationsEnded: z
    .array(
      z.object({
        medicationName: z.string().optional(),
        dosage: z.string().optional(),
        prescribingDoctor: z.string().optional(),
        id: z.string().optional().nullish().nullable(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .optional(),

  medications: z
    .array(
      z.object({
        medicationName: z.string().optional(),
        dosage: z.string().optional(),
        prescribingDoctor: z.string().optional(),
        id: z.string().optional().nullish().nullable(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .optional(),

  // Healthcare Providers
  providers: z
    .array(
      z.object({
        providerName: z
          .string()
          .optional()
          .transform((val) => (val ? trimString(val) : val)),
        address: z
          .string()
          .optional()
          .transform((val) => (val ? trimString(val) : val)),
        phone: z
          .string()
          .optional()
          .transform((val) => (val ? trimString(val) : val)),
        notes: z
          .string()
          .optional()
          .transform((val) => (val ? trimString(val) : val)),
        follow_up: z
          .string()
          .optional()
          .transform((val) => (val ? trimString(val) : val)),
      })
    )
    .optional(),

  // Home Health Agency
  homeHealthName: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  homeHealthPhone: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  homeHealthAddress: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  homeHealthFax: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  homeHealthServiceReceived: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  homeHealthStartDate: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  homeHealthDischargeDate: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),

  // Hospitalization
  admittingDiagnosis: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  hospitalizationTreatment: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),

  // Health History
  whatWorked: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  healthHistoryDate: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  healthHistoryNotes: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  descriptionOfHealthConcern: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  onsetOfSymptoms: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  frequencyOfSymptoms: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  severityOfSymptoms: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
});

export type HealthHistoryFormData = z.infer<typeof healthHistoryFormSchema>;

// Schema for the Care Recipient Questionnaire
export const careRecipientQuestionnaireSchema = z.object({
  // Form Filler Information
  formFillerName: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  formFillerDate: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  fillingForOtherSpecify: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  fillingForOtherSpecifyText: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),

  // Care Recipient Personal Information
  careRecipientFirstName: z
    .string()
    .min(1, "First name is required")
    .transform((val) => val || ""),
  careRecipientLastName: z
    .string()
    .min(1, "Last name is required")
    .transform((val) => val || ""),
  careRecipientPreferredName: z.string().optional(),
  careRecipientAddress: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  careRecipientCity: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  careRecipientState: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  careRecipientZip: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  careRecipientBirthdate: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  careRecipientBirthplace: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  careRecipientSSN: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  careRecipientPhone: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  careRecipientEmail: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  careRecipientCulturalBackground: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  careRecipientEducation: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  careRecipientReligion: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  careRecipientActiveReligionLocation: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  careRecipientMaritalStatus: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  careRecipientDateOfDivorceOrWidowhood: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  careRecipientLossImpactDescription: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),

  medications: z
    .array(
      z.object({
        medicationName: z.string().optional(),
        prescribingDoctor: z.string().optional(),
        id: z.string().optional().nullish().nullable(),
        usedToTreat: z.string().optional(),
        frequency: z.string().optional(),
        refillDue: z.string().optional(),
        dosage: z.string().optional(),
      })
    )
    .optional(),

  // Work and Retirement Information
  occupationProfession: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  retirementDate: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  retirementAdjustment: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),

  // Insurance Information
  medicareA: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  medicareB: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  medicareNumbers: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  medicareSupplementPlan: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  insuranceProvider: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  insurancePolicyNumber: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  insurancePhone: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  mentalHealthCoverage: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  hmo: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  hmoPolicyNumber: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  hmoPhone: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  longTermCareInsuranceName: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  longTermCareInsurancePolicyNumber: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  longTermCareInsurancePhone: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),

  // Relatives Information
  relatives: z
    .array(
      z.object({
        name: z
          .string()
          .nullable()
          .optional()
          .transform((val) => val || ""),
        address: z
          .string()
          .nullable()
          .optional()
          .transform((val) => val || ""),
        homePhone: z
          .string()
          .nullable()
          .optional()
          .transform((val) => val || ""),
        workPhone: z
          .string()
          .nullable()
          .optional()
          .transform((val) => val || ""),
        relationship: z
          .string()
          .nullable()
          .optional()
          .transform((val) => val || ""),
        email: z
          .string()
          .nullable()
          .optional()
          .transform((val) => val || ""),
        id: z
          .string()
          .nullable()
          .optional()
          .transform((val) => val || ""),
      })
    )
    .nullable()
    .transform((val) => val || []),

  // Friends/Neighbors Information
  friendsNeighbors: z
    .array(
      z.object({
        name: z
          .string()
          .nullable()
          .optional()
          .transform((val) => val || ""),
        address: z
          .string()
          .nullable()
          .optional()
          .transform((val) => val || ""),
        helpDescription: z
          .string()
          .nullable()
          .optional()
          .transform((val) => val || ""),
        relationship: z
          .string()
          .nullable()
          .optional()
          .transform((val) => val || ""),
        phone: z
          .string()
          .nullable()
          .optional()
          .transform((val) => val || ""),
        id: z
          .string()
          .nullable()
          .optional()
          .transform((val) => val || ""),
      })
    )
    .nullable()
    .transform((val) => val || []),

  // Professional Contacts Information
  lawyerName: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  lawyerPhone: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  lawyerId: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  powerOfAttorneyFinancesName: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  powerOfAttorneyFinancesPhone: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  powerOfAttorneyFinancesId: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  powerOfAttorneyHealthcareName: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  powerOfAttorneyHealthcarePhone: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  powerOfAttorneyHealthcareId: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  taxProfessionalName: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  taxProfessionalPhone: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  taxProfessionalId: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  accountantName: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  accountantPhone: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  accountantId: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || ""),
  financialAdvisorName: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  financialAdvisorPhone: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  financialAdvisorId: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  significantOther1Name: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  significantOther1Phone: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  significantOther1Id: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  significantOther2Name: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  significantOther2Phone: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  significantOther2Id: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),

  // Support System & Emergency Contacts
  supportSystemRating: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  supportSystemProblems: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  emergencyContacts: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),

  // In-Home Help Services
  houseCleaningAgency: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  houseCleaningSatisfaction: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  houseCleaningFrequency: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  homeAidAgency: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || ""),
  homeAidSatisfaction: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || ""),
  homeAidFrequency: z
    .string()
    .optional()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  homeHealthAgency: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || ""),
  homeHealthSatisfaction: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || ""),
  homeHealthFrequency: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  maintenanceAgency: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  maintenanceSatisfaction: z
    .string()
    .nullable()
    .optional()
    .optional()
    .transform((val) => val || ""),
  maintenanceFrequency: z
    .string()
    .nullable()
    .optional()
    .optional()
    .transform((val) => val || ""),
  otherHelpAgency: z
    .string()
    .nullable()
    .optional()
    .optional()
    .transform((val) => val || ""),
  otherHelpSatisfaction: z
    .string()
    .nullable()
    .optional()
    .optional()
    .transform((val) => val || ""),
  otherHelpFrequency: z
    .string()
    .optional()
    .optional()
    .nullable()
    .transform((val) => val || ""),

  // Living Environment
  livingEnvironmentType: z
    .array(z.string())
    .nullable()
    .optional()
    .transform((val) => val || []),
  homeEnvironmentAdequacy: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),

  // Healthcare Providers
  healthcareProviders: z
    .array(
      z.object({
        providerName: z
          .string()
          .nullable()
          .optional()
          .transform((val) => val || ""),
        phone: z
          .string()
          .nullable()
          .optional()
          .transform((val) => val || ""),
        forWhatProblem: z
          .string()
          .nullable()
          .optional()
          .transform((val) => val || ""),
        id: z
          .string()
          .nullable()
          .optional()
          .transform((val) => val || ""),
      })
    )
    .nullable()
    .transform((val) => val || []),

  // Medical Conditions
  medicalConditions: z
    .array(
      z.object({
        problem: z
          .string()
          .nullable()
          .optional()
          .transform((val) => val || ""),
        treatment: z
          .string()
          .nullable()
          .optional()
          .transform((val) => val || ""),
        medications: z
          .string()
          .nullable()
          .optional()
          .transform((val) => val || ""),
      })
    )
    .nullable()
    .transform((val) => val || []),

  lastCheckupDate: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  allergies: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || ""),
  diagnosis: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || ""),
  recentHospitalization: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || ""),
  hospitalDetails: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || ""),
  supportSystemThoughts: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),

  // Problem Areas in Daily Living
  problemAreasDailyLiving: z
    .array(z.string())
    .nullable()
    .optional()
    .transform((val) => val || []),
  problemAreasExplanation: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),

  // Problems/Risks
  problemsRisks: z
    .array(z.string())
    .nullable()
    .optional()
    .transform((val) => val || []),
  nutritionConcerns: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  selfCareCapacitySummary: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),

  // Memory, Orientation and Judgment
  memoryProblems: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  // Emotional Health
  emotionalHealthNotes: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  personalityCoping: z
    .string()
    .nullable()
    .transform((val) => val || ""),
  recentBehaviorChanges: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  recipientSharesConcerns: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  recipientSharesConcernsNotes: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  emotionalProblemsHistory: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  emotionalProblemsTreatment: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  emotionalProblemsNotes: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  recentLossesImpact: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  // Social Life
  socialLifeNotes: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),

  // Other Pertinent Information
  hospitalPreference: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  dnr: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  trust: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  lifecare: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  will: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  livingWill: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  funeralArrangements: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  cemeteryPlot: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  monthlyIncome: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  spouseIncome: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  savings: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  otherAssets: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  financialProblemsDescription: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),

  // Summary Section
  majorConcernsAndAssistance: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
  areasAcceptingHelp: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || ""),
});

// Caregiver Information Form Schema
export const caregiverInformationFormSchema = z.object({
  name: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  nickname_preferred_name: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  // Schedule fields
  wake_time: z
    .string()
    .optional()
    .refine((val) => !val || /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
      message: "Invalid time format. Use HH:MM (00:00-23:59)",
    })
    .transform((val) => (val ? trimString(val) : val)),
  sleep_time: z
    .string()
    .optional()
    .refine((val) => !val || /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
      message: "Invalid time format. Use HH:MM (00:00-23:59)",
    })
    .transform((val) => (val ? trimString(val) : val)),
  breakfast_time: z
    .string()
    .optional()
    .refine((val) => !val || /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
      message: "Invalid time format. Use HH:MM (00:00-23:59)",
    })
    .transform((val) => (val ? trimString(val) : val)),
  lunch_time: z
    .string()
    .optional()
    .refine((val) => !val || /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
      message: "Invalid time format. Use HH:MM (00:00-23:59)",
    })
    .transform((val) => (val ? trimString(val) : val)),
  snacks_time: z
    .string()
    .optional()
    .refine((val) => !val || /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
      message: "Invalid time format. Use HH:MM (00:00-23:59)",
    })
    .transform((val) => (val ? trimString(val) : val)),
  activity_time: z
    .string()
    .optional()
    .refine((val) => !val || /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
      message: "Invalid time format. Use HH:MM (00:00-23:59)",
    })
    .transform((val) => (val ? trimString(val) : val)),
  nap_time: z
    .string()
    .optional()
    .refine((val) => !val || /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
      message: "Invalid time format. Use HH:MM (00:00-23:59)",
    })
    .transform((val) => (val ? trimString(val) : val)),
  dinner_time: z
    .string()
    .optional()
    .refine((val) => !val || /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
      message: "Invalid time format. Use HH:MM (00:00-23:59)",
    })
    .transform((val) => (val ? trimString(val) : val)),
  medication_time: z
    .string()
    .optional()
    .refine((val) => !val || /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
      message: "Invalid time format. Use HH:MM (00:00-23:59)",
    })
    .transform((val) => (val ? trimString(val) : val)),
  likes: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  dislikes: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  redirection_techniques: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  triggers: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  helpful_information: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  documentation: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
});

export type CaregiverInformationFormData = z.infer<
  typeof caregiverInformationFormSchema
>;

export type CareRecipientQuestionnaireData = z.infer<
  typeof careRecipientQuestionnaireSchema
>;

// Medical Appointment Template Schema
export const medicalAppointmentTemplateSchema = z.object({
  firstName: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  lastName: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),

  dateOfBirth: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  date: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  height: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  weight: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  blood_pressure: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  temperature: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  heart_rate: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  additional_vitals: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  reason_for_visit: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  top_3_concerns: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  tests_labs_imaging: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  visit_notes: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  diagnoses: z
    .array(
      z.object({
        diagnosis: z
          .string()
          .optional()
          .transform((val) => (val ? trimString(val) : val)),
      })
    )
    .optional(),
  allergies: z
    .array(
      z.object({
        allergen: z
          .string()
          .optional()
          .transform((val) => (val ? trimString(val) : val)),
      })
    )
    .optional(),
  surgical_history: z
    .array(
      z.object({
        surgicalHistory: z
          .string()
          .optional()
          .transform((val) => (val ? trimString(val) : val)),
      })
    )
    .optional(),
  medications: z
    .array(
      z.object({
        medication_name: z
          .string()
          .optional()
          .transform((val) => (val ? trimString(val) : val)),
        dosage: z
          .string()
          .optional()
          .transform((val) => (val ? trimString(val) : val)),
        frequency: z
          .string()
          .optional()
          .transform((val) => (val ? trimString(val) : val)),
        notes: z
          .string()
          .optional()
          .transform((val) => (val ? trimString(val) : val)),
        prescribing_doctor: z
          .string()
          .optional()
          .transform((val) => (val ? trimString(val) : val)),
        start_date: z
          .string()
          .optional()
          .transform((val) => (val ? trimString(val) : val)),
        end_date: z
          .string()
          .optional()
          .transform((val) => (val ? trimString(val) : val)),
        id: z.string().nullable().nullish().optional(),
        client_medication_id: z.string().nullable().nullish().optional(),
      })
    )
    .optional(),
  healthcareProvider: z
    .object({
      providerName: z
        .string()
        .optional()
        .transform((val) => (val ? trimString(val) : val)),
      providerType: z
        .string()
        .optional()
        .transform((val) => (val ? trimString(val) : val)),
      address: z
        .string()
        .optional()
        .transform((val) => (val ? trimString(val) : val)),
      phone: z
        .string()
        .optional()
        .transform((val) => (val ? trimString(val) : val)),
      notes: z
        .string()
        .optional()
        .transform((val) => (val ? trimString(val) : val)),
      follow_up: z
        .string()
        .optional()
        .transform((val) => (val ? trimString(val) : val)),
      specialty: z
        .string()
        .optional()
        .transform((val) => (val ? trimString(val) : val)),
      specialty_custom: z
        .string()
        .optional()
        .transform((val) => (val ? trimString(val) : val)),
      id: z.string().nullable().nullish().optional(),
      provider_id: z.string().nullable().nullish().optional(),
    })
    .optional(),
  recommendations: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  referrals: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  follow_up: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  report_given_to: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
});

export type MedicalAppointmentTemplateData = z.infer<
  typeof medicalAppointmentTemplateSchema
>;

export const initialCareAssessmentPlanSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().optional(),
  dateOfAssessment: z.string().optional(),
  dateOfCarePlan: z.string().optional(),
  personCompletingAssessment: z.string().optional(),
  presentForAssessment: z.string().optional(),
  goalsForAssessment: z.array(z.string()).optional(),
  focusedRecommendations: z
    .array(
      z.object({
        id: z.string().optional().nullable().nullish(),
        name: z.string(),
        description: z.string(),
        details: z.array(z.string()),
      })
    )
    .optional(),
  functionalAdls: z
    .object({
      summary: z.string().optional(),
      categoryName: z.string().optional().nullable().nullish(),
    })
    .optional(),
  functionalIadls: z
    .object({
      summary: z.string().optional(),
      categoryName: z.string().optional().nullable().nullish(),
    })
    .optional(),
  homeSafety: z
    .object({
      summary: z.string().optional(),
      categoryName: z.string().optional().nullable().nullish(),
    })
    .optional(),
  memoryAndRecommendations: z
    .object({
      summary: z.string().optional(),
      categoryName: z.string().optional().nullable().nullish(),
    })
    .optional(),
  geriatricDepression: z
    .object({
      summary: z.string().optional(),
      categoryName: z.string().optional().nullable().nullish(),
    })
    .optional(),
  nutritionalHealth: z
    .object({
      summary: z.string().optional(),
      categoryName: z.string().optional().nullable().nullish(),
    })
    .optional(),
  legalAndFinancial: z
    .object({
      summary: z.string().optional(),
      categoryName: z.string().optional().nullable().nullish(),
    })
    .optional(),
  caregiverSupport: z
    .object({
      summary: z.string().optional(),
      categoryName: z.string().optional().nullable().nullish(),
    })
    .optional(),
  nextStepCareRecipient: z.array(z.string()).optional(),
  nextStepCarePartner: z.array(z.string()).optional(),
});

export type InitialCareAssessmentPlanFormData = z.infer<
  typeof initialCareAssessmentPlanSchema
>;

export const comprehensiveCarePlanSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().optional(),
  preferredHospital: z.string().optional(),
  pharmacyName: z.string().optional(),
  dateOfAssessment: z.string().optional(),
  dateOfCarePlan: z.string().optional(),
  personCompletingAssessment: z.string().optional(),
  presentForAssessment: z.string().optional(),
  goalsForAssessment: z.array(z.string()).optional(),
  focusedRecommendations: z
    .array(
      z.object({
        id: z.string().optional().nullable().nullish(),
        name: z.string().optional(),
        description: z.string().optional(),
        details: z.array(z.string()).optional(),
      })
    )
    .optional(),
  initialRequest: z.string().optional(),
  careRecipientGoals: z.string().optional(),
  demographicAndHistoricInformation: z.string().optional(),
  medicalHistory: z.string().optional(),
  medications: z
    .array(
      z.object({
        id: z.string().optional().nullable().nullish(),
        medicationName: z.string().optional(),
        dosage: z.string().optional(),
        frequency: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        usedToTreat: z.string().optional(),
      })
    )
    .optional(),
  allergies: z
    .array(
      z.object({
        allergen: z.string().optional(),
      })
    )
    .optional(),
  healthcareProviders: z
    .array(
      z.object({
        id: z.string().optional().nullable().nullish(),
        providerName: z.string().optional(),
        providerType: z.string().optional(),
        specialty: z.string().optional(),
        specialty_custom: z.string().optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
      })
    )
    .optional(),
  functionalAdls: z
    .object({
      categoryName: z.string().optional(),
      summary: z.string().optional(),
      deficitsNoted: z.string().optional(),
      detailedTable: z
        .object({
          katzIndex: z
            .object({
              description: z.string().optional(),
              score: z.string().optional(),
            })
            .optional(),
          bathing: z
            .object({
              description: z.string().optional(),
              score: z.string().optional(),
            })
            .optional(),
          dressing: z
            .object({
              description: z.string().optional(),
              score: z.string().optional(),
            })
            .optional(),
          toileting: z
            .object({
              description: z.string().optional(),
              score: z.string().optional(),
            })
            .optional(),
          transfers: z
            .object({
              description: z.string().optional(),
              score: z.string().optional(),
            })
            .optional(),
          continence: z
            .object({
              description: z.string().optional(),
              score: z.string().optional(),
            })
            .optional(),
          feeding: z
            .object({
              description: z.string().optional(),
              score: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
      additionalData: z.string().optional().nullable(),
    })
    .optional(),
  functionalIadls: z
    .object({
      categoryName: z.string().optional(),
      summary: z.string().optional(),
      detailedTable: z
        .object({
          telephone: z
            .object({
              description: z.string().optional(),
              score: z.string().optional(),
            })
            .optional(),
          shopping: z
            .object({
              description: z.string().optional(),
              score: z.string().optional(),
            })
            .optional(),
          foodPreparation: z
            .object({
              description: z.string().optional(),
              score: z.string().optional(),
            })
            .optional(),
          housekeeping: z
            .object({
              description: z.string().optional(),
              score: z.string().optional(),
            })
            .optional(),
          laundry: z
            .object({
              description: z.string().optional(),
              score: z.string().optional(),
            })
            .optional(),
          transportation: z
            .object({
              description: z.string().optional(),
              score: z.string().optional(),
            })
            .optional(),
          medication: z
            .object({
              description: z.string().optional(),
              score: z.string().optional(),
            })
            .optional(),
          finances: z
            .object({
              description: z.string().optional(),
              score: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
      additionalData: z
        .object({
          identifiedProblem1: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
          identifiedProblem2: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
          identifiedProblem3: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
          identifiedProblem4: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
    })
    .optional(),
  homeSafety: z
    .object({
      categoryName: z.string().optional(),
      summary: z.string().optional(),
      deficitsNoted: z.string().optional(),
      detailedTable: z
        .object({
          arePathwaysClear: z.boolean().optional(),
          areThereThrowRugs: z.boolean().optional(),
          areStairsSafe: z.boolean().optional(),
          isThereClutterOrHoarding: z.boolean().optional(),
          isThereFireEscapeRoute: z.boolean().optional(),
          areFloorsSlippery: z.boolean().optional(),
          conditionOfFloorSurfaces: z.boolean().optional(),
          conditionOfCarpeting: z.boolean().optional(),
          areChairsSturdyAndStable: z.boolean().optional(),
          electricityFullyFunctional: z.boolean().optional(),
          adequateLighting: z.boolean().optional(),
          exposedWiresOrCords: z.boolean().optional(),
          conditionOfWiresAndPlugs: z.boolean().optional(),
          smokeDetectorsPresent: z.boolean().optional(),
          areThereSpaceHeaters: z.boolean().optional(),
          careRecipientSmokes: z.boolean().optional(),
          fireExtinguisherAccessible: z.boolean().optional(),
          conditionOfAppliances: z.boolean().optional(),
          kitchenSafetyHazards: z.boolean().optional(),
          locksOnDoorsAndWindows: z.boolean().optional(),
          emergencyNumbersPosted: z.boolean().optional(),
          accessibleTelephones: z.boolean().optional(),
          weaponsOrFirearmsPresent: z.boolean().optional(),
          petsPresent: z.boolean().optional(),
          unsanitaryConditionsPresent: z.boolean().optional(),
          medicationsSafelyStored: z.boolean().optional(),
          adequateAirConditioningOrHeat: z.boolean().optional(),
          conditionOfTubOrShower: z.boolean().optional(),
          conditionOfBed: z.boolean().optional(),
          other: z.boolean().optional(),
        })
        .optional(),
    })
    .optional(),
  memoryAndReasoning: z
    .object({
      categoryName: z.string().optional(),
      summary: z.string().optional(),
      deficitsNoted: z.string().optional(),
      detailedTable: z
        .object({
          identifiedProblem1: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
          identifiedProblem2: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
          identifiedProblem3: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
          identifiedProblem4: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
    })
    .optional(),
  geriatricDepression: z
    .object({
      categoryName: z.string().optional(),
      summary: z.string().optional(),
      deficitsNoted: z.string().optional(),
      detailedTable: z
        .object({
          identifiedProblem1: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
          identifiedProblem2: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
          identifiedProblem3: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
          identifiedProblem4: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
          identifiedProblem5: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
    })
    .optional(),
  nutritionalHealth: z
    .object({
      categoryName: z.string().optional(),
      summary: z.string().optional(),
      deficitsNoted: z.string().optional(),
      detailedTable: z
        .object({
          identifiedProblem1: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
          identifiedProblem2: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
          identifiedProblem3: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
          identifiedProblem4: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
          identifiedProblem5: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
    })
    .optional(),
  legalAndFinancial: z
    .object({
      categoryName: z.string().optional(),
      summary: z.string().optional(),
      deficitsNoted: z.string().optional(),
      detailedTable: z
        .object({
          identifiedProblem1: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
          identifiedProblem2: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
          identifiedProblem3: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
          identifiedProblem4: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
          identifiedProblem5: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
          identifiedProblem6: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
          identifiedProblem7: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
          identifiedProblem8: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
          identifiedProblem9: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
          identifiedProblem10: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
    })
    .optional(),
  careGiverSupport: z
    .object({
      categoryName: z.string().optional(),
      summary: z.string().optional(),
      deficitsNoted: z.string().optional(),
      detailedTable: z
        .object({
          identifiedProblem1: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
          identifiedProblem2: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
          identifiedProblem3: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
          identifiedProblem4: z
            .object({
              identifiedProblem: z.string().optional(),
              interventionAction: z.string().optional(),
              goal: z.string().optional(),
              referralOptions: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
    })
    .optional(),
  nextStepCareRecipient: z.array(z.string()).optional(),
  nextStepCarePartner: z.array(z.string()).optional(),
});

export type ComprehensiveCarePlanFormData = z.infer<
  typeof comprehensiveCarePlanSchema
>;

export const burialInstructionsFormSchema = z.object({
  // Personal Identification
  firstName: z.string().min(1, "First name of deceased is required"),
  lastName: z.string().min(1, "Last name of deceased is required"),
  dateOfBirth: z.string().optional(),
  timeOfDeath: z.string().optional(),
  dateOfDeath: z.string().optional(),
  countyThatIssuedDeathCertificate: z.string().optional(),
  numberOfDeathCertificatesOrdered: z.string().optional(),

  // Burial Preferences
  burialType: z.string().optional(),
  burialTypeOther: z.string().optional(),
  preferredCemetery: z.string().optional(),
  plotOwned: z.string().optional(),
  plotNumberLocation: z.string().optional(),
  funeralHome: z.string().optional(),
  vaultCasketPreferences: z.string().optional(),
  urnSelection: z.string().optional(),
  ashesDisposition: z.string().optional(),
  ashesDispositionOther: z.string().optional(),

  // Service Details
  typeOfService: z.string().optional(),
  officiantSpeakerRequested: z.string().optional(),
  locationOfService: z.string().optional(),
  specialRequests: z.string().optional(),

  // Key Contacts
  personResponsibleName: z.string().optional(),
  personResponsiblePhone: z.string().optional(),
  personResponsibleRelationship: z.string().optional(),
  legalMedicalPowerOfAttorneyName: z.string().optional(),
  legalMedicalPowerOfAttorneyPhone: z.string().optional(),
  clergySpiritualAdvisorName: z.string().optional(),
  clergySpiritualAdvisorPhone: z.string().optional(),

  // Documents and Notes
  willLocation: z.string().optional(),
  advanceDirectiveLocation: z.string().optional(),
  lifeInsuranceInfo: z.string().optional(),
  relationship: z.string().optional(),
  obituaryWishes: z.string().optional(),
});

export type BurialInstructionsFormData = z.infer<
  typeof burialInstructionsFormSchema
>;

export const personalInfoFormSchema = z.object({
  // Personal Identification
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().optional(),
  socialSecurityNumber: z.string().optional(),
  driversLicenseNumber: z.string().optional(),
  driversLicenseState: z.string().optional(),
  passportNumber: z.string().optional(),
  passportExpirationDate: z.string().optional(),

  // Emergency Information
  emergencyContactFirstName: z.string().optional(),
  emergencyContactLastName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  healthInsuranceProvider: z.string().optional(),
  healthInsurancePolicyNumber: z.string().optional(),

  // Digital Accounts & Passwords
  digitalAccounts: z
    .array(
      z.object({
        accountWebsite: z.string().optional(),
        usernameEmail: z.string().optional(),
        password: z.string().optional(),
        notes: z.string().optional(),
        id: z.string().optional().nullish().nullable(),
      })
    )
    .optional(),

  // Financial Accounts
  bankName: z.string().optional(),
  bankAccountNumberPartial: z.string().optional(),
  bankAccountType: z.string().optional(),
  bankOnlineLoginInfo: z.string().optional(),
  creditCardIssuer: z.string().optional(),
  creditCardLastFourDigits: z.string().optional(),
  creditCardOnlineLoginInfo: z.string().optional(),

  // Utilities & Subscriptions
  electricityProvider: z.string().optional(),
  electricityUsername: z.string().optional(),
  electricityPassword: z.string().optional(),
  internetProvider: z.string().optional(),
  internetUsername: z.string().optional(),
  internetPassword: z.string().optional(),
  phoneProvider: z.string().optional(),
  phoneUsername: z.string().optional(),
  phonePassword: z.string().optional(),
  streamingServices: z.string().optional(),
  streamingUsername: z.string().optional(),
  streamingPassword: z.string().optional(),

  // Common Questions asked by Social Security
  bankingHistoryInstitutions: z.string().optional(),
  monthlyCarMortgagePayment: z.string().optional(),
  previousStreetNames: z.string().optional(),
  creditCardInstitutions: z.string().optional(),
  mothersMaidenName: z.string().optional(),
  socialSecurityQuestion: z.string().optional(),

  // Notes & Backup Contacts
  trustedPersonName: z.string().optional(),
  trustedPersonPhone: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoFormSchema>;

export const importantPersonSchema = z.object({
  id: z.string().optional().nullable().nullish(),
  type: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  relationship: z.string().optional(),
  firm: z.string().optional(),
  agency: z.string().optional(),
  affiliation: z.string().optional(),
  address: z.string().optional(),
});

export type ImportantPersonData = z.infer<typeof importantPersonSchema>;

export const importantPeopleInLifeFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().optional(),
  importantPeople: z.array(importantPersonSchema).optional(),
  notesAndReminders: z.string().optional(),
});

export type ImportantPeopleInLifeFormData = z.infer<
  typeof importantPeopleInLifeFormSchema
>;

export const vitalsTrackerFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().optional(),
  bloodType: z.string().optional(),
  height: z.string().optional(),
  vitals: z
    .array(
      z.object({
        date: z.string().optional(),
        heartRate: z
          .string()
          .optional()
          .refine(
            (val) => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 999.9),
            "Heart rate must be between 0 and 999.9"
          ),
        oxygen: z
          .string()
          .optional()
          .refine(
            (val) => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 100),
            "Oxygen must be between 0 and 100%"
          ),
        bloodPressure: z
          .string()
          .optional()
          .refine(
            (val) => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 999.9),
            "Blood pressure must be between 0 and 999.9"
          ),
        temperature: z
          .string()
          .optional()
          .refine(
            (val) => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 999.9),
            "Temperature must be between 0 and 999.9"
          ),
        weight: z
          .string()
          .optional()
          .refine(
            (val) => !val || (parseFloat(val) >= 0 && parseFloat(val) <= 999.9),
            "Weight must be between 0 and 999.9"
          ),
        other: z.string().optional(),
        id: z.string().optional().nullable().nullish(),
      })
    )
    .optional(),
});

export type VitalsTrackerFormData = z.infer<typeof vitalsTrackerFormSchema>;

export const labsTrackerFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().optional(),
  labs: z
    .array(
      z.object({
        date: z.string().min(1, "Date is required"),
        doctorName: z.string().optional(),
        type: z.string().optional(),
        providerCompanyUsed: z.string().optional(),
        purpose: z.string().optional(),
        results: z.string().optional(),
        id: z.string().optional(),
      })
    )
    .optional(),
});

export type LabsTrackerFormData = z.infer<typeof labsTrackerFormSchema>;

export const inPatientStayNotesFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().optional(),
  inPatientStayNotes: z
    .array(
      z.object({
        id: z.string().optional().nullable().nullish(),
        date: z.string().optional(),
        facilityName: z.string().optional(),
        medicalProvider: z.string().optional(),
        specialty: z.string().optional(),
        questionsForProvider: z
          .array(
            z.object({
              question: z.string().optional(),
            })
          )
          .optional(),
        updatesFromProvider: z
          .array(
            z.object({
              update: z.string().optional(),
            })
          )
          .optional(),
        recommendationsNextSteps: z
          .array(
            z.object({
              recommendation: z.string().optional(),
            })
          )
          .optional(),
      })
    )
    .optional(),
});

export type InPatientStayNotesFormData = z.infer<
  typeof inPatientStayNotesFormSchema
>;

export const comprehensiveMedicationListSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().optional(),
  allergies: z
    .array(
      z.object({
        allergen: z.string().optional(),
      })
    )
    .optional(),
  medications: z
    .array(
      z.object({
        medicationName: z.string().optional(),
        dosage: z.string().optional(),
        frequency: z.string().optional(),
        usedToTreat: z.string().optional(),
        refillDue: z.string().optional(),
        prescriber: z.string().optional(),
        pharmacy: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        sideEffects: z.string().optional(),
        id: z.string().optional().nullable().nullish(),
        medicationId: z.string().optional().nullable().nullish(),
      })
    )
    .optional(),
});

export type ComprehensiveMedicationListFormData = z.infer<
  typeof comprehensiveMedicationListSchema
>;
