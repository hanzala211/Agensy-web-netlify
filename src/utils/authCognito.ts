import { ERRORS } from "@agensy/constants";
import {
  confirmResetPassword,
  confirmSignUp,
  fetchAuthSession,
  fetchUserAttributes,
  resendSignUpCode,
  resetPassword,
  signIn,
  signUp,
  updatePassword,
  updateUserAttributes,
} from "aws-amplify/auth";
import { awsErrorMessage } from "./awsErrorMessage";

interface AuthError {
  name: string;
  message: string;
}

export const signup = async (email: string, password: string) => {
  try {
    const signUpResponse = await signUp({
      username: email,
      password,
      options: {
        userAttributes: { email },
        autoSignIn: true,
      },
    });
    const currentDate = new Date().toISOString();
    await updateUserAttributes({
      userAttributes: {
        "custom:lastChangeDatePass": currentDate,
      },
    });
    return signUpResponse;
  } catch (err: unknown) {
    const error = err as AuthError;
    console.log(error);

    if (error.name !== ERRORS.userNameExists) {
      throw awsErrorMessage(error.name, error.message);
    }

    try {
      const codeDeliveryDetails = await resendSignUpCode({ username: email });
      const { deliveryMedium, destination } = codeDeliveryDetails || {};
      return `Account exists but isn't verified. A confirmation ${deliveryMedium?.toLowerCase()} was sent to ${destination}.`;
    } catch {
      throw new Error("Account already exists.");
    }
  }
};

export const signin = async (email: string, password: string) => {
  try {
    const login = await signIn({
      username: email,
      password,
      options: {
        userAttributes: { email },
        autoSignIn: true,
      },
    });

    if (login.nextStep.signInStep === "CONFIRM_SIGN_UP") {
      throw "Please verify your account to continue.";
    }

    return login;
  } catch (error: unknown) {
    const err = error as AuthError;
    throw awsErrorMessage(err.name, err.message);
  }
};

export const getJwtToken = async (): Promise<{
  accessToken: string | null;
}> => {
  const { tokens } = await fetchAuthSession();
  return {
    accessToken: tokens?.accessToken?.toString() ?? null,
  };
};

export const resetUserPassword = async (email: string) => {
  try {
    return await resetPassword({ username: email });
  } catch (error: unknown) {
    const err = error as AuthError;
    throw awsErrorMessage(err.name, err.message);
  }
};

export const confirmResetPass = async (
  email: string,
  password: string,
  code: string
) => {
  try {
    return await confirmResetPassword({
      username: email,
      confirmationCode: code,
      newPassword: password,
    });
  } catch (err: unknown) {
    const error = err as AuthError;
    throw awsErrorMessage(error.name, error.message);
  }
};

export const confirmCode = async (username: string, code: string) => {
  try {
    return await confirmSignUp({
      username,
      confirmationCode: code,
    });
  } catch (err: unknown) {
    const error = err as AuthError;
    throw awsErrorMessage(error.name, error.message);
  }
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string
) => {
  try {
    await updatePassword({
      oldPassword,
      newPassword,
    });
    const currentDate = new Date().toISOString();
    await updateUserAttributes({
      userAttributes: {
        "custom:lastChangeDatePass": currentDate,
      },
    });
  } catch (err: unknown) {
    const error = err as AuthError;
    console.log(error);
    throw awsErrorMessage(error.name, error.message);
  }
};

export const getLastPasswordChangeDate = async () => {
  const userAttributes = await fetchUserAttributes();
  return userAttributes?.["custom:lastChangeDatePass"] || null;
};
