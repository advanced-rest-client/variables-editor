import { fixture, assert } from '@open-wc/testing';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import '../variable-editor-dialog.js';

describe('<variable-editor-dialog>', function() {
  async function basicFixture() {
    return await fixture(`<variable-editor-dialog></variable-editor-dialog>`);
  }

  describe('Initialization', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('set the docs', () => {
      assert.typeOf(element.docs, 'array');
      assert.lengthOf(element.docs, 17);
    });
  });

  describe('_selectedDocChanged()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Sets list to String functions', () => {
      element._selectedDocChanged(0);
      assert.typeOf(element.docs, 'array');
      assert.lengthOf(element.docs, 17);
    });

    it('Sets list to Math functions', () => {
      element._selectedDocChanged(1);
      assert.typeOf(element.docs, 'array');
      assert.lengthOf(element.docs, 35);
    });

    it('Sets list to other functions', () => {
      element._selectedDocChanged(2);
      assert.typeOf(element.docs, 'array');
      assert.lengthOf(element.docs, 4);
    });

    it('Clears list otherwise', () => {
      element._selectedDocChanged(3);
      assert.isUndefined(element.docs);
    });
  });

  describe('_insertFunction()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Inserts function with no arguments', () => {
      const model = {
        name: 'Test',
        args: 0
      };
      element._insertFunction(model);
      assert.equal(element.value, 'Test()');
    });

    it('Inserts function with 1 argument', () => {
      const model = {
        name: 'Test',
        args: 1
      };
      element._insertFunction(model);
      assert.equal(element.value, 'Test(a)');
    });

    it('Inserts function with 2 argument', () => {
      const model = {
        name: 'Test',
        args: 2
      };
      element._insertFunction(model);
      assert.equal(element.value, 'Test(a, b)');
    });

    it('Inserts function with 3 argument', () => {
      const model = {
        name: 'Test',
        args: 3
      };
      element._insertFunction(model);
      assert.equal(element.value, 'Test(a, b, c)');
    });

    it('Inserts math argument', () => {
      element.selectedDoc = 1;
      const model = {
        name: 'Test',
        args: 3
      };
      element._insertFunction(model);
      assert.equal(element.value, 'Test(x, y, z)');
    });

    it('Concatenates existing value', () => {
      const model = {
        name: 'Test',
        args: 0
      };
      element.value = 'test-value';
      element._insertFunction(model);
      assert.equal(element.value, 'test-value Test()');
    });
  });

  describe('_evaluate()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    const evaluatedValue = 'evaluated-value';
    function evalHandler(e) {
      e.preventDefault();
      e.detail.result = Promise.resolve(evaluatedValue);
    }

    before(() => {
      window.addEventListener('evaluate-variable', evalHandler);
    });

    after(() => {
      window.removeEventListener('evaluate-variable', evalHandler);
    });

    it('Does nothing when no value', () => {
      const spy = sinon.spy();
      element.addEventListener('evaluate-variable', spy);
      element._evaluate();
      assert.isFalse(spy.called);
    });

    it('Sets "evaluated" property', (done) => {
      element.value = 'test';
      element._evaluate();
      setTimeout(() => {
        assert.equal(element.evaluated, evaluatedValue);
        done();
      });
    });
  });

  describe('_onClosed()', () => {
    let element;
    let ev;
    beforeEach(async () => {
      element = await basicFixture();
      ev = {
        stopPropagation: () => {},
        detail: {
          confirmed: true
        }
      };
    });

    it('Does nothing when dialog is canceled', () => {
      ev.detail.canceled = true;
      const spy = sinon.spy();
      element.addEventListener('variable-editor-closed', spy);
      element._onClosed(ev);
      assert.isFalse(spy.called);
    });

    it('Does nothing when dialog is not confirmed', () => {
      ev.detail.confirmed = false;
      const spy = sinon.spy();
      element.addEventListener('variable-editor-closed', spy);
      element._onClosed(ev);
      assert.isFalse(spy.called);
    });

    it('Dispatches close event', () => {
      const spy = sinon.spy();
      element.addEventListener('variable-editor-closed', spy);
      element._onClosed(ev);
      assert.isTrue(spy.called);
    });

    it('Event has new value', () => {
      const spy = sinon.spy();
      element.addEventListener('variable-editor-closed', spy);
      element.value = 'test';
      element._onClosed(ev);
      assert.equal(spy.args[0][0].detail.value, 'test');
    });
  });

  describe('_processFunctionInsertClick()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Does nothing when clicked on list item', () => {
      const node = element.shadowRoot.querySelector('div.di');
      const spy = sinon.spy(element, '_insertFunction');
      MockInteractions.tap(node);
      assert.isFalse(spy.called);
    });

    it('Does nothing when target instance not found', () => {
      const node = document.createElement('other-button');
      const spy = sinon.spy(element, '_insertFunction');
      element._processFunctionInsertClick({
        target: node
      });
      assert.isFalse(spy.called);
    });

    it('Calls _insertFunction', () => {
      const node = element.shadowRoot.querySelector('div.di anypoint-button');
      const spy = sinon.spy(element, '_insertFunction');
      MockInteractions.tap(node);
      assert.isTrue(spy.called);
    });

    it('Function alls has item model', () => {
      const node = element.shadowRoot.querySelector('div.di anypoint-button');
      const spy = sinon.spy(element, '_insertFunction');
      MockInteractions.tap(node);
      assert.typeOf(spy.args[0][0], 'object');
    });
  });
});
