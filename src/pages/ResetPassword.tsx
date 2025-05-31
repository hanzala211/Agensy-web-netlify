import { CommonLink, H1, Input, PrimaryButton } from "@agensy/components";
import { COLORS, ICONS, ROUTES } from "@agensy/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordSchema, type ResetPasswordFormData } from "@agensy/types";
import { useConfirmResetPasswordMutation } from "@agensy/api";
import { toast } from "@agensy/utils";
import React, { useEffect } from "react";

export const ResetPassword: React.FC = () => {
  const confirmResetMutation = useConfirmResetPasswordMutation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (confirmResetMutation.status === "success") {
      toast.success(
        "Password reset successful!",
        "You can now login with your new password"
      );
      navigate(`${ROUTES.auth}/${ROUTES.login}`);
    } else if (confirmResetMutation.status === "error") {
      toast.error("Password Reset Error", String(confirmResetMutation.error));
    }
  }, [confirmResetMutation.status]);

  if (!email) {
    return (
      <div className="w-full">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Invalid reset request. Please request a new password reset.</p>
        </div>
        <CommonLink to={`${ROUTES.auth}/${ROUTES.forgotPassword}`}>
          Back to forgot password
        </CommonLink>
      </div>
    );
  }

  const onSubmit = (data: ResetPasswordFormData) => {
    confirmResetMutation.mutate({
      email,
      password: data.confirmPassword,
      code: data.code,
    });
  };

  return (
    <React.Fragment>
      <div className="mb-8">
        <H1 className="text-2xl font-bold mb-3 text-center md:text-left">
          Reset Password
        </H1>
        <p className="text-darkGray text-sm md:text-base md:text-left text-center">
          Enter the verification code sent to your email and create a new
          password
        </p>
      </div>

      <form
        className="w-full flex flex-col gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          placeholder="Verification code"
          name="code"
          type="text"
          inputClassname="pl-10 py-3"
          icon={ICONS.mail}
          size={18}
          color={COLORS.darkGray}
          error={errors.code?.message}
          register={register("code")}
        />

        <Input
          placeholder="New password"
          name="password"
          type="password"
          inputClassname="pl-10 py-3"
          icon={ICONS.password}
          size={18}
          color={COLORS.darkGray}
          error={errors.password?.message}
          register={register("password")}
          isPassword={true}
        />

        <Input
          placeholder="Confirm new password"
          name="confirmPassword"
          type="password"
          inputClassname="pl-10 py-3"
          icon={ICONS.password}
          size={18}
          color={COLORS.darkGray}
          error={errors.confirmPassword?.message}
          register={register("confirmPassword")}
          isPassword={true}
        />

        <div className="mt-2">
          <PrimaryButton
            type="submit"
            className="w-full py-3 font-medium"
            aria_label="Reset Password Button"
            isLoading={confirmResetMutation.isPending}
            disabled={confirmResetMutation.isPending}
          >
            Reset Password
          </PrimaryButton>
        </div>
      </form>

      <div className="md:mt-4 mt-2">
        <p className="text-darkGray text-center flex gap-2 text-sm justify-center md:justify-start">
          Remember your password?
          <CommonLink to={`${ROUTES.auth}/${ROUTES.login}`}>
            Back to login
          </CommonLink>
        </p>
      </div>
    </React.Fragment>
  );
};

export default ResetPassword;
