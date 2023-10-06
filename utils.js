"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.sum = exports.map = exports.pipe = exports.pairwiseEach = exports.substr = exports.maxBy = exports.parseData = exports.fetchData = void 0;
const fs = __importStar(require("fs"));
const fetchData = (path) => fs.readFileSync(path);
exports.fetchData = fetchData;
const parseData = (data) => data.toString().split('\n');
exports.parseData = parseData;
const maxBy = predicate => collection => collection.reduce((a, c, i, cc, predicateValue = predicate(c)) => predicateValue > a[0] ? [predicateValue, c] : a, [0, null])[1];
exports.maxBy = maxBy;
const substr = str => ([start, end]) => str.slice(start, end + 1);
exports.substr = substr;
const pairwiseEach = collection => collection.reduce((acc, element, index) => [...acc, ...collection.slice(index + 1).map(nextElement => [element, nextElement])], []);
exports.pairwiseEach = pairwiseEach;
const pipe = (value, ...fns) => fns.length > 0 ? (0, exports.pipe)(fns[0](value), ...fns.slice(1)) : value;
exports.pipe = pipe;
const map = (mapFn) => (data) => data.map(mapFn);
exports.map = map;
const sum = (data) => data.reduce((a, c) => a + +c, 0);
exports.sum = sum;
exports.log = console.log.bind(null);
