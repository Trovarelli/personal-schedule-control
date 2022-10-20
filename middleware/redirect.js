export default defineNuxtRouteMiddleware((to) => {
    const userCookie = useCookie("user")
    if (userCookie.value !== undefined) {
        return '/home'
    } 
  })
  