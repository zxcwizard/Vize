import {defineStore} from 'pinia';
import type {CreatePost, OpPost, Post, Thread} from "~/types/data";

export const useThreadStore = defineStore('threads', {
    state: () => ({
        threadsByBoard: {} as Record<string, Record<number, Thread>>,
        error: {} as Record<string, string | null>,
    }),
    getters: {
        isEmpty: (state) => (boardCode: string) => {
            return state.threadsByBoard[boardCode] == null || Object.keys(state.threadsByBoard[boardCode]).length == 0
        },

        getThread: (state) => (boardCode: string, threadId: number) => {
            return state.threadsByBoard[boardCode]?.[threadId];
        },

        getThreads: (state) => (boardCode: string) => {
            const threads = state.threadsByBoard[boardCode];
            if (!threads) return [];

            return Object.values(threads).sort((a, b) => {
                return b.id - a.id;
            });
        },

        getReplies: (state) => (boardCode: string, threadId: number) => {
            const thread = state.threadsByBoard[boardCode]?.[threadId];
            return thread ? thread.posts.slice(1) : []
        },

        getOpPost: (state) => (boardCode: string, threadId: number): OpPost => {
            if (!state.threadsByBoard[boardCode] || !state.threadsByBoard[boardCode][threadId])
                throw Error(`Failed to fetch thread for [${boardCode} ${threadId}]`)
            const thread = state.threadsByBoard[boardCode][threadId]
            const firstPost = thread.posts[0]
            if (!firstPost)
                throw Error(`Failed to fetch OP post for [${boardCode} ${threadId}]`)

            return {
                id: thread.id,
                comment: firstPost.comment,
                createdAt: firstPost.createdAt,
                name: thread.name,
                repliesFrom: firstPost.repliesFrom
            }
        }
    },

    actions: {
        async fetchThreads(boardCode: string) {
            try {
                const data = await $fetch<Thread[]>(`/api/threads/${boardCode}`)
                const normalized: Record<number, Thread> = {};
                data.forEach(t => {
                    normalized[t.id] = t;
                });

                this.threadsByBoard[boardCode] = normalized;
                return data;
            } catch (err: unknown) {
                this.error[boardCode] = err instanceof Error ? err.message : 'An unknown error occurred';
                throw err;
            }
        },

        async fetchThread(boardCode: string, threadId: number) {
            try {
                const data = await $fetch<Thread>(`/api/threads/${boardCode}/${threadId}`)
                this.$patch((state) => {
                    if (!state.threadsByBoard[boardCode]) state.threadsByBoard[boardCode] = {}
                    state.threadsByBoard[boardCode][threadId] = data
                })
                return data;
            } catch (err: unknown) {
                this.error[boardCode] = err instanceof Error ? err.message : 'An unknown error occurred';
                throw err;
            }
        },

        async createPost(createPost: CreatePost) {
            try {
                const createdPost = await $fetch<Post>(`/api/posts`, {
                    method: 'POST',
                    credentials: 'include',
                    body: createPost
                })
                const boardThreads = this.threadsByBoard[createPost.board]
                if (boardThreads) {
                    const thread = boardThreads[createPost.threadId]
                    if (thread) {
                        thread.posts.forEach(post => {
                            const match = createPost.repliesTo.find(replyId => replyId === post.id)
                            if (match) post.repliesFrom.push(createdPost.id)
                        })
                        thread.posts.push(createdPost)
                    }
                }
            } catch (error) {
                console.error('Post failed:', error)
                throw error
            }
        }
    }
})