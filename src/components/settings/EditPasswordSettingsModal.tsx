import { Input, Modal, PrimaryButton } from "@agensy/components";
import { passwordSchema, type PasswordFormData } from "@agensy/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const EditPasswordSettingsModal: React.FC<{
  isModalOpen: boolean;
  isLoading: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  onSubmit: (data: PasswordFormData) => void;
}> = ({ isModalOpen, setIsModalOpen, onSubmit: onSubmitProp, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const handleClose = () => {
    setIsModalOpen(false);
    reset();
  };

  const onSubmit = (data: PasswordFormData) => {
    onSubmitProp(data);
  };
  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleClose}
      title="Change Password"
      footer={
        <PrimaryButton
          onClick={handleSubmit(onSubmit)}
          type="button"
          className="w-fit"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Update Password
        </PrimaryButton>
      }
      height="h-[60%]"
      maxWidth="xl:max-w-[25%] lg:max-w-[40%] md:max-w-[50%] sm:max-w-[60%]"
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Current Password"
          type="password"
          register={register("current_password")}
          error={errors.current_password?.message}
          isPassword={true}
        />

        <Input
          label="New Password"
          type="password"
          register={register("new_password")}
          error={errors.new_password?.message}
          isPassword={true}
        />

        <Input
          label="Confirm New Password"
          type="password"
          register={register("confirm_password")}
          error={errors.confirm_password?.message}
          isPassword={true}
        />
      </form>
    </Modal>
  );
};
