import { Callback } from '../../types/Callback.js';
import Timer from '../Timer/Timer.js';

class Benchmark {

    private timer = new Timer();

    private runDurations: (number | null)[] = [];
    private currentRun = 0;

    constructor(
        private fn: Callback<any>,
        private iterations: number,
        private precision: number = 10
    ) {}

    runSync() {
        for (;this.currentRun < this.iterations; this.currentRun++) {
            this.timer.start();
            this.fn();
            this.timer.stop();
            const elapsed = this.timer.elapsed();
            this.runDurations.push(elapsed);
            this.timer.reset();
        }
    }

    async runAsync() {
        for (;this.currentRun <= this.iterations; this.currentRun++) {
            this.timer.start();
            await this.fn();
            this.timer.stop();
            const elapsed = this.timer.elapsed();
            this.runDurations.push(elapsed);
            this.timer.reset();
        }
    }

    get average () {
        const some = this.runDurations.filter(item => typeof item === 'number');
        const total = some.reduce((total, next) => total! += next!, 0);
        return parseFloat((total! / some.length).toFixed(this.precision));
    }

    prettyPrint() {
        const data = { 
            runs: this.runDurations.filter(item => typeof item === 'number').length,
            average: this.average,
            fn: this.fn.name
        };
        console.table(data);
    }
}

export default Benchmark;