import { default as LazySingletonFactory } from '../LazySingleton/LazySingleton.js';
import { Signal } from './Signal.js';

export class SignalSharedComputationContextStack {
  private computationContextsStack: Signal.Computed<any>[] = [];

  inComputationContext() {
    const context = this.computationContextsStack.length > 0 ? this.computationContextsStack.at(-1)! : null;
    return context;
  }

  push(signal: Signal.Computed<any>) {
    this.computationContextsStack.push(signal);
  }

  pop() {
    if (this.computationContextsStack.length === 0) return;
    const lastItem = this.computationContextsStack.at(-1);
    this.computationContextsStack = this.computationContextsStack.slice(
      0,
      this.computationContextsStack.indexOf(lastItem!)
    );
    return lastItem;
  }
}

const SignalSharedComputationContextProvider: ReturnType<
  typeof LazySingletonFactory<SignalSharedComputationContextStack>
> = LazySingletonFactory(SignalSharedComputationContextStack);

export default SignalSharedComputationContextProvider;
export { SignalSharedComputationContextProvider };
