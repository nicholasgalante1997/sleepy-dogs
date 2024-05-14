import Benchmark from "../../src/models/Benchmark/Benchmark.js"

describe('Benchmarks', () => {
    describe('Sync', () => {
        test('Benchmarks a function', () => {
            const fn = jest.fn((num) => num * num * num);
            const iterations = 100000;
            const benchmark = new Benchmark(fn, iterations);
            benchmark.runSync();
            expect(fn).toHaveBeenCalledTimes(iterations);
            expect(benchmark.average).toBeGreaterThan(0);
        })
    })
})