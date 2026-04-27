export enum Board {
    Pol = 'pol',
    Biz = 'biz',
    Mu = 'mu',
    Tech = 'tech',
    G = 'g',
    Test = 'test'
}

export const toBoard = (value: string): Board | null => {
    const normalized = value.toLowerCase();
    if (Object.values(Board).includes(normalized as Board)) {
        return normalized as Board;
    }
    return null;
};