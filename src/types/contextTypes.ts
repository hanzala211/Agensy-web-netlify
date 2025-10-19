import type {
  AccessInfo,
  Appointment,
  Client,
  ClientContact,
  ClientMedical,
  ClientMedications,
  Document,
  HealthcareProvider,
  IUser,
  Message,
  Note,
  Thread,
} from "./schemas";
import type {
  OCRField,
  OpenedFileData,
  PendingThreadData,
  TypingUsers,
} from "./otherSchemas";

export interface AuthContextType {
  userData: IUser | null;
  setUserData: React.Dispatch<React.SetStateAction<IUser | null>>;
  isAuthLoading: boolean;
  setIsAuthLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => Promise<void>;
  clients: Client[];
  filterHealthCareProvider: (
    clientId: string,
    providerId: string
  ) => HealthcareProvider;
  filterClient: (clientId: string) => Client;
  updateUserData: (data: IUser) => void;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  loadAuth: () => void;
  accessUsers: IUser[];
  filterClientRole: (clientId: string) => string;
  handleFilterPermission: (clientId: string, appAction: string) => boolean;
  isPrimaryUserSubscriptionActive: (clientId: string) => boolean;
  isLoggingOut: boolean;
}

export interface ClientContextType {
  selectedClient: Client | null;
  setSelectedClient: React.Dispatch<React.SetStateAction<Client | null>>;
  addClientContact: (contact: ClientContact) => void;
  updateClientContact: (contact: ClientContact) => void;
  deleteClientContact: (contactId: string) => void;
  addClientNote: (note: Note) => void;
  updateClientNote: (note: Note) => void;
  deleteClientNote: (noteId: string) => void;
  addClientMedication: (medication: ClientMedications) => void;
  updateClientMedication: (medication: ClientMedications) => void;
  deleteClientMedication: (medicationId: string) => void;
  addClientHealthCareProvider: (healthCareProvider: HealthcareProvider) => void;
  updateClientHealthCareProvider: (
    healthCareProvider: HealthcareProvider
  ) => void;
  deleteClientHealthCareProvider: (providerID: string) => void;
  addClientMedicalHistory: (medicalHistory: ClientMedical) => void;
  addClientDocument: (document: Document) => void;
  deleteClientDocument: (documentId: string) => void;
  handleDownload: (doc: Document) => Promise<void>;
  addClientAccess: (access: AccessInfo) => void;
  deleteClientAccess: (userId: string) => void;
  updateClientAccess: (userId: string, data: AccessInfo) => void;
  openedFileData: OpenedFileData | null;
  setOpenedFileData: React.Dispatch<
    React.SetStateAction<OpenedFileData | null>
  >;
  ocrResult: OCRField[];
  setOcrResult: React.Dispatch<React.SetStateAction<OCRField[]>>;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  shouldDownloadAfterSave: boolean;
  setShouldDownloadAfterSave: React.Dispatch<React.SetStateAction<boolean>>;
  handleSaveAndDownload?: () => void;
  setHandleSaveAndDownload: React.Dispatch<
    React.SetStateAction<(() => void) | undefined>
  >;
}

export interface DocumentContextType {
  isAddDocumentModalOpen: boolean;
  setIsAddDocumentModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AppointmentsContextType {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  addAppointment: (appointment: Appointment) => void;
  isAddAppointmentModalOpen: boolean;
  setIsAddAppointmentModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteAppointment: (appointmentId: string) => void;
  editAppointment: (appointment: Appointment) => void;
  cancelAppointment: (appointmentId: string) => void;
}

export interface MessagesContextType {
  selectedThread: Thread | null;
  setSelectedThread: React.Dispatch<React.SetStateAction<Thread | null>>;
  showThreadList: boolean;
  setShowThreadList: React.Dispatch<React.SetStateAction<boolean>>;
  isThreadsLoading: boolean;
  currentThreadMessages: Message[];
  setCurrentThreadMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  threads: Thread[];
  setThreads: React.Dispatch<React.SetStateAction<Thread[]>>;
  updateThreads: (
    threadId: string,
    lastMessageSender: string,
    message: string
  ) => void;
  updateSelectedThread: (
    threadId: string,
    lastMessageSender: string,
    message: string
  ) => void;
  updateCurrentThreadMessages: (
    message: string,
    thread: string,
    senderID: string
  ) => void;
  updateThreadsSorting: () => void;
  pendingThreadData: PendingThreadData | null;
  setPendingThreadData: React.Dispatch<
    React.SetStateAction<PendingThreadData | null>
  >;
  clearPendingThreadData: () => void;
  addThreadToList: (thread: Thread) => void;
  navigateToExistingThread: (
    threadId: string,
    navigate: (path: string) => void
  ) => void;
  existingThreadData: {
    threadId: string;
    clientId?: string;
  } | null;
  setExistingThreadData: React.Dispatch<
    React.SetStateAction<{
      threadId: string;
      clientId?: string;
    } | null>
  >;
  clearExistingThreadData: () => void;
  markMessageAsRead: (messageId: string, threadId: string) => void;
  typingUsers: TypingUsers;
  emitTypingStart: (threadId: string) => void;
  emitTypingStop: (threadId: string) => void;
}
