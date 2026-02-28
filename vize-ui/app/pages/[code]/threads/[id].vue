<script setup lang="ts">
import {useThreadStore} from "~/stores/threads";
import ReplyWindow from "~/components/ReplyWindow.vue";
import {nextTick} from "vue";

const route = useRoute();
const threadStore = useThreadStore();
const boardStore = useBoardStore();

const board = computed(() => boardStore.getBoard(route.params.code as string));
const threadId = computed(() => Number(route.params.id as string));

const {data, refresh} = await useAsyncData(
    () => `thread-${board.value.code}-${threadId.value}`,
    () => threadStore.fetchThread(board.value.code, threadId.value),
    {watch: [board.value, threadId]}
)

const op = computed(() => threadStore.getOpPost(board.value.code, threadId.value));
const postMap = computed(() => {
  const map = new Map();
  if (op.value) map.set(op.value.id.toString(), op.value);
  data.value?.posts.forEach(p => map.set(p.id.toString(), p));
  return map;
});

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
  if (!activeId.value) return null;
  return postMap.value.get(activeId.value) || null;
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
    isTargetInViewport.value = (
        rect.top >= -10 &&
        rect.bottom <= window.innerHeight + 10
    );
  } else {
    isTargetInViewport.value = false;
  }
}

const handleMouseLeave = () => {
  activeId.value = null
}

const formatComment = (comment: string) => {
  if (!comment) return '';
  return comment.replace(/>>(\d+)(?:\s\(OP\))?/g, '<a class="quotelink" data-id="$1" href="#$1">$&</a>');
}
</script>

<template>
  <div class="thread-body">
    <div class="thread-catalog-header">
      <img
          class="thread-catalog-img"
          src="/temp-title.png" alt="header">
      <div class="thread-catalog-board-list">/{{ board.code }}/ - {{ board.name }}</div>
    </div>
    <hr>
    <div>
      <button class="update-btn" @click="() => refresh()">Update</button>
    </div>
    <hr>
    <ReplyWindow
        v-if="isReplying"
        ref="replyWindow"
        :board="board.code"
        :thread="threadId"
        @close-reply="isReplying = false;"/>

    <div
        :id="op.id.toString()"
        :class="['thread-op-body', { 'highlighted': activeId === op.id.toString() && isTargetInViewport }]">
      <div class="thread-op-images">
        <figure class="thread-image-id">
          <figcaption>
            img data
          </figcaption>
          <a><img
              src="/home/ranmaru/Pictures/pfp/d6b3a76086be1a412b96321243b600ca50e8c9cd59591b65120e2a2b4620ea82.jpg"
              alt="20x20"></a>
        </figure>
      </div>
      <div class="thread-op-details">
        <span class="thread-post-details-name">{{ op.name }}&ensp;</span>
        <span class="thread-post-details-user">Anonymous&ensp;</span>
        <span class="thread-post-details-date">{{ op.createdAt }}&ensp;</span>
        <span>№</span>
        <span class="thread-post-details-id" @click="reply(`${op.id.toString()} (OP)`)">{{ op.id }}</span>
        <a
            v-for="replyId in op.repliesFrom" :key="replyId" :href="`#${replyId}`"
            class="thread-post-replies"
            @mouseover="handleMouseEnter(replyId.toString(), $event)"
            @mouseleave="handleMouseLeave">>{{ replyId }}
        </a>
      </div>
      <article class="thread-op-comment">{{ op.comment }}</article>
    </div>

    <div
        v-for="post in data?.posts.slice(1)"
        :id="post.id.toString()"
        :key="post.id"
        :class="['thread-post-body', { 'highlighted': activeId === post.id.toString() && isTargetInViewport }]">
      <div class="thread-arrows">>></div>
      <span class="thread-post-details-user">Anonymous&ensp;</span>
      <span class="thread-post-details-date">{{ post.createdAt }}&ensp;</span>
      <span>№</span>
      <span class="thread-post-details-id" @click="reply(post.id.toString())">{{ post.id }}</span>&nbsp;▶
      <a
          v-for="replyId in post.repliesFrom" :key="replyId" :href="`#${replyId}`"
          class="thread-post-replies"
          @mouseover="handleMouseEnter(replyId.toString(), $event)"
          @mouseleave="handleMouseLeave">>>{{ replyId }}</a>
      <div class="thread-post-images">
        <!--      TODO list images (figures)-->
        <figure class="thread-image-id">
          <figcaption>
            img data
          </figcaption>
          <a><img
              src="/home/ranmaru/Pictures/pfp/d6b3a76086be1a412b96321243b600ca50e8c9cd59591b65120e2a2b4620ea82.jpg"
              alt="20x20"></a>
        </figure>
      </div>
      <article
          v-dompurify-html="formatComment(post.comment)"
          class="thread-post-comment"
          @mouseover="handleMouseEnter('reply', $event)"
          @mouseleave="handleMouseLeave"/>
    </div>
    <Teleport to="body">
      <div
          v-if="activeId && !isTargetInViewport && hoveredPostData"
          class="floating-preview thread-post-body"
          :style="{
            top: mousePos.y + 'px',
            left: mousePos.x + 'px',
            minWidth: '55rem'}"
      >
          <span v-if="'name' in hoveredPostData" class="thread-post-details-name">
            {{ hoveredPostData.name }}&ensp;</span>
        <span class="thread-post-details-user">Anonymous &ensp;</span>
        <span class="thread-post-details-date">{{ hoveredPostData.createdAt }}&ensp;</span>
        <span>№</span>
        <span class="thread-post-details-id">{{ hoveredPostData.id }}</span>

        <div class="thread-post-images">
          <figure class="thread-image-id">
            <figcaption>img data</figcaption>
            <a>
              <img src="/home/ranmaru/Pictures/pfp/d6b3a76086be1a412b96321243b600ca50e8c9cd59591b65120e2a2b4620ea82.jpg"
                   alt="20x20">
            </a>
          </figure>
        </div>
        <article class="thread-post-comment">{{ hoveredPostData.comment }}</article>
      </div>
    </Teleport>
  </div>
</template>

<style scoped lang="sass">
.thread-body
  margin-left: 2rem
  margin-right: 2rem

.thread-op-details
  padding-top: 1rem
  display: flex
  flex-wrap: nowrap
  white-space: nowrap
  align-items: center

.thread-post-replies
  color: blue
  margin-left: 0.75rem

.thread-post-replies:hover
  color: green

.thread-image-id
  float: left
  flex-flow: row wrap
  margin: 0 1rem 0 0
  box-sizing: border-box
  word-break: break-word
  word-wrap: break-word

.thread-op-comment
  padding: 2rem
  overflow: auto
  display: block

.thread-post-comment
  margin-left: 1rem
  line-height: 1.5
  padding: 1rem
  display: block
  white-space: pre-wrap
  word-break: break-word

.thread-post-body
  display: flow-root
  width: auto
  background: #d6f0da
  padding: 0.5rem
  margin-bottom: 1rem

.thread-arrows
  float: left
  margin-top: 1px
  margin-right: 1rem

.thread-post-details-name
  font-weight: bold
  color: cornflowerblue

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
  margin: 0
  display: flow-root

.thread-catalog-header
  text-align: center

.thread-catalog-img
  width: 500px
  height: 150px

.thread-catalog-board-list
  font-size: clamp(1rem, 15vw, 3rem)
  font-weight: 650
  letter-spacing: 0.05em
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

.thread-post-comment
  :deep(a.quotelink)
    color: blue
    text-decoration: underline

    &:hover
      text-decoration: underline
</style>