# Signal Module Documentation

## Overview

The Signal module is a part of the Sleepydogs library, providing a reactive programming paradigm for managing state and side effects in JavaScript applications.

## Signal Class

The Signal class is the core of the Signal module, representing a reactive value that can be observed and updated. It provides several methods for managing the signal's value, including `get`, `set`, `equals`, and `equalsLast`.

### Constructor

The Signal constructor takes an optional `options` object, which can include a custom `equals` function for comparing values.

### Methods

* `get()`: Returns the current value of the signal.
* `set(value)`: Sets the value of the signal to the provided value.
* `equals(t1, t2)`: Compares two values using the provided `equals` function.
* `equalsLast()`: Compares the current value of the signal with the last value.

## Computed Class

The Computed class is a subclass of the Signal class, representing a computed value that is derived from other signals. It provides several methods for managing the computed value, including `get`, `equals`, and `equalsLast`.

### Constructor

The Computed constructor takes a callback function that returns the computed value, as well as an optional `options` object.

### Methods

* `get()`: Returns the current computed value.
* `set(value)`: Sets the value of the computed signal to the provided value.
* `equals(t1, t2)`: Compares two values using the provided `equals` function.
* `equalsLast()`: Compares the current computed value with the last value.

## Effect Class

The Effect class represents a side effect that can be triggered by changes to signals. It provides a `callback` method that is called when the effect is triggered.

### Constructor

The Effect constructor takes a callback function that is called when the effect is triggered.

### Methods

* `callback()`: Calls the callback function associated with the effect.

## Imported Modules

The Signal module imports several other modules from the Sleepydogs library, including:

* `LazySingleton`: Provides a singleton factory for creating instances of the Signal class.
* `GraphManager`: Provides a graph data structure for managing signal dependencies.
* `ReferenceId`: Provides a unique identifier for each signal.

## Usage

The Signal module can be used to create reactive state and side effects in JavaScript applications. Here is an example of how to use the Signal class to create a simple counter:

```typescript
import { Signal } from 'sleepydogs';

const counter = new Signal.State(0);

counter.set(1);
console.log(counter.get()); // Output: 1

counter.set(2);
console.log(counter.get()); // Output: 2

const isEven = new Signal.Computed(() => counter.get() % 2 === 0);

const parity = new Signal.Computed(() => (document.documentElement.innerText =  isEven.get() ? 'even' : 'odd'));

Signal.createEffect(() => console.log('Counter value changed to', counter.get()));

// Mock updates to counter

setInterval(() => counter.set(counter.get() + 1), 1000);
```

This example creates a new Signal instance with an initial value of 0, and then uses the `get`, `set`, and `createEffect` methods to update the value and log changes to the console, reactively.

## API Documentation

### Signal

* `constructor(options?: { equals: (a, b) => boolean })`: Creates a new Signal instance.
* `get()`: Returns the current value of the signal.
* `set(value)`: Sets the value of the signal to the provided value.
* `equals(t1, t2)`: Compares two values using the provided `equals` function.
* `equalsLast()`: Compares the current value of the signal with the last value.

### Computed

* `constructor(cb: () => T, options?: { equals: (a, b) => boolean })`: Creates a new Computed instance.
* `get()`: Returns the current computed value.
* `equals(t1, t2)`: Compares two values using the provided `equals` function.
* `equalsLast()`: Compares the current computed value with the last value.

### Effect

* `constructor(effect: () => void)`: Creates a new Effect instance.
* `callback()`: Calls the callback function associated with the effect.
