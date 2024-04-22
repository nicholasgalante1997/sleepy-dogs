import { Signal } from './models/Signal/Signal.js';
import { SleepyLog } from './models/index.js';

const sleepy = SleepyLog.factory({ service: 'Signal-Test' });

const $num = new Signal.State(22);
const $isEven = new Signal.Computed(() => $num.get() % 2 === 0);

$num.get();

$isEven.get();

sleepy.log({ isEven: $isEven.get() });

$num.set(7);

sleepy.log({ isEven: $isEven.get() });
