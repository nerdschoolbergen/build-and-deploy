# Exercise 3 - Deploying the app to the cloud

:book: In this exercise we are going to use the [Azure Static Web Apps](https://azure.microsoft.com/en-us/products/app-service/static) cloud service to deploy our application and make it available publicly on the internet.

You will learn:

- How to configure the API-token needed for deploy using GitHub Secrets
- Create a new deployment pipeline for automating web app deployment
  
## 3.1 Azure secret setup

:book: To avoid having to register an Azure account, we have prepared a an Azure environment where you can deploy your application.

:pencil2: Open [https://nerdschool-vending-machine.vercel.app/](https://nerdschool-vending-machine.vercel.app/) and follow the instructions to receive an API-token via e-mail.

> :exclamation::exclamation: **Do not share the Azure API-token with anyone else or commit it to the repository.**  :exclamation::exclamation:

 :book: In order to deploy your application, you will need to make use of the API-token you received in order to gain deploy access to the Azure environment.

### 3.1.1 Adding the API-token secret as an GitHub Actions secret

:book: In order to avoid commiting your personal Azure API-token to your git repository (seriously, do _NOT_ this!), we will store the API-token as a _secret_ on GitHub. GitHub Actions secrets are environment variables that are encrypted.

:pencil2: Open the main page for your GitHub repository and select _Settings_

:pencil2: Select _Secrets_ in the left hand menu, under _Security_, then _Actions_.

:pencil2: Select _New repository secret_

:pencil2: Set _Name_ to `AZURE_STATIC_WEB_APPS_API_TOKEN` and _Secret_ to your personal Azure API-token.

:pencil2: Select _Add secret_ to save the Actions secret.

### Deploying the app to Azure using GitHub Actions

:book: To automatically deploy our web app to Azure when we push new commits to GitHub, we will create a new GitHub Actions workflow job.


:pencil2: Open the `main.yaml` inside the `./github/workflows` directory with the following contents. 

```diff
name: Build and deploy

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./code
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16.x
      - run: npm ci
      - run: npm run build
      - run: npm run lint
      - run: npm run test

      - name: Archive artifacts
        uses: actions/upload-artifact@v3
        with:
          name: artifact
          path: ./code/dist

+ deploy:
+   runs-on: ubuntu-latest
+   name: Deploy application to Azure Static Websites
+   needs: build
+   steps:
+     - name: Get artifact from build step
+       uses: actions/download-artifact@v3
+       with:
+         name: artifact
+     - name: Deploy
+       id: deploy
+       uses: Azure/static-web-apps-deploy@v1
+       with:
+         azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
+         action: "upload"
+         app_location: "." 
      
```

<details>
<summary>Click to view the file without the diff syntax</summary>

```yaml
name: Build and deploy

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./code
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16.x
      - run: npm ci
      - run: npm run build
      - run: npm run lint
      - run: npm run test

      - name: Archive artifacts
        uses: actions/upload-artifact@v3
        with:
          name: artifact
          path: ./code/dist

  deploy:
    runs-on: ubuntu-latest
    name: Deploy application to Azure Static Websites
    needs: build
    steps:
      - name: Get artifact from build step
        uses: actions/download-artifact@v3
        with:
          name: artifact
      - name: Deploy
        id: deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "upload"
          app_location: "." 
```
</details>

:pencil2: Let's have a look at what this workflow job does:
- The step `Get artifact from build step` will download the artifact file from our build step and make its content available in the file system of the action runner.
- It uses a premade Action called [`Azure/static-web-apps-deploy`](https://learn.microsoft.com/nb-no/azure/static-web-apps/build-configuration?tabs=github-actions#build-and-deploy) to deploy the artifact to Azure using the `AZURE_STATIC_WEB_APPS_API_TOKEN` as API-token.

:pencil2: Git commit and push these changes.

:pencil2: Open up the Actions tab on your main repository page on GitHub to view the result of the deployment job.

:pencil2: After the job completes succesfully, open up the URL you received from an instructor to see.

:pencil2: Did the workflow run fail :x:?  Try reading the error message and figure out what´s wrong. Ask an instructor if you are stuck.

### [Go to exercise 4 :arrow_right:](../exercise-4/README.md)
