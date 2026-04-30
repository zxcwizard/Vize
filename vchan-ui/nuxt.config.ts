export default defineNuxtConfig({
    compatibilityDate: '2026-04-27',
    devtools: {enabled: true},
    runtimeConfig: {
        apiInternalUrl: process.env.NUXT_API_INTERNAL_URL || 'http://localhost:8080/api',
        public: {
            apiBase: '/api'
        }
    },
    vite: {
        server: {
            allowedHosts: ['vchan']
        }
    },
    app: {
        head: {
            title: 'Vchan',
            link: [{rel: 'icon', type: 'image/x-icon', href: '/favicon.png'}]
        }
    },
    modules: [
        '@pinia/nuxt',
        '@nuxt/eslint'
    ]
})