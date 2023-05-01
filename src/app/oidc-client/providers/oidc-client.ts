import { Issuer } from 'openid-client';
import { getOpenIdClientCredentials } from '../configs/getOpenIdClientCredentials';

export const buildOpenIdClient = async () => {
  const { issuer, clientId, clientSecret } = getOpenIdClientCredentials();

  const TrustIssuer = await Issuer.discover(issuer);

  const client = new TrustIssuer.Client({
    client_id: clientId,
    client_secret: clientSecret,
  });

  return client;
};
