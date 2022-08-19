import { Manifest } from "deno-slack-sdk/mod.ts";
import { CreateIssue } from "./functions/index.ts";
import { CreateNewIssue } from "./workflows/index.ts";

export default Manifest({
  name: "Workflows for GitHub",
  description: "Bringing oft-used GitHub functionality into Slack",
  icon: "assets/icon.png",
  functions: [CreateIssue],
  workflows: [CreateNewIssue],
  outgoingDomains: [],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
