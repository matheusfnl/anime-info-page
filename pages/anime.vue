<template>
  <div class="background">
    <div class="anime-container">
        <AniLoading v-if="request_pending" />

      <div v-else class="anime-content">
        outro
      </div>
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
  .background {
    background-image: linear-gradient(to right bottom, #f092e8, #ff91bc, #ffa888, #ffcf60, #ebf864);
    width: 100vw;
    height: 100vh
  }

  .anime-container {
    max-width: 2400px;
    padding: 0;
    left: 50%;
    transform: translateX(-50%);
    position: relative;
    padding-top: 60px;
  }
</style>