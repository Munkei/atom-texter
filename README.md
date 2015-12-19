# Texter #

[![Build Status](https://img.shields.io/travis/Munkei/atom-texter.svg?style=flat-square)](https://travis-ci.org/Munkei/atom-texter)
[![Downloads](https://img.shields.io/apm/dm/texter.svg?style=flat-square)](https://atom.io/packages/texter)

---

Text manipulation commands.

## Narrow Whitespace ##

<kbd>Alt</kbd>+<kbd>Space</kdb>

Narrows the whitespace around the cursor — or cursors — to a single space. Or
expands if there is no whitespace.

## Rotate ##

<kbd>Ctrl</kbd>+<kbd>↵&thinsp;Enter</kdb>

Does one of two things, depending on whether the cursor is at the beginning of a
line (not counting indentation):

When it is not: Like inserting a line break, except the other way around: The
text to the left of the cursor ends up on the line below, and text to the right
on the line above.

When it *is*: It does the reverse. Thus the command can be used repeatedly to
cycle between two states.

## Toggle Character Info ##

<kbd>Ctrl</kbd>+<kbd>i</kdb>

Shows (or hides) some Unicode information about the character at the cursor.
