export interface Callback<T> {
  (...args: any[]): T;
}

export interface SideEffect extends Callback<never> {
  (...args: any): void | Promise<void>;
}
