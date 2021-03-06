'use babel';
'use strict';

import {
  Point,
  Range
}
from 'atom';

class TexterPoint {

  constructor(editor, point) {
    this.editor = editor;
    this.row = point.row;
    this.column = point.column;
  }

  clone() {
    return new TexterPoint(this.editor, new Point(this.row, this.column));
  }

  isBOB() {
    return this.isBOL() && this.row <= 0;
  }

  isBOL() {
    return this.column <= 0;
  }

  isEOB() {
    return this.isEOL() && this.row >= this.editor.getLineCount();
  }

  isEOL() {
    return this.column >= this.editor.lineTextForBufferRow(this.row).length;
  }

  moveLeft(chars = 1) {
    if (chars < 0) return this.moveRight(0 - chars);
    for (var i = 0; i < chars; i++) {
      if (this.isBOB()) return;
      if (this.isBOL()) {
        this.row--;
        this.column = this.editor.lineTextForBufferRow(this.row).length;
      } else {
        this.column--;
      }
    }
  }

  moveRight(chars = 1) {
    if (chars < 0) return this.moveLeft(0 - chars);
    for (var i = 0; i < chars; i++) {
      if (this.isEOB()) return;
      if (this.isEOL()) {
        this.row++;
        this.column = 0;
      } else {
        this.column++;
      }
    }
  }

  str(length = 1) {
    const other = this.clone();
    other.moveRight(length);
    return this.editor.getTextInBufferRange(new Range(
      this.toArray(),
      other.toArray()
    ));
  }

  toArray() {
    return [this.row, this.column];
  }

} // class TexterPoint

export default TexterPoint;
