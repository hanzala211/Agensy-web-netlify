import { useSignInMutation } from "@agensy/api";
import { CommonLink, H1, Input, PrimaryButton } from "@agensy/components";
import { COLORS, ICONS, ROUTES } from "@agensy/constants";
import { useAuthContext } from "@agensy/context";
import { loginSchema, type LoginSchema } from "@agensy/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "@agensy/utils";
import { signOut } from "aws-amplify/auth";
export const Login: React.FC = () => {
  const signInMutation = useSignInMutation();
  const { setUserData } = useAuthContext();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (signInMutation.status === "success") {
      setUserData(signInMutation.data?.userData);
    } else if (signInMutation.status === "error") {
      toast.error("Authentication Failed", String(signInMutation.error));
      signOut();
    }
  }, [signInMutation.status]);

  const onSubmit: SubmitHandler<LoginSchema> = (e) => {
    signInMutation.mutate(e);
  };

  return (
    <React.Fragment>
      <div className="md:mb-8 mb-4">
        <H1 className="text-2xl font-bold mb-3 text-center md:text-left">
          Welcome back
        </H1>
        <p className="text-darkGray text-sm md:text-base md:text-left text-center">
          Sign in to access your account
        </p>
      </div>

      <form
        className="w-full flex flex-col gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          placeholder="Email address"
          name="email_address"
          type="email"
          inputClassname="pl-10 py-3"
          icon={ICONS.mail}
          size={18}
          color={COLORS.darkGray}
          register={register("email_address")}
          error={errors["email_address"]?.message}
        />
        <Input
          placeholder="Password"
          name="password"
          type="password"
          inputClassname="pl-10 py-3"
          icon={ICONS.password}
          size={18}
          color={COLORS.darkGray}
          register={register("password")}
          error={errors["password"]?.message}
          isPassword={true}
        />

        <div className="flex gap-1 items-center">
          <p className="text-darkGray text-sm">Don't remember your password.</p>
          <CommonLink to={`${ROUTES.auth}/${ROUTES.forgotPassword}`}>
            Forgot Password
          </CommonLink>
        </div>

        <div>
          <PrimaryButton
            type="submit"
            className="w-full py-3 font-medium"
            aria_label="Login Button"
            isLoading={signInMutation.isPending}
            disabled={signInMutation.isPending}
          >
            Login
          </PrimaryButton>
        </div>

        <div className="text-center md:text-left">
          <p className="text-darkGray text-sm mb-1 flex gap-2">
            Don't have an account?
            <CommonLink to={`${ROUTES.auth}/${ROUTES.register}`}>
              Register now
            </CommonLink>
          </p>
        </div>
      </form>
    </React.Fragment>
  );
};

export default Login;
