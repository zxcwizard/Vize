import {defineStore} from "pinia";
import type {Board, BoardMetadata} from "~/types/boards";
import {BOARD_MAP} from "~/types/boards";

export const useBoardStore = defineStore('boardList', {
    state: () => ({
        boardMap: BOARD_MAP
    }),

    getters: {
        allBoards: (state): BoardMetadata[] => Object.values(state.boardMap),
        boardExists: (state) => {
            return (code: string) => code in state.boardMap;
        },
        getBoard: (state) => {
            return (code: Board): BoardMetadata => state.boardMap[code];
        }
    }
});