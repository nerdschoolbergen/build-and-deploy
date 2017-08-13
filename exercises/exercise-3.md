# Exercise 3 - Testing

## In this exercise we will
* Learn about testing.
* Run the tests.

<hr />

:pencil2: Open the file `test/calcCtrl.spec.js`.

These are _unit tests_ to verify that the engine behind our calculator works correctly.
Unit tests are valuable to verify that our code works as expected, and is critical for continuous integration because we don't want to deploy code to production we don't trust.
If everything is to be automated, we have to trust that our unit tests will uncover any defects in our code.

:pencil2: Let's run the unit tests: `grunt karma:unit`

The console should report that 21 of 21 unit tests succeeded.

So how does a failing unit test look like?

:pencil2: Try changing the `(..) 2 + 2 = 4` unit test to calculate 2+3 instead and run `grunt karma:unit`.  
:pencil2: Revert your change to make the unit test succeed again.

We already created an alias for `grunt karma:unit` - `grunt test`.

:pencil2: Open `package.json` and see the `"scripts"`-section and note the `"test"`-script. This tells npm that test execution should run the command `grunt test`. Script commands such as `"start"` and `"test"` have special meaning to npm and will be run by tools such as CircleCI (we can also add `"scripts"` ourselves that has no meaning to npm but make our life easier).

:pencil2: Try it by running `npm test`.

We will come back to why this is handy in the next section about CircleCI.

### [Go to exercise 4 :arrow_right:](./exercise-4.md)
