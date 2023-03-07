import { Trigger } from "deno-slack-api/types.ts";
import CreateNewIssueWorkflow from "../workflows/create_new_issue.ts";

/**
 * Triggers determine when workflows are executed. A trigger file describes a
 * scenario in which a workflow should be run, such as a user clicking a link.
 * Learn more: https://api.slack.com/future/triggers/link
 */
const createNewIssueShortcut: Trigger<
  typeof CreateNewIssueWorkflow.definition
> = {
  type: "shortcut",
  name: "Create GitHub issue",
  description: "Create a new GitHub issue in a repository",
  workflow: `#/workflows/${CreateNewIssueWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: "{{data.interactivity}}",
    },
    channel: {
      value: "{{data.channel_id}}",
    },
  },
};

export default createNewIssueShortcut;
