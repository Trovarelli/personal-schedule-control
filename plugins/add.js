

export default defineNuxtPlugin((to) => {
  addRouteMiddleware('auth', () => {
    const userCookie = useCookie("userAuth")
      setTimeout(() => {
        console.log('AA')
        if (!userCookie.value) {
          console.log('ENTROU NO IF AAAAAAAAAAAAAAAAAAAAAA',userCookie.value)
          return '/'
        }
      }, 200)
    
  }, { global: true })

  addRouteMiddleware('named-test', () => {
    console.log('this named middleware was added in a plugin')
  })
})
