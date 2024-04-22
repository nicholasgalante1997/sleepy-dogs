import { Signal } from './Signal.js';

export class SignalSharedComputationContext {
  private computationContexts: Signal.Computed<any>[] = [];

  inComputationContext() {
    const context =
      this.computationContexts.length > 0
        ? this.computationContexts.at(-1)!
        : null;
    return context;
  }

  pushToComputationContext(signal: Signal.Computed<any>) {
    this.computationContexts.push(signal);
  }

  popOffComputationContext() {
    if (this.computationContexts.length === 0) return;
    const lastItem = this.computationContexts.at(-1);
    this.computationContexts = this.computationContexts.slice(0, -1);
    return lastItem;
  }
}

export class SignalSharedComputationContextProvider {
  private static signalInternalStateBridge: SignalSharedComputationContext;
  static getInstance() {
    if (
      SignalSharedComputationContextProvider.signalInternalStateBridge == null
    ) {
      SignalSharedComputationContextProvider.signalInternalStateBridge =
        new SignalSharedComputationContext();
    }
    return SignalSharedComputationContextProvider.signalInternalStateBridge;
  }
}
