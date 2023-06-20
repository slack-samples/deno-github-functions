import { Manifest } from "deno-slack-sdk/mod.ts";
import CreateNewIssueWorkflow from "./workflows/create_new_issue.ts";

/**
 * The app manifest contains the app's configuration. This file defines
 * attributes like app name, description, available workflows, and more.
 * Learn more: https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "Workflows for GitHub",
  description: "Bringing oft-used GitHub functionality into Slack",
  icon: "assets/default_new_app_icon.png",
  workflows: [CreateNewIssueWorkflow],
  /**
   * Domains used in remote HTTP requests must be specified as outgoing domains.
   * If your organization uses a seperate GitHub Enterprise domain, add it here
   * to make API calls to it from a custom function.
   */
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
