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

