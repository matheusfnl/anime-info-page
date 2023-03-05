<template>
  <div>
    <div class="background-transition" :style="getBackgroundTransition" />
    <div ref="backgroundColor" class="background" :style="getNewBackgroundColor" />
    <div class="overlay"></div>

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
  import { mapGetters, mapActions } from 'vuex';
  import ColorThief from 'colorthief/dist/color-thief.umd.js';

  import { fetchAnimeById } from '../axios/api';

  export default {
    name: 'Anime',
    data() {
      return {
        request_pending: false,
        anime: {},
        key: 0,
        colors: [
          {
            color1: '#ffffff',
            color2: '#9e9e9e',
          },

          {
            color1: '#ffffff',
            color2: '#9e9e9e',
          },
        ],
      }
    },

    computed: {
      ...mapGetters(['getBackgroundColor']),
      getImageSrc() {
        return this.anime?.images?.webp?.large_image_url || {};
      },

      getNewBackgroundColor() {
        if(this.key === 0) {
          return {
            'background-image': `linear-gradient(to right top, ${this.colors[0].color1}, ${this.colors[0].color2})`,
            'opacity': '1',
          };
        }

        return {
          'background-image': `linear-gradient(to right top, ${this.colors[1].color1}, ${this.colors[1].color2})`,
          'opacity': '0',
        }
      },

      getBackgroundTransition() {
        if(this.key === 0) {
          return {
            'background-image': `linear-gradient(to right top, ${this.colors[1].color1}, ${this.colors[1].color2})`,
            'opacity': '0',
          };
        }

        return {
          'background-image': `linear-gradient(to right top, ${this.colors[0].color1}, ${this.colors[0].color2})`,
          'opacity': '1',
        }
      },
    },

    watch: {
      getBackgroundColor(state, prev_state) {
        if(state !== prev_state) {
          this.colors = [
            {
              color1: state[0],
              color2: state[1],
            },

            {
              color1: prev_state[0] || '#ffffff',
              color2: prev_state[1] || '#9e9e9e',
            },
          ]
        }
      },

      getImageSrc(state) {
        if(state) {
          this.$refs.animebackground.style.backgroundImage = `url(${state})`;

          const animeImage = this.$refs.animebackground;
          const colorThief = new ColorThief();
          const backgroundImageUrl = getComputedStyle(animeImage).backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2').split(',')[0];
          const image = new Image();

          image.crossOrigin = 'Anonymous';
          image.src = backgroundImageUrl;

          image.addEventListener('load', () => {
            const palette = colorThief.getPalette(image, 2);
            const sortedPalette = palette.sort((a, b) => b[0] - a[0]);

            const colors = []

            sortedPalette.forEach((palette) => {
              const r = palette[0].toString(16).padStart(2, '0');
              const g = palette[1].toString(16).padStart(2, '0');
              const b = palette[2].toString(16).padStart(2, '0');

              colors.push('#' + r + g + b);
            });

            this.key = this.key === 0 ? this.key = 1 : this.key = 0;

            this.setBackgroundColor({
              color1: colors[0],
              color2: colors[1],
            })
          });
        }
      },
    },

    mounted() {
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
      ...mapActions(['setBackgroundColor']),
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
  .background, .background-transition {
    width: 100vw;
    height: 100vh;
    position: fixed;
    overflow-x: hidden;
    overflow-y: auto;
    transition: opacity 1s;
  }

  .overlay {
    background-image: url(../assets/images/halftone.png);
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    // opacity: .5;
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
      border: 1px solid black;
      box-shadow: 3px 3px 0px 0px black;
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
        border: 1px solid black;
        box-shadow: 3px 3px 0px 0px black;
      }
    }
  }

  .anime-image {
    width: 20%;
    border-radius: 10px;
    margin-right: 20px;
    z-index: 10;
    border: 1px solid black;
    box-shadow: 3px 3px 0px 0px black;
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