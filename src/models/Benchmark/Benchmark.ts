import { Callback } from '../../types/Callback.js';
import Timer from '../Timer/Timer.js';

class Benchmark {

    timer = new Timer();

    runDurations: (number | null)[] = [];
    currentRun = 0;

    constructor(
        private fn: Callback<any>,
        private count: number
    ) {}

    runSync() {
        for (;this.currentRun <= this.count; this.currentRun++) {
            this.timer.start();
            this.fn();
            this.timer.stop();
            const elapsed = this.timer.elapsed();
            this.runDurations.push(elapsed);
            this.timer.reset();
        }
    }

    async runAsync() {
        for (;this.currentRun <= this.count; this.currentRun++) {
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
        return parseFloat((total! / some.length).toFixed(3));
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