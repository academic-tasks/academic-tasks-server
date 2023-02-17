import KcAdminClient from '@keycloak/keycloak-admin-client';
import { Credentials } from '@keycloak/keycloak-admin-client/lib/utils/auth';
import { getModKeycloakAdminClient } from 'src/app/fixture-external-dependencies';

const INTERVAL_AUTH = 58 * 1000;

export type KcClient = KcAdminClient;

const getCredentials = async (): Promise<Credentials> => {
  const grantType = process.env.KC_AUTH_GRANT_TYPE as Credentials['grantType'];

  const clientId = process.env.KC_AUTH_CLIENT_ID;

  if (!clientId) {
    throw new TypeError('Please provide Keycloak admin credentials.');
  }

  switch (grantType) {
    case 'client_credentials': {
      const clientSecret = process.env.KC_AUTH_CLIENT_SECRET;

      return {
        grantType: 'client_credentials',

        clientId: clientId,
        clientSecret: clientSecret,
      };
    }

    default:
    case 'password': {
      const username = process.env.KC_AUTH_USERNAME;
      const password = process.env.KC_AUTH_PASSWORD;
      const totp = process.env.KC_AUTH_TOTP;

      return {
        grantType: 'password',

        clientId: clientId,

        username: username,
        password: password,

        totp: totp,
      };
    }
  }
};

export const buildKcClient = async () => {
  const KcAdminClient = await getModKeycloakAdminClient();

  const baseUrl = process.env.KC_AUTH_URL;

  const kcAdminClient = new KcAdminClient({
    baseUrl: baseUrl,
  });

  const authenticateClient = async () => {
    const targetRealm = process.env.KC_TARGET_REALM;
    const adminRealm = process.env.KC_AUTH_REALM;

    kcAdminClient.setConfig({ realmName: adminRealm });

    const credentials = await getCredentials();
    await kcAdminClient.auth(credentials);

    kcAdminClient.setConfig({ realmName: targetRealm });
  };

  await authenticateClient();

  setInterval(async () => {
    const { grantType } = await getCredentials();

    switch (grantType) {
      case 'client_credentials': {
        await authenticateClient();
        break;
      }

      default: {
        break;
      }
    }
  }, INTERVAL_AUTH);

  return kcAdminClient;
};
