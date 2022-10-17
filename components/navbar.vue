<template>
  <div class="navigator">
    <div
      v-if="!isMobile"
      class="nav-bar d-flex justify-space-between align-center"
      v-bind:class="{ 'index-nav': !indexRoute }"
    >
      <div v-if="indexRoute">
        <div>
          <a @click="navigateTo('/logged')" class="nav-link">Home</a>
          <a @click="navigateTo('/')" class="nav-link">Meu Cadastro</a>
          <a @click="navigateTo('/')" class="nav-link">Usuários</a>
          <a @click="navigateTo('/')" class="nav-link">Pessoas</a>
          <a @click="navigateTo('/')" class="nav-link">Contatos</a>
        </div>
        <div>
          <a @click="this.$router.push('/')" class="nav-link r">Login</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      itemsMobile: [
        { title: "Home", icon: "mdi-home-city" },
        { title: "My Account", icon: "mdi-account" },
        { title: "Users", icon: "mdi-account-group-outline" },
      ],
      items: [
        {
          name: "Item #1",
          id: 1,
        },
        {
          name: "Item #2",
          id: 2,
        },
        {
          name: "Item #3",
          id: 3,
        },
      ],
      rail: true,
    };
  },

  computed: {
    indexRoute() {
      return this.$route.name !== "index";
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
  },
};
</script>

<style scoped lang="scss">
.index-nav {
  background: transparent !important;
}
.nav-bar {
  width: 100%;
  background: black;
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