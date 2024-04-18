import { SafeFunction, SafeFunctionReturnValue, SafeFunctionState, safewrap } from '../../src/functions/safewrap/index.js';

describe('safewrap', () => {
    test('wraps a fn that might fail in a try-close and returns a safe result', () => {
        const fn = jest.fn(() => 22);
        const safeFn: SafeFunction<number> = safewrap(fn);
        const { data, error, state } = safeFn() as SafeFunctionReturnValue<number>;
        expect(fn).toHaveBeenCalledTimes(1);
        expect(data).toBe(22);
        expect(error).toBeNull();
        expect(state).toBe(SafeFunctionState.SUCCEEDED);
    })
})