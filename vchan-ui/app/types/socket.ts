import type {Board} from './boards';

export interface RoomKey {
    board: Board;
    thread: number;
}

export type WsMessage =
    | { type: 'Subscribe', data: RoomKey }
    | { type: 'Unsubscribe', data: RoomKey }
    | { type: 'KillThread', data: RoomKey }
    | { type: 'Notification', data: NotificationPayload };

interface NotificationPayload {
    board: Board;
    thread: number;
    payload: string;
}