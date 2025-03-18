import { default as LazySingletonFactory } from '../LazySingleton/LazySingleton.js';

export class SignalRefenceIdManager {
  getIdRef() {
    const key = Symbol('signal.key');
    return key;
  }
}

const SignalReferenceIdManagerProvider: ReturnType<typeof LazySingletonFactory<SignalRefenceIdManager>> =
  LazySingletonFactory(SignalRefenceIdManager);

export default SignalReferenceIdManagerProvider;
export { SignalReferenceIdManagerProvider };
