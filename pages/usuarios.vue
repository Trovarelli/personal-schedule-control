<template>
  <div class="container d-flex flex-column justify-center align-end mt-12">
    <div class="header-home text-center">
      <h1>Gerenciar usuários</h1>
      <div>
        Aqui você pode gerenciar os usários cadastrados, alterando dados e
        incluindo nóvos usuários
      </div>
    </div>
    <v-dialog v-model="cadUser" width="500" persistent>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="mx-2"
          @click="createUser"
          elevation="0"
          color="success"
          v-bind="attrs"
          v-on="on"
        >
          Adicionar Usuário
        </v-btn>
      </template>
      <v-card>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="red-darken-4"
            text
            @click="cancelEdit"
            :disabled="loading"
          >
            Cancelar
          </v-btn>
        </v-card-actions>

        <v-card-title class="text-h5 grey lighten-2 px-9">
          Cadastrar contato
        </v-card-title>

        <v-form ref="form" v-model="valid" lazy-validation class="pa-7">
          <v-text-field
            color="indigo"
            v-model="form.usuario.username"
            :rules="nomeRules"
            label="Nome"
            required
          ></v-text-field>
          <v-text-field
            color="indigo"
            v-model="form.usuario.email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>
          <v-select
            v-model="form.tipos[0]"
            :items="role_user"
            label="Standard"
          ></v-select>
          <v-text-field
            color="indigo"
            v-model="form.usuario.nome"
            :rules="nomeRules"
            label="Nome"
            required
          ></v-text-field>
          <v-text-field
            class="my-3"
            type="date"
            color="indigo"
            v-model="form.usuario.dataNascimento"
            :rules="required"
            label="Data de nascimento"
            required
          ></v-text-field>
          <v-text-field
            v-maska="'###.###.###-##'"
            color="indigo"
            v-model="form.usuario.cpf"
            :rules="required"
            label="CPF"
            required
          ></v-text-field>

          <v-text-field
            color="indigo"
            v-maska="'(##) # ####-####'"
            v-model="form.usuario.telefone"
            :rules="required"
            label="Telefone"
            required
          ></v-text-field>

          <v-text-field
            color="indigo"
            type="password"
            v-model="form.usuario.password"
            :rules="this.update ? '' : passwordRule"
            label="Senha"
            required
          ></v-text-field>
        </v-form>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="success" text @click="createUser" :disabled="loading">
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="searchbar mt-3">
      <v-text-field
        prepend-inner-icon="mdi-magnify"
        v-model="search"
        clearable
        solo
      >
      </v-text-field>
    </div>

    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>Usuário</th>
          <th>Telefone</th>
          <th>Email</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tr v-if="usersFiltered.length === 0">
        <td colspan="5">Nenhum usuário encontrado :(</td>
      </tr>
      <tr v-else v-for="user in usersFiltered" :key="user.id">
        <td>
          {{ user.id }}
        </td>
        <td>
          {{ user.username }}
        </td>
        <td>{{ user.telefone }}</td>
        <td>{{ user.email }}</td>

        <td>
          <v-btn
            :loading="loading"
            class="mx-2"
            @click="modifyUser(user)"
            elevation="0"
            color="amber"
          >
            Alterar
          </v-btn>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { useNuxtApp } from "#app";
import { maska } from "maska";
import { useCookies } from "vue3-cookies";
export default {
  directives: { maska },
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },

  data: () => ({
    showToast: useNuxtApp().showToast,
    valid: true,
    cadUser: false,
    passwordRule: [
      (v) =>
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(v) ||
        "A senha deve conter letras e números",
    ],
    imgRule: [
      (value) =>
        !value ||
        value.size < 2000000 ||
        "A foto deve ter um tamanho menor que 2 MB!",
    ],
    emailRules: [
      (v) => !!v || "Campo obrigatório",
      (v) => /.+@.+\..+/.test(v) || "E-mail precisa ser válido",
    ],
    nomeRules: [
      (v) => !!v || "Campo obrigatório",
      (v) => (v && v.length <= 20) || "Limite de 20 caracteres",
    ],
    required: [(v) => !!v || "Campo obrigatório"],
    form: {
      tipos: [],
      usuario: {
        cpf: "",
        dataNascimento: "",
        email: "",
        nome: "",
        password: "",
        telefone: "",
        username: "",
      },
    },
    role_user: ["ROLE_USER", "ROLE_ADMIN"],
    users: [],
    usersFiltered: [],
    search: "",
    baseUrl: "https://metawaydemo.vps-kinghost.net:8485/api",
    loading: false,
    update: false,
  }),

  watch: {
    search(v) {
      if (v === "") {
        this.usersFiltered = this.users;
      } else {
        this.usersFiltered = this.users.filter((el) => {
          return el.username.toLowerCase().includes(v.toLowerCase());
        });
      }
    },
  },

  async beforeMount() {
    window.test = this;
    const userCookie = this.cookies.get("userAuth");
    if (userCookie !== "authenticated") {
      this.$router.push("/403");
    }
  },

  async mounted() {
    await this.getUsers();
    await this.getUser();
  },

  methods: {
    cancelEdit() {
      this.cadUser = false;
      this.form = {
        tipos: [],
        usuario: {
          cpf: "",
          dataNascimento: "",
          email: "",
          nome: "",
          password: "",
          telefone: "",
          username: "",
        },
      };
    },
    async getUsers() {
      this.loading = true;
      const user = this.cookies.get("loggedUser");
      const auth = `${user.tokenType} ${user.accessToken}`;
      await $fetch(`${this.baseUrl}/usuario/pesquisar`, {
        method: "POST",
        headers: {
          Authorization: auth,
        },
        body: {
          termo: "",
        },
      })
        .then((resp) => {
          this.users = resp.sort((a, b) => {
            return a.id - b.id;
          });
          this.usersFiltered = this.users;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    async createUser() {
      if (this.cadUser) {
        const valid = await this.$refs.form.validate();

        if (valid.valid) {
          this.loading = true;
          this.update = false;
          const user = this.cookies.get("loggedUser");
          const auth = `${user.tokenType} ${user.accessToken}`;
          const payload = this.form;
          await $fetch(`${this.baseUrl}/usuario/salvar`, {
            method: "POST",
            headers: {
              Authorization: auth,
            },
            body: payload,
          })
            .then(async () => {
              await this.getUsers();
              this.update = false;
              this.cadUser = false;
              this.$showToast(`Usuário salvo com sucesso!`, "success", 4000);
            })
            .catch((err) => {
              console.log(err);
              this.cadUser = false;
              this.$showToast(`Falha ao tentar salvar usuário`, "error", 4000);
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          this.$showToast(
            `Por favor preencha todos os campos corretamente`,
            "error",
            4000
          );
        }
      } else this.cadUser = true;
    },
    async modifyUser(user) {
      this.update = true;
      this.cadUser = true;
      this.loading = true;
      await this.getUser(user);
    },
    async getUser(userData) {
      this.loading = true;
      const user = this.cookies.get("loggedUser");
      const auth = `${user.tokenType} ${user.accessToken}`;
      if (userData?.id !== undefined) {
        await $fetch(`${this.baseUrl}/usuario/buscar/${userData.id}`, {
          method: "GET",
          headers: {
            Authorization: auth,
          },
        })
          .then((resp) => {
            this.form = resp.object;
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        await $fetch(`${this.baseUrl}/usuario/buscar/${user.id}`, {
          method: "GET",
          headers: {
            Authorization: auth,
          },
        })
          .then((resp) => {
            sessionStorage.setItem("userData", JSON.stringify(resp.object));
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
  },
};
</script>

<style scoped>
.header-home {
  width: 100%;
}
.searchbar {
  width: 50%;
}
.img-contact {
  border-radius: 50%;
  width: 100px;
  height: 100px;
  background-size: cover;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px auto;
}

th {
  background: #5c6bc0;
  color: white;
  font-weight: bold;
}

td,
th {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  text-align: center;
  font-size: 18px;
}
</style>