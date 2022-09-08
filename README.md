# Workflows for GitHub Sample App

This app brings oft-used GitHub functionality - such as creating new issues - to
Slack using functions and workflows.

**Guide Outline**:

- [Supported Workflows](#supported-workflows)
- [Setup](#setup)
  - [Install the Slack CLI](#install-the-slack-cli)
  - [Install the Sample App](#install-the-sample-app)
  - [GitHub Access Token](#github-access-token)
- [Create a Link Trigger][create-trigger]
- [Running Your Project Locally][run-locally]
- [Deploying Your App](#deploying-your-app)
  - [Viewing Activity Logs for Your Production App](#viewing-activity-logs-for-your-production-app)
- [Project Structure](#project-structure)
- [Resources](#resources)

---

## Supported Workflows

- **Create new issue**: Create and assign new issues in repositories.

## Setup

Before getting started, make sure you have a development workspace where you
have permissions to install apps. If you don’t have one set up, go ahead and
[create one](https://slack.com/create).

### Install the Slack CLI

To use this sample, you first need to install and configure the Slack CLI.
Step-by-step instructions can be found in our
[Quickstart Guide](https://api.slack.com/future/quickstart).

### Install the Sample App

Start by cloning this sample and installing it into a workspace:

```zsh
# Clone this project onto your machine
$ slack create my-github-app -t slack-samples/deno-github-functions

# Change into this project directory
$ cd my-github-app

# Install the production instance of the app to a workspace
$ slack install
```

#### Application Instances

All Run-on-Slack applications come in two flavors: the [deployed][deploy], or production,
instance as well as the [locally-running][run], or dev, instance. The deployed instance
is hosted on Slack while the dev instance runs on directly on your computer. This
is an important distinction to keep in mind for two reasons:

1. [Triggers][create-trigger], which execute application Workflows, are instance-
   specific. Each application instance needs its own set of triggers.
2. Some `slack` CLI commands are instance-specific. For example, `slack deploy`
   deploys code for your _production_ instance to Slack hosting. `slack env`
   manages environment variables for your _production_ instance. `slack install`
   installs your _production_ instance to a Slack Workspace. `slack run` starts
   your _dev_ instance in a process on your computer.

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

#### Add the access token to environment variables

Storing your access token as an environment variable allows you to use different
tokens across local and deployed versions of the same app.

##### Locally-running application environment variables

When [developing locally][run], variables found in the `.env` file at the root
of your project are used. For your local development environment, rename `.env.sample`
to `.env` and add your access token to the file contents (replacing `ACCESS_TOKEN`
with your token):

```bash
# .env
GITHUB_TOKEN=ACCESS_TOKEN
```

##### Deployed application environment variables

[Deployed apps][deploy] use variables added using `slack env`. To add your access
token to a Workspace where your deployed app is installed, use the following command
(once again, replacing `ACCESS_TOKEN` with your token):

```zsh
$ slack env add GITHUB_TOKEN ACCESS_TOKEN
```

## Create a Link Trigger

[Triggers][triggers] execute a Workflow; they are an entry point into your
application that are invoked automatically by Slack or manually by users.
This application uses a [Link Trigger][link-triggers] to execute its Workflow
in Slack. Link triggers generate a **Shortcut URL** that unfurls into a button
within Slack. Shortcut URLs can be posted in a channel or added as a bookmark,
and, when clicked, will run the associated Workflow.

To generate a Shortcut URL for a Workflow, we first create a Link Trigger. Link
Triggers are unique to each installed version of your app, meaning Shortcut URLs
will be different across workspaces, as well as
[between locally run and deployed apps][app-instances].

To create a Link Trigger for the "Create New Issue" Workflow, run the following
command:

```zsh
$ slack trigger create --trigger-def triggers/create_new_issue_shortcut.ts
```

You will need to select the Workspace that you want to create your Link Trigger
in _as well as_ which instance of your application to execute when invoked. You
can differentiate between the locally-running version of your application from
the deployed version by the application name in the list: the name with the suffix
`(dev)` is your locally-running version while the name without it is the deployed
version.

Once you selected the Workspace and the application instance, the `slack trigger create`
command will output a Shortcut URL. Copy and paste this URL to a channel or add
it as a bookmark.

You can try clicking it, too, but this link won't run the Workflow until the app
is either running locally or deployed! Read on to learn how to run your project
locally and deploy it to Slack hosting.

## Running Your Project Locally

While building your app, you can see your changes propagated to your workspace
in real-time with `slack run`. You'll know an app is the development version
because the name has the string `(dev)` appended.

```zsh
# Run app locally
$ slack run

Connected, awaiting events
```

Once running, click the [previously created Shortcut URL][create-trigger] associated
with the `(dev)` version of your app. This should begin your Workflow by opening
a form to create a new GitHub issue!

To stop running locally, press `<CTRL> + C` to end the process.

## Deploying Your App

When you're done with development, you can deploy a production version of your app
to Slack hosting using `slack deploy`:

```zsh
$ slack deploy
```

After deploying, the [previously created Shortcut URL][create-trigger] associated
with the production (non-`(dev)`) version of your app should begin the "Create New
Issue" Workflow when clicked!

### Viewing Activity Logs for Your Production App

Activity logs from the production instance of your application can be viewed with the `slack activity` command:

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

[Triggers][triggers] determine when Workflows are executed. A trigger file
describes a scenario in which a workflow should be run, such as a user pressing
a button or when a specific event occurs.

## Resources

To learn more about developing with the CLI, you can visit the following guides:

- [Creating a new app with the CLI](https://api.slack.com/future/create)
- [Configuring your app](https://api.slack.com/future/manifest)
- [Developing locally](https://api.slack.com/future/run)

To view all documentation and guides available, visit the
[Overview page](https://api.slack.com/future/overview).

[triggers]: https://api.slack.com/future/triggers
[link-triggers]: https://api.slack.com/future/triggers/link
[create-trigger]: #create-a-link-trigger
[run-locally]: #running-your-project-locally
[app-instances]: #application-instances
[run]: https://api.slack.com/future/run
[deploy]: https://api.slack.com/future/deploy
