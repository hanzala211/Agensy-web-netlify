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
}

export interface FolderData {
  id: string;
  name: string;
  description?: string;
  content: React.ReactNode;
}
