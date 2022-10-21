<template>
  <div class="container">
    <h1>Dados</h1>
    <div class="container-form">
      <v-form ref="form" v-model="valid" lazy-validation class="pa-7">
        <div class="controller-form">
          <v-btn
            @click="saveEdit"
            :disabled="loading"
            :loading="loading"
            width="100px"
            class="my-5"
            color="indigo-lighten-1"
          >
            <span>{{ edit ? "Editar" : "Salvar" }}</span>
            <v-icon v-if="edit" class="ml-2">mdi-pencil</v-icon>
            <v-icon v-else class="ml-2">mdi-content-save</v-icon>
          </v-btn>
          <v-btn
            v-if="!edit"
            @click="cancelEdit"
            :disabled="loading"
            text
            width="125px"
            class="my-5"
            color="red"
          >
            <span>Cancelar</span>
            <v-icon class="ml-2">mdi-close</v-icon>
          </v-btn>
        </div>

        <v-text-field
          :readonly="edit"
          class="my-3"
          color="indigo"
          v-model="userData.usuario.username"
          :rules="nomeRules"
          label="Nome de usuário"
          required
        ></v-text-field>
        <v-text-field
          :readonly="edit"
          class="my-3"
          color="indigo"
          v-model="userData.usuario.nome"
          :rules="nomeRules"
          label="Nome"
          required
        ></v-text-field>
        <v-text-field
          :readonly="edit"
          class="my-3"
          color="indigo"
          v-model="userData.usuario.email"
          :rules="emailRules"
          label="E-mail"
          required
        ></v-text-field>
        <v-text-field
          :readonly="edit"
          class="my-3"
          v-maska="'###.###.###-##'"
          color="indigo"
          v-model="userData.usuario.cpf"
          :rules="required"
          label="CPF"
          required
        ></v-text-field>
        <v-text-field
          :readonly="edit"
          class="my-3"
          type="date"
          color="indigo"
          v-model="userData.usuario.dataNascimento"
          :rules="required"
          label="Data de nascimento"
          required
        ></v-text-field>
        <v-text-field
          :readonly="edit"
          class="my-3"
          v-maska="'(##) # ####-####'"
          color="indigo"
          v-model="userData.usuario.telefone"
          :rules="required"
          label="Telefone"
          required
        ></v-text-field>
        <v-text-field
          :readonly="edit"
          class="my-3"
          color="indigo"
          type="password"
          v-model="userData.usuario.password"
          :rules="passwordRules"
          label="Senha"
          required
        ></v-text-field>
      </v-form>
    </div>
  </div>
</template>

<script>
import { maska } from "maska";
import { ref } from "vue";
import { useCookies } from "vue3-cookies";

export default {
  directives: { maska },
  setup() {
    const valid = ref(true);

    const emailRules = [
      (v) => !!v || "Campo obrigatório",
      (v) => /.+@.+\..+/.test(v) || "E-mail precisa ser válido",
    ];
    const nomeRules = [
      (v) => !!v || "Campo obrigatório",
      (v) => (v && v.length <= 20) || "Limite de 20 caracteres",
      (v) =>
        (v && v.length >= 6) || "O campo deve conter ao menos 6 caracteres",
    ];
    const passwordRules = [
      (v) => !!v || "Campo obrigatório",

      (v) =>
        (v && v.length >= 6) || "O campo deve conter ao menos 6 caracteres",
    ];
    const required = [(v) => !!v || "Campo obrigatório"];
    const { cookies } = useCookies();

    return { passwordRules, valid, emailRules, nomeRules, required, cookies };
  },

  data() {
    return {
      showToast: useNuxtApp().showToast,
      edit: true,
      loading: false,
      userData: JSON.parse(sessionStorage.getItem("userData")),
      userDataBackup: JSON.parse(sessionStorage.getItem("userData")),
      baseUrl: "https://metawaydemo.vps-kinghost.net:8485/api",
    };
  },
  async mounted() {
    await this.getUser();
  },
  methods: {
    cancelEdit() {
      this.edit = true;
      this.userData = this.userDataBackup;
    },
    async saveEdit() {
      if (!this.edit) {
        const user = this.cookies.get("loggedUser");
        console.log(user);
        const auth = `${user.tokenType} ${user.accessToken}`;
        this.loading = true;
        await $fetch(`${this.baseUrl}/usuario/salvar`, {
          method: "POST",
          headers: {
            Authorization: auth,
          },
          body: this.userData,
        })
          .then(async () => {
            this.$showToast(`Cadastro atualizado com sucesso`, "success", 4000);
            this.edit = true;
            await this.getUser();
          })
          .catch((err) => {
            console.log(err);
            this.$showToast(
              "Não foi posssivel processar sua solicitação, tente novamente mais tarde",
              "error",
              4000
            );
          })
          .finally(() => (this.loading = false));
      } else {
        this.edit = false;
      }
    },
    async getUser() {
      this.loading = true;
      const user = this.cookies.get("loggedUser");
      const auth = `${user.tokenType} ${user.accessToken}`;
      await $fetch(`${this.baseUrl}/usuario/buscar/${user.id}`, {
        method: "GET",
        headers: {
          Authorization: auth,
        },
      })
        .then((resp) => {
          this.userData = resp.object;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped lang="scss">
.container-form {
  width: 50%;
}
.controller-form {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>