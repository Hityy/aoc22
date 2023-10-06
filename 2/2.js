"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const values = {
    A: 1 /* Sign.Rock */,
    X: 1 /* Sign.Rock */,
    B: 2 /* Sign.Paper */,
    Y: 2 /* Sign.Paper */,
    C: 3 /* Sign.Scissors */,
    Z: 3 /* Sign.Scissors */
};
;
const getResult = ([opponent, me]) => {
    switch (me) {
        case opponent: return 3 /* Result.Draw */ + me;
        case 2 /* Sign.Paper */: return (opponent === 1 /* Sign.Rock */ ? 6 /* Result.Win */ : 0 /* Result.Loss */) + me;
        case 1 /* Sign.Rock */: return (opponent === 2 /* Sign.Paper */ ? 0 /* Result.Loss */ : 6 /* Result.Win */) + me;
        case 3 /* Sign.Scissors */: return (opponent === 1 /* Sign.Rock */ ? 0 /* Result.Loss */ : 6 /* Result.Win */) + me;
    }
};
(0, utils_1.pipe)('./2/2p.txt', utils_1.fetchData, utils_1.parseData, (0, utils_1.map)((s) => s.split(' ')
    .map(c => values[c])), (0, utils_1.map)(getResult), utils_1.sum, utils_1.log);
const valuesWithWinLoss = {
    A: 1 /* Sign.Rock */,
    X: 0 /* Result.Loss */,
    B: 2 /* Sign.Paper */,
    Y: 3 /* Result.Draw */,
    C: 3 /* Sign.Scissors */,
    Z: 6 /* Result.Win */,
};
(0, utils_1.pipe)('./2/2p.txt', utils_1.fetchData, utils_1.parseData, (0, utils_1.map)((s) => s.split(' ')
    .map(c => valuesWithWinLoss[c])), (0, utils_1.map)(([opponent, me]) => {
    switch (me) {
        case 0 /* Result.Loss */:
            switch (opponent) {
                case 1 /* Sign.Rock */: return 0 /* Result.Loss */ + 3 /* Sign.Scissors */;
                case 2 /* Sign.Paper */: return 0 /* Result.Loss */ + 1 /* Sign.Rock */;
                case 3 /* Sign.Scissors */: return 0 /* Result.Loss */ + 2 /* Sign.Paper */;
            }
        case 6 /* Result.Win */:
            switch (opponent) {
                case 1 /* Sign.Rock */: return 6 /* Result.Win */ + 2 /* Sign.Paper */;
                case 2 /* Sign.Paper */: return 6 /* Result.Win */ + 3 /* Sign.Scissors */;
                case 3 /* Sign.Scissors */: return 6 /* Result.Win */ + 1 /* Sign.Rock */;
            }
        case 3 /* Result.Draw */:
            switch (opponent) {
                case 1 /* Sign.Rock */: return 3 /* Result.Draw */ + 1 /* Sign.Rock */;
                case 2 /* Sign.Paper */: return 3 /* Result.Draw */ + 2 /* Sign.Paper */;
                case 3 /* Sign.Scissors */: return 3 /* Result.Draw */ + 3 /* Sign.Scissors */;
            }
    }
}), utils_1.sum, utils_1.log);
