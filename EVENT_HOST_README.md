# Event host instructions

## Before the event

There is no infrastructure to set up. Every attendee deploys to their own free Netlify account, and no tokens are handed out by the organisers.

Send attendees this checklist in the invitation, so account sign-ups don't eat into workshop time:

1. Install [Node.js](https://nodejs.org/en/download) 26 or newer, [Git](https://github.com/git-guides/install-git) and [Visual Studio Code](https://code.visualstudio.com/).
2. Create a free [GitHub account](https://github.com/signup).
3. Create a free [Netlify account](https://app.netlify.com/signup) (sign up with GitHub, no credit card needed). When asked for a team name, use your own name or GitHub username. Then select _Skip this step for now_ on _Deploy your first project_: don't import the Git repository.

Before each event, run through all exercises once on a fresh fork. GitHub, Netlify and the action versions change over time.

## Common problems during the event

| Symptom | Cause and fix |
| --- | --- |
| No workflows run at all | Actions are disabled on new forks. Open the _Actions_ tab on the fork and enable workflows (exercise 1.3.2). |
| The site URL shows a Netlify login page | The project is only visible to the attendee's team. On the project, set _Who can access your live project_ to _Public_ (exercise 3.1). |
| The preview link in the PR shows a Netlify login page | Previews are private by default and only work when logged in to Netlify. Expected; see exercise 4.3. |
| Netlify builds the site by itself on every push, or a project is linked to the GitHub repository | The attendee chose _Import a Git repository_ during sign-up. Let them create a new project with Netlify Drop (exercise 3.1) and use that Project ID. They can delete the imported project. |
| `npm ci` fails in the workflow | The step is missing `working-directory: ./code`, or `package-lock.json` wasn't committed. |
| `deploy` job is skipped | It only runs on pushes to `master`. The attendee is pushing to another branch. |
| `Authentication required. NETLIFY_AUTH_TOKEN is not set` | The secret is missing or misspelled. Secret names must match exactly. |
| Deploys worked before but now fail with `Unauthorized` or `Authentication required` | The Netlify token has expired (7 days by default). Create a new token and update the `NETLIFY_AUTH_TOKEN` secret. |
| `Project not found` | `NETLIFY_SITE_ID` holds the project _name_ instead of the Project ID. |
| Pull request shows up on `nerdschoolbergen/build-and-deploy` | The attendee opened the PR against the upstream repository. Close it, and open a new one with _base repository_ set to their own fork (exercise 4.2). |
| Preview job fails with missing secrets | The PR comes from a different fork than the one with the secrets. Branches must be pushed to the attendee's own fork. |
| No preview comment, `Resource not accessible by integration` | The `preview` job is missing `permissions: pull-requests: write`. |

## After the event

Nothing to clean up. Attendees can delete their Netlify project and the API token if they want to.

Close any pull requests attendees opened against `nerdschoolbergen/build-and-deploy` by mistake.
