export namespace ISignal {
  export interface IBaseSignal<T> {
    /**
     * Get the current state of the Signal, analogous to: value
     */
    get(): T;
  }

  export interface IState<T> extends IBaseSignal<T> {
    get(): T;
    set(value: T): void;
  }

  export interface IComputed<T> extends IBaseSignal<T> {
    get(): T;
  }

  export interface SignalOptions<T> {
    /**
     * Custom comparison function between old and new value. Default: Object.is.
     *
     * The signal is passed in as the this value for context.
     */
    equals?: (context: IBaseSignal<T>, t1: T, t2: T) => boolean;
  }
}
