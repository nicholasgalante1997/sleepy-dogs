export enum InvocationState {
  IDLE,
  SUCCESS,
  FAILED
}

export interface ExecutionResult<T> {
  data: T | null;
  error?: Error;
  status: InvocationState;
}

export interface SuccessfulExecution<T> extends ExecutionResult<T> {
  data: T;
  status: InvocationState.SUCCESS;
}

export interface FailedExecution extends ExecutionResult<never> {
  data: null;
  error: Error;
  status: InvocationState.FAILED;
}

export interface AsyncExecution<T> {
  data: T | null;
  error?: Error;
  resolved: boolean;
  rejected: boolean;
}

export interface ResolvedAsyncExecution<T> extends AsyncExecution<T> {
  data: T;
  resolved: true;
  rejected: false;
}

export interface RejectedAsyncExecution extends AsyncExecution<never> {
  data: null;
  error: Error;
  resolved: false;
  rejected: true;
}
