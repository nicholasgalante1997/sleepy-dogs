import { Attempt, AttemptState } from '../../src/models/Attempt/Attempt.js';

describe('[Class]: Attempt', () => {
    describe('Synchronous', () => {
        test('passes', () => {
            let num = 22;
            const fn = jest.fn(() => { num += 1; });
            const $a = new Attempt(fn);
            $a.runSync();
            expect(num).toBe(23);
            expect(fn).toHaveBeenCalledTimes(1);
            expect($a.state).toBe(AttemptState.SUCCEEDED);
        })
        test('fails silently', () => {
            const err = new Error('fails');
            const fn = jest.fn(() => { throw err })
            const onErr = jest.fn((e) => { e; });
            const $a = new Attempt({
                callback: fn,
                onError: onErr
            });
            $a.runSync();
            expect(fn).toHaveBeenCalledTimes(1);
            expect(onErr).toHaveBeenCalledTimes(1);
            expect(onErr).toHaveBeenCalledWith(err);
            expect($a.state).toBe(AttemptState.FAILED);
        })
        test('invokes a synchronous callback immediately if instantiated with the "immediate" flag.', () => {
            const fn = jest.fn(() => {});
            const $a = new Attempt({
                callback: fn,
                immediate: true
            });

            expect(fn).toHaveBeenCalledTimes(1);
            expect($a.state).toBe(AttemptState.SUCCEEDED);
        })
        test('retries a function that fails if configured with a retry value', () => {
            let num = 1;
            const err = new Error('fails');
            const fn = jest.fn(() => {
                if (num % 2 !== 0) {
                    num += 1;
                    throw err;
                }
            })

            const $a = new Attempt({
                callback: fn,
                retries: 2
            });

            $a.runSync();

            expect(fn).toHaveBeenCalledTimes(2);
            expect($a.state).toBe(AttemptState.SUCCEEDED);
        })
    });
    describe('Asynchronous', () => {
        test('passes', async () => {
            let num = 22;
            const fn = jest.fn(async () => { num += 1; });
            const $a = new Attempt(fn as any);
            await $a.run();
            expect(num).toBe(23);
            expect(fn).toHaveBeenCalledTimes(1);
            expect($a.state).toBe(AttemptState.SUCCEEDED);
        });
        test('fails silently', async () => {
            const err = new Error('fails');
            const fn = jest.fn(async () => { throw err })
            const onErr = jest.fn((e) => { e; });
            const $a = new Attempt({
                callback: fn,
                onError: onErr,
            });
            await $a.run();
            expect(fn).toHaveBeenCalledTimes(1);
            expect(onErr).toHaveBeenCalledTimes(1);
            expect(onErr).toHaveBeenCalledWith(err);
            expect($a.state).toBe(AttemptState.FAILED);
        })
        test('retries a function that fails if configured with a retry value', async () => {
            let num = 1;
            const err = new Error('fails');
            const fn = jest.fn(async () => {
                if (num % 2 !== 0) {
                    num += 1;
                    throw err;
                }
            })

            const $a = new Attempt({
                callback: fn,
                retries: 2
            });

            await $a.run();
            
            expect(fn).toHaveBeenCalledTimes(2);
            expect($a.state).toBe(AttemptState.SUCCEEDED);
        })
    })
})
