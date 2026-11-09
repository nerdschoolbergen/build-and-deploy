# Exercise 3 - Deploying the app to the cloud

:book: In this exercise we are going to use [Cloudflare Workers](https://developers.cloudflare.com/workers/) to host our application and make it available publicly on the internet. Cloudflare is a cloud platform with a free plan that doesn't require a credit card.

:book: Just like in most real-life projects, the hosting platform is a separate service from where our code and pipeline live. Our pipeline needs permission to deploy to it, and that permission must be kept secret.

You will learn:

- How to describe a deployment with a configuration file
- How to create a scoped API token for a cloud provider
- How to store the API token safely using GitHub Actions secrets
- How to create a deployment job that only deploys to production from the `master` branch

## 3.1 Deploying from your own computer

:pencil2: If you haven't already, sign up for a free account at [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up) and verify your email address.

:book: Before we automate anything, let's do a deploy the _manual_ way, from our own computer. This is how many projects start out, and it's exactly what our pipeline is going to replace.

:book: Open `code/wrangler.jsonc`. This is the configuration file for [Wrangler](https://developers.cloudflare.com/workers/wrangler/), Cloudflare's command line tool:

```jsonc
{
  "name": "build-and-deploy",
  "compatibility_date": "2026-11-01",
  "assets": {
    "directory": "./dist"
  },
  "workers_dev": true,
  "preview_urls": true
}
```

- `name` - the name of our app (a _Worker_ in Cloudflare terms). It becomes part of the URL.
- `compatibility_date` - locks the behaviour of Cloudflare's runtime to a date, so platform updates don't suddenly change how our app works.
- `assets.directory` - we only serve static files: the `dist` folder created by `npm run build`.
- `workers_dev` and `preview_urls` - publish the app on Cloudflare's free `workers.dev` domain, and allow preview URLs (we'll use those in exercise 4).

:bulb: Describing infrastructure in a file that lives next to the code is called _configuration as code_. Changes to it are reviewed and versioned just like code.

:pencil2: In your terminal, from the `code` folder, build the app and log in to Cloudflare:

```bash
npm run build
npx wrangler@4 login
```

:book: A browser window opens. Log in and select _Allow_.

:pencil2: Deploy the app:

```bash
npx wrangler@4 deploy
```

:exclamation: If Wrangler asks you to register a `workers.dev` subdomain, choose a name. Your apps will live under `<your-subdomain>.workers.dev`.

:book: Wrangler uploads the `dist` folder and prints the URL of your app, something like `https://build-and-deploy.<your-subdomain>.workers.dev`. Open it, your app is live!

:question: What would happen if every developer on a team deployed from their own computer? How would you know which version is live, and whether it was tested?

## 3.2 Creating an API token

:book: For GitHub Actions to deploy on our behalf, it needs to prove that it's allowed to. `wrangler login` logs in as _you_ with full access, which is fine on your own computer, but not something we want to hand to a pipeline. Instead we create an _API token_: a long, random string that acts as a password with limited permissions.

:pencil2: Open [My Profile → API Tokens](https://dash.cloudflare.com/profile/api-tokens) and select _Create Token_.

:pencil2: Find the _Edit Cloudflare Workers_ template and select _Use template_.

:pencil2: Under _Account Resources_, select your account. Under _Zone Resources_, select _All zones_ (we don't use any zones, but the template requires a value).

:pencil2: Under _TTL_, set an end date, for example 30 days from today.

:pencil2: Select _Continue to summary_, then _Create Token_. Copy the token. Cloudflare only shows it once.

:bulb: In real life you want tokens with **as few permissions as possible** and **a limited lifetime**. This token can only manage Workers in your account, and it stops working when it expires. If it leaks, the damage is limited.

> :exclamation::exclamation: **Never share your API token with anyone else or commit it to the repository.** Anyone with the token can deploy anything to your account. :exclamation::exclamation:

:pencil2: Find your **Account ID**: open [the Cloudflare dashboard](https://dash.cloudflare.com/), select _Workers & Pages_, and copy the _Account ID_ shown on the page. You can also run `npx wrangler@4 whoami` in your terminal.

## 3.3 Storing the token as a GitHub Actions secret

:book: To avoid committing the API token to our git repository (seriously, do _NOT_ do this! Bots scan public repositories for tokens within minutes), we store it as a _secret_ on GitHub. GitHub Actions secrets are encrypted, and are hidden in workflow logs.

:pencil2: Open the main page for your repository on GitHub and select _Settings_.

:pencil2: In the left hand menu, under _Security_, select _Secrets and variables_ → _Actions_.

:pencil2: Select _New repository secret_. Set _Name_ to `CLOUDFLARE_API_TOKEN` and _Secret_ to your API token. Select _Add secret_.

:pencil2: Select _New repository secret_ again. Set _Name_ to `CLOUDFLARE_ACCOUNT_ID` and _Secret_ to your Account ID. Select _Add secret_.

:bulb: The account ID isn't really a secret, but storing it next to the token keeps the configuration in one place.

## 3.4 Deploying the app using GitHub Actions

:book: To automatically deploy our app when new commits arrive on `master`, we add a new _job_ to our workflow. It downloads the artifact our `build` job created, and uploads it to Cloudflare using Wrangler, just like you did from your own computer.

:pencil2: Open the file `main.yml` inside the `.github/workflows` directory and add the `deploy` job:

```diff
name: Build and deploy

on:
  push:
    branches: [master]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./code
    steps:
      - uses: actions/checkout@v7
      - name: Use Node.js 26.x
        uses: actions/setup-node@v7
        with:
          node-version: 26.x
      - run: npm ci
      - run: npm run build
      - run: npm run lint
      - run: npm test

      - name: Archive artifacts
        uses: actions/upload-artifact@v7
        with:
          name: artifact
          path: ./code/dist

+ deploy:
+   name: Deploy to production
+   needs: build
+   if: github.event_name == 'push' && github.ref == 'refs/heads/master'
+   runs-on: ubuntu-latest
+   concurrency: production
+   environment:
+     name: production
+     url: ${{ steps.deploy.outputs.url }}
+   defaults:
+     run:
+       working-directory: ./code
+   steps:
+     - uses: actions/checkout@v7
+     - name: Get artifact from build job
+       uses: actions/download-artifact@v8
+       with:
+         name: artifact
+         path: ./code/dist
+     - name: Use Node.js 26.x
+       uses: actions/setup-node@v7
+       with:
+         node-version: 26.x
+     - name: Deploy to Cloudflare
+       id: deploy
+       env:
+         CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
+         CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
+         WRANGLER_OUTPUT_FILE_PATH: ${{ runner.temp }}/wrangler.jsonl
+       run: |
+         npx --yes wrangler@4 deploy --message "Deploy ${{ github.sha }}"
+         echo "url=$(jq -r 'select(.type == "deploy") | .targets[0]' "$WRANGLER_OUTPUT_FILE_PATH")" >> "$GITHUB_OUTPUT"
```

<details>
<summary>Click to view the file without the diff syntax</summary>

```yaml
name: Build and deploy

on:
  push:
    branches: [master]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./code
    steps:
      - uses: actions/checkout@v7
      - name: Use Node.js 26.x
        uses: actions/setup-node@v7
        with:
          node-version: 26.x
      - run: npm ci
      - run: npm run build
      - run: npm run lint
      - run: npm test

      - name: Archive artifacts
        uses: actions/upload-artifact@v7
        with:
          name: artifact
          path: ./code/dist

  deploy:
    name: Deploy to production
    needs: build
    if: github.event_name == 'push' && github.ref == 'refs/heads/master'
    runs-on: ubuntu-latest
    concurrency: production
    environment:
      name: production
      url: ${{ steps.deploy.outputs.url }}
    defaults:
      run:
        working-directory: ./code
    steps:
      - uses: actions/checkout@v7
      - name: Get artifact from build job
        uses: actions/download-artifact@v8
        with:
          name: artifact
          path: ./code/dist
      - name: Use Node.js 26.x
        uses: actions/setup-node@v7
        with:
          node-version: 26.x
      - name: Deploy to Cloudflare
        id: deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          WRANGLER_OUTPUT_FILE_PATH: ${{ runner.temp }}/wrangler.jsonl
        run: |
          npx --yes wrangler@4 deploy --message "Deploy ${{ github.sha }}"
          echo "url=$(jq -r 'select(.type == "deploy") | .targets[0]' "$WRANGLER_OUTPUT_FILE_PATH")" >> "$GITHUB_OUTPUT"
```
</details>

:book: Let's have a look at what this job does:

- `needs: build` - only run after the `build` job has succeeded. A failing test stops the deploy.
- `if: github.event_name == 'push' && github.ref == 'refs/heads/master'` - only deploy to production when something is pushed to `master`. Branches and pull requests are still built and tested, but they don't go live.
- `concurrency: production` - never run two production deploys at the same time. If you push twice quickly, the deploys run one after the other.
- `environment:` - registers the deploy as a [GitHub _environment_](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments) named `production`. GitHub then shows a history of deployments and a link to the live site on your repository page.
- `actions/checkout` - we need `wrangler.jsonc` from the repository.
- `Get artifact from build job` - downloads the exact `dist` folder that was built and tested in the `build` job. We don't build again: what we tested is what we ship.
- `Deploy to Cloudflare` - runs Wrangler with `npx`, just like you did locally:
  - `env:` passes our secrets to Wrangler as environment variables. Wrangler reads `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` automatically, so no `wrangler login` is needed.
  - `--message` - the commit hash is stored with the deployment, so you can see which commit is live in the Cloudflare dashboard.
  - `WRANGLER_OUTPUT_FILE_PATH` - Wrangler writes details about the deploy to this file. We use [jq](https://jqlang.org/) to read the app's URL from it, and save it as a step _output_ so the environment can link to it.

:pencil2: Git commit and push these changes.

:pencil2: Open up the Actions tab on your repository page on GitHub to view the result of the deployment job. When it's done, the workflow run shows a link to your site under the `deploy` job.

:pencil2: Open your app. It should look just like before, but this time it was deployed by your pipeline. In the Cloudflare dashboard, under _Workers & Pages_ → _build-and-deploy_ → _Deployments_, you'll find the deploy with the commit hash as its message.

:pencil2: Did the workflow run fail :x:? Try reading the error message and figure out what's wrong. Ask an instructor if you are stuck.

<details>
<summary>Common problems</summary>

- `In a non-interactive environment, it's necessary to set a CLOUDFLARE_API_TOKEN` - check that the secret name is spelled exactly `CLOUDFLARE_API_TOKEN`.
- `Authentication error [code: 10000]` - the token is wrong, expired, or doesn't have access to the account in `CLOUDFLARE_ACCOUNT_ID`.
- An error saying the `dist` directory `does not exist` - the artifact wasn't downloaded to `./code/dist`. Check the `path` of the download step.
- The `deploy` job was skipped - it only runs on pushes to `master`. Are you on another branch?

</details>

## 3.5 Making a change to the app

:pencil2: Go to the `code/index.html` file and make a change to the file. E.g. you can change the heading of the page. Push the change to GitHub, and see that the change is deployed to the live webpage after the workflow has completed.

```diff
    <div class="clock-container">
-     <h1>🕑</h1>
+     <h1>Welcome to my amazing time app</h1>
```

:book: This is _continuous deployment_: every change that passes our quality checks on `master` goes live automatically, with no manual steps.

### [Go to exercise 4 :arrow_right:](../exercise-4/README.md)
