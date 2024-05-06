import IAttempt, { AttemptState } from '../../types/Attempt.js';
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

  constructor(callback: SideEffect, onError: SideEffect | null = null, immediate = false, retries = 0) {
    this.callback = callback;
    this.onError = onError;
    this.immediate = immediate;
    this.retries = retries;

    if (this.immediate) {
      this.runSync();
    }
  }

  runSync(): void {
    this.#state = AttemptState.IN_PROGRESS;

    if (this.callback == null) {
      this.#state = AttemptState.FAILED;
      return;
    }

    const { status, error } = SafeInvocation.execute(this.callback);

    if (status === InvocationState.FAILED) {
      this.#state = AttemptState.FAILED;

      if (this.retries > this.#tryN) {
        this.#state = AttemptState.RETRYING;
        this.#tryN += 1;
        this.runSync();
        return;
      }

      if (this.onError) {
        this.onError(error);
      }

      return;
    }

    this.#state = AttemptState.SUCCEEDED;
  }

  async run(): Promise<void> {
    this.#state = AttemptState.IN_PROGRESS;

    if (this.callback == null) {
      this.#state = AttemptState.FAILED;
      return;
    }

    await SafeInvocation.executeAsync(this.callback as Callback<Promise<void>>).then(async (result) => {
      const { rejected } = result;
      if (rejected) {
        const { error } = result as RejectedAsyncExecution;

        this.#state = AttemptState.FAILED;

        if (this.retries > this.#tryN) {
          this.#state = AttemptState.RETRYING;
          this.#tryN += 1;
          await this.run();
          return;
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

export { Attempt, AttemptState };
