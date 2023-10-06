import { fetchData, log, map, parseData, pipe, switchCase, translateXY } from "../utils";

type Noop = {
    type: 'noop',
}
type AddX = {
    type: 'addx',
    value: number;
}
type Instruction = Noop | AddX;

const mapToTypes = (data: string[]) => data.map((s: string, i, a, v = s.split(' '), [type, value] = v) =>
    ({ type, value: +value || 0 } as any as Instruction));

const incrementCycle = (instructions: Instruction[], actualCycle = 1, registry = [1], singals = [], cost = 0, registryStops = [20, 60, 100, 140, 180, 220]) => {

    if (instructions.length === 0)
        return singals;

    if (actualCycle + 1 === registryStops.at(0))
        return incrementCycle(instructions, actualCycle, registry, [...singals, [registryStops.at(0), registry.reduce((s, c) => s + c, 0),]], cost, registryStops.slice(1));

    // gdy koszt = 0, bierzemy nastepna instrukcje
    if (cost === 0) {
        const instruction = instructions.at(0);

        switch (instruction.type) {
            case 'addx':
                return incrementCycle(instructions.slice(1), actualCycle + 1, [...registry, instruction.value], singals, cost + 1, registryStops);
            case 'noop':
                return incrementCycle(instructions.slice(1), actualCycle + 1, registry, singals, 0, registryStops);
            default:
                break;
        }
    }

    return incrementCycle(instructions, actualCycle + 1, registry, singals, cost - 1, registryStops);
};

const getSignalStrength = (signals: number[][]) => signals.reduce((s, [cycle, regisrtry]) => s + (cycle * regisrtry), 0);

pipe(
    './10/10p.txt',
    fetchData,
    parseData,
    mapToTypes,
    incrementCycle,
    getSignalStrength,
    log,
);
