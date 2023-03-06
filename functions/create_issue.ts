import {
  DefineFunction,
  DefineProperty,
  Schema,
  SlackFunction,
} from "deno-slack-sdk/mod.ts";

export const CreateIssueDefinition = DefineFunction({
  callback_id: "create_issue",
  title: "Create GitHub issue",
  description: "Create a new GitHub issue in a repository",
  source_file: "functions/create_issue.ts",
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
      githubIssue: DefineProperty({
        type: Schema.types.object,
        properties: {
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
        required: ["title"],
      }),
    },
    required: ["githubAccessTokenId", "url", "githubIssue"],
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

// https://docs.github.com/en/rest/issues/issues#create-an-issue
export default SlackFunction(
  CreateIssueDefinition,
  async ({ inputs, client }) => {
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

    const { url, githubIssue } = inputs;
    const { title, description, assignees } = githubIssue;

    try {
      const { hostname, pathname } = new URL(url);
      const [_, owner, repo] = pathname.split("/");

      // https://docs.github.com/en/enterprise-server@3.3/rest/guides/getting-started-with-the-rest-api
      const apiURL = hostname === "github.com"
        ? "api.github.com"
        : `${hostname}/api/v3`;
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
