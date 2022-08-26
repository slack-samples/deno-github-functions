import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

const CreateIssue = DefineFunction({
  callback_id: "create_issue",
  title: "Create GitHub issue",
  description: "Create a new GitHub issue in a repository",
  source_file: "functions/create_issue/mod.ts",
  input_parameters: {
    properties: {
      url: {
        type: Schema.types.string,
        description: "Repository URL",
      },
      title: {
        type: Schema.types.string,
        description: "Issue Title",
      },
      description: {
        type: Schema.types.string,
        description: "Issue Description",
      },
      assignees: {
        type: Schema.types.string,
        description: "Assignees",
      },
    },
    required: ["url", "title"],
  },
  output_parameters: {
    properties: {
      GitHubResponse: {
        type: Schema.types.string,
        description: "Issue number and link",
      },
    },
    required: ["GitHubResponse"],
  },
});

export default CreateIssue;
