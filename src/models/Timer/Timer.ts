class Timer {
    #start = 0;
    #finish = 0;

    start() {
        if (performance) {
            this.#start = performance.now();
        }
    }

    stop() {
        if (performance) {
            this.#finish = performance.now();
        }
    }

    elapsed() {
        if (this.#start !== 0 && this.#finish !== 0) {
            return this.#finish - this.#start;
        }
        return null;
    }

    reset() {
        this.#start = 0;
        this.#finish = 0;
    }
}

export default Timer;