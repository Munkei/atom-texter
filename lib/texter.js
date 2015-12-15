'use babel';
'use strict';

import CharacterInfoView from './character-info-view.js';
import TexterPoint from './texter-point.js';

import {
  Range
}
from 'atom';

export default {

  activate: function(state) {
    atom.commands.add(
      'atom-workspace', 'texter:toggle-character-info', () => this.toggleCharacterInfo()
    );
    atom.commands.add(
      'atom-workspace', 'texter:narrow-whitespace', () => this.narrowWhitespace()
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

  serialize: function() {},

  toggleCharacterInfo: function() {
    if (!this.characterInfoView)
      this.characterInfoView = new CharacterInfoView();

    this.characterInfoView.toggle();
  },

};
