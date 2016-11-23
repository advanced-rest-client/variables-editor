[![Build Status](https://travis-ci.org/advanced-rest-client/variables-editor.svg?branch=master)](https://travis-ci.org/advanced-rest-client/variables-editor)  

# variables-editor

# `<variables-editor>`
A variables editor element is an UI element to display existing variables and forms to edit them.

This is only an UI element and it is not responsible for managing data state. It cooperates with
the `arc-models` elements and use HTML event system to exchange data.
See demo page for an example of use.

If `arc-models` can't be used then replacements must to support events fired by this element:
- variables-env-model-insert
- variables-env-model-query
- variables-env-model-delete
- variables-model-query
- variables-model-delete
- variables-model-insert

### Example
```
<variables-editor></variables-editor>
```

### Styling
`<variables-editor>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--variables-editor` | Mixin applied to the element | `{}`
`--variables-editor-variables-info-color` | Color of the info text below environment selector | `rgba(0, 0, 0, 0.54)`
`--variables-editor-variables-info-font-size` | Font size of the info text below environment selector | `14px`
`--variables-editor-add-color` | Color of the `add` buttons (icons) | `--primary-color`
`--variables-editor-remove-env-color` | Color of the remove button (icon) | `rgba(0, 0, 0, 0.24)`
`--variables-editor-remove-env-color-hover` | Color of the hovered remove button (icon) | `#e64a19`
`--accent-color` | Background color of the primary action button | ``
`--primary-light-color` | Color of the primary action button | `#fff`
`--variables-editor-docs-frame` | Mixin applied to the help section when there is no variables defined for the environment | `{}`
`--variables-editor-docs-frame-content` | Mixin applied to the colored content container of the help section. | `{}`
`--variables-editor-docs-frame-content-background` | Background color of the help section content container. | `#E1F5FE`
`--variables-editor-docs-frame-content-font-size` | Font size  of the help section content container. | `15px`

