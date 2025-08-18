import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CommonLoader, PrimaryButton } from "@agensy/components";
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FlatFormData = { [key: string]: any };

const defaultValues: VitalsTrackerFormData = {
  date1: "",
  date2: "",
  date3: "",
  date4: "",
  date5: "",
  date6: "",
  date7: "",
  date8: "",
  date9: "",
  date10: "",
  date11: "",
  date12: "",

  id1: "",
  id2: "",
  id3: "",
  id4: "",
  id5: "",
  id6: "",
  id7: "",
  id8: "",
  id9: "",
  id10: "",
  id11: "",
  id12: "",

  heartRate1: "",
  heartRate2: "",
  heartRate3: "",
  heartRate4: "",
  heartRate5: "",
  heartRate6: "",
  heartRate7: "",
  heartRate8: "",
  heartRate9: "",
  heartRate10: "",
  heartRate11: "",
  heartRate12: "",

  oxygen1: "",
  oxygen2: "",
  oxygen3: "",
  oxygen4: "",
  oxygen5: "",
  oxygen6: "",
  oxygen7: "",
  oxygen8: "",
  oxygen9: "",
  oxygen10: "",
  oxygen11: "",
  oxygen12: "",

  bloodPressure1: "",
  bloodPressure2: "",
  bloodPressure3: "",
  bloodPressure4: "",
  bloodPressure5: "",
  bloodPressure6: "",
  bloodPressure7: "",
  bloodPressure8: "",
  bloodPressure9: "",
  bloodPressure10: "",
  bloodPressure11: "",
  bloodPressure12: "",

  bloodType1: "",
  bloodType2: "",
  bloodType3: "",
  bloodType4: "",
  bloodType5: "",
  bloodType6: "",
  bloodType7: "",
  bloodType8: "",
  bloodType9: "",
  bloodType10: "",
  bloodType11: "",
  bloodType12: "",

  temperature1: "",
  temperature2: "",
  temperature3: "",
  temperature4: "",
  temperature5: "",
  temperature6: "",
  temperature7: "",
  temperature8: "",
  temperature9: "",
  temperature10: "",
  temperature11: "",
  temperature12: "",

  weight1: "",
  weight2: "",
  weight3: "",
  weight4: "",
  weight5: "",
  weight6: "",
  weight7: "",
  weight8: "",
  weight9: "",
  weight10: "",
  weight11: "",
  weight12: "",

  height1: "",
  height2: "",
  height3: "",
  height4: "",
  height5: "",
  height6: "",

  height7: "",
  height8: "",
  height9: "",
  height10: "",
  height11: "",
  height12: "",

  other1_1: "",
  other1_2: "",
  other1_3: "",
  other1_4: "",
  other1_5: "",
  other1_6: "",
  other1_7: "",
  other1_8: "",
  other1_9: "",
  other1_10: "",
  other1_11: "",
  other1_12: "",
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapVitalsToFormData = (vitals: any[]): VitalsTrackerFormData => {
    const formData: FlatFormData = {};

    for (let i = 0; i < 12; i++) {
      const item = vitals[i];

      const idx = item?.index;

      console.log(item?.index);

      formData[`date${idx}`] = DateUtils.formatDateToRequiredFormat(
        item?.date ?? ""
      );
      formData[`heartRate${idx}`] = item?.heart_rate ?? "";
      formData[`oxygen${idx}`] = item?.oxygen_saturation ?? "";
      formData[`bloodPressure${idx}`] = item?.blood_pressure ?? "";
      formData[`bloodType${idx}`] = item?.blood_type ?? "";
      formData[`temperature${idx}`] = item?.temperature ?? "";
      formData[`weight${idx}`] = item?.weight ?? "";
      formData[`height${idx}`] = item?.height ?? "";
      formData[`other1_${idx}`] = item?.other_vital_signs ?? "";
      formData[`id${idx}`] = item?.id ?? null;
    }

    return formData;
  };

  const mapFormDataToVitals = (formData: FlatFormData): Vital[] => {
    const vitals: Vital[] = [];

    for (let i = 1; i <= 12; i++) {
      const date = formData[`date${i}`];
      const heartRate = formData[`heartRate${i}`];
      const bloodPressure = formData[`bloodPressure${i}`];
      const temperature = formData[`temperature${i}`];
      const weight = formData[`weight${i}`];
      const height = formData[`height${i}`];
      const oxygen = formData[`oxygen${i}`];
      const bloodType = formData[`bloodType${i}`];
      const other = formData[`other1_${i}`];
      const id = formData[`id${i}`];
      const index = i;

      if (
        date ||
        heartRate ||
        bloodPressure ||
        temperature ||
        weight ||
        height ||
        oxygen ||
        bloodType ||
        other ||
        id
      ) {
        const item = {
          id: id ? id : null,
          date: date ? DateUtils.changetoISO(date) : null,
          heart_rate: heartRate ? heartRate : null,
          blood_pressure: bloodPressure ? bloodPressure : null,
          temperature: temperature ? temperature : null,
          weight: weight ? weight : null,
          height: height ? height : null,
          oxygen_saturation: oxygen ? oxygen : null,
          blood_type: bloodType ? bloodType : null,
          other_vital_signs: other ? other : null,
          index: index ? index : null,
        };
        if (!item.id) {
          delete item.id;
        }
        vitals.push(item);
      }
    }

    return vitals;
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
    { key: "height", label: "Height", type: "number", placeholder: "inches" },
    {
      key: "other1",
      label: "Other",
      type: "text",
      placeholder: "Additional info",
    },
  ];

  const firstTableColumns = [1, 2, 3, 4, 5, 6];
  const secondTableColumns = [7, 8, 9, 10, 11, 12];

  if (isLoadingVitals)
    return (
      <div className="flex justify-center items-center h-screen">
        <CommonLoader />
      </div>
    );

  return (
    <div className="bg-gray-50 w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card title="Vitals Tracker" className="mb-6">
          <div className="flex flex-col gap-5">
            <VitalsTrackerTable
              columns={firstTableColumns}
              errors={errors}
              vitalsFields={vitalsFields}
              register={register}
              control={control}
            />
            <VitalsTrackerTable
              columns={secondTableColumns}
              errors={errors}
              vitalsFields={vitalsFields}
              register={register}
              control={control}
            />
          </div>
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
