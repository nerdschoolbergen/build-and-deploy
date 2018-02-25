# Exercise 2 - Continuous Integration

## In this exercise you will learn about:

* Continuous Integration theory
* Continuous Integration using Webpack

## :book: 2.1 - Continuous Integration

_Continuous Integration (CI)_ is a series of steps with the only purpose of _proving that the code does **not** meet the required standards to be deployed to production._

If the CI pipeline is _not_ able to find issues with the code, the build passes and the code is verified.

Steps involved are different from project to project, but will typically cover these steps:

1. Download the codebase from the repository (such as Git). The build will fail if the repository could not be reached or accessed.
2. Download dependencies for code (in our application, you'll remember we download dependencies using `npm install`). The build will fail if any dependency cannot be installed.
3. Build the code (in our application, we'll use `grunt build` for this). The build will fail if we're not able to build everything.
4. Run unit tests. The build will fail if any test fails.

Other common steps include static code analysis to validate our code against common best practice code standards, run integration tests, end-to-end tests, scripted GUI tests, etc.
