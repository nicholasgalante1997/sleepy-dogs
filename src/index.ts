import { safewrap as fn_safewrap } from './functions/index.js';

import { Attempt as SleepyAttempt } from './models/Attempt/index.js';
import { Log as SleepyLog } from './models/Logger/Logger.js';
import { default as SleepyOption } from './models/Option/Option.js';
import { default as SleepyOptionCache } from './models/Option/OptionCache.js';
import { Signal as SleepySignal } from './models/Signal/Signal.js';
import { default as SleepyLazySingleton } from './models/LazySingleton/LazySingleton.js';

namespace sleepy {
    export const Attempt = SleepyAttempt;
    export const Log = SleepyLog;
    export const Option = SleepyOption;
    export const OptionCache = SleepyOptionCache;
    export const Signal = SleepySignal;
    export const LazySingleton = SleepyLazySingleton;

    export const safewrap = fn_safewrap;
}

export default sleepy;

export const Attempt = SleepyAttempt;
export const Log = SleepyLog;
export const Option = SleepyOption;
export const OptionCache = SleepyOptionCache;
export const Signal = SleepySignal;
export const LazySingleton = SleepyLazySingleton;
export const safewrap = fn_safewrap;

export * from './index.types.js';
