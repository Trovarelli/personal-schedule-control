<template>
  <div class="container d-flex flex-column justify-center align-end mt-12">
    <v-dialog v-model="dialog" width="500" persistent>
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
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="red-darken-4"
            text
            @click="dialog = false"
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
            v-model="form.email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>
          <v-text-field
            color="indigo"
            v-model="form.pessoa.nome"
            :rules="nomeRules"
            label="Nome"
            required
          ></v-text-field>
          <v-text-field
            v-maska="'###.###.###-##'"
            color="indigo"
            v-model="form.pessoa.cpf"
            :rules="required"
            label="CPF"
            required
          ></v-text-field>
          <v-text-field
            color="indigo"
            v-model="form.tag"
            :rules="required"
            label="Tag (de onde se conhecem)"
            required
          ></v-text-field>
          <v-text-field
            color="indigo"
            v-maska="'(##) # ####-####'"
            v-model="form.telefone"
            :rules="required"
            label="Telefone"
            required
          ></v-text-field>
          <v-text-field
            color="indigo"
            v-model="form.tipoContato"
            :rules="required"
            label="Tipo de contato (telefone, email etc..)"
            required
          ></v-text-field>
          <v-file-input
            accept="image/*"
            label="Foto"
            :rules="required"
            v-model="file"
          ></v-file-input>
          <v-card-title class="text-h5 grey lighten-2"> Endereço </v-card-title>
          <v-text-field
            color="indigo"
            v-model="form.pessoa.endereco.bairro"
            :rules="required"
            label="Bairro"
            required
          ></v-text-field>
          <v-text-field
            v-maska="'#####-###'"
            color="indigo"
            v-model="form.pessoa.endereco.cep"
            :rules="required"
            label="CEP"
            required
          ></v-text-field>
          <v-text-field
            color="indigo"
            v-model="form.pessoa.endereco.cidade"
            :rules="required"
            label="Cidade"
            required
          ></v-text-field>
          <v-text-field
            color="indigo"
            v-model="form.pessoa.endereco.estado"
            :rules="required"
            label="Estado"
            required
          ></v-text-field>
          <v-text-field
            color="indigo"
            v-model="form.pessoa.endereco.logradouro"
            :rules="required"
            label="Logradouro"
            required
          ></v-text-field>
          <v-text-field
            color="indigo"
            v-model="form.pessoa.endereco.numero"
            :rules="required"
            label="Némero"
            required
          ></v-text-field>
          <v-text-field
            color="indigo"
            v-model="form.pessoa.endereco.pais"
            :rules="required"
            label="País"
            required
          ></v-text-field>
        </v-form>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="success"
            text
            @click="createContact"
            :disabled="loading"
          >
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
import { maska } from "maska";
import { useCookies } from "vue3-cookies";
import { useContactStore } from "~/store/contacts";
export default {
  directives: { maska },
  setup() {
    const { cookies } = useCookies();
    const contactStore = useContactStore();
    return { contactStore }, { cookies };
  },

  data: () => ({
    valid: true,
    dialog: false,
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
      email: "neto4971@gmail.com",
      pessoa: {
        cpf: "222.522.399-02",
        endereco: {
          bairro: "Santa Clara",
          cep: "17255214",
          cidade: "Bariri",
          estado: "São Paulo",
          logradouro: "Rua José Gonçalvez",
          numero: 401,
          pais: "Brasil",
        },
        foto: {
          id: "1212",
          name: "teste",
          type: "",
        },
        nome: "Neto",
      },
      privado: true,
      tag: "Encontros na rua",
      telefone: "14991886974",
      tipoContato: "CELULAR",
      usuario: {
        cpf: "091.958.580-91",
        dataNascimento: "1995-05-19",
        email: "neto49712@gmail.com",
        nome: "testeASD3123",
        password: "123456",
        telefone: "14991886974",
        username: "testeDASE132",
      },
    },
    search: "",
    baseUrl: "https://metawaydemo.vps-kinghost.net:8485/api",
    contacts: [],
    loading: false,
    fotos: [],
    contactsFavorites: [],
    file: [],
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
  },

  methods: {
    //TODO cadastro de contatos :(
    // selectImage(image) {
    //   if (image !== undefined) {
    //     const type = image?.type.split("/");
    //     if (type[0] === "image") {
    //       this.previewImage.grupo_bike = URL.createObjectURL(image);
    //       this.$store.commit("bike/SET_CHANGE_IMAGE", true);
    //       this.$store.commit("bike/SET_INVALID_FILE", false);
    //     } else {
    //       this.previewImage.grupo_bike = [];
    //       this.$store.commit("bike/SET_INVALID_FILE", true);
    //       this.$toast.warning(
    //         "Por favor, insira uma imagem condizente com os formatos png ou jpg ou jpeg"
    //       );
    //     }
    //   }
    // },
    async registerPerson() {
      const user = this.cookies.get("loggedUser");
      const auth = `${user.tokenType} ${user.accessToken}`;
      const payload = {
        tipos: ["ROLE_USER"],
        usuario: this.usuario,
      };

      await $fetch(`${this.baseUrl}/pessoa/salvar`, {
        method: "POST",
        headers: {
          Authorization: auth,
        },
        body: payload,
      })
        .then((resp) => {
          this.form.pessoa = resp.object.pessoa;
        })
        .catch((err) => console.log(err));
    },
    async registerUser() {
      const user = this.cookies.get("loggedUser");
      const auth = `${user.tokenType} ${user.accessToken}`;
      const payload = {
        tipos: ["ROLE_USER"],
        usuario: this.form.usuario,
      };

      await $fetch(`${this.baseUrl}/usuario/salvar`, {
        method: "POST",
        headers: {
          Authorization: auth,
        },
        body: payload,
      })
        .then((resp) => {
          this.form.usuario = resp.object.usuario;
        })
        .catch((err) => console.log(err));
    },
    async createContact() {
      if (this.dialog) {
        const user = this.cookies.get("loggedUser");
        const auth = `${user.tokenType} ${user.accessToken}`;
        const foto = {
          file: this.file[0],
          id: 19,
        };
        const payload = this.form.pessoa;
        await $fetch(`${this.baseUrl}/foto/upload/19`, {
          method: "POST",
          headers: {
            Authorization: auth,
            "Content-Type":
              "multipart/form-data -F foto=@1.jpg;type=image/jpeg",
          },
          body: foto,
        })
          .then((resp) => {
            console.log(resp);
          })
          .catch((err) => {
            console.log(err);
          });
        await $fetch(`${this.baseUrl}/pessoa/salvar`, {
          method: "POST",
          headers: {
            Authorization: auth,
          },
          body: payload,
        })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      } else this.dialog = true;
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
      await $fetch(`${this.baseUrl}/usuario/buscar/22`, {
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