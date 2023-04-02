/**
 * This is a helper function for automatically implementing the constructor of the data class. The
 * parameter of the constructor is an object containing the keys of all members of the interface
 * passed to this decorator. This feature is simlar to the `@dataclass` decorator in Python.
 *
 * Example:
 * interface BoxParameters {
 *   w: number;
 *   h: number;
 * }
 *
 * class Box extends autoImplements<BoxParameters>() {}
 *
 * b = new Box({ w: 10, h: 10 });
 */
export function autoImplements<T>() {
  return class {
    constructor(data: T) {
      Object.assign(this, data);
    }
  } as new (data: T) => T;
}

/* class decorator */
/**
 * This is a class decorator constraining the class to implement the static members and static
 * methods defined in the interface.
 * Copied from: https://stackoverflow.com/a/43674389/6663588
 *
 * Example:
 * interface BaseClock {
 *   now(): number;
 * }
 *
 * @staticImplements<BaseClock>()
 * class Clock {
 *   static now(): number { return 0; } // Error will be raised if this method is not implemented.
 * }
 *
 */
export function staticImplements<T>() {
  return <U extends T>(constructor: U) => {
    // eslint-disable-next-line no-unused-expressions
    constructor;
  };
}
