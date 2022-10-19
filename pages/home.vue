<template>
  <div class="container d-flex flex-column justify-center align-end mt-12">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="mx-2"
          @click="createContact()"
          elevation="0"
          color="success"
          v-bind="attrs"
          v-on="on"
        >
          Adicionar Contato
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Cadastrar contato
        </v-card-title>

        <v-form ref="form" v-model="valid" lazy-validation class="pa-7">
          <v-text-field
            color="indigo"
            v-model="form.email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>

          <v-text-field
            color="indigo"
            v-model="form.pessoa.cpf"
            :rules="cpfRules"
            label="CPF"
            required
          ></v-text-field>

          <v-text-field
            color="indigo"
            v-model="form.pessoa.endereco"
            :rules="cpfRules"
            label="CPF"
            required
          ></v-text-field>
        </v-form>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" text @click="dialog = false">
            Adicionar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <table>
      <thead>
        <tr>
          <th>Contato</th>
          <th>Telefone</th>
          <th>Email</th>
          <th>Favorito</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tr v-for="(contact, index) in contacts" :key="contact.id">
        <td class="d-flex flex-column justify-center align-center">
          <img
            :src="fotos[index]"
            width="100"
            height="100"
            class="img-contact"
          />
        </td>
        <td>{{ contact.telefone }}</td>
        <td>{{ contact.email }}</td>
        <td>
          <v-btn
            @click="favorite(contact)"
            elevation="0"
            :color="contact.favorito ? 'red' : 'grey'"
          >
            <v-icon color="white">mdi-heart</v-icon>
          </v-btn>
        </td>
        <td>
          <v-btn
            class="mx-2"
            @click="favorite(contact)"
            elevation="0"
            color="amber"
          >
            Alterar
          </v-btn>
          <v-btn
            class="mx-2"
            @click="removeContact(contact.id)"
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
import { useCookies } from "vue3-cookies";
import { useContactStore } from "~/store/contacts";
export default {
  setup() {
    const { cookies } = useCookies();
    const contactStore = useContactStore();
    return { contactStore }, { cookies };
  },

  data: () => ({
    dialog: false,
    form: {
      email: "",
      pessoa: {
        cpf: "",
        endereco: {
          bairro: "",
          cep: "",
          cidade: "",
          estado: "",
          logradouro: "",
          numero: 0,
          pais: "",
        },
        foto: {
          name: "",
          type: "",
        },
        nome: "",
      },
      privado: true,
      tag: "",
      telefone: "",
      tipoContato: "",
      usuario: {},
    },
    search: "",
    baseUrl: "https://metawaydemo.vps-kinghost.net:8485/api",
    contacts: [],
    loading: false,
    fotos: [],
    contactsFavorites: [],
  }),

  async beforeMount() {
    window.test = this;
    const userCookie = this.cookies.get("userAuth");
    if (userCookie !== "authenticated") {
      this.$router.push("/403");
    }
  },

  async mounted() {
    await this.getFavorite();
    await this.getUser();
  },

  methods: {
    async createContact() {
      this.dialog = true;
      // const payload = contact;
      // delete payload.favorito;
      // await $fetch(`${this.baseUrl}/favorito/salvar`, {
      //   method: "POST",
      //   headers: {
      //     Authorization: auth,
      //   },
      //   body: payload,
      // })
      //   .then(() => {
      //     contact.favorito = true;
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    },
    async removeContact(id) {
      const user = this.cookies.get("loggedUser");
      const auth = `${user.tokenType} ${user.accessToken}`;
      await $fetch(`${this.baseUrl}/favorito/remover/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: auth,
        },
      })
        .then(() => {
          this.getFavorite();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async favorite(contact) {
      const user = this.cookies.get("loggedUser");
      const auth = `${user.tokenType} ${user.accessToken}`;
      if (contact.favorito) {
        await $fetch(`${this.baseUrl}/favorito/remover/${contact.id}`, {
          method: "DELETE",
          headers: {
            Authorization: auth,
          },
        })
          .then(() => {
            contact.favorito = false;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        const payload = contact;
        delete payload.favorito;
        await $fetch(`${this.baseUrl}/favorito/salvar`, {
          method: "POST",
          headers: {
            Authorization: auth,
          },
          body: payload,
        })
          .then(() => {
            contact.favorito = true;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    async getFavorite() {
      this.loading = true;
      const user = this.cookies.get("loggedUser");
      const auth = `${user.tokenType} ${user.accessToken}`;
      await $fetch(`${this.baseUrl}/favorito/pesquisar`, {
        method: "GET",
        headers: {
          Authorization: auth,
        },
      })
        .then((resp) => {
          this.contactsFavorites = resp;

          console.log(this.contactsFavorites);
          this.getContacts();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
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
      await $fetch(`${this.baseUrl}/foto/download/${id}`, {
        method: "GET",
        headers: {
          Authorization: auth,
        },
      })
        .then((resp) => {
          console.log(resp);
          const img = URL.createObjectURL(resp);
          this.fotos.push(img);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async getContacts() {
      this.loading = true;
      const user = this.cookies.get("loggedUser");
      const auth = `${user.tokenType} ${user.accessToken}`;
      await $fetch(`${this.baseUrl}/contato/listar/${user.id}`, {
        method: "GET",
        headers: {
          Authorization: auth,
        },
      })
        .then((resp) => {
          resp.forEach(async (el) => {
            await this.getFoto(el.pessoa.id);
            if (this.contactsFavorites.some((el2) => el2.id === el.id)) {
              el.favorito = true;
              this.contacts.push(el);
            } else {
              el.favorito = false;
              this.contacts.push(el);
            }
          });
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

<style scoped>
.img-contact {
  border-radius: 50%;
}
.container {
  padding: 50px 4vw 0 4vw;
}
table {
  width: 90vw;
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