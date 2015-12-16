'use babel';
'use strict';

import CharacterInfoView from './character-info-view.js';
import TexterPoint from './texter-point.js';

import {
  Point,
  Range
}
from 'atom';

export default {

  activate: function(state) {
    atom.commands.add(
      'atom-workspace',
      'texter:narrow-whitespace', () => this.narrowWhitespace()
    );
    atom.commands.add(
      'atom-workspace',
      'texter:rotate', () => this.rotate()
    );
    atom.commands.add(
      'atom-workspace',
      'texter:toggle-character-info', () => this.toggleCharacterInfo()
    );
  },

  deactivate: function() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.wordcountView.destroy();
  },

  /**
   * Narrow whitespace around each cursor to a single space. Or expand if there
   * is no whitespace.
   */
  narrowWhitespace: function() {
    const editor = atom.workspace.getActiveTextEditor();
    if (!editor) return;

    const cursors = editor.getCursors();
    for (const cursor of cursors) {
      let left = new TexterPoint(editor, cursor.getBufferPosition());
      let move = false;
      let right = left.clone();

      while (left.str(-1).match(/\s/)) {
        left.moveLeft();
      }

      while (right.str(1).match(/\s/)) {
        right.moveRight();
        move = true;
      }

      editor.setTextInBufferRange(new Range(
        left.toArray(),
        right.toArray()
      ), " ");

      if (move) cursor.moveRight();
    }
  }, // narrowWhitespace

  rotate: function() {
    const editor = atom.workspace.getActiveTextEditor();
    if (!editor) return;

    const cursors = editor.getCursors();
    for (const cursor of cursors) {
      if (cursor.hasPrecedingCharactersOnLine()) {
        // break
        const line = cursor.getCurrentBufferLine();
        const left = line.substr(0, cursor.getBufferColumn());
        const right = line.substr(cursor.getBufferColumn());
        editor.setTextInBufferRange(
          new Range(
            [cursor.getBufferRow(), 0], [cursor.getBufferRow(), line.length]
          ),
          ' '.repeat(cursor.getIndentLevel()) + right + '\n' + left
        );
        cursor.moveToBeginningOfLine();
        cursor.skipLeadingWhitespace();
      } else {
        // join
        const row = cursor.getBufferRow();
        if (row == 0) continue;

        cursor.moveToEndOfLine();
        const prev = editor.lineTextForBufferRow(row - 1).trimLeft();
        editor.setTextInBufferRange(
          new Range(
            [row - 1, 0], [row, 0]
          ),
          ''
        );
        if (prev.length > 0) {
          editor.setTextInBufferRange(
            new Range(cursor.getBufferPosition(), cursor.getBufferPosition()),
            ' ' + prev
          );
        }
        cursor.moveLeft(prev.length);
      }
    }
  },

  serialize: function() {},

  toggleCharacterInfo: function() {
    if (!this.characterInfoView)
      this.characterInfoView = new CharacterInfoView();

    this.characterInfoView.toggle();
  },

};
