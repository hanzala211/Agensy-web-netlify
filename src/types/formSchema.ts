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
    .min(12, "Password must be at least 12 characters long")
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
  password: z.string().min(12, "Password must be at least 12 characters long"),
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
      .min(12, "Password must be at least 12 characters long")
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
  preferred_hospital: z
    .string()
    .min(1, { message: "Preferred Hospital Name is required" })
    .transform(trimString),
  hospital_address: z
    .string()
    .min(1, { message: "Hospital address is required" })
    .transform(trimString),
  hospital_phone: z
    .string()
    .min(1, { message: "Hospital phone is required" })
    .transform(trimString),
  pharmacy_name: z
    .string()
    .min(1, { message: "Pharmacy name is required" })
    .transform(trimString),
  pharmacy_address: z
    .string()
    .min(1, { message: "Pharmacy address is required" })
    .transform(trimString),
  pharmacy_phone: z
    .string()
    .min(1, { message: "Pharmacy phone is required" })
    .transform(trimString),
  pharmacy_fax: z
    .string()
    .min(1, { message: "Pharmacy fax is required" })
    .transform(trimString),
});

export type HospitalFormData = z.infer<typeof hospitalSchema>;

export const clientSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "First name is required" })
      .max(12, "First name must be less than 12 characters")
      .transform(trimString),
    lastName: z
      .string()
      .min(2, { message: "Last name is required" })
      .max(12, "Last name must be less than 12 characters")
      .transform(trimString),
    dateOfBirth: z
      .string()
      .min(1, { message: "Date of birth is required" })
      .transform(trimString),
    gender: z.enum(["male", "female", "other"]),
    maritalStatus: z
      .string()
      .min(1, { message: "Marital status is required" })
      .transform(trimString),
    address: z
      .string()
      .min(5, { message: "Address is required" })
      .transform(trimString),
    city: z
      .string()
      .min(2, { message: "City is required" })
      .transform(trimString),
    state: z
      .string()
      .min(2, { message: "State is required" })
      .transform(trimString),
    zipCode: z
      .string()
      .min(5, { message: "Valid ZIP code is required" })
      .transform(trimString),
    livingSituation: z
      .string()
      .min(1, { message: "Living situation is required" })
      .transform(trimString),
    pharmacy_name: z
      .string()
      .min(1, { message: "Pharmacy name is required" })
      .optional()
      .transform((val) => (val ? trimString(val) : val)),
    pharmacy_address: z
      .string()
      .min(1, { message: "Pharmacy address is required" })
      .optional()
      .transform((val) => (val ? trimString(val) : val)),
    pharmacy_phone: z
      .string()
      .min(1, { message: "Pharmacy phone is required" })
      .optional()
      .transform((val) => (val ? trimString(val) : val)),
    pharmacy_fax: z
      .string()
      .min(1, { message: "Pharmacy fax is required" })
      .optional()
      .transform((val) => (val ? trimString(val) : val)),
    preferred_hospital: z
      .string()
      .min(1, { message: "Preferred Hospital Name is required" })
      .optional()
      .transform((val) => (val ? trimString(val) : val)),
    hospital_address: z
      .string()
      .min(1, { message: "Hospital address is required" })
      .optional()
      .transform((val) => (val ? trimString(val) : val)),
    hospital_phone: z
      .string()
      .min(1, { message: "Hospital phone is required" })
      .optional()
      .transform((val) => (val ? trimString(val) : val)),
    isEdit: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.isEdit) {
      if (!data.pharmacy_name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Pharmacy name is required",
          path: ["pharmacy_name"],
        });
      }
      if (!data.pharmacy_address) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Pharmacy address is required",
          path: ["pharmacy_address"],
        });
      }
      if (!data.pharmacy_phone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Pharmacy phone is required",
          path: ["pharmacy_phone"],
        });
      }
      if (!data.pharmacy_fax) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Pharmacy fax is required",
          path: ["pharmacy_fax"],
        });
      }
      if (!data.preferred_hospital) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Preferred Hospital Name is required",
          path: ["preferred_hospital"],
        });
      }
      if (!data.hospital_address) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Hospital address is required",
          path: ["hospital_address"],
        });
      }
      if (!data.hospital_phone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Hospital phone is required",
          path: ["hospital_phone"],
        });
      }
    }
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
      .max(35, { message: "Medication name must be less than 35 characters" })
      .transform(trimString),
    dosage: z
      .string()
      .min(3, { message: "Dosage is required (min 3 characters)" })
      .transform(trimString),
    frequency: z
      .string()
      .min(1, { message: "Frequency is required" })
      .transform(trimString),
    purpose: z
      .string()
      .min(3, { message: "Purpose is required (min 3 characters)" })
      .transform(trimString),
    prescribing_doctor: z
      .string()
      .min(1, { message: "Prescribing doctor is required" })
      .transform(trimString),
    start_date: z
      .string()
      .min(1, { message: "Start date is required" })
      .transform(trimString),
    end_date: z
      .string()
      .min(1, { message: "End date is required" })
      .transform(trimString),
    refill_due: z
      .string()
      .min(1, { message: "Refill due is required" })
      .transform(trimString),
    notes: z
      .string()
      .optional()
      .transform((val) => (val ? trimString(val) : val)),
  })
  .refine((data) => new Date(data.start_date) <= new Date(data.end_date), {
    message: "End date cannot be before start date",
    path: ["end_date"],
  })
  .refine((data) => new Date(data.start_date) <= new Date(data.refill_due), {
    message: "Refill due date cannot be before Start date",
    path: ["refill_due"],
  })
  .refine((data) => new Date(data.refill_due) <= new Date(data.end_date), {
    message: "Refill due date cannot be after end date",
    path: ["refill_due"],
  });

