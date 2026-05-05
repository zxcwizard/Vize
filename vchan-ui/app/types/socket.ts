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

export interface NotificationPayload {
    board: Board;
    new_post: number;
    thread: number;
    payload: string;
}