# sleepydogs

---

![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fnicholasgalante1997%2Fsleepy-dogs%2Fmain%2Fpackage.json&query=%24.version&prefix=%5B&suffix=%5D&style=flat&logo=SemVer&logoColor=blue&label=SemVer)
![NPM Unpacked Size (with version)](https://img.shields.io/npm/unpacked-size/sleepydogs/1.0.2)
![NPM Collaborators](https://img.shields.io/npm/collaborators/sleepydogs)
![GitHub last commit](https://img.shields.io/github/last-commit/nicholasgalante1997/sleepy-dogs)

Sleepy patterns for Javascript  

> What is this package?  
>
> This package is a collection of modules that offer opinionated abstractions over common patterns encountered in node.js development and web development.

## Installation

```bash

npm install sleepydogs

pnpm add sleepydogs

yarn add sleepydogs

```

## Usage

> sleepydogs module collection is largely going to be divided into two sections: Functional Programming paradigms and Object Oriented Programming paradigms. These will be denoted as fp and oop.

### fp: safewrap  

Intended Usage: Reduce boilerplate around exception handling.

```js
import { readFileSync } from 'node:fs';
import { safewrap } from 'sleepydogs';

/** Wrap a function that might fail in safewrap */
const safeReadFile = safewrap(readFileSync);

/**
 * data contains file contents if it exists
 * error contains any errors thrown during execution
 **/
const { data, error } = safeReadFile('hello.txt');
```

### fp: logFactory  

Intended Usage: Simple, very tiny color console logger. Proxy to console object.

```js
import { Log } from 'sleepydogs';

const logger = Log.factory({
    service: 'my-service',
    level: 'info'
});
```

### oop: Attempt

Intended Usage: Reduce boilerplate around exception handling `void | Promise<void>` functions

```js
import { Attempt } from 'sleepydogs';

/** Sync example */

function writesFile() { /** Might throw an error */ }

const $writeFileAttempt = new Attempt(writesFile); /** writesFile not called yet */
$writeFileAttempt.runSync(); /** writesFile called here */

/** Advanced Configuration */

function writesFile2() {}
function handleWritesFile2Err() {} /** Handling an error */
const invokeImmediate = true; /** Invoke the callback on instance creation, so there's no need to call runSync */
const retryNum = 5; /** Set up retry logic up to N attempts */

const $writeFileAttempt2 = new Attempt(writesFile2, handleWritesFile2Err, invokeImmediate, retryNum);

/** Peek into the state of the callback */
const { state: cbState } = $writeFileAttempt2;

/** Async Example */

async function readEndpoint () {}

const $readEndpointAttempt = new Attempt(readEndpoint);
await $readEndpointAttempt.run();
```

### oop: Option

Intended Usage: Intended Usage: Reduce boilerplate around functions that may or may not throw an error in the process of returning a value, or simply may or may not return a value. Has opt-in caching. Leans on the Rust concept of Options.

```js
import { Option, OptionCache } from 'sleepydogs';

function fetchesDataSync() {}

const $fetchesDataSyncOption = new Option(fetchDataSync);
const { data, error } = $fetchesDataSyncOption.resolveSync();

// ... 

const cache = new OptionCache();
const cacheConfig = {
    optionCache: cache,
    indexingKey: 'mef-1',
    stale: 3600 // Time in ms before flushing value
};

const myExpensiveFn = () => { /** ... */ };

const $myExpensiveFnOption = new Option(myExpensiveFn, cacheConfig);

const { data, error } = $myExpensiveFnOption.resolveSync(); /** Cached value set here */
const _ = $myExpensiveFnOption.resolveSync(); /** Cached value used here */

/** Reusing a cache across options */

const cacheConfig2 = {
    optionCache: cache,
    indexingKey: 'mef-2',
};

function myExpensiveFn2() {}
const $mefOption2 = new Option(myExpensiveFn2, cacheConfig2);

/** Getting the value through match */

function anotherFn() {}
new Option(anotherFn)
    .resolveSync()
    .match(
        (value) => { /** Handle value */},
        (err) => { /** Handle error */ }
    );

```

### oop: Signal

Intended Usage: Simple Signal Based State Management, see [TC39 A Proposal To Add Signals To Javascript](https://github.com/tc39/proposal-signals)

```js
import { Signal } from 'sleepydogs';

const stateSignal = new Signal.State(22);
const computedIsEvenSignal = new Signal.Computed(() => (stateSignal.get() % 2) === 0);
```

### oop: LazySingleton

Intended Usage: Lazy singleton class instantiation and management

```ts
import { LazySingleton } from 'sleepydogs';

class MySingletonClass { /** Class Implementation */ }
const MySingletonClassProvider = LazySingleton(MySingletonClass); /** Class has not been instantiated yet */
const instanceA = MySingletonClassProvider.getInstance(); /** Class is instantiated here */
const instanceB = MySingletonClassProvider.getInstance(); /** Singleton instance used here */

console.log(Object.is(instanceA, instanceB)); // true
```
