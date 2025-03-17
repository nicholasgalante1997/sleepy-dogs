/**
 * A type representing a constructable class.
 * @template T
 */
type Constructable<T = {}> = new (...args: any[]) => T;

/**
 * The Laziest Singleton class
 * Used for constructing more lazy instance managers
 * @template T
 */
abstract class SuperLazySingleton<T> {
  /**
   * The singleton instance.
   * @protected
   * @type {T | null}
   */
  protected abstract instance: T | null;

  /**
   * The arguments for creating the instance. Optional
   * @protected
   * @type {any[]}
   */
  protected abstract args: any[];

  /**
   * Sets the arguments for creating the instance.
   * @param {...any[]} args
   */
  public abstract setInstanceArgs(...args: any[]): SuperLazySingleton<T>;

  /**
   * Clears the arguments for creating the instance.
   */
  public abstract clearInstanceArgs(): void;

  /**
   * Gets the singleton instance. If not yet created, it will be created with the previously set arguments.
   * @returns {T}
   */
  public abstract getInstance(): T;

  /**
   * Clears the singleton instance from the member internal state.
   */
  public abstract clearInstance(): void;

  /**
   * Checks if the singleton instance has been created.
   * @returns {boolean}
   */
  public abstract hasInstance(): boolean;
}

/**
 * A factory function to create a lazy singleton class.
 * @template T1
 * @param {Constructable<T1>} BaseClass
 * @returns {SuperLazySingleton<T1>}
 */
function LazySingletonFactory<T1>(BaseClass: Constructable<T1>): SuperLazySingleton<T1> {
  class LazySingleton extends SuperLazySingleton<T1> implements SuperLazySingleton<T1> {
    /**
     * @protected
     * @type {T1 | null}
     */
    protected instance: T1 | null;

    /**
     * @protected
     * @type {any[]}
     */
    protected args: any[];

    constructor() {
      super();
      this.instance = null;
      this.args = [];
    }

    /**
     * Sets the arguments for creating the instance.
     * @param {...any[]} args
     */
    public setInstanceArgs(...args: any[]) {
      this.args = args;
      return this;
    }

    /**
     * Gets the singleton instance.
     * @returns {T1}
     */
    public getInstance(): T1 {
      if (this.instance == null) {
        this.instance = new BaseClass(...this.args);
      }
      return this.instance;
    }

    /**
     * Checks if the singleton instance has been created.
     * @returns {boolean}
     */
    public hasInstance(): boolean {
      return this.instance != null;
    }

    /**
     * Clears the singleton instance from the member internal state.
     */
    public clearInstance(): void {
      this.instance = null;
    }

    /**
     * Clears the arguments for creating the instance.
     */
    public clearInstanceArgs(): void {
      this.args = [];
    }
  }

  return new LazySingleton();
}

export default LazySingletonFactory;
