# AGENTS.md

This file provides guidance to coding agents when working with code in this
repository.

## What This Is

A Slack app built with the Deno Slack SDK that brings common GitHub tasks, like
creating issues, to Slack with functions and workflows.

## Slack Plugin

To install the Slack plugin for your coding agent, follow
[Claude Code, Codex, Cursor, and Other Coding Agents](./README.md#claude-code-codex-cursor-and-other-coding-agents)
in the README.

## Before you finish

Run `deno task test` (format check, lint, and tests) and type-check with
`deno check`. CI runs both on every PR.

## Code Style

- Snake-case filenames
- No code comments. Make the code explain itself with clear names, tests, or
  types. Put the reason for a change in the PR description.
