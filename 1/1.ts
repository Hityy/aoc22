import { fetchData, parseData, pipe, map, log, maxBy, sum } from '../utils'

const collect = <T>([x, ...xs]: T[], acc = [], tmp = []) => !!x ?
    collect(xs, acc, [x, ...tmp]) : xs.length ? collect(xs, [tmp, ...acc], []) : [tmp, ...acc];

const max = (data: number[]) => Math.max(...data);
const sort = (data: number[]) => data.sort((a, b) => b - a);
const take = (n: number) => <T>(data: T[]) => data.slice(0, n);

// *
pipe(
    "./1/1p.txt",
    fetchData,
    parseData,
    collect,
    map(sum),
    max,
    log
);

// **
pipe(
    "./1/1p.txt",
    fetchData,
    parseData,
    collect,
    map(sum),
    sort,
    take(3),
    sum,
    log
);