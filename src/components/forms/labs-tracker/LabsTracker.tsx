import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CommonLoader, PrimaryButton } from "@agensy/components";
import { ICONS } from "@agensy/constants";
import {
  labsTrackerFormSchema,
  type LabsTrackerFormData,
  type OpenedFileData,
} from "@agensy/types";
import { LabsTrackerCard } from "./LabsTrackerCard";
import { useGetLabsTracker, usePostLabsTracker } from "@agensy/api";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { DateUtils, toast } from "@agensy/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useClientContext } from "@agensy/context";

const defaultValues: LabsTrackerFormData = {
  labs: [],
};

export const LabsTracker = () => {
  const params = useParams();
  const { setOpenedFileData } = useClientContext();
  const {
    data: labsTrackerData,
    isFetching: isLoadingLabs,
    refetch,
  } = useGetLabsTracker(params.clientId!);
  const queryClient = useQueryClient();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<LabsTrackerFormData>({
    resolver: zodResolver(labsTrackerFormSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "labs",
  });

  const postLabsTracker = usePostLabsTracker();

  useEffect(() => {
    if (postLabsTracker.status === "success") {
      toast.success(
        "Labs Tests Tracker Successfully Updated",
        "Your client's labs test tracker has been saved and is now up to date."
      );
      queryClient.invalidateQueries({ queryKey: ["client", params.clientId] });
    } else if (postLabsTracker.status === "error") {
      toast.error("Error Occurred", String(postLabsTracker.error));
    }
  }, [postLabsTracker.status]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapLabsToFormData = (labs: any[]) => {
    if (!labs || labs.length === 0) {
      return { labs: [] };
    }

    const mappedLabs = labs.map((item) => ({
      date: DateUtils.formatDateToRequiredFormat(item?.date ?? ""),
      doctorName: item?.doctor_name ?? "",
      type: item?.type ?? "",
      providerCompanyUsed: item?.provider_company ?? "",
      purpose: item?.purpose ?? "",
      results: item?.results ?? "",
      id: item?.id ?? "",
    }));

    return { labs: mappedLabs };
  };

  const mapFormDataToVitals = (formData: LabsTrackerFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const labs: any[] = [];

    if (formData.labs && formData.labs.length > 0) {
      formData.labs.forEach((lab, index) => {
        if (
          lab.date ||
          lab.doctorName ||
          lab.type ||
          lab.purpose ||
          lab.providerCompanyUsed ||
          lab.results ||
          lab.id
        ) {
          const item = {
            id: lab.id ? lab.id : null,
            date: lab.date ? DateUtils.changetoISO(lab.date) : null,
            doctor_name: lab.doctorName ? lab.doctorName : null,
            type: lab.type ? lab.type : null,
            provider_company: lab.providerCompanyUsed
              ? lab.providerCompanyUsed
              : null,
            purpose: lab.purpose ? lab.purpose : null,
            results: lab.results ? lab.results : null,
            index: index + 1,
          };
          if (!item.id) {
            // @ts-expect-error // fix this
            delete item.id;
          }
          labs.push(item);
        }
      });
    }

    return labs;
  };

  const addNewLab = () => {
    append({
      date: "",
      doctorName: "",
      type: "",
      providerCompanyUsed: "",
      purpose: "",
      results: "",
      id: "",
    });
  };

  useEffect(() => {
    if (labsTrackerData) {
      const formData = mapLabsToFormData(
        labsTrackerData?.labs_tests_imaging_tracker
      );
      reset(formData);

      setOpenedFileData({
        ...getValues(),
        last_update: {
          updatedAt: labsTrackerData?.last_update?.updatedAt || "",
        },
      } as unknown as OpenedFileData);
    }
  }, [labsTrackerData]);

  useEffect(() => {
    refetch();
  }, []);

  const onSubmit = (data: LabsTrackerFormData) => {
    postLabsTracker.mutate({
      data: { labs_tests_imaging_trackers: mapFormDataToVitals(data) },
      clientId: params.clientId!,
    });
  };

  if (isLoadingLabs)
    return (
      <div className="flex justify-center items-center h-screen">
        <CommonLoader />
      </div>
    );

  return (
    <div className="bg-gray-50 w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card
          title="Labs Tracker"
          className="mb-6"
          buttonText={<ICONS.plus size={16} />}
          onButtonClick={addNewLab}
          ariaLabel="Add New Lab Test"
          showButton={true}
        >
          <div className="space-y-6">
            {fields.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No lab tests added yet.</p>
                <p className="text-sm">
                  Click the + button above to add your first lab test.
                </p>
              </div>
            ) : (
              fields.map((field, index) => (
                <LabsTrackerCard
                  key={field.id}
                  register={register}
                  errors={errors}
                  index={index}
                  control={control}
                  onRemove={() => remove(index)}
                  canRemove={fields.length > 1}
                />
              ))
            )}
          </div>
        </Card>

        <div className="bg-basicWhite/90 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-all duration-300 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-end gap-4 p-6">
            <PrimaryButton
              type="submit"
              isLoading={postLabsTracker.isPending}
              disabled={postLabsTracker.isPending}
              className="sm:!w-fit w-full md:text-base text-sm"
            >
              Save Labs Tracker
            </PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
};
