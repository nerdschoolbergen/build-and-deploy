# Exercise 4 - Preview deploys for pull requests

:book: Right now, every change pushed to `master` goes straight to production. That's great for speed, but in real teams changes are usually made on a _branch_ and reviewed in a _pull request_ (PR) before they are merged into `master`.

:book: Reviewing code is easier if you can actually _see_ the change running. Many teams therefore deploy every pull request to its own temporary _preview_ URL, and post the link in the pull request so reviewers can click it.

You will learn:

- How to work with branches and pull requests
- How to deploy a preview of every pull request, without touching production
- How a workflow can write back to GitHub, like commenting on a pull request

## 4.1 Making a change on a branch

:pencil2: Create a new branch and switch to it:

```bash
git checkout -b change-background
```

:pencil2: Make a visible change to the app. For example, change the background color in `code/src/style.css`:

```diff
body {
- background-color: #fafafa;
+ background-color: #ffe4ec;
}
```

:pencil2: Commit the change and push the branch to GitHub:

```bash
git push -u origin change-background
```

:book: Open the Actions tab. Did anything run? Remember the `on:` section in our workflow: we only run on pushes to `master` and on pull requests. A push to another branch doesn't trigger anything yet.

## 4.2 Opening a pull request

:pencil2: On your repository page on GitHub, select _Compare & pull request_ (or go to _Pull requests_ → _New pull request_).

> :exclamation: **Important:** Since your repository is a fork, GitHub suggests opening the pull request against the **original** `nerdschoolbergen/build-and-deploy` repository. Change _base repository_ to **your own** fork (`<your-username>/build-and-deploy`) and _base_ to `master`.

:pencil2: Select _Create pull request_.

:book: Open the _Checks_ tab on the pull request, or the Actions tab. The `build` job runs and checks your change, but the `deploy` job is _skipped_: production deploys only happen from `master`.

:bulb: Teams often protect `master` with [branch protection rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches), so changes _must_ go through a pull request with a passing build before they can be merged.

## 4.3 Deploying a preview

:book: Cloudflare can keep many _versions_ of the same Worker. `wrangler versions upload` uploads a new version **without** making it live, and gives it its own preview URL. With `--preview-alias` we choose a readable name, so the preview for pull request number 1 ends up at `https://pr-1-build-and-deploy.<your-subdomain>.workers.dev`.

:pencil2: Add a new `preview` job to `.github/workflows/main.yml`, below the `deploy` job:

```diff
  deploy:
    name: Deploy to production
    # ... unchanged ...

+ preview:
+   name: Deploy preview
+   needs: build
+   if: github.event_name == 'pull_request'
+   runs-on: ubuntu-latest
+   permissions:
+     pull-requests: write
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
+     - name: Upload preview to Cloudflare
+       id: deploy
+       env:
+         CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
+         CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
+         WRANGLER_OUTPUT_FILE_PATH: ${{ runner.temp }}/wrangler.jsonl
+       run: |
+         npx --yes wrangler@4 versions upload \
+           --preview-alias "pr-${{ github.event.number }}" \
+           --message "PR #${{ github.event.number }}"
+         echo "url=$(jq -r 'select(.type == "version-upload") | .preview_alias_url' "$WRANGLER_OUTPUT_FILE_PATH")" >> "$GITHUB_OUTPUT"
+     - name: Comment preview URL on the pull request
+       env:
+         GH_TOKEN: ${{ github.token }}
+       run: |
+         gh pr comment "${{ github.event.number }}" --repo "${{ github.repository }}" \
+           --edit-last --create-if-none \
+           --body "🚀 Preview of ${{ github.event.pull_request.head.sha }} is ready: ${{ steps.deploy.outputs.url }}"
```

<details>
<summary>Click to view the whole file without the diff syntax</summary>

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

  preview:
    name: Deploy preview
    needs: build
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
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
      - name: Upload preview to Cloudflare
        id: deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          WRANGLER_OUTPUT_FILE_PATH: ${{ runner.temp }}/wrangler.jsonl
        run: |
          npx --yes wrangler@4 versions upload \
            --preview-alias "pr-${{ github.event.number }}" \
            --message "PR #${{ github.event.number }}"
          echo "url=$(jq -r 'select(.type == "version-upload") | .preview_alias_url' "$WRANGLER_OUTPUT_FILE_PATH")" >> "$GITHUB_OUTPUT"
      - name: Comment preview URL on the pull request
        env:
          GH_TOKEN: ${{ github.token }}
        run: |
          gh pr comment "${{ github.event.number }}" --repo "${{ github.repository }}" \
            --edit-last --create-if-none \
            --body "🚀 Preview of ${{ github.event.pull_request.head.sha }} is ready: ${{ steps.deploy.outputs.url }}"
```
</details>

:book: Let's have a look at what's new:

- `if: github.event_name == 'pull_request'` - this job only runs for pull requests, the opposite of the `deploy` job.
- `permissions: pull-requests: write` - every workflow run gets a temporary `GITHUB_TOKEN` that can talk to the GitHub API. By default it has very limited rights. Here we give this job permission to write to pull requests, and nothing else.
- `wrangler versions upload` instead of `wrangler deploy` - the new version is uploaded, but production keeps serving the current version.
- `--preview-alias "pr-${{ github.event.number }}"` - the preview gets a stable URL based on the pull request number. New commits on the same pull request update the same preview.
- `preview_alias_url` - we read the preview URL from Wrangler's output file, just like in the `deploy` job.
- `Comment preview URL on the pull request` - uses the [GitHub CLI](https://cli.github.com/) (`gh`), which is preinstalled on GitHub's runners, to post the URL as a comment. `--edit-last --create-if-none` updates the same comment on every new commit, instead of adding a new one each time.

:pencil2: Commit and push the workflow change **to your branch** (`change-background`). The pull request updates automatically.

:pencil2: Wait for the workflow to finish. A comment with a link to your preview should appear on the pull request. Open it and check that you can see the new background color.

:pencil2: Open your production site. It should still have the old background.

:pencil2: Did the workflow run fail :x:? Try reading the error message and figure out what's wrong. Ask an instructor if you are stuck.

:book: Secrets and pull requests from strangers: if someone _else_ forks your repository and opens a pull request, GitHub does **not** give their workflow run access to your secrets, and its `GITHUB_TOKEN` is read-only. Otherwise anyone could change the workflow file in a pull request and steal your API token. That's why our preview only works for pull requests from branches in your own repository, which is how most teams work.

## 4.4 Merging to production

:pencil2: Happy with the preview? Select _Merge pull request_ on GitHub, and _Confirm merge_.

:book: Merging creates a new commit on `master`, which triggers the workflow with a `push` event. This time the `deploy` job runs and the preview job is skipped.

:bulb: Preview versions are only uploaded, never made live. In the Cloudflare dashboard under _Workers & Pages_ → _build-and-deploy_ → _Deployments_ you can see every version and which one is serving production.

:pencil2: Wait for the workflow to finish and open your production site. The new background color is now live :tada:

:pencil2: Switch back to `master` locally and pull the merged changes:

```bash
git checkout master
git pull
```

:book: You now have a pipeline that looks a lot like what real teams use every day:

1. Every pull request is built, linted and tested, and gets its own preview.
2. Every merge to `master` is deployed to production automatically.
3. Nobody needs the production API token on their own computer, and nobody deploys by hand.

### [Go to exercise 5 (bonus) :arrow_right:](../exercise-5/README.md)
