export const useBoardContext = () => {
    const route = useRoute();
    const boardStore = useBoardStore();
    const boardCode = computed(() => route.params.board as string);

    const board = computed(() => {
        const code = boardCode.value;
        return code ? boardStore.getBoard(code) : null;
    });
    return {board: readonly(board)};
}

export const useThreadCardList = () => {
    const {board} = useBoardContext();
    const threadStore = useThreadStore();

    const {data: threadCardData, refresh: threadCardRefresh} = useAsyncData(
        () => `threads-${board.value?.code}`,
        () => {
            if (!board.value?.code) return [];
            return threadStore.fetchThreads(board.value.code);
        },
        {watch: [board]}
    );

    return {threadCardData, threadCardRefresh};
}