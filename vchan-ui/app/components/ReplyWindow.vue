<script setup lang="ts">

import type {CreatePost} from "~/types/data";
import {useSocketGateway} from "~/composables/useSocket";
import type {Board} from "~/types/boards";

const emit = defineEmits(['closeReply']);
const props = defineProps<{
  board: Board;
  thread: number;
}>()
const input = ref<HTMLTextAreaElement | null>(null);
const isSubmitting = ref(false);
const form = ref<CreatePost>({
  board: props.board,
  threadId: props.thread,
  comment: '',
  repliesTo: []
})
const {notify} = useSocketGateway();

onMounted(() => {
  input.value?.focus();
})

const appendId = (value: string) => {
  form.value.comment += `>>${value}\n`;
  input.value?.focus();
}
defineExpose({appendId});

async function createPost() {
  if (isSubmitting.value) return;
  try {
    isSubmitting.value = true;

    const matches = [...form.value.comment.matchAll(/>>(\d+)/g)];
    const replyIds = matches.map((match) => Number(match[1]));
    form.value.repliesTo = [...new Set(replyIds)];
    form.value.comment = form.value.comment.trim();

    await useThreadStore().createPost(form.value);
    notify(props.board, props.thread, form.value.comment);
    emit('closeReply');
  } catch (error) {
    console.error("Failed to post:", error);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <form class="reply-body" @submit.prevent="createPost">
    <!--    TODO MAKE IT MOVABLE-->
    <div class="reply-title">
      <span>Reply to thread</span>
      <button class="reply-title-cross" aria-label="Close" @click="$emit('closeReply')">X</button>
    </div>
    <div>
      <input style="width: 75%; margin: 0.25rem 0.25rem 0.25rem 0" placeholder="random">
      <button style="width: 20%" type="submit" :disabled="isSubmitting">{{ isSubmitting ? '...' : 'Submit' }}</button>
    </div>
    <textarea ref="input" v-model="form.comment" class="reply-comment" placeholder="Comment"/>
    <!--    TODO CAPTCHA-->
  </form>
</template>

<style scoped lang="sass">
.reply-body
  display: block
  border: solid 1px black
  border-radius: 2px
  min-width: 20rem
  text-align: left
  position: fixed
  top: 10rem
  right: 2rem
  padding: 2px

.reply-title
  cursor: move
  padding: 0.25rem
  background: lightgreen
  text-align: center

.reply-title-cross
  position: absolute
  right: 10px
  cursor: grab

.reply-comment
  width: 100%
  outline: medium none
  overflow: auto
  box-sizing: border-box
  text-align: left
</style>