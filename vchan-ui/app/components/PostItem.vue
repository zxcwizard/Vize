<template>
  <div class="post-item-internal">
    <div class="thread-post-details">
      <span v-if="'name' in post" class="thread-post-details-name">{{ post.name }}&ensp;</span>
      <span class="thread-post-details-user">Anonymous&ensp;</span>
      <span class="thread-post-details-date">{{ post.createdAt }}&ensp;</span>
      <span>№</span>
      <span class="thread-post-details-id" @click="$emit('reply', post.id.toString())">
        {{ post.id }}
      </span>
      <slot name="backlinks"/>
    </div>

    <div class="thread-post-images">
      <figure class="thread-image-id">
        <figcaption>img data</figcaption>
        <a>
          <img src="/home/ranmaru/Pictures/pfp/d6b3a76086be1a412b96321243b600ca50e8c9cd59591b65120e2a2b4620ea82.jpg" alt="thumb">
        </a>
      </figure>
    </div>

    <article
        v-if="isPreview"
        v-dompurify-html="formattedComment"
        class="thread-post-comment"
        @mouseover="$emit('hover', $event)"
    />
    <article v-else class="thread-post-comment">
      {{ post.comment }}
    </article>
  </div>
</template>

<script setup lang="ts">
import type {OpPost, Post} from "~/types/data";

const props = defineProps<{
  post: Post | OpPost;
  isPreview?: boolean;
}>();

defineEmits(['reply', 'hover']);

const formattedComment = computed(() => {
  if (!props.post.comment) return '';
  return props.post.comment.replace(/>>(\d+)(?:\s\(OP\))?/g,
      '<a class="quotelink" data-id="$1" href="#$1">$&</a>');
});
</script>

<style scoped lang="sass">
.thread-post-details-name
  font-weight: bold
  color: cornflowerblue

.thread-post-details-id:hover
  color: blue
  cursor: pointer

.thread-image-id
  float: left
  margin: 0 1rem 0 0

  img
    max-width: 200px
    display: block

.thread-post-comment
  line-height: 1.5
  display: block
  white-space: pre-wrap
  word-break: break-word
  margin-top: 1rem

  :deep(a.quotelink)
    color: blue
    text-decoration: underline

    &:hover
      color: green
</style>