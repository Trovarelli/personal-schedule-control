<template>
  <div class="container d-flex flex-column justify-center align-end mt-12">
    <div class="header-home text-center">
      <h1>Contatos</h1>
      <div>
        Olá, aqui você terá autonomia necessária para criar, atualizar e remover
        contatos relacionados a sua conta :)
      </div>
    </div>
    <v-dialog v-model="cadPessoa" width="500" persistent>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="mx-2"
          @click="createContact"
          elevation="0"
          color="success"
          v-bind="attrs"
          v-on="on"
          :disabled="loading"
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
            @click="cadPessoa = false"
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
          <!-- <v-file-input
            :rules="imgRules"
            accept="image/png, image/jpeg, image/bmp"
            placeholder="Pick an avatar"
            prepend-icon="mdi-camera"
            label="Avatar"
            v-model="file"
          ></v-file-input> -->
          <v-card-title class="text-h5 grey lighten-2"> Endereço </v-card-title>
          <v-text-field
            v-maska="'#####-###'"
            color="indigo"
            v-model="form.pessoa.endereco.cep"
            :rules="required"
            label="CEP"
            required
            :disabled="loading"
          ></v-text-field>
          <v-text-field
            color="indigo"
            v-model="form.pessoa.endereco.logradouro"
            :rules="required"
            label="Logradouro"
            required
            :disabled="loading"
          ></v-text-field>
          <v-text-field
            color="indigo"
            v-model="form.pessoa.endereco.numero"
            :rules="required"
            label="Número"
            required
          ></v-text-field>
          <v-text-field
            color="indigo"
            v-model="form.pessoa.endereco.bairro"
            :rules="required"
            label="Bairro"
            required
            :disabled="loading"
          ></v-text-field>
          <v-text-field
            color="indigo"
            v-model="form.pessoa.endereco.cidade"
            :rules="required"
            label="Cidade"
            required
            :disabled="loading"
          ></v-text-field>
          <v-text-field
            color="indigo"
            v-model="form.pessoa.endereco.estado"
            :rules="required"
            label="Estado"
            required
            :disabled="loading"
          ></v-text-field>

          <v-text-field
            color="indigo"
            v-model="form.pessoa.endereco.pais"
            :rules="required"
            label="País"
            required
            :disabled="loading"
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
          <th>Contato</th>
          <th>Telefone</th>
          <th>Email</th>
          <th>Favorito</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tr v-if="contactsFiltered.length === 0">
        <td colspan="5">Nenhum contato encontrado :(</td>
      </tr>
      <tr v-else v-for="contact in contactsFiltered" :key="contact.id">
        <td class="d-flex flex-column justify-center align-center">
          <div
            :style="`background-image:url('${contact.fotoPerfil}')`"
            width="100"
            height="100"
            class="img-contact"
          ></div>
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
            @click="modifyContact(contact.email)"
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
    cadUsuario: false,
    cadPessoa: false,
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
      email: "",
      pessoa: {
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
      privado: true,
      tag: "",
      telefone: "",
      tipoContato: "",
      usuario: {},
    },
    search: "",
    baseUrl: "https://metawaydemo.vps-kinghost.net:8485/api",
    contacts: [],
    contactsFiltered: [],
    loading: false,
    fotos: [],
    contactsFavorites: [],
    file: null,
    update: false,
  }),

  watch: {
    //TODO cadastro de contatos e cadastro de imagens

    search(v) {
      if (v === "") {
        this.contactsFiltered = this.contacts;
      } else {
        this.contactsFiltered = this.contacts.filter((el) => {
          return el.email.toLowerCase().includes(v.toLowerCase());
        });
      }
    },
  },

  created() {
    this.$watch("form.pessoa.endereco.cep", async (cep) => {
      if (cep.length >= 9) {
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

            this.form.pessoa.endereco = address;
          })
          .catch((resp) => {
            console.log(resp);
            this.$showToast(`Cep não encontrado`, "error", 4000);
          })
          .finally(() => (this.loading = false));
      }
    });
  },

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
            if (this.contactsFavorites.some((el2) => el2.id === el.id)) {
              el.fotoPerfil = await this.getFoto(el.pessoa.id);
              el.favorito = true;
              this.contacts.push(el);
            } else {
              el.fotoPerfil = await this.getFoto(el.pessoa.id);
              el.favorito = false;
              this.contacts.push(el);
            }
          });
          this.contacts = this.contacts.sort((a, b) => {
            return Number(a) - Number(b);
          });
          this.contactsFiltered = this.contacts;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async deleteContact(id) {
      const user = this.cookies.get("loggedUser");
      const auth = `${user.tokenType} ${user.accessToken}`;
      await $fetch(`${this.baseUrl}/contato/remover/${id}`, {
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
    async updateContact() {
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
          await this.getFavorite();
          await this.getUser();
          this.update = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async createContact() {
      if (this.cadPessoa && !this.update) {
        const user = this.cookies.get("loggedUser");
        const auth = `${user.tokenType} ${user.accessToken}`;
        const payload = this.form.pessoa;
        await $fetch(`${this.baseUrl}/pessoa/salvar`, {
          method: "POST",
          headers: {
            Authorization: auth,
          },
          body: payload,
        })
          .then(async (resp) => {
            this.form.pessoa = resp.object;
            if (this.file !== null) {
              await $fetch(`${this.baseUrl}/foto/upload/${resp.object.id}`, {
                method: "POST",
                headers: {
                  Authorization: auth,
                  "Content-Type":
                    "multipart/form-data -F foto=@1.jpg;type=image/jpeg",
                },
                body: {
                  foto: this.file,
                },
              })
                .then(async () => {
                  await this.getFavorite();
                  await this.getUser();
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              await $fetch(`${this.baseUrl}/contato/salvar`, {
                method: "POST",
                headers: {
                  Authorization: auth,
                  "Content-Type":
                    "multipart/form-data -F foto=@1.jpg;type=image/jpeg",
                },
                body: this.form,
              })
                .then(async () => {
                  await this.getFavorite();
                  await this.getUser();
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (this.cadPessoa && this.update) {
        this.updateContact();
      } else this.cadPessoa = true;
    },
    async modifyContact(email) {
      this.update = true;
      const user = this.cookies.get("loggedUser");
      const auth = `${user.tokenType} ${user.accessToken}`;
      await $fetch(`${this.baseUrl}/contato/pesquisar`, {
        method: "POST",
        headers: {
          Authorization: auth,
        },
        body: {
          termo: email,
        },
      })
        .then((resp) => {
          this.form = resp[0];
          this.cadPessoa = true;
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