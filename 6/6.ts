import { fetchData, log, parseData, pipe } from "../utils";

const isDistinct = (str: string[], res = true) => res && str.length > 0 ? isDistinct(str.slice(1), !str.slice(1).includes(str[0])) : res
const findMarker = (bufferSize: number) => (s: string[], buffer: string[] = [], index = 0) =>
    buffer.length === bufferSize && isDistinct(buffer) ? index :
        findMarker(bufferSize)(
            s.slice(1),
            buffer.length === bufferSize ? [s[0], ...(buffer.slice(0, -1))] : [s[0], ...buffer,],
            index + 1
        );


// *
pipe(
    './6/6p.txt',
    fetchData,
    parseData,
    data => data[0].split(''),
    log,
    findMarker(4),
    log
);
// **
pipe(
    './6/6p.txt',
    fetchData,
    parseData,
    data => data[0].split(''),
    log,
    findMarker(14),
    log
);