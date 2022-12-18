import { fetchData, log, map, parseData, pipe, translateXY } from "../utils";

const isVisibleFromLeft = (grid: number[][], indexY: number, indexX: number,) => {
    const value = grid[indexY][indexX];
    for (let x = 0; x < indexX; x++) {
        if (grid[indexY][x] >= value) return false;
    }
    return true;
}
const isVisibleFromRight = (grid: number[][], indexY: number, indexX: number) => {
    const value = grid[indexY][indexX];
    for (let x = indexX + 1; x < grid[indexY].length; x++) {
        if (grid[indexY][x] >= value) return false;
    }
    return true;
}

const isVisibleFromTop = (grid: number[][], indexY: number, indexX: number) => {
    const gridXY = translateXY(grid);
    return isVisibleFromLeft(gridXY, indexX, indexY,);
}
const isVisibleFromBottom = (grid: number[][], indexY: number, indexX: number) => {
    const gridXY = translateXY(grid);
    return isVisibleFromRight(gridXY, indexX, indexY,);
}

// * 1719
pipe(
    './8/8p.txt',
    fetchData,
    parseData,
    map((s: string) => s.split('').map(c => Number.parseInt(c))),
    (grid: number[][]) => {
        let counter = grid.length * 2 + (grid[0].length - 2) * 2
        for (let y = 1; y < grid.length - 1; y++) {
            for (let x = 1; x < grid[0].length - 1; x++) {
                const visibleFromLeft = isVisibleFromLeft(grid, y, x);
                const visibleFromRight = isVisibleFromRight(grid, y, x);
                const visibleFromTop = isVisibleFromTop(grid, y, x);
                const visibleFromBottom = isVisibleFromBottom(grid, y, x);
                if (visibleFromLeft || visibleFromRight || visibleFromTop || visibleFromBottom)
                    counter = counter + 1;
            }
        }
        return counter;
    },
    log,
);

// 1343 too low

// **

const countTreeToLeft = (grid: number[][], indexY: number, indexX: number) => {
    const value = grid[indexY][indexX];
    let counter = 0;
    for (let x = indexX - 1; x >= 0; x--) {
        if (grid[indexY][x] < value) counter++;
        if (grid[indexY][x] >= value) return counter + 1;
    }
    return counter;
}
const countTreeToRight = (grid: number[][], indexY: number, indexX: number) => {
    const value = grid[indexY][indexX];
    let counter = 0;
    for (let x = indexX + 1; x <= grid[indexY].length - 1; x++) {
        if (grid[indexY][x] < value) counter++;
        if (grid[indexY][x] >= value) return counter + 1;
    }
    return counter;
}
const countTreeToTop = (grid: number[][], indexY: number, indexX: number) => {
    const gridXY = translateXY(grid);
    return countTreeToLeft(gridXY, indexX, indexY);
}
const countTreeToBottom = (grid: number[][], indexY: number, indexX: number) => {
    const gridXY = translateXY(grid);
    return countTreeToRight(gridXY, indexX, indexY);
}

// **
// 590824

pipe(
    './8/8p.txt',
    fetchData,
    parseData,
    map((s: string) => s.split('').map(c => Number.parseInt(c))),
    (grid: number[][]) => {
        const result = [];
        for (let y = 1; y < grid.length - 1; y++) {
            for (let x = 1; x < grid[0].length - 1; x++) {
                const countFromLeft = countTreeToLeft(grid, y, x);
                const countFromRight = countTreeToRight(grid, y, x);
                const countFromTop = countTreeToTop(grid, y, x);
                const countFromBottom = countTreeToBottom(grid, y, x);
                result.push(countFromLeft * countFromRight * countFromTop * countFromBottom);
            }
        }
        return Math.max(...result);
    },
    log,
);

