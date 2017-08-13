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

Also as we know this will install bower packages through npm, lets remove it from our dependencies section of cricle.yml.
Commit and push the changes to try again.
The result is quite nice, our app is now functional, and its all automatically deployed.

## Lets complete this app
Our calculator is functional for plus and divide, however we also need to implement the rest to have a proper calculator.
With a deployment pipeline in place, this should be easy, we just have to implement the code and CircleCI + Heroku takes care of the rest.

### Implement minus and ship to Heroku!
Minus should be pretty straight forward, and there is already some unit tests to help out.
Open test/calcCtrl.spec.js and uncomment the lines 84-128 (all of the comments).
When running unit tests with the commend `grunt test`, we notice that they fail due to missing implementation.
Go into src/calcCtrl.js and implement minus.
Running `grunt test` again should report our tests are now passing.

### Lets fail a build and fix it
Before we push our changes, lets fail one of the unit tests to see if build server picks it up!
Change one of the minus unit tests to a different value and verify its failing before sending to server.
Our code failed the build due to a failing unit test, and more importantly it did not deploy any code to Heroku.
Fix the test, push to Github and test it in Heroku.

### Implement multiply by test-driven development
We're still missing multiply implementation.
Start with fixing the unit tests for multiply, we currently have a single test verifying that multiply is not implemented.
Make sure different cases are covered, like multiply with zero and negative numbers.
Run test to verify they are failing, and implement to make them pass.
Push code and test the calculator after its deployed to Heroku!

### How about some static code analysis for our app?
Static code analysis helps us validate that our code is following good coding standards, and avoid causing problems either in future development, by the browser reading our code or by different browsers understanding our code differently.
Lets make sure our code follows the coding practices suggested by JSHint.

Start with adding a js hint package for grunt, [grunt-contrib-jshint](https://github.com/gruntjs/grunt-contrib-jshint), by including it in npm dependencies.
Adding the package is described in the Getting Started section, dont mind the loading part, all grunt packages are already being loaded.
Static code analysis should be part of our testing.
Open circle.yml and add a step below `grunt test` with the command `grunt lint`.
Now its time to define the lint task in Gruntfile.js, add it at bottom and configure it to run 'jshint'.
We have the package loaded, but it needs to be configured.
Add a jshintConfig object and configure it with 2 files, src/calcApp.module.js and src/calcCtrl.js.
Add the configuration object to the property jshint on gruntConfig object.
If in doubt check with the documentation at [grunt-contrib-jshint](https://github.com/gruntjs/grunt-contrib-jshint).
Push your code and see what happens with our build.

The build failed and we get some feedback on whats wrong with our code.
Its complaining that we are defining result variable several times.
And indeed we are, in javascript if blocks does not isolate scope, so even though it will never execute more than one of our blocks in an if/else statement, we are indeed reusing the variable.
Lets assign results directly to vm.result instead, after all we are not doing anything more with it anyway.
Run `grunt lint` to see if we fixed all errors.

There is 2 more issues with our code.
There is a missing semicolon on a statement, and we have a semicolon on a function declaration which is unnecessary.
Fix these issues, run `grunt lint` again to verify no more code issues and push changes.
Now our build should pass and deploy our app!
