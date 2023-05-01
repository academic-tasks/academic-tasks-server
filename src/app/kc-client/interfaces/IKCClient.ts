import KcAdminClient from '@keycloak/keycloak-admin-client';

export type IKCClient = {
  getAdminClient(): Promise<KcAdminClient>;
};
