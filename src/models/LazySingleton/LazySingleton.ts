type Constructable<T = {}> = new(...args:any[]) => T;
type ILazySingleton <T> = {};

function SingletonFactory<T1>(BaseClass: Constructable<T1>) {
    class LazySingleton<T2 extends typeof BaseClass> implements ILazySingleton<T2> {
        static #instance: T1 | null;
        static getInstance(...args: any[]) {
            if (LazySingleton.#instance == null) {
                LazySingleton.#instance = new BaseClass(...args);
            }
            return LazySingleton.#instance;
        }
    }

    /** 
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor#changing_the_constructor_of_a_constructor_functions_prototype 
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
     * 
     * This should work,
     * but doesn't because you can't redefine the prototype in this way
     * `LazySingleton.prototype = Object.create(BaseClass.prototype);`
     * 
     * setPrototypeOf is not typically optimized in modern browser engines
     * or js engines, so this will require some benchmarking to ensure it's not 
     * degrading the performance of consuming apps
     * */
    
    /* Object.setPrototypeOf(LazySingleton, BaseClass.prototype); */

    return LazySingleton;
}

export default SingletonFactory;