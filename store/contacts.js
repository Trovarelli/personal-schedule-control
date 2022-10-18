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
            console.log(contacts)
            state.contacts = contacts
        }
        
    },
    getters: {
        getContacts: state => state.contacts,
    },
})