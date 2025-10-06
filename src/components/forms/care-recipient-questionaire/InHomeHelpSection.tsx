import type {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
  Control,
  UseFormSetValue,
  PathValue as PathValueImpl,
} from "react-hook-form";
import { useWatch } from "react-hook-form";
import { Input, Card, RadioInput } from "@agensy/components";

interface InHomeHelpSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  errors: FieldErrors<T>;
}

export const InHomeHelpSection = <T extends FieldValues>({
  register,
  control,
  setValue,
  errors,
}: InHomeHelpSectionProps<T>) => {
  const livingEnvironmentType =
    useWatch({
      control,
      name: "livingEnvironmentType" as Path<T>,
    }) || [];

  const services = [
    {
      name: "houseCleaning",
      label: "House cleaning",
      agencyField: "houseCleaningAgency" as Path<T>,
      satisfactionField: "houseCleaningSatisfaction" as Path<T>,
      frequencyField: "houseCleaningFrequency" as Path<T>,
    },
    {
      name: "homeAid",
      label: "Home aid(s)",
      agencyField: "homeAidAgency" as Path<T>,
      satisfactionField: "homeAidSatisfaction" as Path<T>,
      frequencyField: "homeAidFrequency" as Path<T>,
    },
    {
      name: "homeHealth",
      label: "Home Health",
      agencyField: "homeHealthAgency" as Path<T>,
      satisfactionField: "homeHealthSatisfaction" as Path<T>,
      frequencyField: "homeHealthFrequency" as Path<T>,
    },
    {
      name: "maintenance",
      label: "Maintenance",
      agencyField: "maintenanceAgency" as Path<T>,
      satisfactionField: "maintenanceSatisfaction" as Path<T>,
      frequencyField: "maintenanceFrequency" as Path<T>,
    },
    {
      name: "otherHelp",
      label: "Other",
      agencyField: "otherHelpAgency" as Path<T>,
      satisfactionField: "otherHelpSatisfaction" as Path<T>,
      frequencyField: "otherHelpFrequency" as Path<T>,
    },
  ];

  return (
    <Card title="List in-home help, phone, and degree of satisfaction">
      <div className="space-y-6">
        {/* In-Home Help Services Table */}
        <div className="space-y-3">
          {/* Table Header */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-6 font-medium text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
            <div className="text-center lg:text-left">Phone/Agency</div>
            <div className="text-center">Satisfaction</div>
            <div className="text-center">Frequency</div>
          </div>

          {/* Service Rows */}
          {services.map((service) => (
            <div
              key={service.name}
              className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-6 items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50/50 transition-colors"
            >
              {/* Agency/Phone Field */}
              <div className="lg:order-1">
                <Input
                  register={register(service.agencyField)}
                  error={errors[service.agencyField]?.message as string}
                  label={service.label}
                />
              </div>

              {/* Satisfaction Radio Buttons */}
              <div className="lg:order-2 space-y-2">
                <div className="lg:hidden text-xs font-medium text-gray-600 mb-1">
                  Satisfaction
                </div>
                <div className="flex justify-center gap-3">
                  {["High", "Medium", "Low"].map((satisfaction) => (
                    <RadioInput
                      key={satisfaction}
                      label={satisfaction}
                      value={satisfaction}
                      register={register(service.satisfactionField)}
                      className="text-xs"
                    />
                  ))}
                </div>
              </div>

              {/* Frequency Radio Buttons */}
              <div className="lg:order-3 space-y-2">
                <div className="lg:hidden text-xs font-medium text-gray-600 mb-1">
                  Frequency
                </div>
                <div className="flex justify-center gap-3">
                  {["Daily", "Weekly", "Monthly"].map((frequency) => (
                    <RadioInput
                      key={frequency}
                      label={frequency}
                      value={frequency}
                      register={register(service.frequencyField)}
                      className="text-xs"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Living Environment Type */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Describe type of living environment (check appropriate descriptions)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {["Rent", "Own", "Apartment", "House", "Condominium"].map(
              (type) => (
                <div key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={type}
                    onChange={(e) => {
                      const currentValues = livingEnvironmentType as string[];
                      if (e.target.checked) {
                        if (!currentValues.includes(type)) {
                          setValue(
                            "livingEnvironmentType" as Path<T>,
                            [...currentValues, type] as PathValueImpl<
                              T,
                              Path<T>
                            >
                          );
                        }
                      } else {
                        setValue(
                          "livingEnvironmentType" as Path<T>,
                          currentValues.filter(
                            (val: string) => val !== type
                          ) as PathValueImpl<T, Path<T>>
                        );
                      }
                    }}
                    checked={(livingEnvironmentType as string[]).includes(type)}
                    name={type}
                    id={type}
                  />
                  <label className="text-sm" htmlFor={type}>
                    {type}
                  </label>
                </div>
              )
            )}
          </div>
          {errors.livingEnvironmentType && (
            <p className="text-red-500 text-sm">
              {errors.livingEnvironmentType.message as string}
            </p>
          )}
        </div>

        {/* Home Environment Adequacy */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Adequacy of home environment (check appropriate description)
          </label>
          <div className="flex flex-wrap gap-3 md:gap-4">
            {["Excellent", "Fair", "Poor"].map((adequacy) => (
              <RadioInput
                key={adequacy}
                label={adequacy}
                value={adequacy}
                register={register("homeEnvironmentAdequacy" as Path<T>)}
              />
            ))}
          </div>
          {errors.homeEnvironmentAdequacy && (
            <p className="text-red-500 text-sm">
              {errors.homeEnvironmentAdequacy.message as string}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
