// @ts-check
/** @import {SupportedFeaturesMap} from './types/assign-gingerly/types' */

/**
 * ElementMaker — Abstract base custom element class that declares support
 * for a catalog of composable features via `static supportedFeatures`.
 *
 * Concrete elements are defined declaratively (via `defineWithFeatures` or
 * cede scripts) by selecting which features to activate and providing
 * per-element configuration — without writing any JavaScript class code.
 *
 * Features are lazily instantiated on first property access. Async fallback
 * spawns ensure implementations are only loaded when a derived element
 * actually uses them.
 *
 * @abstract
 */
export class ElementMaker extends HTMLElement {
    /** @type {EventTarget} */
    propagator = new EventTarget();

    /** @type {ElementInternals} */
    #internals;

    /** @type {SupportedFeaturesMap} */
    static supportedFeatures = {
        roundabout: {
            fallbackSpawn: () => import('roundabout-lib/roundaboutFeature.js')
                .then(m => m.RoundaboutFeature),
            callbackForwarding: ['connectedCallback'],
            /** @param {ElementMaker} instance */
            getSharedContext(instance) {
                return {
                    internals: instance.#internals,
                    hostPropagator: instance.propagator,
                };
            },
        },
        truthSourcer: {
            fallbackSpawn: () => import('truth-sourcer/TruthSourcer.js')
                .then(m => m.TruthSourcer),
            callbackForwarding: ['connectedCallback', 'attributeChangedCallback'],
            /** @param {ElementMaker} instance */
            getSharedContext(instance) {
                return {
                    hostPropagator: instance.propagator,
                };
            },
        },
        faceUp: {
            fallbackSpawn: () => import('face-up/FaceUp.js')
                .then(m => m.FaceUp),
            callbackForwarding: [
                'connectedCallback',
                'disconnectedCallback',
                'formDisabledCallback',
                'formResetCallback',
                'formStateRestoreCallback',
            ],
            /** @param {ElementMaker} instance */
            getSharedContext(instance) {
                return {
                    internals: instance.#internals,
                };
            },
        },
        reflector: {
            fallbackSpawn: () => import('be-reflective/ReflectorLazy.js')
                .then(m => m.ReflectorLazy),
            callbackForwarding: ['connectedCallback', 'disconnectedCallback'],
            /** @param {ElementMaker} instance */
            getSharedContext(instance) {
                return {
                    internals: instance.#internals,
                    hostPropagator: instance.propagator,
                };
            },
        },
        templateMaker: {
            fallbackSpawn: () => import('templ-maker/TemplateMaker.js')
                .then(m => m.TemplateMaker),
            callbackForwarding: ['connectedCallback'],
        },
    };

    static featuresConfig = {
        lifecycleKeys: true,
    };

    constructor() {
        super();
        this.#internals = this.attachInternals();
    }
}
