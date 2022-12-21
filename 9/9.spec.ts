import assert from "assert";
import { range } from "./9";


const range1 = range([15, 10]);
console.log(range1);
assert.equal(range1, [15, 14, 13, 12, 11])
