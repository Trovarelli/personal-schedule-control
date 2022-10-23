<template>
  <div class="navigator">
    <div v-if="!isMobile" class="index-nav">
      <div class="nav-bar d-flex justify-space-between align-center">
        <div>
          <a @click="navigateTo('/home')" class="nav-link">Home</a>

          <a v-if="isAdmin" @click="navigateTo('/usuarios')" class="nav-link"
            >Usuários</a
          >
          <a @click="navigateTo('/')" class="nav-link">Pessoas</a>
          <a @click="navigateTo('/')" class="nav-link">Contatos</a>
        </div>
        <div>
          <a @click="navigateTo('/meuCadastro')" class="nav-link"
            >Meu Cadastro</a
          >
          <a @click="loggout" class="nav-link r">Sair</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCookies } from "vue3-cookies";
export default {
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },

  computed: {
    isAdmin() {
      const user = this.cookies.get("loggedUser");
      return user?.tipos[0] === "ROLE_ADMIN";
    },
    isMobile() {
      return (
        this.$vuetify.display.name === "xs" ||
        this.$vuetify.display.name === "sm"
      );
    },
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    },
    loggout() {
      this.loading = true;
      this.cookies.set("userAuth", null);
      this.cookies.set("user", null);
      this.$router.push("/");
    },
  },
};
</script>

<style scoped lang="scss">
.index-nav {
  background: transparent !important;
}
.nav-bar {
  width: 100%;
  background: #5c6bc0;
  height: 50px;
  padding: 0 4vw 0 4vw;

  .nav-link {
    color: white;
    padding: 0 2vw 0 0;
    cursor: pointer;
  }

  .r {
    padding: 0 0 0 2vw;
  }
}

.navigator {
  z-index: 1;
  position: fixed !important;
  top: 0;
  width: 100%;
}
</style>