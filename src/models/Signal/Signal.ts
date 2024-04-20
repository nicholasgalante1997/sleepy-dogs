import { ISignal } from '../../types/Signal/Signal.js';
import Graph from './Graph.js';

export namespace Signal {
  /** TODO: Keys should be Symbols */
  class SignalRefenceIdManager {
    marker = 0;
    getIdRef() {
      this.marker += 1;
      return `signal-internal-reference-${this.marker}`.repeat(1);
    }
  }

  class SignalGraphManager {
    graph: Graph<string>;
    record: Map<string, Signal.State<any> | Signal.Computed<any>>;

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
      return edges
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
    }
  }

  class SignalInternalStateBridge {
    private computationContexts: Computed<any>[] = [];

    inComputationContext() {
      return this.computationContexts.length > 0
        ? this.computationContexts.at(-1)!
        : null;
    }

    pushToComputationContext(signal: Computed<any>) {
      this.computationContexts.push(signal);
    }

    popOffComputationContext() {
      if (this.computationContexts.length === 0) return;
      const lastItem = this.computationContexts.at(-1);
      this.computationContexts = this.computationContexts.slice(0, -1);
      return lastItem;
    }
  }

  export class State<T> implements ISignal.IState<T> {
    public readonly key: string;

    private __lost_states__: T[] = [];
    private computedSubscriberMap = new Map<Computed<any>, T>();

    private compare = (context: ISignal.IState<T>, t1: T, t2: T) =>
      Object.is(t1, t2);

    constructor(
      private value: T,
      private options?: ISignal.SignalOptions<T>
    ) {
      this.key = SignalReferenceIdManagerProvider.getInstance().getIdRef();
      if (options?.equals) {
        this.compare = options.equals;
      }
      const signalGraphManager = SignalGraphProvider.getInstance();
      signalGraphManager.registerSignal(this);
    }

    get(): T {
      const bridge = SignalInternalStateBridgeProvider.getInstance();
      const context = bridge.inComputationContext();
      if (context !== null) {
        this.computedSubscriberMap.set(context, this.value);
      }
      return this.value;
    }

    set(value: T) {
      this.__lost_states__.push(this.value);
      this.value = value;
    }

    equals(t1: T, t2: T) {
      return this.compare(this, t1, t2);
    }

    equalsLast() {
      const last = this.__lost_states__.at(-1);
      if (typeof last == undefined) return false;
      return this.equals(this.value, last as T);
    }

    asHook() {
      return [this.get.bind(this), this.set.bind(this)];
    }

    hasMutatedSinceComputedSubsciberCall(signal: Computed<any>): boolean {
      const mostRecentProvidedValue = this.computedSubscriberMap.get(signal);
      if (mostRecentProvidedValue === null && this.value === null) return false;
      if (mostRecentProvidedValue === undefined && this.value === undefined)
        return false;
      if (this.value === null && mostRecentProvidedValue) return true;
      if (this.value === undefined && mostRecentProvidedValue) return true;
      if (mostRecentProvidedValue === null && this.value) return true;
      if (mostRecentProvidedValue === undefined && this.value) return false;
      return !this.equals(this.value, mostRecentProvidedValue!);
    }
  }

  export class Computed<T> implements ISignal.IComputed<T> {
    public readonly key: string;
    private __lost_states__: T[] = [];
    private computedSubscriberMap = new Map<Computed<any>, T>();
    private compare = (context: Computed<T>, t1: T, t2: T) => {
      return Object.is(t1, t2);
    };
    private value: T | null = null; /** Computation is lazy */

    constructor(
      public cb: (this: Computed<T>) => T,
      options?: ISignal.SignalOptions<T>
    ) {
      this.key = SignalReferenceIdManagerProvider.getInstance().getIdRef();
      if (options?.equals) {
        this.compare = options.equals;
      }

      const signalGraphManager = SignalGraphProvider.getInstance();
      signalGraphManager.registerSignal(this);
    }

    get(): T {
      /**
       * Check if this invocation is within a Computed context
       */
      const bridge = SignalInternalStateBridgeProvider.getInstance();
      const context = bridge.inComputationContext();

      /**
       * Add our invocation context to the state bridge
       */
      bridge.pushToComputationContext(this);

      /**
       * Report to the signal graph,
       * that a ComputedSignal is requesting a value,
       * Computations are lazy by design
       *
       * Instantiate the value field w the computation result
       */
      if (this.value == null) {
        const derived = this.cb();
        this.value = derived;
      } else {
        /**
         * If a callback's dependencies have not changed,
         * we can reasonably assume the output
         * of the callback is determinate (equal)
         */
        const dependencies =
          SignalGraphProvider.getInstance().getSignalDependencies(this);
        const depsHaveChanged =
          dependencies
            .map((dep) => dep.hasMutatedSinceComputedSubsciberCall(this))
            .filter(Boolean).length > 0;
        if (depsHaveChanged) {
          this.__lost_states__.push(this.value);
          this.value = this.cb();
        }
      }

      if (context !== null) {
        this.computedSubscriberMap.set(context, this.value);
      }

      /**
       * Clean up the StateBridge computation context
       */
      bridge.popOffComputationContext();

      /**!
       * Return our computed value
       */
      return this.value;
    }

    hasMutatedSinceComputedSubsciberCall(signal: Computed<any>): boolean {
      const mostRecentProvidedValue = this.computedSubscriberMap.get(signal);
      if (mostRecentProvidedValue === null && this.value === null) return true;
      if (mostRecentProvidedValue === undefined && this.value === undefined)
        return true;
      if (this.value === null) return false;
      if (this.value === undefined) return false;
      if (mostRecentProvidedValue === null) return false;
      if (mostRecentProvidedValue === undefined) return false;
      return this.equals(this.value, mostRecentProvidedValue);
    }

    equals(t1: T, t2: T) {
      return this.compare(this, t1, t2);
    }

    equalsLast() {
      const last = this.__lost_states__.at(-1);
      if (this.value === null && last === null) return true;
      if (last === null) return false;
      if (this.value === null) return false;
      return this.equals(this.value, last as T);
    }
  }

  class SignalInternalStateBridgeProvider {
    private static signalInternalStateBridge: SignalInternalStateBridge;
    static getInstance() {
      if (SignalInternalStateBridgeProvider.signalInternalStateBridge == null) {
        SignalInternalStateBridgeProvider.signalInternalStateBridge =
          new SignalInternalStateBridge();
      }
      return SignalInternalStateBridgeProvider.signalInternalStateBridge;
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

  class SignalGraphProvider {
    private static graphManager: SignalGraphManager;
    static getInstance() {
      if (SignalGraphProvider.graphManager == null) {
        SignalGraphProvider.graphManager = new SignalGraphManager();
      }

      return SignalGraphProvider.graphManager;
    }
  }
}
