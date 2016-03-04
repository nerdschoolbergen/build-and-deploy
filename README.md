# build-and-deploy

This exercise is a javascript application, which currently is only partly implemented.
Using continuous integration and continuous deployment, we will utilize some cloud tools to provide the deployment pipeline.
We will also use several tools which helps with development of javascript applications like npm, bower and grunt.

## Prerequisites
* Bring your own laptop
* Make sure Git is installed and available on command line. Install from [https://git-scm.com/downloads](https://git-scm.com/downloads)
* Node JS with npm must be installed and available on command line. Install from: https://nodejs.org/
* Install text editor of choice, preferrably an editor with directory browser (Sublime, Atom and WebStorm are all good alternatives)
* If you are completely new to JavaScript, it is recommended to explore and test the language beforehand
* We will not go into the details about npm, bower and grunt, if you are interested in how they work, please checkout the exercises from the js-infrastructure session: https://github.com/nerdschoolbergen/js-infrastructure

## Introduction
Its that time again, you added your code to the repo and everybody loves your new feature.
Now you just have to do the 15 manual steps in exactly the same way as last time and deliver a 2 page word document with instructions together with a zip archive to the IT department, so they can deploy the changes.
Or wait, cant this be automated?

In this session we will look at applications and how we can automate every step from pushing code to your repository until its available on your server.
Sounds scary?
We need to rely on code quality and automated testing to make sure our application meets the standards our users expect.
We will go through all the steps from Continuous Integration to Continuous Deployment and then do it ourselves with hands on exercises using online tools.

The benefits of automation is many, but foremost it reduces cost, reduces risk of mistakes and reduces the amount of boring and repetitive work you as a developer need to do.
In most organizations build servers are a vital part of the deployment pipeline, aiming to automate everything that will be repeated.

## Agenda
* Pizza
* 30ish minutes introduction to continuous deployment theory and the technologies we will use today
* Forking git repository and get it running on local computer
* Setup continuous integration with CircleCI
* Setup continuous deployment to Heroku
* Improve our application and watch the automation eliminating manual work.

## Getting started
We will start with creating your own fork of this repository.
Make sure you're logged in and click the Fork button up right.
Clone the repository to your local computer by opening command line, navigate to the folder you wish to work from, and type `git clone <Your new repo url>`

Navigate to the repository folder and run the following commands:

Install bower on command line:

`npm install -g bower`

Install grunt on command line:

`npm install -g grunt-cli`

Install application dependencies:

`npm install`

Once the repository is properly downloaded, open the repository using your favorite text editor.
You will notice 2 folders containing dependencies, bower_components contains the libraries installed by bower during the process when npm install retrieved dependencies.
These are typically dependencies on frontend libraries such as jquery, angular and bootstrap.
The node_modules folder contains dependencies installed by npm, here you will find grunt which is our task runner, bower and karma which is our test runner.
Dont worry about the rest in node_modules folder, its just a bunch of dependencies and some are tasks we will use with grunt.

If you wish to understand more about how npm, bower and grunt is configured, check out this repository: https://github.com/nerdschoolbergen/js-infrastructure

We also have some folders for our application, src, dist and test.
The src folder is where you develop your code, here you will find the javascript files (calcCtrl.js will be important) and the scss file which may be compiled into css.
In the test folder we find a jasmine unit test file to test our calcCtrl file from the src folder.
In the dist folder we have the actual web page we are developing and are supposed to deploy to the clouds!

In the root of the repository we also find a bunch off configuration files.
For now lets not worry about them.

Lets start our application. from command line run the following command:

`grunt startlocal`

The application will now open in your default browser at url: [http://localhost:9601](http://localhost:9601).
Try interracting a bit with the calculator, notice that we have implementation of plus and divide, while minus and multiply are currently not supported.
Also its impossible to divide by zero!

## Continuous integration

### Compiling with grunt

### Testing with grunt and karma

### CircleCI account

### circle.yml

## Continuous deployment

### Heroku account and link to CircleCI

### Procfile

## Lets complete this app

### Implement minus and ship to Heroku!

### Lets fail a build and fix it

### Implement multiply by test-driven development