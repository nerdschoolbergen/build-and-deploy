# Exercise 3 - Travis CI

Instead of setting up a build server from scratch, we'll use Travis CI to do all the heavy lifting for us.

## Travis CI config

Travis is configured through a `.travis.yml` file in our repo. This file doesn't exist yet so you need to create it.

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

## Registering

:pencil2: Head over to [https://travis-ci.org/](https://travis-ci.org/) and sign up using your GitHub account.  
:pencil2: Authorize TravisCI to access your repositories.

## Enabling Travis CI

:pencil2: In the list of projects, flick the switch for the `YOURUSER/build-and-deploy` repository.
