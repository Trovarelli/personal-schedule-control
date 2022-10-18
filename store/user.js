import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'user-store',
  state: () => {
    return {
        userData: {
            username: "",
            password: "",
        },
        userCookie: useCookie("user"),
        logged: false,
    }
  },
  actions: {},
  getters: {
    userCookie: state => state.userCookie,
    userAuth: state => state.userData,
    logged: state => state.logged
  },
})