---
title: "Add custom color palettes to GIMP and Inkscape"
date: 2022-08-09T00:35:16+03:00
tags: [ "gimp", "inkscape" ]
draft: false
---

This article explains how the `.gpl` format works, how to create a `.gpl` palette file and import it into [GIMP](https://www.gimp.org/) and [Inkscape](https://inkscape.org/).

> **Note**: The `.gpl` format is also supported by [Aseprite](https://www.aseprite.org/), [Drawpile](https://drawpile.net/), [Krita](https://krita.org/) and [MyPaint](http://mypaint.org/).

<!--more-->

## GIMP's Palettes Format

GIMP palettes are stored using a special file format, in plain text files with the `.gpl` extension. Note that it supports only ASCII characters.

Every palette must have the following structure:

<!-- markdownlint-disable-next-line MD040 -->
```
GIMP Palette
Name: <name>
Columns: <number>
# <comment>
  0    0    0  Black
255  255  255  White
# ...
```

* `GIMP Palette` - it must be the first line of the file.
* `Name: <name>` - sets the name of the color palette.
* `Columns: <number>` - is just an indication for displaying the palette inside GIMP.
* `# <comment>` - comments must start with a `#`. All comments are ignored by GIMP.
* `  0    0    0  Black` - RGB values for the color followed by the color name.  <!-- markdownlint-disable-line MD038 -->

Here is an simple example:

<!-- markdownlint-disable-next-line MD040 -->
```
GIMP Palette
Name: Example
Columns: 5
# A simple example
  0    0    0  Black
255  255  255  White
255    0    0  Red
  0  255    0  Green
  0    0  255  Blue
```

> **Note**: The RGB values don't need to line up.


## Importing the palettes

After you have a color palette in GIMP's `.gpl` format, you can easily import the color palette to start working with it.

You can also generate `.gpl` files using palettes generators like [Paletton](https://paletton.com/) or download one from [here](https://robert-96.github.io/gimp-color-palettes/).

### GIMP

Copy the `.gpl` file in the folder `/palettes`, which you create in the folder indicated at **Edit ‣ Preferences ‣ Folders ‣ Palettes**.

Restart GIMP to see the new palette in the list.

### Inkscape

Copy the `.gpl` file in the folder indicated at **Edit ‣ Preferences ‣ System: User palettes**.

Restart Inkscape to see the new palette in the list.
