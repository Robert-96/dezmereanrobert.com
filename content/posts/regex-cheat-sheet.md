---
title: "RegEx Cheat Sheet"
date: 2021-10-18T00:49:37+03:00
tags: [ "bash" ]
draft: true
---

This regular expression (RegEx) cheat sheet provides a quick overview of all the basic syntax. It can’t cover every edge case, so if you need more information about any of these elements, refer to the documentation.

<!--more-->

<!--more-->

## POSIX Character Classes

| Character Class | Description |
| --------------- | ------------|
| `[:alnum:]` | The alphanumeric characters. In ASCII, equivalent to: `[A-Za-z0-9]`. |
| `[:word:]` | The same as `[:alnum:]`, with the addition of the underscore (`_`) character. |
| `[:blank:]` | The space and tab characters. |
| `[:digit:]` | The numerals 0 through 9. |
| `[:lower:]` | The lowercase letters. |
| `[:print:]` | The printable characters. All the characters in `[:graph:]` plus the space character. |
| `[:upper:]` | The uppercase characters. |
| `[:alpha:]` | The alphabetic characters. In ASCII, equivalent to: `[A-Za-z]`. |
| `[:cntrl:]` | The ASCII control codes. Includes the ASCII characters 0 through 31 and 127. |
| `[:graph:]` | The visible characters. In ASCII, it includes characters 33 through 126. |
| `[:punct:]` | The punctuation characters. In ASCII, equivalent to: `` [-!"#$%&'()*+,./:;<=>?@[\\\]_`{\|}~] ``. |
| `[:space:]` | The whitespace characters including space, tab, carriage return, newline, vertical tab, and form feed. In ASCII, equivalent to: `[ \t\r\n\v\f]`. |
| `[:xdigit:]` | Characters used to express hexadecimal numbers. In ASCII, equiv- alent to: `[0-9A-Fa-f]`. |

## Quantifiers

Quantifiers are ways to specify the number of times an element is matched.

| Specifier | Meaning |
| --------- | ------- |
| `?` | Match the preceding element zero or one time. |
| `*` | Match the preceding element zero or more times. |
| `+` | Match the preceding element one or more times |
| `{n}` | Match the preceding element if it occurs exactly n times. |
| `{n,m}` | Match the preceding element if it occurs at least n times but no more than m times. |
| `{n,}` | Match the preceding element if it occurs n or more times. |
| `{,m}` | Match the preceding element if it occurs no more than m times. |
