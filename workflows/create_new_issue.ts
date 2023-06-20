import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { Connectors } from "deno-slack-hub/mod.ts";

/**
 * A workflow is a set of steps that are executed in order. Each step in a
 * workflow is a function – either a built-in or custom function.
 * Learn more: https://api.slack.com/automation/workflows
 */
const CreateNewIssueWorkflow = DefineWorkflow({
  callback_id: "create_new_issue_workflow",
  title: "Create new issue",
  description: "Create a new GitHub issue",
  input_parameters: {
    properties: {
      /**
       * This workflow users interactivity to collect input from the user.
       * Learn more: https://api.slack.com/automation/forms#add-interactivity
       */
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

/**
 * Collecting input from users can be done with the built-in OpenForm function
 * as the first step.
 * Learn more: https://api.slack.com/automation/functions#open-a-form
 */
const issueFormData = CreateNewIssueWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Create an issue",
    interactivity: CreateNewIssueWorkflow.inputs.interactivity,
    submit_label: "Create",
    description: "Create a new issue inside of a GitHub repository",
    fields: {
      elements: [{
        name: "url",
        title: "API Repository URL",
        description:
          "The API GitHub URL of the repository; https://api.github.com/repos/OWNER/REPO",
        type: Schema.types.string,
        default: "https://api.github.com/repos/OWNER/REPO",
      }, {
        name: "title",
        title: "Issue title",
        type: Schema.types.string,
      }, {
        name: "description",
        title: "Issue description",
        type: Schema.types.string,
        long: true,
      }],
      required: ["url", "title", "description"],
    },
  },
);

/**
 * A connector function can be added as a workflow step to
 * interact with an external API, and return responses for use in
 * later steps.
 */
const issue = CreateNewIssueWorkflow.addStep(
  Connectors.GithubCloud.functions.CreateIssue,
  {
    github_access_token: { credential_source: "END_USER" },
    repository: issueFormData.outputs.fields.url,
    title: issueFormData.outputs.fields.title,
    description: issueFormData.outputs.fields.description,
  },
);

/**
 * Messages can be sent into a channel with the built-in SendMessage function.
 * Learn more: https://api.slack.com/automation/functions#catalog
 */
CreateNewIssueWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: CreateNewIssueWorkflow.inputs.channel,
  message:
    `Issue #${issue.outputs.issue_number} has been successfully created\n` +
    `Link to issue: ${issue.outputs.issue_url}`,
});

export default CreateNewIssueWorkflow;
