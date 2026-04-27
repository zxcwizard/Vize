import {useBoardContext} from "./useBoardContext";

export const useThreadContext = () => {
    const route = useRoute();
    const threadStore = useThreadStore();

    const currentThreadId = computed(() => Number(route.params.id as string));
    const {board} = useBoardContext();

    const {data: threadData, refresh: threadRefresh} = useAsyncData(
        () => `thread-${board.value.code}-${currentThreadId.value}`,
        () => threadStore.fetchThread(board.value.code, currentThreadId.value),
        {watch: [board, currentThreadId]}
    )
    const op = computed(() => threadStore.getOpPost(board.value.code, currentThreadId.value));
    const replies = computed(() => {return threadData.value?.posts ? threadData.value.posts.slice(1) : []})

    return {board, currentThreadId, op, replies, threadRefresh}
}