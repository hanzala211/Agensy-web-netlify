import { useResetPasswordMutation } from "@agensy/api";
import { CommonLink, H1, Input, PrimaryButton } from "@agensy/components";
import { COLORS, ICONS, ROUTES } from "@agensy/constants";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@agensy/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "@agensy/utils";

export const ForgotPassword: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedEmail, setSubmittedEmail] = useState<string>("");
  const navigate = useNavigate();

  const resetPasswordMutation = useResetPasswordMutation();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  useEffect(() => {
    if (resetPasswordMutation.status === "success") {
      setIsSubmitted(true);
      setSubmittedEmail(resetPasswordMutation.data?.email);
    } else if (resetPasswordMutation.status === "error") {
      toast.error(
        "Password Reset Request Failed",
        String(resetPasswordMutation.error)
      );
    }
  }, [resetPasswordMutation.status]);

  const onSubmit = (data: ForgotPasswordFormData) => {
    setIsSubmitted(false);
    setSubmittedEmail("");
    resetPasswordMutation.mutate({ email: data.email });
  };

  const handleClick = () => {
    setTimeout(() => {
      setIsSubmitted(false);
      setSubmittedEmail("");
    }, 500);
  };

  const handleNextClick = () => {
    navigate(`${ROUTES.auth}/${ROUTES.resetPassword}?email=${submittedEmail}`);
    handleClick();
  };

  return (
    <React.Fragment>
      <div className="mb-8">
        <H1 className="text-2xl font-bold mb-3 text-center md:text-left">
          Reset Password
        </H1>
        <p className="text-darkGray text-sm md:text-base md:text-left text-center">
          {!isSubmitted
            ? "Enter your email address to receive a verification code"
            : "Check your email for the verification code"}
        </p>
      </div>

      {!isSubmitted ? (
        <>
          <form
            className="w-full flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              placeholder="Email address"
              name="email"
              type="email"
              inputClassname="pl-10 py-3"
              icon={ICONS.mail}
              size={18}
              color={COLORS.darkGray}
              error={errors.email?.message}
              register={register("email")}
            />

            <div className="mt-2">
              <PrimaryButton
                type="submit"
                className="w-full py-3 font-medium"
                aria_label="Reset Password Button"
                isLoading={resetPasswordMutation.isPending}
                disabled={resetPasswordMutation.isPending}
              >
                Send Verification Code
              </PrimaryButton>
            </div>
          </form>
        </>
      ) : (
        <>
          <div className="bg-lightGreen border border-temporaryGreen rounded-md p-4 text-center mb-4">
            <p className="text-darkGreen">
              If an account exists with email {submittedEmail}, we've sent a
              verification code.
            </p>
          </div>
          <div className="mt-4">
            <PrimaryButton
              onClick={handleNextClick}
              className="w-full py-3 font-medium"
              aria_label="Next Button"
            >
              Next
            </PrimaryButton>
          </div>
        </>
      )}

      <div className="md:mt-4 mt-2">
        <p className="text-darkGray text-center flex gap-2 text-sm justify-center md:justify-start">
          Remember your password?
        </p>
        <CommonLink onClick={handleClick} to={`${ROUTES.auth}/${ROUTES.login}`}>
          Back to Login
        </CommonLink>
      </div>
    </React.Fragment>
  );
};

export default ForgotPassword;
