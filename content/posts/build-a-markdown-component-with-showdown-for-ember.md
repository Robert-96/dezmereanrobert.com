---
title: "Ember.js: Build a Markdown component with ShowdownJs"
date: 2020-05-30T00:35:40+03:00
tags: [ "ember.js", "markdown" ]
draft: false
---

With the help of [ShowdownJs](http://showdownjs.com/) and [HighlightJs](https://highlightjs.org/)
you can build an Markdown component with syntax highlighting.

**ShowdownJs** is an easy to use Markdown to HTML converter, it can be used in
both client side (browser) or server side (with nodejs).

**HighlightJs** is an JavaScript library for syntax highlighting on the web. It supports
189 languages and 94 styles.

Let's build component for rendering markdown with ShowdownJs and HighlightJs.

<!--more-->

## Table of contents

* [Create a `MarkdownView` component](#create-a-markdownview-component)
* [Add syntax highlighting using HighlightJs *(Optional)*](#add-syntax-highlighting-using-highlightjs-optional)

## Create a `MarkdownView` component

Install the ShowdownJs library from `npm` or `yarn`:

```console
# Using npm
$ npm install showdown --save-dev

# Using yarn
$ yarn add showdown --dev
```

Now you need create a `<MarkdownView />` component, and use ShowdownJs to convert the markdown into HTML:

```console
$ ember g component markdown-view -gc
```

```js
// app/components/markdown-view.js

import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import showdown from 'showdown';

const converter = new showdown.Converter()

export default class MarkdownViewComponent extends Component {
  get html() {
    return htmlSafe(converte.makeHtml(this.args.markdown))
  }
}
```

```hbs
{{! app/components/markdown-view.hbs }}

{{html}}
```

You can easily pass in the markdown from one of your routes.

```js
// app/routes/post.js
import Route from '@ember/routing/route';

export default class PostRoute extends Route {
  model() {
    return '# Hello Ember!';
  }
}
```

```hbs
// templates/posts.hbs

<MarkdownView @markdown={{@model}} />
```

## Add syntax highlighting using HighlightJs *(Optional)*

Let's add syntax highlighting to the `<MarkdownView />` component using [HighlightJs](https://highlightjs.org/).

Install the HighlightJs library from `npm` or `yarn`:

```
# Using npm
$ npm install highlight.js --save-dev

# Using yarn
$ yarn add highlight.js --dev
```

Now you need update the `<MarkdownView />` component:

```js
// app/components/markdown-view.js

import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import showdown from 'showdown';
import hljs from 'highlight.js';

showdown.extension('highlight', function () {
  return [{
    type: "output",
    filter: function (text) {
      var left = "<pre><code\\b[^>]*>",
          right = "</code></pre>",
          flags = "g";

      var replacement = function (wholeMatch, match, left, right) {
        var lang = (left.match(/class="([^ "]+)/) || [])[1];
        left = left.slice(0, 18) + 'hljs ' + left.slice(18);

        if (lang && hljs.getLanguage(lang)) {
          return left + hljs.highlight(lang, match).value + right;
	} else {
          return wholeMatch;
	}
      };

      return showdown.helper.replaceRecursiveRegExp(text, replacement, left, right, flags);
    }
  }];
});

const converter = new showdown.Converter({extensions: ['highlight']})

export default class MarkdownViewComponent extends Component {
  get html() {
    return htmlSafe(converter.makeHtml(this.args.markdown))
  }
}
```

Finally, you need to import a Highlight.js theme. You can do that by importing the CSS file from `node_modules` in your `ember-cli-build.js` file with `app.import`:

```js
// ember-cli-build.js

// ..

module.exports = function(defaults) {
  // ...

  app.import('node_modules/highlight.js/styles/default.css');

  return app.toTree();
};
```

You can found [here](https://highlightjs.org/static/demo/) a list of all Highlight.js themes and languages.
