import { Manifest } from "deno-slack-sdk/mod.ts";
import GitHubProvider from "./external_auth/github_provider.ts";
import CreateNewIssueWorkflow from "./workflows/create_new_issue.ts";

export default Manifest({
  name: "Workflows for GitHub",
  description: "Bringing oft-used GitHub functionality into Slack",
  icon: "assets/default_new_app_icon.png",
  externalAuthProviders: [GitHubProvider],
  functions: [],
  workflows: [CreateNewIssueWorkflow],
  // If your organizaiton uses a separate Github enterprise domain, add that domain to this list
  // so that functions can make API calls to it.
  outgoingDomains: ["api.github.com"],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
