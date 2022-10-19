import { defineStore } from "pinia"

export const useContactStore = defineStore({
    id: "contactStore",
    state: () => {
        return {
            contacts: [],
            favoriteContacts: []
        }
    },
    actions: {
        setContacts(state, contacts) {
            state.contacts = contacts
        }
        
    },
    getters: {
        getContacts: state => state.contacts,
    },
})