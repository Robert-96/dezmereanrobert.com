---
title: "Hugo Shortcodes"
subtitle: "This is an test post that uses all the hugo shortcodes features. This post should always remain a draft."
description: ""
date: 2000-08-24T03:12:30+03:00
tags: [ "hugo" ]
keywords: []
draft: true
---

**Note**: *This post should remain a draft.*

This blog post provides a quick overview of all the Hugo Shortcodes and custom Shotcodes created for this project. Refer to the official Hugo documentation for [further information](https://gohugo.io/content-management/shortcodes/).

<!--more-->

## Highlight Shortcode

{{< highlight python "linenos=table,hl_lines=8 15-17,linenostart=199" >}}
def test_upper():
    assert 'foo'.upper() == 'FOO'


def test_lower():
    assert 'FOO'.lower() == 'foo'
{{< / highlight >}}

## Custom Shortcodes

### GitHub Style Blockquotes

{{<gh-blockquote type="warning">}}
This is an **warning** blockquote.
{{</gh-blockquote>}}

{{<gh-blockquote type="note">}}
This is an **note** blockquote.
{{</gh-blockquote>}}

{{<gh-blockquote type="important">}}
This is an **important** blockquote.
{{</gh-blockquote>}}

{{<gh-blockquote type="note">}}
Blockquote *can* contain **Markdown**, `code`, and [links](./).

It can also contain multiple lines and code blocks:

```python
def test_upper():
    assert 'foo'.upper() == 'FOO'
```
{{</gh-blockquote>}}
