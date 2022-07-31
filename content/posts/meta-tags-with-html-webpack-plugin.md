---
title: "Meta Tags With HtmlWebpackPlugin"
subtitle: "Add meta tags for social media with `HtmlWebpackPlugin`."
date: 2021-10-16T02:33:24+03:00
tags: [ "webpack", "javascript" ]
draft: true
---

The goal of this guide is to add social media tags to your webpack project.

<!--more-->

Social media meta tags are `<meta>` tags in the `<head>` of your web page that control how URLs are displayed when shared on social media.

If you are using [`webpack`](https://webpack.js.org/) you can use the `meta` option from the [`HtmlWebpackPlugin`](https://github.com/jantimon/html-webpack-plugin) to add the social meta meta tags to your web page:

```js
// webpack.config.js

// ...
new HtmlWebpackPlugin({
  meta: {
    'description': { name: 'description', contnet: '...' },
    'keyword': { name: 'keywords', content: '...' },
    'og:title': { property: 'og:title', content: '...' },
    'og:description': { property: 'og:description', content: '...' },
    'og:type': { property: 'og:type', content: 'website' },
    'og:url': { property: 'og:url', content: '...' },
    'og:image': { property: 'og:image', content: '...' },
    'twitter:card': { name: 'twitter:card', content: 'summary_large_image' },
    'twitter:title': { name: 'twitter:title', content: '...' },
    'twitter:description': { name: 'twitter:description', content: '...' },
    'twitter:image': { name: 'twitter:image', content: '...' }
  }
})
// ...

```
