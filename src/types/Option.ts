import { Callback } from './Callback.js';
import { ID } from './ID.js';
import IOptionCache from './OptionCache.js';

export default interface IOption<T> {
  state: 'idle' | 'resolved' | 'rejected';

  _callback: Callback<T | Promise<T>>;
  _data: T | null;
  _error: Error | undefined;

  matchSync<R>(some: SomeLike<Outcome<T>, R>, none: NoneLike<R>): R | null;

  match<R>(
    some: SomeLike<Outcome<T>, Promise<R>>,
    none: NoneLike<Promise<R>>
  ): Promise<R | null>;

  resolveSync(): Outcome<T>;

  resolve(): Promise<Outcome<T>>;
}

export interface OptionConfiguration {
  cache: {
    optionCache: IOptionCache;
    indexingKey: ID;
    stale?: number;
  };
}

export interface Outcome<T> {
  state: 'idle' | 'resolved' | 'rejected';
  data: T | null;
  error?: Error;
}

export interface Some<T, R = any> extends Callback<R> {
  (t: T): R;
}

export interface None<R = any> extends Callback<R> {
  (o: Outcome<never>): R;
}

export type SomeLike<T, R = any> = Some<T, R> | null;
export type NoneLike<R> = None<R> | null;
