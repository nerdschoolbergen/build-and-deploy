# Exercise 3 - Deploying the app to the cloud

:book: In this exercise we are going to use [Netlify](https://www.netlify.com/) to host our application and make it available publicly on the internet. Netlify is a cloud platform for hosting websites, with a free plan that doesn't require a credit card.

:book: Just like in most real-life projects, the hosting platform is a separate service from where our code and pipeline live. Our pipeline needs permission to deploy to it, and that permission must be kept secret.

You will learn:

- How to create a scoped API token for a cloud provider
- How to store the API token safely using GitHub Actions secrets
- How to create a deployment job that only deploys to production from the `master` branch

## 3.1 Creating a site on Netlify

:pencil2: If you haven't already, sign up for a free account at [app.netlify.com/signup](https://app.netlify.com/signup), following the steps in [exercise 1.2.2](../exercise-1/README.md#122-netlify-account). Remember to **skip** _Deploy your first project_ at the end of the sign-up.

:book: Before we automate anything, let's do a deploy the _manual_ way. This is how many people deploy their first site, and it's exactly what our pipeline is going to replace.

:pencil2: Build the app locally. In your terminal, from the `code` folder, run:

```bash
npm run build
```

:pencil2: Open [app.netlify.com/drop](https://app.netlify.com/drop) and drag and drop the `code/dist` folder onto the page.

:book: Netlify creates a new _project_ for you with a random name, and shows _Your project is ready!_ with the URL of your app (something like `https://cool-biscuit-e7be17.netlify.app`).

:pencil2: Netlify says the project is _currently visible only to your team_. Make sure _Who can access your live project_ is set to _Public_, and select **Make public**. Otherwise everyone else gets a Netlify login page instead of your app.

:pencil2: Open the URL in a private browser window to check that your app is live for everyone.

:pencil2: Optional: give your project a nicer name by selecting _Edit_ next to the domain. The name becomes part of your URL.

:pencil2: Open your project's overview page by selecting the project name in the breadcrumb at the top of the page (_Projects_ / _your-project-name_). You can also select the _Projects_ icon (stacked layers, just below your team's initial) in the narrow menu on the far left, and then your project. Next to the project name you should see a green **Public** badge.

:pencil2: Select _Project configuration_ (the button under the project name, or the item in the menu on the left), then copy the **Project ID** from _General_ → _Project details_. Netlify notes that it's _also known as Site ID_. You'll need it in a moment.

:bulb: You'll come back to this project page later. It lists every deploy under _Activity_.

:question: What would happen if every developer on a team deployed by dragging folders from their own computer? How would you know which version is live, and whether it was tested?

## 3.2 Creating an API token

:book: For GitHub Actions to deploy on our behalf, it needs to prove that it's allowed to. We do that with an _API token_: a long, random string that acts as a password for automated tools.

:pencil2: Open [User settings → Applications → Personal access tokens](https://app.netlify.com/user/applications#personal-access-tokens) and select _New access token_.

:pencil2: Enter a description like `build-and-deploy GitHub Actions`, so you'll remember later what the token is used for.

:pencil2: Keep the default _Expiration_ of **7 days**. That's plenty for this workshop, and you can finish at home.

:pencil2: Select _Generate token_. Netlify shows _New token created_ with your token.

:exclamation: Netlify only shows the token **once**. Keep this page open, and do the next step (3.3) in a new browser tab. Copy the token with the copy button when you need it, and only select _Done_ after you've saved it as a GitHub secret. If you lose it, just delete it and create a new one.

:bulb: In real life you want tokens with **as few permissions as possible** and **a limited lifetime**. A Netlify personal access token can do everything your user can do, so the expiry date is your main protection if it leaks. When the token expires, the deploy job fails with an authentication error. You then create a new token and update the secret. Teams do this regularly, and it's called _rotating_ a secret. Many cloud providers also let you limit a token to specific projects or actions. Use that when you can.

> :exclamation::exclamation: **Never share your API token with anyone else or commit it to the repository.** Anyone with the token can deploy anything to your sites. :exclamation::exclamation:

## 3.3 Storing the token as a GitHub Actions secret

:book: To avoid committing the API token to our git repository (seriously, do _NOT_ do this! Bots scan public repositories for tokens within minutes), we store it as a _secret_ on GitHub. GitHub Actions secrets are encrypted, and are hidden in workflow logs.

:pencil2: Open the main page for your repository on GitHub and select _Settings_.

:pencil2: In the left hand menu, under _Security_, select _Secrets and variables_ → _Actions_.

:pencil2: Select _New repository secret_. Set _Name_ to `NETLIFY_AUTH_TOKEN` and _Secret_ to your API token (use the copy button on the Netlify page you kept open). Select _Add secret_.

:pencil2: Now you can select _Done_ on the Netlify token page.

:pencil2: Select _New repository secret_ again. Set _Name_ to `NETLIFY_SITE_ID` and _Secret_ to the Project ID you copied earlier. Select _Add secret_.

:bulb: The project ID isn't really a secret, but storing it next to the token keeps the configuration in one place. The Netlify CLI calls it a _site ID_, hence the secret name.

## 3.4 Deploying the app using GitHub Actions

:book: To automatically deploy our app when new commits arrive on `master`, we add a new _job_ to our workflow. It downloads the artifact our `build` job created, and uploads it to Netlify using the [Netlify CLI](https://docs.netlify.com/cli/get-started/).

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
+   steps:
+     - name: Get artifact from build job
+       uses: actions/download-artifact@v8
+       with:
+         name: artifact
+         path: dist
+     - name: Use Node.js 26.x
+       uses: actions/setup-node@v7
+       with:
+         node-version: 26.x
+     - name: Deploy to Netlify
+       id: deploy
+       env:
+         NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
+         NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
+       run: |
+         npx --yes netlify-cli@27 deploy --dir=dist --prod --no-build \
+           --message "Deploy ${{ github.sha }}" --json > deploy.json
+         echo "url=$(jq -r '.url' deploy.json)" >> "$GITHUB_OUTPUT"
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
    steps:
      - name: Get artifact from build job
        uses: actions/download-artifact@v8
        with:
          name: artifact
          path: dist
      - name: Use Node.js 26.x
        uses: actions/setup-node@v7
        with:
          node-version: 26.x
      - name: Deploy to Netlify
        id: deploy
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        run: |
          npx --yes netlify-cli@27 deploy --dir=dist --prod --no-build \
            --message "Deploy ${{ github.sha }}" --json > deploy.json
          echo "url=$(jq -r '.url' deploy.json)" >> "$GITHUB_OUTPUT"
```
</details>

:book: Let's have a look at what this job does:

- `needs: build` - only run after the `build` job has succeeded. A failing test stops the deploy.
- `if: github.event_name == 'push' && github.ref == 'refs/heads/master'` - only deploy to production when something is pushed to `master`. Branches and pull requests are still built and tested, but they don't go live.
- `concurrency: production` - never run two production deploys at the same time. If you push twice quickly, the deploys run one after the other.
- `environment:` - registers the deploy as a [GitHub _environment_](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments) named `production`. GitHub then shows a history of deployments and a link to the live site on your repository page.
- `Get artifact from build job` - downloads the exact `dist` folder that was built and tested in the `build` job. We don't build again: what we tested is what we ship.
- `Deploy to Netlify` - runs the Netlify CLI with `npx`:
  - `env:` passes our secrets to the command as environment variables. The Netlify CLI reads `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` automatically.
  - `--dir=dist` - the folder to upload
  - `--prod` - publish to the live production URL
  - `--no-build` - don't let Netlify build the app again, we already did that
  - `--json` - print the result as JSON. We use [jq](https://jqlang.org/) to read the site URL from it, and save it as a step _output_ so the environment can link to it.

:pencil2: Git commit and push these changes.

:pencil2: Open up the Actions tab on your repository page on GitHub to view the result of the deployment job. When it's done, the workflow run shows a link to your site under the `deploy` job.

:pencil2: Open your Netlify site. It should look just like before, but this time it was deployed by your pipeline. In the Netlify dashboard under _Deploys_, you'll find the deploy with the commit hash as its message.

:pencil2: Did the workflow run fail :x:? Try reading the error message and figure out what's wrong. Ask an instructor if you are stuck.

<details>
<summary>Common problems</summary>

- `Authentication required. NETLIFY_AUTH_TOKEN is not set` - check that the secret name is spelled exactly `NETLIFY_AUTH_TOKEN`.
- `Project not found` - check the `NETLIFY_SITE_ID` secret. It must be the Project ID, not the project name.
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
