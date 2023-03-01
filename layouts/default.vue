<template>
  <div>
    <AniHeader v-if="shouldShowHeader" class="header" />
    <Nuxt />
  </div>
</template>

<script>
  export default {
    computed: {
      shouldShowHeader() {
        return this.$route.path !== '/';
      },
    }
  }
</script>


<style>
  .header { position: absolute; }
  html { font-family: "Quicksand"; }
</style>
