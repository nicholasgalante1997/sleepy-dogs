/** TODO: Keys should be Symbols */
export class SignalRefenceIdManager {
  getIdRef() {
    const key = Symbol("signal.key");
    return key;
  }
}

export class SignalReferenceIdManagerProvider {
  private static signalReferenceIdManager: SignalRefenceIdManager;
  static getInstance() {
    if (SignalReferenceIdManagerProvider.signalReferenceIdManager == null) {
      SignalReferenceIdManagerProvider.signalReferenceIdManager =
        new SignalRefenceIdManager();
    }
    return SignalReferenceIdManagerProvider.signalReferenceIdManager;
  }
}

export class EffectReferenceIdManager {}