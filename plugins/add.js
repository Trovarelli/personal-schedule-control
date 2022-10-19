

export default defineNuxtPlugin((to) => {
  addRouteMiddleware('auth', () => {
    const userCookie = useCookie("userAuth")
      setTimeout(() => {
        if (!userCookie.value) {
         
          return '/'
        }
      }, 200)
    
  }, { global: true })

  addRouteMiddleware('named-test', () => {
    
  })
})
