# Suggestion for Extending

I like how you made a good call to treat the time-ticker feature as one that probably doesn't belong in an "abstract" class called ElementMaker that serves as general a purpose as element-maker does.  But the explanation provided for separating it out was a bit fuzzy, I think.

The time-ticker package does in fact include both a [custom element feature](https://raw.githubusercontent.com/bahrus/time-ticker/refs/heads/baseline/TimeTicker.js) as well as a [custom element](https://raw.githubusercontent.com/bahrus/time-ticker/refs/heads/baseline/time-ticker-element.js).

I would like to go back to that package, and make the custom element extend ElementMaker from this package so that the static features get "inherited" somehow, and add on the time-ticker package.  I guess there could be a separate file that could be referenced as an old-fashioned module that registers the custom element name, similar to [def.js](https://raw.githubusercontent.com/bahrus/time-ticker/refs/heads/baseline/def.js)

After studying these links carefully, can you spell out what to do below, and I will then copy this file into that project and ask kiro to make the necessary adjustments.

---

## Instructions for Converting time-ticker to Extend ElementMaker

### Overview

Currently `time-ticker-element.js` is a standalone `HTMLElement` subclass that manually redeclares `propagator`, `#internals`, `attachInternals()`, and `static supportedFeatures` entries for `truthSourcer`, `faceUp`, and `roundabout`. All of that is already provided by `ElementMaker`. The goal is to:

1. Extend `ElementMaker` instead of `HTMLElement`
2. Inherit all of ElementMaker's features automatically
3. Only declare the *additional* feature (`timeTicker`) that is specific to this package
4. Simplify `wireFeatures.js` to only inject what's unique to this element
5. Keep `def.js` as the side-effect module that registers the tag name

### Step 1: Add `el-maker` as a dependency

In `package.json`, add:

```json
"dependencies": {
    "el-maker": "0.0.0"
}
```

Also add it to `imports.html`:

```html
"el-maker/": "/node_modules/el-maker/"
```

### Step 2: Rewrite `time-ticker-element.js`

Replace the entire file with:

```js
import { ElementMaker } from 'el-maker/ElementMaker.js';

export class TimeTickerElement extends ElementMaker {
    static supportedFeatures = {
        ...ElementMaker.supportedFeatures,
        timeTicker: {},
    };
}
```

Key points:
- Extends `ElementMaker` instead of `HTMLElement`
- No need to redeclare `propagator`, `#internals`, or `constructor` — inherited from `ElementMaker`
- No need to redeclare `truthSourcer`, `faceUp`, `roundabout`, or `reflector` — inherited via the spread of `ElementMaker.supportedFeatures`
- Only adds the `timeTicker` slot, which is specific to this package
- `static formAssociated = true` is no longer needed here — `FaceUp.onAssigned` sets it automatically when `faceUp` is wired via `assignFeatures`

### Step 3: Simplify `wireFeatures.js`

The current `wireFeatures.js` eagerly imports all feature classes (RoundaboutFeature, TruthSourcer, FaceUp) and passes them as explicit `spawn` values. Since `ElementMaker` already declares async `fallbackSpawn` for all of those, use `resolveAndAssignFeatures` which automatically resolves the fallback spawns for any feature that doesn't have an explicit `spawn`:

```js
import { TimeTicker } from './TimeTicker.js';
import { resolveAndAssignFeatures } from 'assign-gingerly/resolveAndAssignFeatures.js';

export async function wireFeatures(ElementClass, cfg) {
    const { roundabout } = cfg.features;
    const { customData, withAttrs } = roundabout;

    await resolveAndAssignFeatures(ElementClass, {
        timeTicker: { spawn: TimeTicker },
        truthSourcer: {
            callbackForwarding: ['connectedCallback', 'attributeChangedCallback'],
        },
        faceUp: {
            customData: { integrateWithRoundabout: true },
            callbackForwarding: [
                'connectedCallback', 'disconnectedCallback',
                'formDisabledCallback', 'formResetCallback', 'formStateRestoreCallback',
            ],
        },
        roundabout: {
            customData,
            withAttrs,
            callbackForwarding: ['connectedCallback'],
        },
    });
}
```

Key changes:
- Replaced `import 'assign-gingerly/assignFeatures.js'` + `customElements.assignFeatures(...)` with `resolveAndAssignFeatures` — it resolves async `fallbackSpawn` from `ElementMaker.supportedFeatures` in parallel, then calls `assignFeatures` internally
- Removed all explicit `spawn` entries for `truthSourcer`, `faceUp`, and `roundabout` — `resolveAndAssignFeatures` resolves them from the inherited `fallbackSpawn` automatically
- Removed the eager imports of `RoundaboutFeature`, `TruthSourcer`, and `FaceUp` — they'll be resolved from the async fallback spawns
- Still pass `callbackForwarding` and `customData` since those are per-element configuration (the consumer additions get unioned with the author defaults from `supportedFeatures`)
- `timeTicker` still has an explicit `spawn: TimeTicker` since it's a local feature with no fallback on the base class

### Step 4: `def.js` stays the same

```js
import { TimeTickerElement } from './time-ticker-element.js';
import { wireFeatures } from './wireFeatures.js';
import defRef from './defRef.json' with { type: 'json' };

await wireFeatures(TimeTickerElement, defRef);
customElements.define('time-ticker', TimeTickerElement);
```

No changes needed.

### Step 5: Remove redundant dependencies

Since `ElementMaker` brings in `truth-sourcer`, `face-up`, `be-reflective`, and `roundabout-lib` as its own dependencies, you can remove them from time-ticker's `package.json` dependencies (they'll be available transitively). Keep only:

- `el-maker` (brings everything)
- `assign-gingerly` (needed for `assignFeatures.js` import)
- Any test/dev dependencies

### Benefits

1. **Less boilerplate** — no manual `propagator`, `#internals`, `attachInternals()`, or `getSharedContext` declarations per element
2. **Lazy loading** — feature implementations are only imported when actually accessed, not eagerly at module load time
3. **Consistency** — all elements extending `ElementMaker` get the same shared context wiring, reducing bugs from copy-paste divergence
4. **Extensibility** — if a new feature is added to `ElementMaker` later, all extending elements inherit it automatically
