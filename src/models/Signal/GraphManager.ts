import Graph from './Graph.js';
import { Signal } from './Signal.js';

// TODO use lazy singleton you fuck

export class SignalGraphManagerProvider {
  private static graphManager: SignalGraphManager;
  constructor() {
    throw new Error(
      'ProviderClassInstantiationException: Providers cannot be instantiated directly. Use getInstance() to retrieve a valid instance of the SignalGraphManager class.'
    );
  }
  static getInstance() {
    if (SignalGraphManagerProvider.graphManager == null) {
      SignalGraphManagerProvider.graphManager = new SignalGraphManager();
    }

    return SignalGraphManagerProvider.graphManager;
  }
}

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

class EffectGraphManager {
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

  getEffectDependencies(effect: Signal.Effect): (Signal.State<any> | Signal.Computed<any>)[] {
    const key = effect.getSymbol();
    const signal = effect.getInternalComputedReference();
    const dependencies = SignalGraphManagerProvider.getInstance().getSignalDependencies(signal);
    return dependencies;
  }

  get effects (): Set<Signal.Effect> {
    return this._effects;
  }

  get graph (): Graph<symbol> {
    return this._graph;
  }

  get record (): Map<symbol, Signal.Computed<null>> {
    return this._record;
  }
}


export class EffectGraphManagerProvider {
  private static graphManager: EffectGraphManager;
  constructor() {
    throw new Error(
      'ProviderClassInstantiationException: Providers cannot be instantiated directly. Use getInstance() to retrieve a valid instance of the SignalGraphManager class.'
    );
  }
  static getInstance() {
    if (EffectGraphManagerProvider.graphManager == null) {
      EffectGraphManagerProvider.graphManager = new EffectGraphManager();
    }

    return EffectGraphManagerProvider.graphManager;
  }
}