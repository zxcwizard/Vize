<script lang="ts" setup>
import type {Board} from "~/types/boards";

const props = defineProps<{
  threadId: number
  board: Board
}>();

const {toggleThread, isSubscribed} = useSocketGateway();

const isSubbed = computed(() => isSubscribed(props.board, props.threadId));
</script>

<template>
  <button
      class="subscribe-btn"
      :class="{ 'is-active': isSubbed }"
      @click="toggleThread(props.board, props.threadId)"
  >
    {{ isSubbed ? 'Subscribed' : 'Subscribe' }}
  </button>
</template>

<style scoped lang="sass">
.subscribe-btn
  display: inline-block
  padding: 0.4rem 1rem
  border: 1px solid #000
  font-size: 14px
  font-weight: 600
  letter-spacing: 0.05em
  cursor: pointer
  transition: all 0.15s ease
  text-align: center
  min-width: 8rem

  &.is-active
    background: darkgreen
    color: #fff
    border: 1px solid #000
</style>