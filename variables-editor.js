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

import '../../@polymer/polymer/lib/utils/render-status.js';
import '../../@polymer/paper-styles/paper-styles.js';
import '../../@polymer/iron-flex-layout/iron-flex-layout.js';
import '../../@polymer/iron-collapse/iron-collapse.js';
import '../../@polymer/iron-icon/iron-icon.js';
import '../../@polymer/paper-item/paper-item.js';
import '../../@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../../@polymer/paper-listbox/paper-listbox.js';
import '../../@polymer/paper-icon-button/paper-icon-button.js';
import '../../@polymer/paper-toast/paper-toast.js';
import '../../@polymer/paper-button/paper-button.js';
import '../../arc-icons/arc-icons.js';
import '../../environment-selector/environment-selector.js';
import '../../variables-consumer-mixin/variables-consumer-mixin.js';
import './variable-item.js';
import { html } from '../../@polymer/polymer/lib/utils/html-tag.js';
/**
 * A variables editor is an element to render UI for `variables-manager`.
 *
 * It displays list of user defined environments and variables associated with
 * the  environment.
 *
 * This element requires compatible variables manager to be present in the DOM. It
 * uses browser event system to communicate with the manager. See `variables-manager`
 * documentation for detailed API for data exchange.
 *
 * ### Example
 *
 * ```html
 * <variables-editor></variables-editor>
 * <variables-manager></variables-manager>
 * ```
 *
 * ### Styling
 *
 * `<variables-editor>` provides the following custom properties and mixins
 * for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--variables-editor` | Mixin applied to the element | `{}`
 * `--variables-editor-add-color` | Color of the `add` button | `--primary-color`
 * `--variables-editor-add-environment-color` | Color of the add environment
 * icon button | `rgba(0, 0, 0, 0.54)`
 * `--variables-editor-add-environment-color-hover | Color of the add environment
 * icon button when hovering | `--accent-color` or `rgba(0, 0, 0, 0.74)`
 * `--variables-editor-remove-env-color` | Color of the remove button (icon)
 * | `rgba(0, 0, 0, 0.24)`
 * `--variables-editor-remove-env-color-hover` | Color of the hovered remove
 * button (icon) | `#e64a19`
 * `--accent-color` | Background color of the primary action button | ``
 * `--primary-light-color` | Color of the primary action button | `#fff`
 * `--variables-editor-docs-frame-content` | Mixin applied to the colored
 * content container of the help section. | `{}`
 * `--variables-editor-docs-frame-content-background` | Background color of the
 * help section content container. | `#E1F5FE`
 * `--arc-font-title` | Theme mixin, applied to the tutorial title | `{}`
 * `--arc-font-body1` | Theme mixin, applied to text labels | `{}`
 * `--variables-editor-primary-button-background-color` | Background color of
 * the primary action button | `--accent-color`
 * `--variables-editor-primary-button-color` | Color of the primary action
 * button | `--primary-light-color` or `#fff`
 * `--primary-button` | Mixin applied to the primary button | `{}`
 * `--variable-item` | Mixin applied to the variable item container | `{}`
 * `--variable-item-name-input` | Mixin applied to the `paper-input` for
 * variable name | `{}`
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
 * @appliesMixin ArcComponents.VariablesConsumerMixin
 */
