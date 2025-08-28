export type MedicalHistoryArrayField =
  | "diagnoses"
  | "allergies"
  | "dietary_restrictions"
  | "surgical_history";

export type ViewMode = "month" | "week" | "day";

export interface FolderItem {
  id: string;
  name: string;
  type: "folder" | "file";
  children?: FolderItem[];
  slug: string;
}

export interface FolderData {
  id: string;
  name: string;
  description?: string;
  content: React.ReactNode;
}

export type OpenedFileData = Record<
  string,
  string | string[] | Record<string, string | number>
>;

export interface ChecklistField {
  id: string;
  type: "heading" | "group" | "checkbox" | "radio" | "link";
  label: string;
  name?: string;
  options?: string[];
  parentId: string | null;
  headingId?: string;
  parentOption?: string;
}

export type ChecklistFormData = Record<string, boolean | string | null>;

export interface OCRField {
  key: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  label: string;
}

export interface MappedField {
  field: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: string | any[];
}

export type Vital = {
  id?: string | null;
  date: string | null;
  heart_rate: string | number | null;
  blood_pressure: string | null;
  temperature: string | number | null;
  weight: string | number | null;
  height: string | number | null;
  oxygen_saturation: string | number | null;
  blood_type: string | null;
  other_vital_signs: string | null;
};

export interface ConfidenceScore {
  category: string;
  title: string;
  description: string;
  confidenceScores: {
    category: number;
    title: number;
    description: number;
  };
}
