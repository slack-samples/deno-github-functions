import { Manifest } from "deno-slack-sdk/mod.ts";
import CreateIssue from "./functions/create_issue/definition.ts";
import CreateNewIssue from "./workflows/create_new_issue.ts";

export default Manifest({
  name: "Workflows for GitHub",
  description: "Bringing oft-used GitHub functionality into Slack",
  icon: "assets/icon.png",
  functions: [CreateIssue],
  workflows: [CreateNewIssue],
  outgoingDomains: [],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
