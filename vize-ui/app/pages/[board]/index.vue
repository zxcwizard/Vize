<script setup lang="ts">
import {useBoardContext} from "../../composables/useBoardContext";

definePageMeta({
  middleware: 'validate-board'
})

const {board} = useBoardContext();
const {threadCardData, threadCardRefresh} = useThreadCardList();
const isCreatingThread = ref(false);
const form = ref({
      name: '',
      comment: ''
    }
)

async function createThread() {
  await $fetch(`/api/threads`, {
    method: 'POST',
    body: {
      ...form.value,
      board: board.value.code
    }
  })
  isCreatingThread.value = false;
  await threadCardRefresh();
}
</script>

<template>
  <div>
    <div class="thread-catalog-header">
      <img
          class="thread-catalog-img"
          src="/temp-title.png" alt="header">
      <div class="thread-catalog-board-list">/{{ board.code }}/ - {{ board.name }}</div>
    </div>
    <hr style="width: 75%">
    <div class="create-thread-btn">
      [
      <span v-if="!isCreatingThread" class="create-thread-btn-text" @click="isCreatingThread = true"
      >Start a new thread</span>
      <span v-else class="create-thread-btn-text" @click="isCreatingThread = false">Close</span>
      ]
    </div>
    <form v-if="isCreatingThread" class="create-thread-body" @submit.prevent="createThread">
      <div class="create-thread-title">
        <input v-model="form.name" required class="create-thread-title-input" placeholder="title">
        <button class="create-thread-submit" type="submit">Submit</button>
      </div>
      <div class="create-thread-text">
        <textarea v-model="form.comment" required class="create-thread-text-input" placeholder="Commentary"/>
      </div>
    </form>
    <div class="thread-catalog-threads">
      <ThreadCard
          v-for="thread in threadCardData"
          :id="thread.id"
          :key="thread.id"
          :thread="thread"
          :board-code="board.code"
      />
    </div>
  </div>
</template>

<style scoped lang="sass">
.threads
  justify-content: center
  display: flex
  flex-flow: wrap
  align-items: flex-start

.thread-catalog-header
  text-align: center

.thread-catalog-img
  width: 500px
  height: 150px

.create-thread-btn
  user-select: none
  text-align: center
  font-size: 1.5rem

.create-thread-btn-text:hover
  cursor: grab
  color: green


.thread-catalog-board-list
  font-size: clamp(1rem, 15vw, 3rem)
  font-weight: 650
  letter-spacing: 0.05em
  background: linear-gradient(90deg, #15803d, #22c55e, #3b82f6, #1d4ed8)
  background-size: 300% 100%
  background-clip: text
  -webkit-background-clip: text
  -webkit-text-fill-color: transparent
  animation: gradientFlow 3s ease-in-out infinite alternate

  @keyframes gradientFlow
    0%
      background-position: 0 0
    100%
      background-position: 100% 0

.header
  text-align: center

  .animate-character
    font-size: clamp(4rem, 15vw, 12rem)
    font-weight: 900
    letter-spacing: 0.1em
    text-transform: uppercase
    background: linear-gradient(90deg, #15803d, #22c55e, #7dd3fc, #2563eb)
    background-size: 300% 100%
    background-clip: text
    -webkit-background-clip: text
    -webkit-text-fill-color: transparent
    animation: gradientFlow 3s ease-in-out infinite alternate

    @keyframes gradientFlow
      0%
        background-position: 0 0
      100%
        background-position: 100% 0

  p
    font-size: 1.125rem
    color: #4b5563

.create-thread-body
  width: 20rem
  margin: 1rem auto
  justify-content: center
  text-align: center

.create-thread-title
  display: flex
  align-items: center

.create-thread-title-input
  margin-right: 5px
  height: 1.5rem
  width: 75%

.create-thread-submit
  width: 25%
  margin: 0
  padding: 3px
  font-size: 15px

.create-thread-text-input
  height: 2rem

.create-thread-title-input, .create-thread-text-input
  width: 20rem
</style>
