import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CommonLoader, PrimaryButton } from "@agensy/components";
import { ICONS } from "@agensy/constants";
import {
  vitalsTrackerFormSchema,
  type OpenedFileData,
  type Vital,
  type VitalsTrackerFormData,
} from "@agensy/types";
import { VitalsTrackerTable } from "./VitalsTrackerTable";
import { useParams } from "react-router-dom";
import { useGetVitalsTracker, usePostVitalsTracker } from "@agensy/api";
import { useEffect } from "react";
import { DateUtils, toast } from "@agensy/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useClientContext } from "@agensy/context";

const defaultValues: VitalsTrackerFormData = {
  vitals: [],
};

export const VitalsTracker = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  const { setOpenedFileData } = useClientContext();

  const {
    data: vitalsTrackerData,
    isFetching: isLoadingVitals,
    refetch,
  } = useGetVitalsTracker(params.clientId!);
  const postVitalsTrackerMutation = usePostVitalsTracker();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<VitalsTrackerFormData>({
    resolver: zodResolver(vitalsTrackerFormSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "vitals",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapVitalsToFormData = (vitals: any[]): VitalsTrackerFormData => {
    const formData: VitalsTrackerFormData = {
      vitals: vitals.map((item) => ({
        date: item?.date ? DateUtils.formatDateToRequiredFormat(item.date) : "",
        heartRate: item?.heart_rate || "",
        oxygen: item?.oxygen_saturation || "",
        bloodPressure: item?.blood_pressure || "",
        bloodType: item?.blood_type || "",
        temperature: item?.temperature || "",
        weight: item?.weight || "",
        height: item?.height || "",
        other: item?.other_vital_signs || "",
        id: item?.id ? String(item.id) : null,
      })),
    };

    return formData;
  };

  const mapFormDataToVitals = (formData: VitalsTrackerFormData): Vital[] => {
    const vitals: Vital[] = [];

    formData.vitals?.forEach((vital) => {
      if (
        vital.date ||
        vital.heartRate ||
        vital.bloodPressure ||
        vital.temperature ||
        vital.weight ||
        vital.height ||
        vital.oxygen ||
        vital.bloodType ||
        vital.other ||
        vital.id
      ) {
        const item: Vital = {
          id: vital.id ? String(vital.id) : null,
          date: vital.date ? DateUtils.changetoISO(vital.date) : null,
          heart_rate: vital.heartRate ? vital.heartRate : null,
          blood_pressure: vital.bloodPressure ? vital.bloodPressure : null,
          temperature: vital.temperature ? vital.temperature : null,
          weight: vital.weight ? vital.weight : null,
          height: vital.height ? vital.height : null,
          oxygen_saturation: vital.oxygen ? vital.oxygen : null,
          blood_type: vital.bloodType ? vital.bloodType : null,
          other_vital_signs: vital.other ? vital.other : null,
        };
        if (!item.id) {
          delete item.id;
        }
        vitals.push(item);
      }
    });

    return vitals;
  };

  const handleAddRow = () => {
    append({
      date: "",
      heartRate: "",
      oxygen: "",
      bloodPressure: "",
      bloodType: "",
      temperature: "",
      weight: "",
      height: "",
      other: "",
      id: null,
    });
  };

  const handleDeleteRow = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  useEffect(() => {
    if (postVitalsTrackerMutation.status === "success") {
      toast.success(
        "Vitals Tracker Successfully Updated",
        "Your client's vitals tracker has been saved and is now up to date."
      );
      queryClient.invalidateQueries({ queryKey: ["client", params.clientId] });
    } else if (postVitalsTrackerMutation.status === "error") {
      toast.error("Error Occurred", String(postVitalsTrackerMutation.error));
    }
  }, [postVitalsTrackerMutation.status]);

  useEffect(() => {
    if (vitalsTrackerData) {
      const formData = mapVitalsToFormData(vitalsTrackerData.vitals_tracker);
      reset(formData);
      setOpenedFileData({
        ...getValues(),
        last_update: {
          updatedAt: vitalsTrackerData?.last_update?.updatedAt || "",
        },
      } as unknown as OpenedFileData);
    }
  }, [vitalsTrackerData]);

  useEffect(() => {
    refetch();
  }, []);

  const onSubmit = (data: VitalsTrackerFormData) => {
    const postData = mapFormDataToVitals(data);
    console.log(postData);
    postVitalsTrackerMutation.mutate({
      clientId: params.clientId!,
      data: {
        vitals: postData,
      },
    });
  };

  const vitalsFields = [
    { key: "date", label: "Date", type: "date" },
    {
      key: "heartRate",
      label: "Heart Rate",
      type: "number",
      placeholder: "bpm",
    },
    { key: "oxygen", label: "Oxygen", type: "number", placeholder: "%" },
    {
      key: "bloodPressure",
      label: "Blood Pressure",
      type: "text",
      placeholder: "mmHg",
    },
    {
      key: "bloodType",
      label: "Blood Type",
      type: "text",
      placeholder: "A+, B-, etc.",
    },
    {
      key: "temperature",
      label: "Temperature",
      type: "number",
      placeholder: "°F",
    },
    { key: "weight", label: "Weight", type: "number", placeholder: "lbs" },
    { key: "height", label: "Height", type: "text", placeholder: "ft'in\"" },
    {
      key: "other",
      label: "Other",
      type: "text",
      placeholder: "Additional info",
    },
  ];

  const handleHeightChange = (rowIndex: number, value: string) => {
    const updatedFields = [...fields];
    updatedFields[rowIndex] = {
      ...updatedFields[rowIndex],
      height: value,
    };

    const currentValues = getValues();
    if (currentValues.vitals && currentValues.vitals[rowIndex]) {
      currentValues.vitals[rowIndex].height = value;
      reset(currentValues);
    }
  };

  if (isLoadingVitals)
    return (
      <div className="flex justify-center items-center h-screen">
        <CommonLoader />
      </div>
    );

  return (
    <div className="bg-gray-50 w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card
          title="Vitals Tracker"
          buttonText={<ICONS.plus size={16} />}
          onButtonClick={handleAddRow}
          ariaLabel="Add Vitals Entry"
          showButton={true}
          className="mb-6"
        >
          <VitalsTrackerTable
            fields={fields}
            errors={errors}
            vitalsFields={vitalsFields}
            register={register}
            control={control}
            onDeleteRow={handleDeleteRow}
            onHeightChange={handleHeightChange}
          />
        </Card>

        <div className="bg-basicWhite/90 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-all duration-300 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-end gap-4 p-6">
            <PrimaryButton
              type="submit"
              isLoading={postVitalsTrackerMutation.isPending}
              disabled={postVitalsTrackerMutation.isPending}
              className="sm:!w-fit w-full md:text-base text-sm"
            >
              Save Vitals
            </PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
};
