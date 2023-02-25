<template>
  <div class="anime-container">
    <AniLoading v-if="request_pending" />

    <div v-else>
      outro
    </div>
  </div>
</template>

<script>
  import { fetchAnimeById } from '../axios/api';

  export default {
    name: 'Anime',
    data() {
      return {
        request_pending: false,
        anime: {},
      }
    },

    async mounted() {
      this.request_pending = true;

      const { data } = await fetchAnimeById(this.$route.query.id);

      this.request_pending = false;
      this.anime = data;
    }
  }
</script>

<style scoped>
  .anime-container {
    height: 100vh;
  }
</style>