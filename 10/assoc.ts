
type Assoc<A, B> = A & B;

type Assign<A, P extends PropertyKey, V> = Assoc<A, Record<P, V>>;

const assoc = <T, P extends PropertyKey, V>(o: T, property: P, value: V): Assign<T, P, V> => {
    return Object.assign({}, o, { [property]: value }) as any;
}
let t = assoc({ jeden: 1 }, 'dwa', 2);

// type TT<S> = S extends Record<infer R, infer V>[] ? Record<R, V> : never;
// type T2 = TT<{hej: 1}>
type TO<T> = T extends [infer Head extends {}, ...infer Tail] ?
    [Head, ...TO<Tail>] : [];
type T3<T> = T extends [infer Head extends {}, ...infer Tail] ?
    Head & T3<Tail> : any;

type t2 = T3<[{ dwa: 2 }, { trzy: 3 }]>

const assocClojure = <T, S>(o: T, ...sources: TO<S>) => {
    return Object.assign({}, o, sources) as any;
};
// const t5 = assocClojure({ jeden: 1 }, [{ dwa: 2 }, { trzy: 3 }])


type Mutable<T> = {
    -readonly [K in keyof T]: T[K];
};

type TupleToObject<T, U> = T extends [infer Head extends PropertyKey, ...infer Tail] ?
    Record<Head, TupleToObject<Tail, U>> : U;

const getProp = <T, P extends PropertyKey[]>(o: T, path: P) => {
    if (path.length > 1 && typeof o[path[0]] === 'object' && !(Array.isArray(o[path[0]])))
        return getProp(o[path[0]], path.slice(1));
    return o[path[0]];
}

console.log(getProp({ jeden: 1, dwa: { piec: 5 } }, ["dwa", "piec"]));


const assocIn = <T, G extends PropertyKey[], V, P extends Readonly<G>>(o: T, path: P, value: V): TupleToObject<Mutable<P>, V> & T => {

    const nest = (_path, lastNested) => {
        if (_path.length > 1) return nest(_path.slice(0, -1), { ...getProp(o, _path), [_path.at(-1)]: lastNested, });
        return { ...getProp(o, _path), ...lastNested };
    }

    return assoc(o, path[0], nest(path.slice(0, -1), { [path.at(-1)]: value })) as any;
}

let t2 = assocIn({ jeden: 1, dwa: { czterdziesci: 40 } }, ["dwa", "trzy", "cztery", "piec"] as const, 5);

console.log(JSON.stringify(t2));
type Test1<T> = Mutable<T> extends [infer Head extends PropertyKey, ...infer Tail] ? Head : T

const array = ["dwa", "trzy"] as const;
type T1 = Test1<["hej", "dwa"]>
type T2 = Test1<typeof array>;