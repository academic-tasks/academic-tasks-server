export const getOpenIdClientCredentials = () => {
  const issuer = process.env.OAUTH2_CLIENT_PROVIDER_OIDC_ISSUER;
  const clientId = process.env.OAUTH2_CLIENT_REGISTRATION_LOGIN_CLIENT_ID;
  const clientSecret =
    process.env.OAUTH2_CLIENT_REGISTRATION_LOGIN_CLIENT_SECRET;

  if (
    issuer === undefined ||
    clientId === undefined ||
    clientSecret === undefined
  ) {
    throw new Error('Please provide correct OAUTH2_CLIENT credentials.');
  }

  return {
    issuer,
    clientId,
    clientSecret,
  };
};
