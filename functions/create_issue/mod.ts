import { SlackFunction } from "deno-slack-sdk/mod.ts";
import CreateIssueDefinition from "./definition.ts";

// https://docs.github.com/en/rest/issues/issues#create-an-issue
export default SlackFunction(
  CreateIssueDefinition,
  async ({ inputs, client }) => {
    const token = await client.apiCall("apps.auth.external.get", {
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
