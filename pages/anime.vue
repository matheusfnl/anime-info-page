<template>
  <div ref="backgroundColor" class="background">
    <AniLoading v-if="request_pending" />
    
    <div v-show="!request_pending" class="anime-container">
      <div class="row mx-3">
        <div class="back-margin col-2 pr-4">
          <div class="back-container-categories">
            Categorias
          </div>
        </div>

        <div class="back-margin col-10">
          <div ref="animebackground" class="back-container-anime">
            <div class="d-flex">
              <img :src="getImageSrc" class="anime-image">

              <div class="anime-details">
                <div class="anime-title">
                  {{  anime.title  }}
                </div>

                <div class="anime-stats">
                  <span>
                    Score: {{ anime.score }} •
                  </span>

                  <span>
                    {{ anime.duration }} •
                  </span>

                  <span>
                    {{ getFormattedDate(anime.aired) }}
                  </span>
                </div>

                <hr>

                <div class="anime-synopsis">
                  {{ anime.synopsis }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
import { fetchAnimeById } from '../axios/api';

  export default {
    name: 'Anime',
    data() {
      return {
        request_pending: false,
        anime: {},
      }
    },

    computed: {
      ...mapGetters(['getBackgroundColor']),
      getImageSrc() {
        return this.anime?.images?.webp?.large_image_url || {};
      }
    },

    watch: {
      getImageSrc(state) {
        if(state) {
          this.$refs.animebackground.style.backgroundImage = `url(${state})`;
        }
      },

      getBackgroundColor() {
        this.$refs.backgroundColor.style.backgroundImage = `linear-gradient(to right top, ${this.getBackgroundColor[0]}, ${this.getBackgroundColor[1]})`
      }
    },

    mounted() {
      this.$refs.backgroundColor.style.backgroundImage = `linear-gradient(to right top, ${this.getBackgroundColor[0]}, ${this.getBackgroundColor[1]})`

      this.$watch(
        () => this.$route.params,
        async () => {
          this.request_pending = true;

          const { data } = await fetchAnimeById(this.$route.query.id);

          this.request_pending = false;
          this.anime = data;
        },
        { immediate: true },
      );
    },

    methods: {
      getFormattedDate(date) {
        if(date) {
          const { prop: { from: { day, month, year } } } = date;
          const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sept',
            'Oct',
            'Nov',
            'Dec',
          ]
  
          return `${months[month - 1]} ${day}, ${year}`
        }

        return '';
      },
    }
  }
</script>

<style lang="scss" scoped>
  .background {
    // background-image: linear-gradient(to right top, #2e4e30, #403866);
    width: 100vw;
    height: 100vh;
    position: fixed;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .anime-container {
    max-width: 1770px;
    padding: 0;
    left: 50%;
    transform: translateX(-50%);
    position: relative;
    padding-top: 60px;
  }

  .back-margin {
    padding: 20px 0px;

    .back-container-categories {
      padding: 20px;
      background-color: white;
      width: 100%;
      border-radius: 10px;
    }
    .back-container-anime {
      padding: 20px;
      background-color: white;
      width: 100%;
      border-radius: 10px;

      &:before {
        margin-top: 20px;
        border-radius: 10px;
        content: ' ';
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        opacity: 1;
        background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%,rgba(255, 255, 255, 1) 200px,rgba(255, 255, 255, 1) 100%);
        backdrop-filter: blur(5px);
      }
    }
  }

  .anime-image {
    width: 20%;
    border-radius: 10px;
    margin-right: 20px;
    z-index: 10;
  }

  .anime-details {
    display: flex;
    flex-direction: column;
    z-index: 10;

    .anime-title { font-size: 32px; }
    .anime-stats { color: rgb(82, 82, 82); }
    .anime-synopsis {
      font-size: 13px;
      white-space: pre-line;
    }
  }

  hr {
    border: 0;
    clear:both;
    display:block;
    width: 100%;
    background-color:#6e6e6e;
    height: 1px;
    margin: 4px 0px 0px 0px;
    font-size: 0.8vw;
  }
</style>