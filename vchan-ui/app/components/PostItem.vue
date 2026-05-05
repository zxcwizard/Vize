<script setup lang="ts">
import type {Post} from "~/types/data";

const props = defineProps<{
  post: Post;
  name?: string;
  isPreview?: boolean;
}>();

defineEmits(['reply', 'hover']);

const formattedComment = computed(() => {
  if (!props.post.comment) return '';
  return props.post.comment.replace(/>>(\d+)(?:\s\(OP\))?/g,
      '<a class="quotelink" data-id="$1" href="#$1">$&</a>');
});
</script>

<template>
  <div class="post-item-internal">
    <div class="thread-post-details">
      <span v-if="name" class="thread-post-details-name">{{ name }}&ensp;</span>
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
          <img src="/basedbobo.jpg" alt="thumb">
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