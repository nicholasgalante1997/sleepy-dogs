/** TODO: Keys should be Symbols */
export class SignalRefenceIdManager {
  marker = 0;
  getIdRef() {
    this.marker += 1;
    const key = `signal-internal-reference-${this.marker}`.repeat(1);
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
