import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CommonLoader,
  PrimaryButton,
  TextArea,
} from "@agensy/components";
import {
  importantPeopleInLifeFormSchema,
  type ImportantPeopleInLifeFormData,
  type OpenedFileData,
} from "@agensy/types";
import { ImportantPersonCard } from "./ImportantPersonCard";
import {
  useGetImportantPeopleInLife,
  usePostImportantPeopleInLifeMutation,
} from "@agensy/api";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "@agensy/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useClientContext } from "@agensy/context";
import { ICONS } from "@agensy/constants";

const defaultValues: ImportantPeopleInLifeFormData = {
  importantPeople: [],
  notesAndReminders: "",
};

export const ImportantPeopleInLife = () => {
  const params = useParams();
  const { setOpenedFileData, setHasUnsavedChanges } = useClientContext();
  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    watch,
    formState: { errors, isDirty },
  } = useForm<ImportantPeopleInLifeFormData>({
    resolver: zodResolver(importantPeopleInLifeFormSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "importantPeople",
  });

  const postImportantPeopleInLifeMutation =
    usePostImportantPeopleInLifeMutation();
  const queryClient = useQueryClient();
  const {
    data: importantPeopleInLifeData,
    isFetching: isLoadingImportantPeopleInLife,
    refetch,
  } = useGetImportantPeopleInLife(params.clientId!);

  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty, setHasUnsavedChanges]);

  useEffect(() => {
    return () => {
      setHasUnsavedChanges(false);
    };
  }, [setHasUnsavedChanges]);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (postImportantPeopleInLifeMutation.status === "success") {
      toast.success(
        "Important People in Life Successfully Updated",
        "Your client's important people in life has been saved and is now up to date."
      );
      queryClient.invalidateQueries({ queryKey: ["client", params.clientId] });
      setHasUnsavedChanges(false);
    } else if (postImportantPeopleInLifeMutation.status === "error") {
      toast.error(
        "Error Occurred",
        String(postImportantPeopleInLifeMutation.error)
      );
    }
  }, [postImportantPeopleInLifeMutation.status]);

  useEffect(() => {
    if (importantPeopleInLifeData) {
      const formData = {
        importantPeople: [
          ...(importantPeopleInLifeData.important_people.mpoa_name
            ? [
                {
                  type: "medical_poa",
                  name: importantPeopleInLifeData.important_people.mpoa_name,
                  phone:
                    importantPeopleInLifeData.important_people.mpoa_phone || "",
                  relationship:
                    importantPeopleInLifeData.important_people
                      .mpoa_relationship || "",
                },
              ]
            : []),

          ...(importantPeopleInLifeData.important_people.fpoa_name
            ? [
                {
                  type: "financial_poa",
                  name: importantPeopleInLifeData.important_people.fpoa_name,
                  phone:
                    importantPeopleInLifeData.important_people.fpoa_phone || "",
                  relationship:
                    importantPeopleInLifeData.important_people
                      .fpoa_relationship || "",
                },
              ]
            : []),

          ...(importantPeopleInLifeData.important_people.lawyer_name
            ? [
                {
                  type: "lawyer",
                  name: importantPeopleInLifeData.important_people.lawyer_name,
                  phone:
                    importantPeopleInLifeData.important_people.lawyer_phone ||
                    "",
                  firm:
                    importantPeopleInLifeData.important_people.lawyer_firm ||
                    "",
                },
              ]
            : []),

          ...(importantPeopleInLifeData.important_people.accountant_name
            ? [
                {
                  type: "accountant",
                  name: importantPeopleInLifeData.important_people
                    .accountant_name,
                  phone:
                    importantPeopleInLifeData.important_people
                      .accountant_phone || "",
                  firm:
                    importantPeopleInLifeData.important_people
                      .accountant_firm || "",
                },
              ]
            : []),

          ...(importantPeopleInLifeData.important_people.financial_advisor_name
            ? [
                {
                  type: "financial_advisor",
                  name: importantPeopleInLifeData.important_people
                    .financial_advisor_name,
                  phone:
                    importantPeopleInLifeData.important_people
                      .financial_advisor_phone || "",
                  firm:
                    importantPeopleInLifeData.important_people
                      .financial_advisor_firm || "",
                },
              ]
            : []),

          ...(importantPeopleInLifeData.important_people.trust_officer_name
            ? [
                {
                  type: "trust_officer",
                  name: importantPeopleInLifeData.important_people
                    .trust_officer_name,
                  phone:
                    importantPeopleInLifeData.important_people
                      .trust_officer_phone || "",
                  agency:
                    importantPeopleInLifeData.important_people
                      .trust_officer_agency || "",
                },
              ]
            : []),

          ...(importantPeopleInLifeData.important_people.emergency_contact_name
            ? [
                {
                  type: "emergency_contact_2",
                  name: importantPeopleInLifeData.important_people
                    .emergency_contact_name,
                  phone:
                    importantPeopleInLifeData.important_people
                      .emergency_contact_phone || "",
                  relationship:
                    importantPeopleInLifeData.important_people
                      .emergency_contact_relationship || "",
                },
              ]
            : []),

          ...(importantPeopleInLifeData.important_people.neighbor_name
            ? [
                {
                  type: "neighbor",
                  name: importantPeopleInLifeData.important_people
                    .neighbor_name,
                  phone:
                    importantPeopleInLifeData.important_people.neighbor_phone ||
                    "",
                  address:
                    importantPeopleInLifeData.important_people
                      .neighbor_address || "",
                },
              ]
            : []),

          ...(importantPeopleInLifeData.important_people.closest_friend_name
            ? [
                {
                  type: "close_friend",
                  name: importantPeopleInLifeData.important_people
                    .closest_friend_name,
                  phone:
                    importantPeopleInLifeData.important_people
                      .closest_friend_phone || "",
                  relationship:
                    importantPeopleInLifeData.important_people
                      .closest_friend_relationship || "",
                },
              ]
            : []),

          ...(importantPeopleInLifeData.important_people.faith_contact_name
            ? [
                {
                  type: "faith_contact",
                  name: importantPeopleInLifeData.important_people
                    .faith_contact_name,
                  phone:
                    importantPeopleInLifeData.important_people
                      .faith_contact_phone || "",
                  affiliation:
                    importantPeopleInLifeData.important_people
                      .faith_contact_affiliation || "",
                },
              ]
            : []),

          ...(importantPeopleInLifeData.important_people.club_group_name
            ? [
                {
                  type: "club_group",
                  name: importantPeopleInLifeData.important_people
                    .club_group_name,
                  phone:
                    importantPeopleInLifeData.important_people
                      .club_group_contact || "",
                },
              ]
            : []),

          ...(importantPeopleInLifeData.emergency_contact.first_name ||
          importantPeopleInLifeData.emergency_contact.last_name
            ? [
                {
                  type: "emergency_contact_1",
                  name: `${
                    importantPeopleInLifeData.emergency_contact.first_name || ""
                  } ${
                    importantPeopleInLifeData.emergency_contact.last_name || ""
                  }`.trim(),
                  phone:
                    importantPeopleInLifeData.emergency_contact.phone || "",
                  relationship:
                    importantPeopleInLifeData.emergency_contact.relationship ||
                    "",
                },
              ]
            : []),
        ],
        notesAndReminders:
          importantPeopleInLifeData.important_people.additional_notes || "",
      };
      reset(formData);
      setOpenedFileData({
        ...getValues(),
        last_update: {
          updatedAt: importantPeopleInLifeData?.last_update?.updatedAt || "",
        },
      } as unknown as OpenedFileData);
    }
  }, [importantPeopleInLifeData]);

  const onSubmit = (data: ImportantPeopleInLifeFormData) => {
    const postData: {
      emergency_contact: {
        first_name: string | null;
        last_name: string | null;
        phone: string | null;
        relationship: string | null;
      };
      important_people: {
        mpoa_name: string | null;
        mpoa_phone: string | null;
        mpoa_relationship: string | null;
        fpoa_name: string | null;
        fpoa_phone: string | null;
        fpoa_relationship: string | null;
        lawyer_name: string | null;
        lawyer_phone: string | null;
        lawyer_firm: string | null;
        accountant_name: string | null;
        accountant_phone: string | null;
        accountant_firm: string | null;
        financial_advisor_name: string | null;
        financial_advisor_phone: string | null;
        financial_advisor_firm: string | null;
        trust_officer_name: string | null;
        trust_officer_phone: string | null;
        trust_officer_agency: string | null;
        emergency_contact_name: string | null;
        emergency_contact_phone: string | null;
        emergency_contact_relationship: string | null;
        neighbor_name: string | null;
        neighbor_phone: string | null;
        neighbor_address: string | null;
        closest_friend_name: string | null;
        closest_friend_phone: string | null;
        closest_friend_relationship: string | null;
        faith_contact_name: string | null;
        faith_contact_phone: string | null;
        faith_contact_affiliation: string | null;
        club_group_name: string | null;
        club_group_contact: string | null;
        additional_notes: string | null;
      };
    } = {
      emergency_contact: {
        first_name: null,
        last_name: null,
        phone: null,
        relationship: null,
      },
      important_people: {
        mpoa_name: null,
        mpoa_phone: null,
        mpoa_relationship: null,
        fpoa_name: null,
        fpoa_phone: null,
        fpoa_relationship: null,
        lawyer_name: null,
        lawyer_phone: null,
        lawyer_firm: null,
        accountant_name: null,
        accountant_phone: null,
        accountant_firm: null,
        financial_advisor_name: null,
        financial_advisor_phone: null,
        financial_advisor_firm: null,
        trust_officer_name: null,
        trust_officer_phone: null,
        trust_officer_agency: null,
        emergency_contact_name: null,
        emergency_contact_phone: null,
        emergency_contact_relationship: null,
        neighbor_name: null,
        neighbor_phone: null,
        neighbor_address: null,
        closest_friend_name: null,
        closest_friend_phone: null,
        closest_friend_relationship: null,
        faith_contact_name: null,
        faith_contact_phone: null,
        faith_contact_affiliation: null,
        club_group_name: null,
        club_group_contact: null,
        additional_notes: data.notesAndReminders || null,
      },
    };

    data.importantPeople?.forEach((person) => {
      switch (person.type) {
        case "medical_poa":
          postData.important_people.mpoa_name = person.name || null;
          postData.important_people.mpoa_phone = person.phone || null;
          postData.important_people.mpoa_relationship =
            person.relationship || null;
          break;
        case "financial_poa":
          postData.important_people.fpoa_name = person.name || null;
          postData.important_people.fpoa_phone = person.phone || null;
          postData.important_people.fpoa_relationship =
            person.relationship || null;
          break;
        case "lawyer":
          postData.important_people.lawyer_name = person.name || null;
          postData.important_people.lawyer_phone = person.phone || null;
          postData.important_people.lawyer_firm = person.firm || null;
          break;
        case "accountant":
          postData.important_people.accountant_name = person.name || null;
          postData.important_people.accountant_phone = person.phone || null;
          postData.important_people.accountant_firm = person.firm || null;
          break;
        case "financial_advisor":
          postData.important_people.financial_advisor_name =
            person.name || null;
          postData.important_people.financial_advisor_phone =
            person.phone || null;
          postData.important_people.financial_advisor_firm =
            person.firm || null;
          break;
        case "trust_officer":
          postData.important_people.trust_officer_name = person.name || null;
          postData.important_people.trust_officer_phone = person.phone || null;
          postData.important_people.trust_officer_agency =
            person.agency || null;
          break;
        case "emergency_contact_1":
          postData.emergency_contact.first_name =
            (person.name || "").split(" ")[0] || null;
          postData.emergency_contact.last_name =
            (person.name || "").split(" ").slice(1).join(" ") || null;
          postData.emergency_contact.phone = person.phone || null;
          postData.emergency_contact.relationship = person.relationship || null;
          break;
        case "emergency_contact_2":
          postData.important_people.emergency_contact_name =
            person.name || null;
          postData.important_people.emergency_contact_phone =
            person.phone || null;
          postData.important_people.emergency_contact_relationship =
            person.relationship || null;
          break;
        case "neighbor":
          postData.important_people.neighbor_name = person.name || null;
          postData.important_people.neighbor_phone = person.phone || null;
          postData.important_people.neighbor_address = person.address || null;
          break;
        case "close_friend":
          postData.important_people.closest_friend_name = person.name || null;
          postData.important_people.closest_friend_phone = person.phone || null;
          postData.important_people.closest_friend_relationship =
            person.relationship || null;
          break;
        case "faith_contact":
          postData.important_people.faith_contact_name = person.name || null;
          postData.important_people.faith_contact_phone = person.phone || null;
          postData.important_people.faith_contact_affiliation =
            person.affiliation || null;
          break;
        case "club_group":
          postData.important_people.club_group_name = person.name || null;
          postData.important_people.club_group_contact = person.phone || null;
          break;
      }
    });

    postImportantPeopleInLifeMutation.mutate({
      clientId: params.clientId!,
      data: postData,
    });
  };

  const addNewPerson = () => {
    append({
      type: "",
      name: "",
      phone: "",
      relationship: "",
      firm: "",
      agency: "",
      affiliation: "",
      address: "",
    });
  };

  if (isLoadingImportantPeopleInLife)
    return (
      <div className="flex justify-center items-center h-screen">
        <CommonLoader />
      </div>
    );

  return (
    <div className="bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card
          title="Important People in Life"
          className="mb-6"
          buttonText={<ICONS.plus size={16} />}
          onButtonClick={addNewPerson}
          ariaLabel="Add Important Person"
          showButton={true}
        >
          <div className="space-y-6">
            {fields.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No important people added yet.</p>
                <p className="text-sm">
                  Click the + button above to add your first contact.
                </p>
              </div>
            ) : (
              fields.map((field, index) => (
                <ImportantPersonCard
                  key={field.id}
                  register={register}
                  errors={errors}
                  watch={watch}
                  index={index}
                  onRemove={remove}
                  control={control}
                  canRemove={fields.length > 1}
                />
              ))
            )}
          </div>
        </Card>

        <Card title="Notes and Reminders" className="mb-6">
          <TextArea
            label="Notes and Reminders"
            register={register("notesAndReminders")}
            error={errors.notesAndReminders?.message as string}
          />
        </Card>

        <div className="bg-basicWhite/90 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-all duration-300 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-end gap-4 p-6">
            <PrimaryButton
              type="submit"
              className="sm:!w-fit w-full md:text-base text-sm"
              onClick={handleSubmit(onSubmit)}
              isLoading={postImportantPeopleInLifeMutation.isPending}
              disabled={postImportantPeopleInLifeMutation.isPending}
            >
              Save Important People in Life
            </PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
};
