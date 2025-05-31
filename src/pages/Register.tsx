import { useSignupMutation } from "@agensy/api";
import { CommonLink, H1, Input, PrimaryButton } from "@agensy/components";
import { COLORS, ICONS, ROUTES } from "@agensy/constants";
import { signUpSchema, type SignUpSchema } from "@agensy/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "@agensy/utils";
import React, { useEffect } from "react";

export const Register: React.FC = () => {
  const signupMutation = useSignupMutation();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  useEffect(() => {
    if (signupMutation.status === "success") {
      navigate(
        `${ROUTES.auth}/${ROUTES.verifyEmail}?email=${signupMutation.data?.email}`
      );
      if (signupMutation.data?.message) {
        toast.success("Verification Email Sent", signupMutation.data?.message);
      } else {
        toast.success(
          "Registration Successful",
          `Please check your email (${signupMutation.data?.email}) for a verification code.`
        );
      }
    } else if (signupMutation.status === "error") {
      toast.error("Account Creation Failed", String(signupMutation.error));
    }
  }, [signupMutation.status]);

  const onSubmit: SubmitHandler<SignUpSchema> = async (e) => {
    const data = {
      email: e.email_address,
      first_name: e.first_name,
      last_name: e.last_name,
      password: e.password,
    };
    signupMutation.mutate(data);
  };

  return (
    <React.Fragment>
      <div className="mb-8">
        <H1 className="text-2xl font-bold mb-3 text-center md:text-left">
          Create an Account
        </H1>
        <p className="text-darkGray text-sm md:text-base md:text-left text-center">
          Fill in your details to get started
        </p>
      </div>

      <form
        className="w-full flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          placeholder="First Name"
          name="first_name"
          type="text"
          inputClassname="pl-10 py-3"
          icon={ICONS.user}
          size={18}
          color={COLORS.darkGray}
          error={errors["first_name"]?.message}
          register={register("first_name")}
        />
        <Input
          placeholder="Last Name"
          name="last_name"
          type="text"
          inputClassname="pl-10 py-3"
          icon={ICONS.user}
          size={18}
          color={COLORS.darkGray}
          error={errors["last_name"]?.message}
          register={register("last_name")}
        />
        <Input
          placeholder="Email address"
          name="email_address"
          type="email"
          inputClassname="pl-10 py-3"
          icon={ICONS.mail}
          size={18}
          color={COLORS.darkGray}
          error={errors["email_address"]?.message}
          register={register("email_address")}
        />
        <Input
          placeholder="Password"
          name="password"
          type="password"
          inputClassname="pl-10 py-3"
          icon={ICONS.password}
          size={18}
          color={COLORS.darkGray}
          error={errors["password"]?.message}
          register={register("password")}
          isPassword={true}
        />

        <div className="mt-2">
          <PrimaryButton
            type="submit"
            className="w-full py-3 font-medium"
            aria_label="Signup Button"
            isLoading={signupMutation.isPending}
            disabled={signupMutation.isPending}
          >
            Create Account
          </PrimaryButton>
        </div>

        <div className="mt-2">
          <p className="text-darkGray text-center flex gap-2 text-sm">
            Already have an account?
            <CommonLink to={`${ROUTES.auth}/${ROUTES.login}`}>
              Sign in
            </CommonLink>
          </p>
        </div>
      </form>
    </React.Fragment>
  );
};

export default Register;
