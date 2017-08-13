# Exercise 1 - Getting Started

It's that time again. You just finished an awesome new feature which everybody can't wait to get their hands on!
Now you just have to do the 15 manual, repetitive, laborious steps exactly the same way as before, and deliver a 2-page Word document with instructions, together with a zip archive of your build to the IT department so they can deploy the changes.

Or wait. Can't this be automated?

In this workshop we'll look at applications and how we can automate every step from pushing code to your repository to make it available on the production server(s).

Sounds scary?

We'll need to rely on _code quality_ and _automated testing_ to make sure our application meets the standards our users expect. After all, we want to _reduce_ human interference throughout this whole workflow, and we therefore need to make sure the build we push through the pipeline is good enough to be deployed to the users.

We will go through all the steps, from _Continuous Integration_ to _Continuous Deployment_, and then do it ourselves with hands-on exercises using online tools.

The benefits of automating the deployment workflow is many, but chief among them is cost reduction, risk reduction, minimizing risk of human error, and make our life as developers better as we don't have to labor through repetitive tasks.

In most organizations, _build servers_ are a vital part of the deployment pipeline, aiming to automate the whole build process and preferably, the deployment process.

### In this exercise we will
* _Fork_ and _clone_ our Git repository and get it running on your computer.
* Setup _continuous integration_ using CircleCI
* Setup _continuous deployment_ using Heroku
* Improve our simple calculator application and watch the automation eliminate manual work.

# 1.1 Getting started

First you need a copy of this Git repository on your computer. You'll also need to _push_ changes to Git in order to trigger builds, but at the moment this repository is owned by the Nerschool GitHub organization. To make your own copy of this repository that you'll have full access to, you must _Fork_ this repository.

:pencil2: Make sure you're logged in to GitHub.  
:pencil2: In this Git repository, click the _Fork_ button in the top right corner.  

![img01](./images/img01.png)

:pencil2: After forking, you should now have a copy of the repository on _your account_. Clone the repository to your computer by opening a terminal and navigate to the folder you want to store your code. Type `git clone {repository url}` to clone it.

![img02](./images/img02.png)

![img03](./images/img03.png)

:pencil2: Navigate to the repository folder and run the following commands:  

- Install Bower on your computer: `npm install -g bower`
- Install Grunt on command line: `npm install -g grunt-cli`
- Install our application's dependencies: `npm install`

> :bulb: The `-g` switch when installing packages using npm indicates that the package will be installed globally on your computer instead of locally within your application. Typically this is used to make packages available on our PATH so they can be invoked using a terminal.  

> :exclamation: You might need to restart your terminal window after installing bower and grunt-cli. Typing `grunt --version` and `bower -v` in the terminal should return version numbers and not errors.

:pencil2: Once everything is installed, open the repository using your favorite text editor.

> :book: You will notice 2 folders containing dependencies.
- The `bower_components` folder contains libraries installed by Bower. Bower installs its dependencies through the `npm install` command we just did.
Bower is typically used for _front-end_ dependencies such as jQuery, Angular, and Bootstrap.
- The `node_modules` folder contains dependencies installed by _npm_, here you'll find Grunt, which is our task runner, Bower itself, and KarmaJS which is our test runner.

> :book: There's also some folders belonging to our application: `src`, `dist` and `test`.  
- The `src` folder is where you develop your code. It contains JavaScript files (`calcCtrl.js` will be important later) and the `.scss` file which'll be compiled into css and contains our styling.  
- The `test` folder contains a Jasmine unit test file to test our `src/calcCtrl` file.  
- The `dist` folder contains the actual html web page we are developing and are supposed to deploy to production.

Also note the configuration files in the root folder, such as `package.json`, `Gruntfile.js`, `bower.json`, `circle.yml`, and `Procfile`. We'll come back to each of these later. For now, let's start the application and see what it does.

:pencil2: In a terminal/command line, make sure you're in the same folder as `package.json` (that goes for all commands you'll run from here on). Then run `grunt startlocal`.

The application will now open in your default browser at url: [http://localhost:9601](http://localhost:9601).

:pencil2: Try interacting with the calculator. Notice that addition and division is implemented, while subtracting and multiplying is not.

### [Go to exercise 2 :arrow_right:](./exercise-2.md)
