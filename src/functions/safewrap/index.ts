import { Callback } from "../../types/Callback.js";
import SafeInvocation from '../../models/Invoke/Invoke.js';
import { InvocationState, RejectedAsyncExecution } from "../../types/Invoke.js";

enum SafeFunctionState {
    FAILED,
    SUCCEEDED,
    IDLE
}

interface SafeFunctionReturnValue<R> {
    data: R | null;
    error: Error | null;
    state: SafeFunctionState
}

interface SafeFunction<R> {
    (): SafeFunctionReturnValue<R> | Promise<SafeFunctionReturnValue<R>>
}

export function safewrap<R>(callback: Callback<R> | Callback<Promise<R>>, async = false): SafeFunction<R> {
    if (async) {
        return async function () {
            const result = await SafeInvocation.executeAsync(callback as Callback<Promise<R>>);
            const { data, resolved } = result;
            if (resolved) {
                return {
                    data,
                    error: null,
                    state: SafeFunctionState.SUCCEEDED
                }
            }
            const { error } = (result as RejectedAsyncExecution);
            return {
                data: null,
                error,
                state: SafeFunctionState.FAILED
            }
        }
    }

    return function () {
        const result = SafeInvocation.execute(callback as Callback<R>);
        const { data, error, status } = result;
        if (status === InvocationState.FAILED) {
            return {
                data: null,
                error,
                state: SafeFunctionState.FAILED
            }
        }

        return {
            data,
            error: null,
            state: SafeFunctionState.SUCCEEDED
        }
    }
}

export default safewrap;