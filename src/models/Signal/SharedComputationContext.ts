import { Signal } from './Signal.js';

export class SignalSharedComputationContextStack {
  private computationContextsStack: Signal.Computed<any>[] = [];

  inComputationContext() {
    const context =
      this.computationContextsStack.length > 0
        ? this.computationContextsStack.at(-1)!
        : null;
    return context;
  }

  push(signal: Signal.Computed<any>) {
    this.computationContextsStack.push(signal);
  }

  pop() {
    if (this.computationContextsStack.length === 0) return;
    const lastItem = this.computationContextsStack.at(-1);
    this.computationContextsStack = this.computationContextsStack.slice(0, -1);
    return lastItem;
  }
}

export class SignalSharedComputationContextProvider {
  private static signalInternalStateBridge: SignalSharedComputationContextStack;
  static getInstance() {
    if (
      SignalSharedComputationContextProvider.signalInternalStateBridge == null
    ) {
      SignalSharedComputationContextProvider.signalInternalStateBridge =
        new SignalSharedComputationContextStack();
    }
    return SignalSharedComputationContextProvider.signalInternalStateBridge;
  }
}
