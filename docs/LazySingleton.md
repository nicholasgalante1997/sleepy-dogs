# LazySingleton Module

## Overview

The `LazySingleton` module provides a lazy singleton implementation, allowing for the creation of singleton instances on demand.

## Usage

To use the `LazySingleton` module, import it and create a new instance of the `LazySingleton` class, passing in the class you want to create a singleton instance of.

```typescript
import { LazySingleton } from './LazySingleton';

class MyClass {
  // ...
}

const SingletonProvider = LazySingleton(MyClass);

console.log(Object.is(SingletonProvider.getInstance(), SingletonProvider.getInstance())); // true
```

### API Documentation

#### Classes

* **LazySingleton**: The main class of the module, providing a lazy singleton implementation.
  * **constructor**: Creates a new instance of the `LazySingleton` class.
    * Parameters:
      * `BaseClass`: The class to create a singleton instance of.
  * **getInstance**: Gets the singleton instance of the class.
    * Returns: The singleton instance of the class.
  * **hasInstance**: Checks if the singleton instance has been created.
    * Returns: `true` if the singleton instance has been created, `false` otherwise.
  * **clearInstance**: Clears the singleton instance.
  * **setInstanceArgs**: Sets the arguments for creating the instance.
    * Parameters:
      * `args`: The arguments to pass to the class constructor.
  * **clearInstanceArgs**: Clears the arguments for creating the instance.

#### Abstract Classes

* **SuperLazySingleton**: An abstract class providing a basic implementation of a lazy singleton.
  * **getInstance**: Gets the singleton instance of the class.
    * Returns: The singleton instance of the class.
  * **hasInstance**: Checks if the singleton instance has been created.
    * Returns: `true` if the singleton instance has been created, `false` otherwise.
  * **clearInstance**: Clears the singleton instance.
  * **setInstanceArgs**: Sets the arguments for creating the instance.
    * Parameters:
      * `args`: The arguments to pass to the class constructor.
  * **clearInstanceArgs**: Clears the arguments for creating the instance.

### Examples

--------

```typescript
// Create a new instance of the LazySingleton class
const mySingleton = new LazySingleton(MyClass);

// Get the singleton instance
const instance = mySingleton.getInstance();

// Check if the singleton instance has been created
if (mySingleton.hasInstance()) {
  console.log('Singleton instance has been created');
}

// Clear the singleton instance
mySingleton.clearInstance();

// Set the arguments for creating the instance
mySingleton.setInstanceArgs('arg1', 'arg2');

// Clear the arguments for creating the instance
mySingleton.clearInstanceArgs();
```

### Notes

* The `LazySingleton` module provides a way to create singleton instances on demand, which can be useful for managing resources or caching data.
* The `SuperLazySingleton` abstract class provides a basic implementation of a lazy singleton, which can be extended to create custom lazy singleton implementations.
