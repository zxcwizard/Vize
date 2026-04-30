export enum Board {
    POL = 'pol',
    BIZ = 'biz',
    MU = 'mu',
    TECH = 'tech',
    G = 'g',
    TEST = 'test'
}

export interface BoardMetadata {
    code: Board;
    name: string;
    description: string;
    nsfw: boolean;
}

export const BOARD_MAP: Record<Board, BoardMetadata> = {
    [Board.POL]: { code: Board.POL, name: 'Politics', description: 'News and debate', nsfw: false },
    [Board.BIZ]: { code: Board.BIZ, name: 'Business', description: 'Finance and crypto', nsfw: false },
    [Board.MU]:  { code: Board.MU,  name: 'Music',    description: 'Discoveries',     nsfw: false },
    [Board.TECH]:{ code: Board.TECH, name: 'Technology',description: 'Hardware and dev', nsfw: false },
    [Board.G]:   { code: Board.G,   name: 'General',   description: 'Random thoughts',  nsfw: false },
    [Board.TEST]:{ code: Board.TEST, name: 'Testing',   description: 'Escape board',    nsfw: true },
};

export const toBoard = (value: string): Board | null => {
    const normalized = value.toLowerCase();
    if (Object.values(Board).includes(normalized as Board)) {
        return normalized as Board;
    }
    return null;
};