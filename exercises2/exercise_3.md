# Exercise 3 - Travis CI

Instead of setting up a build server from scratch, we'll use Travis CI to do all the heavy lifting for us.

## Travis CI config

Travis is configured through a `.travis.yml` file in our repo.

:pencil2: This file doesn't exist yet so you need to create it.

```yml
language: node_js
node_js:
  - '8'
cache:
  directories:
  - node_modules
script: npm run build
```

The file should be named `.travis.yml`, not `travis.yml`.

From top to bottom, this tells TravisCI to:

* Assume our app requires a NodeJS environment to build.
* Use NodeJS 8.
* Cache the node_modules directory so we don't have to wait for `npm install` on every build.
* Run the `build` script, which will build our app with production config.

:pencil2: Save and git commit this file. Git push all your changes so far.

## Registering

:pencil2: Head over to [https://travis-ci.org/](https://travis-ci.org/) and sign up using your GitHub account.  
:pencil2: Authorize TravisCI to access your repositories.

## Enabling Travis CI

:pencil2: In the list of projects, flick the switch for the `YOURUSER/build-and-deploy` repository.

A build should be starting immediately on your repository. The build should succeed.

![](./images/travis01.png)

:pencil2: Scroll to the bottom of the build log.

:bulb: Notice that you can see commands being run to the right in the build log. This is helpful for finding config related to our app.

:pencil2: Find the sections for `npm run build`. It should be one of the last events that occurred.

# Continuous Integration

Remember that Continuous Integration is all about making sure our code is good enough to be deployed. So far we're not doing much to prove this. We make sure the app can be built, but that's about it. Let's introduce some more quality checks.

## Linting

Linting is just to verify that our code follows certain best practices and code conventions. We use the tool _ESLint_ to do this for us. We have used this tool in other JavaScript workshops also.

Luckily `create-react-app` also included ESLint along with some rules (the `eslint-*` packages listed under `dependencies` in `package.json`, but it does not run it by default.

:pencil2: Open `package.json` and add `"lint": "eslint src/**/*.js src/**/*.jsx"` under `"scripts"`. This will run eslint on .js and .jsx files.  
:pencil2: Run `npm run lint` in your terminal. The command should take a few seconds, then exit without errors.  
:pencil2: Open `src/PosterCard.jsx`
