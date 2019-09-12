[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/variables-editor.svg)](https://www.npmjs.com/package/@advanced-rest-client/variables-editor)

[![Build Status](https://travis-ci.org/advanced-rest-client/variables-editor.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/variables-editor)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/variables-editor)

# variables-editor

A variables editor element is an UI element to display existing variables and forms to edit them.

## Required component

This component works with:

-   variables-model - Storing / restoring data from the data store
-   variables-manager - Managing environments and variables
-   variables-evaluator - Evaluates variables into values

This components can be replaced with other logic with compatible API.

## Jexl dependency

`variables-editor` requires Jexl library to be installed in the application and included into the document.
This is not done inside the `variables-editor` element as each element using Jexl would have to include it's own copy
and at build time it would produce multiple copies of the library.

This element, when installed locally, installs Jexl and produces local copy of the library to be used with demo page.

## Usage

### Installation
```
npm install --save @advanced-rest-client/variables-editor
```

```js
import { LitElement, html } from 'lit-element';
import './node_odules/@advanced-rest-client/variables-editor/variables-editor.js';

class SampleElement extends LitElement {
  render() {
    return html`
    <variables-editor></variables-editor>

    <variables-model></variables-model>
    <variables-manager></variables-manager>
    <variables-evaluator></variables-evaluator>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```


## Development

```sh
git clone https://github.com/advanced-rest-client/variables-editor
cd variables-editor
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests

```sh
npm test
```

## API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)
