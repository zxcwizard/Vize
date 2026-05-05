import {defineStore} from 'pinia'
import type {NotificationPayload} from "~/types/socket";

export type NotificationType = 'reply' | 'thread_update'

export const useNotificationStore = defineStore('notifications', {
    state: () => ({
        messages: [] as NotificationPayload[]
    }),
    getters: {
        getMessages: state => {
            return state.messages;
        },
        hasNotifications: state => {
            return state.messages.length > 0
        }
    },
    actions: {
        addNotification(message: NotificationPayload) {
            this.messages.push(message)
        }
    }
})