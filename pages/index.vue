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
            v-model="userName"
            :rules="userNameRules"
            label="Nome de usuário"
            required
          ></v-text-field>

          <v-text-field
            color="indigo"
            type="password"
            v-model="password"
            :rules="passwordRules"
            label="Senha"
            required
          ></v-text-field>

          <v-checkbox
            v-model="checkbox"
            class="pb-5"
            label="Lembrar-se"
            required
          ></v-checkbox>

          <div class="d-flex justify-space-between align-end cad-message">
            <v-btn
              :disabled="loading"
              :loading="loading"
              color="indigo-lighten-1"
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
import { useCookies } from "vue3-cookies";
// (v) =>
//         /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(v) ||
//         "A senha deve ter letras e números",
export default {
  setup() {
    definePageMeta({
      middleware: "redirect",
    });
    const { cookies } = useCookies();
    return { cookies };
  },
  data: () => ({
    showToast: useNuxtApp().showToast,
    loading: false,
    valid: true,
    password: "",
    passwordRules: [(v) => !!v || "Para continuar digite sua senha"],
    userName: "",
    userNameRules: [(v) => !!v || "Para continuar digite seu nome de usuário"],
    checkbox: false,
    baseUrl: "https://metawaydemo.vps-kinghost.net:8485/api",
  }),

  async beforeMount() {
    const userCookie = this.cookies.get("user");
    if (userCookie?.value !== undefined) {
      this.userName = userCookie.username;
      this.password = userCookie.password;
      await this.login();
    }
  },

  methods: {
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
          if (this.checkbox) {
            //TODO encrypt data
            // const userName = CryptoJS.AES.encrypt(
            //   this.userName,
            //   this.secret
            // ).toString();
            // const password = CryptoJS.AES.encrypt(
            //   this.password,
            //   this.secret
            // ).toString();
            // const encryptedUser = {
            //   password: password,
            //   username: userName,
            // };
            this.cookies.set("user", user);
          }
          this.cookies.set("loggedUser", resp);
          this.cookies.set("userAuth", "authenticated");
          this.$router.push("/home");
          this.$showToast(
            `Olá ${resp.username}, seja bem vindo(a)!`,
            "success",
            4000
          );
        })
        .catch((err) => {
          if (err.response?.status === 401)
            this.$showToast("Usuário ou senha invalidos", "error", 4000);
          else
            this.$showToast(
              "Erro interno, por favor tente novamente mais tarde",
              "error",
              4000
            );
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
    // reset() {
    //   this.$refs.form.reset();
    // },
    // resetValidation() {
    //   this.$refs.form.resetValidation();
    // },
  },
};
</script>

<style lang="scss" scoped>
.cad-message {
  font-size: 14px;
  .cad-link {
    cursor: pointer;
    color: #5c6bc0;
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