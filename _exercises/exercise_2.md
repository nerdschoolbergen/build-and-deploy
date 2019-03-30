# Exercise 2 - Webpack

## In this exercise you will learn about:

* Webpack and modern front-end build pipelines
* Building our app

## 2.1 - Webpack and modern front-end build pipelines

Before, in the stone-age of the internet (meaning last year :roll_eyes:), we had to set-up several tools to work in unison to make a build pipeline. As the front-end software stack evolves, new tools emerge that tries to solve some pains and make it all easier.

Tools such as [Grunt](https://gruntjs.com/) and [Gulp](https://gulpjs.com/) used to be how we constructed our build pipeline. These are the tools we used to use in this workshop. These days, [Webpack](https://webpack.js.org/) has taken over front-end infrastructure, especially with React apps.

> Grunt and Gulp are still used in many projects. They are mature and battle-tested products that still work well. However, many SPA frameworks such as React are moving to Webpack to consolidate the complexity of building front-end apps into one tool.

Webpack is at its core, an _asset bundler_. It specializes in taking all your `.js` files and packing them into a single `.js` file, and then doing the same for images, styling, and whatever other files you have. This means that tasks we used to set-up manually such as the following, is all done by Webpack:

* Copy index.html to a "dist" or "public" directory
* Transform .sass to .css
* Transpile JavaScript
* Concatenate all .js files together
* Concatenate all .css files together
* Minimize the .js file
* Copy images to the "dist" or "public" directory

> Remember that the more "magic" a framework seems to be, and the more it solves, the more important is it that you understand how it works. No frameworks you use in production should feel like a black box you can't explain.

However, Webpack doesn't understand all this without being told what to do. We have to configure it first, and for our app, the `create-react-app` scaffolding tool has provided us with two build configs:

* A development config optimized for running our app in development mode
  * Triggered by running the `npm start` command (which you used in the previous exercise)
* A production config optimized for running in production
  * Triggered by running the `npm run build` command

The development config (`npm start`) starts a special development web server (`webpack-dev-server`), which enables amongst other things the following features:

* Automatic and incremental building_ when files are added or changed without restarting the dev server (so you don't have to run `npm start` all the time)
* _Automatic page refresh_ when code is changed, without restarting the dev server ("Hot reloading" with no page refresh is possible to configure as well)
* _An error overlay_ displaying errors from Webpack in the web page

See the `create-react-app` scaffolder [config source code](https://github.com/facebook/create-react-app/tree/master/packages/react-scripts/config) too learn more about the details.

### 2.2 - Building our app

:pencil2: Run `npm run build` to build our app using the production config.

The production Webpack config does the following:

* _Correctly bundles the app_ and third party dependencies _in production mode_
* _Optimizes the build_ for the best performance and output size
* _Creates a production build of your app:_
  * Inside the `build/static` directory will be your JavaScript and CSS files
  * Each filename inside of build/static will contain a unique hash of the file contents (for [static cashing purposes](https://facebook.github.io/create-react-app/docs/production-build#static-file-caching))

The contents of the `build` folder is what we will deploy to our web server and host on the internet.

We need a static web server to host the app once built. The build output suggests `serve` (`serve -s build` in the terminal).

:pencil2: Run `npm install -g serve`. This will install `serve` globally on your computer. You probably need to run the terminal as admin to do this.  
:pencil2: Run `serve -s build` to host the build folder, then open [http://localhost:5000](http://localhost:5000) in your browser and verify the app runs. (You might need to restart the terminal window after installing serve to use it).

### [Go to exercise 3 :arrow_right:](./exercise_3.md)
