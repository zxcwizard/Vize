export default defineNuxtRouteMiddleware(async (to) => {
    const store = useBoardStore()
    await store.fetchBoards()
    const boardParam: string = to.params.board as string

    if (!store.boardExists(boardParam)) {
        return abortNavigation({
            status: 404,
            message: `The board "${boardParam}" does not exist.`
        })
    }
})