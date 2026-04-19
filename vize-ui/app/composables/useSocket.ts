const socket = ref<WebSocket | null>(null);
const subscriptions = ref(new Set<number>());
const messages = ref<Record<number, string[]>>({});

export const useSocketGateway = () => {
    const _connect = () => {
        return new Promise<void>((resolve, reject) => {
            if (socket.value && socket.value.readyState === WebSocket.OPEN) return resolve();
            console.log("Initializing Gateway Connection...");
            const ws = new WebSocket("ws://127.0.0.1:4000/ws");

            ws.onopen = () => {
                socket.value = ws;
                console.log("Gateway Connected");
                resolve();
            };
            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (!messages.value[data.threadId]) messages.value[data.threadId] = [];
                    messages.value[data.threadId].push(data.text);
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


    const isSubscribed = (threadId: number) => subscriptions.value.has(threadId);

    const toggleThread = async (threadId: number) => {
        if (!socket.value || socket.value.readyState !== WebSocket.OPEN) {
            await _connect();
        }

        if (subscriptions.value.has(threadId)) {
            socket.value.send(JSON.stringify({
                action: "unsub",
                threadId: threadId
            }));
            subscriptions.value.delete(threadId);
            console.log(`Left thread ${threadId}`);
        } else {
            socket.value.send(JSON.stringify({
                action: "sub",
                threadId: threadId
            }));
            subscriptions.value.add(threadId);
            console.log(`Joined thread ${threadId}`);
        }
    };

    return {toggleThread, isSubscribed, messages, subscriptions};
};