<script setup lang="ts">
</script>
<template>
  <div class="layout-wrapper">
    <header>
      <BoardList />
    </header>
    <main>
      <slot />
    </main>
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-links">
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Rules</a>
          <a href="#">FAQ</a>
          <a href="#">Contact</a>
          <a href="#">DMCA</a>
        </div>
        <div class="copyright">
          <p>
            &copy; 2025 Vize. All rights reserved. This site is for educational and research
            purposes.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
<style lang="sass">
.html, body
  height: 100%
  margin: 0

.layout-wrapper
  min-height: 100vh
  display: flex
  flex-direction: column

main
  flex: 1

.footer
  border-top: 1px solid #d1d5db
  background-color: #f9fafb
  padding: 1.5rem 0
  flex-shrink: 0

.footer-content
  max-width: 64rem
  margin: 0 auto
  padding: 0 1rem

.footer-links
  display: flex
  flex-wrap: wrap
  justify-content: center
  gap: 1.5rem
  font-size: 0.875rem
  color: #4b5563
  margin-bottom: 1rem

  a
    text-decoration: none
    color: black

    &:hover
      color: #16a34a
      transition: color 0.2s ease-in-out

.copyright
  text-align: center
  font-size: 0.75rem
  color: #6b7280
</style>