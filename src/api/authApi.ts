import { AuthService } from "@agensy/services";
import { CognitoUtils } from "@agensy/utils";
import { useMutation } from "@tanstack/react-query";

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: async (data: Record<string, string>) => {
      const { email, password, ...otherData } = data;
      const awsSignUpResponse = await CognitoUtils.signup(email, password);
      if (typeof awsSignUpResponse === "string") {
        return { message: awsSignUpResponse, email };
      }

      await AuthService.signUp({
        ...otherData,
        email,
        cognito_id: awsSignUpResponse.userId,
      });

      return { ...awsSignUpResponse, email };
    },
  });
};

export const useSignInMutation = () => {
  return useMutation({
    mutationFn: async (data: Record<string, string>) => {
      const response = await CognitoUtils.signin(
        data.email_address,
        data.password
      );
      console.log(response);
      if (response) {
        const apiRes = await AuthService.login();
        return { userData: apiRes };
      }
      return null;
    },
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: async (data: Record<string, string>) => ({
      result: await CognitoUtils.resetUserPassword(data.email),
      email: data.email,
    }),
  });
};

export const useConfirmResetPasswordMutation = () => {
  return useMutation({
    mutationFn: async (data: Record<string, string>) => ({
      result: await CognitoUtils.confirmResetPass(
        data.email,
        data.password,
        data.code
      ),
      email: data.email,
    }),
  });
};

export const useConfirmEmailVerificationMutation = () => {
  return useMutation({
    mutationFn: async (data: Record<string, string>) => ({
      result: await CognitoUtils.confirmCode(data.email, data.code),
      email: data.email,
    }),
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: async (data: Record<string, string>) =>
      await CognitoUtils.changePassword(data.oldPassword, data.newPassword),
  });
};
