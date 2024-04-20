import { Signal } from '../../src/models/Signal/Signal.js';

describe('Signal', () => {
    describe('State', () => {
        test('Accepts a simple value, sets and gets a value.', () => {
            const $num = new Signal.State(22);

            expect($num.get()).toBe(22);

            $num.set($num.get() * 2);

            expect($num.get()).toBe(44);
        });

        describe('Computed', () => {
            const $num = new Signal.State(22);
            const mock = jest.fn(() => ($num.get() % 2) === 0);
            const isEven = new Signal.Computed(mock);

            expect($num.get()).toBe(22);
            expect(mock).toHaveBeenCalledTimes(0);

            expect(isEven.get()).toBeTruthy();
            expect(mock).toHaveBeenCalledTimes(1);

            /** Uses cached computation */
            expect(isEven.get()).toBeTruthy();
            expect(mock).toHaveBeenCalledTimes(1);

            $num.set($num.get() + 1);

            expect($num.get()).toBe(23);
            expect(isEven.get()).toBeFalsy();
            expect(mock).toHaveBeenCalledTimes(2);
        })
    })
})