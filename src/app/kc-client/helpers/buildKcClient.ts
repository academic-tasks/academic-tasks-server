import { Credentials } from '@keycloak/keycloak-admin-client/lib/utils/auth';
import { getKeycloakAdminClient } from '../../../common/fixtures';
import { getKeycloakCredentials } from '../configs/getKeycloadCredentials';
import { IKCClient } from '../interfaces/IKCClient';

const getCredentials = async () => {
  const config = getKeycloakCredentials();

  const credentials: Credentials = {
    grantType: 'client_credentials',
    clientId: config.clientId,
    clientSecret: config.clientSecret,
  };

  return credentials;
};

const INTERVAL_AUTH = 58 * 1000;

export const buildKcClient = async () => {
  const config = getKeycloakCredentials();

  const KcAdminClient = await getKeycloakAdminClient();

  const kcAdminClient = new KcAdminClient({
    baseUrl: config.baseUrl,
    realmName: config.realm,
  });

  const authenticate = async () => {
    const currentRealm = kcAdminClient.realmName;

    kcAdminClient.setConfig({ realmName: config.realm });

    const credentials = await getCredentials();

    try {
      await kcAdminClient.auth(credentials);
    } catch (e) {
      console.error("Can't connect to KeyCloak");
      throw e;
    } finally {
      kcAdminClient.setConfig({ realmName: currentRealm });
    }
  };

  await authenticate();

  setInterval(() => {
    authenticate();
  }, INTERVAL_AUTH);

  const getAdminClient = async () => {
    await authenticate();
    return kcAdminClient;
  };

  const kcClient: IKCClient = {
    getAdminClient() {
      return getAdminClient();
    },
  };

  return kcClient;
};
