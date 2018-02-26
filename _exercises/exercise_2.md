# Exercise 2 - Webpack

## In this exercise you will learn about:

* Webpack config and the build pipeline

## 2.1 - Webpack and modern front-end build pipelines

Before, in the stone-age of the internet (meaning last year :roll_eyes:), we had to set-up several tools to work in unison to make a build pipeline. As the front-end software stack evolves, new tools emerge that tries to solve some pains and make it all easier.

Tools such as [Grunt](https://gruntjs.com/) and [Gulp](https://gulpjs.com/) used to be how we constructed our build pipeline. These are the tools we used to use in this workshop. These days, [Webpack](https://webpack.js.org/) has taken over front-end infrastructure, especially with React apps.

> Grunt and Gulp are still used in many projects. They are mature and battle-tested products that still works well. However, many SPA frameworks such as React are moving to Webpack to consolidate the complexity of building front-end apps into one tool.

Webpack is at its core, an _asset bundler_. It specializes in taking all your `.js` files and packing them into a single `.js` file, and then doing the same for images, styling, and whatever other files you have. This means that tasks we used to set-up manually such as the following, is all done by Webpack:

* Copy index.html to a "dist" or "public" directory
* Transform .sass to .css
* Transpile JavaScript
* Concatenate all .js files together
* Concatenate all .css files together
* Minimize the .js file
* Copy images to the "dist" or "public" directory

> Remember that the more "magic" a framework seems to be, and the more it solves, the more important is it that you understand how it works. No frameworks you use in production should feel like a black box you can't explain.

However, Webpack doesn't understand all this without being told what to do. We have to configure it first, and for our app, webpack configuration lives in `config/webpack.config.dev.js` and `config/webpack.config.prod.js`. The former is optimized for developing the app, the latter is optimized for running in production.

:pencil2: Open `config/webpack.config.prod.js`.

This file was created by the folks making `create-react-app`, our scaffolding tool. The comments explaining the configurations are also written by them. In real projects we tend to write this file ourself by hand, because scaffolding tools often support features we won't need or understand, which makes this file seem more complex and scary than it needs to be. Learning Webpack is a topic worthy of it's own workshop so we won't go into details here. We will look at parts of it, though.

Webpack is just a "dumb" engine. It's main features or _build tasks_ are separated out into _plugins_ and _loaders_. Let's go through all of that are used here to de-mystify them a bit, starting with the plugins.

### 2.1.1 - Webpack Plugins used by our app

:pencil2: Scroll down to line 236 (the start of `plugins`).

**`InterpolateHtmlPlugin`**  
Enables the use of variables in `index.html`, so we can pass config values to this file when we build the final `index.html` file.

**`HtmlWebpackPlugin`**  
Takes the `public/index.html` and fills all variables with actual content, thus building the final index.html file which will get deployed.

**`DefinePlugin`**  
Enables us to access certain variables passed at build-time to our code. This allows us for example to check what environment (dev or prod) our code is currently running in.

**`UglifyJsPLugin`**  
Minimizes JavaScript so it takes less space, thus making it faster to download and much harder to read by people seeking to exploit our app.

**`ExtractTextPlugin`**  
Extracts css into a .css file so it can be cached individually by the browser. (Otherwise it would be bundled inside the .js file containing our whole app).

**`ManifestPlugin`**  
Create a manifest of all assets to help tools to understand our app (used with Progressive Web Apps).

**`SWPrecacheWebpackPlugin`**  
Use with Progressive Web Apps, which we don't care about in this workshop.

**`IgnorePlugin`**  
Tells Webpack to ignore certain paths if we don't want to include it in our bundle.

### 2.1.2 - Webpack Loaders used by our app

:pencil2: Scroll to line 107 (the start of `module`).

As mentioned, Webpack is an _asset bundler_. The rules listed in the `module.rules` array (starts at line 109) describes what Webpack should do when it encounter files with different file extensions (for example `.js`, `.jsx`, `.css`, `.png`). Let's get a quick overview of what is configured here.

The order of these rules matter. Think of files flowing through the rules array, from the first loader to the last, in that order.

**`js, jsx, mjs` files**  
Line 116 to 130 says that whenever Webpack encounters a js, jsx, or mjs file, it should run them through a plugin called _eslint-loader_ which will check for lint warnings and errors (code quality check).

**`bmp, gif, jpeg, png` files**  
Line 138 to 145 says that whenever Webpack encounters a bmp, gif, jpg, jpeg, or png file, it should run them through a plugin called _url-loader_ and make these images available at the `static/media` path (Webpack will copy images to this path).

**`js, jsx, mjs` files**  
Yes, we already processed these file extensions, but in the first build step we only linted the files (checked the code quality). Assuming they passed the first check, they are now processed by this loader. This build step will use the _babel-loader_ plugin to _transpile_ the files, meaning that we compile our JavaScript code down to a syntax that we know all browsers can support, since we're probably using language features that certain browsers haven't implemented yet.

**`css` files**  
Line 169 to 212 is a confusing mess that basically just processes our css. This is a good example of config we hardly understand because we didn't write it ourself, and this can (thankfully) be written much simpler if we were to write this ourself by hand.

**`*` files**  
Line 220 to 229 says that if Webpack encounters any file that haven't been picked up by any of the above loaders, it should just copy that file to the `static/media` folder

What do we mean when we say "whenever Webpack _encounters a file_"? This is simply that we `import` or `require` a file with that extension in our code. For example, to load an image we'd use `import myImage from './cat.png'` in our code. The cat.png image would then be handled by the `url-loader`, as described between lines 138 to 145 because that's where the `.png` extension is handled.

:sweat_smile: Phew! That's alot of config. Even though all this configuration seems daunting, we hope that you now have a rough idea of what Webpack does, and what our build pipeline looks like.

### 2.2 - Building our app

:pencil2: Run `npm run build` to build our app using the `webpack.config.prod` config.

This builds our app and puts it in the `/build` folder. This folder is what we will deploy to our web server and host on the internet.

We need a static web server to host the app once built. The build output suggests `serve` (`serve -s build` in the terminal).

:pencil2: Run `npm install -g serve`. This will install `serve` globally on your computer. You probably need to run the terminal as admin to do this.  
:pencil2: Run `serve -s build` to host the build folder, then open [http://localhost:5000](http://localhost:5000) in your browser and verify the app runs. (You might need to restart the terminal window after installing serve to use it).

### [Go to exercise 3 :arrow_right:](./exercise_3.md)
