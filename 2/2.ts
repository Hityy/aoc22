import { fetchData, parseData, pipe, map, log, maxBy, sum } from '../utils'

const enum Sign {
    Rock = 1,
    Paper = 2,
    Scissors = 3
};


const values = {
    A: Sign.Rock,
    X: Sign.Rock,
    B: Sign.Paper,
    Y: Sign.Paper,
    C: Sign.Scissors,
    Z: Sign.Scissors
};

const enum Result {
    Win = 6,
    Draw = 3,
    Loss = 0
};

const getResult = ([opponent, me]: [Sign, Sign]) => {
    switch (me) {
        case opponent: return Result.Draw + me;
        case Sign.Paper: return (opponent === Sign.Rock ? Result.Win : Result.Loss) + me;
        case Sign.Rock: return (opponent === Sign.Paper ? Result.Loss : Result.Win) + me;
        case Sign.Scissors: return (opponent === Sign.Rock ? Result.Loss : Result.Win) + me;
    }
};

pipe(
    './2/2p.txt',
    fetchData,
    parseData,
    map((s: string) => s.split(' ').map(c => values[c])),
    map(getResult),
    sum,
    log
);


const valuesWithWinLoss = {
    A: Sign.Rock,
    X: Result.Loss,
    B: Sign.Paper,
    Y: Result.Draw,
    C: Sign.Scissors,
    Z: Result.Win,
};


pipe(
    './2/2p.txt',
    fetchData,
    parseData,
    map((s: string) =>
        s.split(' ')
            .map(c => valuesWithWinLoss[c]),
    ),
    map(([opponent, me]) => {
        switch (me) {
            case Result.Loss:
                switch (opponent) {
                    case Sign.Rock: return Result.Loss + Sign.Scissors;
                    case Sign.Paper: return Result.Loss + Sign.Rock;
                    case Sign.Scissors: return Result.Loss + Sign.Paper;
                }
            case Result.Win:
                switch (opponent) {
                    case Sign.Rock: return Result.Win + Sign.Paper;
                    case Sign.Paper: return Result.Win + Sign.Scissors;
                    case Sign.Scissors: return Result.Win + Sign.Rock;
                }
            case Result.Draw:
                switch (opponent) {
                    case Sign.Rock: return Result.Draw + Sign.Rock;
                    case Sign.Paper: return Result.Draw + Sign.Paper;
                    case Sign.Scissors: return Result.Draw + Sign.Scissors;
                }
        }
    }),
    sum,
    log
);
