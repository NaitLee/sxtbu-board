import { IS_BROWSER } from "$fresh/runtime.ts";

function parse_args(line: string) {
    if (line[0] === '#') return [];
    const args = [];
    let p = 0;
    let q = 0;
    let s = false;
    while (p < line.length) {
        if (line[p] === ' ' && !s) {
            args.push(line.slice(q, p));
            q = p + 1;
        } else if (line[p] === '"') {
            if (s) {
                args.push(line.slice(q, p - 1))
                q = p + 1;
            }
            s = !s;
        }
        p += 1;
    }
    if (q !== p)
        args.push(line.slice(q));
    return args;
}

class Thing extends Array {
    constructor(init: string[]) {
        super();
        this.push(...init);
    }
    bool() { return ['1', 'true', 'yes'].includes(this[0].toLowerCase()) };
    int() { return parseInt(this[0]); };
    float() { return parseFloat(this[0]); };
    string() { return this.join(' '); };
    intList() { return this.map(parseInt); };
    floatList() { return this.map(parseFloat); };
    list() { return this; };
};

export async function getConfig(): Promise<Record<string, Thing>> {
    const all = (
        IS_BROWSER
        ? await fetch('config.txt').then(r => r.text())
        : await Deno.readTextFile('static/config.txt')
    ).split(/\r?\n/);
    const config: Record<string, string[]> = {};
    for (const line of all) {
        const args = parse_args(line);
        if (args.length !== 0)
            config[args[0]] = new Thing(args.slice(1));
    }
    //@ts-ignore:
    return config;
}
