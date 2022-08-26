import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import CreateIssue from "../../functions/create_issue/definition.ts";

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
        name: "url",
        title: "Repository URL",
        description: "The GitHub URL of the repository",
        type: Schema.types.string,
      }, {
        name: "title",
        title: "Issue title",
        type: Schema.types.string,
      }, {
        name: "description",
        title: "Issue description",
        type: Schema.types.string,
        long: true,
      }, {
        name: "assignees",
        title: "Issue assignees",
        description:
          "GitHub username(s) of the user(s) to assign the issue to (separated by commas)",
        type: Schema.types.string,
      }],
      required: ["url", "title"],
    },
  },
);

const issue = CreateNewIssue.addStep(CreateIssue, {
  url: issueFormData.outputs.fields.url,
  title: issueFormData.outputs.fields.title,
  description: issueFormData.outputs.fields.description,
  assignees: issueFormData.outputs.fields.assignees,
});

CreateNewIssue.addStep(Schema.slack.functions.SendMessage, {
  channel_id: CreateNewIssue.inputs.channel,
  message: issue.outputs.GitHubResponse,
});

export default CreateNewIssue;
