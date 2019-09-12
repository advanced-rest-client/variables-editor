import { fixture, assert, aTimeout } from '@open-wc/testing';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import '../variables-editor.js';

describe('<variables-editor>', function() {
  async function basicFixture() {
    return await fixture(`<variables-editor debouncetimeout="20"></variables-editor>`);
  }

  describe('_dispatch()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    const eName = 'test-event';
    const eDetail = 'test-detail';

    it('Dispatches an event', () => {
      const spy = sinon.spy();
      element.addEventListener(eName, spy);
      element._dispatch(eName);
      assert.isTrue(spy.called);
    });

    it('Returns the event', () => {
      const e = element._dispatch(eName);
      assert.typeOf(e, 'customevent');
    });

    it('Event is cancelable by default', () => {
      const e = element._dispatch(eName);
      assert.isTrue(e.cancelable);
    });

    it('Event is composed', () => {
      const e = element._dispatch(eName);
      if (typeof e.composed !== 'undefined') {
        assert.isTrue(e.composed);
      }
    });

    it('Event bubbles', () => {
      const e = element._dispatch(eName);
      assert.isTrue(e.bubbles);
    });

    it('Event is not cancelable when set', () => {
      const e = element._dispatch(eName, eDetail, false);
      assert.isFalse(e.cancelable);
    });

    it('Event has detail', () => {
      const e = element._dispatch(eName, eDetail);
      assert.equal(e.detail, eDetail);
    });
  });

  describe('_dispatchEnvUpdated()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    const item = 'test-item';

    it('Calls _dispatch()', () => {
      const spy = sinon.spy(element, '_dispatch');
      element._dispatchEnvUpdated(item);
      assert.isTrue(spy.called);
    });

    it('Returns the event', () => {
      const e = element._dispatchEnvUpdated(item);
      assert.typeOf(e, 'customevent');
      assert.equal(e.type, 'environment-updated');
    });

    it('Event has detail with item', () => {
      const e = element._dispatchEnvUpdated(item);
      assert.equal(e.detail.value, item);
    });
  });

  describe('_dispatchEnvDeleted()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    const id = 'test-id';

    it('Calls _dispatch()', () => {
      const spy = sinon.spy(element, '_dispatch');
      element._dispatchEnvDeleted(id);
      assert.isTrue(spy.called);
    });

    it('Returns the event', () => {
      const e = element._dispatchEnvDeleted(id);
      assert.typeOf(e, 'customevent');
      assert.equal(e.type, 'environment-deleted');
    });

    it('Event has detail with the id', () => {
      const e = element._dispatchEnvDeleted(id);
      assert.equal(e.detail.id, id);
    });
  });

  describe('_sendGaEvent()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    const action = 'test-action';

    it('Calls _dispatch()', () => {
      const spy = sinon.spy(element, '_dispatch');
      element._sendGaEvent(action);
      assert.isTrue(spy.called);
    });

    it('Returns the event', () => {
      const e = element._sendGaEvent(action);
      assert.typeOf(e, 'customevent');
      assert.equal(e.type, 'send-analytics');
    });

    it('Event is not cancelable', () => {
      const e = element._sendGaEvent(action);
      assert.isFalse(e.cancelable);
    });

    it('Detail has action', () => {
      const e = element._sendGaEvent(action);
      assert.equal(e.detail.action, action);
    });

    it('Detail has category', () => {
      const e = element._sendGaEvent(action);
      assert.equal(e.detail.category, 'Variables editor');
    });

    it('Detail has type', () => {
      const e = element._sendGaEvent(action);
      assert.equal(e.detail.type, 'event');
    });
  });

  describe('_sendGaError()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    const message = 'test-error';

    it('Calls _dispatch()', () => {
      const spy = sinon.spy(element, '_dispatch');
      element._sendGaError(message);
      assert.isTrue(spy.called);
    });

    it('Returns the event', () => {
      const e = element._sendGaError(message);
      assert.typeOf(e, 'customevent');
      assert.equal(e.type, 'send-analytics');
    });

    it('Event is not cancelable', () => {
      const e = element._sendGaError(message);
      assert.isFalse(e.cancelable);
    });

    it('Detail has description', () => {
      const e = element._sendGaError(message);
      assert.equal(e.detail.description, message);
    });

    it('Detail has category', () => {
      const e = element._sendGaError(message);
      assert.equal(e.detail.type, 'exception');
    });

    it('Detail has fatal', () => {
      const e = element._sendGaError(message);
      assert.isFalse(e.detail.fatal);
    });
  });

  describe('variables-changed event', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    function fire(element, value) {
      const e = new CustomEvent('variables-changed', {
        detail: {
          value
        }
      });
      element.dispatchEvent(e);
    }

    it('sets _filtered undefined when no value', () => {
      element._filtered = [];
      fire(element);
      assert.isUndefined(element._filtered);
    });

    it('sets _filtered variables', () => {
      const vars = [{ variable: 'v1' }, { variable: 'v2' }];
      fire(element, vars);
      assert.deepEqual(element._filtered, vars);
    });

    it('Removes system variables', () => {
      const vars = [{ variable: 'v1' }, { variable: 'v2', sysVar: true }];
      fire(element, vars);
      assert.deepEqual(element._filtered, [{ variable: 'v1' }]);
    });
  });

  describe('#allowRemove', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('is false when no environment', () => {
      element.environment = undefined;
      assert.isFalse(element.allowRemove);
    });

    it('Returns false when environment is default', () => {
      element.environment = 'default';
      assert.isFalse(element.allowRemove);
    });

    it('Returns true otherwise', () => {
      element.environment = 'other';
      assert.isTrue(element.allowRemove);
    });
  });

  describe('openAddEnvironmentForm()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Opens the editor', () => {
      element.openAddEnvironmentForm();
      assert.isTrue(element.envEditorOpened);
    });
  });

  describe('closeAddEnvironmentForm()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element.openAddEnvironmentForm();
      await aTimeout();
    });

    it('Opens the editor', () => {
      element.closeAddEnvironmentForm();
      assert.isFalse(element.envEditorOpened);
    });
  });

  describe('_findEnvironment()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    const searchEnv = 'test-name';

    it('Returns undefined when no environments on the list', () => {
      const result = element._findEnvironment(searchEnv);
      assert.isUndefined(result);
    });

    it('Returns undefined when environments is empty', () => {
      element.environments = [];
      const result = element._findEnvironment(searchEnv);
      assert.isUndefined(result);
    });

    it('Returns undefined when no environment on the list', () => {
      element.environments = undefined;
      const result = element._findEnvironment('other');
      assert.isUndefined(result);
    });

    it('Returns item model', () => {
      element.environments = [{ name: 'test-name' }];
      const result = element._findEnvironment(searchEnv);
      assert.typeOf(result, 'object');
    });

    it('Skips empty list items', () => {
      element.environments = [undefined, { name: 'test-name' }];
      const result = element._findEnvironment(searchEnv);
      assert.typeOf(result, 'object');
    });
  });

  describe('_validateEnvironmentInput()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element.envEditorOpened = true;
      await aTimeout();
    });

    it('Returns false if no name', () => {
      const result = element._validateEnvironmentInput();
      assert.isFalse(result);
    });

    it('Sets input error message when no name', () => {
      element.editorEnvName.invalidMessage = 'test';
      element._validateEnvironmentInput();
      assert.equal(element.editorEnvName.invalidMessage, 'Name is required.');
    });

    it('Returns false when name is "default"', () => {
      const result = element._validateEnvironmentInput('default');
      assert.isFalse(result);
    });

    it('Sets input error message when name is "default"', () => {
      element.editorEnvName.invalidMessage = 'test';
      element._validateEnvironmentInput('default');
      assert.equal(element.editorEnvName.invalidMessage, 'This name is reserved. Please, use different name.');
    });

    it('Invalidates input when name is "default"', () => {
      element._validateEnvironmentInput('default');
      assert.isTrue(element.editorEnvName.invalid);
    });

    it('Returns false when name already defined', () => {
      element.environments = [{ name: 'test-name' }];
      const result = element._validateEnvironmentInput('test-name');
      assert.isFalse(result);
    });

    it('Sets input error message when name already defined', () => {
      element.environments = [{ name: 'test-name' }];
      element.editorEnvName.invalidMessage = 'test';
      element._validateEnvironmentInput('test-name');
      assert.equal(element.editorEnvName.invalidMessage, 'Environment already exists. Please, use different name.');
    });

    it('Invalidates input when name already defined', () => {
      element.environments = [{ name: 'test-name' }];
      element._validateEnvironmentInput('test-name');
      assert.isTrue(element.editorEnvName.invalid);
    });

    it('Returns true when pases validation', () => {
      const result = element._validateEnvironmentInput('test-env');
      assert.isTrue(result);
    });
  });

  describe('addVariable()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element.environment = 'test-default';
      await aTimeout();
    });

    it('Adds variable to an empty list', () => {
      element.addVariable();
      assert.typeOf(element.variables, 'array');
      assert.lengthOf(element.variables, 1);
    });

    it('Adds variable to existing list', () => {
      element.variables = [{ name: 'test' }];
      element.addVariable();
      assert.typeOf(element.variables, 'array');
      assert.lengthOf(element.variables, 2);
    });

    it('Added variable has no name', () => {
      element.addVariable();
      const item = element.variables[0];
      assert.isUndefined(item.variable);
    });

    it('Added variable is not enabled', () => {
      element.addVariable();
      const item = element.variables[0];
      assert.isFalse(item.enabled);
    });

    it('Added variable has environment', () => {
      element.addVariable();
      const item = element.variables[0];
      assert.equal(item.environment, element.environment);
    });
  });

  describe('_removeEmptyVariable()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element.variables = [{ variable: 'v1' }, { variable: 'v2' }];
      await aTimeout();
    });

    it('Does nothing when index not specified', () => {
      const target = document.createElement('span');
      element._removeEmptyVariable({
        target
      });
      assert.lengthOf(element.variables, 2);
    });

    it('Does nothing when index is -1', () => {
      const target = document.createElement('span');
      target.dataset.index = '-1';
      element._removeEmptyVariable({
        target
      });
      assert.lengthOf(element.variables, 2);
    });

    it('Removes the variable', () => {
      const target = document.createElement('span');
      target.dataset.index = '0';
      element._removeEmptyVariable({
        target
      });
      assert.lengthOf(element.variables, 1);
    });
  });

  describe('_openHelp()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    const ev = {
      currentTarget: {
        href: 'http://test-href'
      },
      preventDefault: function() {
        ev.defaultPrevented = true;
      },
      stopPropagation: () => {}
    };

    it('Dispatches "open-external-url"', () => {
      let called = false;
      element.addEventListener('open-external-url', function f(e) {
        element.removeEventListener('open-external-url', f);
        e.preventDefault();
        called = true;
      });
      element._openHelp(ev);
      assert.isTrue(called);
    });

    it('Does not return window when event handled', () => {
      element.addEventListener('open-external-url', function f(e) {
        element.removeEventListener('open-external-url', f);
        e.preventDefault();
      });
      const result = element._openHelp(ev);
      assert.isUndefined(result);
    });

    it('Event has "url" property', () => {
      let value;
      element.addEventListener('open-external-url', function f(e) {
        element.removeEventListener('open-external-url', f);
        e.preventDefault();
        value = e.detail.url;
      });
      const result = element._openHelp(ev);
      assert.isUndefined(result);
      assert.equal(value, 'http://test-href');
    });

    it('Returns window', () => {
      const result = element._openHelp(ev);
      if (result) {
        // Popup blocker may block the window and there's nothing I can do about it
        result.close();
      }
    });
  });

  describe('_addEnvInput()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Calls _addEnvironment() when key is enter', () => {
      const spy = sinon.spy(element, '_addEnvironment');
      element._addEnvInput({
        key: 'Enter'
      });
      assert.isTrue(spy.called);
    });

    it('Calls _addEnvironment() when keyCode is 13', () => {
      const spy = sinon.spy(element, '_addEnvironment');
      element._addEnvInput({
        keyCode: 13
      });
      assert.isTrue(spy.called);
    });

    it('Does nothing otherwise', () => {
      const spy = sinon.spy(element, '_addEnvironment');
      element._addEnvInput({
        keyCode: 90
      });
      assert.isFalse(spy.called);
    });
  });

  describe('_addEnvironment()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element.envEditorOpened = true;
      await aTimeout();
    });

    it('Does nothing when fails validation', () => {
      element.editorEnvName.value = 'default';
      const spy = sinon.spy(element, '_dispatchEnvUpdated');
      element._addEnvironment();
      assert.isFalse(spy.called);
    });

    function cancelEvent(element) {
      element.addEventListener('environment-updated', function f(e) {
        element.removeEventListener('environment-updated', f);
        e.preventDefault();
        e.detail.result = Promise.resolve();
      });
    }

    it('Returns a promise', () => {
      element.editorEnvName.value = 'test-env1';
      cancelEvent(element);
      const result = element._addEnvironment();
      assert.typeOf(result.then, 'function');
      return result;
    });

    it('Closes the form', () => {
      element.editorEnvName.value = 'test-env1';
      const spy = sinon.spy(element, 'closeAddEnvironmentForm');
      cancelEvent(element);
      return element._addEnvironment()
      .then(() => {
        assert.isTrue(spy.called);
      });
    });

    it('Sends GA event', () => {
      element.editorEnvName.value = 'test-env1';
      const spy = sinon.spy(element, '_sendGaEvent');
      cancelEvent(element);
      return element._addEnvironment()
      .then(() => {
        assert.isTrue(spy.called);
        assert.equal(spy.args[0][0], 'Add environment');
      });
    });

    function rejectEvent(element) {
      element.addEventListener('environment-updated', function f(e) {
        element.removeEventListener('environment-updated', f);
        e.preventDefault();
        e.detail.result = Promise.reject(new Error('test'));
      });
    }

    it('Renders toast when save error', () => {
      element.editorEnvName.value = 'test-env1';
      rejectEvent(element);
      let thenCalled = false;
      return element._addEnvironment()
      .then(() => {
        thenCalled = true;
      })
      .catch(() => {
        if (thenCalled) {
          throw new Error('Promise should reject.');
        }
        const node = element.shadowRoot.querySelector('#infoToast');
        assert.isTrue(node.opened);
      });
    });

    it('Sends GA exception message', () => {
      element.editorEnvName.value = 'test-env1';
      const spy = sinon.spy(element, '_sendGaEvent');
      rejectEvent(element);
      let thenCalled = false;
      return element._addEnvironment()
      .then(() => {
        thenCalled = true;
      })
      .catch(() => {
        if (thenCalled) {
          throw new Error('Promise should reject.');
        }
        assert.isTrue(spy.called);
        assert.equal(spy.args[0][0], 'Add environment-test');
      });
    });
  });

  describe('_deleteEnvironment()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('rejects when default environment', async () => {
      element.environment = 'default';
      let called = false;
      try {
        await element._deleteEnvironment();
      } catch (_) {
        called = true;
      }
      assert.isTrue(called);
    });

    it('Rejects the promise when default environment', async () => {
      element.environment = 'default';
      let called = false;
      try {
        await element._deleteEnvironment();
      } catch (_) {
        called = true;
      }
      assert.isTrue(called);
    });

    it('Does nothing when model element not found', () => {
      element.environment = 'test-name';
      const spy = sinon.spy(element, '_dispatchEnvDeleted');
      element._deleteEnvironment();
      assert.isFalse(spy.called);
    });

    it('Rejects the promise when model element not found', (done) => {
      element.environment = 'test-name';
      const result = element._deleteEnvironment();
      result.catch(() => done());
    });

    it('Rejects the promise when environment model not found', (done) => {
      element.environment = 'test-name';
      element.environments = [{ name: 'test-name' }];
      const result = element._deleteEnvironment();
      result.catch(() => done());
    });

    function cancelEvent(element) {
      element.addEventListener('environment-deleted', function f(e) {
        element.removeEventListener('environment-deleted', f);
        e.preventDefault();
        e.detail.result = Promise.resolve();
      });
    }

    it('Returns a promise', () => {
      element.environment = 'test-name';
      element.environments = [{ name: 'test-name' }];
      cancelEvent(element);
      const result = element._deleteEnvironment();
      assert.typeOf(result.then, 'function');
      return result;
    });

    it('Sends GA event', () => {
      element.environment = 'test-name';
      element.environments = [{ name: 'test-name' }];
      const spy = sinon.spy(element, '_sendGaEvent');
      cancelEvent(element);
      return element._deleteEnvironment()
      .then(() => {
        assert.isTrue(spy.called);
        assert.equal(spy.args[0][0], 'Delete environment');
      });
    });

    function rejectEvent(element) {
      element.addEventListener('environment-deleted', function f(e) {
        element.removeEventListener('environment-deleted', f);
        e.preventDefault();
        e.detail.result = Promise.reject(new Error('test'));
      });
    }

    it('Sends GA exception message', () => {
      element.environment = 'test-name';
      element.environments = [{ name: 'test-name' }];
      const spy = sinon.spy(element, '_sendGaEvent');
      rejectEvent(element);
      let thenCalled = false;
      return element._deleteEnvironment()
      .then(() => {
        thenCalled = true;
      })
      .catch(() => {
        if (thenCalled) {
          throw new Error('Promise should reject.');
        }
        assert.isTrue(spy.called);
        assert.equal(spy.args[0][0], 'Add environment-test');
      });
    });
  });

  describe('_revalidateEnvInput()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element.envEditorOpened = true;
      await aTimeout();
    });

    it('Sets invalid state when invalid', () => {
      const e = { target: element.editorEnvName };
      element._revalidateEnvInput(e);
      assert.isTrue(element.editorEnvName.invalid);
    });

    it('Sets input error message', () => {
      const e = { target: element.editorEnvName };
      element._revalidateEnvInput(e);
      assert.equal(element.editorEnvName.invalidMessage, 'Name is required.');
    });

    it('Does not change name if valid', async () => {
      const e = { target: element.editorEnvName };
      element.editorEnvName.value = 'test';
      element.editorEnvName.invalidMessage = 'test';
      await aTimeout();
      element._revalidateEnvInput(e);
      assert.equal(element.editorEnvName.invalidMessage, 'test');
    });

    it('Does not change name if name already set', async () => {
      const e = { target: element.editorEnvName };
      element.editorEnvName.invalidMessage = 'Name is required.';
      await aTimeout();
      element._revalidateEnvInput(e);
      assert.equal(element.editorEnvName.invalidMessage, 'Name is required.');
    });
  });
});
