import { Callback } from '../../types/Callback.js';
import { InvocationState, RejectedAsyncExecution } from '../../types/Invoke.js';
import SafeInvocation from '../../models/Invoke/Invoke.js';

export enum SafeFunctionState {
  FAILED,
  SUCCEEDED,
  IDLE
}

export interface SafeFunctionReturnValue<R> {
  data: R | null;
  error: Error | null;
  state: SafeFunctionState;
}

export interface SafeFunction<R> {
  (
    ...args: any[]
  ): SafeFunctionReturnValue<R> | Promise<SafeFunctionReturnValue<R>>;
}

export function safewrap<R>(
  callback: Callback<R> | Callback<Promise<R>>,
  async = false
): SafeFunction<R> {
  
  if (async) {
    return async function (...args: any[]) {
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
    };
  }

  return function (...args: any[]) {
    const result = SafeInvocation.execute((() =>
      callback(...args)) as Callback<R>);
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
  };
}

export default safewrap;
