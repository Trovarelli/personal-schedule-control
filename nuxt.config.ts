
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ['vuetify/lib/styles/main.sass', 'mdi/css/materialdesignicons.min.css', 'vue-toastification'],
  build: {
    transpile: ['vuetify', 'showToast.client'],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
})