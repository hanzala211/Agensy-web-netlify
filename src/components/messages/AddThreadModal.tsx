import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Input, Modal, PrimaryButton, Select } from "@agensy/components";
import { addThreadFormSchema, type AddThreadFormData } from "@agensy/types";
import type { Client } from "@agensy/types";
import { useAuthContext } from "@agensy/context";
import { useGetThreadByParticipantsMutation } from "@agensy/api";
import { useParams } from "react-router-dom";
import { MultiSelectParticipant } from "@agensy/components";
import { ROLES } from "@agensy/constants";

interface AddThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: AddThreadFormData) => void;
  onExistingThreadFound?: (threadId: string) => void;
  isLoading?: boolean;
  showType?: boolean;
  defaultType?: "message" | "broadcast";
  showBroadCastOption?: boolean;
}

export const AddThreadModal: React.FC<AddThreadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onExistingThreadFound,
  isLoading = false,
  showType = true,
  defaultType = "message",
  showBroadCastOption = false,
}) => {
  const { accessUsers, clients, userData } = useAuthContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const params = useParams();
  const isAdmin = userData?.Roles?.some((role) => role.role === ROLES.ADMIN);
  const [messageType, setMessageType] = useState<"message" | "broadcast">(
    defaultType
  );

  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    register,
    formState: { errors },
  } = useForm<AddThreadFormData>({
    resolver: zodResolver(addThreadFormSchema),
    defaultValues: {
      type: params.clientId ? "client" : showType ? "general" : "client",
      participant_ids: [],
      client_id: params.clientId || "",
      name: "",
    },
  });

  const clientsData = useMemo(() => {
    return (
      clients?.map((client: Client) => ({
        label: `${client.first_name} ${client.last_name}`,
        value: client.id as string,
      })) || []
    );
  }, [clients]);

  const getThreadByParticipantsMutation = useGetThreadByParticipantsMutation();

  const currentType = watch("type");
  const currentClientId = watch("client_id");
  useEffect(() => {
    if (messageType === "broadcast") {
      setValue("participant_ids", []);
      setValue("client_id", "");
      setValue("type", "broadcast");
    } else {
      setValue("type", "message");
      setValue("name", "");
    }
    if (currentClientId) {
      setValue("type", "client");
    }
  }, [messageType, currentClientId]);

  useEffect(() => {
    if (currentClientId) {
      setValue("participant_ids", []);
    }
  }, [currentClientId]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        reset({
          type: params.clientId ? "client" : showType ? "general" : "client",
          participant_ids: [],
          client_id: params.clientId || "",
          name: "",
        });
      }, 300);
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    reset();
    setMessageType("message");
    onClose();
  };

  const handleFormSubmit = async (data: AddThreadFormData) => {
    if (messageType === "broadcast") {
      if (!userData?.id) {
        return;
      }
      setMessageType("message");
      onClose();

      if (onSubmit) {
        onSubmit({
          type: "broadcast",
          participant_ids: [],
          client_id: "",
          name: data.name || "",
        });
      }

      return;
    }

    const participantIds = data.participant_ids || [];

    if (participantIds.length === 0 || !userData?.id) {
      return;
    }

    const participants = [userData.id, ...participantIds].sort();

    try {
      const existingThread = await getThreadByParticipantsMutation.mutateAsync({
        participants: participants as string[],
        clientId: data.client_id || undefined,
        type: (data.client_id ? "client" : "general") as "client" | "general",
      });
      console.log(existingThread);

      if (existingThread && onExistingThreadFound) {
        onExistingThreadFound(existingThread.id);

        setMessageType("message");
        onClose();
        return;
      }
    } catch (error) {
      console.error("Error checking for existing thread:", error);
    }

    if (onSubmit) {
      onSubmit({
        ...data,
        type: (data.client_id ? "client" : "general") as "client" | "general",
      });
    }
  };

  const users = useMemo(() => {
    const hasAccessToClient = (clientId: string): boolean => {
      if (!userData?.Roles) return false;
      return userData.Roles.some((role) => role.client_id === clientId);
    };

    if (currentClientId) {
      if (!hasAccessToClient(currentClientId)) {
        return [];
      }
      return (
        accessUsers?.filter(
          (user) =>
            user.id !== userData?.id &&
            (user.Roles || user.UserRoles)?.some(
              (role) => role.client_id === currentClientId
            )
        ) || []
      );
    }

    // General thread - show all users
    return accessUsers?.filter((user) => user.id !== userData?.id) || [];
  }, [clients, currentClientId, currentType, accessUsers, userData]);
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title=""
      maxWidth="max-w-md"
      height="h-auto"
      footerClass="!p-3"
      footer={
        <PrimaryButton
          onClick={() => inputRef.current?.click()}
          type="button"
          className="w-fit !text-[14px] !min-h-[40px]"
          isLoading={isLoading || getThreadByParticipantsMutation.isPending}
          disabled={isLoading || getThreadByParticipantsMutation.isPending}
        >
          {messageType === "broadcast" ? "Start Broadcast" : "Start Messaging"}
        </PrimaryButton>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
        {isAdmin && showBroadCastOption && (
          <div className="border border-gray-200 w-[85%] rounded-lg p-1 ml-6 flex gap-1 mb-4">
            <button
              type="button"
              onClick={() => setMessageType("message")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                messageType === "message"
                  ? "bg-primaryColor text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              New Message
            </button>
            <button
              type="button"
              onClick={() => setMessageType("broadcast")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                messageType === "broadcast"
                  ? "bg-primaryColor text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Broadcast
            </button>
          </div>
        )}

        {messageType === "broadcast" && (
          <>
            <div>
              <Input
                register={register("name")}
                error={errors.name?.message}
                label="Name"
              />
            </div>
            <div className="text-center py-2">
              <p className="text-gray-600 text-sm">
                Broadcast messages will be sent to all users. You can compose
                your message on the next page.
              </p>
            </div>
          </>
        )}

        {messageType === "message" && (
          <>
            {showType && (
              <div>
                <label className="text-darkGray mb-2 block font-medium">
                  Re: (Optional)
                </label>
                <Select
                  control={control}
                  name="client_id"
                  label=""
                  data={clientsData}
                  labelOption="Search to Select Care Recipient (Optional)"
                  className="w-full"
                  showSearch
                />
              </div>
            )}

            <div>
              <label className="text-darkGray mb-2 block font-medium">
                To:
              </label>
              <Controller
                name="participant_ids"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <MultiSelectParticipant
                    {...field}
                    value={value || []}
                    onChange={onChange}
                    placeholder="Start typing names..."
                    options={users}
                    allowClear={true}
                    className="w-full"
                    clientId={currentClientId}
                    accessUsers={accessUsers}
                    userData={userData || undefined}
                  />
                )}
              />
            </div>
          </>
        )}

        <input type="submit" ref={inputRef} className="hidden" />
      </form>
    </Modal>
  );
};

export default AddThreadModal;
