
export function makeRng(seedStr: string) {
    let seed = 0
    for (let i = 0; i < seedStr.length; i++) seed = (seed + seedStr.charCodeAt(i)) >>> 0
    return function rng() {
        seed = (seed * 1664525 + 1013904223) >>> 0
        return seed / 0xffffffff
    }
}

export function pick<T>(arr: T[], rng: () => number) { return arr[Math.floor(rng() * arr.length)] }

export function pickNUnique<T>(arr: T[], n: number, rng: () => number): T[] {
    const pool = arr.slice()
    const out: T[] = []
    while (out.length < Math.min(n, pool.length)) {
        const idx = Math.floor(rng() * pool.length)
        out.push(pool.splice(idx, 1)[0])
    }
    return out
}

export function shuffleArray<T>(arr: T[], rng: () => number): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1))
        const tmp = arr[i]
        arr[i] = arr[j]
        arr[j] = tmp
    }
    return arr
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
