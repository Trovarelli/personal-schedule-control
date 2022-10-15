<template>
  <div class="banner d-flex justify-end align-center">
    <div class="container">
      <v-card width="50vw" flat class="login-card">
        <v-form ref="form" v-model="valid" lazy-validation class="pa-5">
          <v-text-field
            color="indigo"
            v-model="name"
            :rules="nameRules"
            label="Nome"
            required
          ></v-text-field>

          <v-text-field
            color="indigo"
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>

          <!-- <v-select
            v-model="select"
            :items="items"
            :rules="[(v) => !!v || 'Item is required']"
            label="Item"
            required
            ></v-select> -->

          <!-- <v-checkbox
            v-model="checkbox"
            :rules="[(v) => !!v || 'You must agree to continue!']"
            label="Do you agree?"
            required
          ></v-checkbox> -->

          <v-btn
            color="indigo-lighten-1 px-5"
            outlined
            fab
            class="mr-4"
            @click="validate"
          >
            Login
          </v-btn>
        </v-form>
      </v-card>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    valid: true,
    name: "",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    select: null,
    items: ["Item 1", "Item 2", "Item 3", "Item 4"],
    checkbox: false,
  }),

  methods: {
    validate() {
      this.$refs.form.validate();
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
}
.banner {
  background-image: url("./assets/img/banner.jpg");
  background-size: cover;
  min-height: 100vh;
}
.banner::before {
  background-color: rgba(0, 0, 0, 0.37);
  content: "";
  display: block;
  height: 100%;
  position: absolute;
  width: 100%;
}
</style>