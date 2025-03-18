
# Attempt Module

---

## Overview

The Attempt module provides a class-based implementation for handling asynchronous operations with retry logic and error handling. It allows you to wrap a function or a promise with a set of configuration options to control the execution flow.

## Usage

### Importing the Module

To use the Attempt module, you need to import it from the SleepyDogs library:

```javascript
import { Attempt } from 'sleepydogs';
import { Attempt } from 'sleepydogs/Attempt';
```

### Creating an Attempt Instance

You can create an Attempt instance by passing a function or a promise to the constructor. The function or promise will be executed with the provided configuration options.

```javascript
const attempt = new Attempt(myFunction);
```

### Configuration Options

The Attempt constructor accepts an optional configuration object with the following properties:

* `callback`: The function or promise to be executed.
* `onError`: A callback function to handle errors.
* `immediate`: A boolean indicating whether to execute the callback immediately.
* `retries`: The number of retries before giving up.
* `delay`: The delay between retries in milliseconds.

```javascript
const attempt = new Attempt({
  callback: myFunction,
  onError: handleError,
  immediate: true,
  retries: 3,
  delay: 1000,
});
```

### Running the Attempt

You can run the attempt using the `runSync` or `run` methods.

* `runSync`: Runs the attempt synchronously.
* `run`: Runs the attempt asynchronously and returns a promise.

```javascript
attempt.runSync();

// or

attempt.run().then(() => {
  console.log('Attempt completed successfully');
}).catch((error) => {
  console.error('Attempt failed:', error);
});
```

### Checking the Attempt State

You can check the current state of the attempt using the `state` property.

```javascript
const currentState = attempt.state;
```

The `state` property returns one of the following values:

* `IDLE`: The attempt is idle and has not been executed yet.
* `FAILED`: The attempt has failed and will not be retried.
* `SUCCEEDED`: The attempt has succeeded and will not be retried.
* `IN_PROGRESS`: The attempt is currently being executed.
* `RETRYING`: The attempt is being retried.

## Example Use Cases

### Handling Errors

You can use the Attempt module to handle errors in a centralized way.

```javascript
const attempt = new Attempt({
  callback: myFunction,
  onError: handleError,
});

attempt.run().then(() => {
  console.log('Attempt completed successfully');
}).catch((error) => {
  console.error('Attempt failed:', error);
});
```

### Retrying Failed Operations

You can use the Attempt module to retry failed operations.

```javascript
const attempt = new Attempt({
  callback: myFunction,
  retries: 3,
  delay: 1000,
});

attempt.run().then(() => {
  console.log('Attempt completed successfully');
}).catch((error) => {
  console.error('Attempt failed:', error);
});
```

## API Documentation

### Attempt Class

* `constructor(value: AttemptConfiguration | SideEffect)`: Creates a new Attempt instance.
* `runSync()`: Runs the attempt synchronously.
* `run()`: Runs the attempt asynchronously and returns a promise.
* `state`: Returns the current state of the attempt.

### AttemptConfiguration Interface

* `callback: SideEffect`: The function or promise to be executed.
* `onError?: ((e: Error) => void) | null`: A callback function to handle errors.
* `immediate?: boolean`: A boolean indicating whether to execute the callback immediately.
* `retries?: number`: The number of retries before giving up.
* `delay?: number | number[]`: The delay between retries in milliseconds.

### AttemptState Enum

* `IDLE`: The attempt is idle and has not been executed yet.
* `FAILED`: The attempt has failed and will not be retried.
* `SUCCEEDED`: The attempt has succeeded and will not be retried.
* `IN_PROGRESS`: The attempt is currently being executed.
* `RETRYING`: The attempt is being retried.