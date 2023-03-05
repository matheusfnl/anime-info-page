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

              <div class="anime-details w-100">
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

                <div class="d-flex">
                  <div class="anime-synopsis">
                    {{ anime.synopsis }}
                  </div>
                  
                  <div v-if="getAnimeHasTrailer" class="p-2 anime-trailer-container" @click="openTrailerModal">
                    <div class="anime-play" />
                    <div class="anime-trailer-hover" />
                    <div class="anime-trailer d-flex justify-content-center align-items-center" :style="getAnimeTrailerImage">
                      <img src="https://cdn-icons-png.flaticon.com/512/0/375.png" style="width: 48px; opacity: .6;">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="trailer-modal" :style="shouldShowModal">
      <div class="backdrop" @click="closeTrailerModal" />
      <div class="video-player">
        <iframe width="1280" height="720" :src="getAnimeHasTrailer" />
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
        
        show_modal: false,
      }
    },

    computed: {
      ...mapGetters([
        'getBackgroundColor',
        'getColorLocked',
      ]),

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

      getAnimeHasTrailer() {
        if(! this.request_pending) {
          return this.anime?.trailer?.embed_url;
        }

        return false;
      },

      getAnimeTrailerImage() {
        const { images: { medium_image_url = '' } = {} } = this.anime?.trailer || {};

        return {
          'background-image': `url(${medium_image_url})`,
        }
      },

      shouldShowModal() {
        if(this.show_modal) {
          return {
            'visibility': 'visible',
            'opacity': '1',
          }
        }

        return {
          'visibility': 'hidden',
          'opacity': '0',
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
        if(!this.getColorLocked) {
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

      openTrailerModal() {
        this.show_modal = true;
      },

      closeTrailerModal() {
        this.show_modal = false;
      }
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
      width: 100%;
      font-size: 13px;
      white-space: pre-line;
    }

    .anime-trailer {
      cursor: pointer;
      width: 200px;
      height: 133px;
      background-color: rgb(219, 219, 219);
      border: 1px solid black;
      box-shadow: 3px 3px 0px 0px black;
      background-position: center;
      background-size: cover;
      background-image: contain;
      z-index: 1;
    }

    .anime-trailer-hover {
      cursor: pointer;
      width: 200px;
      height: 133px;
      background-color: rgb(255, 255, 255);
      position: absolute;
      opacity: 0;
      transition: all .5s;
      z-index: 3;

      &:hover {
        width: 200px;
        height: 133px;
        background-color: rgb(255, 255, 255);
        position: absolute;
        opacity: .2;
      }
    }
  }

  .trailer-modal {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    width: 100%;
    height: 100vh;
    transition: visibility 0.1s linear, opacity 0.1s linear;

    .backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: black;
      opacity: .3;
    }

    .video-player {
      z-index: 1000;
      background-color: white;
      min-width: 1280px;
      min-height: 720px;
      padding: 10px 10px 2px 10px;
      border-radius: 10px;
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