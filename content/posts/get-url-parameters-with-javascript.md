---
title: "Get Url Parameters With Javascript"
date: 2020-07-28T00:40:21+03:00
tags: [ "javascript" ]
draft: false
featured: true
---

*URL Parameters* (also known as *Query Parameters* or *Query String*) are a set o key-value pairs attached to the end of a URL. They are used to send small amounts of data from page to page, or from client to server via the URL.

<!--more-->

## TL;DR

```js
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// https://example.com/path/to/page?color=purple&size=M&size=L

urlParams.get('color')     // purple
urlParams.getAll('size')   // ['M', 'L']
```

## URL Parameters Structure

The query parameters are separate from URL path with a `?` (question mark):

<!-- markdownlint-disable-next-line MD040 -->
```
https://example.com/path/to/page?color=purple
```

Each parameter after the first one is joined with an `&` (ampersand):

<!-- markdownlint-disable-next-line MD040 -->
```
https://example.com/path/to/page?color=purple&size=M&size=L
```

In this case the query string is `color=purple`.

There are characters that cannot be part of a URL (for example space) and some other characters have a special meaning in a URL (the character `#`). This types of characters need to be encoded (for example space is encoded as `%20`).

## Get a URL parameter

You can get the query string using `window.location.search`.

```js
const queryString = window.location.search;
```

You can then parse the query string's parameters using `URLSearchParams`:

```js
const urlParams = new URLSearchParams(queryString);
```

Now you can use `URLSearchParams.get()` to get the first value associated with the given search parameter:

```js
// https://example.com/path/to/page?color=purple&size=M&size=L

urlParams.get('color')   // purple
urlParams.get('size')    // M
urlParams.get('nothing') // empty string
```

## Get all values of a URL parameter

Now you can use `URLSearchParams.getAll()` to get all values associated with the given search parameter:

```js
// https://example.com/path/to/page?color=purple&size=M&size=L

urlParams.getAll('color') // ['purple']
urlParams.getAll('size')  // ['M', 'L']
```

## Check if a URL parameter exists

You can use `URLSearchParams.has()` to check if a given parameter exists.

```js
// https://example.com/path/to/page?color=purple&size=M&size=L

urlParams.has('color')   // true
urlParams.has('size')    // true
urlParams.has('nothing') // false
```

## Iterating over URL parameters

Iterate through all keys:

```js
const keys = urlParams.keys();
for (const key of keys) {
  console.log(key);
}
```

Iterate through all values:

```js
const values = urlParams.values();

for (const value of values) {
  console.log(value);
}
```

Iterate through all key-value pairs:

```js
const entries = urlParams.entries();

for(const entry of entries) {
  console.log(`${entry[0]} = ${entry[1]}`);
}
```

## For Internet Explorer

The `URLSearchParams` is not supported on IE, so you will need to parse the URL and get the query parameters.

```js
function getParameterByName(name) {
  cont url = window.location.search;
  name = name.replace(/[\[\]]/g, '\\$&');

  let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  let results = regex.exec(url);

  if (!results) {
    return null;
  }

  if (!results[2]) {
    return '';
  }

  return decodeURIComponent(results[2]);
}
```

Now you can use `getParameterByName` to get the first value associated with the given search parameter:

```js
// https://example.com/path/to/page?color=purple&size=M&size=L

getParameterByName('color')   // purple
getParameterByName('size')    // M
getParameterByName('nothing') // null
```
