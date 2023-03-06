import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";
import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import handler from "./create_issue.ts";

// Replaces globalThis.fetch with the mocked copy
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

const { createContext } = SlackFunctionTester("my-function");
const env = { logLevel: "CRITICAL" };

Deno.test("Create a GitHub issue with given inputs", async () => {
  const inputs = {
    githubAccessTokenId: {},
    url: "https://github.com/slack-samples/deno-github-functions",
    githubIssue: {
      title: "The issue title",
    },
  };
  const { outputs } = await handler(createContext({ inputs, env }));
  assertEquals(outputs?.GitHubIssueNumber, 123);
  assertEquals(
    outputs?.GitHubIssueLink,
    "https://www.example.com/expected-html-url",
  );
});
