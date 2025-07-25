import React, { useEffect, useState } from "react";
import { APP_ACTIONS, ICONS, PERMISSIONS } from "@agensy/constants";
import { useAuthContext, useClientContext } from "@agensy/context";
import {
  AddContactModal,
  Card,
  ConfirmationModal,
  ContactItem,
  EmptyStateCard,
} from "@agensy/components";
import { StringUtils, toast } from "@agensy/utils";
import type { ClientContact, ContactFormData } from "@agensy/types";
import {
  useDeleteClientContactMutation,
  useUpdateContactMutation,
} from "@agensy/api";
import { useAddContactMutation } from "@agensy/api";

export const ContactInfoCard: React.FC = () => {
  const { userData } = useAuthContext();
  const {
    selectedClient,
    addClientContact,
    updateClientContact,
    deleteClientContact,
  } = useClientContext();
  const addContactMutation = useAddContactMutation();
  const updateContactMutation = useUpdateContactMutation();
  const deleteContactMutation = useDeleteClientContactMutation();
  const [selectedEditContact, setSelectedEditContact] =
    useState<ClientContact | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const userPermissions =
    PERMISSIONS[userData?.role as keyof typeof PERMISSIONS] || [];

  useEffect(() => {
    if (!isContactModalOpen) {
      removeEditContact();
    }
  }, [isContactModalOpen]);

  useEffect(() => {
    if (addContactMutation.status === "success") {
      setIsContactModalOpen(false);
      addClientContact(addContactMutation.data);
      toast.success("Contact Added Successfully");
    } else if (addContactMutation.status === "error") {
      toast.error("Failed to Add Contact", String(addContactMutation.error));
    }
  }, [addContactMutation.status]);

  useEffect(() => {
    if (updateContactMutation.status === "success") {
      setIsContactModalOpen(false);
      updateClientContact(updateContactMutation.data);
      toast.success("Contact Updated Successfully");
    } else if (updateContactMutation.status === "error") {
      toast.error(
        "Failed to Update Contact",
        String(updateContactMutation.error)
      );
    }
  }, [updateContactMutation.status]);

  useEffect(() => {
    if (deleteContactMutation.status === "success") {
      deleteClientContact(deleteContactMutation.variables.contactId);
      toast.success("Contact Deleted Successfully", "");
    } else if (deleteContactMutation.status === "error") {
      toast.error(
        "Failed to Delete Contact",
        String(deleteContactMutation.error)
      );
    }
  }, [deleteContactMutation.status]);

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false);
    removeEditContact();
  };

  const handleAddContact = (data: ContactFormData) => {
    if (!selectedEditContact) {
      addContactMutation.mutate({
        ...data,
        client_id: String(selectedClient?.id),
      });
    } else {
      updateContactMutation.mutate({
        contactId: String(selectedEditContact.id),
        clientId: selectedClient?.id as string,
        data,
      });
    }
  };

  const handleEditContact = (item: ClientContact) => {
    setSelectedEditContact(item);
    setIsContactModalOpen(true);
  };

  const removeEditContact = () => {
    setTimeout(() => {
      setSelectedEditContact(null);
    }, 100);
  };

  const handleDeleteContact = (contactId: string) => {
    setIsDeleteModalOpen(false);
    deleteContactMutation.mutate({
      contactId,
      clientId: selectedClient?.id as string,
    });
  };

  return (
    <React.Fragment>
      <Card
        title="Contact Information"
        buttonText={<ICONS.plus size={16} />}
        onButtonClick={() => setIsContactModalOpen(true)}
        ariaLabel="Add Contact"
        showButton={userPermissions.includes(APP_ACTIONS.EditClientBasicInfo)}
      >
        <div className="space-y-6">
          {selectedClient?.contacts && selectedClient?.contacts.length > 0 ? (
            selectedClient?.contacts
              .sort((a, b) => {
                const order = { primary: 1, secondary: 2, emergency: 3 };
                return order[a.contact_type] - order[b.contact_type];
              })
              .map((item, index) => (
                <ContactItem
                  key={index}
                  onEdit={() => handleEditContact(item)}
                  label={`${StringUtils.capitalizeFirstLetter(
                    item.contact_type
                  )}`}
                  type={item.contact_type}
                  onDelete={() => setIsDeleteModalOpen(true)}
                  isDeleting={deleteContactMutation.isPending}
                  showActions={userPermissions.includes(
                    APP_ACTIONS.EditClientBasicInfo
                  )}
                >
                  <div>
                    <p>
                      {item.first_name} {item.last_name}{" "}
                      {item.relationship && "("}
                      {StringUtils.capitalizeFirstLetter(item.relationship)}
                      {item.relationship && ")"}
                    </p>
                    <p>{item.phone}</p>
                  </div>
                  <ConfirmationModal
                    title="Delete Contact"
                    isModalOpen={isDeleteModalOpen}
                    onOk={() => handleDeleteContact(item.id as string)}
                    onCancel={() => setIsDeleteModalOpen(false)}
                  >
                    <p>Are you sure you want to delete this contact?</p>
                  </ConfirmationModal>
                </ContactItem>
              ))
          ) : (
            <EmptyStateCard
              ICON={ICONS.plus}
              label="Contact"
              onClick={() => {
                if (userPermissions.includes(APP_ACTIONS.EditClientBasicInfo)) {
                  setIsContactModalOpen(true);
                }
              }}
              showText={userPermissions.includes(
                APP_ACTIONS.EditClientBasicInfo
              )}
            />
          )}
        </div>
      </Card>
      <AddContactModal
        isOpen={isContactModalOpen}
        onClose={handleCloseContactModal}
        onSubmit={handleAddContact}
        isLoading={
          addContactMutation.isPending || updateContactMutation.isPending
        }
        editContact={selectedEditContact}
      />
    </React.Fragment>
  );
};
