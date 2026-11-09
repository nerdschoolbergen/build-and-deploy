# Event host instructions

## Before the event

There is no infrastructure to set up. Every attendee deploys to their own free Cloudflare account, and no tokens are handed out by the organisers.

Send attendees this checklist in the invitation, so account sign-ups don't eat into workshop time:

1. Install [Node.js](https://nodejs.org/en/download) 26 or newer, [Git](https://github.com/git-guides/install-git) and [Visual Studio Code](https://code.visualstudio.com/).
2. Create a free [GitHub account](https://github.com/signup).
3. Create a free [Cloudflare account](https://dash.cloudflare.com/sign-up) and verify the email address (no credit card needed).

Before each event, run through all exercises once on a fresh fork. GitHub, Cloudflare and the action versions change over time.

## Common problems during the event

| Symptom | Cause and fix |
| --- | --- |
| No workflows run at all | Actions are disabled on new forks. Open the _Actions_ tab on the fork and enable workflows (exercise 1.3.2). |
| `npm ci` fails in the workflow | The step is missing `working-directory: ./code`, or `package-lock.json` wasn't committed. |
| `deploy` job is skipped | It only runs on pushes to `master`. The attendee is pushing to another branch. |
| `npx wrangler login` hangs in a devcontainer or Codespace | The login callback goes to `localhost:8976`. Make sure the port is forwarded, or run the command on the host. |
| `it's necessary to set a CLOUDFLARE_API_TOKEN` | The secret is missing or misspelled. Secret names must match exactly. |
| `Authentication error [code: 10000]` | Wrong or expired token, or the token wasn't given access to the account in `CLOUDFLARE_ACCOUNT_ID`. |
| `You need to register a workers.dev subdomain` | The attendee skipped the local deploy in exercise 3.1. Run `npx wrangler@4 deploy` locally once and pick a subdomain. |
| Pull request shows up on `nerdschoolbergen/build-and-deploy` | The attendee opened the PR against the upstream repository. Close it, and open a new one with _base repository_ set to their own fork (exercise 4.2). |
| Preview job fails with missing secrets | The PR comes from a different fork than the one with the secrets. Branches must be pushed to the attendee's own fork. |
| No preview comment, `Resource not accessible by integration` | The `preview` job is missing `permissions: pull-requests: write`. |

## After the event

Nothing to clean up. Attendees can delete their `build-and-deploy` Worker and the API token if they want to.

Close any pull requests attendees opened against `nerdschoolbergen/build-and-deploy` by mistake.
