
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  css: ['vuetify/lib/styles/main.sass', 'mdi/css/materialdesignicons.min.css', 'vue-toastification', '@/assets/main.scss'],
  build: {
    transpile: ['vuetify', 'showToast.client', 'vue3-cookies',],
  },
  modules: [
    '@pinia/nuxt'
  ],
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
})