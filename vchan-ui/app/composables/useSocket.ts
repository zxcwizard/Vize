import type {RoomKey, WsMessage} from '@/types/socket'
import type {Board} from '@/types/boards'

const socket = ref<WebSocket | null>(null);
const subscriptions = ref(new Set<string>());
const messages = ref<Record<number, string[]>>({});

export const useSocketGateway = () => {
    const _connect = () => {
        return new Promise<void>((resolve, reject) => {
            if (socket.value && socket.value.readyState === WebSocket.OPEN) return resolve();
            console.log("Initializing Gateway Connection...");
            const ws = new WebSocket("ws://vchan/worker/ws");

            ws.onopen = () => {
                socket.value = ws;
                console.log("Gateway Connected");
                resolve();
            };
            ws.onmessage = (event) => {
                try {
                    const msg: WsMessage = JSON.parse(event.data);
                    switch (msg.type) {
                        case 'Notification': {
                            const threadId = msg.data.thread;
                            const currentMessages = messages.value[threadId] || [];
                            messages.value[threadId] = [...currentMessages, msg.data.payload];
                            break;
                        }
                        default:
                            console.log("Received other message type:", msg.type)
                    }
                } catch (e) {
                    console.error("Failed to parse message from Rust:", event.data);
                    console.error(e);
                }
            };
            ws.onclose = () => {
                socket.value = null;
                subscriptions.value.clear();
                console.log("Gateway Disconnected");
            };
            ws.onerror = (err) => {
                console.error("Gateway Error:", err);
                reject(err);
            };
        });
    };


    const isSubscribed = (boardCode: string, threadId: number) => {
        return subscriptions.value.has(`${boardCode}:${threadId}`);
    }

    const toggleThread = async (board: Board, threadId: number) => {
        const key: RoomKey = {board: board, thread: threadId};
        const subKey = `${board}:${threadId}`;
        if (!socket.value || socket.value.readyState !== WebSocket.OPEN) {
            await _connect();
        }
        if (!socket.value || socket.value.readyState !== WebSocket.OPEN) {
            console.error("WebSocket is not connected. Operation aborted.");
            return;
        }

        if (subscriptions.value.has(subKey)) {
            socket.value.send(JSON.stringify({
                type: "Unsubscribe",
                data: key
            }));
            subscriptions.value.delete(subKey);
            console.log(`Left thread: ${subKey}`);
        } else {
            socket.value.send(JSON.stringify({
                type: "Subscribe",
                data: key
            }));
            subscriptions.value.add(subKey);
            console.log(`Joined thread: ${subKey}`);
        }
    };

    const notify = async (board: Board, threadId: number, message: string) => {
        if (!socket.value || socket.value.readyState !== WebSocket.OPEN) {
            await _connect();
        }

        if (!socket.value || socket.value.readyState !== WebSocket.OPEN) {
            console.error("Could not send notification: WebSocket unavailable.");
            return;
        }

        const event: WsMessage = {
            type: 'Notification',
            data: {
                board: board,
                thread: threadId,
                payload: message
            },
        };
        socket.value.send(JSON.stringify(event));
        console.log("Announcement sent to Rust worker:", message);
    };
    return {toggleThread, isSubscribed, notify, messages, subscriptions};
};