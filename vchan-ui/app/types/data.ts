import type {Board} from "~/types/boards";

export interface Post {
    id: number;
    comment: string;
    createdAt: string;
    repliesFrom: number[];
}

export interface CreatePost {
    board: Board;
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
    post: Post;
    name: string;
}