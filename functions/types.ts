import { DefineType, Schema } from "deno-slack-sdk/mod.ts";

/**
 * This is a Slack Custom type for an Announcement
 * For more on defining Custom types:
 *
 * https://api.slack.com/future/types/custom
 */
export const GitHubIssueCustomType = DefineType({
  name: "GitHubIssue",
  type: Schema.types.object,
  properties: {
    title: {
      type: Schema.types.string,
      description: "Issue Title",
    },
    description: {
      type: Schema.types.string,
      description: "Issue Description",
      nullable: true,
    },
    assignees: {
      type: Schema.types.string,
      description: "Assignees",
      nullable: true,
    },
  },
  required: ["title"],
});
