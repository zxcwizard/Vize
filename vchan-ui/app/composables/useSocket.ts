import type {RoomKey, WsMessage} from '@/types/socket'
import {type Board, toBoard} from '@/types/boards'

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
                        case 'Notification':
                            const threadId = msg.data.thread;
                            const currentMessages = messages.value[threadId] || [];
                            messages.value[threadId] = [...currentMessages, msg.data.payload];
                            break;
                        case 'SystemError':
                            alert(`Error ${msg.data.code}: ${msg.data.detail}`)
                            break;
                        default:
                            console.log("Received other message type:", msg.type)
                    }
                } catch (e) {
                    console.error("Failed to parse message from Rust:", event.data);
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
        subscriptions.value.has(`${boardCode}:${threadId}`);
    }

    const toggleThread = async (boardCode: string, threadId: number) => {
        const board: Board = toBoard(boardCode);
        const key: RoomKey = {board: board, thread: threadId}
        if (!socket.value || socket.value.readyState !== WebSocket.OPEN) {
            await _connect();
        }

        if (subscriptions.value.has(`${boardCode}:${threadId}`)) {
            socket.value.send(JSON.stringify({
                type: "Unsubscribe",
                data: key
            }));
            subscriptions.value.delete(`${boardCode}:${threadId}`);
            console.log(`Left thread ${key}`);
        } else {
            socket.value.send(JSON.stringify({
                type: "Subscribe",
                data: key
            }));
            subscriptions.value.add(`${boardCode}:${threadId}`);
            console.log(`Joined thread ${key}`);
        }
    };

    const notify = async (boardCode: string, threadId: number, message: string) => {
        if (!socket.value || socket.value.readyState !== WebSocket.OPEN) {
            await _connect();
        }
        const event: WsMessage = {
            type: 'Notification',
            data: {
                board: toBoard(boardCode),
                thread: threadId,
                payload: message
            },
        };

        socket.value.send(JSON.stringify(event));
        console.log("Announcement sent to Rust worker:", message);
    };
    return {toggleThread, isSubscribed, notify, messages, subscriptions};
};