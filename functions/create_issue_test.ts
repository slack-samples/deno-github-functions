import { assertEquals } from "@std/assert";
import { stub } from "@std/testing/mock";

import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import handler from "./create_issue.ts";

/**
 * The actual outputs of a function can be compared to expected outputs for a
 * collection of given inputs.
 */
const { createContext } = SlackFunctionTester("create_issue");
const env = { logLevel: "CRITICAL" };

Deno.test("Create a GitHub issue with given inputs", async () => {
  /**
   * Mocked responses of Slack API and external endpoints can be set with
   * mock_fetch.
   */
  using _fetchStub = stub(
    globalThis,
    "fetch",
    (url: string | URL | Request, options?: RequestInit) => {
      const req = url instanceof Request ? url : new Request(url, options);
      assertEquals(req.method, "POST");
      switch (req.url) {
        case "https://slack.com/api/apps.auth.external.get":
          return Promise.resolve(
            new Response(`{"ok": true, "external_token": "example-token"}`),
          );
        case "https://api.github.com/repos/slack-samples/deno-github-functions/issues":
          return Promise.resolve(
            new Response(
              `{"number": 123, "html_url": "https://www.example.com/expected-html-url"}`,
              {
                status: 201,
              },
            ),
          );
        default:
          throw Error(
            `No stub found for ${req.method} ${req.url}\nHeaders: ${
              JSON.stringify(Object.fromEntries(req.headers.entries()))
            }`,
          );
      }
    },
  );

  const inputs = {
    githubAccessTokenId: {},
    url: "https://github.com/slack-samples/deno-github-functions",
    title: "The issue title",
    description: "issue description",
    assignees: "batman",
  };

  const { outputs } = await handler(createContext({ inputs, env }));
  assertEquals(outputs?.GitHubIssueNumber, 123);
  assertEquals(
    outputs?.GitHubIssueLink,
    "https://www.example.com/expected-html-url",
  );
});
