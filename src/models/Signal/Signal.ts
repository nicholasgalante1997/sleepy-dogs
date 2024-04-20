import { ISignal } from '../../types/Signal/Signal.js';
import IGraph, { Relationship } from '../../types/Signal/Graph.js';

export namespace Signal {
  class SignalRefenceIdManager {
    marker = 0;
    getIdRef() {
      this.marker += 1;
      return `signal-internal-reference-${this.marker}`.repeat(1);
    }
  }

  class SignalReferenceIdManagerProvider {
    private static signalReferenceIdManager: SignalRefenceIdManager;
    static getInstance() {
      if (SignalReferenceIdManagerProvider.signalReferenceIdManager == null) {
        SignalReferenceIdManagerProvider.signalReferenceIdManager =
          new SignalRefenceIdManager();
      }
      return SignalReferenceIdManagerProvider.signalReferenceIdManager;
    }
  }

  class Graph<V> implements IGraph<V> {
    adjacencyList: Map<V, Relationship<V>[]>;

    constructor() {
      this.adjacencyList = new Map();
    }

    addVertex(vertex: V): void {
      if (this.adjacencyList.has(vertex)) return;
      this.adjacencyList.set(vertex, []);
    }

    addEdge(relationship: Relationship<V>): void {
      Object.values(relationship).forEach((vertex) => {
        if (!this.adjacencyList.has(vertex)) this.addVertex(vertex);
      });

      const providingVertex = relationship.provider;
      const dependents = this.getEdges(providingVertex);

      this.adjacencyList.set(providingVertex, [...dependents, relationship]);
    }

    getEdges(vertex: V): Relationship<V>[] {
      return this.adjacencyList.get(vertex) || [];
    }
  }

  class SignalGraph {
    graph: Graph<string>;
    record: Map<string, ISignal.IBaseSignal<any>>;

    constructor() {
      this.graph = new Graph();
      this.record = new Map();
    }
  }

  class SignalGraphProvider {
    static graph: SignalGraph;

    static getInstance() {
      if (SignalGraphProvider.graph == null) {
        SignalGraphProvider.graph = new SignalGraph();
      }

      return this.graph;
    }
  }

  export class State<T> implements ISignal.IState<T> {
    private key: string;
    constructor(
      public value: T,
      private options?: ISignal.SignalOptions<T>
    ) {
      this.key = SignalReferenceIdManagerProvider.getInstance().getIdRef();
    }
    get(): T {
      return this.value;
    }
    set(value: T) {
      this.value = value;
    }
  }

  export class Computed<T> implements ISignal.IComputed<T> {
    private dependencies: Set<ISignal.IBaseSignal<any>> = new Set();
    private compare = (context: Computed<T>, t1: T, t2: T) => {
      return Object.is(t1, t2);
    };
    constructor(
      public cb: (this: Computed<T>) => T,
      options?: ISignal.SignalOptions<T>
    ) {
      if (options?.equals) {
        this.compare = options.equals;
      }
    }
    get(): T {
      /**
       * Report to the signal graph,
       * that a ComputedSignal is requesting a value,
       * Computations are lazy by design
       */

      /**
       * If a callback's dependencies have not changed,
       * we can reasonably assume the output
       * of the callback is determinate (equal)
       */

      const derived = this.cb();
      return derived;
    }
  }
}
