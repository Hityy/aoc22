var fs = require('fs');
var { scan, pipe, distinct, toarray } = require('powerseq');

var path = '/Users/hity/Projects/aoc22/aoc22/bedziebolalo/13a.txt';
var input = fs.readFileSync(path, 'utf-8').toString();

var flip = f => (...args) => f(...args.reverse());

var switchCase = (s, ...cbs) => {
  let last = [null, null];
  for (let caseN of cbs) {
    const [r1, r2] = last = caseN(s);
    if (r1) return r2;
  }
  return last;
}

var move = (direction, [x, y]) => switchCase(direction,
  d => [d === '^', [x, y + 1]],
  d => [d === 'v', [x, y - 1]],
  d => [d === '>', [x + 1, y]],
  d => [d === '<', [x - 1, y]]
);

var getSolution = () => pipe(
  scan(input, flip(move), [0, 0]),
  distinct(([x, y]) => x + ' ' + y),
  toarray()
).length + 1;

var tests = () => {
  move('<', [0, 0]);
  move('>', [0, 0]);
  move('^', [0, 0]);
  move('v', [0, 0]);

  ['<', '>', 'v'].reduce((acc, cur) => {
    return move(cur, acc);
  }, [0, 0]);
}


