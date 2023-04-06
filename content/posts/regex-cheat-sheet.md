---
title: "RegEx Cheat Sheet"
date: 2021-10-18T00:49:37+03:00
tags: [ "bash" ]
draft: false
---

Regular expressions (RegEx) are powerful tools for text processing, search, and validation. They are used in a wide range of applications, from web development to data science. RegEx may seem intimidating at first, but with practice, they can become an essential tool in your toolbox.

This regular expression (RegEx) cheat sheet provides a quick overview of all the basic syntax. It can’t cover every edge case, so if you need more information about any of these elements, refer to the documentation.

<!--more-->

## Basic syntax

The basic syntax of a RegEx pattern consists of literal characters and special characters, also known as metacharacters. Here are some of the most common ones:

* `.` Matches any single character except a newline character.
* `[]` Matches any character in the specified set of characters.
* `()` Creates a capturing group.

## POSIX Character Classes

* `[:alnum:]` Matches the alphanumeric characters. In ASCII, equivalent to: `[A-Za-z0-9]`.
* `[:word:]` Matches the same as `[:alnum:]`, with the addition of the underscore (`_`) character.
* `[:blank:]` Matches the space and tab characters.
* `[:digit:]` Matches the numerals 0 through 9.
* `[:lower:]` Matches the lowercase letters.
* `[:print:]` Matches the printable characters. All the characters in `[:graph:]` plus the space character.
* `[:upper:]` Matches the uppercase characters.
* `[:alpha:]` Matches the alphabetic characters. In ASCII, equivalent to: `[A-Za-z]`.
* `[:cntrl:]` Matches the ASCII control codes. Includes the ASCII characters 0 through 31 and 127.
* `[:graph:]` Matches the visible characters. In ASCII, it includes characters 33 through 126.
* `[:punct:]` Matches the punctuation characters. In ASCII, equivalent to: `` [-!"#$%&'()*+,./:;<=>?@[\\\]_`{\|}~] ``.
* `[:space:]` Matches the whitespace characters including space, tab, carriage return, newline, vertical tab, and form feed. In ASCII, equivalent to: `[ \t\r\n\v\f]`.
* `[:xdigit:]` Matches the the characters used to express hexadecimal numbers. In ASCII, equivalent to: `[0-9A-Fa-f]`.

## Quantifiers

Quantifiers are ways to specify the number of times an element is matched. Here are some of the most commonly used quantifiers:

* `?` Matches the preceding element zero or one time.
* `*` Matches the preceding element zero or more times.
* `+` Matches the preceding element one or more times
* `{n}` Matches the preceding element if it occurs exactly n times.
* `{n,m}` Matches the preceding element if it occurs at least n times but no more than m times.
* `{n,}` Matches the preceding element if it occurs n or more times.
* `{,m}` Matches the preceding element if it occurs no more than m times.

## Anchors

Anchors match a specific position in the text. Here are some of the most commonly used anchors:

* `^` Matches the beginning of a line.
* `$` Matches the end of a line.
* `\b` Matches a word boundary (the transition between a word character and a non-word character).
* `\B` Matches a non-word boundary.

## Alternation

Alternation allows you to match one of several options. Here's how it works:

* `(option1|option2|option3)` Matches one of the specified options.

## Escaping special characters

If you want to match a literal special character (such as `*`, `+`, or `?`), you need to escape it with a backslash (`\`).
