import { useForm } from "react-hook-form";
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

const defaultValues: ImportantPeopleInLifeFormData = {
  medicalPOAName: "",
  medicalPOAPhone: "",
  medicalPOARelationship: "",

  financialPOAName: "",
  financialPOAPhone: "",
  financialPOARelationship: "",

  lawyerName: "",
  lawyerPhone: "",
  lawyerFirm: "",

  accountantName: "",
  accountantPhone: "",
  accountantFirm: "",

  financialAdvisorName: "",
  financialAdvisorPhone: "",
  financialAdvisorFirm: "",

  trustOfficerAgency: "",
  trustOfficerName: "",
  trustOfficerPhone: "",

  emergencyContactOneName: "",
  emergencyContactOnePhone: "",
  emergencyContactOneRelationship: "",

  emergencyContactTwoName: "",
  emergencyContactTwoPhone: "",
  emergencyContactTwoRelationship: "",

  neighborName: "",
  neighborPhone: "",
  neighborAddress: "",

  closeFriendName: "",
  closeFriendPhone: "",
  closeFriendRelationship: "",

  faithContactName: "",
  faithContactPhone: "",
  faithContactAffiliation: "",

  clubName: "",
  clubPhone: "",

  notesAndReminders: "",
};

export const ImportantPeopleInLife = () => {
  const params = useParams();
  const { setOpenedFileData } = useClientContext();
  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<ImportantPeopleInLifeFormData>({
    resolver: zodResolver(importantPeopleInLifeFormSchema),
    defaultValues,
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
    refetch();
  }, []);

  useEffect(() => {
    if (postImportantPeopleInLifeMutation.status === "success") {
      toast.success(
        "Important People in Life Successfully Updated",
        "Your client's important people in life has been saved and is now up to date."
      );
      queryClient.invalidateQueries({ queryKey: ["client", params.clientId] });
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
        medicalPOAName:
          importantPeopleInLifeData.important_people.mpoa_name || "",
        medicalPOAPhone:
          importantPeopleInLifeData.important_people.mpoa_phone || "",
        medicalPOARelationship:
          importantPeopleInLifeData.important_people.mpoa_relationship || "",
        financialPOAName:
          importantPeopleInLifeData.important_people.fpoa_name || "",
        financialPOAPhone:
          importantPeopleInLifeData.important_people.fpoa_phone || "",
        financialPOARelationship:
          importantPeopleInLifeData.important_people.fpoa_relationship || "",
        lawyerName:
          importantPeopleInLifeData.important_people.lawyer_name || "",
        lawyerPhone:
          importantPeopleInLifeData.important_people.lawyer_phone || "",
        lawyerFirm:
          importantPeopleInLifeData.important_people.lawyer_firm || "",
        accountantName:
          importantPeopleInLifeData.important_people.accountant_name || "",
        accountantPhone:
          importantPeopleInLifeData.important_people.accountant_phone || "",
        accountantFirm:
          importantPeopleInLifeData.important_people.accountant_firm || "",
        financialAdvisorName:
          importantPeopleInLifeData.important_people.financial_advisor_name ||
          "",
        financialAdvisorPhone:
          importantPeopleInLifeData.important_people.financial_advisor_phone ||
          "",
        financialAdvisorFirm:
          importantPeopleInLifeData.important_people.financial_advisor_firm ||
          "",
        trustOfficerName:
          importantPeopleInLifeData.important_people.trust_officer_name || "",
        trustOfficerPhone:
          importantPeopleInLifeData.important_people.trust_officer_phone || "",
        trustOfficerAgency:
          importantPeopleInLifeData.important_people.trust_officer_agency || "",
        emergencyContactTwoName:
          importantPeopleInLifeData.important_people.emergency_contact_name ||
          "",
        emergencyContactTwoPhone:
          importantPeopleInLifeData.important_people.emergency_contact_phone ||
          "",
        emergencyContactTwoRelationship:
          importantPeopleInLifeData.important_people
            .emergency_contact_relationship || "",
        neighborName:
          importantPeopleInLifeData.important_people.neighbor_name || "",
        neighborPhone:
          importantPeopleInLifeData.important_people.neighbor_phone || "",
        neighborAddress:
          importantPeopleInLifeData.important_people.neighbor_address || "",
        closeFriendName:
          importantPeopleInLifeData.important_people.closest_friend_name || "",
        closeFriendPhone:
          importantPeopleInLifeData.important_people.closest_friend_phone || "",
        closeFriendRelationship:
          importantPeopleInLifeData.important_people
            .closest_friend_relationship || "",
        faithContactName:
          importantPeopleInLifeData.important_people.faith_contact_name || "",
        faithContactPhone:
          importantPeopleInLifeData.important_people.faith_contact_phone || "",
        faithContactAffiliation:
          importantPeopleInLifeData.important_people
            .faith_contact_affiliation || "",
        clubName:
          importantPeopleInLifeData.important_people.club_group_name || "",
        clubPhone:
          importantPeopleInLifeData.important_people.club_group_contact || "",
        notesAndReminders:
          importantPeopleInLifeData.important_people.additional_notes || "",
        emergencyContactOneName: importantPeopleInLifeData.emergency_contact
          .first_name
          ? importantPeopleInLifeData.emergency_contact.first_name
          : "" + " " + importantPeopleInLifeData.emergency_contact.last_name
          ? importantPeopleInLifeData.emergency_contact.last_name
          : "",
        emergencyContactOnePhone:
          importantPeopleInLifeData.emergency_contact.phone || "",
        emergencyContactOneRelationship:
          importantPeopleInLifeData.emergency_contact.relationship || "",
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
    const postData = {
      emergency_contact: {
        first_name: data.emergencyContactOneName
          ? data.emergencyContactOneName.split(" ").length > 0
            ? data.emergencyContactOneName.split(" ")?.[0]
            : null
          : null,
        last_name: data.emergencyContactOneName
          ? data.emergencyContactOneName.split(" ").length > 0
            ? data.emergencyContactOneName.split(" ")?.[1]
            : null
          : null,
        phone: data.emergencyContactOnePhone
          ? data.emergencyContactOnePhone
          : null,
        relationship: data.emergencyContactOneRelationship
          ? data.emergencyContactOneRelationship
          : null,
      },
      important_people: {
        mpoa_name: data.medicalPOAName ? data.medicalPOAName : null,
        mpoa_phone: data.medicalPOAPhone ? data.medicalPOAPhone : null,
        mpoa_relationship: data.medicalPOARelationship
          ? data.medicalPOARelationship
          : null,

        fpoa_name: data.financialPOAName ? data.financialPOAName : null,
        fpoa_phone: data.financialPOAPhone ? data.financialPOAPhone : null,
        fpoa_relationship: data.financialPOARelationship
          ? data.financialPOARelationship
          : null,

        lawyer_name: data.lawyerName ? data.lawyerName : null,
        lawyer_phone: data.lawyerPhone ? data.lawyerPhone : null,
        lawyer_firm: data.lawyerFirm ? data.lawyerFirm : null,

        accountant_name: data.accountantName ? data.accountantName : null,
        accountant_phone: data.accountantPhone ? data.accountantPhone : null,
        accountant_firm: data.accountantFirm ? data.accountantFirm : null,

        financial_advisor_name: data.financialAdvisorName
          ? data.financialAdvisorName
          : null,
        financial_advisor_phone: data.financialAdvisorPhone
          ? data.financialAdvisorPhone
          : null,
        financial_advisor_firm: data.financialAdvisorFirm
          ? data.financialAdvisorFirm
          : null,

        trust_officer_name: data.trustOfficerName
          ? data.trustOfficerName
          : null,
        trust_officer_phone: data.trustOfficerPhone
          ? data.trustOfficerPhone
          : null,
        trust_officer_agency: data.trustOfficerAgency
          ? data.trustOfficerAgency
          : null,

        emergency_contact_name: data.emergencyContactOneName
          ? data.emergencyContactOneName
          : null,
        emergency_contact_phone: data.emergencyContactOnePhone
          ? data.emergencyContactOnePhone
          : null,
        emergency_contact_relationship: data.emergencyContactOneRelationship
          ? data.emergencyContactOneRelationship
          : null,

        neighbor_name: data.neighborName ? data.neighborName : null,
        neighbor_phone: data.neighborPhone ? data.neighborPhone : null,
        neighbor_address: data.neighborAddress ? data.neighborAddress : null,

        closest_friend_name: data.closeFriendName ? data.closeFriendName : null,
        closest_friend_phone: data.closeFriendPhone
          ? data.closeFriendPhone
          : null,
        closest_friend_relationship: data.closeFriendRelationship
          ? data.closeFriendRelationship
          : null,

        faith_contact_name: data.faithContactName
          ? data.faithContactName
          : null,
        faith_contact_phone: data.faithContactPhone
          ? data.faithContactPhone
          : null,
        faith_contact_affiliation: data.faithContactAffiliation
          ? data.faithContactAffiliation
          : null,

        club_group_name: data.clubName ? data.clubName : null,
        club_group_contact: data.clubPhone ? data.clubPhone : null,

        additional_notes: data.notesAndReminders
          ? data.notesAndReminders
          : null,
      },
    };
    postImportantPeopleInLifeMutation.mutate({
      clientId: params.clientId!,
      data: postData,
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
        <Card title="Medical Power of Attorney" className="mb-6">
          <ImportantPersonCard
            register={register}
            control={control}
            errors={errors}
            nameField="medicalPOAName"
            phoneField="medicalPOAPhone"
            relationshipField="medicalPOARelationship"
            relationshipLabel="Relationship"
          />
        </Card>

        <Card title="Financial Power of Attorney" className="mb-6">
          <ImportantPersonCard
            register={register}
            control={control}
            errors={errors}
            nameField="financialPOAName"
            phoneField="financialPOAPhone"
            relationshipField="financialPOARelationship"
            relationshipLabel="Relationship"
          />
        </Card>

        <Card title="Lawyer" className="mb-6">
          <ImportantPersonCard
            register={register}
            control={control}
            errors={errors}
            nameField="lawyerName"
            phoneField="lawyerPhone"
            relationshipField="lawyerFirm"
            relationshipLabel="Firm"
          />
        </Card>

        <Card title="Accountant or Tax Preparer" className="mb-6">
          <ImportantPersonCard
            register={register}
            control={control}
            errors={errors}
            nameField="accountantName"
            phoneField="accountantPhone"
            relationshipField="accountantFirm"
            relationshipLabel="Firm"
          />
        </Card>

        <Card title="Financial Advisor" className="mb-6">
          <ImportantPersonCard
            register={register}
            control={control}
            errors={errors}
            nameField="financialAdvisorName"
            phoneField="financialAdvisorPhone"
            relationshipField="financialAdvisorFirm"
            relationshipLabel="Firm"
          />
        </Card>

        <Card title="Emergency Contact #1" className="mb-6">
          <ImportantPersonCard
            register={register}
            control={control}
            errors={errors}
            nameField="emergencyContactOneName"
            phoneField="emergencyContactOnePhone"
            relationshipField="emergencyContactOneRelationship"
            relationshipLabel="Relationship"
          />
        </Card>

        <Card title="Emergency Contact #2" className="mb-6">
          <ImportantPersonCard
            register={register}
            control={control}
            errors={errors}
            nameField="emergencyContactTwoName"
            phoneField="emergencyContactTwoPhone"
            relationshipField="emergencyContactTwoRelationship"
            relationshipLabel="Relationship"
          />
        </Card>

        <Card title="Neighbor" className="mb-6">
          <ImportantPersonCard
            register={register}
            control={control}
            errors={errors}
            nameField="neighborName"
            phoneField="neighborPhone"
            relationshipField="neighborAddress"
            relationshipLabel="Address"
          />
        </Card>

        <Card title="Close Friend or Relative" className="mb-6">
          <ImportantPersonCard
            register={register}
            control={control}
            errors={errors}
            nameField="closeFriendName"
            phoneField="closeFriendPhone"
            relationshipField="closeFriendRelationship"
            relationshipLabel="Relationship"
          />
        </Card>

        <Card title="Faith or Spiritual Contact" className="mb-6">
          <ImportantPersonCard
            register={register}
            control={control}
            errors={errors}
            nameField="faithContactName"
            phoneField="faithContactPhone"
            relationshipField="faithContactAffiliation"
            relationshipLabel="Affiliation"
          />
        </Card>

        <Card title="Club or Group" className="mb-6">
          <ImportantPersonCard
            register={register}
            control={control}
            errors={errors}
            nameField="clubName"
            phoneField="clubPhone"
          />
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
