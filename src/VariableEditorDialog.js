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
import { AnypointDialog } from '@anypoint-web-components/anypoint-dialog/src/AnypointDialog.js'
import styles from '@anypoint-web-components/anypoint-dialog/src/AnypointDialogInternalStyles.js'
import { html, css } from 'lit-element';
import '@anypoint-web-components/anypoint-dialog/anypoint-dialog-scrollable.js';
import '@anypoint-web-components/anypoint-input/anypoint-input.js';
import { visibility } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '@anypoint-web-components/anypoint-tabs/anypoint-tabs.js';
import '@anypoint-web-components/anypoint-tabs/anypoint-tab.js';
import FnList from './Functions.js';

/**
 * Dialog to edit a variable.
 *
 * @memberof UiElements
 * @customElement
 * @demo demo/index.html
 */
export class VariableEditorDialog extends AnypointDialog {
  static get styles() {
    return [
      styles,
      css`
      :host {
        display: flex;
        flex-direction: column;
      }

      .input {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .input anypoint-input {
        flex: 1;
        flex-basis: 0.000000001px;
      }

      .docs-list,
      anypoint-tabs {
        max-width: 600px;
      }

      anypoint-tabs {
        min-height: 48px;
      }

      .docs-list {
        margin-left: 12px;
      }

      .di {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 8px 0;
      }

      .dc {
        flex: 1;
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

      .scrollable {
        overflow: auto;
        padding: 0 24px;
      }`
    ];
  }

  render() {
    const { compatibility, outlined, value, evaluated, selectedDoc } = this;
    const docs = this.docs || [];
    return html`
    <h2 class="title">Variable editor</h2>

    <div class="input">
      <anypoint-input
        .value="${value}"
        @value-changed="${this._valueHandler}"
        ?compatibility="${compatibility}"
        ?outlined="${outlined}"
      >
        <label slot="label">Variable value</label>
      </anypoint-input>
      <anypoint-icon-button
        class="action-icon"
        aria-label="Activate to evaluate the value"
        title="Evaluate the value"
        @click="${this._evaluate}"
        ?compatibility="${compatibility}">
        <span class="icon">${visibility}</span>
      </anypoint-icon-button>
    </div>

    ${evaluated ? html`<code>${evaluated}</code>` : ''}

    <anypoint-tabs
      .selected="${selectedDoc}"
      @select="${this._docSelectHandler}"
      ?compatibility="${compatibility}"
    >
      <anypoint-tab ?compatibility="${compatibility}">String</anypoint-tab>
      <anypoint-tab ?compatibility="${compatibility}">Math</anypoint-tab>
      <anypoint-tab ?compatibility="${compatibility}">Miscellaneous</anypoint-tab>
    </anypoint-tabs>

    <div class="scrollable">
      <section class="docs-list">
        <dl @click="${this._processFunctionInsertClick}">
          ${docs.map((item, index) => html`<div class="di">
            <div class="dc">
              <dt>${item.name}</dt>
              <dd>${item.doc}</dd>
            </div>
            <anypoint-button
              data-index="${index}"
              emphasis="medium"
              ?compatibility="${compatibility}"
              aria-label="Activate to insert function into the text field"
            >Use</anypoint-button>
          </div>`)}
        </dl>
      </section>
    </div>

    <div class="buttons">
      <anypoint-button ?compatibility="${compatibility}" dialog-dismiss>Cancel</anypoint-button>
      <anypoint-button ?compatibility="${compatibility}" dialog-confirm>Accept</anypoint-button>
    </div>`;
  }

  static get properties() {
    return {
      /**
       * Value of the variable.
       */
      value: { type: String },
      // Selected documentation page
      selectedDoc: { type: Number },
      docs: { type: Array },
      /**
       * Evaluated variable value
       */
      evaluated: { type: String }
    };
  }

  get selectedDoc() {
    return this._selectedDoc;
  }

  set selectedDoc(value) {
    const old = this._selectedDoc;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this._selectedDoc = value;
    this.requestUpdate('selectedDoc', old);
    this._selectedDocChanged(value);
  }

  constructor() {
    super();
    this.value = '';
    this.selectedDoc = 0;
    this.noCancelOnOutsideClick = true;
    this._onClosed = this._onClosed.bind(this);
  }

  connectedCallback() {
    /* istanbul ignore else */
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this.addEventListener('overlay-closed', this._onClosed);
  }

  disconnectedCallback() {
    /* istanbul ignore else */
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    this.removeEventListener('overlay-closed', this._onClosed);
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
    this.docs = docs;
  }

  async _evaluate() {
    const { value } = this;
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
    try {
      const value = await e.detail.result;
      this.evaluated = value;
    } catch (e) {
      this.evaluated = e.message;
    }
  }
  /**
   * Handler for list item cloick.
   * Processes event if the target is the button.
   * @param {ClickEvent} e
   */
  _processFunctionInsertClick(e) {
    const target = e.target;
    if (target.nodeName !== 'ANYPOINT-BUTTON') {
      return;
    }
    const index = Number(target.dataset.index);
    const model = this.docs[index];
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
    this.value = expr;
  }
  /**
   * Hanlder for dialog's close event
   * @param {CustomEvent} e
   */
  _onClosed(e) {
    this.opened = false;
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

  _valueHandler(e) {
    this.value = e.detail.value;
  }

  async _docSelectHandler(e) {
    this.selectedDoc = e.target.selected;
    await this.updateComplete;
    this.notifyResize();
  }
}
