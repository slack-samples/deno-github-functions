import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";
import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";

import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import handler from "./create_issue.ts";

/**
 * Mocked responses of Slack API and external endpoints can be set with
 * mock_fetch.
 */
mf.install();

mf.mock("POST@/api/apps.auth.external.get", () => {
  return new Response(`{"ok": true, "external_token": "example-token"}`);
});

mf.mock("POST@/repos/slack-samples/deno-github-functions/issues", () => {
  return new Response(
    `{"number": 123, "html_url": "https://www.example.com/expected-html-url"}`,
    {
      status: 201,
    },
  );
});

/**
 * The actual outputs of a function can be compared to expected outputs for a
 * collection of given inputs.
 */
const { createContext } = SlackFunctionTester("create_issue");
const env = { logLevel: "CRITICAL" };

Deno.test("Create a GitHub issue with given inputs", async () => {
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
