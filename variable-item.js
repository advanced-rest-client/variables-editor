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
import { PolymerElement } from '../../@polymer/polymer/polymer-element.js';

import '../../@polymer/paper-styles/paper-styles.js';
import '../../@polymer/iron-flex-layout/iron-flex-layout.js';
import '../../@polymer/paper-icon-button/paper-icon-button.js';
import '../../@polymer/paper-checkbox/paper-checkbox.js';
import '../../uuid-generator/uuid-generator.js';
import '../../@polymer/paper-input/paper-input.js';
import './variable-editor-dialog.js';
import { html } from '../../@polymer/polymer/lib/utils/html-tag.js';
/**
 * # `variable-item`
 *
 * It is a variable list item to be displayed in the `<variable-editor>`.
 *
 * ### Styling
 *
 * `<variable-item>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--variable-item` | Mixin applied to the element | `{}`
 * `--variable-item-name-input` | Mixin applied to the `paper-input`
 * for variable name | `{}`
 * `--variable-item-value-input` | Mixin applied to the `paper-input` for
 * variable value | `{}`
 * `--variable-item-checkbox` | Mixin applied to the state checkbox | `{}`
 * `--inline-fom-action-icon-color` | Theme variable, color of the delete
 * variable icon | `rgba(0, 0, 0, 0.74)`
 * `--inline-fom-action-icon-color-hover` | Theme variable, color of the
 * delete variable icon when hovering | `--accent-color` or `rgba(0, 0, 0, 0.74)`
 *
 * @memberof UiElements
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class VariableItem extends PolymerElement {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      position: relative;
      @apply --variable-item;
    }

    #container {
      @apply --layout-horizontal;
      @apply --layout-flex;
      @apply --layout-end;
    }

    .variable-name {
      margin-right: 12px;
      @apply --variable-item-name-input;
    }

    .variable-value {
      @apply --layout-flex;
      @apply --variable-item-value-input;
    }

    paper-checkbox {
      margin-bottom: 12px;
      @apply --variable-item-checkbox;
    }

    .action-icon {
      color: var(--inline-fom-action-icon-color, rgba(0, 0, 0, 0.74));
      transition: color 0.2s linear;
    }

    .action-icon:hover {
      color: var(--inline-fom-action-icon-color-hover, var(--accent-color, rgba(0, 0, 0, 0.74)));
    }

    input[type="text"] {
      @apply --paper-input-container-shared-input-style;
    }
    </style>
    <div id="container">
      <paper-checkbox checked="{{item.enabled}}" title="Enabled" on-change="_somethingChanged"></paper-checkbox>
      <paper-input class="variable-name" label="Variable name" value="{{item.variable}}" no-label-float="" inline="" auto-validate="" required="" allowed-pattern="[a-zA-Z0-9_-]" prevent-invalid-input="" error-message="Variable name is not valid" on-change="_somethingChanged"></paper-input>
      <paper-input class="variable-value" label="Variable value" value="{{item.value}}" no-label-float="" inline="" auto-validate="" required="" error-message="Variable name is not valid" on-change="_somethingChanged"></paper-input>
      <paper-icon-button class="action-icon" icon="arc:edit" on-click="_openVariableEditor" title="Edit variable in the editor"></paper-icon-button>
      <paper-icon-button class="action-icon" icon="arc:close" on-click="_removeVariable" title="Remove variable"></paper-icon-button>
    </div>
`;
  }

  static get is() {return 'variable-item';}
  static get properties() {
    return {
      /**
       * A variable database object.
       * Initially it will contain an _id and _rev object and data will be get from the database.
       * Special case is when creating new variable. It will then contain an initial data but no ID.
       */
      item: Object,
      // A list of names that are restricted
      reservedNames: {
        type: Array,
        value() {
          return ['now', 'random'];
        }
      },
      /**
       * Number of milliseconds after which the item is persisted in the data
       * store after any property change.
       */
      debounceTimeout: {
        type: Number,
        value: 350
      },
      /**
       * True if during the save another change occured and the item
       * schould be saved again.
       */
      _isDirty: Boolean,
      /** True if the item is currently being updated. */
      _updatingModel: Boolean
    };
  }
  static get observers() {
    return ['_itemChanged(item._rev)'];
  }

  constructor() {
    super();
    this._onVariableEditorClosed = this._onVariableEditorClosed.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('variable-editor-closed', this._onVariableEditorClosed);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
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
   * Called when item's `_rev` property changed (due to datastore update).
   * It checks if between save action and now the user made changes in the editor
   * and if so it updates the item again.
   */
  _itemChanged() {
    this._updatingModel = false;
    if (this._isDirty) {
      this._somethingChanged();
    }
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
      this.set('item.enabled', true);
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
  _updateItem() {
    this._updatingModel = true;
    const item = this.item;
    if (!item._id) {
      const gen = document.createElement('uuid-generator');
      item._id = gen.generate();
    }
    return this._dispatch('variable-updated', {
      value: Object.assign({}, item)
    });
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
    dialog.value = this.item.value;
    dialog.opened = true;
  }
  /**
   * Called when the editor dialog is closed and sets new value.
   * @param {CustomEvent} e
   */
  _onVariableEditorClosed(e) {
    this.set('item.value', e.detail.value);
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
window.customElements.define(VariableItem.is, VariableItem);