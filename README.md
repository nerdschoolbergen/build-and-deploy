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

Lets start our application. From command line run the following command:

`grunt startlocal`

The application will now open in your default browser at url: [http://localhost:9601](http://localhost:9601).
Try interracting a bit with the calculator, notice that we have implementation of plus and divide, while minus and multiply are currently not supported.
Also its impossible to divide by zero!

## Continuous integration
Continuous integration is a series of steps with the purpose of proving the code does not meet appropriate standards.
If the process are not able to prove issues with the code, the build passes and code are verified.
Steps involved are different from project to project, but often covers these steps:
 * Download code from repository, fail build if repo could not be reached
 * Download dependencies for code, fail build if not able to retrieve a dependency
 * Build the code, fail build if not able to build
 * Run unit tests, fail build if a test fails

Other steps are also common, such as static code analysis to validate against code standards, integration tests, scripted GUI tests, etc.

### Building with grunt
Our build process will consist of a few steps to download code and dependencies, before we compile a css file, concatenate multiple javascript and css files into a single before minifying them.
The steps for downloading and building code have already occurred for us by the commands we previously executed.
Open packages.json and see the configuration for postinstall in the scripts object.
This tells npm to run the command `bower install && grunt build` right after `npm install`.
Lets break down what is happening:
* Download code: `git clone` for new repository or `git pull` to get changes from existing repository.
* Download dependencies: `npm install` downloads npm dependencies and immediately after runs `bower install` to download bower packages.
* The && clause causes `grunt build` to run right after `bower install`. "build" is an alias for running several tasks within grunt in sequence:
  * `grunt sass` will compile calcApp.sass into calcApp.css
  * `grunt concat` will combine jquery.js, angular.js and bootstrap.js from bower folders and calcApp.module.js and calcCtrl.js from src folder into a single file: script.js, and bootstrap.css from bower folder and calcApp.css from src folder into a single css file: style.css
  * `grunt uglify` will minify the javascript file src/script.js into dist/script.min.js
  * `grunt cssmin` will minify the css file src/style.css into dist/style.min.css

Lets try to run this step by step to see whats actually happening. Start by deleting the following:
* bower_components folder
* dist/script.min.js
* dist/style.min.css
* src/calcApp.css
* src/script.js
* src/style.css

Run the command `grunt connect:local`, and see that our web page is currently not very functional!

Now lets run some commands and see what happends:
* `bower install`, notice how bower_components folder is created with our dependencies
* `grunt sass`, notice src/calcApp.css is created, open and examine contents
* `grunt concat`, notice src/script.js and src/style.css is created, open and examine contents
* `grunt uglify`, notice dist/script.min.js is created, open and examine contents
* `grunt cssmin`, notice dist/style.min.css is created, open and examine contents

Running the command `grunt connect:local` will now serve our web page and it now works!
We had to do alot of things in correct order to make this work, isnt it nice to automate those repetitive tasks?

### Testing with grunt and karma
Open the file test/calcCtrl.spec.js.
This is a unit test to verify that the engine behind our calculator works correctly.
Unit tests are valuable to verify logic and a vital part of continuous integration.
If everything is to be automated, we have to trust that our unit tests will uncover any defects in our code.
Lets try to run our unit tests: `grunt karma:unit`

The console should report that 21 of 21 unit tests succeeded.
So how does a failing unit test look like?
Try changing the 2+2 unit test to calculate 2+3 instead and run `grunt karma:unit`.
Revert your change to make the unit test succeed again.

We already created an alias for `grunt karma:unit`, rather run `grunt test` and see that results are the same.
Open packages.json and see the configuration for test in the scripts object.
This tells npm that test execution should run the command `grunt test`.
Try it by running `npm test`.
We will come back to why this is handy in the next section about CircleCI.

### CircleCI account
A build server is a machine responsible for executing all your automated build tasks.
Typical local installations on a dedicated server is TeamCity, Jenkins and Team Foundation Server.
Last few years cloud solutions have emerged, with the 2 most popular ones being TravisCI and CircleCI.
Today we will set up our application in CircleCI.

CircleCI offers a free account if you limit to 1 concurrent build.
Head over to [https://circleci.com/](https://circleci.com/) and click the sign up for free button.
Follow the button to github and log in with your user account.
Allow CircleCI to access your github account by pressing authorize.
Back in CircleCI, click your github user account and then select your build-and-deploy repository you forked earlier.
Watch the build in CircleCI.

Our build succeeded, and some kind of magic happened.
CircleCI did everything we wanted, `npm install` was executed as we have a package.json file in our repo, meaning also `bower install` and `grunt build` ran due to our scripts configuration.
Notice CircleCI also ran `npm test` to verify our unit tests.

### circle.yml
So far so good, but lets do something about the magic and make it all happen ourselves.
Go to package.json and remove the whole scripts object.
Commit and push your changes and watch the build fail without getting bower packages, building or testing in CircleCI, it no longer knows what to do.
It also tells us the reason for failure is no tests executed.

So lets start with `npm install`, we know thats the first thing we have to do after downloading code.
CircleCI is configured through the circle.yml file.
Open it and look in the top, we see a dependencies step with an override and it does what we want, installs npm packages.
Uncomment the top 3 lines by removing # at start of line and try again.
CircleCI should pick up that our code was pushed to Github and immediately starts a new build.

We got the same result, and that was expected, after all `npm install` already executes automatically.
Next step is `bower install`, we know that has to execute next.
We already have a dependencies step, and bower installs dependencies.
Add another line below the npm task to do the same for bower and push it to your repo.

One step further, notice bower was correctly executed after npm in the build log.
We also know that `grunt build` must be executed to verify our code.
Building should occur right after dependencies are downloaded, and luckily CircleCI offers a post step to our dependencies.
Uncomment line 5 (post:) in circle.yml and add another line below to execute `grunt build`.
Commit and check results.
The grunt task should now execute right after bower.

Time to make the build pass by adding our unit tests.
We want to execute the tests by the command `grunt test`.
Go to circle.yml, find the test step and uncomment the first 3 lines.
Lets try to run again and see if our tests execute on build server.
Our build now succeeds, and you may see the test execution by using grunt in the build log.

## Continuous deployment
So we verified our code is building nicely and tests are passing.
We are halfway there, now we also need a web server serving our app.
Continuous deployment is the process of automatically deploying our changes to a web server after a successful build.
A web server is something receiving a request on a port on a machine and responds by running our code in a process on the machine.
Typical web servers include Apache, Internet Information Services and Node.js.
We currently launch a web server using our command `grunt connect:local` (or the grunt alias `grunt startlocal` which also builds before serving).
Our web server is connect, which is a middleware on top of Node.JS.

We also have a configuration for running on a server.
Try running `grunt connect:server`.
You will see in console that it started a web server on http://0.0.0.0:9601, but no browser were opened this time.
Try to visit [http://localhost:9601/](http://localhost:9601/) and see that our app is currently running.
If you open Gruntfile.js and locate the connectConfig object, you will also notice that the port is assigned as process.env.PORT || 9601.
This means that if the PORT environment variable is present, use that value, else default to port 9601.
In many environments the PORT environment variable is used by convention.
One of those is Heroku which will launch the server listening to a port from Heroku instead of 9601.
So lets have a look at Heroku.

### Heroku account and link to CircleCI
Heroku is a cloud solution offering containers (Heroku calls them Dynos) where you may run your code.
As mentioned, Heroku assigns a port to serve our application so we dont have to worry about that.
So we want to deploy to this container every time our application builds, lets create a Heroku account!

Go to [https://www.heroku.com/](https://www.heroku.com/) and click the sign up for free button.
Enter your information and select Node.js as your development language.
We need a new app, up in the right corner of the dashboard there is a + icon, click it and select Create new app.
Give it an easy to remember name which has not been previously used, like eirik-build-and-deploy, and select Europe as your runtime selection.
This was easy enough, but there is nothing there!
Now its time to connect our CircleCI account to Heroku and deploy our app!

In CircleCI go to your project (build-and-deploy) and click project settings up right.
Luckily for us Heroku Deployment is an option in the menu.
Here we see that we are prompted for the Heroku API Key.
Open the blue link for the Heroku API Key in a new browser tab and scroll to bottom.
There is an option here to show the api key, click it and copy the key into CircleCI.
After you click save, further click the set user to your user button.

Almost done now, CircleCI also require us to set up where in our Heroku account to deploy the application.
Open the circle.yml file and find the deployment configuration in bottom.
We have a deployment configuration which deploys to the prod environment using the master git branch on heroku using a configured appname.
Uncomment this block and change appname to your easy to remember app name we configured above.
Lets commit and push to see what happens.

The build was successful, lets try and access our web page at https://APPNAME.herokuapp.com/.
We now have an application running, but its not working as intended.
If we open our developer console in the web prowser (F12), we see that there indeed was an error happening here.
The error is angular is not defined, and if we further look at sources, style.min.css does not contain the content from bootstrap.
If you are good at reading minified files you will also notice that not only is angular missing, jquery and bootstrap isnt there either.

### Procfile
What we are missing have a common factor, they all come from bower.
So to find out what is happening, lets start with how Heroku knows how to run our web server.
Open the Procfile from project root directory.
The Procfile is the file Heroku reads when its about to start the application.
We see that its gonna start something by the web keyword which is assigned the `grunt start` command.
If we go into our Gruntfile.js and find the start task almost at bottom, we see that start also runs the build task, which should make sure we have all we need to run our app, so whats wrong?

Remember we removed that script object from package.json to remove some of the magic?
The postinstall command we had there did indeed run bower install after npm install was executed.
Lets reintroduce it, and make it look like this:

```javascript
"scripts": {
  "postinstall": "bower install"
},
```

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
