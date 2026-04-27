export interface Board {
    code: string;
    name: string;
}

export interface Post {
    id: number;
    comment: string;
    createdAt: string;
    repliesFrom: number[];
}

export interface CreatePost {
    board: string;
    threadId: number;
    comment: string;
    repliesTo: number[];
}

export interface Thread {
    id: number;
    name: string;
    posts: Post[];
}

export interface OpPost {
    id: number;
    comment: string;
    name: string
    createdAt: string;
    repliesFrom: number[];
}