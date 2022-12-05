import { fetchData, log, map, parseData, pipe } from "../utils";

// 1:1 5:2 9:3 13:4
// 3a + b = 9// b = 9 -3a
// 4a + b = 13 // 4a +9 -3a = 13 // a = 4 // b = 9-12 = -3// y = 4x -3

const r19 = Array.from({ length: 9 }, (_, i) => i + 1);

const translateXY = array => array[0].map((_, colIndex) => array.map(row => row[colIndex]));

// tworzy stos krat - dzwig podnosi
const getOnStack = ([crates, [cratesN, from, to], stack = []]): [any, any, any] =>
    cratesN === 0 ?
        [crates, [cratesN, from, to], stack] :
        getOnStack(
            [crates.map((c, i) => i === from - 1 ? c.slice(0, -1) : c),
            [cratesN - 1, from, to],
            [...stack, crates[from - 1][crates[from - 1].length - 1]]]
        );

// oproznia stos krat - dzwig  opuszcza
const getFromStack$ = ([crates, [cratesN, from, to], stack]) =>
    stack.length === 0 ?
        crates :
        getFromStack$(
            [crates.map((c, i) => i === to - 1 ? [...c, stack[0]] : c),
            [cratesN, from, to],
            stack.slice(1)]
        );

// iterowanie po instrukcjach - dzwig przesuwa 
const move$ = ([crates, instructions]) => instructions.length ?
    move$([pipe([crates, instructions[0]], getOnStack, getFromStack$), instructions.slice(1)]) :
    crates;

//*

pipe(
    './5/5p.txt',
    fetchData,
    parseData,
    data => [
        data.slice(0, 8) // tylko pierwsze 9 wiersze
            .reverse()
            .map(d => d.split(''))
            .map((_, i, arr) => r19.map(x => arr[i][x * 4 - 3])), // po indekach biore litery zgodnie z wyliczona y = 4x-3 funkcja liniowa
        data.slice(10) // instrukcje od 10 do konca
    ],
    data => [
        translateXY(data[0]).map(column => column.filter(c => c !== ' ')), // translacja osi x na y
        data[1].map(s => s.split(' ').map(d => +d).filter(c => !!c))
    ],
    move$, // dzwiganie krat
    map((d: string[]) => d[d.length - 1]),
    data => data.join(''),
    log
);

//
// **

const getFromStack$$ = ([crates, [cratesN, from, to], stack]) =>
    stack.length === 0 ?
        crates :
        getFromStack$$(
            [crates.map((c, i) => i === to - 1 ? [...c, stack[stack.length - 1]] : c),
            [cratesN, from, to],
            stack.slice(0, -1)]
        );
const move$$ = ([crates, instructions]) => instructions.length ?
    move$$([pipe([crates, instructions[0]], getOnStack, getFromStack$$), instructions.slice(1)]) :
    crates;

pipe(
    './5/5p.txt',
    fetchData,
    parseData,
    data => [
        data.slice(0, 8)
            .reverse()
            .map(d => d.split(''))
            .map((_, i, arr) => r19.map(x => arr[i][x * 4 - 3])),
        data.slice(10)
    ],
    data => [
        translateXY(data[0]).map(column => column.filter(c => c !== ' ')),
        data[1].map(s => s.split(' ').map(d => +d).filter(c => !!c))
    ],
    move$$,
    map((d: string[]) => d[d.length - 1]),
    data => data.join(''),
    log
);


const test = [
    '____[M]_____________[Z]_____[V]____',
    '____[Z]_____[P]_____[L]_____[Z]_[J]',
    '[S]_[D]_____[W]_____[W]_____[H]_[Q]',
    '[P]_[V]_[N]_[D]_____[P]_____[C]_[V]',
    '[H]_[B]_[J]_[V]_[B]_[M]_____[N]_[P]',
    '[V]_[F]_[L]_[Z]_[C]_[S]_[P]_[S]_[G]',
    '[F]_[J]_[M]_[G]_[R]_[R]_[H]_[R]_[L]',
    '[G]_[G]_[G]_[N]_[V]_[V]_[T]_[Q]_[F]',
    // '_1___2___3___4___5___6___7___8___9_',
]
