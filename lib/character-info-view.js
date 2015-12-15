'use babel';
'use strict';

import TexterPoint from './texter-point.js';

import {
  View
}
from 'atom-space-pen-views';
import {
  getCharacters
}
from 'unidata';

class CharacterInfoView extends View {

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
    } // content

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

  initialize(params) {
    this.characters = getCharacters();
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
    } // show

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
    } // updateContents

} // class CharacterInfoView

export default CharacterInfoView;
