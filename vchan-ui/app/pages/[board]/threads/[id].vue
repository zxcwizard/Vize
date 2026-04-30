<script setup lang="ts">
import ReplyWindow from "~/components/ReplyWindow.vue";
import PostItem from "~/components/PostItem.vue";
import {nextTick} from "vue";
import {useSocketGateway} from "~/composables/useSocket";
import {useThreadContext} from "~/composables/useThreadContext";

const {subscriptions} = useSocketGateway();
const {board, currentThreadId, replies, op, threadRefresh} = await useThreadContext();

const isReplying = ref(false);
const replyWindow = ref<InstanceType<typeof ReplyWindow>>();

const reply = async (postId: string) => {
  isReplying.value = true;
  await nextTick();
  if (replyWindow.value != null) replyWindow.value.appendId(postId);
}

const activeId = ref<string | null>(null)
const isTargetInViewport = ref(true)
const mousePos = reactive({x: 0, y: 0})

const hoveredPostData = computed(() => {
  if (!activeId.value || !op.value) return null;
  const activeIdValue = Number(activeId.value);
  if (activeIdValue == op.value.id) return op.value;
  return replies.value.at(activeIdValue) || null;
});

const handleMouseEnter = (id: string, event: MouseEvent) => {
  let target: HTMLElement | null = null;

  if (id === 'reply') {
    const el = (event.target as HTMLElement).closest('.quotelink') as HTMLElement;
    if (!el) {
      activeId.value = null;
      isTargetInViewport.value = false;
      return;
    }
    if (el.dataset.id) id = el.dataset.id;
  }

  target = document.getElementById(id);
  activeId.value = id;
  mousePos.x = event.clientX + 15;
  mousePos.y = event.clientY + 15;

  if (target) {
    const rect = target.getBoundingClientRect();
    const buffer = 10;
    isTargetInViewport.value = (
        rect.top >= -buffer &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + buffer
    );
  } else {
    isTargetInViewport.value = false;
  }
}

const handleMouseLeave = () => {
  activeId.value = null
}
</script>

<template>
  <div class="thread-body">
    <div class="thread-catalog-header">
      <img class="thread-catalog-img" src="/temp-title.png" alt="header">
      <div class="thread-catalog-board-list">/{{ board.code }}/ - {{ board.name }}</div>
    </div>
    <hr>
    <button class="update-btn" @click="() => threadRefresh()">Update</button>
    <SubButton :thread-id="currentThreadId" :board="board.code"/>
    <div>
      <h1>subbed to</h1>
      <h1>{{ subscriptions }}</h1>
    </div>
    <hr>
    <ReplyWindow
        v-if="isReplying" ref="replyWindow" :board="board.code" :thread="currentThreadId"
        @close-reply="isReplying = false;"/>

    <div
        v-if="op"
        :id="op.id.toString()"
        :class="['thread-op-body', { 'highlighted': activeId === op.id.toString() && isTargetInViewport }]">
      <PostItem :post="op" @reply="reply">
        <template #backlinks>
          <a
              v-for="replyId in op.repliesFrom" :key="replyId" :href="`#${replyId}`" class="thread-post-replies"
              @mouseover="handleMouseEnter(replyId.toString(), $event)" @mouseleave="handleMouseLeave">>>{{
              replyId
            }}</a>
        </template>
      </PostItem>
    </div>

    <div
        v-for="post in replies" :id="post.id.toString()" :key="post.id"
        :class="['thread-post-body', { 'highlighted': activeId === post.id.toString() && isTargetInViewport }]">
      <div class="thread-arrows">>></div>
      <PostItem
          :post="post" is-preview @reply="reply" @hover="handleMouseEnter('reply', $event)"
          @mouseleave="handleMouseLeave">
        <template #backlinks>
          <a
              v-for="replyId in post.repliesFrom" :key="replyId" :href="`#${replyId}`" class="thread-post-replies"
              @mouseover="handleMouseEnter(replyId.toString(), $event)" @mouseleave="handleMouseLeave">>>{{
              replyId
            }}</a>
        </template>
      </PostItem>
    </div>

    <Teleport to="body">
      <div
          v-if="activeId && !isTargetInViewport && hoveredPostData"
          class="floating-preview thread-post-body"
          :style="{ top: mousePos.y + 'px', left: mousePos.x + 'px', minWidth: '55rem' }">
        <PostItem :post="hoveredPostData"/>
      </div>
    </Teleport>
  </div>
</template>

<style scoped lang="sass">
.thread-body
  margin-left: 2rem
  margin-right: 2rem

.thread-op-body
  display: block
  padding: 1rem

.thread-post-body
  display: flow-root
  width: auto
  background: #d6f0da
  padding: 0.5rem
  margin-bottom: 1rem

.thread-arrows
  float: left
  margin-right: 1rem

.thread-post-replies
  color: blue
  margin-left: 1rem
  text-decoration: underline
  cursor: pointer

  &:hover
    color: green

.highlighted
  background-color: #fff9c4 !important
  outline: 2px solid #fbc02d
  transition: background-color 0.2s ease

.floating-preview
  position: fixed
  z-index: 1000
  pointer-events: none
  box-sizing: border-box
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.3)
  border: 1px solid #aaa
  max-width: 500px

.update-btn
  display: inline-block
  padding: 0.4rem 1rem
  border: 1px solid #000
  font-size: 14px
  font-weight: 600
  letter-spacing: 0.05em
  cursor: pointer
  transition: all 0.15s ease

  &:hover
    background-color: darkgreen
    color: #fff

  &:active
    transform: translateY(1px)
    background-color: #333

.thread-catalog-header
  text-align: center

.thread-catalog-img
  width: 500px
  height: 150px

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
</style>