<script setup lang="ts">
import type {Board} from "~/types/data";
import {useBoardStore} from "~/stores/boards";

const boards: Board[] = useBoardStore().getBoards();

</script>

<template>
  <span v-once class="board-list">
    <NuxtLink
        style="margin-right: 10px"
        external
        :to="'/'">
      HOME
    </NuxtLink>
    &#91;
    <NuxtLink
        v-for="(board, index) in boards"
        :key="board.code"
        :to="`/${board.code}`"
        class="board-code">
      {{ board.code }}
      <code v-if="index < boards.length - 1">&#47;</code>
    </NuxtLink>
    &#93;
  </span>
</template>

<style scoped lang="sass">
.board-list
  display: flex
  align-items: flex-start
  justify-content: flex-start
  font-family: "Courier 10 Pitch", system-ui
  font-size: medium

.board-code
  text-decoration: none
  color: black
  cursor: pointer
  padding-left: 0.25rem
  padding-right: 0.25rem

  &:hover
    color: #16a34a
    transition: color 0.2s ease-in-out
</style>
