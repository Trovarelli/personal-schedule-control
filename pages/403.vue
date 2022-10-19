<template>
  <section class="page_403">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <div class="col-sm-10 col-sm-offset-1 text-center">
            <div class="four_zero_four_bg">
              <h1 class="text-center">403</h1>
            </div>

            <div class="contant_box_403">
              <h3 class="h2 py-2">Ops! parece que voce se perdeu</h3>

              <p>
                Desculpe, mas você não tem permissão para acessar essa página
              </p>

              <v-btn
                class="my-5"
                color="indigo-lighten-1 "
                outlined
                fab
                @click="this.$router.push('/')"
                >Volte e faça o login</v-btn
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page_403 {
  padding: 40px 0;
  background: #fff;
}

.page_403 img {
  width: 100%;
}

.four_zero_four_bg {
  background-image: url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif);
  height: 400px;
  background-position: center;
}

.four_zero_four_bg h1 {
  font-size: 80px;
}

.four_zero_four_bg h3 {
  font-size: 80px;
}

.link_403 {
  color: #fff !important;
  padding: 10px 20px;
  background: #39ac31;
  margin: 20px 0;
  display: inline-block;
}
.contant_box_403 {
  margin-top: -50px;
}
</style>