# ⚠ This software is no longer maintained! ⚠

`texter` is no longer maintained, and should be considered deprecated. We do no
longer accept bug reports, feature requests or pull requests.

If you’d like to take over ownership of this project, please contact @biffen.

# Texter

[![Build Status](https://img.shields.io/travis/Munkei/atom-texter.svg?style=flat-square)](https://travis-ci.org/Munkei/atom-texter)
[![Downloads](https://img.shields.io/apm/dm/texter.svg?style=flat-square)](https://atom.io/packages/texter)

---

> **Looking for maintainers** I, the maintainer and sole developer of Texter, am
> not using it myself anymore, and have very little time to keep it up-to-date
> and bug-free. If you would like to take over ownership of this project, or
> simply contribute, please contact me.

---

Text-related utilities.

## Narrow Whitespace

<kbd>Alt</kbd>+<kbd>Space</kbd>

Narrows the whitespace around the cursor — or cursors — to a single space. Or
expands if there is no whitespace.

## Rotate

<kbd>Ctrl</kbd>+<kbd>↵&thinsp;Enter</kbd>

Does one of two things, depending on whether the cursor is at the beginning of a
line (not counting indentation):

When it is not: Like inserting a line break, except the other way around: The
text to the left of the cursor ends up on the line below, and text to the right
on the line above.

When it _is_: It does the reverse. Thus the command can be used repeatedly to
cycle between two states.

## Toggle Character Info

<kbd>Ctrl</kbd>+<kbd>i</kbd>

Shows (or hides) some Unicode information about the character at the cursor.

<!--
LocalWords:  Texter kbd Ctrl thinsp
 -->
