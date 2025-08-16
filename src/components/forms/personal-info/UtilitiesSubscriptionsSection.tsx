import type {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import { Input, Card } from "@agensy/components";

interface UtilitiesSubscriptionsSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

export const UtilitiesSubscriptionsSection = <T extends FieldValues>({
  register,
  errors,
}: UtilitiesSubscriptionsSectionProps<T>) => {
  return (
    <Card title="Utilities & Subscriptions">
      <div className="space-y-6">
        {/* Electricity Provider */}
        <div className="space-y-4">
          <Input
            label="Electricity Provider:"
            register={register("electricityProvider" as Path<T>)}
            error={errors.electricityProvider?.message as string}
          />
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Username:"
              register={register("electricityUsername" as Path<T>)}
              error={errors.electricityUsername?.message as string}
            />
            <Input
              label="Password:"
              type="password"
              isPassword={true}
              register={register("electricityPassword" as Path<T>)}
              error={errors.electricityPassword?.message as string}
            />
          </div>
        </div>

        {/* Internet Provider */}
        <div className="space-y-4">
          <Input
            label="Internet Provider:"
            register={register("internetProvider" as Path<T>)}
            error={errors.internetProvider?.message as string}
          />
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Username:"
              register={register("internetUsername" as Path<T>)}
              error={errors.internetUsername?.message as string}
            />
            <Input
              label="Password:"
              type="password"
              isPassword={true}
              register={register("internetPassword" as Path<T>)}
              error={errors.internetPassword?.message as string}
            />
          </div>
        </div>

        {/* Phone Provider */}
        <div className="space-y-4">
          <Input
            label="Phone Provider:"
            register={register("phoneProvider" as Path<T>)}
            error={errors.phoneProvider?.message as string}
          />
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Username:"
              register={register("phoneUsername" as Path<T>)}
              error={errors.phoneUsername?.message as string}
            />
            <Input
              label="Password:"
              isPassword={true}
              type="password"
              register={register("phonePassword" as Path<T>)}
              error={errors.phonePassword?.message as string}
            />
          </div>
        </div>

        {/* Streaming Services */}
        <div className="space-y-4">
          <Input
            label="Streaming Services (Netflix, Hulu, etc.):"
            register={register("streamingServices" as Path<T>)}
            error={errors.streamingServices?.message as string}
          />
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Username:"
              register={register("streamingUsername" as Path<T>)}
              error={errors.streamingUsername?.message as string}
            />
            <Input
              label="Password:"
              type="password"
              isPassword={true}
              register={register("streamingPassword" as Path<T>)}
              error={errors.streamingPassword?.message as string}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
