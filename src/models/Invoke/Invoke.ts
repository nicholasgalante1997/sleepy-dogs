import { Callback } from '../../types/Callback.js';
import {
  FailedExecution,
  InvocationState,
  RejectedAsyncExecution,
  ResolvedAsyncExecution,
  SuccessfulExecution
} from '../../types/Invoke.js';

export default class SafeInvocation {
  static execute<T extends Callback<R>, R = any>(callback: T): SuccessfulExecution<R> | FailedExecution {
    let data;
    let status = InvocationState.IDLE;
    try {
      data = callback();
      status = InvocationState.SUCCESS;
      return {
        data,
        status
      };
    } catch (e: unknown) {
      return this.#handleException(e, 'sync') as FailedExecution;
    }
  }

  static async executeAsync<T extends Callback<Promise<R>>, R = any>(
    asyncCallback: T
  ): Promise<ResolvedAsyncExecution<R> | RejectedAsyncExecution> {
    let resolved = false;
    let rejected = false;
    let data;

    try {
      data = await asyncCallback();
      resolved = true;
      return {
        data,
        resolved,
        rejected
      };
    } catch (e) {
      return this.#handleException(e, 'async') as RejectedAsyncExecution;
    }
  }

  static #handleException(e: unknown, invokee: 'sync' | 'async'): FailedExecution | RejectedAsyncExecution {
    let error = null;
    
    if (e instanceof Error) {
      error = e;
    }

    if (typeof e === 'string') {
      error = new Error(e);
    }

    if (error == null) {
      error = new Error('UnknownException');
    }

    if (invokee === 'sync') {
      return {
        data: null,
        error,
        status: InvocationState.FAILED
      } as FailedExecution;
    } else {
      return {
        data: null,
        error,
        rejected: true,
        resolved: false
      } as RejectedAsyncExecution;
    }
  }
}
