const socket = ref<WebSocket | null>(null);
const subscriptions = ref(new Set<string>());
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


    const isSubscribed = (boardCode: string, threadId: number) =>
        subscriptions.value.has(`${boardCode}:${threadId}`);

    const toggleThread = async (boardCode: string, threadId: number) => {
        const key: string = `${boardCode}:${threadId}`;
        if (!socket.value || socket.value.readyState !== WebSocket.OPEN) {
            await _connect();
        }

        if (subscriptions.value.has(key)) {
            socket.value.send(JSON.stringify({
                action: "unsub",
                key: key
            }));
            subscriptions.value.delete(key);
            console.log(`Left thread ${key}`);
        } else {
            socket.value.send(JSON.stringify({
                action: "sub",
                key: key
            }));
            subscriptions.value.add(key);
            console.log(`Joined thread ${key}`);
        }
    };

    return {toggleThread, isSubscribed, messages, subscriptions};
};