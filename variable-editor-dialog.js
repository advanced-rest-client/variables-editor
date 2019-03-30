/**
@license
Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
import '../../@polymer/paper-dialog/paper-dialog.js';
import '../../@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '../../@polymer/paper-input/paper-input.js';
import '../../@polymer/paper-icon-button/paper-icon-button.js';
import '../../@polymer/paper-toast/paper-toast.js';
import '../../@polymer/paper-tabs/paper-tab.js';
import '../../@polymer/paper-tabs/paper-tabs.js';
import '../../@polymer/iron-pages/iron-pages.js';
import '../../@polymer/paper-button/paper-button.js';
const FnList = {
  'Math': [{
    'name': 'Math.abs',
    'doc': 'Returns the absolute value of a number.',
    'args': 1
  }, {
    'name': 'Math.acos',
    'doc': 'Returns the arccosine of a number.',
    'args': 1
  }, {
    'name': 'Math.acosh',
    'doc': 'Returns the hyperbolic arccosine of a number.',
    'args': 1
  }, {
    'name': 'Math.asin',
    'doc': 'Returns the arcsine of a number.',
    'args': 1
  }, {
    'name': 'Math.asinh',
    'doc': 'Returns the hyperbolic arcsine of a number.',
    'args': 1
  }, {
    'name': 'Math.atan',
    'doc': 'Returns the arctangent of a number.',
    'args': 1
  }, {
    'name': 'Math.atanh',
    'doc': 'Returns the hyperbolic arctangent of a number.',
    'args': 1
  }, {
    'name': 'Math.atan2',
    'doc': 'Returns the arctangent of the quotient of its arguments.',
    'args': 2
  }, {
    'name': 'Math.cbrt',
    'doc': 'Returns the cube root of a number.',
    'args': 1
  }, {
    'name': 'Math.ceil',
    'doc': 'Returns the smallest integer greater than or equal to a number.',
    'args': 1
  }, {
    'name': 'Math.clz32',
    'doc': 'Returns the number of leading zeroes of a 32-bit integer.',
    'args': 1
  }, {
    'name': 'Math.cos',
    'doc': 'Returns the cosine of a number.',
    'args': 1
  }, {
    'name': 'Math.cosh',
    'doc': 'Returns the hyperbolic cosine of a number.',
    'args': 1
  }, {
    'name': 'Math.exp',
    'doc': 'Returns Ex, where x is the argument, and E is Euler\'s constant' +
      ' (2.718…), the base of the natural logarithm.',
    'args': 1
  }, {
    'name': 'Math.expm1',
    'doc': 'Returns subtracting 1 from exp(x).',
    'args': 1
  }, {
    'name': 'Math.floor',
    'doc': 'Returns the largest integer less than or equal to a number.',
    'args': 1
  }, {
    'name': 'Math.fround',
    'doc': 'Returns the nearest single precision float representation of a number.',
    'args': 1
  }, {
    'name': 'Math.hypot',
    'doc': 'Returns the square root of the sum of squares of its arguments.',
    'args': 1
  }, {
    'name': 'Math.imul',
    'doc': 'Returns the result of a 32-bit integer multiplication.',
    'args': 2
  }, {
    'name': 'Math.log',
    'doc': 'Returns the natural logarithm (loge, also ln) of a number.',
    'args': 1
  }, {
    'name': 'Math.log1p',
    'doc': 'Returns the natural logarithm (loge, also ln) of 1 + x for a number x.',
    'args': 1
  }, {
    'name': 'Math.log10',
    'doc': 'Returns the base 10 logarithm of a number.',
    'args': 1
  }, {
    'name': 'Math.log2',
    'doc': 'Returns the base 2 logarithm of a number.',
    'args': 1
  }, {
    'name': 'Math.max',
    'doc': 'Returns the largest of zero or more numbers.',
    'args': 2
  }, {
    'name': 'Math.min',
    'doc': 'Returns the smallest of zero or more numbers.',
    'args': 2
  }, {
    'name': 'Math.pow',
    'doc': 'Returns base to the exponent power, that is, baseexponent.',
    'args': 2
  }, {
    'name': 'Math.random',
    'doc': 'Returns a pseudo-random number between 0 and 1.',
    'args': 1
  }, {
    'name': 'Math.round',
    'doc': 'Returns the value of a number rounded to the nearest integer.',
    'args': 1
  }, {
    'name': 'Math.sign',
    'doc': 'Returns the sign of the x, indicating whether x is positive, negative or zero.',
    'args': 1
  }, {
    'name': 'Math.sin',
    'doc': 'Returns the sine of a number.',
    'args': 1
  }, {
    'name': 'Math.sinh',
    'doc': 'Returns the hyperbolic sine of a number.',
    'args': 1
  }, {
    'name': 'Math.sqrt',
    'doc': 'Returns the positive square root of a number.',
    'args': 1
  }, {
    'name': 'Math.tan',
    'doc': 'Returns the tangent of a number.',
    'args': 1
  }, {
    'name': 'Math.tanh',
    'doc': 'Returns the hyperbolic tangent of a number.',
    'args': 1
  }, {
    'name': 'Math.trunc',
    'doc': 'Returns the integral part of the number x, removing any fractional digits.',
    'args': 1
  }],
  'String': [{
    'name': 'String.charAt',
    'doc': 'Returns the character at the specified index.',
    'args': 2
  }, {
    'name': 'String.charCodeAt',
    'doc': 'Returns a number indicating the Unicode value of the character at the given index.',
    'args': 2
  }, {
    'name': 'String.codePointAt',
    'doc': 'Returns a non-negative integer that is the UTF-16 encoded code ' +
      'point value at the given position.',
    'args': 2
  }, {
    'name': 'String.concat',
    'doc': 'Combines the text of two strings and returns a new string.',
    'args': 2
  }, {
    'name': 'String.includes',
    'doc': 'Determines whether one string may be found within another string.',
    'args': 2
  }, {
    'name': 'String.endsWith',
    'doc': 'Determines whether a string ends with the characters of another string.',
    'args': 2
  }, {
    'name': 'String.indexOf',
    'doc': 'Returns the index within the calling String object of the first' +
      ' occurrence of the specified value, or -1 if not found.',
    'args': 2
  }, {
    'name': 'String.lastIndexOf',
    'doc': 'Returns the index within the calling String object of the ' +
      'last occurrence of the specified value, or -1 if not found.',
    'args': 2
  }, {
    'name': 'String.padEnd',
    'doc': 'Pads the current string from the end with a given string to ' +
      'create a new string from a given length.',
    'args': 1
  }, {
    'name': 'String.padStart',
    'doc': 'Pads the current string from the start with a given string to ' +
      'create a new string from a given length.',
    'args': 1
  }, {
    'name': 'String.slice',
    'doc': 'Extracts a section of a string and returns a new string.',
    'args': 2
  }, {
    'name': 'String.substr',
    'doc': 'Returns the characters in a string beginning at the specified' +
      ' location through the specified number of characters.',
    'args': 2
  }, {
    'name': 'String.toLocaleLowerCase',
    'doc': 'The characters within a string are converted to lower case while' +
      ' respecting the current locale. For most languages, this will return ' +
      'the same as toLowerCase().',
    'args': 1
  }, {
    'name': 'String.toLocaleUpperCase',
    'doc': 'The characters within a string are converted to upper case while ' +
      'respecting the current locale. For most languages, this will return ' +
      'the same as toUpperCase().',
    'args': 1
  }, {
    'name': 'String.toLowerCase',
    'doc': 'Returns the calling string value converted to lower case.',
    'args': 1
  }, {
    'name': 'String.toUpperCase',
    'doc': 'Returns the calling string value converted to uppercase.',
    'args': 1
  }, {
    'name': 'String.trim',
    'doc': 'Trims whitespace from the beginning and end of the string. ' +
      'Part of the ECMAScript 5 standard.',
    'args': 1
  }],
  'Miscellaneous': [{
    'name': 'now',
    'doc': 'Returns current timestamp. Add an argument to save this value ' +
      'in memory. Each call with the same argument will produce the same value.',
    'args': 0
  }, {
    'name': 'random',
    'doc': 'Generates random positive integer. Add an argument to save this ' +
      'value in memory. Each call with the same argument will produce the same value.',
    'args': 0
  }, {
    'name': 'encodeURIComponent',
    'doc': 'Encodes argument with encodeURIComponent() function.',
    'args': 1
  }, {
    'name': 'decodeURIComponent',
    'doc': 'Decodes argument with decodeURIComponent() function.',
    'args': 1
  }]
};
/**
 * Dialog to edit a variable.
 *
 * @memberof UiElements
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class VariableEditorDialog extends PolymerElement {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
    }

    .input {
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -ms-flex-direction: row;
      -webkit-flex-direction: row;
      flex-direction: row;

      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;
    }

    .input paper-input {
      -ms-flex: 1 1 0.000000001px;
      -webkit-flex: 1;
      flex: 1;
      -webkit-flex-basis: 0.000000001px;
      flex-basis: 0.000000001px;
    }

    .docs-list,
    paper-tabs {
      max-width: 600px;
    }

    .docs-list {
      margin-left: 12px;
    }

    .di {
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -ms-flex-direction: row;
      -webkit-flex-direction: row;
      flex-direction: row;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;
      margin: 8px 0;
    }

    .dc {
      -ms-flex: 1 1 0.000000001px;
      -webkit-flex: 1;
      flex: 1;
      -webkit-flex-basis: 0.000000001px;
      flex-basis: 0.000000001px;
    }

    dt {
      font-weight: 500;
    }

    code {
      background-color: var(--variable-editor-dialog-code-bacground, #FFECB3);
      display: block;
      padding: 8px 24px;
      margin: 12px 24px;
    }
    </style>
    <paper-dialog opened="{{opened}}" on-iron-overlay-closed="_onClosed">
      <h2>Variable editor</h2>
      <div class="input">
        <paper-input label="Variable value" value="{{value}}"></paper-input>
        <paper-icon-button icon="arc:visibility" on-click="_evaluate" title="Evaluate current value"></paper-icon-button>
      </div>
      <template is="dom-if" if="[[evaluated]]">
        <code>[[evaluated]]</code>
      </template>
      <paper-tabs selected="{{selectedDoc}}" on-iron-select="_resized">
        <paper-tab>String</paper-tab>
        <paper-tab>Math</paper-tab>
        <paper-tab>Miscellaneous</paper-tab>
      </paper-tabs>
      <paper-dialog-scrollable>
        <section class="docs-list">
          <dl on-click="_processFunctionInsertClick">
            <template is="dom-repeat" items="[[docs]]" id="repeater">
              <div class="di">
                <div class="dc">
                  <dt>[[item.name]]</dt>
                  <dd>[[item.doc]]</dd>
                </div>
                <paper-button raised="">Use</paper-button>
              </div>
            </template>
          </dl>
        </section>
      </paper-dialog-scrollable>
      <div class="buttons">
        <paper-button dialog-dismiss="">Cancel</paper-button>
        <paper-button dialog-confirm="" autofocus="">Accept</paper-button>
      </div>
    </paper-dialog>
    <paper-toast text="" id="errorToast" duration="5000"></paper-toast>
`;
  }

  static get is() {
    return 'variable-editor-dialog';
  }
  static get properties() {
    return {
      /**
       * Value of the variable.
       */
      value: String,
      // True if the dialog should be opened.
      opened: Boolean,
      // Selected documentation page
      selectedDoc: {
        type: Number,
        value: 0,
        observer: '_selectedDocChanged'
      },
      docs: Array,
      /**
       * Evaluated variable value
       */
      evaluated: String
    };
  }

  _selectedDocChanged(selectedDoc) {
    let docs;
    switch (selectedDoc) {
      case 0:
        docs = FnList.String;
        break;
      case 1:
        docs = FnList.Math;
        break;
      case 2:
        docs = FnList.Miscellaneous;
        break;
    }
    this.set('docs', docs);
  }

  _evaluate() {
    const value = this.value;
    if (!value) {
      return;
    }
    const e = new CustomEvent('evaluate-variable', {
      cancelable: true,
      composed: true,
      bubbles: true,
      detail: {
        value
      }
    });
    this.dispatchEvent(e);
    if (!e.defaultPrevented) {
      this.$.errorToast.text = 'Unable to find evaluator';
      this.$.errorToast.opened = true;
      this.dispatchEvent(new CustomEvent('send-analytics', {
        bubbles: true,
        composed: true,
        detail: {
          type: 'exception',
          description: 'Variable edito dialog - no evaluator',
          fatal: false
        }
      }));
      return;
    }
    e.detail.result
    .then((value) => this.set('evaluated', value))
    .catch((cause) => {
      this.$.errorToast.text = cause.message;
      this.$.errorToast.opened = true;
      console.warn(cause.message);
    });
  }
  /**
   * Handler for list item cloick.
   * Processes event if the target is the button.
   * @param {ClickEvent} e
   */
  _processFunctionInsertClick(e) {
    const target = e.target;
    if (target.nodeName !== 'PAPER-BUTTON') {
      return;
    }
    const instance = this.$.repeater.modelForElement(target);
    if (!instance) {
      return;
    }
    const model = instance.get('item');
    this._insertFunction(model);
  }

  _insertFunction(model) {
    let fn = model.name + '(';
    let letters;
    if (this.selectedDoc === 1) {
      letters = ['x', 'y', 'z'];
    } else {
      letters = ['a', 'b', 'c'];
    }
    letters.splice(model.args);
    fn += letters.join(', ');
    fn += ')';
    let expr = this.value;
    if (expr) {
      expr += ' ';
    }
    expr += fn;
    this.set('value', expr);
  }
  /**
   * Hanlder for dialog's close event
   * @param {CustomEvent} e
   */
  _onClosed(e) {
    e.stopPropagation();
    if (e.detail.canceled || !e.detail.confirmed) {
      return;
    }
    this.dispatchEvent(new CustomEvent('variable-editor-closed', {
      bubbles: true,
      composed: true,
      detail: {
        value: this.value
      }
    }));
  }

  _resized() {
    this.shadowRoot.querySelector('paper-dialog').notifyResize();
  }
}
window.customElements.define(VariableEditorDialog.is, VariableEditorDialog);
