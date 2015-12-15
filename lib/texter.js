'use babel';
'use strict';

import {
  Point,
  Range
}
from 'atom';

import {
  View
}
from 'atom-space-pen-views';

import {
  getCharacters
}
from 'unidata';

class CharacterInfoView extends View {

  initialize(params) {
    this.characters = getCharacters();
  }

  static content(params) {
    this.div({
      'class': 'texter-character-info-view',
    }, () => {
      this.button({
        class: 'close icon icon-x',
        click: 'hide',
      });
      this.h1({
        class: 'block',
      }, () => {
        this.span({
          outlet: 'title',
        });
        this.span({
          class: 'badge badge-flexible',
          outlet: 'subtitle',
        });
      });
      this.figure({
        outlet: 'figure',
      });
      this.dl({
        outlet: 'data',
      });
    });
  }

  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  hide() {
    if (this.panel) this.panel.hide();
    if (this.disposables) {
      for (const disposable of this.disposables) {
        disposable.dispose();
      }
      this.disposables = [];
    }
  }

  isVisible() {
    if (!this.panel) return false;
    return this.panel.isVisible();
  }

  show() {
    if (this.panel === undefined) {
      this.panel = atom.workspace.addModalPanel({
        item: this,
        visible: false
      });
    }

    this.disposables = [];
    this.disposables.push(
      atom.workspace.observeTextEditors((editor) => {
        this.disposables.push(
          editor.onDidChangeCursorPosition((event) => {
            this.updateContents();
          })
        );
      })
    );

    this.panel.show();
    this.updateContents();
  }

  toggle() {
    if (this.isVisible()) {
      this.hide();
    } else {
      this.show();
    }
  }

  updateContents() {
    const editor = atom.workspace.getActiveTextEditor();
    if (!editor) return;

    const point = new TexterPoint(editor, editor.getLastCursor().getBufferPosition());
    let char = point.str(1);
    if (char === '') return;

    this.data.empty();

    let cp = char.charCodeAt();
    if (0xD800 <= cp && cp <= 0xDBFF) {
      const cp2 = point.str(2).charCodeAt(1);
      if (isNaN(cp2)) return;
      cp = ((cp - 0xD800) * 0x400) + (cp2 - 0xDC00) + 0x10000;
    }

    let data;
    for (character of this.characters) {
      if (character.code == cp) {
        data = character;
        break;
      }
    }

    if (cp <= 0x21) {
      char = String.fromCodePoint(0x2400 + cp);
    }

    this.title.text(data.name + ' ');

    const num = cp.toString(16).toUpperCase();
    this.subtitle.text('U+' + ('0000'.substr(num.length)) + num);

    this.figure.text(char);

    const add = (d, t) => {
      if (data[d] === undefined) return;

      this.data.append(`<dt>${t}</dt>`);
      this.data.append(`<dd>${data[d]}</dd>`);
    };
    add('oldName', 'Old Name');
    add('cat', 'Category');
    add('bidi', 'Bidirectional Category');
    add('bidiMirror', 'Mirrored In Bidirectional Text');
    add('comb', 'Canonical Combining Class');
    add('decomp', 'Decomposition');
    add('decompType', 'Decomposition type');
    add('upper', 'Upper Case Mapping');
    add('lower', 'Lower Case Mapping');
    add('title', 'Title Case Mapping');
    add('num', 'Numeric value');
  }

} // class CharacterInfoView

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

export function activate(state) {
  atom.commands.add(
    'atom-workspace', 'texter:toggle-character-info', () => this.toggleCharacterInfo()
  );
  atom.commands.add(
    'atom-workspace', 'texter:narrow-whitespace', () => this.narrowWhitespace()
  );
}

export function toggleCharacterInfo() {
  if (!this.characterInfoView)
    this.characterInfoView = new CharacterInfoView();

  this.characterInfoView.toggle();
}

export function deactivate() {
  this.modalPanel.destroy();
  this.subscriptions.dispose();
  this.wordcountView.destroy();
}

export function serialize() {}

/**
 * Narrow whitespace around each cursor to a single space. Or expand if there is
 * no whitespace.
 */
export function narrowWhitespace() {
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
} // narrow
