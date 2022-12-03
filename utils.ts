import * as fs from 'fs';

export const fetchData = (path: string) => fs.readFileSync(path);
export const parseData = (data: Buffer) => data.toString().split('\n');


export const pipe = (value, ...fns) => fns.length > 0 ? pipe(fns[0](value), ...fns.slice(1)) : value;
export const log = console.log.bind(null);


export const maxBy = predicate => collection =>
    collection.reduce((a, c, i, cc, predicateValue = predicate(c)) => predicateValue > a[0] ? [predicateValue, c] : a, [0, null])[1];

export const substr = str => ([start, end]) => str.slice(start, end + 1);

export const pairwiseEach = collection => collection.reduce((acc, element, index) =>
    [...acc, ...collection.slice(index + 1).map(nextElement => [element, nextElement])], []);

export const sum = <T extends number>(data: T[]) => data.reduce((a, c) => a + +c, 0);



//interesction
export const intersect = ([s1, s2], i = 0, c = null, ss1 = new Set(s1), ss2 = new Set(s2)) => [...new Set([...ss1].filter(i => ss2.has(i)))];

// map

export const map = <T, R>(mapFn: (e: T, i: number, arr: T[]) => R) => (data: T[]): R[] => data.map(mapFn);
// export const map = <T, R>(mapFn: (e: T, i: number, arr: T[]) => R) => (data: T[]): R[] => data.map(mapFn);
export const flatMap = <T, R>(mapFn: (e: T, i: number, arr: T[]) => R) => (data: T[]): R[] => data.flatMap(mapFn);


// group by

const groupBy_ = (data, predicate, dataC = data, index = 0, buff = {}, key = predicate(data[0], index)) => data.length > 1 ?
    groupBy_(data.slice(1), predicate, data, index + 1, { ...buff, [key]: [...(buff[key] || []), ...dataC.map((e, i) => [predicate(e, i), e]).filter(([p, e]) => p === key).map(([p, e]) => e)] }) :
    buff;
const groupBy = predicate => data => groupBy_(data, predicate);

//group

const groupN_ = (data, n, buff = [], res = []) => data.length ?
    (buff.length === n ? groupN_(data.slice(1), n, [data[0]], [...res, buff]) : groupN_(data.slice(1), n, [...buff, data[0]], res))
    : [...res, buff];

export const groupN = n => data => groupN_(data, n);