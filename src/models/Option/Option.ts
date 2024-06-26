import { Callback } from '../../types/Callback.js';
import { InvocationState, RejectedAsyncExecution } from '../../types/Invoke.js';
import IOption, { NoneLike, Outcome, SomeLike, OptionConfiguration } from '../../types/Option.js';
import SafeInvocation from '../Invoke/Invoke.js';

export default class Option<T> implements IOption<T> {
  state: 'idle' | 'resolved' | 'rejected' = 'idle';

  private readonly _callback: Callback<T | Promise<T>>;
  private _data: T | null = null;
  private _error: Error | undefined;
  private options: OptionConfiguration | null;
  private tryN = 0;

  constructor(callback: Callback<T | Promise<T>>, options: OptionConfiguration | null = null) {
    this._callback = callback;
    this.options = options;
  }

  peek(): Outcome<T> {
    return {
      state: this.state,
      data: this._data,
      error: this._error
    };
  }

  async resolve(...args: any[]): Promise<Outcome<T>> {
    if (this.checkCache()) {
      const cached = this.useCached();
      if (cached) {
        this._data = cached as T | null;
        this.state = 'resolved';
        return {
          state: this.state,
          data: this._data
        };
      }
    }

    const result = await SafeInvocation.executeAsync(this._callback.bind(this, ...args) as Callback<Promise<T>>);

    const { data, rejected, resolved } = result;

    if (rejected) {
      this.state = 'rejected';
      this._error = (result as RejectedAsyncExecution).error;

      if (this.options?.retries && this.options.retries > this.tryN) {
        this.tryN += 1;
        return await this.resolve(...args);
      }

      return {
        state: this.state,
        data: null,
        error: this._error
      };
    }

    this.state = 'resolved';
    this._data = data;

    if (this.options?.cache) {
      this.cache(data);
    }

    return {
      data: this._data,
      state: this.state
    };
  }

  resolveSync(...args: any[]): Outcome<T> {
    if (this.checkCache()) {
      const cached = this.useCached();
      if (cached) {
        this._data = cached as T | null;
        this.state = 'resolved';
        return {
          state: this.state,
          data: this._data
        };
      }
    }

    const result = SafeInvocation.execute(this._callback.bind(this, ...args));
    const { data, status, error } = result;
    if (status === InvocationState.FAILED || error) {
      this.state = 'rejected';
      this._error = error;

      if (this.options?.retries && this.options.retries > this.tryN) {
        this.tryN += 1;
        return this.resolveSync(...args);
      }

      return {
        error: this._error,
        state: this.state,
        data: null
      };
    }

    this.state = 'resolved';
    this._data = data;

    if (this.options?.cache) {
      this.cache(data);
    }

    return {
      data,
      state: this.state
    };
  }

  async match<R>(some: SomeLike<Outcome<T>, Promise<R>>, none: NoneLike<Promise<R>>): Promise<R | null> {
    if (some == null && none == null) return null;
    if (this.state === 'idle') {
      const outcome = await this.resolve();
      if (outcome.state === 'resolved') {
        if (some) {
          return await some(outcome);
        } else {
          return null;
        }
      } else {
        if (none) {
          return await none(outcome);
        } else {
          return null;
        }
      }
    }

    const { state, data, error } = this.peek();
    if (state === 'resolved' && some) {
      return await some({ state, data, error });
    } else if (state === 'rejected' && none) {
      return await none({ state, data, error });
    }

    return null;
  }

  matchSync<R>(some: SomeLike<Outcome<T>, R>, none: NoneLike<R>): R | null {
    if (some == null && none == null) return null;
    if (this.state === 'idle') {
      const outcome = this.resolveSync();
      if (outcome.state === 'resolved') {
        if (some) {
          return some(outcome);
        } else {
          return null;
        }
      } else {
        if (none) {
          return none(outcome);
        } else {
          return null;
        }
      }
    }

    const { state, data, error } = this.peek();
    if (state === 'resolved' && some) {
      return some({ state, data, error });
    } else if (state === 'rejected' && none) {
      return none({ state, data, error });
    }

    return null;
  }

  private checkCache() {
    if (this.options?.cache) {
      return this.options.cache.optionCache.has(this.options.cache.indexingKey);
    }
    return false;
  }

  private useCached<T>(): T | null {
    if (this.checkCache()) {
      const cached = this.options?.cache.optionCache.get<T>(this.options.cache.indexingKey);
      if (cached) {
        return cached;
      }
    }

    return null;
  }

  private cache(value: T) {
    if (this.options?.cache && this.options.cache.optionCache.get(this.options.cache.indexingKey) == null) {
      this.options.cache.optionCache.add(this.options.cache.indexingKey, value);
    }
  }

  resetCache() {
    if (this.options?.cache && this.options.cache.optionCache.get(this.options.cache.indexingKey) == null) {
      this.options.cache.optionCache.delete(this.options.cache.indexingKey);
    }
  }
}
