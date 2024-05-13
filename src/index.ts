import { guard as guard_fn, guardPromise as guardPromise_fn } from './functions/index.js';

import { Attempt as SleepyAttempt } from './models/Attempt/index.js';
import { default as SleepyBenchmark } from './models/Benchmark/Benchmark.js';
import { Log as SleepyLog } from './models/Logger/Logger.js';
import { default as SleepyOption } from './models/Option/Option.js';
import { default as SleepyOptionCache } from './models/Option/OptionCache.js';
import { Signal as SleepySignal } from './models/Signal/Signal.js';
import { default as SleepyLazySingleton } from './models/LazySingleton/LazySingleton.js';
import { default as SleepyTimer } from './models/Timer/Timer.js';

namespace sleepy {
  export const Attempt = SleepyAttempt;
  export const Benchmark = SleepyBenchmark;
  export const Log = SleepyLog;
  export const Option = SleepyOption;
  export const OptionCache = SleepyOptionCache;
  export const Signal = SleepySignal;
  export const LazySingleton = SleepyLazySingleton;
  export const Timer = SleepyTimer;

  export const guard = guard_fn;
  export const guardPromise = guardPromise_fn;
}

export default sleepy;

export const Attempt = SleepyAttempt;
export const Benchmark = SleepyBenchmark;
export const Log = SleepyLog;
export const Option = SleepyOption;
export const OptionCache = SleepyOptionCache;
export const Signal = SleepySignal;
export const Timer = SleepyTimer;
export const LazySingleton = SleepyLazySingleton;

export const guard = guard_fn;

export * from './index.types.js';
