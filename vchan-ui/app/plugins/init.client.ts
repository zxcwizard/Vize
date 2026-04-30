export default defineNuxtPlugin(() => {
    $fetch('/api/cookie').catch(err => console.error("Cookie sync failed:", err));
});