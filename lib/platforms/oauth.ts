type ProviderConfig = {
  provider: string;
  displayName: string;
  authorizeUrl: string;
  callbackPath: string;
};

const providerConfigs: ProviderConfig[] = [
  {
    provider: "gumroad",
    displayName: "Gumroad",
    authorizeUrl: "https://gumroad.com/oauth/authorize",
    callbackPath: "/api/platforms/oauth/gumroad/callback",
  },
  {
    provider: "whop",
    displayName: "Whop",
    authorizeUrl: "https://whop.com/oauth/authorize",
    callbackPath: "/api/platforms/oauth/whop/callback",
  },
];

export function getProviderConfig(provider: string) {
  return providerConfigs.find((config) => config.provider === provider);
}

export function listProviderConfigs() {
  return providerConfigs;
}

