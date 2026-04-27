export default defineNuxtPlugin((nuxtApp) => {
    $fetch('/api/cookie').catch(err => console.error("Cookie sync failed:", err));
});