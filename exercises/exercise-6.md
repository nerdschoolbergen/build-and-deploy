# Exercise 6 - Implementing more features
Our calculator can do addition and division, but is sorely lacking subtraction and multiplying.

With a deployment pipeline in place, this should be easy. We just have to implement the features and CircleCI and Heroku takes care of the rest.

## 6.1 - Implement subtraction ship to production
Implementing subtraction should be pretty straight forward. There's even some unit tests in place to help us get started.

:pencil2: Open `test/calcCtrl.spec.js` and uncomment the lines `84-128` (all of the comments).  
:pencil2: Run the `grunt test` command. The tests fail as expected. After all, the code we're attempting to test is not implemented yet.  
:pencil2: Go into `src/calcCtrl.js` and implement subtraction.  
:pencil2: Running `grunt test` again should report our tests are now passing.  

## 6.2 - Fail and fix
Before we push our changes, let's fail one of the unit tests to see if build server picks it up.

:pencil2: Change one of the subtraction unit tests to a different value and verify its failing before committing and pushing the changes.  
:pencil2: Our code failed the build due to a failing unit test, and did not continue on to deploy anything to Heroku. This is very good - it means we can trust in our build pipeline to only put quality builds in production.  
:pencil2: Fix the test, push to Github, and test it in Heroku.

## 6.3 - Implement multiplication
Our calculator still can't multiply.

:pencil2: Implement multiplication and make sure there are tests verifying that it's working as expected. Make sure different cases are covered, like multiplying with zero, and negative numbers.  
:pencil2: Verify it's all working in production.  

## 6.4 - Static code analysis
Static code analysis ensures we are adhering to best practice code standards.

Let's make sure our code follows the coding practices suggested by _JSHint_.

:pencil2: Start by installing a [JSHint package for Grunt](https://github.com/gruntjs/grunt-contrib-jshint), by running `npm install grunt-contrib-jshint --save-dev` in a terminal.  
:pencil2: Open `circle.yml` and in the `test`-section, add a step below `grunt test` with the command `grunt lint`.

```diff
 test:
  override:
    - npm test
+   - grunt lint
```

We must then define the grunt `lint` task.

:pencil2: Open `Gruntfile.js` and add the following code with the other configuration objects:

```js
var jsHintConfig = {
  all: ['src/calcApp.module.js', 'src/calcCtrl.js'],
};
```

:pencil2: Then, add the `jshint` options to the Grunt configuration:

```diff
 var gruntConfig = {
   sass: sassConfig,
   concat: concatConfig,
   uglify: uglifyConfig,
   cssmin: cssminConfig,
   connect: connectConfig,
   karma: karmaConfig,
+  jshint: jsHintConfig,
 };
```

:pencil2: Finally, we'll add the `lint` task:

```js
grunt.registerTask('lint', [
  'jshint:all'
]);
```

:pencil2: Push your changes and inspect the build in CircleCI.

The build failed and we got some feedback on why. It's complaining that we are defining a `result` variable several times. If we inspect our JavaScript code (`calcCtrl.js`), we'll see that indeed we are. In JavaScript, `if`-blocks does not isolate scope. So even though the runtime will never execute more than one of our `if-else` blocks, we are indeed re-using the variable. This is because of "[var hoisting](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/var#var_hoisting)", one of many quirks in JavaScript.

:pencil2: Let's fix this for now by assigning results directly to `vm.result` instead.  
:pencil2: Run `grunt lint` to see if we fixed all errors.  

There is 2 more issues with our code.

There is a missing semicolon on a statement, and we have a semicolon on a function declaration which is unnecessary.

:pencil2: Fix these issues, run `grunt lint` again to verify there's no more code issues and push changes.

Now our build should pass and the app should be deployed! :tada: :tada: :tada:


### :tada: All done! :tada:
