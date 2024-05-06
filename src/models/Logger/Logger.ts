enum ANSI_COLOR_SEQUENCES {
  HIGH_INTENSITY_FOREGROUND_RED = 91,
  HIGH_INTENSITY_FOREGROUND_BLUE = 94,
  HIGH_INTENSITY_FOREGROUND_YELLOW = 93,
  HIGH_INTENSITY_FOREGROUND_GREEN = 92,
  HIGH_INTENSITY_BACKGROUND_RED = 101,
  HIGH_INTENSITY_BACKGROUND_BLUE = 104,
  HIGH_INTENSITY_BACKGROUND_GREEN = 102,
  HIGH_INTENSITY_BACKGROUND_YELLOW = 103,
  BLACK = 30,
  WHITE = 97
}

enum ANSI_TEXT_SEQUENCES {
  NORMAL = 0,
  BOLD = 1,
  UNDERLINE = 4
}

function getAnsiSequence() {
  return (str: string | number) => `\x1b[${str}m`;
}

function getResetSequence() {
  return getAnsiSequence()(0);
}

type SleepyLogOptions = {
  service?: string;
  timestamp?: () => string;
  version?: number | string;
  level?: 'info' | 'error' | 'warn' | 'debug' | 'silent';
  file?:
    | string
    | {
        strategy?: 'async' | 'sync';
        stream?: boolean;
        logfile: string;
      };
};

export namespace Log {
  export function factory(options: SleepyLogOptions = {}) {
    return new Proxy(console, {
      get(target, property, receiver) {
        const proxiedAttributes = ['info', 'log', 'debug', 'error', 'warn'] as const;
        if (typeof property === 'string' && proxiedAttributes.includes(property as any)) {
          return getProxiedLogFunction(property as any, options.timestamp, options.service, options.version);
        }
        /** @ts-ignore */
        return Reflect.get(...arguments);
      }
    });
  }

