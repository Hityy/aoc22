import { fetchData, flatMap, groupN, intersect, log, map, parseData, pipe, sum } from "../utils";

const getCharCode = (c: string) => c.toLowerCase() === c ? c.charCodeAt(0) - 96 : c.charCodeAt(0) - 38;
const divideString2 = (s: string) => [s.slice(0, s.length / 2), s.slice(s.length / 2)];

//*
pipe(
    './3/3p.txt',
    fetchData,
    parseData,
    map(divideString2),
    flatMap(intersect),
    map(getCharCode),
    sum,
    log
);

//** 
pipe(
    './3/3p.txt',
    fetchData,
    parseData,
    groupN(3),
    flatMap(([s1, s2, s3]) => intersect([intersect([s1, s2]), s3])),
    map(getCharCode),
    sum,
    log
);




