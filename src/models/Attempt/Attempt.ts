import IAttempt, { AttemptConfiguration, AttemptState } from '../../types/Attempt.js';
import { Callback, SideEffect } from '../../types/Callback.js';

import SafeInvocation from '../Invoke/Invoke.js';
import { InvocationState, RejectedAsyncExecution } from '../../types/Invoke.js';

class Attempt implements IAttempt {
  #tryN = 0;
  #state = AttemptState.IDLE;

  callback: SideEffect;
  onError: ((e: Error) => void) | null;
  immediate: boolean;
  retries: number;
  delay: number | number[];

  constructor(value: AttemptConfiguration | SideEffect) {
    if (isAttemptConfiguration(value)) {
      this.callback = value.callback;
      this.onError = value.onError ?? null;
      this.immediate = !!value?.immediate;
      this.retries = value?.retries ?? 0;
      this.delay = value?.delay ?? 0;
    } else {
      this.callback = value;
      this.onError = null;
      this.immediate = false;
      this.retries = 0;
      this.delay = 0;
    }

    if (this.immediate) {
      this.runSync();
    }
  }

  runSync(...args: any[]): void {
    this.#state = AttemptState.IN_PROGRESS;

    if (this.callback == null) {
      this.#state = AttemptState.FAILED;
      return;
    }

    const { status, error } = SafeInvocation.execute(() => this.callback(...args));

    if (status === InvocationState.FAILED) {
      this.#state = AttemptState.FAILED;

      if (this.retries > this.#tryN) {
        this.#state = AttemptState.RETRYING;
        this.#tryN += 1;

        if (Array.isArray(this.delay)) {
          setTimeout(this.runSync, this.delay[this.#tryN] ?? 0)
        } else if (this.delay > 0) {
          setTimeout(this.runSync, this.delay)
        } else {
          this.runSync();
          return;
        }
      }

      if (this.onError) {
        this.onError(error);
      }

      return;
    }

    this.#state = AttemptState.SUCCEEDED;
  }

  async run(...args: any[]): Promise<void> {
    this.#state = AttemptState.IN_PROGRESS;

    if (this.callback == null) {
      this.#state = AttemptState.FAILED;
      return;
    }

    await SafeInvocation.executeAsync(async () => await (this.callback as Callback<Promise<void>>)(...args)).then(async (result) => {
      const { rejected } = result;
      if (rejected) {
        const { error } = result as RejectedAsyncExecution;

        this.#state = AttemptState.FAILED;

        if (this.retries > this.#tryN) {
          this.#state = AttemptState.RETRYING;
          this.#tryN += 1;

          if (Array.isArray(this.delay)) {
            setTimeout(async () => await this.run(), this.delay[this.#tryN] ?? 0)
          } else if (this.delay > 0) {
            setTimeout(async () => await this.run(), this.delay)
          } else {
            await this.run();
            return;
          }
        }

        if (this.onError) {
          this.onError(error);
        }

        return;
      }

      this.#state = AttemptState.SUCCEEDED;
    });
  }

  get state() {
    return this.#state;
  }
}

function isAttemptConfiguration(value: SideEffect | AttemptConfiguration): value is AttemptConfiguration {
  if (typeof value === 'function') return false;
  if (typeof value?.callback !== "undefined") {
    if (typeof value.callback !== "function") {
      return false;
    }
  }
  if (typeof value?.onError !== "undefined") {
    if (typeof value?.onError !== "function") {
      return false;
    }
  }
  if (typeof value?.retries !== "undefined") {
    if (typeof value?.retries !== "number") {
      return false;
    }
  }
  if (typeof value?.delay !== "undefined") {
    const notNumber = typeof value?.delay !== "number";
    const notArray = !Array.isArray(value);

    if (notNumber && notArray) {
      return false;
    }
  }
  return true;
}

export { Attempt, AttemptState };
