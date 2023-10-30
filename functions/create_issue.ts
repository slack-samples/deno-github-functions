import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

/**
 * Functions are reusable building blocks of automation that accept inputs,
 * perform calculations, and provide outputs. Functions can be used as steps in
 * a workflow or independently.
 * Learn more: https://api.slack.com/automation/functions/custom
 */
export const CreateIssueDefinition = DefineFunction({
  callback_id: "create_issue",
  title: "Create GitHub issue",
  description: "Create a new GitHub issue in a repository",
  source_file: "functions/create_issue.ts", // The file with the exported function handler
  input_parameters: {
    properties: {
      githubAccessTokenId: {
        type: Schema.slack.types.oauth2,
        oauth2_provider_key: "github",
      },
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
    required: [
      "githubAccessTokenId",
      "url",
      "title",
    ],
  },
  output_parameters: {
    properties: {
      GitHubIssueNumber: {
        type: Schema.types.number,
        description: "Issue number",
      },
      GitHubIssueLink: {
        type: Schema.types.string,
        description: "Issue link",
      },
    },
    required: ["GitHubIssueNumber", "GitHubIssueLink"],
  },
});

/**
 * The default export for a custom function accepts a function definition
 * and a function handler that contains the custom logic for the function.
 */
export default SlackFunction(
  CreateIssueDefinition,
  async ({ inputs, client }) => {
    /**
     * Gather the stored external authentication access token using the access
     * token id passed from the workflow's input. This token can be used to
     * authorize requests made to an external service on behalf of the user.
     */
    const token = await client.apps.auth.external.get({
      external_token_id: inputs.githubAccessTokenId,
    });

    if (!token.ok) throw new Error("Failed to access auth token");

    const headers = {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token.external_token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    const { url, title, description, assignees } = inputs;

    try {
      const { hostname, pathname } = new URL(url);
      const [_, owner, repo] = pathname.split("/");

      // https://docs.github.com/en/enterprise-server@3.3/rest/guides/getting-started-with-the-rest-api
      const apiURL = hostname === "github.com"
        ? "api.github.com"
        : `${hostname}/api/v3`;

      // https://docs.github.com/en/rest/issues/issues#create-an-issue
      const issueEndpoint = `https://${apiURL}/repos/${owner}/${repo}/issues`;

      const body = JSON.stringify({
        title,
        body: description,
        assignees: assignees?.split(",").map((assignee: string) => {
          return assignee.trim();
        }),
      });

      const issue = await fetch(issueEndpoint, {
        method: "POST",
        headers,
        body,
      }).then((res: Response) => {
        if (res.status === 201) return res.json();
        else throw new Error(`${res.status}: ${res.statusText}`);
      });

      return {
        outputs: {
          GitHubIssueNumber: issue.number,
          GitHubIssueLink: issue.html_url,
        },
      };
    } catch (err) {
      console.error(err);
      return {
        error:
          `An error was encountered during issue creation: \`${err.message}\``,
      };
    }
  },
);
