<template>
  <div class="navigator">
    <v-card v-if="isMobile">
      <v-layout>
        <!-- <v-system-bar color="deep-purple darken-3"></v-system-bar> -->

        <v-app-bar color="primary" prominent>
          <v-app-bar-nav-icon
            variant="text"
            @click.stop="drawer = !drawer"
          ></v-app-bar-nav-icon>

          <v-toolbar-title>My files</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn variant="text" icon="mdi-magnify"></v-btn>

          <v-btn variant="text" icon="mdi-dots-vertical"></v-btn>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" bottom temporary>
          <v-list :items="itemsMobile"></v-list>
        </v-navigation-drawer>

        <v-main>
          <!-- <v-card-text>
          The navigation drawer will appear from the bottom on smaller size screens.
        </v-card-text> -->
        </v-main>
      </v-layout>
    </v-card>
    <div
      v-else
      class="nav-bar d-flex justify-space-between align-center"
      v-bind:class="{ 'index-nav': !indexRoute }"
    >
      <div v-if="indexRoute">
        <a @click="this.$router.push('/logged')" class="nav-link">Home</a>
        <a @click="this.$router.push('/')" class="nav-link">Meu Cadastro</a>
        <a @click="this.$router.push('/')" class="nav-link">Usuários</a>
        <a @click="this.$router.push('/')" class="nav-link">Pessoas</a>
        <a @click="this.$router.push('/')" class="nav-link">Contatos</a>
      </div>
      <div v-else></div>
      <div>
        <a @click="this.$router.push('/')" class="nav-link r">Login</a>
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