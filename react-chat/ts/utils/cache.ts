const cache = new Map<string, string>();

export const cacheResult = {
    get(key: string): string | undefined {
        const result = cache.get(key);
        console.log(`Cache get: key=${key}, value=${result}`);
        return cache.get(key);
    },
    set(key: string, value: string): void {
        console.log(`Cache set: key=${key}, value=${value}`);
        cache.set(key, value);
    },
};
