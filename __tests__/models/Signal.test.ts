import { Signal } from '../../src/models/Signal/Signal.js';

describe('Signal', () => {
  describe('State', () => {
    test('Accepts a simple value, sets and gets a value.', () => {
      const $num = new Signal.State(22);
      expect($num.get()).toBe(22);
      $num.set($num.get() * 2);
      expect($num.get()).toBe(44);
    });
    test('Two different State Signals have unique keys', () => {
      const $a = new Signal.State(5);
      const $b = new Signal.State(5);
      expect($a.key).not.toEqual($b.key);
    });
  });
  describe('Computed', () => {
    const $num = new Signal.State(22);
    const mock = jest.fn(() => $num.get() % 2 === 0);
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
  });
  test('Two different Computed Signals have unique keys', () => {
    const mockA = jest.fn();
    const mockB = jest.fn();
    const $a = new Signal.Computed(mockA);
    const $b = new Signal.Computed(mockB);
    expect($a.key).not.toEqual($b.key);
  });
  test('Nested dependency in Computed Signal', () => {
    const $num = new Signal.State(22);
    const isEvenComputedSignalMock = jest.fn(() => $num.get() % 2 === 0);
    const $isEven = new Signal.Computed(isEvenComputedSignalMock);
    const strComputedSignalMock = jest.fn(() => `The number is even: ${$isEven.get()}`);
    const $str = new Signal.Computed(strComputedSignalMock);

    expect($num.get()).toBe(22);
    expect(isEvenComputedSignalMock).toHaveBeenCalledTimes(0);
    expect(strComputedSignalMock).toHaveBeenCalledTimes(0);

    expect($str.get()).toBe('The number is even: true');
    expect(isEvenComputedSignalMock).toHaveBeenCalledTimes(1);
    expect(strComputedSignalMock).toHaveBeenCalledTimes(1);

    /** Uses cached computation */
    expect($str.get()).toBe('The number is even: true');
    expect(isEvenComputedSignalMock).toHaveBeenCalledTimes(1);
    expect(strComputedSignalMock).toHaveBeenCalledTimes(1);

    $num.set($num.get() + 2);

    expect($num.get()).toBe(24);

    expect($isEven.get()).toBeTruthy();
    expect(isEvenComputedSignalMock).toHaveBeenCalledTimes(2);
    expect(strComputedSignalMock).toHaveBeenCalledTimes(1);

    expect($str.get()).toBe('The number is even: true');
    expect(isEvenComputedSignalMock).toHaveBeenCalledTimes(2);
    expect(strComputedSignalMock).toHaveBeenCalledTimes(1);

    $num.set($num.get() + 1);

    expect($num.get()).toBe(25);

    expect($isEven.get()).toBeFalsy();
    expect(isEvenComputedSignalMock).toHaveBeenCalledTimes(3);
    expect(strComputedSignalMock).toHaveBeenCalledTimes(1);

    expect($str.get()).toBe('The number is even: false');
    expect(isEvenComputedSignalMock).toHaveBeenCalledTimes(3);
    expect(strComputedSignalMock).toHaveBeenCalledTimes(2);
  });
  describe('Effect', () => {
    test('Runs an effect', async () => {
      const $num = new Signal.State(22);

      const sentenceMock = jest.fn(() => `The number is ${$num.get()}`);
      const $sentence = new Signal.Computed(sentenceMock);

      let test = '';
      const runSideEffect = jest.fn(() => (test = $sentence.get()));

      Signal.createEffect(runSideEffect);

      expect($sentence.get()).toBe('The number is 22');
      expect(sentenceMock).toHaveBeenCalledTimes(1);

      $num.set(44);

      new Promise((resolve) => {
        setTimeout(resolve, 1000);
      }).then(() => {
        expect(test).toBe('The number is 44');
        expect(runSideEffect).toHaveBeenCalledTimes(1);
        expect(sentenceMock).toHaveBeenCalledTimes(2);
      });
    });
  });
});
