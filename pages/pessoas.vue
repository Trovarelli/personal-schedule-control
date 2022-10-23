<template>
  <div class="container d-flex flex-column justify-center align-end mt-12">
    <div class="header-home text-center">
      <h1>Pessoas</h1>
      <div>
        Olá, aqui você tera autonomia necessária para criar, atualizar e remover
        registros de pessoas :)
      </div>
    </div>
    <v-dialog v-model="cadPerson" width="500" persistent>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="mx-2"
          @click="createPerson"
          elevation="0"
          color="success"
          v-bind="attrs"
          v-on="on"
        >
          Incluir pessoa
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
          Cadastrar Pessoa
        </v-card-title>

        <v-form ref="form" v-model="valid" lazy-validation class="pa-7">
          <v-text-field
            color="indigo"
            v-model="form.nome"
            :rules="nomeRules"
            label="Nome"
            required
          ></v-text-field>
          <v-text-field
            v-maska="'###.###.###-##'"
            color="indigo"
            v-model="form.cpf"
            :rules="required"
            label="CPF"
            required
          ></v-text-field>
          <v-card-title class="text-h5 grey lighten-2"> Endereço </v-card-title>
          <v-text-field
            v-maska="'#####-###'"
            color="indigo"
            v-model="form.endereco.cep"
            :rules="required"
            label="CEP"
            required
          ></v-text-field>
          <v-text-field
            color="indigo"
            v-model="form.endereco.logradouro"
            :rules="required"
            label="Logradouro"
            required
          ></v-text-field>
          <v-text-field
            color="indigo"
            v-model="form.endereco.numero"
            :rules="required"
            label="Número"
            required
          ></v-text-field>
          <v-text-field
            color="indigo"
            v-model="form.endereco.bairro"
            :rules="required"
            label="Bairro"
            required
          ></v-text-field>
          <v-text-field
            color="indigo"
            v-model="form.endereco.cidade"
            :rules="required"
            label="Cidade"
            required
          ></v-text-field>
          <v-text-field
            color="indigo"
            v-model="form.endereco.estado"
            :rules="required"
            label="Estado"
            required
          ></v-text-field>

          <v-text-field
            color="indigo"
            v-model="form.endereco.pais"
            :rules="required"
            label="País"
            required
          ></v-text-field>
        </v-form>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="success" text @click="createPerson" :disabled="loading">
            Adicionar
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
          <th>Pessoa</th>
          <th>Nome</th>
          <th>CPF</th>
          <th>Endereço</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tr v-if="personsFiltered.length === 0">
        <td colspan="5">Nenhum registro encontrado :(</td>
      </tr>
      <tr v-else v-for="person in personsFiltered" :key="person.id">
        <td class="d-flex flex-column justify-center align-center">
          <div
            :style="`background-image:url('${person.fotoPerfil}')`"
            width="100"
            height="100"
            class="img-contact"
          ></div>
        </td>
        <td>{{ person.nome }}</td>
        <td>{{ person.cpf }}</td>
        <td>
          {{ `${person.endereco.estado}, ${person.endereco.pais}` }}
        </td>
        <td>
          <v-btn
            class="mx-2"
            @click="modifyPerson(person)"
            elevation="0"
            color="amber"
          >
            Alterar
          </v-btn>
          <v-btn
            class="mx-2"
            @click="removePerson(person.id)"
            elevation="0"
            color="red-darken-4"
          >
            Remover
          </v-btn>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { maska } from "maska";
import { useCookies } from "vue3-cookies";

export default {
  directives: { maska },
  setup() {
    const { cookies } = useCookies();

    return { cookies };
  },

  data: () => ({
    valid: true,
    cadPerson: false,
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
      nome: "",
      cpf: "",
      endereco: {
        bairro: "",
        cep: "",
        cidade: "",
        estado: "",
        logradouro: "",
        numero: "",
        pais: "",
      },
      foto: null,
    },
    search: "",
    baseUrl: "https://metawaydemo.vps-kinghost.net:8485/api",
    persons: [],
    personsFiltered: [],
    loading: false,
    fotos: [],
    file: null,
    update: false,
  }),

  watch: {
    search(v) {
      if (v === "") {
        this.personsFiltered = this.persons;
      } else {
        this.personsFiltered = this.persons.filter((el) => {
          return el.nome.toLowerCase().includes(v.toLowerCase());
        });
      }
    },
  },

  async beforeMount() {
    const userCookie = this.cookies.get("userAuth");
    if (userCookie !== "authenticated") {
      this.$router.push("/403");
    }
  },

  async mounted() {
    await this.getUser();
    await this.getPersons();
  },

  created() {
    this.$watch("form.endereco.cep", async (cep) => {
      if (cep.length === 9) {
        this.loading = true;
        await $fetch(`https://cdn.apicep.com/file/apicep/${cep}.json`, {
          method: "GET",
        })
          .then((resp) => {
            const address = {
              cep: resp.code,
              logradouro: resp.address,
              bairro: resp.district,
              cidade: resp.city,
              estado: resp.state,
              pais: "Brasil",
            };

            this.form.endereco = address;
          })
          .catch((resp) => {
            console.log(resp);
            this.$showToast(`Cep não encontrado`, "error", 4000);
          })
          .finally(() => (this.loading = false));
      }
    });
  },

  methods: {
    cancelEdit() {
      this.cadPerson = false;
      this.form = {
        nome: "",
        cpf: "",
        endereco: {
          bairro: "",
          cep: "",
          cidade: "",
          estado: "",
          logradouro: "",
          numero: "",
          pais: "",
        },
        foto: null,
      };
    },
    async getPersons() {
      this.loading = true;
      const user = this.cookies.get("loggedUser");
      const auth = `${user.tokenType} ${user.accessToken}`;
      await $fetch(`${this.baseUrl}/pessoa/pesquisar`, {
        method: "POST",
        headers: {
          Authorization: auth,
        },
        body: {
          nome: "",
        },
      })
        .then((resp) => {
          resp.forEach(async (el) => {
            el.fotoPerfil = await this.getFoto(el.id);
            this.persons.push(el);
          });
          this.persons = this.persons.sort((a, b) => {
            return b.id - a.id;
          });
          this.personsFiltered = this.persons;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async removePerson(id) {
      const user = this.cookies.get("loggedUser");
      const auth = `${user.tokenType} ${user.accessToken}`;
      await $fetch(`${this.baseUrl}/pessoa/remover/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: auth,
        },
      })
        .then(() => {
          this.personsFiltered = this.personsFiltered.filter((el) => {
            return el.id !== id;
          });
          this.$showToast(`Registro removido com sucesso`, "success", 4000);
        })
        .catch((err) => {
          console.log(err);
          this.$showToast(
            `Falha ao realizar ação, tente novamente mais tarde`,
            "error",
            4000
          );
        });
    },
    async createPerson() {
      if (this.cadPerson) {
        const valid = await this.$refs.form.validate();
        console.log(valid);
        if (valid.valid) {
          this.loading = true;
          this.update = false;
          const user = this.cookies.get("loggedUser");
          const auth = `${user.tokenType} ${user.accessToken}`;
          const payload = this.form;
          await $fetch(`${this.baseUrl}/pessoa/salvar`, {
            method: "POST",
            headers: {
              Authorization: auth,
            },
            body: payload,
          })
            .then(async () => {
              await this.getPersons();
              this.update = false;
              this.cadPerson = false;
              this.$showToast(`Registro salvo com sucesso!`, "success", 4000);
            })
            .catch((err) => {
              console.log(err);
              this.cadPerson = false;
              this.$showToast(`Falha ao tentar salvar registro`, "error", 4000);
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
      } else this.cadPerson = true;
    },
    async modifyPerson(person) {
      console.log(person);
      this.update = true;
      this.cadPerson = true;
      this.form = person;
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
          this.form.usuario = resp.object.usuario;
          sessionStorage.setItem("userData", JSON.stringify(resp.object));
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async getFoto(id) {
      this.loading = true;
      const user = this.cookies.get("loggedUser");
      const auth = `${user.tokenType} ${user.accessToken}`;
      const foto = await $fetch(`${this.baseUrl}/foto/download/${id}`, {
        method: "GET",
        headers: {
          Authorization: auth,
        },
      })
        .then((resp) => {
          const img = URL.createObjectURL(resp);
          return img;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });

      return foto;
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