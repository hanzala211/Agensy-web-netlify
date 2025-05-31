import type { ResourcesConfig } from "@aws-amplify/core";

const {
  VITE_COGNITO_USER_POOL_ID,
  VITE_COGNITO_USER_POOL_CLIENT_ID,
  VITE_COGNITO_OAUTH_DOMAIN,
  VITE_COGNITO_OAUTH_SCOPES,
  VITE_REDIRECT_SIGN_IN,
  VITE_REDIRECT_SIGN_OUT,
  VITE_OAUTH_RESPONSE_TYPE,
} = import.meta.env;

export const awsCognitoConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: VITE_COGNITO_USER_POOL_CLIENT_ID,

      loginWith: {
        oauth: {
          domain: VITE_COGNITO_OAUTH_DOMAIN,
          scopes: VITE_COGNITO_OAUTH_SCOPES.split(","),
          redirectSignIn: [VITE_REDIRECT_SIGN_IN],
          redirectSignOut: [VITE_REDIRECT_SIGN_OUT],
          responseType: VITE_OAUTH_RESPONSE_TYPE as "code" | "token",
        },
      },
    },
  },
};
