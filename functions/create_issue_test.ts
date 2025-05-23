import { StubFetch } from "../testing/http.ts";
import { assertEquals } from "@std/assert";

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
  const stubFetch = new StubFetch();
  stubFetch.stub({
    matches: (req) => {
      assertEquals(req.method, "POST");
      assertEquals(req.url, "https://slack.com/api/apps.auth.external.get");
    },
    response: new Response(`{"ok": true, "external_token": "example-token"}`),
  });

  stubFetch.stub({
    matches: (req) => {
      assertEquals(req.method, "POST");
      assertEquals(
        req.url,
        "https://api.github.com/repos/slack-samples/deno-github-functions/issues",
      );
    },
    response: new Response(
      `{"number": 123, "html_url": "https://www.example.com/expected-html-url"}`,
      {
        status: 201,
      },
    ),
  });

  const inputs = {
    githubAccessTokenId: {},
    url: "https://github.com/slack-samples/deno-github-functions",
    title: "The issue title",
    description: "issue description",
    assignees: "batman",
  };

  try {
    const { outputs } = await handler(createContext({ inputs, env }));
    assertEquals(outputs?.GitHubIssueNumber, 123);
    assertEquals(
      outputs?.GitHubIssueLink,
      "https://www.example.com/expected-html-url",
    );
  } finally {
    stubFetch.restore();
  }
});
