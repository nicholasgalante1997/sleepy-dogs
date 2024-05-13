import { SideEffect } from './Callback.js';

export enum AttemptState {
  IDLE,
  FAILED,
  SUCCEEDED,
  IN_PROGRESS,
  RETRYING
}

export interface AttemptConfiguration {
  callback: SideEffect;
  onError?: ((e: Error) => void) | null;
  immediate?: boolean;
  retries?: number;
  delay?: number | number[];
};

interface IAttempt {
  /**
   * @private
   * @readonly
   * The function to be safely invoked
   * */
  readonly callback: SideEffect;

  /** A handler callback to be invoked on 'error' */
  onError: ((e: Error) => void) | null;

  /**
   * Whether to invoke the function immedidately in the class constructor,
   * note, this option can only be set for **synchronous** callback functions,
   * due to the synchronous nature of constructor method calls
   * */
  immediate: boolean;

  /** Retry the callback up to N times. Default is 0 (i.e. not to retry) */
  retries: number;

   /** Delay retry of the callback */
  delay: number | number[];

  /**
   * Executes a function (async or sync) that might throw an error.
   *
   * Intended for functions that are side-effects, and that do not return a value;
   */
  runSync(): void;
  run(): Promise<void>;
}

export default IAttempt;