export type MedicationFormData = z.infer<typeof medicationSchema>;

export const clientHealthProviderSchema = z
  .object({
    provider_type: z
      .string()
      .min(1, "Provider type is required")
      .transform(trimString),
    provider_name: z
      .string()
      .min(1, "Provider name is required")
      .transform(trimString),
    specialty: z.string().min(1, "Specialty is required").transform(trimString),
    address: z.string().min(1, "Address is required").transform(trimString),
    phone: z.string().min(1, "Phone number is required").transform(trimString),
    fax: z.string().min(1, "Fax is required").transform(trimString),
    last_visit: z
      .string()
      .min(1, "Last visit is required")
      .transform(trimString),
    next_visit: z
      .string()
      .min(1, "Next visit is required")
      .transform(trimString),
    notes: z
      .string()
      .optional()
      .transform((val) => (val ? trimString(val) : val)),
  })
  .refine(
    (data) => {
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
  diagnoses: z
    .array(z.string().min(1, "Diagnosis cannot be empty").transform(trimString))
    .min(1, "At least one diagnosis is required"),
  allergies: z
    .array(z.string().min(1, "Allergy cannot be empty").transform(trimString))
    .min(1, "At least one allergy is required"),
  dietary_restrictions: z
    .array(
      z
        .string()
        .min(1, "Dietary restriction cannot be empty")
        .transform(trimString)
    )
    .min(1, "At least one dietary restriction is required"),
  surgical_history: z
    .array(
      z
        .string()
        .min(1, "Surgical history cannot be empty")
        .transform(trimString)
    )
    .min(1, "At least one surgical history is required"),
  cognitive_status: z
    .string()
    .min(1, "Cognitive status is required")
    .transform(trimString),
  last_cognitive_screening: z
    .string()
    .min(1, "Last cognitive screening date is required")
    .transform(trimString),
  cognitive_score: z.number().min(1, "Cognitive score is required"),
  total_score: z.number().min(1, "Total score is required"),
  notes: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
});

export type MedicalHistoryFormData = z.infer<typeof medicalHistorySchema>;

