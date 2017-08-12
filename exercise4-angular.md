# Exercise 4 - Setting up a CircleCI build server

## 4.1 - CircleCI Account
A build server is a machine responsible for executing all your automated build tasks.
Typical local installations on a dedicated server is _TeamCity_, _Jenkins_ and _Team Foundation Server (TFS)_.
The last few years, fast and agile cloud solutions have emerged. Two of the most popular ones are TravisCI and CircleCI.

Today we'll set up our application using [CircleCI](https://circleci.com/). CircleCI offers a free account if you limit to 1 concurrent build.

:pencil2: Open a new browser tab and [sign up](https://circleci.com/signup/) using GitHub. Allow CircleCI to access your github account by pressing authorize.  
:pencil2: Back in CircleCI, click your GitHub user account and then select the build-and-deploy repository you forked earlier.  
:pencil2: Watch the build in CircleCI.  

Our build succeeded, seemingly by magic!

CircleCI did everything we wanted. Because we have a `package.json` file in our repository, `npm install` was executed. And because the `"postinstall"`-script in `package.json` says that `bower install` and `grunt build` should be run, they were.

Notice CircleCI also ran `npm test` to verify our unit tests.

### 4.2 - `circle.yml`
So far so good, but let's do something about the magic and make it all happen ourselves, so we know what's going on.

:pencil2: Go to package.json and remove the whole `"scripts"` section.  
:pencil2: _Commit_ and _push_ your changes.
:pencil2: Watch the build fail without getting bower packages, building, or testing in CircleCI, it no longer knows what to do.

It informs us the reason for failure is no tests executed, which is not quite correct.

So let's start with `npm install`. We know that's the first thing we have to do after downloading code.

CircleCI can be configured through a `circle.yml` file in our code repository.

:pencil2: Open the already existing `circle.yml` file in your project. It should be empty. Add the following to the file:

```yml
dependencies:
 override:
   - npm install
```

:pencil2: Commit and push the change.

CircleCI should pick up that our code was pushed to Github and immediately start a new build.

We got the same result, which was to be expected. After all, `npm install` already executes automatically so we made the process more explicit and understandable, which is always a good thing.

Next step is `bower install`, we know that has to execute next.

:pencil2: We already have a `dependencies` step and bower's job is installing dependencies, so let's make good use of it add another line below the `npm install` line and do the same for `bower install`. Commit and push your changes and jump over to CircleCI.

You should have gotten a bit further now. Notice bower was correctly executed after npm in the build log.

Next, we also know that `grunt build` must be executed to build and verify our code.

Building should occur right after dependencies are downloaded, and luckily CircleCI offers a "post"-step to our dependencies.

```diff
dependencies:
 override:
   - npm install
   - bower install
+ post:
+   - grunt build
```

:pencil2: Update the circle.yml file and push the changes. The grunt task should now execute right after bower.

Time to make the build pass by adding our unit tests.

We want to execute the tests by using the command `grunt test`.

In circle.yml, add a test step.

```diff
dependencies:
 override:
   - npm install
   - bower install
 post:
   - grunt build

+ test:
+  override:
+   - grunt test
```

Push the changes and see that the build now succeeds in CircleCI. You should also see the test results in the build log.
