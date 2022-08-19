import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { CreateIssue } from "../../functions/index.ts";

const CreateNewIssue = DefineWorkflow({
  callback_id: "create_new_issue_workflow",
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

const issueFormData = CreateNewIssue.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Create an issue",
    interactivity: CreateNewIssue.inputs.interactivity,
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

const issue = CreateNewIssue.addStep(CreateIssue, {
  owner: issueFormData.outputs.fields.owner,
  repo: issueFormData.outputs.fields.repo,
  title: issueFormData.outputs.fields.title,
  description: issueFormData.outputs.fields.description,
  assignees: issueFormData.outputs.fields.assignees,
});

CreateNewIssue.addStep(Schema.slack.functions.SendMessage, {
  channel_id: CreateNewIssue.inputs.channel,
  message: issue.outputs.GitHubResponse,
});

export default CreateNewIssue;
