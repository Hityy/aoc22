

interface Animal {
    legs: number;
}

interface Cat extends Animal {
    ears: number;
    tail: number;
}

let animal: Animal = {
    legs: 4
}
let cat: Cat = {
    legs: 4,
    ears: 2,
    tail: 1
}

animal = cat;

// cat = animal; //error

interface Product {
    id: number;
}
function getProducts<T>(id?: T): T extends number ? Product : Product[] {
    if (typeof id === 'number') {
        return { id: 123 } as any;
    }
    return [{ id: 123 }, { id: 345 }] as any;
}

var res1 = getProducts(1);
var res = getProducts();


interface Person {
    id: number;
    name: string;
    age: number;
}

type RemoveProps<T, K extends keyof T> = Exclude<keyof T, K>;

type PersonId = RemoveProps<Person, "age" | "name">;
type PersonOnlyId = Pick<Person, PersonId>;

type RemovePropsPower<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type PersonOnlyIdPower = RemovePropsPower<Person, "age">;

// //

interface SyncService {
    baseUrl: string;
    getA(): string;
    getB(s: string): string;
}

type Promisify<T> = {
    [x in keyof T]: Promise<T[keyof T]>
};

type SyncServicePromisify = Promisify<SyncService>;



type ReturnPromise<T> = T extends (...args: infer A) => infer R ? (...args: A) => Promise<R> : T;
type Promisify2<T> = {
    [K in keyof T]: ReturnPromise<T[K]>
};
type SyncServicePromisify2 = Promisify2<SyncService>;




// class AsyncService implements Promisify<SyncService> {

// }



// export const pipe = <T, R extends (a: T) => infer R ?R : never>(value: T, ...fns): T => fns.length > 0 ? pipe(fns[0](value), ...fns.slice(1)) : value;

