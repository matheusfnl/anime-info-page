<template>
  <div class="centralize">
    <SyncLoader :color="color" />
  </div>
</template>

<script>
  import SyncLoader from 'vue-spinner/src/SyncLoader.vue';

  import { fetchRandomAnime } from '../axios/api';

  export default {
    components: { SyncLoader },
    props: {
      color: {
        type: String,
        default: '#ffffff',
      }
    },

    data() {
      return {
        anime: {},
        request_pending: false,
      };
    },

    watch: {
      anime(state) {
        if(Object.keys(state).length !== 0) {
          this.$router.push({ path: `/anime?id=${state.mal_id}` })
        }
      }
    },

    async mounted() {
      const { data } = await fetchRandomAnime();

      this.anime = data;
    },
  }
</script> 

<style scoped>
  .centralize {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
</style>