export const documentSchema = z.object({
  documentType: z.string().min(1, "Category is required").transform(trimString),
  title: z.string().min(1, "Title is required").transform(trimString),
  description: z
    .string()
    .min(1, "Description is required")
    .transform(trimString),
  file: z.instanceof(File, { message: "File is required" }),
});

export type DocumentFormData = z.infer<typeof documentSchema>;

export const accessSchema = z.object({
  first_name: z
    .string()
    .min(1, "First Name is required")
    .max(12, "First Name must be less than 12 characters")
    .transform(trimString),
  last_name: z
    .string()
    .min(1, "Last Name is required")
    .max(12, "Last Name must be less than 12 characters")
    .transform(trimString),
  relation: z.string().min(1, "Relationship is required").transform(trimString),
  email: z.string().email("Valid email is required").transform(trimString),
  phone: z.string().min(1, "Phone number is required").transform(trimString),
  role: z.string().min(1, "Role is required").transform(trimString),
  password: z
    .string()
    .min(12, "Password must be at least 12 characters long")
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => /\d/.test(val), {
      message: "Password must contain at least one number",
    })
    .refine((val) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(val), {
      message: "Password must contain at least one special character",
    }),
});

export type AccessFormData = z.infer<typeof accessSchema>;

export const editAccessSchema = z.object({
  first_name: z
    .string()
    .min(1, "First Name is required")
    .max(12, "First Name must be less than 12 characters")
    .transform(trimString),
  last_name: z
    .string()
    .min(1, "Last Name is required")
    .max(12, "Last Name must be less than 12 characters")
    .transform(trimString),
  relation: z.string().min(1, "Relationship is required").transform(trimString),
  phone: z.string().min(1, "Phone number is required").transform(trimString),
  role: z.string().min(1, "Role is required").transform(trimString),
});

export type EditAccessFormData = z.infer<typeof editAccessSchema>;

