---
title: "Vim Cheat Sheet"
date: 2021-10-18T00:43:02+03:00
tags: [ "bash" ]
draft: true
---

This Vim cheat sheet provides a quick overview of all the basic commands. It can’t cover every edge case, so if you need more information about any of these elements, refer to the [documentation](https://docs.docker.com/).

<!--more-->

## Commands

| Command   | Description                               |
| --------- | ----------------------------------------- |
| `:q`      | quit (fails if there are unsaved changes) |
| `:q!`     | quit and throw away unsaved changes       |
| `:w`      | write (save) the file                     |
| `:wq`     | write (save) the file and exit            |
| `:x`      | write (save) the file and exit            |

## Cursor Movement

| Command     | Description                                                           |
| ----------- | --------------------------------------------------------------------- |
| `H`         | move to top of screen                                                 |
| `M`         | move to middle of screen                                              |
| `L`         | move to bottom of screen                                              |
| `w`         | jump forwards to the start of a word                                  |
| `W`         | jump forwards to the start of a word (words can contain punctuation)  |
| `e`         | jump forwards to the end of a word                                    |
| `E`         | jump forwards to the end of a word (words can contain punctuation)    |
| `b`         | jump backwards to the start of a word                                 |
| `B`         | jump backwards to the start of a word (words can contain punctuation) |
| `0`         | jump to the start of the line                                         |
| `^`         | jump to the first non-blank character of the line                     |
| `$`         | jump to the end of the line                                           |
| `G`         | go to the last line of the document                                   |
| `<number>G` | go to line number (e.g. `5G` goes to line 5)                          |

## Inserting/Appending Text

| Command | Description                                     |
| ------- | ----------------------------------------------- |
| `i`     | insert before the cursor                        |
| `I`     | insert at the beginning of the line             |
| `a`     | append (insert) after the cursor                |
| `A`     | append (insert) at the end of the line          |
| `o`     | open (append) a new line below the current line |
| `O`     | open (append) a new line above the current line |
| `ea`    | append (insert) at the end of the word          |
| `ESC`   | exit insert mode                                |

## Copy and Paste

| Command      | Description                                                                                    |
| ------------ | ---------------------------------------------------------------------------------------------- |
| `yy`         | yank (copy) a line                                                                             |
| `<number>yy` | yank (copy) a number of lines (e.g. `2yy` copies 2 lines)                                      |
| `yw`         | yank (copy) the characters of the word from the cursor position to the start of the next word  |
| `y$`         | yank (copy) to end of line                                                                     |
| `p`          | put (paste) the clipboard after cursor                                                         |
| `P`          | put (paste) before cursor                                                                      |
| `dd`         | delete (cut) a line                                                                            |
| `<number>dd` | delete (cut) a number of lines lines (e.g. `2dd` deletes 2 lines)                              |
| `dw`         | delete (cut) the characters of the word from the cursor position to the start of the next word |
| `D`          | delete (cut) to the end of the line                                                            |
| `d$`         | delete (cut) to the end of the line                                                            |
| `x`          | delete (cut) character                                                                         |

## Configure VIM for shell scripting

* `syntax: on` or `:set syntax=sh` - turns on syntax highlighting.

  > Note: For this feature to work the file you are editing must have a shebang indicating the file is a shell script (e.g. `#!/bin/bash`).

* `:set hlsearch` - turns on the highlight search results.
* `:set tabstop=4` -  the value to 4 (the default is 8).
* `:set autoindent` - causes VIM to indent a new line the same amount as the line just typed.
