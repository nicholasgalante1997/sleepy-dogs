# Option Module

## Overview

The Option module provides a way to handle computations that may not always result in a value. It is a fundamental concept in functional programming and is used to represent a value that may or may not be present.

## Usage

The Option module is designed to be used in a variety of situations where a value may not always be available. It provides a way to handle these situations in a safe and elegant way.

### Creating an Option

An Option can be created using the `Option` constructor, which takes a callback function as an argument. The callback function is used to compute the value of the Option.

```typescript
import { Option } from 'sleepydogs';

const option = new Option(() => {
  // computation that may or may not result in a value
});
```

### Resolving an Option

An Option can be resolved using the `resolve` method, which returns a promise that resolves to the value of the Option if it is present, or an error if it is not.

```typescript
const option = new Option(() => {
  // computation that may or may not result in a value
});

option.resolve().then((value) => {
  // handle the value
}).catch((error) => {
  // handle the error
});
```

### Using an Option with a Cache

An Option can be used with a cache to store the result of the computation so that it can be reused. The cache is created using the `OptionCache` constructor and is passed to the `Option` constructor.

```typescript
import { Option, OptionCache } from 'sleepydogs';

const cache = new OptionCache();
const option = new Option(() => {
  // computation that may or may not result in a value
}, { cache });

option.resolve().then((value) => {
  // handle the value
}).catch((error) => {
  // handle the error
});
```

### Using an Option with a Configuration

An Option can be used with a configuration to customize its behavior. The configuration is passed to the `Option` constructor.

```typescript
import { Option } from 'sleepydogs';

const option = new Option(() => {
  // computation that may or may not result in a value
}, {
  retries: 3, // number of times to retry the computation
  stale: 1000, // time in ms before the cached value is considered stale
});
```

## API

### Option

* `constructor(callback: Callback<T | Promise<T>>, options: OptionConfiguration | null = null)`: Creates a new Option instance.
* `resolve(): Promise<T | null>`: Resolves the Option and returns a promise that resolves to the value of the Option if it is present, or an error if it is not.
* `peek(): Outcome<T>`: Returns the current state of the Option, including the value if it is present, or an error if it is not.

### OptionCache

* `constructor()`: Creates a new OptionCache instance.
* `add(id: ID, outcome: any)`: Adds a value to the cache.
* `get(id: ID): T | null`: Retrieves a value from the cache.
* `has(id: ID): boolean`: Checks if a value is present in the cache.
* `delete(id: ID): T | null`: Removes a value from the cache.

### OptionConfiguration

* `cache: OptionCache`: The cache to use with the Option.
* `indexingKey: ID`: The key to use to store the value in the cache.
* `stale?: number`: The time in ms before the cached value is considered stale.
* `retries?: number`: The number of times to retry the computation.

## Examples

### Basic Usage

```typescript
import { Option } from 'sleepydogs';

const option = new Option(() => {
  // computation that may or may not result in a value
});

option.resolve().then((value) => {
  // handle the value
}).catch((error) => {
  // handle the error
});
```

### Using a Cache

```typescript
import { Option, OptionCache } from 'sleepydogs';

const cache = new OptionCache();
const option = new Option(() => {
  // computation that may or may not result in a value
}, { cache });

option.resolve().then((value) => {
  // handle the value
}).catch((error) => {
  // handle the error
});
```

### Using a Configuration

```typescript
import { Option } from 'sleepydogs';

const option = new Option(() => {
  // computation that may or may not result in a value
}, {
  retries: 3, // number of times to retry the computation
  stale: 1000, // time in ms before the cached value is considered stale
});

option.resolve().then((value) => {
  // handle the value
});
```