class VariablesEditor extends ArcComponents.VariablesConsumerMixin(PolymerElement) {
  static get template() {
    return html`
    <style>
     :host {
      display: block;
      padding: 12px;
      @apply --variables-editor;
      --button-transition: color 0.2s linear;
    }

    .add-button {
      transition: var(--button-transition);
      color: var(--variables-editor-add-color, var(--primary-color));
    }

    .primary-button {
      background-color: var(--variables-editor-primary-button-background-color, var(--accent-color));
      color: var(--variables-editor-primary-button-color, var(--primary-light-color, #fff));
      @apply --primary-button;
    }

    .env-selector {
      @apply --layout-horizontal;
      @apply --layout-end;
      @apply --layout-wrap;
      margin-bottom: 20px;
    }

    .env-selector paper-button {
      height: 40px;
      margin-bottom: 8px;
    }

    .app-link {
      text-decoration: none;
      color: inherit;
    }

    .doc-frame {
      padding: 24px;
      background-color: var(--variables-editor-docs-frame-content-background, #E1F5FE);
      @apply --arc-font-body1;
      @apply --variables-editor-docs-frame-content;
    }

    .flex {
      @apply --layout-flex;
    }

    .add-editor {
      margin: 40px 0;
      background-color: var(--variables-editor-add-environment-content-background-color, #f5f5f5);
      padding-left: 12px;
      padding-right: 12px;
      padding-bottom: 20px;
      @apply --variables-editor-add-environment-content;
    }

    #editorEnvName {
      margin-bottom: 20px;
    }

    .tutorial-title {
      margin-top: 0;
      @apply --arc-font-title;
    }

    .tutorial-title-label {
      vertical-align: middle;
      margin-left: 8px;
    }

    .tutorial-link {
      margin-top: 12px;
      margin-bottom: 0;
    }

    .text-link {
      color: rgba(0, 0, 0, 0.74);
    }

    .tutorial-link iron-icon {
      width: 16px;
      height: 16px;
      color: rgba(0, 0, 0, 0.74);
    }
    </style>
    <section>
      <div class="env-selector">
        <environment-selector id="envSelector" selected="{{environment}}"></environment-selector>
        <paper-button on-click="openAddEnvironmentForm" class="add-env" title="Add new environment">Add</paper-button>
        <template is="dom-if" if="[[allowRemove]]">
          <paper-button on-click="_deleteEnvironment" class="remove-env" title="Remove environment and variables">Remove</paper-button>
        </template>
        <div class="flex"></div>
        <a href="https://restforchrome.blogspot.com/2016/11/variables-and-environments-in-advanced.html" target="_blank" class="app-link" on-click="_openHelp" title="Open variables documentation">
          <paper-button class="info-button">Help</paper-button>
        </a>
      </div>
      <iron-collapse opened="[[envEditorOpened]]">
        <div class="add-editor">
          <paper-input id="editorEnvName" label="Environment name" on-keydown="_addEnvInput" required="" on-input="_revalidateEnvInput"></paper-input>
          <paper-button on-click="_addEnvironment" class="primary-button">Save environment</paper-button>
          <paper-button on-click="closeAddEnvironmentForm" class="">Cancel</paper-button>
        </div>
      </iron-collapse>
    </section>
    <section hidden\$="[[envEditorOpened]]">
      <template is="dom-repeat" items="[[_filtered]]" id="repeater">
        <variable-item item="[[item]]" on-empty-variable-remove="_removeEmptyVariable"></variable-item>
      </template>
      <template is="dom-if" if="[[!hasVariables]]">
        <div class="doc-frame">
          <h4 class="tutorial-title"><iron-icon icon="arc:code"></iron-icon><span class="tutorial-title-label">Upgrade request with variables</span></h4>
          <p>Put <code>\${variableName}</code> into any request field and the value will be inserted at run time.</p>
          <paper-button raised="" class="primary-button" on-click="addVariable">Add variable</paper-button>
          <p class="tutorial-link">
            <a href="https://restforchrome.blogspot.co.uk/2016/11/variables-and-environments-in-advanced.html" target="_blank" class="text-link" on-click="_openHelp">Learn more about variables.</a>
            <iron-icon icon="arc:open-in-new"></iron-icon>
          </p>
        </div>
      </template>
    </section>
    <section hidden\$="[[_computeAddButtonHidden(envEditorOpened, hasVariables)]]">
      <paper-button class="add-button add-var" on-click="addVariable">Add variable</paper-button>
    </section>
    <paper-toast text="" id="infoToast"></paper-toast>
`;
  }

