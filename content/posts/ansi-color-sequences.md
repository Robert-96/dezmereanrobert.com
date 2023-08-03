---
title: "ANSI Color Sequences"
date: 2021-10-18T00:46:57+03:00
tags: [ "bash" ]
draft: true
---

A simple snippet that should help to add ANSI colors to your bash scripts.

<!--more-->

## Base

```bash
#!/bin/sh

ESC="\033"
RESET="${ESC}[0m"

BLACK_FG="${ESC}[30m"
RED_FG="${ESC}[31m"
GREEN_FG="${ESC}[32m"
YELLOW_FG="${ESC}[33m"
BLUE_FG="${ESC}[34m"
PURPLE_FG="${ESC}[35m"
CYAN_FG="${ESC}[36m"
WHITE_FG="${ESC}[37m"

BLACK_BG="${ESC}[40m"
READ_BG="${ESC}[41m"
GREEN_BG="${ESC}[42m"
YELLOW_BG="${ESC}[43m"
BLUE_BG="${ESC}[44m"
PURPLE_BG="${ESC}[45m"
CYAN_BG="${ESC}[46m"
WHITE_BG="${ESC}[47m"

BOLD_ON="${ESC}[1m"
BOLD_OFF="${ESC}[22m"
ITALIC_ON="${ESC}[3m"
ITALIC_OFF="${ESC}[23m"
UNDERLINE_ON="${ESC}[4m"
UNDERLINE_OFF="${ESC}[24m"
INVERSE_ON="${ESC}[7m"
INVERSE_OFF="${ESC}[27m"

```

## How it works?

```bash
echo "${PURPLE_BG}This is a phrase in purple.${RESET}"
echo "${YELLOW_BG}This is a phrase with yellow background.${RESET}"
echo "${BOLD_ON}This is bold${BOLD_OFF} and ${ITALIC_ON}this is italic.${ITALIC_OFF}"
echo "${BOLD_ON}this is in bold and ${ITALIC_ON}this is italic${ITALIC_OFF}within the bold${RESET}"
echo "${UNDERLINE_ON}This is underlined${UNDERLINE_OFF} and this is not."

```
