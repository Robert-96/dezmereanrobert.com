---
title: "Lighthouse CI for Static Sites with GitHub Actions"
subtitle: "How to crate a custom GitHub Actions workflow to run Lighthouse audits for your static site."
description: ""
date: 2022-11-28T01:06:12+02:00
tags: [ "lighthouse", "github" ]
keywords: [ "static-sites", "github-actions" ]
draft: false
---

This tutorial should help you setup a GitHub workflow to run Lighthouse audits for your static site.

The project Lighthouse CI makes it easy to run Lighthouse Audits with GitHub Actions. The audit results can be used to improve performance, accessibility, SEO and more.

<!--more-->

## Create a workflow for Lighthouse CI

1. Create a new file in your project at `lighthouserc.js` and paste in the JavaScript code below.

    ```javascript
    module.exports = {
      ci: {
        collect: {
          staticDistDir: './public/'
        },
        upload: {
          target: 'temporary-public-storage',
        },
      },
    };
    ```

    The simple configuration file above is all you need to get started collecting Lighthouse reports to temporary public storage.

    Set `staticDistDir` to the build directory where your HTML files to run Lighthouse on are located (e.g. `public`, `dist`, `build`, `out`, etc.).

    For more details about all the configuration options and features like asserting on specific audits and urls, refer to the official Lighthouse CI documentation for [further information](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md).

1. Create a new file in your project at `.github/workflows/lighthouse.yml` and paste in the YAML below.

    ```yml
    name: Lighthouse

    on: [push]

    jobs:
      build:
        runs-on: macos-latest

        steps:
        - uses: actions/checkout@v3

        - name: Setup Node.js 16.x
          uses: actions/setup-node@v1
          with:
            node-version: 16.x

        - name: Install npm dependencies
          run: npm install

        - name: Build your static website
          run: npm run build

        - name: Upload artifact
          uses: actions/upload-artifact@v3
          with:
            name: build
            path: "public/"

      lighthouse:
        needs: build
        runs-on: macos-latest

        steps:
        - uses: actions/checkout@v3

        - name: Setup Node.js 16.x
          uses: actions/setup-node@v1
          with:
            node-version: 16.x

        - name: Install Lighthouse
          run: npm install -g @lhci/cli@0.8.x

        - name: Download artifact
          uses: actions/download-artifact@v3
          with:
            name: build
            path: 'public/'

        - name: Run Lighthouse
          run: lhci autorun
    ```

    If you don't use `npm run build` update the `build` job to build your static site.

    Set the `path` option form `actions/upload-artifact` and `actions/download-artifact` actions to the build directory of your static site (the same value you set to the `staticDistDir` option from `lighthouserc.js`).

1. Commit the new files and push them to GitHub.

Your Lighthouse audits for your static site should be running now! When you push changes to your repository, the GitHub Action will automatically run them for you.

Refer to the official Lighthouse CI documentation for [further information](https://github.com/GoogleChrome/lighthouse-ci#documentation).
