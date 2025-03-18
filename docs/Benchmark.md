# Benchmark Module

---

The Benchmark module provides a simple way to measure the execution time of a function. It allows you to run a function multiple times and calculate the average execution time.

## Usage

### Creating a Benchmark Instance

To create a benchmark instance, you need to import the `Benchmark` class and create a new instance, passing the function you want to benchmark, the number of iterations, and the precision of the average calculation (optional, default is 10).

```typescript
import Benchmark from './Benchmark.js';

const fn = (num) => num * num * num;
const iterations = 100000;
const precision = 5;

const benchmark = new Benchmark(fn, iterations, precision);
```

### Running the Benchmark

You can run the benchmark synchronously using the `runSync` method or asynchronously using the `runAsync` method.

```typescript
benchmark.runSync();
// or
await benchmark.runAsync();
```

### Getting the Average Execution Time

After running the benchmark, you can get the average execution time using the `average` property.

```typescript
const averageTime = benchmark.average;
console.log(`Average execution time: ${averageTime}ms`);
```

### Pretty Printing the Results

You can also use the `prettyPrint` method to print the results in a nice table format.

```typescript
benchmark.prettyPrint();
```

This will output something like:

| runs | average | fn |
| --- | --- | --- |
| 100000 | 0.05ms | anonymous |

## Methods

### constructor(fn, iterations, precision)

* `fn`: the function to benchmark
* `iterations`: the number of times to run the function
* `precision`: the precision of the average calculation (optional, default is 10)

### runSync()

Runs the benchmark synchronously.

### runAsync()

Runs the benchmark asynchronously.

### average

Gets the average execution time.

### prettyPrint()

Prints the results in a nice table format.

## Example

```typescript
import Benchmark from './Benchmark.js';

const fn = (num) => num * num * num;
const iterations = 100000;
const precision = 5;

const benchmark = new Benchmark(fn, iterations, precision);
benchmark.runSync();
console.log(`Average execution time: ${benchmark.average}ms`);
benchmark.prettyPrint();
```
