import type {Board, BoardMetadata} from "~/types/boards";

export const useBoardContext = () => {
    const route = useRoute();
    const boardStore = useBoardStore();
    const boardCode = route.params.board as string;

    const code = boardCode.toLowerCase();
    if (!boardStore.boardExists(code)) {
        throw createError({
            statusCode: 404,
            statusMessage: `Board "/${code}/" does not exist.`,
            fatal: true
        });
    }

    const board = computed((): BoardMetadata => {
        return boardStore.getBoard(code as Board);
    });
    return {board: readonly(board)};
}

export const useThreadCardList = async () => {
    const {board} = useBoardContext();
    const threadStore = useThreadStore();

    const {data: threadCardData, refresh: threadCardRefresh, error} = await useAsyncData(
        `threads-${board.value.code}`,
        async () => {
            return await threadStore.fetchThreads(board.value.code as Board);
        },
        {
            watch: [() => board.value.code], immediate: !!board.value.code
        }
    );

    if (error.value) {
        throw showError({
            status: error.value.status ?? 500,
            message: error.value.message || 'Failed to load threads.',
            fatal: true
        });
    }
    return {threadCardData, threadCardRefresh};
}