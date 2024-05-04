# sleepydogs

---

> Sleepy patterns for Javascript

## Installation

```bash
npm install sleepydogs

pnpm add sleepydogs

yarn add sleepydogs
```

## Usage

### Attempt

Reduces boilerplate code around fallible side effect invocation

```js
    import { writeFileSync } from 'node:fs';
    const $fileAttempt = new Attempt(() => writeFileSync('hello.txt', 'Hello World', { encoding: "utf-8" }));
    $fileAttempt.runSync();
```