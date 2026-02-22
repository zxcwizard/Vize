export default defineNuxtConfig({
    compatibilityDate: '2026-02-17',
    devtools: {enabled: true},
    app: {
        head: {
            link: [{rel: 'icon', type: 'image/x-icon', href: '/favicon.png'}]
        }
    },
    nitro: {
        routeRules: {
            '/api/**': {
                proxy: 'http://localhost:8080/api/**'
            }
        }
    },
    modules: [
        '@pinia/nuxt',
        '@nuxt/eslint'
    ]
})