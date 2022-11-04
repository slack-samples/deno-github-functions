# Workflows for GitHub Sample App

This app brings oft-used GitHub functionality - such as creating new issues - to
Slack using functions and workflows.

**Guide Outline**:

- [Supported Workflows](#supported-workflows)
- [Setup](#setup)
  - [Install the Slack CLI](#install-the-slack-cli)
  - [Clone the Sample App](#clone-the-sample-app)
  - [GitHub Access Token](#github-access-token)
  - [Configure Outgoing Domains](#configure-outgoing-domains)
- [Create a Link Trigger](#create-a-link-trigger)
- [Running Your Project Locally](#running-your-project-locally)
- [Deploying Your App](#deploying-your-app)
  - [Viewing Activity Logs](#viewing-activity-logs)
- [Project Structure](#project-structure)
- [Resources](#resources)

---

## Supported Workflows

- **Create new issue**: Create and assign new issues in repositories.

## Setup

Before getting started, make sure you have a development workspace where you
have permissions to install apps. If you don’t have one set up, go ahead and
[create one](https://slack.com/create). Also, please note that the workspace
requires any of [the Slack paid plans](https://slack.com/pricing).

### Install the Slack CLI

To use this sample, you first need to install and configure the Slack CLI.
Step-by-step instructions can be found in our
[Quickstart Guide](https://api.slack.com/future/quickstart).

### Clone the Sample App

Start by cloning this repository:

```zsh
# Clone this project onto your machine
$ slack create my-github-app -t slack-samples/deno-github-functions

# Change into this project directory
$ cd my-github-app
```

### GitHub Access Token

A personal access token is required when calling the GitHub API. Tokens can be
created in
[your developer settings on GitHub](https://github.com/settings/tokens).

> Your personal access token allows your application to perform the API calls
> used by functions as though it was _from your GitHub account_. That means all
> issues created from the Create GitHub issue workflow will appear to have been
> created by the account associated with the personal access token in use!

#### Required Access Token Scopes

To access public repositories, your personal access token should have the
following scopes:

- `public_repo`, `repo:invite`
- `read:org`
- `read:user`, `user:email`
- `read:enterprise`

To prevent `404: Not Found` errors when attempting to access private
repositories, the `repo` scope must also be included.

After selecting the necessary scopes, generate then copy your personal access
token.

#### Add GitHub access token to environment variables

Storing your access token as an environment variable allows you to use different
tokens across local and deployed versions of the same app.

##### Development environment variables

When [developing locally](https://api.slack.com/future/run), environment
variables found in the `.env` file at the root of your project are used. For
local development, rename `.env.sample` to `.env` and add your access token to
the file contents (replacing `ACCESS_TOKEN` with your token):

```bash
# .env
GITHUB_TOKEN=ACCESS_TOKEN
```

##### Production environment variables

[Deployed apps](https://api.slack.com/future/deploy) use environment variables
that are added using `slack env`. To add your access token to a Workspace where
your deployed app is installed, use the following command (once again, replacing
`ACCESS_TOKEN` with your token):

```zsh
$ slack env add GITHUB_TOKEN ACCESS_TOKEN
```

### Configure Outgoing Domains

Hosted custom functions must declare which
[outgoing domains](https://api.slack.com/future/manifest) are used when making
network requests, including Github API calls. `api.github.com` is already
configured as an outgoing domain in this sample's manifest. If your organization
uses a separate Github Enterprise to make API calls to, add that domain to the
`outgoingDomains` array in `manifest.ts`.

## Create a Link Trigger

[Triggers](https://api.slack.com/future/triggers) are what cause Workflows to
run. These Triggers can be invoked by a user, or automatically as a response to
an event within Slack.

A [Link Trigger](https://api.slack.com/future/triggers/link) is a type of
Trigger that generates a **Shortcut URL** which, when posted in a channel or
added as a bookmark, becomes a link. When clicked, the Link Trigger will run the
associated Workflow.

Link Triggers are _unique to each installed version of your app_. This means
that Shortcut URLs will be different across each workspace, as well as between
[locally run](#running-your-project-locally) and
[deployed apps](#deploying-your-app). When creating a Trigger, you must select
the Workspace that you'd like to create the Trigger in. Each Workspace has a
development version (denoted by `(dev)`), as well as a deployed version.

To create a Link Trigger for the "Create New Issue" Workflow, run the following
command:

```zsh
$ slack trigger create --trigger-def triggers/create_new_issue_shortcut.ts
```

After selecting a Workspace, the output provided will include the Link Trigger
Shortcut URL. Copy and paste this URL into a channel as a message, or add it as
a bookmark in a channel of the Workspace you selected.

**Note: this link won't run the Workflow until the app is either running locally
or deployed!** Read on to learn how to run your app locally and eventually
deploy it to Slack hosting.

## Running Your Project Locally

While building your app, you can see your changes propagated to your workspace
in real-time with `slack run`. In both the CLI and in Slack, you'll know an app
is the development version if the name has the string `(dev)` appended.

```zsh
# Run app locally
$ slack run

Connected, awaiting events
```

Once running, click the
[previously created Shortcut URL](#create-a-link-trigger) associated with the
`(dev)` version of your app. This should start a Workflow that opens a form used
to create a new GitHub issue!

To stop running locally, press `<CTRL> + C` to end the process.

## Deploying Your App

Once you're done with development, you can deploy the production version of your
app to Slack hosting using `slack deploy`:

```zsh
$ slack deploy
```

After deploying, [create a new Link Trigger](#create-a-link-trigger) for the
production version of your app (not appended with `(dev)`). Once the Trigger is
invoked, the Workflow should run just as it did in when developing locally.

### Viewing Activity Logs

Activity logs for the production instance of your application can be viewed with
the `slack activity` command:

```zsh
$ slack activity
```

## Project Structure

### `manifest.ts`

The [app manifest](https://api.slack.com/future/manifest) contains the app's
configuration. This file defines attributes like app name and description.

### `slack.json`

Used by the CLI to interact with the project's SDK dependencies. It contains
script hooks that are executed by the CLI and implemented by the SDK.

### `/functions`

[Functions](https://api.slack.com/future/functions) are reusable building blocks
of automation that accept inputs, perform calculations, and provide outputs.
Functions can be used independently or as steps in Workflows.

### `/workflows`

A [Workflow](https://api.slack.com/future/workflows) is a set of steps that are
executed in order. Each step in a Workflow is a function.

Workflows can be configured to run without user input or they can collect input
by beginning with a [form](https://api.slack.com/future/forms) before continuing
to the next step.

### `/triggers`

[Triggers](https://api.slack.com/future/triggers) determine when Workflows are
executed. A trigger file describes a scenario in which a workflow should be run,
such as a user pressing a button or when a specific event occurs.

## Resources

To learn more about developing with the CLI, you can visit the following guides:

- [Creating a new app with the CLI](https://api.slack.com/future/create)
- [Configuring your app](https://api.slack.com/future/manifest)
- [Developing locally](https://api.slack.com/future/run)

To view all documentation and guides available, visit the
[Overview page](https://api.slack.com/future/overview).
