// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2026-02-17',
    devtools: {enabled: true},
    app: {
        head: {
            link: [{rel: 'icon', type: 'image/x-icon', href: '/favicon.png'}]
        }
    },
    runtimeConfig: {
        public: {
            backendUrl: 'http://localhost:8080'
        }
    },
    modules: [
        '@pinia/nuxt',
        '@nuxt/eslint'
    ]
})