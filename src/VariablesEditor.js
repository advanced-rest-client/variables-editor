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
import { VariablesConsumerMixin } from '@advanced-rest-client/variables-consumer-mixin/variables-consumer-mixin.js';
import { LitElement, html, css } from 'lit-element';
import { cache } from 'lit-html/directives/cache.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import '@anypoint-web-components/anypoint-dropdown-menu/anypoint-dropdown-menu.js';
import '@anypoint-web-components/anypoint-listbox/anypoint-listbox.js';
import { openInNew } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '@advanced-rest-client/environment-selector/environment-selector.js';
import '../variable-item.js';
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
 * @memberof UiElements
 * @customElement
 * @demo demo/index.html
 * @appliesMixin VariablesConsumerMixin
 */
export class VariablesEditor extends VariablesConsumerMixin(LitElement) {
  static get styles() {
    return css`
    :host {
      display: block;
      padding: 12px;
    }

    .env-selector {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
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
      border: 1px #e5e5e5 solid;
      font-size: var(--arc-font-body1-font-size);
      font-weight: var(--arc-font-body1-font-weight);
      line-height: var(--arc-font-body1-line-height);
    }

    .flex {
      flex: 1 1 auto;
    }

    .add-editor {
      margin: 40px 0;
    }

    #editorEnvName {
      margin-bottom: 20px;
    }

    .tutorial-link {
      margin-top: 12px;
      margin-bottom: 0;
    }

    .text-link {
      vertical-align: middle;
    }

    .tutorial-link .icon {
      width: 16px;
      height: 16px;
      opacity: 0.74;
      vertical-align: middle;
      fill: currentColor;
    }

    .icon {
      width: 24px;
      height: 24px;
      display: inline-block;
      fill: currentColor;
    }

    .tutorial-add-button {
      margin-top: 24px;
    }`;
  }

  _selectorTemplate() {
    const { environment, allowRemove, compatibility, outlined } = this;
    return html`<div class="env-selector">
      <environment-selector
        id="envSelector"
        .selected="${environment}"
        ?compatibility="${compatibility}"
        ?outlined="${outlined}"
      ></environment-selector>

      <anypoint-button
        @click="${this.openAddEnvironmentForm}"
        emphasis="medium"
        class="add-env"
        ?compatibility="${compatibility}"
        aria-label="Activate to add new environment"
        title="Add new environment"
      >Add</anypoint-button>

      ${allowRemove ? html`
      <anypoint-button
        @click="${this._deleteEnvironment}"
        emphasis="medium"
        class="remove-env"
        ?compatibility="${compatibility}"
        aria-label="Activate to remove the environment and variables"
        title="Remove environment and variables"
      >Remove</anypoint-button>` : ''}

      <div class="flex"></div>

      <a
        href="https://restforchrome.blogspot.com/2016/11/variables-and-environments-in-advanced.html"
        target="_blank"
        class="app-link"
        @click="${this._openHelp}"
        title="Open variables documentation">
        <anypoint-button ?compatibility="${compatibility}" class="info-button">Help</anypoint-button>
      </a>
    </div>`;
  }

  _addEnvFormTemplate() {
    const { envEditorOpened } = this;
    if (!envEditorOpened) {
      return '';
    }
    const { compatibility, outlined } = this;
    return html`
      <div class="add-editor">
        <anypoint-input
          id="editorEnvName"
          @keydown="_addEnvInput"
          required
          @value-changed="${this._revalidateEnvInput}"
          ?compatibility="${compatibility}"
          ?outlined="${outlined}"
        >
          <label slot="label">Environment name</label>
        </anypoint-input>
        <anypoint-button
          @click="${this._addEnvironment}"
          class="primary-button"
          emphasis="high"
          ?compatibility="${compatibility}">Save environment</anypoint-button>
        <anypoint-button
          @click="${this.closeAddEnvironmentForm}"
          ?compatibility="${compatibility}"
          >Cancel</anypoint-button>
      </div>`;
  }

  _editorTemplate() {
    const items = this._filtered || [];
    const { hasVariables, compatibility, outlined } = this;
    return html`<section>
      ${items.map((item, index) => html`<variable-item
        .item="${item}"
        data-index="${index}"
        @empty-variable-remove="${this._removeEmptyVariable}"
        ?compatibility="${compatibility}"
        ?outlined="${outlined}"></variable-item>`)}
      ${hasVariables ? '' : this._emptySateTemplate()}
    </section>`;
  }

  _emptySateTemplate() {
    const { compatibility } = this;
    return html`<div class="doc-frame">
      <p>
        Put <code>\${variableName}</code> into any request field and the value will be inserted at run time.
      </p>
      <p class="tutorial-link">
        <a
          href="https://restforchrome.blogspot.co.uk/2016/11/variables-and-environments-in-advanced.html"
          target="_blank"
          class="text-link"
          @click="${this._openHelp}"
        >Learn more about variables.</a>
        <span class="icon">${openInNew}</span>
      </p>

      <anypoint-button
        @click="${this.addVariable}"
        ?compatibility="${compatibility}"
        emphasis="high"
        class="tutorial-add-button"
      >Add variable</anypoint-button>
    </div>`;
  }

