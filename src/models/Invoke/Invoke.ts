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
    let error = null;
    let status = InvocationState.IDLE;
    try {
      data = callback();
      status = InvocationState.SUCCESS;
      return {
        data,
        error,
        status
      };
    } catch (e: unknown) {
      data = null;
      status = InvocationState.FAILED;

      if (e instanceof Error) {
        error = e;
      }

      if (typeof e === 'string') {
        error = new Error(e);
      }

      if (error == null) {
        error = new Error('UnknownException');
      }

      return {
        data,
        error,
        status
      };
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
      resolved = false;
      data = null;
      rejected = true;
      let error = e instanceof Error ? e : new Error(JSON.stringify(e));
      return {
        resolved,
        rejected,
        data,
        error
      };
    }
  }
}
