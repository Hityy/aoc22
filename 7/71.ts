import { fetchData, filter, log, parseData, pipe } from "../utils";


interface Dir {
    name: string;
    files: number[];
    directories: Dir[];
    parent: Dir;
    size: number;
    totalSize: number;
    incrementSize: any;
}

const makeDirectory = (commands: string[], root: Dir, current: Dir = null, command: string = commands[0]) => {
    if (!command) return root;
    if (command.includes('$ cd ..')) {
        return makeDirectory(commands.slice(1), root, current.parent);
    }
    if (command.includes('$ cd')) {
        const dir: Dir = {
            name: command.slice(-1),
            files: [],
            directories: [],
            parent: current,
            size: 0,
            totalSize: 0,
            incrementSize: (size) => {
                dir.totalSize = dir.totalSize + size;
                if (dir.parent)
                    dir.parent.incrementSize(size);
            }
        };
        const hasDir = current.directories.find(d => d.name === dir.name);
        if (hasDir)
            return makeDirectory(commands.slice(1), root, hasDir);
        else {
            current.directories.push(dir);
            return makeDirectory(commands.slice(1), root, dir);
        }

    }
    const fileSize = command.split(' ').map(s => Number.parseInt(s))[0];
    current.files.push(fileSize);
    current.incrementSize(fileSize);

    return makeDirectory(commands.slice(1), root, current);
}

// const calculateTotalSize = (node: Dir): Dir => {
//     if (node.directories.length === 0) {
//         node.totalSize = node.size;
//         return node;
//     }

//     node.totalSize = node.size + node.directories.map(c => calculateTotalSize(c)).reduce((a, c) => a + c.totalSize, 0)
//     return node;
// }

const filterNodes = (node: Dir, list = []) => {


    if (node.totalSize < 100000)
        list.push(node);

    let dirs = node.directories;

    // console.log(dirs);
    while (dirs.length) {
        for (let n of dirs) {
            if (n.totalSize < 100000)
                if (!list.includes(n)) {
                    list.push(n);
                }
        }
        dirs = dirs.flatMap(d => d.directories);
        // console.log(dirs);
    }

    return list;
}
// *
pipe(
    './7/7p.txt',
    fetchData,
    parseData,
    filter((c: string) => !(c.includes("$ ls") || c.includes('dir '))),
    (commands: string[]) => {
        const root: Dir = {
            name: '/',
            files: [],
            directories: [],
            parent: null,
            size: 0,
            totalSize: 0,
            incrementSize: (size) => {
                root.totalSize += size;
            }
        }
        const commandsAll = commands.slice(1);
        const fileSystem = makeDirectory(commandsAll, root, root);
        // console.log(fileSystem)
        // const fs = calculateTotalSize(fileSystem)
        const list = filterNodes(fileSystem);

        return list.reduce((a, c) => a + c.totalSize, 0);
    },
    log
);