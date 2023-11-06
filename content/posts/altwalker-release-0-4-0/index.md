---
title: "Exploring AltWalker 0.4.0: What's New?"
subtitle: "Support for Python 3.12, new fixtures, and the LiveViewer release"
description: ""
date: 2023-11-04T21:24:59Z
tags: []
keywords: []
draft: true
---

In this article, we'll dive into the latest features and enhancements that have been introduced in AltWalker 0.4.0, including support for Python 3.12, the introduction of new fixtures, and the highly anticipated LiveViewer release.

<!--more-->

## Support for Python 3.12

The `load_module()` method has been deprecated and is scheduled for removal in Python 3.12. AltWalker has transitioned to using `exec_module` instead. Additionally, the `verify`, `walk`, and `online` commands now include the `--import-mode` option, offering the following values:

- `importlib`: This mode employs `importlib` to import test modules.
- `prepend`: The directory containing each module is prepended to the end of `sys.path` if not already there.
- `append`: The directory containing each module is appended to the end of `sys.path` if not already there.

## Introducing New Fixtures

One of the major highlights in AltWalker 0.4.0 is the introduction on two two new fixtures:

* `beforeStep`: Will be executed before every step.
* `afterStep`: Will be executed after every step.

You can define these fixtures in your test code like this:

```py
# tests/test.py

def beforeStep():
    """Will be executed before every step."""

def afterStep():
    """Will be executed after every step."""


class ModelA:

    def beforeStep():
        """Will be executed before every step from this model."""

    def afterStep():
        """Will be executed after every step from this model."""

    # ...
```

These fixtures offer you the flexibility to customize behavior before and after individual steps, enhancing the control and functionality of your test suite.

Check out the [documentation](https://altwalker.github.io/altwalker/core/tests-structure.html#fixtures) for more details.

### LiveViewer Initial Release

{{< figure src="./live-viewer-recording.gif" alt="LiveViewer Recording." >}}

AltWalker's LiveViewer is a web application for visualizing your test runs in real-time. It brings a new dimension to your testing process, allowing you to monitor your test executions with ease.

Visit the LiveViewer app at https://altwalker.github.io/live-viewer/.

If you're eager to dive into the initial release of AltWalker’s LiveViewer, you can find the repository here: https://www.github.com/altwaler/live-viewer/.
