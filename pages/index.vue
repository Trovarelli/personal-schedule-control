<template>
  <div class="banner d-flex justify-end align-center">
    <div class="container">
      <v-card max-width="600px" width="50vw" flat class="login-card">
        <div class="text-center">
          <h1>Login</h1>
        </div>
        <v-form ref="form" v-model="valid" lazy-validation class="pa-7">
          <v-text-field
            color="indigo"
            class="py-5"
            v-model="userName"
            :rules="userNameRules"
            label="Nome de usuário"
            required
          ></v-text-field>

          <v-text-field
            color="indigo"
            class="py-5"
            type="password"
            v-model="password"
            :rules="passwordRules"
            label="Senha"
            required
          ></v-text-field>

          <!-- <v-checkbox
            v-model="checkbox"
            :rules="[(v) => !!v || 'You must agree to continue!']"
            label="Do you agree?"
            required
          ></v-checkbox> -->

          <div class="d-flex justify-space-between align-end cad-message">
            <v-btn
              :disabled="loading"
              :loading="loading"
              color="indigo-lighten-1 px-5"
              outlined
              fab
              class="mr-4"
              @click="validate"
            >
              Entrar
            </v-btn>
            <div class="indigo-lighten-1--text">
              <span>Ainda não possui uma conta?</span>
              <span @click="this.$router.push('/')" class="cad-link">
                cadastre-se aqui</span
              >
            </div>
          </div>
        </v-form>
      </v-card>
    </div>
  </div>
</template>
<script>
import { useNuxtApp } from "#app";
// (v) =>
//         /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(v) ||
//         "A senha deve ter letras e números",
export default {
  setup() {
    const { $showToast } = useNuxtApp();
  },
  data: () => ({
    loading: false,
    valid: true,
    password: "",
    passwordRules: [(v) => !!v || "Para continuar digite sua senha"],
    userName: "",
    userNameRules: [(v) => !!v || "Para continuar digite seu nome de usuário"],
    checkbox: false,
    baseUrl: "https://metawaydemo.vps-kinghost.net:8485/api",
  }),

  beforeMount() {
    console.log(process.env.BASEURL);
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user !== null) {
      this.userName = user.username;
    }
  },

  methods: {
    async register() {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const auth = `${user.tokenType} ${user.accessToken}`;
      const payload = {
        tipos: "ROLE_USER",
        usuario: {
          cpf: "091.958.580-91",
          dataNascimento: "1995-05-19",
          email: "neto4971@gmail.com",
          id: 21251,
          nome: "netoAdmin",
          password: "123456",
          telefone: "14991886974",
          username: "netoAdmin",
        },
      };

      await $fetch(`${this.baseUrl}/usuario/salvar`, {
        method: "POST",
        headers: {
          Authorization: auth,
        },
        body: payload,
      }).then((resp) => {
        console.log(resp);
      });
    },
    async login() {
      this.loading = true;
      const user = {
        password: this.password,
        username: this.userName,
      };
      await $fetch(`${this.baseUrl}/auth/login`, {
        method: "POST",
        body: user,
      })
        .then((resp) => {
          sessionStorage.setItem("user", JSON.stringify(resp));
        })
        .catch((err) => {
          console.log(err);
          const { $showToast } = useNuxtApp();
          $showToast("Hello world", "info", 2000);
        })
        .finally(() => (this.loading = false));
    },
    async validate() {
      const isValid = await this.$refs.form.validate();

      if (isValid.valid) {
        // this.register();
        this.login();
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 0 4vw 0 4vw;

  .cad-message {
    font-size: 14px;
    .cad-link {
      cursor: pointer;
      color: #5c6bc0;
    }
  }
}
.banner {
  background-image: url("./assets/img/banner.jpg");
  background-size: cover;
  min-height: 100vh;
}
.banner::before {
  background-color: rgba(0, 0, 0, 0.45);
  content: "";
  display: block;
  height: 100%;
  position: absolute;
  width: 100%;
}
</style>