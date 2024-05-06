export enum SafeFunctionState {
  FAILED,
  SUCCEEDED,
  IDLE
}

export interface CompleteOperation<R> {
  data: R | null;
  error: Error | null;
  state: SafeFunctionState;
}

export interface SafeFunction<R> {
  (...args: any[]): CompleteOperation<R>;
}

export interface AsyncSafeFunction<R> {
  (...args: any[]): Promise<CompleteOperation<R>>;
}
