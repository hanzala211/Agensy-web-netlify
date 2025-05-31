import { CommonLink, H1, Input, PrimaryButton } from "@agensy/components";
import { COLORS, ICONS, ROUTES } from "@agensy/constants";
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { verificationSchema } from "@agensy/types";
import type { VerificationFormData } from "@agensy/types";
import { useConfirmEmailVerificationMutation } from "@agensy/api";
import { toast } from "@agensy/utils";

export const VerifyEmail: React.FC = () => {
  const confirmEmailVerificationMutation =
    useConfirmEmailVerificationMutation();

  const [searchParams] = useSearchParams();
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const navigate = useNavigate();

  const email = searchParams.get("email");

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
  });

  useEffect(() => {
    if (confirmEmailVerificationMutation.status === "success") {
      toast.success(
        "Email verification successful!",
        "You can now login to your account"
      );
      setIsVerified(true);
    } else if (confirmEmailVerificationMutation.status === "error") {
      toast.error(
        "Email Verification Error",
        String(confirmEmailVerificationMutation.error)
      );
    }
  }, [confirmEmailVerificationMutation.status]);

  const onSubmit = (data: VerificationFormData) => {
    if (email) {
      confirmEmailVerificationMutation.mutate({
        email: email,
        code: data.code,
      });
    }
  };

  const handleLoginClick = () => {
    navigate(`${ROUTES.auth}/${ROUTES.login}`);
  };

  if (!email) {
    return (
      <div className="w-full">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>
            Invalid verification request. Please try again or contact support.
          </p>
        </div>
        <CommonLink to={`${ROUTES.auth}/${ROUTES.login}`}>
          Back to login
        </CommonLink>
      </div>
    );
  }

  if (isVerified) {
    return (
      <React.Fragment>
        <div className="mb-8">
          <H1 className="text-2xl font-bold mb-3 text-center md:text-left">
            Email Verification Successful
          </H1>
          <p className="text-darkGray text-sm md:text-base md:text-left text-center">
            Your email has been successfully verified! You can now log in to
            your account.
          </p>
        </div>

        <div className="mt-6">
          <PrimaryButton
            type="button"
            className="w-full py-3 font-medium"
            aria_label="Go to Login Button"
            onClick={handleLoginClick}
          >
            Go to Login
          </PrimaryButton>
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className="mb-8">
        <H1 className="text-2xl font-bold mb-3 text-center md:text-left">
          Verify Your Email
        </H1>
        <p className="text-darkGray text-sm md:text-base md:text-left text-center">
          We've sent a verification code to{" "}
          <span className="font-medium">{email}</span>. Please enter the code
          below to verify your email address.
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

        <div className="mt-2">
          <PrimaryButton
            type="submit"
            className="w-full py-3 font-medium"
            aria_label="Verify Email Button"
            isLoading={confirmEmailVerificationMutation.isPending}
            disabled={confirmEmailVerificationMutation.isPending}
          >
            Verify Email
          </PrimaryButton>
        </div>
      </form>

      <div className="md:mt-4 mt-2">
        <p className="text-darkGray text-center flex gap-2 text-sm justify-center md:justify-start">
          Didn't receive the code?
          <CommonLink to={`${ROUTES.auth}/${ROUTES.login}`}>
            Try again later
          </CommonLink>
        </p>
      </div>
    </React.Fragment>
  );
};

export default VerifyEmail;
