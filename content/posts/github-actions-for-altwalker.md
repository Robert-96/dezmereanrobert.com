---
title: "GitHub Actions for Altwalker"
subtitle: "How to crate a GitHub Actions workflow to run your AltWalker tests."
date: 2022-11-23T23:59:10+02:00
tags: [ "github", "altwalker" ]
draft: false
---

This tutorial should help you setup a GitHub workflow to automatically run your AltWalker tests.

<!--more-->

## Create a workflow for your AltWalker tests

1. Create a new file in your project at `.github/workflows/deploy.yml` and paste in the YAML below.

    ```yml
    name: AltWalker Tests

    on: [push]

    jobs:
      altwalker-tests:
        runs-on: ubuntu-latest

        steps:
        - uses: actions/checkout@v3

        - name: Setup AltWalker
          uses: altwalker/setup-altwalker@v1

        - name: Check the models
          run: altwalker check -m models/default.json "random(vertex_coverage(100))"
          shell: bash

        - name: Verify the code
          run: altwalker verify tests -m models/default.json
          shell: bash

        - name: Run the tests
          run: altwalker online tests -m models/default.json "random(vertex_coverage(100))"
          shell: bash

        - name: Generate a test sequence
          run: altwalker offline -m models/default.json "random(vertex_coverage(100))" -f steps/steps.json
          shell: bash

        - name: Run a pre-generated sequence
          run: altwalker walk tests steps/steps.json
          shell: bash

        - name: Archive log files
          uses: actions/upload-artifact@v2
          if: ${{ always() }}
          with:
            name: logs
            path: '*.log'
    ```

1. On GitHub, go to your repository’s **Settings** tab and find the **Pages** section of the settings.

1. Choose **GitHub Actions** as the **Source** of your site and press **Save**.

1. Commit the new workflow file and push it to GitHub.
