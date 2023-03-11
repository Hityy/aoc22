import { fetchData, log, map, parseData, pipe, switchCase, translateXY } from "../utils";

type Noop = {
    type: 'noop',
}

type AddX = {
    type: 'addx',
    value: number;
}

type Instruction = Noop | AddX;

const incrementCycle = (instructions: Instruction[]) => {
    let registry = [1,]
    let cycles = 0;
    const singals = [];
    const registryStops = [20, 60, 100, 140, 180, 220];

    return [registry, cycles, singals];
}

pipe(
    './10/10t.txt',
    fetchData,
    parseData,
    map((s: string) => s.split(' ')),
    // [
    //     ['noop'],
    //     ['addx', 3],
    //     ['addx', -5]
    // ],
    map(([type, value]) => ({ type, value: +value })),
    // log,
    incrementCycle,
    log,
);