  static get is() {return 'variables-editor';}
  static get properties() {
    return {
      /**
       * Computed value, set to `true` if the environment can be removed.
       * Only `default` environment can't be deleted
       */
      allowRemove: {
        type: Boolean,
        computed: '_computeAllowRemove(environment)'
      },
      // True if the environment editor is opened.
      envEditorOpened: {
        type: Boolean,
        value: false
      },

      _filtered: {
        type: Array,
        computed: '_processVariables(variables.*)'
      }
    };
  }

  static get observers() {
    return [
      '_processEnvSplices(environments.splices)'
    ];
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
   * Sends environment-updated event to the model
   * @param {Object} value Anvironment value to update.
   * @return {CustomEvent}
   */
  _dispatchEnvUpdated(value) {
    return this._dispatch('environment-updated', {
      value
    });
  }
  /**
   * Sends environment-deleted event to the model
   * @param {String} id ID of deleted environment
   * @return {CustomEvent}
   */
  _dispatchEnvDeleted(id) {
    return this._dispatch('environment-deleted', {
      id
    });
  }
  /**
   * Sends usage google analytics event
   * @param {String} action Action description
   * @return {CustomEvent}
   */
  _sendGaEvent(action) {
    return this._dispatch('send-analytics', {
      type: 'event',
      category: 'Variables editor',
      action
    }, false);
  }
  /**
   * Sends error event to google analytics
   * @param {String} message Exception message
   * @return {CustomEvent}
   */
  _sendGaError(message) {
    return this._dispatch('send-analytics', {
      type: 'exception',
      description: message,
      fatal: false
    }, false);
  }
  /**
   * Shows toast with the message
   * @param {String} message
   */
  _toast(message) {
    this.$.infoToast.text = message;
    this.$.infoToast.opened = true;
  }
  /**
   * Processes variables list returned by the variables manager.
   * Filters out variables that are set in platform environment.
   *
   * @param {Object} record Change record
   * @return {Array} Updated list of variables.
   */
  _processVariables(record) {
    const variables = record && record.base;
    if (!variables) {
      return variables;
    }
    return variables.filter((item) => !item.sysVar);
  }
  /**
   * Computes value for `allowRemove` property.
   * @param {[type]} environment [description]
   * @return {[type]} [description]
   */
  _computeAllowRemove(environment) {
    return !!(environment && environment !== 'default');
  }

  /**
   * Opens environment editor.
   */
  openAddEnvironmentForm() {
    this.envEditorOpened = true;
  }
  /**
   * Closes environment editor.
   */
  closeAddEnvironmentForm() {
    this.envEditorOpened = false;
  }
  /**
   * Finds environment model by name.
   * The list of environments are stored in memory in environment selector.
   * To simplify the logic this element won't hold it's own copy of environments list.
   * @param {String} name Name of the environment to find.
   * @return {Object|undefined} Environment model or undefined if not found.
   */
  _findEnvironment(name) {
    const envs = this.$.envSelector.environments;
    if (!envs || !envs.length) {
      return;
    }
    const lowerName = name.toLowerCase();
    for (let i = 0, len = envs.length; i < len; i++) {
      const tmp = envs[i] && envs[i].name;
      if (!tmp) {
        continue;
      }
      if (tmp.toLowerCase() === lowerName) {
        return envs[i];
      }
    }
  }
  /**
   * Validates user input when adding an environment.
   * It renders a message to the user if input did not passed the validation.
   * @param {String} name
   * @return {Boolean} True if user input is valid.
   */
  _validateEnvironmentInput(name) {
    if (!name) {
      this.$.editorEnvName.errorMessage = 'Name is required.';
      this.$.editorEnvName.validate();
      return false;
    }
    const lowerName = name.toLowerCase();
    if (lowerName === 'default') {
      this.$.editorEnvName.errorMessage = 'This name is reserved. Please, use different name.';
      this.$.editorEnvName.invalid = true;
      this._sendGaEvent('Addind reserved name environment');
      return false;
    }
    const env = this._findEnvironment(lowerName);
    if (env) {
      this.$.editorEnvName.errorMessage = 'Environment already exists. Please, use different name.';
      this.$.editorEnvName.invalid = true;
      this._sendGaEvent('Addind existing environment');
      return false;
    }
    return true;
  }
  /**
   * Handler for the save action for add environment form.
   * Validates user input and sends `environment-updated` event to the model.
   *
   * @return {Promise}
   */
  _addEnvironment() {
    const name = this.$.editorEnvName.value;
    if (!this._validateEnvironmentInput(name)) {
      return;
    }
    const obj = {
      name: name,
      created: Date.now()
    };
    const e = this._dispatchEnvUpdated(obj);
    if (!e.defaultPrevented) {
      this._toast('Variables manager not found. Please, report an issue.');
      this._sendGaError('Add environment - no manager');
      throw new Error('Variables manager not found.');
    }

    this.closeAddEnvironmentForm();
    this._sendGaEvent('Add environment');

    return e.detail.result
    .then(() => {
      this.$.editorEnvName.value = '';
    })
    .catch((cause) => {
      this._toast(cause.message);
      this._sendGaError('Add environment-' + cause.message);
    });
  }
  /**
   * Handler for the delete button.
   * @return {Promise}
   */
  _deleteEnvironment() {
    const envName = this.environment;
    if (envName === 'default') {
      let msg = 'Unable to remove default environment';
      this._toast(msg);
      return Promise.reject(new Error(msg));
    }
    const env = this._findEnvironment(envName);
    if (!env) {
      this._toast(`Model for ${envName} cannot be found.`);
      let msg = 'Environment not om the list when deleting';
      this._sendGaError(msg);
      return Promise.reject(new Error(msg));
    }
    const e = this._dispatchEnvDeleted(env._id);
    if (!e.defaultPrevented) {
      this._toast('Variables manager not found. Please, report an issue.');
      this._sendGaError('Remove environment - no manager');
      return Promise.reject(new Error('Variables manager not found'));
    }
    this._sendGaEvent('Delete environment');
    return e.detail.result
    .catch((cause) => {
      this._toast(cause.message);
      this._sendGaError('Delete environment-' + cause.message);
    });
  }
  /**
   * Add new, empty variable.
   */
  addVariable() {
    const obj = {
      environment: this.environment,
      enabled: false
    };
    if (!this.variables) {
      this.set('variables', [obj]);
    } else {
      this.push('variables', obj);
    }
    this._sendGaEvent('Add variable form');
  }
  /**
   * Removes unsaved variable
   * @param {CustomEvent} e
   */
  _removeEmptyVariable(e) {
    const index = e.model.get('index');
    if (isNaN(index) || index < 0 || (!index && index !== 0)) {
      return;
    }
    this.splice('variables', index, 1);
  }

  _computeAddButtonHidden(envEditorOpened, hasVariables) {
    return envEditorOpened || !hasVariables;
  }

  /**
   * Opens documentation page for the module.
   *
   * @param {Event} e
   * @return {Window|undefined}
   */
  _openHelp(e) {
    let url = e.currentTarget.href;
    const ev = this._dispatch('open-external-url', {
      url
    });
    if (ev.defaultPrevented) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    return window.open(url);
  }
  /**
   * Checks for "enter" key to add environment.
   * @param {KeyboardEvent} e
   */
  _addEnvInput(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      this._addEnvironment();
    }
  }

  _processEnvSplices(record) {
    const info = record && record.indexSplices && record.indexSplices[0];
    if (!info || info.addedCount !== 1) {
      return;
    }
    const name = info.object[info.index].name;
    this.set('environment', name);
  }
  /**
   * Validates user input when environment name change.
   */
  _revalidateEnvInput() {
    if (!this.$.editorEnvName.validate()) {
      const msg = 'Name is required.';
      if (this.$.editorEnvName.errorMessage !== msg) {
        this.$.editorEnvName.errorMessage = msg;
      }
    }
  }
  /**
   * When an external URL is requested to open.
   * @event open-external-url
   * @param {url}
   */
}
window.customElements.define(VariablesEditor.is, VariablesEditor);