<script setup lang="ts">
import type {Thread} from "~/types/data";

defineProps<{
  thread: Thread;
  boardCode: string;
}>();

</script>

<template>
  <div class="thread-сard-body">
    <NuxtLink
        :to="`/${boardCode}/threads/${thread.id}`"
        class="thread-card-img-box">
      <img class="thread-card-img" src="https://picsum.photos/200/200" alt="Random image">
    </NuxtLink>
    <div class="thread-card-info">
      <div class="thread-card-meta">
        <span>R: </span>
        <b>mock</b>
        <span> / I: </span>
        <b>mock</b>
        <br>
        <span>{{ thread.name }}</span>
      </div>
      <div class="thread-card-preview">
        <b class="thread-card-title">xd: </b>
        <span>{{ thread.posts.at(0)?.comment }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.thread-сard-body
  font-size: 14px
  flex: 0 1 15rem
  margin: 1rem
  height: 25rem
  display: inline-block
  word-wrap: break-word
  overflow: hidden
  position: relative
  cursor: grab

.thread-card-img-box
  text-align: center
  padding-bottom: 0.25rem

.thread-card-preview
  text-align: center

.thread-card-meta
  padding-right: 0.5rem
  padding-left: 0.5rem
  padding-bottom: 0.5rem
  background: #C9D8CD
  text-align: center
</style>
