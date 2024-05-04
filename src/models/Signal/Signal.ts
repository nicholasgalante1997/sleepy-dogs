import { ISignal } from '../../types/Signal/Signal.js';
import { SignalGraphManagerProvider } from './GraphManager.js';
import { SignalReferenceIdManagerProvider } from './ReferenceId.js';
import { SignalSharedComputationContextProvider } from './SharedComputationContext.js';

export namespace Signal {

  abstract class BaseSignal<T> {
    /**
     * Used for indexing Signals in SharedComputationContext and SignalGraph
     */
    public readonly key: symbol;

    /**
     * Previous states that the Signal held,
     * through this we can derive generations
     */
    protected __lost_states__: T[] = [];

    /**
     * Map of dependencies, and the value that this Signal held
     * when the dependency last requested it,
     * can be used to determine whether a Computed signal is stale
     */
    protected computedSubscriberMap = new Map<Computed<any>, T>();

    /**
     * Comparative function to determine equality of unknown type (T)
     * default is Object.is
     */
    protected compare = (context: ISignal.IState<T> | ISignal.IComputed<T>, t1: T, t2: T) =>
      Object.is(t1, t2);

    constructor(options?: ISignal.SignalOptions<T>) {
      this.key = SignalReferenceIdManagerProvider.getInstance().getIdRef();
      if (options?.equals) {
        this.compare = options.equals;
      }
    }
  }

  export class State<T> extends BaseSignal<T> implements ISignal.IState<T> {
    constructor(
      private value: T,
      private options?: ISignal.SignalOptions<T>
    ) {
      super(options);
      const signalGraphManager = SignalGraphManagerProvider.getInstance();
      signalGraphManager.registerSignal(this);
    }

    get(): T {
      const bridge = SignalSharedComputationContextProvider.getInstance();
      const context = bridge.inComputationContext();

      if (context !== null) {
        this.computedSubscriberMap.set(context, this.value);
        const contextDependencies = context.getDependents();
        if (!contextDependencies.includes(this)) {
          const graphManager = SignalGraphManagerProvider.getInstance();
          graphManager.graph.addEdge({
            dependent: this.key,
            provider: context.key
          });
        }
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
      return !this.equals(this.value, mostRecentProvidedValue!);
    }

    getDependents() {
      return SignalGraphManagerProvider.getInstance().getSignalDependencies(
        this
      );
    }
  }

  export class Computed<T> extends BaseSignal<T> implements ISignal.IComputed<T> {
    private value: T | null = null;

    constructor(
      public cb: (this: Computed<T>) => T,
      options?: ISignal.SignalOptions<T>
    ) {
      super(options);
      const signalGraphManager = SignalGraphManagerProvider.getInstance();
      signalGraphManager.registerSignal(this);
    }

    get(): T {
      /**
       * Check if this invocation is within a Computed context
       */
      const bridge = SignalSharedComputationContextProvider.getInstance();
      const context = bridge.inComputationContext();

      /**
       * Add our invocation context to the state bridge
       */
      bridge.push(this);

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
          SignalGraphManagerProvider.getInstance().getSignalDependencies(this);

        const depsHaveChanged =
          dependencies
            .map((dep) => {
              const hasMutated = dep.hasMutatedSinceComputedSubsciberCall(this);
              return hasMutated;
            })
            .filter(Boolean).length > 0;

        if (depsHaveChanged) {
          this.__lost_states__.push(this.value);
          this.value = this.cb();
        }
      }

      if (context !== null) {
        this.computedSubscriberMap.set(context, this.value);
        const contextDependencies = context.getDependents();
        if (!contextDependencies.includes(this)) {
          const graphManager = SignalGraphManagerProvider.getInstance();
          graphManager.graph.addEdge({
            dependent: this.key,
            provider: context.key
          });
        }
      }

      /**
       * Clean up the StateBridge computation context
       */
      bridge.pop();

      /**!
       * Return our computed value
       */
      return this.value;
    }

    hasMutatedSinceComputedSubsciberCall(signal: Computed<any>): boolean {
      const mostRecentProvidedValue = this.computedSubscriberMap.get(signal);
      return !this.equals(this.value as any, mostRecentProvidedValue as any);
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

    getDependents() {
      return SignalGraphManagerProvider.getInstance().getSignalDependencies(
        this
      );
    }
  }

  function createEffect(effect: () => void) {}

  class Effect {
    constructor(public effect: () => void) {}
  }
}
