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
import { LitElement, html, css } from 'lit-element';
import { edit, close } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import '@anypoint-web-components/anypoint-switch/anypoint-switch.js';
import '@advanced-rest-client/uuid-generator/uuid-generator.js';
import '@anypoint-web-components/anypoint-input/anypoint-input.js';
import '../variable-editor-dialog.js';
/**
 * # `variable-item`
 *
 * It is a variable list item to be displayed in the `<variable-editor>`.
 *
 * @memberof UiElements
 * @customElement
 * @demo demo/index.html
 */
export class VariableItem extends LitElement {
  static get styles() {
    return css`
    :host {
      display: block;
      position: relative;
    }

    #container {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex: 1;
      flex-basis: 0.000000001px;
    }

    .variable-name {
      margin-right: 12px;
    }

    .variable-value {
      flex: 1;
      flex-basis: 0.000000001px;
    }

    .icon {
      width: 24px;
      height: 24px;
      display: inline-block;
      fill: currentColor;
    }
    `
  }

  render() {
    const item = this.item || {};
    const { compatibility, outlined } = this;
    return html`
    <div id="container">
      <anypoint-switch
        .checked="${item.enabled}"
        @checked-changed="${this._toogleEnabled}"
        ?compatibility="${compatibility}"
        ?outlined="${outlined}"
        title="Enabled"
        aria-label="Toggle variable enabled state"
        name="enabled"
      ></anypoint-switch>
      <anypoint-input
        class="variable-name"
        .value="${item.variable}"
        name="variable"
        @value-changed="${this._inputValueHandler}"
        nolabelfloat
        autovalidate
        required
        allowedpattern="[a-zA-Z0-9_-]"
        preventinvalidinput
        invalidmessage="Variable name is not valid"
        ?compatibility="${compatibility}"
        ?outlined="${outlined}"
      >
        <label slot="label">Variable name</label>
      </anypoint-input>
      <anypoint-input
        class="variable-value"
        .value="${item.value}"
        name="value"
        @value-changed="${this._inputValueHandler}"
        nolabelfloat
        autovalidate
        required
        preventinvalidinput
        invalidmessage="Variable value is required"
        ?compatibility="${compatibility}"
        ?outlined="${outlined}"
      >
        <label slot="label">Variable value</label>
      </anypoint-input>

      <anypoint-icon-button
        class="action-icon"
        aria-label="Edit variable in the editor"
        title="Edit variable in the editor"
        @click="${this._openVariableEditor}"
        ?compatibility="${compatibility}">
        <span class="icon">${edit}</span>
      </anypoint-icon-button>
      <anypoint-icon-button
        class="action-icon"
        aria-label="Remove variable"
        title="Remove variable"
        @click="${this._removeVariable}"
        ?compatibility="${compatibility}">
        <span class="icon">${close}</span>
      </anypoint-icon-button>
    </div>`;
  }

  static get properties() {
    return {
      /**
       * A variable database object.
       * Initially it will contain an _id and _rev object and data will be get from the database.
       * Special case is when creating new variable. It will then contain an initial data but no ID.
       */
      item: { type: Object },
      /**
       * Number of milliseconds after which the item is persisted in the data
       * store after any property change.
       */
      debounceTimeout: { type: Number },
      /**
       * Enables compatibility with Anypoint platform
       */
      compatibility: { type: Boolean },
      /**
       * Enables Material Design Outlined inputs
       */
      outlined: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.debounceTimeout = 350;
    this._onVariableEditorClosed = this._onVariableEditorClosed.bind(this);
  }

  connectedCallback() {
    /* istanbul ignore else */
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this.addEventListener('variable-editor-closed', this._onVariableEditorClosed);
  }

  disconnectedCallback() {
    /* istanbul ignore else */
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    this.removeEventListener('variable-editor-closed', this._onVariableEditorClosed);
  }

  /**
   * Dispatches bubbling and composed custom event.
   * By default the event is cancelable until `cancelable` property is set to false.
   * @param {String} type Event type
   * @param {?any} detail A detail to set
   * @param {?Boolean} cancelable When false the event is not cancelable.
   * @return {CustomEvent}
   */
  _dispatch(type, detail, cancelable) {
    if (typeof cancelable !== 'boolean') {
      cancelable = true;
    }
    const e = new CustomEvent(type, {
      bubbles: true,
      composed: true,
      cancelable,
      detail
    });
    this.dispatchEvent(e);
    return e;
  }
  /**
   * To be called when any `item` property change.
   * Updates variable value.
   */
  _somethingChanged() {
    if (this._updatingModel) {
      this._isDirty = true;
      return;
    }
    const item = this.item;
    if (!item.variable || !item.value) {
      return;
    }
    if (!this.item._id) {
      this.item.enabled = true;
    }
    if (this.__updatingVariableItemDebounce) {
      return;
    }
    this.__updatingVariableItemDebounce = true;
    setTimeout(() => {
      this.__updatingVariableItemDebounce = false;
      this._updateItem();
    }, this.debounceTimeout);
  }
  /**
   * Sends event to data model to update the variable.
   * @return {Promise}
   */
  async _updateItem() {
    this._updatingModel = true;
    const item = this.item;
    if (!item._id) {
      const gen = document.createElement('uuid-generator');
      item._id = gen.generate();
    }
    const e = this._dispatch('variable-updated', {
      value: Object.assign({}, item)
    });
    let result;
    try {
      result = await e.detail.result;
    } catch (e) {
      // ..
    }
    this._updatingModel = false;
    return result;
  }
  /**
   * Handler for the remove button click.
   * @return {Promise}
   */
  _removeVariable() {
    const id = this.item._id;
    if (!id) {
      return this._dispatch('empty-variable-remove', undefined, false);
    }
    this._dispatch('send-analytics', {
      type: 'event',
      category: 'Variables editor',
      action: 'Delete variable'
    }, false);
    return this._dispatch('variable-deleted', {
      id
    });
  }
  /**
   * Opens the variable editor dialog.
   */
  _openVariableEditor() {
    let dialog = this.shadowRoot.querySelector('variable-editor-dialog');
    if (!dialog) {
      dialog = document.createElement('variable-editor-dialog');
      this.shadowRoot.appendChild(dialog);
    }
    setTimeout(() => {
      dialog.value = this.item.value;
      dialog.compatibility = this.compatibility;
      dialog.outlined = this.outlined;
      dialog.opened = true;
    });
  }
  /**
   * Called when the editor dialog is closed and sets new value.
   * @param {CustomEvent} e
   */
  _onVariableEditorClosed(e) {
    this.item.value = e.detail.value;
    this._somethingChanged();
    this.requestUpdate();
  }

  _toogleEnabled(e) {
    this.item.enabled = e.detail.value;
    this._somethingChanged();
  }

  _inputValueHandler(e) {
    const { name, value, required } = e.target;
    if (required && !value) {
      e.target.validate();
      return;
    }
    this.item[name] = value;
    this._somethingChanged();
  }
  /**
   * Fired when the variable has been removed from the data-store.
   * Event should be handled by the `variables-editor` to remove it from the UI.
   *
   * @event variable-deleted
   * @param {String} id Variable ID
   */
  /**
   * Fired when not-saved variable has ben requested to be removed.
   *
   * @event empty-variable-remove
   */
}
