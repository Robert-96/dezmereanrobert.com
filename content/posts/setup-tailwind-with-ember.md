---
title: "Ember.js: Installing Tailwind CSS"
date: 2020-05-07T00:02:08+03:00
tags: [ "ember.js", "tailwind", "css" ]
draft: false
---

This tutorial should help you install and customize [Tailwind CSS](https://tailwindcss.com/) in your Ember.js app.

The goal is to make your Ember.js app integrate with [PostCSS](https://postcss.org/) and use [Tailwind](https://tailwindcss.com/) as a plugin. There is a huge number of plugins, Tailwind been one of them.

<!--more-->

## TL;DR

```console
$ ember install ember-cli-postcss                   # Install ember-cli-postcss
$ npm install --save-dev tailwindcss                # Install tailwindcss

$ npx tailwind init app/styles/tailwind.config.js   # Optional: Generate a Tailwind config file for your project
$ npm install -save-dev postcss-import              # Optional: If you want to use the @import statement
```

```css
/* app/styles/app.css */

@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
```

```js
// ember-cli-build.js

// ...

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    postcssOptions: {
      compile: {
        plugins: [
          // { module: require('postcss-import') }, // If you installed postcss-import
          require('tailwindcss'),
          // require('tailwindcss')('./app/styles/tailwind.config.js'), // If you have a Tailwind config file.
        ]
      }
    }
  });

  // ...
};
```

## Overview

> **Tailwind CSS** is a highly customizable, low-level CSS framework that gives you all of the building blocks you need to build bespoke designs without any annoying opinionated styles you have to fight to override.
>
> - https://tailwindcss.com/

The goal is to make your Ember.js app integrate with [PostCSS](https://postcss.org/) and use [Tailwind](https://tailwindcss.com/) as a plugin.

> **PostCSS** is a tool for CSS syntax transformations.
> It allows you to define custom CSS like syntax that could be understandable and transformed by plugins.
>
> - https://github.com/postcss/postcss/blob/master/docs/architecture.md#overview

There is a huge number of plugins, Tailwind been one of them.

## Installing `ember-cli-postcss`

The first step is making your app integrate with [PostCSS](https://postcss.org/).

You can use an add-on that helps you integrate PostCSS with Ember.js, `ember-cli-postcss`:

```console
$ ember install ember-cli-postcss
```

For more about `ember-cli-postcss` check out the [documentation](https://jeffjewiss.github.io/ember-cli-postcss/).

## Install Tailwind

Now you can install the Tailwind package directly using `npm` or `yarn`:

```console
# Using npm
$ npm install --save-dev tailwindcss

# Using Yarn
$ yarn add --dev tailwindcss
```

## Add Tailwind to your CSS

After you install tailwind you need to use the `@tailwind` directive to inject Tailwind's `base`, `components`, and `utilities` styles into your CSS:

```css
/* app/styles/app.css */

@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
```

Tailwind will swap these directives out at build time with all of its generated CSS.

## Create your Tailwind config file *(optional)*

> Note: If you don't need to customize your Tailwind installation you can skip this step, and do it when you need to.

If you'd like to customize your Tailwind installation, you can generate a config file for your project using the Tailwind CLI.

```console
$ npx tailwind init app/styles/tailwind.config.js
```

For more about the Tailwind Configuration check out the [documentation](https://tailwindcss.com/docs/configuration/).

## Process your CSS with Tailwind

The last step is adding Tailwind as a PostCSS plugin in your build chain.

This means adding `tailwindcss` to the list of plugins you pass to `ember-cli-postcss` in your `ember-cli-build.js`.

```js
// ember-cli-build.js

// ...

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    postcssOptions: {
      compile: {
        plugins: [
          require('tailwindcss'),
          // require('tailwindcss')('./app/styles/tailwind.config.js'), // If you have a Tailwind config file.
        ]
      }
    }
  });

  // ...
};
```

Now your done, you have successfully added [PostCSS](https://postcss.org/) and [Tailwind](https://tailwindcss.com/) to your app.

## Install `postcss-import` *(optional)*

To be able to import styles from other files with the `@import` statement and split your CSS in multiple file, you need `postcss-import`:

```console
# Using npm
$ npm install --save-dev postcss-import

# Using Yarn
$ yarn add --dev postcss-import
```

Since `postcss-import` is a PostCSS plugin (like `tailwindcss`), you have to add it your build chain.

This means adding `postcss-import` to the list of plugins you pass to `ember-cli-postcss` in your `ember-cli-build.js`.

```js
// ember-cli-build.js

// ...

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    postcssOptions: {
      compile: {
        plugins: [
          { module: require('postcss-import') },
          require('tailwindcss'),
          // require('tailwindcss')('./app/styles/tailwind.config.js'), // If you have a Tailwind config file.
        ]
      }
    }
  });

  // ...
};
```

Now you can use the `@import` statement in your `app.css`:

```css
/* app/styles/app.css */

@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

@import "custom"  /* This will import the CSS form custom.css */
```
