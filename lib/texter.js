'use babel';
'use strict';

import {
  Point,
  Range
}
from 'atom';

export function activate(state) {
  atom.commands.add(
    'atom-workspace', 'texter:narrow-whitespace', () => this.narrowWhitespace()
  );
}

/**
 * Narrow whitespace around each cursor to a single space. Or expand if there is
 * no whitespace.
 */
export function narrowWhitespace() {
  const editor = atom.workspace.getActivePaneItem();
  if (!editor) return;

  const cursors = editor.getCursors();
  for (const cursor of cursors) {
    let range = new Range(cursor.getBufferPosition(), cursor.getBufferPosition());

    while (range.start.row > 0 || range.start.column > 0) {
      let left = new Point(range.start.row, range.start.column);
      if (left.column > 0) {
        left.column--;
      } else {
        left.row--;
        left.column = editor.lineTextForBufferRow(left.row).length;
      }
      const char = editor.getTextInBufferRange(new Range(left, range.start));
      if (!char.match(/^\s$/)) {
        break;
      }
      range.start = left;
    }

    while (range.end.row <= editor.getLineCount()) {
      let right = new Point(range.end.row, range.end.column);
      if (right.column >= editor.lineTextForBufferRow(right.row).length) {
        right.column = 0;
        right.row++;
      } else {
        right.column++;
      }
      const char = editor.getTextInBufferRange(new Range(range.end, right));
      if (!char.match(/^\s$/)) {
        break;
      }
      range.end = right;
    }

    editor.setTextInBufferRange(range, " ");

    if (range.start.isEqual(cursor.getBufferPosition())) {
      cursor.moveRight();
    }
  }
} // narrow
