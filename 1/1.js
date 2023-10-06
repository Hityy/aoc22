"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const collect = ([x, ...xs], acc = [], tmp = []) => !!x ?
    collect(xs, acc, [x, ...tmp]) : xs.length ? collect(xs, [tmp, ...acc], []) : [tmp, ...acc];
const max = (data) => Math.max(...data);
const sort = (data) => data.sort((a, b) => b - a);
const take = (n) => (data) => data.slice(0, n);
// *
(0, utils_1.pipe)("./1/1p.txt", utils_1.fetchData, utils_1.parseData, collect, (0, utils_1.map)(utils_1.sum), max, utils_1.log);
// **
(0, utils_1.pipe)("./1/1p.txt", utils_1.fetchData, utils_1.parseData, collect, (0, utils_1.map)(utils_1.sum), sort, take(3), utils_1.sum, utils_1.log);
