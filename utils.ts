import * as fs from 'fs';

export const fetchData = (path: string) => fs.readFileSync(path);
export const parseData = (data: Buffer) => data.toString().split('\n');
export const maxBy = predicate => collection =>
    collection.reduce((a, c, i, cc, predicateValue = predicate(c)) => predicateValue > a[0] ? [predicateValue, c] : a, [0, null])[1];
export const substr = str => ([start, end]) => str.slice(start, end + 1);

export const pairwiseEach = collection => collection.reduce((acc, element, index) =>
    [...acc, ...collection.slice(index + 1).map(nextElement => [element, nextElement])], []);

export const pipe = (value, ...fns) => fns.length > 0 ? pipe(fns[0](value), ...fns.slice(1)) : value;

export const map = <T, R>(mapFn: (e: T, i: number, arr: T[]) => R) => (data: T[]): R[] => data.map(mapFn);
export const sum = <T extends number>(data: T[]) => data.reduce((a, c) => a + +c, 0);
export const log = console.log.bind(null);