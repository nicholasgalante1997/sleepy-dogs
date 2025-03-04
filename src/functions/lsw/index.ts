import { Callback } from '../../types/Callback.js';
import { InvocationState, RejectedAsyncExecution } from '../../types/Invoke.js';
import { SafeFunction, SafeFunctionState, AsyncSafeFunction } from '../../types/fp/guard.js';

import SafeInvocation from '../../models/Invoke/Invoke.js';

/**
 * ### lazySafeWrap
 * ---
 * 
 * A part of sleepy functional programming patterns
 * 
 * Wraps a synchronous function that might fail (throw) and returns a safe function,
 * which will return a CompleteOperation as opposed to throwing on error
 * 
 * A CompleteOperation<T> takes the following shape:
 * 
 * ```ts
 *  enum SafeFunctionState {
 *    FAILED,
 *    SUCCEEDED,
 *    IDLE
 *  }
 * 
 *  type CompleteOperation<T> {
 *     data: T | null,
 *     error: Error | null,
 *     state: SafeFunctionState
 *  }
 * ```
 * 
 */
export function lsw<R = any>(callback: Callback<R>): SafeFunction<R> {
  let safeCallback = function (...args: any[]) {
    const result = SafeInvocation.execute((() => callback(...args)) as Callback<R>);
    const { data, error, status } = result;
    if (status === InvocationState.FAILED) {
      return {
        data: null,
        error,
        state: SafeFunctionState.FAILED
      };
    }

    return {
      data,
      error: null,
      state: SafeFunctionState.SUCCEEDED
    };
  } as SafeFunction<R>;

  Object.setPrototypeOf(safeCallback, callback);

  return safeCallback;
}

/**
 * ### lazySafeWrapAsync
 * ---
 * 
 * A part of sleepy functional programming patterns
 * 
 * Wraps an asynchronous function that might fail (throw) and returns a safe function,
 * which will return a CompleteOperation as opposed to throwing on error
 * 
 * A CompleteOperation<T> takes the following shape:
 * 
 * ```ts
 *  enum SafeFunctionState {
 *    FAILED,
 *    SUCCEEDED,
 *    IDLE
 *  }
 * 
 *  type CompleteOperation<T> {
 *     data: T | null,
 *     error: Error | null,
 *     state: SafeFunctionState
 *  }
 * ```
 */
export function lswAsync<R = any>(callback: Callback<Promise<R>>): AsyncSafeFunction<R> {
  let safeAsyncCallback = async function (...args: any[]) {
    const result = await SafeInvocation.executeAsync(
      (async () => await callback(...args)) as Callback<Promise<R>>
    );
    const { data, resolved } = result;
    if (resolved) {
      return {
        data,
        error: null,
        state: SafeFunctionState.SUCCEEDED
      };
    }
    const { error } = result as RejectedAsyncExecution;
    return {
      data: null,
      error,
      state: SafeFunctionState.FAILED
    };
  } as AsyncSafeFunction<R>;

  Object.setPrototypeOf(safeAsyncCallback, callback);

  return safeAsyncCallback;
}
