# element-maker

This package provides a custom element base "abstract" class that defines default implementations of the major features that can optionally be leveraged in order to build a fully functioning custom element, that inherits from this base class.

The current catalog of features that are included are provided below


| Package | Description | Source |
|---------|-------------|--------|
| [truth-sourcer](https://www.npmjs.com/package/truth-sourcer) | Attribute/property binding and truth-sourcing for custom elements | [GitHub](https://github.com/bahrus/truth-sourcer) |
| [be-reflective](https://www.npmjs.com/package/be-reflective) | CSS custom state reflection from computed styles | [GitHub](https://github.com/bahrus/be-reflective) |
| [face-up](https://www.npmjs.com/package/face-up) | Form Associated Custom Element behavior via ElementInternals | [GitHub](https://github.com/bahrus/face-up) |
| [roundabout](https://www.npmjs.com/package/roundabout) | Reactive view-model binding with template rendering and computed property orchestration | [GitHub](https://github.com/bahrus/roundabout#using-roundaboutfeature-with-assignfeatures) |
| [time-ticker](https://www.npmjs.com/package/time-ticker) | Web component that fires events periodically (example of a feature-based component with no code in the class) | [GitHub](https://github.com/bahrus/time-ticker) |
| [templ-maker](https://www.npmjs.com/package/templ-maker) | Extracts a DOM fragment into a reusable template and clones it per instance (works with cede scripts) | [GitHub](https://github.com/bahrus/templ-maker) |



## Viewing Demos Locally

1. Install git
2. Fork/clone this repo
3. Install node.js
4. Open command window to folder where you cloned this repo
5. > git submodule add https://github.com/bahrus/types.git types
6. > git submodule update --init --recursive
7. > npm install
8. > npm run serve
9. Open http://localhost:8000/demo/ in a modern browser

## Running Tests

```
> npm run test
```