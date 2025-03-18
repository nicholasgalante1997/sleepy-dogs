import LazySingletonFactory from '../LazySingleton/LazySingleton.js';
import Graph from './Graph.js';
import { Signal } from './Signal.js';

export class SignalGraphManager {
  graph: Graph<symbol>;
  record: Map<symbol, Signal.State<any> | Signal.Computed<any>>;

  constructor() {
    this.graph = new Graph();
    this.record = new Map();
  }

  registerSignal<T>(signal: Signal.State<T> | Signal.Computed<T>): void {
    const { key } = signal;
    this.graph.addVertex(key);
    this.record.set(key, signal);
  }

  getSignalDependencies<T>(
    signal: Signal.State<T> | Signal.Computed<T>
  ): (Signal.State<any> | Signal.Computed<any>)[] {
    const { key } = signal;
    const edges = this.graph.getEdges(key);
    const dependencies = edges
      .map(({ dependent }) => this.record.get(dependent))
      .filter((dependent) => {
        if (dependent === undefined) {
          return false;
        }

        return dependent instanceof Signal.State || dependent instanceof Signal.Computed;
      }) as (Signal.State<any> | Signal.Computed<any>)[];

    return dependencies;
  }
}

export class EffectGraphManager {
  private _graph: Graph<symbol>;
  private _record: Map<symbol, Signal.Computed<null>>;
  private _effects: Set<Signal.Effect>;

  constructor() {
    this._graph = new Graph();
    this._record = new Map();
    this._effects = new Set();
  }

  registerEffect(effect: Signal.Effect): void {
    const key = effect.getSymbol();
    this._graph.addVertex(key);
    this._record.set(key, effect.getInternalComputedReference());
    this._effects.add(effect);
  }

  unregisterEffect(effect: Signal.Effect): void {
    const key = effect.getSymbol();
    this._graph.removeVertex(key);
    this._record.delete(key);
    this._effects.delete(effect);
  }

  getEffectDependencies(effect: Signal.Effect): (Signal.State<any> | Signal.Computed<any>)[] {
    const key = effect.getSymbol();
    const signal = effect.getInternalComputedReference();
    const dependencies = SignalGraphManagerProvider.getInstance().getSignalDependencies(signal);
    return dependencies;
  }

  /** 
   * TODO there's likely a more optimized way to do this.
   */
  dispatchCascadedUpdate(signalId: symbol): void {
    const signalGraphManager = SignalGraphManagerProvider.getInstance();
    const dirtySignal = signalGraphManager.record.get(signalId);

    if (dirtySignal === undefined) {
      /**
       * We have an unregistered signal,
       * this represents a systemic bug in the signal graph,
       * and we cannot handle it gracefully or move further.
       */
      return;
    }

    const effects = this.effects;

    for (const effect of effects) {
      const dependencies = this.getEffectDependencies(effect);
      this.traverseEffectDependenciesAndReRunIfDirty(effect, dirtySignal, dependencies);
    }
  }

  get effects(): Set<Signal.Effect> {
    return this._effects;
  }

  get graph(): Graph<symbol> {
    return this._graph;
  }

  get record(): Map<symbol, Signal.Computed<null>> {
    return this._record;
  }

  private traverseEffectDependenciesAndReRunIfDirty(effect: Signal.Effect, dirtySignal: (Signal.Computed<any> | Signal.State<any>), dependencies: (Signal.Computed<any> | Signal.State<any>)[]) {
    if (dependencies.includes(dirtySignal)) {
      /** 
       * Schedule the effect to run
       * We should only need to run the side effect once per dirty signal, in theory
       */
      queueMicrotask(effect.callback.bind(effect));
      return;
    } else {
      for (const dependency of dependencies) {
        const ddeps = SignalGraphManagerProvider.getInstance().getSignalDependencies(dependency);
        this.traverseEffectDependenciesAndReRunIfDirty(effect, dirtySignal, ddeps);
      }
    }
  }
}

const SignalGraphManagerProvider: ReturnType<typeof LazySingletonFactory<SignalGraphManager>> =
  LazySingletonFactory(SignalGraphManager);

const EffectGraphManagerProvider: ReturnType<typeof LazySingletonFactory<EffectGraphManager>> =
  LazySingletonFactory(EffectGraphManager);

export { SignalGraphManagerProvider, EffectGraphManagerProvider };
