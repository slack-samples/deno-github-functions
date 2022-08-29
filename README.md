# Workflows for GitHub Sample App

This app brings oft-used GitHub functionality - such as creating new issues - to Slack using functions and workflows.

**Guide outline**:

- [Supported workflows](#supported-workflows)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Clone the sample](#clone-the-sample)
  - [Install to a Workspace](#install-to-a-workspace)
  - [Authorize with GitHub](#authorize-with-github)
  - [Create a link trigger](#create-a-link-trigger)
  - [Run or deploy your app](#run-or-deploy-your-app)
- [Project structure](#project-structure)

---

## Supported workflows

- **Create new issue**: Create and assign new issues in  user-defined repositories.

## Getting started

The following steps will take you through creating a Run On Slack app with workflows for performing GitHub actions on your behalf! After configuring your app, you can run your app locally or deploy your app to Slack.

### Prerequisites

To run this sample, you will need to have installed and authorized the Slack CLI. A refresher of these steps can be found in our [Quickstart Guide](https://api.slack.com/future/quickstart).

You'll also need a development workspace with permissions to install apps. If you don’t have one set up, go ahead and [create one](https://slack.com/get-started#/createnew).

Lastly, you will need access to `sudo mode` on a GitHub account to [create a "Personal access token"](#authorize-with-github). With that, we can begin!

### Clone the sample

The sample app repository can be cloned using the following commands:

```zsh
# Clone the sample app
slack create my-github-app -t slack-samples/deno-github-functions

# Change into the new project directory
cd my-github-app
```

### Install to a Workspace

Install your app to a Workspace of your choice with `slack install`

### Authorize with GitHub

A personal access token is required when calling the GitHub API. Tokens can be created in [your developer settings on GitHub](https://github.com/settings/tokens).

> Your personal access token allows your application to perform the API calls used by functions as though it was _from your GitHub account_. That means all issues created from the Create GitHub issue workflow will appear to have been created by the account associated with the personal access token in use!

#### Required scopes

To access public repositories, create a new personal token with the following scopes:

- `public_repo`, `repo:invite`
- `read:org`
- `read:user`, `user:email`
- `read:enterprise`

To prevent `404: Not Found` errors **when attempting to access private repositories**, the `repo` scope must be selected.

#### Add the token to your environment

Add your newly created token as an environment variable for your app using the following command, replacing `ACCESS_TOKEN` with your actual token:

```zsh
slack env add GITHUB_TOKEN ACCESS_TOKEN
```

### Create a link trigger

To initiate the "create new issue" workflow from Slack, a link trigger can be created as a starting point. Go ahead and create a trigger on either the `(dev)` or deployed version of your app with the following command:

```zsh
slack trigger create --trigger-def triggers/create_new_issue_shortcut.ts
```

You're almost there! You can paste this newly created "Shortcut URL" into a channel or add it as a bookmark. After running or deploying your app (the difference is explained in the next section) this link will begin your workflow!

### Run or deploy your app

Begin your app by either running your app locally or deploying your app to Slack.

- `slack run` creates and installs a `(dev)` version of your app that is run on a local development server. Changes to your code automatically sync to the `(dev)` version in your workspace. To stop a running dev app, use `<CTRL> + c`
- `slack deploy` installs your app to a Workspace then packages and deploys your app to Slack.

After your app begins to run locally or is successfully deployed, try clicking the "create new issue" trigger link. If all went well, a form to create a new issue should appear!

## Project structure

**`functions/`** - custom functions that have a definition (`definition.ts`) and function handler (`mod.ts`, like a "module" file). The handler of a custom function is usually exported from `mod.ts`. The `definition.ts` file defines a [custom Run on Slack function](https://api.slack.com/future/functions/custom).

**`triggers/`** - a directory with definitions of actions and inputs that begin workflows. Possible types of these actions - known as triggers - is described in the [trigger types documentation](https://api.slack.com/future/triggers#types).

**`workflows/`** - files that define and provide the inputs for each step in a workflow. The definition of a workflow's flow is detailed in [the Workflows docs](https://api.slack.com/future/workflows).

**`manifest.ts`** - the configuration file for your app. This defines user-facing information (such as the name, description, and icon) and  app-related context (functions, workflows, and bot scopes).

**`slack.json`** - a required file for running Slack CLI apps. This file allows your CLI to "hook" into the SDK used by your project to run necessary scripts.