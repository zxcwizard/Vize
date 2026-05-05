<script setup lang="ts">
import type { NotificationPayload } from "~/types/socket"
import { Board } from "~/types/boards"

const store = useNotificationStore()

if (store.messages.length === 0) {
  store.messages.push({
    board: Board.POL,
    thread: 2026,
    new_post: 12,
    payload: "This is a green notification message!"
  })
}

const getPostLink = (msg: NotificationPayload) => `/${msg.board}/threads/${msg.thread}#p${msg.new_post}`
</script>

<template>
  <div v-if="store.hasNotifications" class="notification-fixed-anchor">
    <div class="stack-container">
      <TransitionGroup name="notification-slide">
        <NuxtLink
            v-for="msg in store.messages"
            :key="`${msg.board}-${msg.thread}-${msg.new_post}`"
            :to="getPostLink(msg)"
            class="notification-card"
        >
          <div class="icon-box">
            <Icon name="material-symbols:chat-bubble-outline-rounded"/>
          </div>
          <div class="details">
            <span class="meta">/{{ msg.board }}/{{ msg.thread }}</span>
            <p class="payload-green">{{ msg.payload }}</p>
          </div>
        </NuxtLink>
      </TransitionGroup>
    </div>

    <div class="bell-circle">
      <Icon name="material-symbols:notifications-rounded"/>
      <span class="badge">
        {{ store.messages.length }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="sass">

.notification-fixed-anchor
  position: fixed
  bottom: 2rem
  right: 2rem
  z-index: 9999
  display: flex
  flex-direction: column
  align-items: flex-end
  pointer-events: none

  & > *
    pointer-events: auto

.bell-circle
  width: 60px
  height: 60px
  background: royalblue
  color: white
  border-radius: 50%
  display: flex
  align-items: center
  justify-content: center
  font-size: 1.8rem
  box-shadow: 0 4px 15px rgba(royalblue, 0.4)
  position: relative
  cursor: pointer
  transition: transform 0.2s ease

  &:hover
    transform: scale(1.05)

  .badge
    position: absolute
    top: -2px
    right: -2px
    background: #ef4444
    color: white
    font-size: 0.7rem
    font-weight: bold
    min-width: 20px
    height: 20px
    border-radius: 10px
    display: flex
    align-items: center
    justify-content: center
    border: 2px solid white

.stack-container
  display: flex
  flex-direction: column
  gap: 0.75rem
  margin-bottom: 1rem

  .notification-card
    width: 300px
    background: white
    border: 1px solid whitesmoke
    border-left: 4px solid royalblue
    padding: 1rem
    border-radius: 8px
    display: flex
    gap: 1rem
    text-decoration: none
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05)

    .icon-box
      color: royalblue
      font-size: 1.2rem

    .details
      .meta
        font-size: 0.7rem
        color: #9ca3af
        font-weight: bold

      .payload-green
        font-size: 0.9rem
        color: limegreen
        margin-top: 2px
        line-height: 1.4

.notification-slide-enter-active, .notification-slide-leave-active
  transition: all 0.3s ease

.notification-slide-enter-from
  opacity: 0
  transform: translateY(20px)

.notification-slide-leave-to
  opacity: 0
  transform: translateX(20px)
</style>