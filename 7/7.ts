import { fetchData, filter, log, map, parseData, pipe } from "../utils";

const tryParse = (s: string, i: number, ss: string[], p = parseInt(s)) => Number.isNaN(p) ? s : p

enum Command {
    dir = 'dir',
    cd = 'cd',
    ls = 'ls',
    $ = "$",
    back = '..'
}

const sumFilesSizeInDirectory = (commands, buffer = 0, newCommands = [], command = commands[0],) => {

    if (!command) return [...newCommands, ['f', buffer]];

    if (command[0] === Command.dir || command[1] === Command.ls) {
        return sumFilesSizeInDirectory(commands.slice(1), buffer, newCommands);
    }
    if (command && typeof command[0] === 'number') {
        return sumFilesSizeInDirectory(commands.slice(1), buffer + command[0], newCommands);
    }
    if (buffer > 0) {
        return sumFilesSizeInDirectory(commands.slice(1), 0, [...newCommands, ['f', buffer], command]);
    }
    return sumFilesSizeInDirectory(commands.slice(1), 0, [...newCommands, command]);
};

const merge = (commands, newCommands = [], command = commands[0], nextCommand = commands[1]) => {
    return nextCommand ?
        command.includes(Command.$) && nextCommand[0] === 'f' ?
            merge(commands.slice(2), [...newCommands, [...command, nextCommand[1]]]) :
            merge(commands.slice(1), [...newCommands, command])
        : newCommands;
}


const toNode = (commands, parent, root = null, command = commands[0]) => {
    if (!command) return root;
    if (command.length === 3) {
        return toNode(commands.slice(1), parent?.parent || parent, root);
    }

    const node = {
        name: command[2],
        size: command[3],
        nodes: [],
        parent: parent
    }

    // if (!node.size)
    //     console.log(node);
    if (!parent) root = node;





    if (parent) {
        parent.nodes.push(node);
    }

    return toNode(commands.slice(1), node, root);
}

const getSize = (node) => {
    return node.nodes.length ? node.totalSize + node.nodes.map(getSize).reduce((a, c) => a + c, 0) : node.size;
}

const mapNodes = (node) => {
    // const size = getSize(node);
    // if (Number.isNaN(size))
    //     console.log(node)
    // console.log(size);
    return {
        ...node,
        totalSize: getSize(node),
        nodes: node.nodes.length ? node.nodes.map(mapNodes) : []
    }
};

const filterNodes = (node, list = []) => {

    let nodes = node.nodes;
    while (nodes.length) {
        // console.log(nodes);
        nodes.forEach(n => {
            if (n.totalSize < 100000)
                list.push(n);
        });
        nodes = nodes.flatMap(n => n.nodes);

    }
    return list;
}

const group = (commands) => {
    let newCommands = [];
    let dir: string[] = [];
    for (let i = 0; i < commands.length; i++) {
        const command: string = commands[i];
        if (command.startsWith('$ cd')) {
            if (dir.length) {
                newCommands[newCommands.length - 1].push(dir.flatMap(s => +s.split(' ')[0]).reduce((a, c) => a + c, 0));
                dir = [];
            }
            newCommands.push(command.split(' '));
        } else {
            dir.push(command)
        }

    }
    if (dir.length) {
        newCommands[newCommands.length - 1].push(dir.flatMap(s => +s.split(' ')[0]).reduce((a, c) => a + c, 0));
        dir = [];
    }

    return newCommands;
}

// 1069240
// 1296937
// 1338782

// 2948823
pipe(
    './7/7t.txt',
    fetchData,
    parseData,
    // map((s: string) => s.split(' ').map(tryParse)),
    filter((s: string) => !(s.startsWith('$ ls') || s.startsWith('dir'))
    ),
    (commands) => {
        const grop = group(commands);
        const node = toNode(grop, null);
        const nodes = mapNodes(node);
        const list = filterNodes(nodes);
        console.log(list)
        // return list.reduce((a, c) => a + c.totalSize, 0);

    },
    log,
);

