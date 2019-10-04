import { fixture, assert, aTimeout } from '@open-wc/testing';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import '../variable-item.js';

describe('<variable-item>', function() {
  async function basicFixture() {
    return await fixture(`<variable-item debouncetimeout="20"></variable-item>`);
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

  describe('_somethingChanged()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Sets _isDirty flag when model is being updated', () => {
      element._updatingModel = true;
      element._somethingChanged();
      assert.isTrue(element._isDirty);
    });

    it('Will not run debouncer when already updating', () => {
      element._updatingModel = true;
      element._somethingChanged();
      assert.isUndefined(element.__updatingVariableItemDebounce);
    });

    it('Will not run debouncer when no name and value', () => {
      element.item = {};
      element._somethingChanged();
      assert.isUndefined(element.__updatingVariableItemDebounce);
    });

    it('Sets item enabled', () => {
      element.item = {
        variable: 'a',
        value: 'b'
      };
      element.__updatingVariableItemDebounce = true;
      element._somethingChanged();
      assert.isTrue(element.item.enabled);
    });

    it('Will not set item enabled when id already set', () => {
      element.item = {
        variable: 'a',
        value: 'b',
        enabled: false,
        _id: 'test'
      };
      element.__updatingVariableItemDebounce = true;
      element._somethingChanged();
      assert.isFalse(element.item.enabled);
    });

    it('Will not call _updateItem() when debouncer is running', (done) => {
      element.item = {
        variable: 'a',
        value: 'b'
      };
      element.__updatingVariableItemDebounce = true;
      element._somethingChanged();
      const spy = sinon.spy(element, '_updateItem');
      setTimeout(() => {
        assert.isFalse(spy.called);
        done();
      }, element.debounceTimeout + 1);
    });

    it('Will call _updateItem() when debouncer is not running', async () => {
      element.item = {
        variable: 'a',
        value: 'b'
      };
      element._somethingChanged();
      const spy = sinon.spy(element, '_updateItem');
      await aTimeout(element.debounceTimeout + 1);
      assert.isTrue(spy.called);
    });

    it('Sets __updatingVariableItemDebounce flag', async () => {
      element.item = {
        variable: 'a',
        value: 'b'
      };
      element._somethingChanged();
      assert.isTrue(element.__updatingVariableItemDebounce);
      await aTimeout(element.debounceTimeout + 1);
    });

    it('Clears __updatingVariableItemDebounce flag after', async () => {
      element.item = {
        variable: 'a',
        value: 'b'
      };
      element._somethingChanged();
      await aTimeout(element.debounceTimeout + 1);
      assert.isFalse(element.__updatingVariableItemDebounce);
    });
  });

  describe('_updateItem()', () => {
    let element;
    let item;
    beforeEach(async () => {
      element = await basicFixture();
      item = {
        variable: 'a',
        value: 'b',
        enabled: false,
        _id: 'test'
      };
      element.item = item;
      await aTimeout();
    });

    it('Sets _updatingModel flag', () => {
      element._updateItem();
      assert.isTrue(element._updatingModel);
    });

    it('Generates _id if not existing', () => {
      delete element.item._id;
      element._updateItem();
      assert.typeOf(element.item._id, 'string');
    });

    it('Calls _dispatch()', () => {
      const spy = sinon.spy(element, '_dispatch');
      element._updateItem();
      assert.isTrue(spy.called);
    });

    it('Calls _dispatch() with event name', () => {
      const spy = sinon.spy(element, '_dispatch');
      element._updateItem();
      assert.equal(spy.args[0][0], 'variable-updated');
    });

    it('Calls _dispatch() with the item', () => {
      const spy = sinon.spy(element, '_dispatch');
      element._updateItem();
      assert.deepEqual(spy.args[0][1].value, item);
    });

    it('The item is a copy', () => {
      const spy = sinon.spy(element, '_dispatch');
      element._updateItem();
      assert.isFalse(spy.args[0][1].value === item);
    });
  });

  describe('_removeVariable()', () => {
    let element;
    let item;
    beforeEach(async () => {
      element = await basicFixture();
      item = {
        variable: 'a',
        value: 'b',
        enabled: false,
        _id: 'test'
      };
      element.item = item;
      await aTimeout();
    });

    it('Dispatches empty-variable-remove when no item _id', () => {
      delete element.item._id;
      const spy = sinon.spy();
      element.addEventListener('empty-variable-remove', spy);
      element._removeVariable();
      assert.isTrue(spy.called);
    });

    it('Dispatches GA event', () => {
      const spy = sinon.spy(element, '_dispatch');
      element._removeVariable();
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], 'send-analytics');
      assert.equal(spy.args[0][1].type, 'event');
    });

    it('Calls _dispatch()', () => {
      const spy = sinon.spy(element, '_dispatch');
      element._removeVariable();
      assert.isTrue(spy.called);
      assert.equal(spy.args[1][0], 'variable-deleted');
      assert.equal(spy.args[1][1].id, item._id);
    });

    it('Dispatches variable-deleted event', () => {
      const spy = sinon.spy();
      element.addEventListener('variable-deleted', spy);
      element._removeVariable();
      assert.isTrue(spy.called);
      assert.isTrue(spy.args[0][0].cancelable, 'Event is cancelable');
      assert.isTrue(spy.args[0][0].bubbles, 'Event bubbles');
    });
  });

  describe('_openVariableEditor()', () => {
    let element;
    let item;
    beforeEach(async () => {
      element = await basicFixture();
      item = {
        variable: 'a',
        value: 'b',
        enabled: true
      };
      element.item = item;
      await aTimeout();
    });

    it('Inserts editor into shadow DOM when never used', () => {
      element._openVariableEditor();
      const node = element.shadowRoot.querySelector('variable-editor-dialog');
      assert.ok(node);
    });

    it('Reuses existing editor', () => {
      element._openVariableEditor();
      element._openVariableEditor();
      const nodes = element.shadowRoot.querySelectorAll('variable-editor-dialog');
      assert.equal(nodes.length, 1);
    });

    it('Sets editor value property', async () => {
      element._openVariableEditor();
      await aTimeout();
      const node = element.shadowRoot.querySelector('variable-editor-dialog');
      assert.equal(node.value, item.value);
    });

    it('Renders dialog opened', async () => {
      element._openVariableEditor();
      await aTimeout();
      const node = element.shadowRoot.querySelector('variable-editor-dialog');
      assert.isTrue(node.opened);
    });
  });

  describe('_onVariableEditorClosed()', () => {
    let element;
    let item;
    beforeEach(async () => {
      element = await basicFixture();
      item = {
        variable: 'a',
        value: 'b',
        enabled: false,
        _id: 'test'
      };
      element.item = item;
    });

    it('Sets new value', () => {
      element._onVariableEditorClosed({
        detail: {
          value: 'test'
        }
      });
      assert.equal(element.item.value, 'test');
    });

    it('Calls _somethingChanged()', () => {
      const spy = sinon.spy(element, '_somethingChanged');
      element._onVariableEditorClosed({
        detail: {
          value: 'test'
        }
      });
      assert.isTrue(spy.called);
    });

    it('Handles variable-editor-closed event', () => {
      const spy = sinon.spy(element, '_somethingChanged');
      element.dispatchEvent(new CustomEvent('variable-editor-closed', {
        detail: {
          value: 'test'
        }
      }));
      assert.isTrue(spy.called);
    });
  });
});
