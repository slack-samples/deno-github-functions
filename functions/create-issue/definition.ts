import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

const CreateIssue = DefineFunction({
  callback_id: "create_issue",
  title: "Create issue",
  description: "Creates an issue inside of a repository",
  source_file: "functions/create-issue/mod.ts",
  input_parameters: {
    properties: {
      url: {
        type: Schema.types.string,
        description: "Repository URL",
      },
      title: {
        type: Schema.types.string,
        description: "Title of the issue",
      },
      description: {
        type: Schema.types.string,
        description: "Description of the issue",
      },
      assignees: {
        type: Schema.types.string,
        description: "Comma-separated list of assignees",
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
