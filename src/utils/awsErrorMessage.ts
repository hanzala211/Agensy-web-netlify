import { ERROR_MESSAGES, ERRORS } from "@agensy/constants";

export const awsErrorMessage = (name?: string, raw?: string): string =>
  (name && ERROR_MESSAGES[name as (typeof ERRORS)[keyof typeof ERRORS]]) ??
  raw ??
  "Something went wrong. Please try again.";
