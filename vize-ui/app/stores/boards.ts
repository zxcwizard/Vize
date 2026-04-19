import type {Board} from "~/types/data";
import {defineStore} from "pinia";

export const useBoardStore = defineStore('boardList', {
    state: () => ({
        boards: [] as Board[],
    }),

    getters: {
        boardExists: (state) => {
            return (boardCode: string) => state.boards.some(b => b.code === boardCode)
        },
        getBoards: (state) => {
            return () => state.boards;
        },
        getBoard: (state) => {
            return (boardCode: string): Board | undefined => {
                return state.boards.find(b => b.code === boardCode);
            }
        }
    },

    actions: {
        async fetchBoards() {
            if (this.boards.length) return
            try {
                this.boards = await $fetch<Board[]>(`/api/boards`) || [];
            } catch (error) {
                console.error('Failed to init boards', error)
            }
        }
    }
})