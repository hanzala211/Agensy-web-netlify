import {
  useAddNoteMutation,
  useDeleteNoteMutation,
  useEditNoteMutation,
} from "@agensy/api";
import {
  ActionButtons,
  AddNoteModal,
  Card,
  ConfirmationModal,
  EmptyStateCard,
  InfoItem,
} from "@agensy/components";
import { APP_ACTIONS, ICONS } from "@agensy/constants";
import { useAuthContext, useClientContext } from "@agensy/context";
import type { NoteFormData, Note as NoteType } from "@agensy/types";
import { DateUtils, toast } from "@agensy/utils";
import React, { useEffect, useState } from "react";

export const ClientNoteCard: React.FC = () => {
  const { handleFilterPermission } = useAuthContext();
  const { selectedClient, addClientNote, updateClientNote, deleteClientNote } =
    useClientContext();
  const addNoteMutation = useAddNoteMutation();
  const editNoteMutation = useEditNoteMutation();
  const deleteNoteMutation = useDeleteNoteMutation();
  const [isNoteModalOpen, setIsNoteModalOpen] = useState<boolean>(false);
  const [selectedEditNote, setSelectedEditNote] = useState<NoteType | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (addNoteMutation.status === "success") {
      setIsNoteModalOpen(false);
      addClientNote(addNoteMutation.data);
      toast.success("Note added successfully");
    } else if (addNoteMutation.status === "error") {
      toast.error("Failed to add note", addNoteMutation.error.message);
    }
  }, [addNoteMutation.status]);

  useEffect(() => {
    if (editNoteMutation.status === "success") {
      setIsNoteModalOpen(false);
      updateClientNote(editNoteMutation.data);
      toast.success("Note updated successfully");
    } else if (editNoteMutation.status === "error") {
      toast.error("Failed to edit note", editNoteMutation.error.message);
    }
  }, [editNoteMutation.status]);

  useEffect(() => {
    if (deleteNoteMutation.status === "success") {
      deleteClientNote(deleteNoteMutation.variables.noteId);
      toast.success("Note deleted successfully");
    } else if (deleteNoteMutation.status === "error") {
      toast.error("Failed to delete note", deleteNoteMutation.error.message);
    }
  }, [deleteNoteMutation.status]);

  useEffect(() => {
    if (!isNoteModalOpen) {
      removeEditNote();
    }
  }, [isNoteModalOpen]);

  const handleEditNote = (note: NoteType) => {
    setSelectedEditNote(note);
    setIsNoteModalOpen(true);
  };

  const handleCloseNoteModal = () => {
    setIsNoteModalOpen(false);
    removeEditNote();
  };

  const handleAddNote = (data: NoteFormData) => {
    if (!selectedEditNote) {
      addNoteMutation.mutate({
        text: data.note,
        client_id: String(selectedClient?.id),
      });
    } else {
      editNoteMutation.mutate({
        noteId: selectedEditNote.id as string,
        text: data.note,
        clientId: selectedClient?.id as string,
      });
    }
  };

  const removeEditNote = () => {
    setTimeout(() => {
      setSelectedEditNote(null);
    }, 100);
  };

  const handleDeleteNote = (noteId: string) => {
    setIsDeleteModalOpen(false);
    deleteNoteMutation.mutate({
      noteId,
      clientId: selectedClient?.id as string,
    });
  };

  return (
    <React.Fragment>
      <Card
        title="Notes"
        buttonText={<ICONS.plus size={16} />}
        ariaLabel="Add Note"
        onButtonClick={() => setIsNoteModalOpen(true)}
        showButton={handleFilterPermission(
          selectedClient?.id as string,
          APP_ACTIONS.EditClientNotes
        )}
      >
        <div className="space-y-4">
          {selectedClient?.clientNotes &&
          selectedClient?.clientNotes.length > 0 ? (
            selectedClient?.clientNotes?.map((item, index) => (
              <InfoItem key={index}>
                <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
                  <div className="w-[90%] sm:flex-1 space-y-2">
                    <p className="break-words whitespace-pre-wrap">
                      {item.text}
                    </p>
                    <p className="text-gray-600 text-[14px] mb-1">
                      {DateUtils.formatDateTime(String(item.updatedAt) || "") +
                        " " +
                        (item.is_edited ? "(Edited)" : "")}
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    {handleFilterPermission(
                      selectedClient?.id as string,
                      APP_ACTIONS.EditClientNotes
                    ) && (
                      <ActionButtons
                        onEdit={() => handleEditNote(item)}
                        onDelete={() => setIsDeleteModalOpen(true)}
                        isDeleting={deleteNoteMutation.isPending}
                        editLabel="Edit Note"
                        deleteLabel="Delete Note"
                      />
                    )}
                  </div>
                </div>
                <ConfirmationModal
                  title="Delete Note"
                  isModalOpen={isDeleteModalOpen}
                  onOk={() => handleDeleteNote(item.id as string)}
                  onCancel={() => setIsDeleteModalOpen(false)}
                >
                  <p>Are you sure you want to delete this note?</p>
                </ConfirmationModal>
              </InfoItem>
            ))
          ) : (
            <EmptyStateCard
              ICON={ICONS.plus}
              label="Notes"
              showText={handleFilterPermission(
                selectedClient?.id as string,
                APP_ACTIONS.EditClientNotes
              )}
              onClick={() => {
                if (
                  handleFilterPermission(
                    selectedClient?.id as string,
                    APP_ACTIONS.EditClientNotes
                  )
                ) {
                  setIsNoteModalOpen(true);
                }
              }}
            />
          )}
        </div>
      </Card>

      <AddNoteModal
        isOpen={isNoteModalOpen}
        onClose={handleCloseNoteModal}
        onSubmit={handleAddNote}
        isLoading={addNoteMutation.isPending || editNoteMutation.isPending}
        initialNote={selectedEditNote?.text}
      />
    </React.Fragment>
  );
};
