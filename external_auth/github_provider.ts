import { DefineOAuth2Provider, Schema } from "deno-slack-sdk/mod.ts";

// https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps#web-application-flow
const GitHubProvider = DefineOAuth2Provider({
  provider_key: "github",
  provider_type: Schema.providers.oauth2.CUSTOM,
  options: {
    provider_name: "GitHub",
    authorization_url: "https://github.com/login/oauth/authorize",
    token_url: "https://github.com/login/oauth/access_token",
    client_id: "b89803122bbc853fb589",
    scope: [
      "repo",
      "read:org",
      "read:user",
      "user:email",
      "read:enterprise",
    ],
    identity_config: {
      url: "https://api.github.com/user",
      account_identifier: "$.login",
    },
  },
});

export default GitHubProvider;
