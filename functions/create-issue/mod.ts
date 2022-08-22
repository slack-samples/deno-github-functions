import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import type CreateIssue from "./definition.ts";

// https://docs.github.com/en/rest/issues/issues#create-an-issue
const createGitHubIssue: SlackFunctionHandler<typeof CreateIssue.definition> =
  async ({ inputs, env }) => {
    const headers = {
      Accept: "application/vnd.github+json",
      Authorization: "Bearer " + env.GITHUB_TOKEN,
      "Content-Type": "application/json",
    };

    const { url, title, description, assignees } = inputs;
    const { hostname, pathname } = new URL(url);
    const [_, owner, repo] = pathname.split("/");

    // https://docs.github.com/en/enterprise-server@3.3/rest/guides/getting-started-with-the-rest-api
    const apiURL = hostname === "github.com"
      ? "api.github.com"
      : `${hostname}/api/v3`;
    const baseUrl = env.GITHUB_API_URL ?? apiURL;
    const issueEndpoint = `https://${baseUrl}/repos/${owner}/${repo}/issues`;

    const body = JSON.stringify({
      title,
      body: description,
      assignees: assignees?.split(",").map((asignee: string) => asignee.trim()),
    });

    try {
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
          GitHubResponse:
            `Issue #${issue.number} has been successfully created\n` +
            `Link to issue: ${issue.html_url}`,
        },
      };
    } catch (err) {
      console.error(err);
      return {
        outputs: {
          GitHubResponse:
            `An error was encountered during issue creation: \`${err.message}\``,
        },
      };
    }
  };

export default createGitHubIssue;
