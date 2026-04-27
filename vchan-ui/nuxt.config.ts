export default defineNuxtConfig({
    compatibilityDate: '2026-04-27',
    devtools: {enabled: true},
    vite: {
        server: {
            allowedHosts: ['vchan']
        }
    },
    app: {
        head: {
            link: [{rel: 'icon', type: 'image/x-icon', href: '/favicon.png'}]
        }
    },
    modules: [
        '@pinia/nuxt',
        '@nuxt/eslint'
    ]
})