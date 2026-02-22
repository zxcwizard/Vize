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
            return (boardCode: string): Board => {
                const board = state.boards.find(b => b.code === boardCode)
                if(!board) throw new Error(`[BoardStore]: Board with code "${boardCode}" not found.`)
                return board;
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