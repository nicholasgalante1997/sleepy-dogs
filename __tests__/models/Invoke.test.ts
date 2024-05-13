import SafeInvocation from "../../src/models/Invoke/Invoke.js";
import { InvocationState, RejectedAsyncExecution } from "../../src/types/Invoke.js";

describe('[Class]: SafeInvocation', () => {
    describe('execute', () => {
        test('passes', () => {
            const num = 22;
            const fn = jest.fn(() => num);
            const { data, error, status } = SafeInvocation.execute(fn);
            expect(fn).toHaveBeenCalledTimes(1);
            expect(data).toBe(num);
            expect(error).toBeUndefined();
            expect(status).toBe(InvocationState.SUCCESS);
        });
        test('fails', () => {
            const err = new Error('fails');
            const fn = jest.fn(() => { throw err; });
            const { data, error, status } = SafeInvocation.execute(fn);
            expect(fn).toHaveBeenCalledTimes(1);
            expect(data).toBeNull();
            expect(error).toBe(err);
            expect(status).toBe(InvocationState.FAILED);
        })
    })
    describe('executeAsync', () => {
        test('passes', async () => {
            const num = 22;
            const fn = jest.fn(async () => num);
            const { data, rejected, resolved } = await SafeInvocation.executeAsync(fn);
            expect(fn).toHaveBeenCalledTimes(1);
            expect(data).toBe(num);
            expect(rejected).toBeFalsy();
            expect(resolved).toBeTruthy();
        });
        test('fails', async () => {
            const err = new Error('fails');
            const fn = jest.fn(async () => { throw err; });
            const result = await SafeInvocation.executeAsync(fn);
            const { data, error, rejected, resolved } = (result as RejectedAsyncExecution);
            expect(fn).toHaveBeenCalledTimes(1);
            expect(data).toBeNull();
            expect(error).toBe(err);
            expect(rejected).toBeTruthy();
            expect(resolved).toBeFalsy();
        })
    })
})