  render() {
    const { envEditorOpened, addButtonHidden, compatibility } = this;
    return html`
    <section>
      ${this._selectorTemplate()}
      ${this._addEnvFormTemplate()}
    </section>
    ${cache(envEditorOpened ? html`` : this._editorTemplate())}
    ${addButtonHidden ? '' : html`<section>
      <anypoint-button
        class="add-button add-var"
        @click="${this.addVariable}"
        ?compatibility="${compatibility}">Add variable</anypoint-button>
    </section>`}
    `;
  }

  static get properties() {
    return {
      // True if the environment editor is opened.
      envEditorOpened: { type: Boolean },

      _filtered: { type: Array },

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
  /**
   * When true then add variable button is hidden.
   * @return {Boolean}
   */
  get addButtonHidden() {
    const { envEditorOpened, hasVariables } = this;
    return !!envEditorOpened || !hasVariables;
  }
  /**
   * Computed value, set to `true` if the environment can be removed.
   * Only `default` environment can't be deleted
   * @return {Boolean}
   */
  get allowRemove() {
    const { environment } = this;
    return !!(environment && environment !== 'default');
  }

  get editorEnvName() {
    return this.shadowRoot.querySelector('#editorEnvName');
  }

  constructor() {
    super();
    this.selectedDoc = 0;
    this._variablesHandler = this._variablesHandler.bind(this);
  }

  connectedCallback() {
    /* istanbul ignore else */
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this.addEventListener('variables-changed', this._variablesHandler);
  }

  disconnectedCallback() {
    /* istanbul ignore else */
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    this.removeEventListener('variables-changed', this._variablesHandler);
  }

  _variablesHandler(e) {
    const variables = e.detail.value;
    if (!variables) {
      this._filtered = undefined;
      return;
    }
    this._filtered = variables.filter((item) => !item.sysVar);
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
    const envs = this.environments;
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
    const input = this.editorEnvName;
    if (!name) {
      input.invalidMessage = 'Name is required.';
      input.validate();
      return false;
    }
    const lowerName = name.toLowerCase();
    if (lowerName === 'default') {
      input.invalidMessage = 'This name is reserved. Please, use different name.';
      input.invalid = true;
      this._sendGaEvent('Addind reserved name environment');
      return false;
    }
    const env = this._findEnvironment(lowerName);
    if (env) {
      input.invalidMessage = 'Environment already exists. Please, use different name.';
      input.invalid = true;
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
  async _addEnvironment() {
    const name = this.editorEnvName.value;
    if (!this._validateEnvironmentInput(name)) {
      return;
    }
    const obj = {
      name,
      created: Date.now()
    };
    const e = this._dispatchEnvUpdated(obj);
    if (!e.defaultPrevented) {
      this._sendGaError('Add environment - no manager');
      throw new Error('Variables manager not found.');
    }

    this.closeAddEnvironmentForm();
    this._sendGaEvent('Add environment');
    try {
      await e.detail.result;
      this.environment = name;
    } catch (e) {
      this._sendGaError(`Add environment-${e.message}`);
    }
  }
  /**
   * Handler for the delete button.
   * @return {Promise}
   */
  async _deleteEnvironment() {
    const envName = this.environment;
    if (envName === 'default') {
      const msg = 'Unable to remove default environment';
      throw new Error(msg);
    }
    const env = this._findEnvironment(envName);
    if (!env) {
      const msg = 'Environment not om the list when deleting';
      this._sendGaError(msg);
      throw new Error(msg);
    }
    const e = this._dispatchEnvDeleted(env._id);
    if (!e.defaultPrevented) {
      this._sendGaError('Remove environment - no manager');
      throw new Error('Variables manager not found');
    }
    this._sendGaEvent('Delete environment');
    try {
      await e.detail.result;
    } catch (cause) {
      this._sendGaError('Delete environment-' + cause.message);
    }
  }
  /**
   * Add new, empty variable.
   */
  addVariable() {
    const obj = {
      environment: this.environment,
      enabled: false
    };
    const items = this.variables || [];
    items.push(obj);
    this.variables = [...items];
    this._sendGaEvent('Add variable form');
  }
  /**
   * Removes unsaved variable
   * @param {CustomEvent} e
   */
  _removeEmptyVariable(e) {
    const index = Number(e.target.dataset.index);
    if (isNaN(index) || index < 0 || (!index && index !== 0)) {
      return;
    }
    const items = this.variables;
    items.splice(index, 1);
    this.variables = [...items];
  }

  /**
   * Opens documentation page for the module.
   *
   * @param {Event} e
   * @return {Window|undefined}
   */
  _openHelp(e) {
    const url = e.currentTarget.href;
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

  /**
   * Validates user input when environment name change.
   *
   * @param {Event} e
   */
  _revalidateEnvInput(e) {
    const input = e.target;
    if (!input.validate()) {
      const msg = 'Name is required.';
      if (input.invalidMessage !== msg) {
        input.invalidMessage = msg;
      }
    }
  }
  /**
   * When an external URL is requested to open.
   * @event open-external-url
   * @param {url}
   */
}
