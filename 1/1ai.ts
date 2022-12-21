import * as fs from 'fs';
// const input = `1000
// 2000
// 3000

// 4000

// 5000
// 6000

// 7000
// 8000
// 9000

// 10000`;

export const fetchData = (path: string) => fs.readFileSync(path);
export const input = () => fetchData("./1/1p.txt").toString().split('\n');

const calorieCounts: number[] = [];
let currentElf = 0;

input().forEach(line => {
    if (line === '') {
        currentElf++;
    } else {
        calorieCounts[currentElf] = calorieCounts[currentElf] ? calorieCounts[currentElf] + parseInt(line, 10) : parseInt(line, 10);
    }
});

const maxCalories = Math.max(...calorieCounts);

console.log(`Elf carrying the most Calories: Elf #${calorieCounts.indexOf(maxCalories) + 1}`);
console.log(`Total Calories carried: ${maxCalories}`);