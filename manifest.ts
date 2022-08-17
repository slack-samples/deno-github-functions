import {
  DefineFunction,
  DefineWorkflow,
  Manifest,
  Schema,
} from "deno-slack-sdk/mod.ts";

export const CreateIssueWorkflow = DefineWorkflow({
  callback_id: "create_issue_workflow",
  title: "Create new issue",
  description: "Create a new GitHub issue",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["interactivity", "channel"],
  },
});

const issueFormData = CreateIssueWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Create an issue",
    interactivity: CreateIssueWorkflow.inputs.interactivity,
    submit_label: "Create",
    description: "Create a new issue inside of a GitHub repository",
    fields: {
      elements: [{
        name: "owner",
        title: "Repository owner",
        description: "The GitHub username of the repository owner",
        type: Schema.types.string,
      }, {
        name: "repo",
        title: "Repository name",
        type: Schema.types.string,
      }, {
        name: "title",
        title: "Issue title",
        type: Schema.types.string,
      }, {
        name: "description",
        title: "Issue description",
        type: Schema.types.string,
      }, {
        name: "assignees",
        title: "Issue assignees",
        description:
          "GitHub username(s) of the user(s) to assign the issue to (separated by commas)",
        type: Schema.types.string,
      }],
      required: ["owner", "repo", "title"],
    },
  },
);

export const CreateIssue = DefineFunction({
  callback_id: "create_issue",
  title: "Create issue",
  description: "Creates an issue inside of a repository",
  source_file: "functions/create-issue.ts",
  input_parameters: {
    properties: {
      owner: {
        type: "string",
        description: "Repository owner",
      },
      repo: {
        type: "string",
        description: "Repository name",
      },
      title: {
        type: "string",
        description: "Title of the issue",
      },
      description: {
        type: "string",
        description: "Description of the issue",
      },
      assignees: {
        type: "string",
        description: "Comma-separated list of assignees",
      },
    },
    required: ["owner", "repo", "title"],
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

const issue = CreateIssueWorkflow.addStep(CreateIssue, {
  owner: issueFormData.outputs.fields.owner,
  repo: issueFormData.outputs.fields.repo,
  title: issueFormData.outputs.fields.title,
  description: issueFormData.outputs.fields.description,
  assignees: issueFormData.outputs.fields.assignees,
});

CreateIssueWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: CreateIssueWorkflow.inputs.channel,
  message: issue.outputs.GitHubResponse,
});

export default Manifest({
  name: "Workflows for GitHub",
  description: "Bringing oft-used GitHub functionality into Slack",
  icon: "assets/icon.png",
  functions: [CreateIssue],
  workflows: [CreateIssueWorkflow],
  outgoingDomains: [],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