  function getProxiedLogFunction(
    property: SleepyLogOptions['level'] | 'log',
    timestamp?: () => string,
    service?: string,
    version?: string | number
  ) {
    function noop() {}
    if (property === 'silent') return noop;

    switch (property) {
      case 'log': {
        return new Proxy(console.info.bind(console.log), {
          apply(target, thisArg, argArray) {
            const ts = getTimestamp(timestamp);
            const stamp = getServiceStamp(service || 'sleepy', version || '1.0.0');
            const pre = `${getAnsiSequence()(`${ANSI_TEXT_SEQUENCES.BOLD};${ANSI_COLOR_SEQUENCES.HIGH_INTENSITY_FOREGROUND_BLUE}`)}${ts} ${stamp} [INFO]${getResetSequence()}`;
            if ((argArray.length === 1 && typeof argArray[0] === 'object') || typeof argArray[0] === 'function') {
              target(`${pre} ${argArray[0]?.constructor?.name || argArray[0]?.toString() || '[Object object]'}`);
              target(
                `${getAnsiSequence()(`${ANSI_COLOR_SEQUENCES.HIGH_INTENSITY_FOREGROUND_GREEN}`)}${JSON.stringify(argArray[0], null, 2)}${getResetSequence()}`
              );
              return;
            } else if (argArray.length === 1 && typeof argArray[0] === 'string') {
              return target(`${pre} ${argArray[0]}`);
            } else {
              return target(...[pre, ...argArray]);
            }
          }
        });
      }
      case 'info': {
        return new Proxy(console.info.bind(console.info), {
          apply(target, thisArg, argArray) {
            const ts = getTimestamp(timestamp);
            const stamp = getServiceStamp(service || 'sleepy', version || '1.0.0');
            const pre = `${getAnsiSequence()(`${ANSI_TEXT_SEQUENCES.BOLD};${ANSI_COLOR_SEQUENCES.HIGH_INTENSITY_FOREGROUND_BLUE}`)}${ts} ${stamp} [INFO]${getResetSequence()}`;
            if ((argArray.length === 1 && typeof argArray[0] === 'object') || typeof argArray[0] === 'function') {
              target(`${pre} ${argArray[0]?.constructor?.name || argArray[0]?.toString() || '[Object object]'}`);
              target(
                `${getAnsiSequence()(`${ANSI_COLOR_SEQUENCES.HIGH_INTENSITY_FOREGROUND_GREEN}`)}${JSON.stringify(argArray[0], null, 2)}${getResetSequence()}`
              );
              return;
            } else if (argArray.length === 1 && typeof argArray[0] === 'string') {
              return target(`${pre} ${argArray[0]}`);
            } else {
              return target(...[pre, ...argArray]);
            }
          }
        });
      }
      case 'warn': {
        return new Proxy(console.info.bind(console.warn), {
          apply(target, thisArg, argArray) {
            const ts = getTimestamp(timestamp);
            const stamp = getServiceStamp(service || 'sleepy', version || '1.0.0');
            const pre = `${getAnsiSequence()(`${ANSI_TEXT_SEQUENCES.BOLD};${ANSI_COLOR_SEQUENCES.HIGH_INTENSITY_FOREGROUND_YELLOW}`)}${ts} ${stamp} [WARN]${getResetSequence()}`;
            if ((argArray.length === 1 && typeof argArray[0] === 'object') || typeof argArray[0] === 'function') {
              target(`${pre} ${argArray[0]?.constructor?.name || argArray[0]?.toString() || '[Object object]'}`);
              target(
                `${getAnsiSequence()(`${ANSI_COLOR_SEQUENCES.HIGH_INTENSITY_FOREGROUND_GREEN}`)}${JSON.stringify(argArray[0], null, 2)}${getResetSequence()}`
              );
              return;
            } else if (argArray.length === 1 && typeof argArray[0] === 'string') {
              return target(`${pre} ${argArray[0]}`);
            } else {
              return target(...[pre, ...argArray]);
            }
          }
        });
      }
      case 'error': {
        return new Proxy(console.info.bind(console.error), {
          apply(target, thisArg, argArray) {
            const ts = getTimestamp(timestamp);
            const stamp = getServiceStamp(service || 'sleepy', version || '1.0.0');
            const pre = `${getAnsiSequence()(`${ANSI_TEXT_SEQUENCES.BOLD};${ANSI_COLOR_SEQUENCES.HIGH_INTENSITY_FOREGROUND_RED}`)}${ts} ${stamp} [ERROR]${getResetSequence()}`;
            if ((argArray.length === 1 && typeof argArray[0] === 'object') || typeof argArray[0] === 'function') {
              target(`${pre} ${argArray[0]?.constructor?.name || argArray[0]?.toString() || '[Object object]'}`);
              target(
                `${getAnsiSequence()(`${ANSI_COLOR_SEQUENCES.HIGH_INTENSITY_FOREGROUND_GREEN}`)}${JSON.stringify(argArray[0], null, 2)}${getResetSequence()}`
              );
              return;
            } else if (argArray.length === 1 && typeof argArray[0] === 'string') {
              return target(`${pre} ${argArray[0]}`);
            } else {
              return target(...[pre, ...argArray]);
            }
          }
        });
      }
      case 'debug': {
        return new Proxy(console.info.bind(console.debug), {
          apply(target, thisArg, argArray) {
            const ts = getTimestamp(timestamp);
            const stamp = getServiceStamp(service || 'sleepy', version || '1.0.0');
            const pre = `${getAnsiSequence()(`${ANSI_TEXT_SEQUENCES.BOLD};${ANSI_COLOR_SEQUENCES.HIGH_INTENSITY_FOREGROUND_GREEN}`)}${ts} ${stamp} [DEBUG]${getResetSequence()}`;
            if ((argArray.length === 1 && typeof argArray[0] === 'object') || typeof argArray[0] === 'function') {
              target(`${pre} ${argArray[0]?.constructor?.name || argArray[0]?.toString() || '[Object object]'}`);
              target(
                `${getAnsiSequence()(`${ANSI_COLOR_SEQUENCES.HIGH_INTENSITY_FOREGROUND_GREEN}`)}${JSON.stringify(argArray[0], null, 2)}${getResetSequence()}`
              );
              return;
            } else if (argArray.length === 1 && typeof argArray[0] === 'string') {
              return target(`${pre} ${argArray[0]}`);
            } else {
              return target(...[pre, ...argArray]);
            }
          }
        });
      }
      default:
        return noop;
    }
  }

  function getTimestamp(timestampFn?: () => string) {
    if (timestampFn) {
      return timestampFn();
    } else {
      const date = new Date();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const ms = date.getMilliseconds();
      return `[${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}:${ms}]`;
    }
  }

  function getServiceStamp(service: string, version: string | number) {
    return `(${service} / ${version})`;
  }
}
