

export default defineNuxtPlugin((to) => {
  addRouteMiddleware('auth', () => {

  }, { global: true })

  addRouteMiddleware('named-test', () => {
    
  })
})
