---
title: "Vim Cheat Sheet"
date: 2021-10-18T00:43:02+03:00
tags: [ "bash", "vim" ]
draft: false
---

This Vim cheat sheet provides a quick overview of all the basic commands. It can’t cover every edge case, so if you need more information about any of these elements, refer to the [documentation](https://www.vim.org/docs.php).

<!--more-->

## Commands

| Command   | Description                                |
| --------- | ------------------------------------------ |
| `:q`      | Quit (fails if there are unsaved changes). |
| `:q!`     | Quit and throw away unsaved changes.       |
| `:w`      | Write (save) the file.                     |
| `:wq`     | Write (save) the file and exit.            |
| `:x`      | Write (save) the file and exit.            |

## Cursor Movement

| Command     | Description                                                            |
| ----------- | ---------------------------------------------------------------------- |
| `H`         | Move to top of screen.                                                 |
| `M`         | Move to middle of screen.                                              |
| `L`         | Move to bottom of screen.                                              |
| `w`         | Jump forwards to the start of a word.                                  |
| `W`         | Jump forwards to the start of a word (words can contain punctuation).  |
| `e`         | Jump forwards to the end of a word.                                    |
| `E`         | Jump forwards to the end of a word (words can contain punctuation).    |
| `b`         | Jump backwards to the start of a word.                                 |
| `B`         | Jump backwards to the start of a word (words can contain punctuation). |
| `0`         | Jump to the start of the line.                                         |
| `^`         | Jump to the first non-blank character of the line.                     |
| `$`         | Jump to the end of the line.                                           |
| `G`         | Go to the last line of the document.                                   |
| `<number>G` | Go to line number (e.g. `5G` goes to line 5).                          |

## Inserting/Appending Text

| Command | Description                                     |
| ------- | ----------------------------------------------- |
| `i`     | Insert before the cursor                        |
| `I`     | Insert at the beginning of the line             |
| `a`     | Append (insert) after the cursor                |
| `A`     | Append (insert) at the end of the line          |
| `o`     | Open (append) a new line below the current line |
| `O`     | Open (append) a new line above the current line |
| `ea`    | Append (insert) at the end of the word          |
| `ESC`   | Exit insert mode                                |

## Copy and Paste

| Command      | Description                                                                                     |
| ------------ | ----------------------------------------------------------------------------------------------- |
| `yy`         | Yank (copy) a line.                                                                             |
| `<number>yy` | Yank (copy) a number of lines (e.g. `2yy` copies 2 lines).                                      |
| `yw`         | Yank (copy) the characters of the word from the cursor position to the start of the next word.  |
| `y$`         | Yank (copy) to end of line.                                                                     |
| `p`          | Put (paste) the clipboard after cursor.                                                         |
| `P`          | Put (paste) before cursor.                                                                      |
| `dd`         | Delete (cut) a line.                                                                            |
| `<number>dd` | Delete (cut) a number of lines lines (e.g. `2dd` deletes 2 lines).                              |
| `dw`         | Delete (cut) the characters of the word from the cursor position to the start of the next word. |
| `D`          | Delete (cut) to the end of the line.                                                            |
| `d$`         | Delete (cut) to the end of the line.                                                            |
| `x`          | Delete (cut) character.                                                                         |

## Configure VIM for shell scripting

* `syntax: on` or `:set syntax=sh` - turns on syntax highlighting.

  > Note: For this feature to work the file you are editing must have a shebang indicating the file is a shell script (e.g. `#!/bin/bash`).

* `:set hlsearch` - turns on the highlight search results.
* `:set tabstop=4` -  the value to 4 (the default is 8).
* `:set autoindent` - causes VIM to indent a new line the same amount as the line just typed.
