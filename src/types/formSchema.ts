import { z } from "zod";
import zxcvbn from "zxcvbn";

export const signUpSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email_address: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Invalid email address" }),
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
    .email({ message: "Invalid email address" }),
  password: z.string().min(12, "Password must be at least 12 characters long"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
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
    .min(1, { message: "Preferred Hospital Name is required" }),
  hospital_address: z
    .string()
    .min(1, { message: "Hospital address is required" }),
  hospital_phone: z.string().min(1, { message: "Hospital phone is required" }),
  pharmacy_name: z.string().min(1, { message: "Pharmacy name is required" }),
  pharmacy_address: z
    .string()
    .min(1, { message: "Pharmacy address is required" }),
  pharmacy_phone: z.string().min(1, { message: "Pharmacy phone is required" }),
  pharmacy_fax: z.string().min(1, { message: "Pharmacy fax is required" }),
});

export type HospitalFormData = z.infer<typeof hospitalSchema>;

export const clientSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "First name is required" })
      .max(12, "First name must be less than 12 characters"),
    lastName: z
      .string()
      .min(2, { message: "Last name is required" })
      .max(12, "Last name must be less than 12 characters"),
    dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
    gender: z.enum(["male", "female", "other"]),
    maritalStatus: z.string().min(1, { message: "Marital status is required" }),
    address: z.string().min(5, { message: "Address is required" }),
    city: z.string().min(2, { message: "City is required" }),
    state: z.string().min(2, { message: "State is required" }),
    zipCode: z.string().min(5, { message: "Valid ZIP code is required" }),
    livingSituation: z
      .string()
      .min(1, { message: "Living situation is required" }),
    pharmacy_name: z
      .string()
      .min(1, { message: "Pharmacy name is required" })
      .optional(),
    pharmacy_address: z
      .string()
      .min(1, { message: "Pharmacy address is required" })
      .optional(),
    pharmacy_phone: z
      .string()
      .min(1, { message: "Pharmacy phone is required" })
      .optional(),
    pharmacy_fax: z
      .string()
      .min(1, { message: "Pharmacy fax is required" })
      .optional(),
    preferred_hospital: z
      .string()
      .min(1, { message: "Preferred Hospital Name is required" })
      .optional(),
    hospital_address: z
      .string()
      .min(1, { message: "Hospital address is required" })
      .optional(),
    hospital_phone: z
      .string()
      .min(1, { message: "Hospital phone is required" })
      .optional(),
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
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  phone: z.string().min(1, "Phone number is required"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const noteSchema = z.object({
  note: z.string().min(1, { message: "Note is required" }),
});

export type NoteFormData = z.infer<typeof noteSchema>;

export const medicationSchema = z
  .object({
    medication_name: z
      .string()
      .min(1, { message: "Medication name is required" })
      .max(35, { message: "Medication name must be less than 35 characters" }),
    dosage: z
      .string()
      .min(3, { message: "Dosage is required (min 3 characters)" }),
    frequency: z.string().min(1, { message: "Frequency is required" }),
    purpose: z
      .string()
      .min(3, { message: "Purpose is required (min 3 characters)" }),
    prescribing_doctor: z
      .string()
      .min(1, { message: "Prescribing doctor is required" }),
    start_date: z.string().min(1, { message: "Start date is required" }),
    end_date: z.string().min(1, { message: "End date is required" }),
    refill_due: z.string().min(1, { message: "Refill due is required" }),
    notes: z.string().optional(),
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
    provider_type: z.string().min(1, "Provider type is required"),
    provider_name: z.string().min(1, "Provider name is required"),
    specialty: z.string().min(1, "Specialty is required"),
    address: z.string().min(1, "Address is required"),
    phone: z.string().min(1, "Phone number is required"),
    fax: z.string().min(1, "Fax is required"),
    last_visit: z.string().min(1, "Last visit is required"),
    next_visit: z.string().min(1, "Next visit is required"),
    notes: z.string().optional(),
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
    .array(z.string().min(1, "Diagnosis cannot be empty"))
    .min(1, "At least one diagnosis is required"),
  allergies: z
    .array(z.string().min(1, "Allergy cannot be empty"))
    .min(1, "At least one allergy is required"),
  dietary_restrictions: z
    .array(z.string().min(1, "Dietary restriction cannot be empty"))
    .min(1, "At least one dietary restriction is required"),
  surgical_history: z
    .array(z.string().min(1, "Surgical history cannot be empty"))
    .min(1, "At least one surgical history is required"),
  cognitive_status: z.string().min(1, "Cognitive status is required"),
  last_cognitive_screening: z
    .string()
    .min(1, "Last cognitive screening date is required"),
  cognitive_score: z.number().min(1, "Cognitive score is required"),
  total_score: z.number().min(1, "Total score is required"),
  notes: z.string().optional(),
});

export type MedicalHistoryFormData = z.infer<typeof medicalHistorySchema>;

export const documentSchema = z.object({
  documentType: z.string().min(1, "Category is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  file: z.instanceof(File, { message: "File is required" }),
});

export type DocumentFormData = z.infer<typeof documentSchema>;

export const accessSchema = z.object({
  first_name: z
    .string()
    .min(1, "First Name is required")
    .max(12, "First Name must be less than 12 characters"),
  last_name: z
    .string()
    .min(1, "Last Name is required")
    .max(12, "Last Name must be less than 12 characters"),
  relation: z.string().min(1, "Relationship is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  role: z.string().min(1, "Role is required"),
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
    .max(12, "First Name must be less than 12 characters"),
  last_name: z
    .string()
    .min(1, "Last Name is required")
    .max(12, "Last Name must be less than 12 characters"),
  relation: z.string().min(1, "Relationship is required"),
  phone: z.string().min(1, "Phone number is required"),
  role: z.string().min(1, "Role is required"),
});

export type EditAccessFormData = z.infer<typeof editAccessSchema>;

export const appointmentSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(30, "Title must be less than 30 characters"),
    appointment_type: z.string().min(1, "Appointment type is required"),
    location: z.string().min(1, "Location is required"),
    start_time: z.string().min(1, "Start time is required"),
    end_time: z.string().min(1, "End time is required"),
    notes: z
      .string()
      .max(50, "Notes must be less than 50 characters")
      .optional(),
    clientId: z.string().min(1, "Client is required"),
    healthcare_provider_id: z
      .string()
      .min(1, "Healthcare provider is required"),
    post_appointment_notes: z
      .string()
      .max(50, "Post appointment notes must be less than 50 characters")
      .optional(),
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
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
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
