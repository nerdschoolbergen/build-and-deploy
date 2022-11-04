# Exercise 3 - Deploying the app to the cloud

:book: In this exercise we are going to use [Azure Static Web Apps](https://azure.microsoft.com/en-us/products/app-service/static) to deploy our application and make it available publicly on the internet.

You will learn:
- How to configure the API-key needed for deploy using GitHub Secrets
- 

## 3.1 Azure secret setup

:book: To avoid having to register an Azure account, we have prepared a an Azure environment where you can deploy your application.

:pencil2: Ask an instructor to provide you with a secret Azure API-key and a URL of the web application, if you haven't received it already.

> :exclamation::exclamation: **Do not share the Azure API-key with anyone else or commit it to the repository.**  :exclamation::exclamation:

 :book: In order to deploy your application, you will need to make use of the API-key you received in order to gain deploy access to the Azure environment.

### 3.1.1 Adding the API-key secret as an GitHub Actions secret

:book: In order to avoid commiting your personal Azure API-key to your git repository (seriously, do _NOT_ this!), we will store the API-key as a _secret_ on GitHub. GitHub Actions secrets are environment variables that are encrypted.

:pencil2: Open the main page for your GitHub repository and select _Settings_

:pencil2: Select _Secrets_ in the left hand menu, under _Security_, then _Actions_.

:pencil2: Select _New repository secret_

:pencil2: Set _Name_ to `AZURE_STATIC_WEB_APPS_API_TOKEN` and _Secret_ to your personal Azure API-key.

:pencil2: Select _Add secret_ to save the Actions secret.
___

### [Go to exercise 4 :arrow_right:](../exercise-4/README.md)
