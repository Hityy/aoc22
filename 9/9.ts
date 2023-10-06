import assert from "assert";
import { fetchData, log, map, parseData, pipe, reduce, switchCase } from "../utils";

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

export const range = ([starValue, endValue]: Position, mapFn = (n: number) => n as any as Position): Position[] => {
    const decrement = endValue < starValue;
    if (decrement) [endValue, starValue] = [starValue, endValue];
    return Array.from({ length: endValue - starValue }, (_, i) => mapFn(decrement ? endValue - i - 1 : starValue + i + 1));
};

const makeMove = ([x1, y1]: Position, [x2, y2]: Position = [0, 0]): Position => {
    const dx = x1 - x2,
        dy = y1 - y2,
        dd = Math.abs(Math.abs(dx) - Math.abs(dy)),
        signX = dx > 0 ? 1 : -1,
        signY = dy > 0 ? 1 : -1,
        incX = Math.abs(dx) > 1 ? signX : 0,
        incY = Math.abs(dy) > 1 ? signY : 0;

    if (dd === 2)
        return [x2 + incX, y2 + incY];

    if (Math.abs(dx) > 1 || Math.abs(dy) > 1 && dd === 1)
        return [x2 + signX, y2 + signY];

    return [x2, y2];
}




const tailFollowHead = (dirs: Position[]) => {
    const tailPositions: Position[] = [[...dirs[0]]];
    let currentDirectionIndex = 0, currentDir, lastDir: Position, lastTail;

    while (currentDirectionIndex < dirs.length) {
        lastDir = currentDir;
        currentDir = dirs[currentDirectionIndex];
        lastTail = tailPositions.at(-1);

        const move = makeMove(currentDir, lastTail);
        tailPositions.push(move)
        currentDirectionIndex++;
    }
    return tailPositions;
}

const headTraversAll = (directions: DirectionsSource,): Position[] => {
    let traverseHeadHistory: Position[] = [[0, 0]];
    for (let direction of directions) {
        const traverseHead = traverseStepByStep(direction, traverseHeadHistory.at(-1));
        traverseHeadHistory = [...traverseHeadHistory, ...traverseHead];
    }
    return traverseHeadHistory;
}


const traverseStepByStep = ([dir, value]: DirectionWithValue, startPosition: Position) => switchCase(dir,
    s => [s === Direction.R, range([startPosition["0"], startPosition["0"] + value], n => [n, startPosition["1"]])],
    s => [s === Direction.L, range([startPosition["0"], startPosition["0"] - value], n => [n, startPosition["1"]])],
    s => [s === Direction.U, range([startPosition["1"], startPosition["1"] + value], n => [startPosition[0], n])],
    s => [s === Direction.D, range([startPosition["1"], startPosition["1"] - value], n => [startPosition[0], n])]
);

const distinctPosition = (positions: Position[]) => pipe(
    positions,
    map(([x, y]) => x + ' ' + y),
    (s: string[]) => s.reduce((a, c: string) => (a[c] = undefined, a), {}),
    Object.keys
);

const markOnGrid = (marks: number[][], N = '#') => {
    const rowsNumber: number = 5;
    const colsNumber: number = 6;
    const grid = Array.from({ length: rowsNumber }, _ => Array.from({ length: colsNumber }, _ => '.'));
    const gridFilled = marks.reduce((acc, cur) => {
        acc[Math.abs(cur[1] - 4)][cur[0]] = N;
        return acc;
    }, grid);
    console.log(gridFilled.map(s => s.join('')).join('\n'), '\n');
    return marks;
}




const inputTestData = [
    // R4 
    [[0, 0], [0, 0]],
    [[1, 0], [0, 0]], // dx = 1,dy=0 => same, dd = 1
    [[2, 0], [1, 0]], // dx = 2, dy=0 => x++, dd = 2
    [[3, 0], [2, 0]], // dx = 2, dy=0 => x++, dd = 2
    [[4, 0], [3, 0]], // dx= 2,dy=0 => x++ , dd= 2
    // U4
    [[4, 1], [3, 0]], // dx= 1,dy=1 => same , dd = 0
    [[4, 2], [4, 1]], // dx= 1,dy=2 => x++,y++, dd= 1,dx=1, dy=2
    [[4, 3], [4, 2]], // dx= 0,dy=2 => y++, dd = 2
    [[4, 4], [4, 3]], // dx= 0,dy=2 => y++, dd = 2
    // L3
    [[3, 4], [4, 3]], // dx=-1,dy=1 => same, dd=0
    [[2, 4], [3, 4]], // dx=-2,dy=1 => x--,y++ , dd = 1; dx=-2,dy=1
    [[1, 4], [2, 4]], // dx=-2,dy=0 => x-- , dd = 2, dx=-2,dy=1
    // D1
    [[1, 3], [2, 4]], // dx=-1,dy=-1 => same , dd=0
    // R4 
    [[2, 3], [2, 4]], // dx=0,dy=-1 => same, dd=1,
    [[3, 3], [2, 4]], // dx=1,dy=-1 => same, dd=0
    [[4, 3], [3, 3]], // dx=2,dy=-1 => x++,y--, dd=1
    [[5, 3], [4, 3]], // dx=2,dy=0 => x++, dd=2

    // D1
    [[5, 2], [4, 3]],
    // L5
    [[4, 2], [4, 3]],
    [[3, 2], [4, 3]],
    [[2, 2], [3, 2]],
    [[1, 2], [2, 2]],
    [[0, 2], [1, 2]],

    // R2
    [[1, 2], [1, 2]],
    [[2, 2], [1, 2]],

] as Position[][];

const makeMoveTest = (inputs: Position[][]) => {
    let lastInput = inputs[0], inputsFrom1 = inputs.slice(1);

    for (let index in inputsFrom1) {
        const [lastPositionHead, lastPositionTail] = lastInput;
        const [positionHead, desiredPositionTail] = inputsFrom1[index];
        const calculatedPosition = makeMove(positionHead, lastPositionTail);

        assert.deepEqual(calculatedPosition, desiredPositionTail);

        lastInput = inputsFrom1[index];
    }

    console.log('The tests have been completed successfully');
}

makeMoveTest(inputTestData);


// * 8964 too high
// * 6018
pipe(
    './9/9p.txt',
    fetchData,
    parseData,
    (source: string[]) => source.map(s => s.split(' ')),
    map(([d, v]) => [d, parseInt(v)]),
    headTraversAll,
    tailFollowHead,
    // markOnGrid,
    distinctPosition,
    s => s.length,
    log
);

const callN_ = <T>(n: number, cb: (args: T) => T) => (resultArgs: T) => n === 0 ? resultArgs : callN(n - 1, cb)(cb(resultArgs));
function callN(n: number, cb: Function) {
    return function resolve(resultArgs, calledTimes = 0) {
        if (calledTimes < n) return resolve(cb(resultArgs), calledTimes + 1);
        return resultArgs;
    }
}

// **
// 2378 too low
// 2648 to high
// 2619 good
pipe(
    './9/9p.txt',
    fetchData,
    parseData,
    (source: string[]) => source.map(s => s.split(' ')),
    map(([d, v]) => [d, parseInt(v)]),
    headTraversAll,
    callN(9, tailFollowHead),
    // tailFollowHead,
    // tailFollowHead,
    // tailFollowHead,

    // tailFollowHead,
    // tailFollowHead,
    // tailFollowHead,

    // tailFollowHead,
    // tailFollowHead,
    // tailFollowHead,

    // markOnGrid,
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

