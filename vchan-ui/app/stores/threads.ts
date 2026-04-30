import {defineStore} from 'pinia';
import type {CreatePost, OpPost, Post, Thread} from "~/types/data";
import type {Board} from "~/types/boards";
import {FetchError} from 'ofetch';

export const useThreadStore = defineStore('threads', {
    state: () => ({
        threadsByBoard: {} as Record<Board, Record<number, Thread>>,
        error: {} as Record<Board, string | null>,
    }),

    getters: {
        isEmpty: (state) => (board: Board) => {
            const boardData = state.threadsByBoard[board];
            return boardData == null || Object.keys(boardData).length === 0;
        },

        getThread: (state) => (board: Board, threadId: number) => {
            return state.threadsByBoard[board]?.[threadId];
        },

        getThreads: (state) => (board: Board) => {
            const threads = state.threadsByBoard[board];
            if (!threads) return [];

            return Object.values(threads).sort((a, b) => b.id - a.id);
        },

        getReplies: (state) => (board: Board, threadId: number) => {
            const thread = state.threadsByBoard[board]?.[threadId];
            return thread ? thread.posts.slice(1) : [];
        },

        getOpPost: (state) => (board: Board, threadId: number): OpPost | null => {
            const boardThreads = state.threadsByBoard[board];
            if (!boardThreads || !boardThreads[threadId]) return null;

            const thread = boardThreads[threadId];
            const firstPost = thread.posts[0];

            if (!firstPost) return null;

            return {
                id: thread.id,
                comment: firstPost.comment,
                createdAt: firstPost.createdAt,
                name: thread.name,
                repliesFrom: firstPost.repliesFrom
            };
        }
    },

    actions: {
        async fetchThreads(board: Board) {
            const config = useRuntimeConfig();
            const baseURL = import.meta.server ? config.apiInternalUrl : config.public.apiBase;

            try {
                const data = await $fetch<Thread[]>(`/threads/${board}`, {baseURL});
                const normalized: Record<number, Thread> = {};
                data.forEach(t => {
                    normalized[t.id] = t;
                });

                this.threadsByBoard[board] = normalized;
                return data;
            } catch (err: unknown) {
                if (err instanceof FetchError) {
                    throw createError({
                        statusCode: err.status || 500,
                        statusMessage: err.statusText || 'Internal Server Error',
                        message: err.data?.message || 'An unexpected error occurred',
                        fatal: true
                    });
                }
                throw createError({statusCode: 500, message: 'App Crash', fatal: true});
            }
        },

        async fetchThread(board: Board, threadId: number) {
            const config = useRuntimeConfig();
            const baseURL = import.meta.server ? config.apiInternalUrl : config.public.apiBase;

            try {
                const data = await $fetch<Thread>(`/threads/${board}/${threadId}`, {baseURL});
                this.$patch((state) => {
                    if (!state.threadsByBoard[board]) {
                        state.threadsByBoard[board] = {};
                    }
                    state.threadsByBoard[board]![threadId] = data;
                });
                return data;
            } catch (err: unknown) {
                if (err instanceof FetchError) {
                    throw createError({
                        statusCode: err.status || 500,
                        statusMessage: err.statusText || 'Internal Server Error',
                        message: err.data?.message || 'An unexpected error occurred',
                        fatal: true
                    });
                }
                throw createError({statusCode: 500, message: 'App Crash', fatal: true});
            }
        },

        async createPost(createPost: CreatePost) {
            const config = useRuntimeConfig();
            const baseURL = import.meta.server ? config.apiInternalUrl : config.public.apiBase;

            try {
                const createdPost = await $fetch<Post>(`/posts`, {
                    method: 'POST',
                    credentials: 'include',
                    body: createPost,
                    baseURL: baseURL
                });

                const boardThreads = this.threadsByBoard[createPost.board];
                if (boardThreads) {
                    const thread = boardThreads[createPost.threadId];
                    if (thread) {
                        thread.posts.forEach(post => {
                            const match = createPost.repliesTo.find(replyId => replyId === post.id);
                            if (match) post.repliesFrom.push(createdPost.id);
                        });
                        thread.posts.push(createdPost);
                    }
                }
            } catch (err: unknown) {
                if (err instanceof FetchError) {
                    throw createError({
                        statusCode: err.status || 500,
                        statusMessage: err.statusText || 'Internal Server Error',
                        message: err.data?.message || 'An unexpected error occurred',
                        fatal: true
                    });
                }
                throw createError({statusCode: 500, message: 'App Crash', fatal: true});
            }
        }
    }
});