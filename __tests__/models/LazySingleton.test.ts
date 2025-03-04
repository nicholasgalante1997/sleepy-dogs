import LazySingletonFactory from '../../src/models/LazySingleton/LazySingleton.js';

describe('SingletonFactory', () => {
    test('Creates a singleton', () => {
        class A {};
        const AProvider = LazySingletonFactory(A);

        const aInstance1 = AProvider.getInstance();
        const aInstance2 = AProvider.getInstance();

        expect(Object.is(aInstance1, aInstance2)).toBeTruthy();
        expect(aInstance1).toStrictEqual<A>(aInstance2);

        class B {}
        const BProvider = LazySingletonFactory(B);
        
        const bInstance1 = BProvider.getInstance();

        expect(Object.is(aInstance1, bInstance1)).toBeFalsy();
        expect(aInstance1).not.toStrictEqual<B>(bInstance1);
    })
})