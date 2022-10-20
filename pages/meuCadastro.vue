<template>
  <div class="container">
    <h1>Dados</h1>
    <div class="container-form">
      <v-form ref="form" v-model="valid" lazy-validation class="pa-7">
        <v-text-field
          :readonly="edit"
          color="indigo"
          v-model="userData.username"
          :rules="nomeRules"
          label="Nome de usuário"
          required
        ></v-text-field>
        <v-text-field
          :readonly="edit"
          color="indigo"
          v-model="userData.nome"
          :rules="nomeRules"
          label="Nome"
          required
        ></v-text-field>
        <v-text-field
          :readonly="edit"
          color="indigo"
          v-model="userData.email"
          :rules="emailRules"
          label="E-mail"
          required
        ></v-text-field>
        <v-text-field
          :readonly="edit"
          v-maska="'###.###.###-##'"
          color="indigo"
          v-model="userData.cpf"
          :rules="required"
          label="CPF"
          required
        ></v-text-field>
        <v-text-field
          :readonly="edit"
          type="date"
          color="indigo"
          v-model="userData.dataNascimento"
          :rules="required"
          label="Data de nascimento"
          required
        ></v-text-field>
        <v-text-field
          :readonly="edit"
          v-maska="'(##) # ####-####'"
          color="indigo"
          v-model="userData.telefone"
          :rules="required"
          label="Telefone"
          required
        ></v-text-field>
        <v-text-field
          :readonly="edit"
          color="indigo"
          type="password"
          v-model="userData.password"
          :rules="passwordRules"
          label="Senha"
          required
        ></v-text-field>
        <v-btn
          :disabled="loading || !edited"
          :loading="loading"
          color="indigo-lighten-1"
          outlined
          fab
          class="mr-4"
          @click="validate"
        >
          Salvar
        </v-btn>
      </v-form>
    </div>
  </div>
</template>

<script>
import { maska } from "maska";
import { ref } from "vue";

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

    return { passwordRules, valid, emailRules, nomeRules, required };
  },

  data() {
    return {
      edited: false,
      edit: false,
      loading: false,
      userData: JSON.parse(sessionStorage.getItem("userData")),
    };
  },

  watch: {
    userData: {
      handler(newVal, oldVal) {
        console.log("NEW", newVal);
        console.log("OLD", oldVal);
        if (newVal !== oldVal) this.edited = true;
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style scoped>
.container-form {
  width: 50%;
}
</style>