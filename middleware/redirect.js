export default defineNuxtRouteMiddleware((to) => {
    const userCookie = useCookie("userAuth")
    if (userCookie.value !== undefined) {
        return '/home'
    } 
  })
  