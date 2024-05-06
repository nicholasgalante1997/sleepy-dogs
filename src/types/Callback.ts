export interface Callback<T> {
  (...args: any[]): T;
}

export interface SideEffect extends Callback<void | Promise<void>> {
  (...args: any): void | Promise<void>;
}
