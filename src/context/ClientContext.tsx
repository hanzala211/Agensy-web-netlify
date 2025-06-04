import type {
  AccessInfo,
  Client,
  ClientContact,
  ClientContextType,
  ClientMedical,
  ClientMedications,
  Document,
  HealthcareProvider,
  IUser,
  Note,
} from "@agensy/types";
import { toast } from "@agensy/utils";
import { createContext, useContext, useState } from "react";
import { useAuthContext } from "./AuthContext";

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const { userData } = useAuthContext();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const addClientContact = (contact: ClientContact) => {
    setSelectedClient((prev) => {
      if (!prev) return null;
      return { ...prev, contacts: [...prev.contacts, contact] };
    });
  };

  const updateClientContact = (contact: ClientContact) => {
    setSelectedClient((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        contacts: prev.contacts.map((c) => (c.id === contact.id ? contact : c)),
      };
    });
  };

  const deleteClientContact = (contactId: string) => {
    setSelectedClient((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        contacts: prev.contacts.filter((c) => c.id !== contactId),
      };
    });
  };

  const addClientNote = (note: Note) => {
    setSelectedClient((prev) => {
      if (!prev) return null;
      return { ...prev, clientNotes: [note, ...prev.clientNotes] };
    });
  };

  const updateClientNote = (note: Note) => {
    setSelectedClient((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        clientNotes: prev.clientNotes.map((n) => (n.id === note.id ? note : n)),
      };
    });
  };

  const deleteClientNote = (noteId: string) => {
    setSelectedClient((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        clientNotes: prev.clientNotes.filter((n) => n.id !== noteId),
      };
    });
  };

  const addClientMedication = (medication: ClientMedications) => {
    setSelectedClient((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        medications: [...prev.medications, medication],
      };
    });
  };

  const updateClientMedication = (medication: ClientMedications) => {
    setSelectedClient((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        medications: prev.medications.map((n) =>
          n.id === medication.id ? medication : n
        ),
      };
    });
  };

  const deleteClientMedication = (medicationId: string) => {
    setSelectedClient((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        medications: prev.medications.filter((n) => n.id !== medicationId),
      };
    });
  };

  const addClientHealthCareProvider = (
    healthCareProvider: HealthcareProvider
  ) => {
    setSelectedClient((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        healthcareProviders: [...prev.healthcareProviders, healthCareProvider],
      };
    });
  };

  const updateClientHealthCareProvider = (
    healthCareProvider: HealthcareProvider
  ) => {
    setSelectedClient((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        healthcareProviders: prev.healthcareProviders.map((n) =>
          n.id === healthCareProvider.id ? healthCareProvider : n
        ),
      };
    });
  };

  const deleteClientHealthCareProvider = (providerID: string) => {
    setSelectedClient((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        healthcareProviders: prev.healthcareProviders.filter(
          (n) => n.id !== providerID
        ),
      };
    });
  };

  const addClientMedicalHistory = (medicalHistory: ClientMedical) => {
    setSelectedClient((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        medical: medicalHistory,
      };
    });
  };

  const addClientDocument = (document: Document) => {
    setSelectedClient((prev) => {
      if (!prev) return null;
      return { ...prev, documents: [...prev.documents, document] };
    });
  };

  const deleteClientDocument = (documentId: string) => {
    setSelectedClient((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        documents: prev.documents.filter((d) => d.id !== documentId),
      };
    });
  };

  const addClientAccess = (access: AccessInfo) => {
    setSelectedClient((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        Users: [{ ...access, assignedBy: userData as IUser }, ...prev.Users],
      };
    });
  };

  const deleteClientAccess = (userId: string) => {
    setSelectedClient((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        Users: prev.Users.filter((u) => u.id !== userId),
      };
    });
  };

  const updateClientAccess = (userId: string, data: AccessInfo) => {
    setSelectedClient((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        Users: prev.Users.map((u) => (u.id === userId ? { ...u, ...data } : u)),
      };
    });
  };
  const handleDownload = async (doc: Document) => {
    try {
      toast.info("Processing Document...");
      const fileResponse = await fetch(doc.file_url, {
        method: "GET",
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });

      const blob = await fileResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", doc.title);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Document download started");
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download document");
    }
  };

  return (
    <ClientContext.Provider
      value={{
        selectedClient,
        setSelectedClient,
        addClientContact,
        updateClientContact,
        deleteClientContact,
        addClientNote,
        updateClientNote,
        deleteClientNote,
        addClientMedication,
        updateClientMedication,
        deleteClientMedication,
        addClientHealthCareProvider,
        updateClientHealthCareProvider,
        deleteClientHealthCareProvider,
        addClientMedicalHistory,
        addClientDocument,
        deleteClientDocument,
        handleDownload,
        addClientAccess,
        deleteClientAccess,
        updateClientAccess,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClientContext = (): ClientContextType => {
  const context = useContext(ClientContext);
  if (!context) throw new Error("use useClientContext inside CLient Provider");
  return context;
};
