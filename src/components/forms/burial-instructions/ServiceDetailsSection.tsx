import type {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import { TextArea, Card } from "@agensy/components";

interface ServiceDetailsSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

export const ServiceDetailsSection = <T extends FieldValues>({
  register,
  errors,
}: ServiceDetailsSectionProps<T>) => {
  return (
    <Card title="Service Details">
      <div className="space-y-6">
        {/* Type of Service */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Type of Service:
          </label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="religious"
                value="religious"
                {...register("typeOfService" as Path<T>)}
                className="text-primaryColor focus:ring-primaryColor"
              />
              <label htmlFor="religious" className="text-sm text-gray-700">
                Religious
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="spiritual"
                value="spiritual"
                {...register("typeOfService" as Path<T>)}
                className="text-primaryColor focus:ring-primaryColor"
              />
              <label htmlFor="spiritual" className="text-sm text-gray-700">
                Spiritual
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="secular"
                value="secular"
                {...register("typeOfService" as Path<T>)}
                className="text-primaryColor focus:ring-primaryColor"
              />
              <label htmlFor="secular" className="text-sm text-gray-700">
                Secular
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="celebration-of-life"
                value="celebration-of-life"
                {...register("typeOfService" as Path<T>)}
                className="text-primaryColor focus:ring-primaryColor"
              />
              <label
                htmlFor="celebration-of-life"
                className="text-sm text-gray-700"
              >
                Celebration of Life
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="no-service"
                value="no-service"
                {...register("typeOfService" as Path<T>)}
                className="text-primaryColor focus:ring-primaryColor"
              />
              <label htmlFor="no-service" className="text-sm text-gray-700">
                No Service
              </label>
            </div>
          </div>
        </div>

        {/* Officiant or Speaker Requested */}
        <div>
          <TextArea
            label="Officiant or Speaker Requested:"
            register={register("officiantSpeakerRequested" as Path<T>)}
            error={errors.officiantSpeakerRequested?.message as string}
            rows={4}
            placeholder="Enter officiant or speaker details..."
          />
        </div>

        {/* Location of Service */}
        <div>
          <TextArea
            label="Location of Service:"
            register={register("locationOfService" as Path<T>)}
            error={errors.locationOfService?.message as string}
            rows={4}
            placeholder="Enter service location details..."
          />
        </div>

        {/* Special Requests */}
        <div>
          <TextArea
            label="Special Requests (e.g., songs, readings, dress code, flowers, cultural rites):"
            register={register("specialRequests" as Path<T>)}
            error={errors.specialRequests?.message as string}
            rows={4}
            placeholder="Enter any special requests..."
          />
        </div>
      </div>
    </Card>
  );
};
