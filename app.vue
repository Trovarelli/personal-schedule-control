<template>
  <div>
    <navbar v-if="indexRoute"></navbar>
    <div class="body">
      <div>
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    indexRoute() {
      return this.$route.name !== "index" && this.$route.name !== "403";
    },
  },
};
</script>

<style scoped>
.body {
  margin: auto;
}
</style>
