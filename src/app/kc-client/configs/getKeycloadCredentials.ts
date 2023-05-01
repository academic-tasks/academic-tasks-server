import { getOpenIdClientCredentials } from '../../oidc-client/configs/getOpenIdClientCredentials';

export const getKeycloakCredentials = () => {
  const baseUrl = process.env.KC_ADMIN_BASE_URL!;

  const realm = process.env.KC_ADMIN_REALM!;

  const clientId = process.env.KC_ADMIN_CLIENT_ID!;

  const clientSecret = process.env.KC_ADMIN_CLIENT_SECRET!;

  return {
    baseUrl,
    realm,
    clientId,
    clientSecret,
  };
};