export const appointmentSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(30, "Title must be less than 30 characters")
      .transform(trimString),
    appointment_type: z
      .string()
      .min(1, "Appointment type is required")
      .transform(trimString),
    location: z.string().min(1, "Location is required").transform(trimString),
    start_time: z
      .string()
      .min(1, "Start time is required")
      .transform(trimString),
    end_time: z.string().min(1, "End time is required").transform(trimString),
    notes: z
      .string()
      .max(50, "Notes must be less than 50 characters")
      .optional()
      .transform((val) => (val ? trimString(val) : val)),
    clientId: z.string().min(1, "Client is required").transform(trimString),
    healthcare_provider_id: z
      .string()
      .min(1, "Healthcare provider is required")
      .transform(trimString),
    post_appointment_notes: z
      .string()
      .max(50, "Post appointment notes must be less than 50 characters")
      .optional()
      .transform((val) => (val ? trimString(val) : val)),
  })
  .refine(
    (data) => {
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
      .min(12, "Password must be at least 12 characters long")
      .refine((val) => zxcvbn(val).score >= 3, {
        message: "Password is too weak (must score 3 or more)",
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((val) => /[a-z]/.test(val), {
        message: "Password must contain at least one lowercase letter",
      })
      .refine((val) => /\d/.test(val), {
        message: "Password must contain at least one number",
      })
      .refine((val) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(val), {
        message: "Password must contain at least one special character",
      }),
    confirm_password: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export type PasswordFormData = z.infer<typeof passwordSchema>;

export const addThreadFormSchema = z.object({
  client_id: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  type: z.string().min(1, "Type is Required").transform(trimString),
  participant_id: z
    .string()
    .min(1, "Participant ID is Required")
    .transform(trimString),
});

export type AddThreadFormData = z.infer<typeof addThreadFormSchema>;

export const faceSheetShortFormSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  ssn: z.string().optional(),

  // Emergency Contact
  emergencyContactFirstName: z.string().min(1, "First name is required"),
  emergencyContactLastName: z.string().min(1, "Last name is required"),
  emergencyContactPhone: z.string().min(1, "Phone number is required"),
  emergencyContactRelationship: z.string().min(1, "Relationship is required"),
  emergencyContactEmail: z.string().email().min(1, "Email is required"),
  emergencyContactAddress: z.string().min(1, "Address is required"),

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
        address: z.string().optional(),
        phone: z.string().optional(),
        fax: z.string().optional(),
        lastVisit: z.string().optional(),
        nextVisit: z.string().optional(),
        id: z.string().optional().nullish().nullable(),
        providerType: z.string().optional(),
      })
    )
    .optional(),

  medications: z
    .array(
      z.object({
        medicationName: z.string().optional(),
        dose: z.string().optional(),
        usedToTreat: z.string().optional(),
        prescriber: z.string().optional(),
        refillDue: z.string().optional(),
        id: z.string().optional().nullable().nullish(),
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
    address: z.string().min(1, "Address is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    ssn: z.string().optional(),

    // Additional Personal Information
    gender: z.string().optional(),
    race: z.string().optional(),
    language: z.string().optional(),
    maritalStatus: z.string().optional(),
    livingSituation: z.string().optional(),
    dateOfLastCarePlan: z.string().optional(),

    // Emergency Contact
    emergencyContactFirstName: z.string().min(1, "First name is required"),
    emergencyContactLastName: z.string().min(1, "Last name is required"),
    emergencyContactPhone: z.string().min(1, "Phone number is required"),
    emergencyContactRelationship: z.string().min(1, "Relationship is required"),
    emergencyContactEmail: z.string().email().min(1, "Email is required"),
    emergencyContactAddress: z.string().min(1, "Address is required"),

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
    mentalStatus: z.string().min(1, "Mental status is required"),
    cognitiveScreeningDate: z.string().optional(),
    cognitiveScreeningScore: z.string().optional(),
    cognitiveScreeningScoreOutOf: z.string().optional(),
    notesAndConcerns: z.string().optional(),

    // Dynamic Arrays
    providers: z
      .array(
        z.object({
          providerName: z.string().optional(),
          specialty: z.string().optional(),
          address: z.string().optional(),
          phone: z.string().optional(),
          fax: z.string().optional(),
          lastVisit: z.string().optional(),
          nextVisit: z.string().optional(),
          id: z.string().optional().nullish().nullable(),
          providerType: z.string().optional(),
        })
      )
      .optional(),

    medications: z
      .array(
        z.object({
          medicationName: z.string().optional(),
          dose: z.string().optional(),
          usedToTreat: z.string().optional(),
          id: z.string().optional().nullable().nullish(),
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
  )
  .refine(
    (data) => {
      const score = data.cognitiveScreeningScore;
      const scoreOutOf = data.cognitiveScreeningScoreOutOf;
      if (!score || !scoreOutOf) return true;
      const scoreNumber = parseInt(score);
      const scoreOutOfNumber = parseInt(scoreOutOf);
      return (
        scoreNumber <= scoreOutOfNumber &&
        scoreNumber >= 0 &&
        scoreOutOfNumber >= 0
      );
    },
    {
      message: "Cognitive screening score cannot be greater than total score",
      path: ["cognitiveScreeningScore"],
    }
  );

export type FaceSheetLongFormData = z.infer<typeof faceSheetLongFormSchema>;

// Health History Form Schema
export const healthHistoryFormSchema = z.object({
  // Medical Info
  diagnoses: z
    .array(
      z.object({
        diagnosis: z.string().optional(),
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
        startDate: z.string().optional().nullable().nullish(),
        endDate: z.string().optional().nullable().nullish(),
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
        startDate: z.string().optional().nullable().nullish(),
        endDate: z.string().optional().nullable().nullish(),
      })
    )
    .optional(),

  // Healthcare Providers
  providerName: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  providerAddress: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  providerPhone: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  providerNotes: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),
  providerFollowUp: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : val)),

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
