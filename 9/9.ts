import { fetchData, log, map, parseData, pipe, reduce, switchCase } from "../utils";
import assert from "assert";


enum Direction {
    R = 'R',
    U = 'U',
    L = "L",
    D = "D"
}
type DirectionWithValue = [Direction, number];
type DirectionsSource = DirectionWithValue[];

type X = number;
type Y = number;
type Position = [X, Y];

// [x,y]


export const range = ([starValue, endValue]: Position, mapFn = (n: number) => n as any as Position): Position[] => {
    const decrement = endValue < starValue;
    if (decrement) [endValue, starValue] = [starValue, endValue];
    return Array.from({ length: endValue - starValue }, (_, i) => mapFn(decrement ? endValue - i - 1 : starValue + i + 1));
};


const traverseStepByStep = ([dir, value]: DirectionWithValue, startPosition: Position) => switchCase(dir,
    s => [s === Direction.R, range([startPosition["0"], startPosition["0"] + value], n => [n, startPosition["1"]])],
    s => [s === Direction.L, range([startPosition["0"], startPosition["0"] - value], n => [n, startPosition["1"]])],
    s => [s === Direction.U, range([startPosition["1"], startPosition["1"] + value], n => [startPosition[0], n])],
    s => [s === Direction.D, range([startPosition["1"], startPosition["1"] - value], n => [startPosition[0], n])]
);

const difference = (a: number, b: number) => {
    if (a > b) return a - b;
    return b - a;
}
const differenceByTwoPositions = ([x1, y1]: Position, [x2, y2]: Position) => {
    if (difference(x1, x2) > 1) return true;
    if (difference(y1, y2) > 1) return true;
    return false;
}

const differenceByToPointsDiagonal = ([x1, y1]: Position, [x2, y2]: Position) => {
    if (x1 !== x2 && y1 !== y2 && differenceByTwoPositions([x1, y1], [x2, y2])) {
        return true;
    }
    return false;
}

const tailFollowHead = (dirs: Position[]) => {
    const tailPositions: Position[] = [[...dirs[0]]];
    let currentDirectionIndex = 0, currentDir, lastDir: Position, preLastDir, lastTail;
    let currentY = 0;

    while (currentDirectionIndex < dirs.length) {
        preLastDir = lastDir;
        lastDir = currentDir;
        currentDir = dirs[currentDirectionIndex];
        lastTail = tailPositions.at(-1);

        if (differenceByTwoPositions(currentDir, lastTail)) {
            // console.log(currentDir, lastTail);
            // lastDir[1] = currentY;
            tailPositions.push(lastDir);
        } else if (differenceByToPointsDiagonal(currentDir, lastTail)) {
            // console.log('currentY', currentY)
            // currentY = currentDir[1];
            tailPositions.push(currentDir);
        }
        currentDirectionIndex++;
    }
    return tailPositions;
}

// const headTraversAllR = (directions: DirectionsSource, traverseHistory: Position[] = [[0, 0]]): Position[] => {
//     return directions.length ? headTraversAll(directions.slice(1), [...traverseHistory, ...traverseStepByStep(directions[0], traverseHistory.at(-1))])
//         : traverseHistory;
// }
const headTraversAll = (ropes: number) => (directions: DirectionsSource,): Position[] => {
    let traverseHeadHistory: Position[] = [[0, 0]];
    let traverseTailHistory: Position[] = [];
    let c = 0;
    let iff = c => c <= 1;
    for (let direction of directions) {
        if (iff(c)) {
            console.log("DIRECTION: ", direction[0], "Value: ", direction[1]);
        }
        const traverseHead = traverseStepByStep(direction, traverseHeadHistory.at(-1));
        traverseHeadHistory = [...traverseHeadHistory, ...traverseHead];

        let traverseTailHistoryPerDirection: Position[] = tailFollowHead(traverseHeadHistory);
        // let traverseTailHistoryPerDirection2: Position[] = tailFollowHead(traverseTailHistoryPerDirection);

        if (iff(c)) {
            console.log(traverseTailHistoryPerDirection);
        }
        for (let rope = 0; rope < ropes - 1; rope++) {
            traverseTailHistoryPerDirection = tailFollowHead(traverseTailHistoryPerDirection);
            // traverseTailHistoryPerDirection = traverseTail;
            if (iff(c)) {
                console.log(traverseTailHistoryPerDirection);
            }
        };
        traverseTailHistory.push(...traverseTailHistoryPerDirection);
        if (iff(c)) {
            console.log("Head Position: ", traverseHeadHistory.at(-1));
            console.log("Result tail n Position: ", traverseTailHistoryPerDirection);
            // console.log("Result tail2 n Position: ", traverseTailHistoryPerDirection2);
        }

        c++;

    }
    // return directions.length ? headTraversAll(directions.slice(1), [...traverseHistory, ...traverseStepByStep(directions[0], traverseHistory.at(-1))])
    return traverseTailHistory;
}

const distinctPosition = (positions: Position[]) => pipe(
    positions,
    map(([x, y]) => x + ' ' + y),
    (s: string[]) => s.reduce((a, c: string) => (a[c] = undefined, a), {}),
    Object.keys
);

// * 8964 too high
// * 6018
// pipe(
//     './9/9p.txt',
//     fetchData,
//     parseData,
//     (source: string[]) => source.map(s => s.split(' ')),
//     map(([d, v]) => [d, parseInt(v)]),
//     headTraversAll,
//     tailFollowHead,
//     distinctPosition,
//     s => s.length,
//     log
// );

// **
// 2378 too low
// 2648 to high
pipe(
    './9/9t.txt',
    fetchData,
    parseData,
    (source: string[]) => source.map(s => s.split(' ')),
    map(([d, v]) => [d, parseInt(v)]),
    headTraversAll(9),
    // tailFollowHead,
    // log,
    distinctPosition,
    s => s.length,
    log
);






// assert.deepEqual(range([15, 10]), [16, 15, 14, 13, 12]);
// assert.deepEqual(range([0, 5]), [0, 1, 2, 3, 4]);
// assert.deepEqual(range([10, 15]), [11, 12, 13, 14, 15]);
// assert.deepEqual(range([0, -5]), [-1, -2, -3, -4, -5]);
// assert.deepEqual(range([-5, 0]), [-4, -3, -2, -1, 0]);


// assert.deepEqual(traverseStepByStep([Direction.R, 4], [0, 0]), [[1, 0], [2, 0], [3, 0], [4, 0]])
// assert.deepEqual(traverseStepByStep([Direction.U, 4], [4, 0]), [[4, 1], [4, 2], [4, 3], [4, 4]])
// assert.deepEqual(traverseStepByStep([Direction.L, 3], [4, 4]), [[3, 4], [2, 4], [1, 4]])
// assert.deepEqual(traverseStepByStep([Direction.D, 1], [1, 4]), [[1, 3]])

// let headPositions: Position[] = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]];
// let tailPositions: Position[] = [[0, 0], [1, 0], [2, 0], [3, 0]]
// assert.deepEqual(tailFollowHead(headPositions), tailPositions);
// let headPositionsUp: Position[] = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4]];
// let tailPositionsUp: Position[] = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 1], [4, 2], [4, 3]]
// assert.deepEqual(tailFollowHead(headPositionsUp), tailPositionsUp);
// let headPositionsLeft: Position[] = [[4, 3], [4, 4], [3, 4], [2, 4], [1, 4]];
// let tailPositionsLeft: Position[] = [[4, 3], [3, 4], [2, 4]]
// assert.deepEqual(tailFollowHead(headPositionsLeft), tailPositionsLeft);

