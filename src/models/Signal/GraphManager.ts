import Graph from './Graph.js';
import { Signal } from './Signal.js';

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

        return (
          dependent instanceof Signal.State ||
          dependent instanceof Signal.Computed
        );
      }) as (Signal.State<any> | Signal.Computed<any>)[];

    return dependencies;
  }
}
