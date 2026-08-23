# el-maker

An abstract custom element base class (`ElementMaker`) that bundles a catalog of composable features behind async lazy-loading. Concrete elements are defined declaratively — picking which features to activate and providing per-element configuration — without writing any JavaScript class code.

## How It Works

`ElementMaker` extends `HTMLElement` and declares `static supportedFeatures` with async `fallbackSpawn` functions for each feature. Feature implementations are only imported when a derived element actually uses them, so unused features add zero overhead.

Concrete elements are created via [`defineWithFeatures`](https://github.com/bahrus/assign-gingerly/blob/baseline/docs/defineWithFeatures.md), which:

1. Waits for the base class to be defined
2. Resolves async fallback spawns in parallel (cached per base class)
3. Creates a subclass dynamically
4. Calls `assignFeatures` with the resolved spawns + JSON config
5. Registers the element

This enables fully declarative element definition from JSON — including from [mount-observer cede scripts](https://github.com/bahrus/mount-observer#custom-element-definition-cede-scripts) embedded in HTML.

## Usage

Please follow these [step-by-step instructions for creating a custom element with el-maker](https://github.com/bahrus/types/blob/baseline/NewCustomElement.md)  

### From JavaScript

```js
import { defineWithFeatures } from 'assign-gingerly/defineWithFeatures.js';

await defineWithFeatures('time-ticker', 'el-maker', {
    assignFeatures: {
        roundabout: {
            customData: { raConfig: { actions: {...}, compacts: {...} } },
            withAttrs: { base: 'tt', duration: '${base}-duration', _duration: { instanceOf: 'Number' } },
            callbackForwarding: ['connectedCallback']
        },
        truthSourcer: {
            callbackForwarding: ['connectedCallback', 'attributeChangedCallback']
        },
        faceUp: {
            customData: { integrateWithRoundabout: true },
            callbackForwarding: ['connectedCallback', 'formDisabledCallback', 'formResetCallback', 'formStateRestoreCallback']
        }
    }
});
```

### From a cede script in HTML

```html
<time-ticker>
    <script type="cede" data-extends="el-maker">{
        "assignFeatures": {
            "roundabout": {
                "customData": { "raConfig": { ... } },
                "withAttrs": { "base": "tt", "duration": "${base}-duration" },
                "callbackForwarding": ["connectedCallback"]
            },
            "truthSourcer": {
                "callbackForwarding": ["connectedCallback", "attributeChangedCallback"]
            }
        }
    }</script>
</time-ticker>
```

## What the Base Class Provides

`ElementMaker` sets up shared infrastructure that features depend on:

| Resource | Purpose |
|----------|---------|
| `propagator` (EventTarget) | Property change event bus — used by truthSourcer and reflector to observe value changes |
| `#internals` (ElementInternals) | Shared via `getSharedContext` with faceUp (form control), reflector (custom states), and roundabout |
| `static featuresConfig` | Installs `whenFeatureReady()` for awaiting async feature resolution |

Because all spawns are async, defining 10 elements that extend `el-maker` only imports each feature module once — results are cached per base class.

## Feature Catalog

| Key          | Package     | Description | Source |
|--------------|-------------|-------------|--------|
| truthSourcer | [truth-sourcer](https://www.npmjs.com/package/truth-sourcer) | Attribute/property binding and truth-sourcing for custom elements | [GitHub](https://github.com/bahrus/truth-sourcer) |
| reflector    | [be-reflective](https://www.npmjs.com/package/be-reflective) | CSS custom state reflection from computed styles | [GitHub](https://github.com/bahrus/be-reflective) |
| faceUp       | [face-up](https://www.npmjs.com/package/face-up) | Form Associated Custom Element behavior via ElementInternals | [GitHub](https://github.com/bahrus/face-up) |
| roundabout   | [roundabout-lib](https://www.npmjs.com/package/roundabout-lib) | Reactive view-model binding with template rendering and computed property orchestration | [GitHub](https://github.com/bahrus/roundabout-lib) |
| templateMaker | [templ-maker](https://www.npmjs.com/package/templ-maker) | Extracts a DOM fragment into a reusable template and clones it per instance (works with cede scripts) | [GitHub](https://github.com/bahrus/templ-maker) |
| fontMgr       | [font-face-feature](https://www.npmjs.com/package/font-face-feature) | Installs global fonts | [GitHub](https://github.com/bahrus/font-face-feature)
| swipeDismiss  | [swipe-dismiss](https://www.npmjs.com/package/swipe-dismiss) | Adds swipe-to-dismiss gesture handling with progress / commit / cancel callbacks | [GitHub](https://github.com/bahrus/swipe-dismiss)

### Example: time-ticker

[time-ticker](https://github.com/bahrus/time-ticker) demonstrates a non-visual feature-based web component with no code in the element class itself — all behavior comes from the `roundabout` and `timeTicker` features wired via `assignFeatures`.

### Example:  scratch-box

[scratch-box](https://github.com/bahrus/scratch-box) is a full-blown visual form associated custom element web component, with a static HTML definition for instant SSR display, and JSON definition that makes use of all the features provided by *el-maker*.  Once again, no JS code, only HTML/JSON.  It also demonstrates a viable SSR solution, where users can instantly start selecting values with a decent UI, and the selections transfer to the web component during hydration.

## Elements Extending ElementMaker

| Package | Description | Source |
|---------|-------------|--------|
| [time-ticker](https://www.npmjs.com/package/time-ticker) | Web component that fires events periodically | [GitHub](https://github.com/bahrus/time-ticker) |
| [scratch-box](https://www.npmjs.com/package/scratch-box) | scratch-box is a web component wrapper around the "CUSTOM ANIMATED CHECKBOXES" codepen by Sara Soueidan | [GitHub](https://github.com/bahrus/scratch-box)

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
