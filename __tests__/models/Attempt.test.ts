import { Attempt, AttemptState } from '../../src/models/Attempt/Attempt.js';

describe('[Class]: Attempt', () => {
    describe('Synchronous', () => {
        test('passes', () => {
            let num = 22;
            const fn = jest.fn(() => { num += 1; });
            const $a = new Attempt(fn as any);
            $a.runSync();
            expect(num).toBe(23);
            expect(fn).toHaveBeenCalledTimes(1);
            expect($a.state).toBe(AttemptState.SUCCEEDED);
        })
        test('fails silently', () => {
            const err = new Error('fails');
            const fn = jest.fn(() => { throw err })
            const onErr = jest.fn((e) => { e; });
            const $a = new Attempt(fn as any, onErr as any);
            $a.runSync();
            expect(fn).toHaveBeenCalledTimes(1);
            expect(onErr).toHaveBeenCalledTimes(1);
            expect(onErr).toHaveBeenCalledWith(err);
            expect($a.state).toBe(AttemptState.FAILED);
        })
    });
    
})