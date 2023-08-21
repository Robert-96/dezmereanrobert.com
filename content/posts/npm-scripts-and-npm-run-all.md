---
title: "Streamlining Your Development Workflow with `npm` Scripts and `npm-run-all`"
subtitle: "An Introduction to `npm` Scripts and `npm-run-all`"
description: ""
date: 2023-08-16T18:15:44+03:00
tags: ["npm", "node", "javascript"]
keywords: ["npm-scripts", "node.js", "js"]
draft: false
---

In software development, managing tasks and automating processes are essential. Two standout tools are npm-scripts and [`npm-run-all`](https://github.com/mysticatea/npm-run-all). In this post, we'll explore their capabilities and how `npm-run-all` enhances npm-scripts. By combining these tools, you'll optimize your workflow and boost productivity.

<!--more-->

## Understanding `npm` Scripts

npm-scripts provide an elegant way to automate tasks and define custom scripts within your project's `package.json` file. These scripts can cover a wide range of activities, from running servers to testing code. npm-scripts shine with their simplicity and versatility, offering a unified approach to managing diverse development tasks.

To establish an npm-script, you need to define it within the `scripts` section of your `package.json` file. Each script is linked to a command executed when the script is invoked. Consider this example:

```json
{
  "scripts": {
    "start": "node server.js",
    "build": "webpack",
    "test": "jest"
  }
}
```

Here, three npm-scripts —`start`, `build`, and `test`—are defined. Running `npm run start` executes `node server.js`, `npm run build` triggers `webpack`, and `npm run test` invokes the `jest` testing framework.

Note that `npm run start` and `npm run test` have shorthand versions, namely `npm start` and `npm test`, respectively.

## Leveraging External Packages

npm-scripts also seamlessly incorporate external packages without requiring global dependencies. You can use locally installed packages by prefixing the command with `npx`. For instance:

```json
{
  "scripts": {
    "format": "npx prettier --write src/**/*.js"
  }
}
```

Here, the `format` script employs the `prettier` package to format JavaScript files in the `src/` directory.

## Chaining and Combining Scripts

npm-scripts can go beyond single commands; they can chain and combine multiple commands using the `&&` operator. This feature enables the creation of sophisticated workflows:

```json
{
  "scripts": {
    "build": "npm run clean && webpack",
    "clean": "rm -rf dist"
  }
}
```

In this example, the `build` script initiates the `clean` script to remove the `dist/` directory, then executes the `webpack` build process.

## Pre & Post Scripts

npm-scripts offer a mechanism to execute pre and post scripts. Pre scripts are executed before the script, and they are named using the convention `pre[script-name]`. For instance, if your have a script named `start`, you can create a pre script named `prestart`. This is ideal for scenarios where you need to perform initial setup or configuration before your script runs.

Conversely, post scripts are executed upon the completion of a script. They adhere to the naming structure `post[script-name]`. These scripts excel in performing cleanup tasks or generating post-execution reports.

Here's an example:

```json
{
  "scripts": {
    "clean": "rm -rf dist",
    "test": "jest",
    "prebuild": "npm run clean",
    "build": "webpack",
    "postbuild": "npm run test",
  }
}
```

## Run with arguments

It's possible to pass arguments to `npm run` using the following syntax:

```bash
npm run <command> [-- <args>]
```

Note the `--` separator, is used to separate the params passed to `npm` command itself, and the params passed to your script.

```json
{
  "scripts": {
    "build": "webpack",
    "watch": "npm run build -- --watch"
  }
}
```

## Environment Variables

npm-scripts run in an environment where many pieces of information are made available regarding the setup of `npm` and the current state of the process.

1. Every entry in your `package.json` file becomes an environment variable. The `package.json` fields names are appended to the `npm_package_` prefix, separated by `_`. For example for the following `package.json` file:

    ```json
    {
      "name": "test-package",
      "version": "1.0.0",
      "scripts": {
        "echo:package-name": "echo \"$npm_package_name\"",
        "echo:package-version": "echo \"$npm_package_version\"",
      }
    }
    ```

    * `npm_package_name` retrieves the package name, i.e., `test-package`.
    * `npm_package_version` retrieves the package version, i.e., `1.0.0`.

1. You can use the `config` field to add your own custom key-value pairs:

    ```json
    {
      "config": {
        "port": 8080,
      },
      "scripts": {
        "watch": "webpack --watch --port $npm_package_config_port"
      }
    }
    ```

1. You can also get:

    * the npm version from `npm_config_npm_version`
    * the node version and operating system from `npm_config_user_agent` (e.g., `npm/9.8.1 node/v20.5.0 darwin arm64 workspaces/false`).


You can run `npm run env` to list all environment variables that will be available to your scripts at runtime.

{{<gh-blockquote type="note">}}
In Windows instead of `$npm_package_name` you should use `%npm_package_name%` to access the environment variables.
{{</gh-blockquote>}}


## Arguments as Environment Variables

Another way of passing arguments is through environment variables. Any key-value pairs you add as an argument to your command will be translated into an environment variable with the `npm_config_` prefix (e.g., `--port=8080` will be converted into `npm_config_port` environment variable). Meaning you can create a script like this:

```json
{
  "scripts": {
    "watch": "webpack --watch --port $npm_config_port"
  }
}
```

And then use it like so:

```bash
npm run watch --port=8080
```

{{<gh-blockquote type="warning">}}
Don't confuse `npm_config_` with `npm_package_config_`.
{{</gh-blockquote>}}

## Enhancing with `npm-run-all`

While npm-scripts offer robust automation, certain scenarios demand running scripts in parallel or sequentially. This is where [`npm-run-all`](https://github.com/mysticatea/npm-run-all) shines, providing expanded capabilities to manage and execute npm-scripts.

### Installing `npm-run-all`

To integrate `npm-run-all`, start by installing it as a development dependency using:

```bash
npm install npm-run-all --save-dev
```

### Running Sequentially

When scripts must execute sequentially, ensuring one completes before another starts, `npm-run-all` comes to the rescue:

```json
{
  "scripts": {
    "build": "npm-run-all build:assets build:minify",
    "build:assets": "webpack",
    "build:minify": "uglify-js"
  }
}
```

### Running in Parallel

Running scripts in parallel is a common need, especially when multiple services or processes need simultaneous initiation. With `npm-run-all`, scripts can be executed in parallel using the `--parallel` flag:

```json
{
  "scripts": {
    "start": "npm-run-all --parallel start:backend start:frontend",
    "start:backend": "node server.js",
    "start:frontend": "webpack-dev-server"
  }
}
```

### Combining Parallel and Sequential Execution

`npm-run-all` allows combining parallel and sequential execution in a single command, perfect for complex workflows:

```json
{
  "scripts": {
    "deploy": "npm-run-all clean lint --parallel watch:html watch:css",
    "clean": "rm -rf dist",
    "lint": "eslint src",
    "watch:html": "webpack --watch",
    "watch:css": "sass --watch",
  }
}
```

### Glob-like pattern matching for script names

`npm-run-all` allows glob-like patterns to specify npm-scripts names. The difference that the separator is `:` instead of `/`.

```json
{
  "scripts": {
    "start": "npm-run-all --parallel start:*",
    "start:backend": "node server.js",
    "start:frontend": "webpack-dev-server",
    "start:backend:db": "node db.js"
  }
}
```

In this case, `npm run start` runs all sub scripts of start: `start:backend` and `start:frontend`. However, it doesn't execute sub-sub-scripts, like `start:backend:db`. If you want to run both sub scripts and sub-sub scripts use `**`:

```json
{
  "scripts": {
    "start": "npm-run-all --parallel start:**",
    "start:backend": "node server.js",
    "start:frontend": "webpack-dev-server",
    "start:backend:db": "node db.js"
  }
}
```

### Add arguments to scripts

To add arguments to a script name or pattern (e.g, `build:**`) enclosed it in quest and add the arguments after `--`:

```json
{
  "scripts": {
    "start": "npm-run-all --parallel start:backend \"start:frontend -- --watch\"",
    "start:backend": "node server.js",
    "start:frontend": "webpack-dev-server"
  }
}
```

Alternatively, placeholders can used to get the arguments passed to the `npm run` command:

```json
{
  "scripts": {
    "start": "npm-run-all --parallel start:backend \"start:frontend -- --port {1}\" --",
    "start:backend": "node server.js",
    "start:frontend": "webpack-dev-server"
  }
}
```


And then use it like so:

```bash
$ npm run start 8080

> example@1.0.0 start /path/to/package.json
> npm-run-all build "start-server -- --port {1}" -- "8080"
```

`npm-run-all` defines the following placeholders:

* `{1}`, `{2}`, ... - An argument. `{1}` is the 1st argument, `{2}` is the 2nd, and so forth.
* `{@}` - All arguments.
* `{*}` - All arguments as combined.

## Other Useful Tools

Here are a couple of useful tools:

* [`rimraf`](https://www.npmjs.com/package/rimraf) allows you to run `rm -rf` but is compatible with Windows.
* [`mkdirp`](https://www.npmjs.com/package/mkdirp) allows you to run `mkdir -p` but is compatible with Windows.
* [`ncp`](https://www.npmjs.com/package/ncp) is a great cross-platform alternative to `cp`.

## Conclusion

By harnessing the power of npm-scripts and extending their capabilities with `npm-run-all`, you can create a highly efficient development workflow. Automating tasks and orchestrating complex processes become remarkably easy. Simplify your workflow, boost productivity.
