import { reduce } from "powerseq";
import { fetchData, flatMap, log, parseData, pipe } from "../utils";

interface Obj<T> {
    [x: string]: Obj<T> | T;
}

const setNestedProp = <T>(obj: Obj<T>, props: string[], value: T, sv = obj, [prop, ...restProps] = props) =>
    props.length > 1 ?
        setNestedProp(prop in obj ? obj[prop] : (obj[prop] = {} as any, obj[prop] as any), restProps, value, sv)
        : (obj[prop] = value, sv);

const getNestedProp = <T>(obj, prop: string): T =>
    prop in obj ? obj[prop] :
        Object.keys(obj)
            .filter(p => typeof obj[p] === 'object')
            .reduce((_, c) => getNestedProp(obj[c], prop) || void 0, void 0);

const mapToDirectoriesWithSizes = dictionary => {
    const newDict = { size: 0, totalSize: 0 };
    for (let name of Object.keys(dictionary)) {
        if (typeof dictionary[name] === 'number')
            newDict.size = newDict.size + dictionary[name];
        else {
            newDict[name] = mapToDirectoriesWithSizes(dictionary[name]);
        }
    }
    const { size, totalSize, ...dictionaryRest } = newDict;
    newDict.totalSize = size + Object.keys(dictionaryRest).reduce((a, key) => {
        const { size, totalSize, ...d } = dictionaryRest as any;
        if (Object.keys(d).length) {
            return a + dictionaryRest[key].totalSize;
        }
        return a + dictionaryRest[key].size;
    }, 0);
    return newDict;
};

const switchCase = (s: string, ...cbs: ((s: string) => [boolean, any])[]) => {
    let last = [null, null];
    for (let caseN of cbs) {
        const [r1, r2] = last = caseN(s);
        if (r1) return r2;
    }
    return last;
}

const addFile = (directory, path: string[], [size, fileName]: string[]) => {
    const newPath = [...path, fileName];
    return setNestedProp(directory, newPath, Number.parseInt(size));
}

const addDirectory = (directory, path: string[], dirName: string) => {
    const newPath = [...path, dirName];
    return setNestedProp(directory, newPath, {});
}

const execCommand = (command: string, path: string[], directory: any) =>
    switchCase(command,
        s => [s === '$ cd /', [["/"], directory]], // go to start
        s => [s === '$ cd ..', [path.slice(0, -1), directory]], // go up
        s => [s === '$ ls', [path, directory]],
        (s, commandSplitted = s.split(' ')) => [/^\$ cd [a-zA-Z.]+$/.test(s), [[...path, commandSplitted.at(-1)], directory]], // go to directory
        (s, commandSplitted = s.split(' ')) => [/^dir [a-zA-Z.]+$/.test(s), [path, addDirectory(directory, path, commandSplitted.at(-1))]], // is directory
        (s, commandSplitted = s.split(' ')) => [/^[0-9]+ [a-zA-Z.]+$/.test(s), [path, addFile(directory, path, commandSplitted)]], // is file
        _ => { throw new Error('not known command') }
    );

const execCommands = (path: string[], directories: any) => (commands: string[]) => {
    const [firstCommand, ...restCommands] = commands;

    if (commands.length > 0) {
        const [newPath, newDirectories] = execCommand(firstCommand, path, directories);
        return execCommands(newPath, newDirectories)(restCommands);
    }
    else {
        return directories
    }
};
const filterNodes = (node, list = []) => {
    if (node.totalSize < 100000)
        list.push(node);

    const { size, totalSize, ...directories } = node;
    let dirs = Object.keys(directories).map(key => node[key]);

    while (dirs.length) {
        for (let n of dirs) {
            if (n.totalSize < 100000)
                if (!list.includes(n)) {
                    list.push(n);
                }
        }
        dirs = dirs.flatMap(d => {
            const { size2, totalSize2, ...directories2 } = d;
            return Object.keys(directories2).map(key2 => d[key2]);
        });
    }

    return list;
}

//* 1453349
pipe(
    './7/7p.txt',
    fetchData,
    parseData,
    execCommands(['/'], { '/': {} }),
    mapToDirectoriesWithSizes,
    filterNodes,
    reduce((a, d: any) => a + d.totalSize, 0),
    log
);

const treeToFlatObj = (tree, name = "_", dirs = []) => {
    const { size, totalSize, ...nodes } = tree;
    dirs.push({ [name]: totalSize });
    return dirs.concat(Object.keys(nodes).reduce((acc, cur) => [...acc, ...treeToFlatObj(nodes[cur], cur, dirs)], []));
}

//** 2948823
pipe(
    './7/7p.txt',
    fetchData,
    parseData,
    execCommands(['/'], { '/': {} }),
    mapToDirectoriesWithSizes,
    treeToFlatObj,
    flatMap(Object.values),
    (sizes: number[]) => {
        const diskLoad = Math.max(...sizes);
        const diskSpaceFree = 70000000 - diskLoad;
        const neededSpace = 30000000 - diskSpaceFree;
        const dir = sizes.filter(s => s >= neededSpace);
        return Math.min(...dir);
    },
    log
);

// disk space = 70000000
// nedded free space > 30000000
// my disk space = 48381165
//  space free =  70000000 - 48381165 = 21618835
// but nedded is 30000000 > 21618835
// which meeans needed to free is 30000000 - 21618835 = 8381165
// 3252529 too high
// 3742 too low
