import { lsw, lswAsync } from '../../src/functions/lsw/index.js';
import { SafeFunctionState } from '../../src/index.types.js';

describe('guard', () => {
  test('wraps a fn in a try-close and returns a safe result', () => {
    const fn = jest.fn(() => 22);
    const wrappedFn = lsw(fn);
    const { data, error, state } = wrappedFn();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(data).toBe(22);
    expect(error).toBeNull();
    expect(state).toBe(SafeFunctionState.SUCCEEDED);
  });
  test('wraps a fn that throws in a try-close and returns a safe result', () => {
    const err = new Error('stub');
    const fn = jest.fn(() => {
      throw err;
    });
    const wrappedFn = lsw(fn);
    const { data, error, state } = wrappedFn();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(data).toBeNull();
    expect(error).toBe(err);
    expect(state).toBe(SafeFunctionState.FAILED);
  });
});

describe('guardPromise', () => {
  test('wraps an async fn in a try-close and returns a safe result', async () => {
    const fn = jest.fn(async () => 22);
    const wrappedFn = lswAsync(fn);
    const { data, error, state } = await wrappedFn();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(data).toBe(22);
    expect(error).toBeNull();
    expect(state).toBe(SafeFunctionState.SUCCEEDED);
  });
  test('wraps an async fn that throws in a try-close and returns a safe result', async () => {
    const err = new Error('stub');
    const fn = jest.fn(async () => {
      throw err;
    });
    const wrappedFn = lswAsync(fn);
    const { data, error, state } = await wrappedFn();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(data).toBeNull();
    expect(error).toBe(err);
    expect(state).toBe(SafeFunctionState.FAILED);
  });
});
