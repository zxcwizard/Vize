<script setup lang="ts">
const totalPosts = await useFetch(`${useRuntimeConfig().public.backendUrl}/posts/count`);
const postsToday = await useFetch(`${useRuntimeConfig().public.backendUrl}/posts/countToday`);
const threadLength = 8;

</script>

<template>
  <div class="vize-homepage">
    <div class="header">
      <h1 class="animate-character">VIZE</h1>
    </div>

    <h2 class="popular-threads-text">Popular threads</h2>
    <div class="popular-threads">
<!--      <ThreadCard-->
<!--          v-for="index in threadLength"-->
<!--          :key="index"-->
<!--          :name="'strqweqwe'"-->
<!--          :comment="'index'"-->
<!--      />-->
    </div>
    <div class="statistics-box">
      <div class="stats-grid">
        <div>
          <div class="stat-value">123</div>
          <div class="stat-label">Active Users</div>
        </div>
        <div>
          <div class="stat-value">321</div>
          <div class="stat-label">Active Threads</div>
        </div>
        <div>
          <div class="stat-value">{{ postsToday.data.value }}</div>
          <div class="stat-label">Posts Today</div>
        </div>
        <div>
          <div class="stat-value">{{ totalPosts.data.value }}</div>
          <div class="stat-label">Total Posts</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass">

.vize-homepage
  background-color: #fff
  color: #000
  font-family: monospace

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

.active-threads-list
  display: flex
  flex-direction: column
  gap: 0.5rem
  margin-bottom: 3rem

.popular-threads
  display: grid
  align-items: center
  border: 1px solid black
  border-radius: 3px
  padding-top: 1rem
  padding-bottom: 1rem
  grid-template-columns: repeat(4, 15rem)
  justify-content: center
  gap: 4rem
  width: 65%
  margin: 0 auto

.popular-threads-text
  width: 44%
  color: black
  text-align: center
  text-transform: uppercase

.statistics-box
  background-color: #f9fafb
  padding: 1.5rem
  margin-bottom: 2rem

  h3
    font-size: 1.25rem
    font-weight: bold
    margin-bottom: 1rem
    color: #16a34a

.stats-grid
  display: grid
  grid-template-columns: repeat(2, 1fr)
  gap: 1rem
  text-align: center

  @media (min-width: 768px)
    grid-template-columns: repeat(4, 1fr)

.stat-value
  font-size: 1.5rem
  font-weight: bold
  color: #000

.stat-label
  font-size: 0.875rem
  color: #4b5563


</style>
