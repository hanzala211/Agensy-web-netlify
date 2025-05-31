export const ERRORS = {
  userNameExists: 'UsernameExistsException',
  invalidParameter: 'InvalidParameterException',
  notAuthorized: 'NotAuthorizedException',
  userNotFound: 'UserNotFoundException',
  codeDeliveryFailure: 'CodeDeliveryFailureException',
  tooManyRequests: 'TooManyRequestsException',
  notAuthenticated: 'UserUnAuthenticatedException',
  limitExceeded: 'LimitExceededException',
} as const;

export const ERROR_MESSAGES: Record<
  (typeof ERRORS)[keyof typeof ERRORS],
  string
> = {
  [ERRORS.userNameExists]: 'An account with this e‑mail already exists.',
  [ERRORS.invalidParameter]: 'An account with this e‑mail already exists.',
  [ERRORS.notAuthorized]: 'Incorrect e‑mail or password.',
  [ERRORS.userNotFound]: 'No account found with that e‑mail.',
  [ERRORS.codeDeliveryFailure]:
    'We could not send the verification e‑mail. Try again later.',
  [ERRORS.tooManyRequests]: 'Too many attempts. Please wait and try again.',
  [ERRORS.notAuthenticated]: 'User not authenticated.',
  [ERRORS.limitExceeded]: 'Too many attempts. Please wait and try again.',
};
