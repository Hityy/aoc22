import { fetchData, filter, flatMap, log, map, parseData, pipe, sum } from "../utils";

// *
pipe(
    './4/4p.txt',
    fetchData,
    parseData,
    map((s: string) => s.split(',').map(ss => ss.split('-').map(sd => parseInt(sd)))),
    filter(([[afirst, alast], [bfirst, blast]]) =>
        (afirst <= bfirst && alast >= blast) ||
        (bfirst <= afirst && blast >= alast)
    ),
    data => data.length,
    log,
);

// **
pipe(
    './4/4p.txt',
    fetchData,
    parseData,
    map((s: string) => s.split(',').map(ss => ss.split('-').map(sd => parseInt(sd)))),
    filter(([[afirst, alast], [bfirst, blast]]) =>
        (afirst <= bfirst && alast >= bfirst) ||
        (afirst <= bfirst && alast >= bfirst) ||
        (bfirst <= afirst && blast >= afirst) ||
        (bfirst <= afirst && blast >= afirst)
    ),
    data => data.length,
    log,
)