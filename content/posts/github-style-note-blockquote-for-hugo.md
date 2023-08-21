---
title: "Add Github Style Note Blockquote to Hugo using Shortcodes"
subtitle: ""
description: ""
date: 2023-08-17T00:31:37+03:00
tags: ["hugo", "github", "markdown"]
keywords: ["blog", "hugo-shortcodes", "shortcodes"]
draft: false
---

When it comes to creating informative and visually appealing content on your Hugo-powered site, using blockquotes to highlight important notes is a common practice. Blockquotes provide a clear separation from the main text and draw attention to key information. If you're familiar with GitHub's style of rendering notes in Markdown files, you might have noticed their visually appealing and distinct
note blockquote design (<https://github.com/orgs/community/discussions/16925>). In this article, we'll explore how you can achieve a similar look by adding GitHub-style note blockquotes to your Hugo site using shortcodes.

<!--more-->

## Understanding Shortcodes in Hugo

Hugo allows you to use shortcodes to embed dynamic content or execute custom functionalities within your Markdown content. Shortcodes are placeholders enclosed in double curly braces like `{{</* shortcode-name parameters */>}}` that Hugo replaces with the desired content during site generation. This flexibility makes them a powerful tool for adding custom elements to your site without complex coding.

## Creating the GitHub-Style Note Blockquote Shortcode

1. Begin by adding the following code to `/layouts/shortcodes/gh-blockquote.html`:

    ```html
    {{ $type := .Get "type" | lower }}
    {{ $supportedTypes := slice "important" "note" "warning" }}

    {{ if in $supportedTypes $type }}
      <blockquote class="gh-blockquote gh-{{ $type | safeHTML }}">
        <span class="font-bold">{{ $type | title }}</span>
        <br>

        {{ .Inner | markdownify }}
      </blockquote>
    {{ else }}
      {{ errorf "Invalid parameter: '%s'. Supported values: %q." $type $supportedTypes }}
    {{ end }}
    ```

1. Add the following CSS rules in your site's CSS file:

    ```css
    /* Style gh-blockquote shortcode. */
    .gh-blockquote {
      border-left-style: solid;
      border-left-width: 4px;
    }

    .gh-important {
      border-color: #A855F7;
    }

    .gh-important span {
      color: #A855F7;
    }

    .gh-note {
      border-color: #3B82F6;
    }

    .gh-note span {
      color: #3B82F6;
    }

    .gh-warning {
      border-color: #EAB308;
    }

    .gh-warning span {
      color: #EAB308;
    }
    ```

This code define the tree types of blockquotes also defined by GitHub:

* **note**: Used to emphasize information that users should take into account, even when skimming.
* **important**: Highlights critical information necessary for users to succeed.
* **warning**: Draws immediate attention to critical content due to potential risks.


## Using the Custom Shortcode

To use the custom shortcode, simply insert `{{</* gh-blockquote type="note" */>}}` where you want the blockquote to appear and include the content of the note blockquote and end with the closing shortcodes declaration `{{</* /gh-blockquote */>}}`, like this:

```html
{{</* gh-blockquote type="note" */>}}
This is an important note that you want to highlight.
{{</* /gh-blockquote */>}}
```

An example of all three types:

``````markdown
{{</* gh-blockquote type="note" */>}}
This is an **note** blockquote used to highlights information that users should take into account, even when skimming.
{{</* /gh-blockquote */>}}

{{</* gh-blockquote type="important" */>}}
This is an **important** blockquote used to highlights crucial information necessary for users to succeed.
{{</* /gh-blockquote */>}}

{{</* gh-blockquote type="warning" */>}}
This is an **warning** blockquote used to highlights critical content demanding immediate user attention due to potential risks.
{{</* /gh-blockquote */>}}

{{</* gh-blockquote type="note" */>}}
Blockquote *can* contain **Markdown**, `code`, and [links](./).

It can also contain multiple lines and code blocks:

```py
def test_split():
  assert False
```
{{</* /gh-blockquote */>}}
``````

Here is how they are displayed:

{{<gh-blockquote type="note">}}
This is an **note** blockquote used to highlights information that users should take into account, even when skimming.
{{</gh-blockquote>}}

{{<gh-blockquote type="important">}}
This is an **important** blockquote used to highlights crucial information necessary for users to succeed.
{{</gh-blockquote>}}

{{<gh-blockquote type="warning">}}
This is an **warning** blockquote used to highlights critical content demanding immediate user attention due to potential risks.
{{</gh-blockquote>}}

{{<gh-blockquote type="note">}}
Blockquote *can* contain **Markdown**, `code`, and [links](./).

It can also contain multiple lines and code blocks:

```py
def test_upper():
  assert 'foo'.upper() == 'FOO'
```
{{</gh-blockquote>}}

## Conclusion

Adding GitHub-style note blockquotes to your Hugo site using shortcodes is a straightforward process that enhances the visual appeal and clarity of your content. With Hugo's shortcode feature, you have the flexibility to create and incorporate custom elements seamlessly, making your site more engaging and user-friendly.
