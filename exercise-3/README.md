# Exercise 3 - CI/CD pipeline setup using GitHub Actions

Instead of setting up a build server from scratch, we'll use GitHub Actions to do all the heavy lifting for us.

As the name implies, this is a service for handling our Continuous Integration steps. We'll have to find another service for hosting our app once we've built and verified it using GitHub Actions.

```mermaid
flowchart TD
    Git[Local git repository]-- Developer pushes new commit -->GitHub
    GitHub-- GitHub triggers Actions workflow -->GitHub_Actions[GitHub Actions]
    GitHub_Actions-- Workflow runs job -->Build_task
    subgraph job1 [ ]
    Build_task[Build code step] --> Test_task[Run tests step]
    end
    subgraph job2 [ ]
    Test_task-- Workflow runs next job --> Deploy_code[Deploy code step]
    end
```

## 3.1 GitHub Actions config

:book: GitHub Actions is "code as configuration", which means that you configure it by simply adding a workflow configuration file to your repository.

:pencil2: Create a new folder at the root of the project called `.github`

:pencil2: Inside `.github`, create a new folder called `workflows`.

### 3.1.1 GitHub Actions Hello World

:book: Before we start doing anything useful with GitHub Actions, we need to get familiar with the basics of how it works.

:pencil2: Inside the `workflows`folder, create a new file named `test.yml` with the following contents:

```yml
name: GitHub Actions Nerdschool Demo
run-name: ${{ github.actor }} is testing out GitHub Actions 🚀
on: [push]
jobs:
  Test-GitHub-Actions:
    runs-on: ubuntu-latest
    steps:
      - run: echo "🎉 The job was automatically triggered by a ${{ github.event_name }} event."
      - run: echo "🐧 This job is now running on a ${{ runner.os }} server hosted by GitHub!"
      - run: echo "🔎 The name of your branch is ${{ github.ref }} and your repository is ${{ github.repository }}."
      - name: Check out repository code
        uses: actions/checkout@v3
      - run: echo "💡 The ${{ github.repository }} repository has been cloned to the runner."
      - run: echo "🖥️ The workflow is now ready to test your code on the runner."
      - name: List files in the repository
        run: |
          ls ${{ github.workspace }}
      - run: echo "🍏 This job's status is ${{ job.status }}."
```

:pencil2: Save and git commit this file. Git push all your changes so far.

:pencil2: Commiting the workflow file in your repository triggers the `push` event and runs your workflow.

### Viewing your workflow results

:pencil2: On GitHub.com, navigate to the main page of your repository.

:pencil2: Under your repository name, click "Actions".

![](images/actions-tab.png)

:pencil2: In the left sidebar, click the workflow you want to see (we named it `GitHub Actions Nerdschool Demo`).

![](images/actions-sidebar.png)

:pencil2: From the list of workflow runs, click the name of the run you want to see (`'xxx' is testing out GitHub Actions 🚀`)

![](images/actions-workflows.png)

:pencil2: Under **Jobs**, click the Test-GitHub-Actions job.

![](images/actions-jobs.png)

# Improving Continuous Integration

Remember that Continuous Integration is all about making sure our code is good enough to be deployed. So far we're not doing much to prove this. We make sure the app can be built, but that's about it. Let's introduce some more quality checks.

## Linting

Linting is just to verify that our code follows certain best practices and code conventions. We use the tool _ESLint_ to do this for us. We have used this tool in other JavaScript workshops also.

Luckily `create-react-app` also included ESLint along with some rules (the `eslint-*` packages listed under `dependencies` in `package.json`, but it does not run it by default.

> We added the `eslint-config-airbnb` package in addition to the create-react-app defaults. The Airbnb config is by many seen as the defacto standard for modern JavaScript code practices.

> We're also overriding certain rules in the `.eslintrc.js` file because some rules are unnecessarily strict and hard to work with.

:pencil2: Open `package.json` and add `"lint": "eslint src/**/*.js src/**/*.jsx"` under `"scripts"`. This will run eslint on .js and .jsx files.

```
"scripts": {
  ...
  "lint": "eslint src/**/*.js src/**/*.jsx"
},
```

:pencil2: Run `npm run lint` in your terminal. The command should take a few seconds, then exit without errors.  
:pencil2: Open `src/PosterCard.jsx` and comment out line 38 (`classes: PropTypes.object.isRequired,`) and run `lint` again. It should now fail with one error:

```
20:23  error  'classes' is missing in props validation  react/prop-types
```

This is an example of linting helping us enforce good coding practices.

> All modern code editors and IDE's has plugins for ESLint so you get warnings and errors inline in your editor which is very helpful. [Like this](./images/eslint01.png).

:pencil2: Undo the comment and save the file as it was.

## Testing

There is already a script for running our tests in package.json.

:pencil2: Run `npm test` and see that it succeeds. If the terminal says "No tests found related to files changed since last commit" or something similar, press the `a` key to make it run all tests regardless. Press the `q` key to exit. When running this script on our CI, it won't enter this REPL loop or watch mode. It'll just run through all tests once and exit the script.

## Run our CI steps on Travis

Now that we've added more scripts to run, we need to tell Travis about them, and the order in which to run them.

:pencil2: Open `.travis.yml` and change `scripts` to be a list of commands:

```yml
script:
  - npm run lint
  - npm test
  - npm run build
```

Note that in yml files, whitespace/indentation matters. Each list item should be two spaces in.

:pencil2: Commit all changes and push them to git.  
:pencil2: Open Travis again and watch the build succeed.  
:pencil2: Locate the lint and test scripts in the build log and see that they succeeds.

![](./images/travis02.png)

Well done so far :tada:! Next, we'll deploy the app.

### [Go to exercise 4 :arrow_right:](../exercise-4/README.md)
