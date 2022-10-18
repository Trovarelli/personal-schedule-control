<template>
  <h1>Logged</h1>
</template>

<script>
import { useCookies } from "vue3-cookies";
import { useContactStore } from "~/store/contacts";
export default {
  setup() {
    definePageMeta({
      middleware: "named-test",
    });
    const { cookies } = useCookies();
    const contactStore = useContactStore();
    return { contactStore }, { cookies };
  },

  data: () => ({
    baseUrl: "https://metawaydemo.vps-kinghost.net:8485/api",
    contacts: [],
    loading: false,
  }),

  async mounted() {
    await this.getContacts();
  },

  methods: {
    async getContacts() {
      this.loading = true;
      const user = this.cookies.get("userAuth");
      console.log(user);
      const auth = `${user.tokenType} ${user.accessToken}`;
      await $fetch(`${this.baseUrl}/contato/listar/${user.id}`, {
        method: "GET",
        headers: {
          Authorization: auth,
        },
      })
        .then((resp) => {
          this.contacts = resp;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = true;
        });
    },
  },
};
</script>

<style>
</style>