
export function makeRng(seedStr: any) {
    let str = '';
    if (typeof seedStr === 'string') str = seedStr;
    else if (seedStr !== null && seedStr !== undefined) str = String(seedStr);

    let seed = 0
    for (let i = 0; i < str.length; i++) seed = (seed + str.charCodeAt(i)) >>> 0
    return function rng() {
        seed = (seed * 1664525 + 1013904223) >>> 0
        return seed / 0xffffffff
    }
}

export function pick<T>(arr: T[], rng: any = Math.random) {
    if (!Array.isArray(arr) || arr.length === 0) return undefined;
    const rndFunc = typeof rng === 'function' ? rng : (typeof rng === 'string' ? makeRng(rng) : Math.random);
    return arr[Math.floor(rndFunc() * arr.length)]
}

export function pickNUnique<T>(arr: T[], n: number, rng: any = Math.random): T[] {
    if (!Array.isArray(arr)) return [];
    const rndFunc = typeof rng === 'function' ? rng : (typeof rng === 'string' ? makeRng(rng) : Math.random);
    const pool = arr.slice()
    const out: T[] = []
    while (out.length < Math.min(n, pool.length)) {
        const idx = Math.floor(rndFunc() * pool.length)
        out.push(pool.splice(idx, 1)[0])
    }
    return out
}

export function shuffleArray<T>(arr: T[], rngOrSeed: any = Math.random): T[] {
    if (!Array.isArray(arr)) return [];

    // Auto-detect compatibility fix: If second arg is string, treat as seed
    const rng = typeof rngOrSeed === 'function' ? rngOrSeed :
        (typeof rngOrSeed === 'string' ? makeRng(rngOrSeed) : Math.random);

    const newArr = [...arr]; // Copy to avoid mutating original if unexpected
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1))
        const tmp = newArr[i]
        newArr[i] = newArr[j]
        newArr[j] = tmp
    }
    return newArr
}

export function buildWords(theme: string, age: string): string[] {
    if (theme === 'sight') {
        return age === 'k2'
            ? ['THE', 'AND', 'IS', 'YOU', 'ARE', 'IT', 'IN', 'TO', 'WE', 'GO']
            : age === '25' || age === '35'
                ? ['THIS', 'THAT', 'WHEN', 'YOUR', 'WHICH', 'WHERE', 'THEIR', 'COULD', 'WOULD', 'SHOULD']
                : ['BECAUSE', 'THROUGH', 'BEFORE', 'BETWEEN', 'AROUND', 'ANOTHER', 'ALREADY', 'THOUGHT', 'ENOUGH', 'FAMILY']
    }
    if (theme === 'space') {
        return age === 'k2'
            ? ['MOON', 'STAR', 'SKY', 'SUN', 'ROCK', 'DUST', 'SHIP', 'RING']
            : age === '25' || age === '35'
                ? ['MARS', 'COMET', 'ORBIT', 'ROVER', 'VENUS', 'SATURN', 'PLUTO', 'CRATER']
                : ['NEBULA', 'GALAXY', 'ROCKET', 'ASTRO', 'QUASAR', 'ECLIPSE', 'METEOR', 'COSMOS']
    }
    // animals
    return age === 'k2'
        ? ['CAT', 'DOG', 'OWL', 'PIG', 'ANT', 'FOX', 'BEE', 'COW', 'BAT', 'HEN']
        : age === '25' || age === '35'
            ? ['HORSE', 'TIGER', 'EAGLE', 'WHALE', 'MOUSE', 'OTTER', 'CAMEL', 'ZEBRA', 'GORILLA']
            : ['LLAMA', 'ORCA', 'PANDA', 'LYNX', 'HYENA', 'JAGUAR', 'RHINO', 'DOLPHIN', 'BUFFALO']
}
