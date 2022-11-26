---
title: "GitHub Actions for Hugo"
subtitle: "How to crate a custom GitHub Actions workflow to publish your Hugo site on GitHub Pages."
date: 2022-11-23T01:28:59+02:00
tags: [ "github", "hugo" ]
draft: false
---

This tutorial should help you setup and deploy an Hugo site to GitHub Pages by using GitHub Actions to automatically build and deploy your site.

<!--more-->

## Create a deploy workflow for your Hugo site

1. Set `baseURL` in `config.toml` with the value `https://<USERNAME>.github.io` for your user repository or `https://<USERNAME>.github.io/<REPOSITORY_NAME>` for a project repository.

    Unless this is present in your `config.toml`, your website won’t work.

1. Create a new file in your project at `.github/workflows/deploy.yml` and paste in the YAML below.

    ```yml
    name: Deploy

    on:
      push:
        branches:
          - main

    jobs:
      build:
        runs-on: macos-latest

        steps:
          - uses: actions/checkout@v3

          - name: Install Hugo
            run: brew install hugo

          - name: Build the Hugo website
            run: hugo --minify

          - name: Upload artifact
            uses: actions/upload-pages-artifact@main
            with:
              path: "public/"

      deploy:
        needs: build
        runs-on: macos-latest

        permissions:
          pages: write
          id-token: write

        environment:
          name: github-pages
          url: ${{ steps.deployment.outputs.page_url }}

        steps:
          - name: Deploy to GitHub Pages
            id: deployment
            uses: actions/deploy-pages@v1
    ```

1. On GitHub, go to your repository’s **Settings** tab and find the **Pages** section of the settings.

1. Choose **GitHub Actions** as the **Source** of your site and press **Save**.

1. Commit the new workflow file and push it to GitHub.

Your site should now be published! When you push changes to your repository, the GitHub Action will automatically deploy them for you.

Refer to the official Hugo documentation for [further information](https://gohugo.io/hosting-and-deployment/hosting-on-github/).

## Use a custom domains

If you’d like to use a custom domain for your GitHub Pages site, you need to:

1. Set `baseURL` in `config.toml` to your custom domain name.

1. Create a file `static/CNAME`. Your custom domain name should be the only contents inside `CNAME`. Since it’s inside static, the published site will contain the `CNAME` file at the root of the published site, which is a requirement of GitHub Pages.

Refer to the official GitHub documentation for [further information](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
