import {useBoardContext} from "./useBoardContext";

export const useThreadContext = async () => {
    const route = useRoute();
    const threadStore = useThreadStore();

    const currentThreadId = computed(() => Number(route.params.id as string));
    const {board} = useBoardContext();

    const {data: threadData, refresh: threadRefresh, error} = await useAsyncData(
        () => `thread-${board.value.code}-${currentThreadId.value}`,
        () => threadStore.fetchThread(board.value.code, currentThreadId.value),
        {watch: [board, currentThreadId]}
    );
    if (error.value) {
        const err = error.value;

        const errorMessages: Record<number, string> = {
            401: 'You must be logged in to view this thread.',
            403: 'You do not have permission to view this board.',
            404: 'The thread you are looking for does not exist or has been removed.'
        };

        throw showError({
            status: err.status ?? 500,
            statusText: err.statusText ?? 'Error',
            message: errorMessages[err.status!] ?? err.message,
            fatal: true
        });
    }
    const op = computed(() => threadStore.getOpPost(board.value.code, currentThreadId.value));

    const replies = computed(() => {
        return threadData.value?.posts ? threadData.value.posts.slice(1) : [];
    });
    return {board, currentThreadId, op, replies, threadRefresh};
}