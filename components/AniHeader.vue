<template>
  <div class="header">
    <div class="max-width">
      <div class="header-content w-100 row">
        <div class="col-3 title">
          <span>
            AniApi
          </span>
        </div>

        <div class="col-6 justify-content-center" @mouseleave="searchNotFocus">
          <input v-model="search_string" class="input-text" type="text" placeholder="Digite o nome" @mouseover="searchFocus" />
          <div v-if="shouldShowResults" class="result-container" @click="searchFocus">
            <div class="result-here">
              View all results

              <a href="#" style="margin-left: 4px;">
                here.
              </a>
            </div>

            <hr>

            <template v-if="! request_pending">
              <div v-for="(anime, index) in getSearchResults" :key="index" class="w-100">
                <AniSearchResult :resource="anime" @click="closeResults" />
              </div>
            </template>

            <div v-if="request_pending" class="loader empty">
              <SyncLoader color="#000000" size="6px" />
            </div>

            <div v-else-if="! request_pending && ! getSearchResults.length" class="empty">
              No results.
            </div>
          </div>
        </div>

        <div class="col-3 justify-content-end">
          <div class="custom-control custom-switch toggle-switch">
            <input id="customSwitch1" v-model="lock_colors" type="checkbox" class="custom-control-input">
            <label class="custom-control-label" for="customSwitch1" />
          </div>

          <input v-model="color1" type="color" class="mr-2" :disabled="! lock_colors" :class="{'locked' : ! lock_colors}" @input="changeColor" />
          <input v-model="color2" type="color" :disabled="! lock_colors" :class="{'locked' : ! lock_colors}" @input="changeColor" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { debounce } from 'lodash';
  import { mapActions, mapGetters } from 'vuex';

  import SyncLoader from 'vue-spinner/src/SyncLoader.vue';

  import { fetchAnimeByWord } from '../axios/api'

  export default {

    components: { SyncLoader },
    data() {
      return {
        search_string: '',
        search_results: [],
        input_focus: false,
        request_pending: false,
        color1: '',
        color2: '',
        colors: [],
        lock_colors: false,
      };
    },

    computed: {
      ...mapGetters(['getBackgroundColor']),
      getSearchResults() {
        const { data = [] } = this.search_results;

        return data.slice(0, 8);
      },

      shouldShowResults() {
        return this.input_focus && this.search_string;
      },

      getSearchString() {
        return this.search_string;
      },
    },

    watch: {
      getSearchString(state) {
        if(state) {
          this.request_pending = true;

          return this.searchAnime()
        }

        this.search_results = []
        this.request_pending = false;
      },

      getBackgroundColor(state, prevState) {
        if(state !== prevState) {
          this.color1 = state[0];
          this.color2 = state[1];
        }
      },

      lock_colors(state) {
        this.setColorLocked(state);
      },
    },

    mounted() {
      this.setBackgroundColor({
        color1: '#ffffff',
        color2: '#9e9e9e ',
      });
    },

    methods: {
      ...mapActions([
        'setBackgroundColor',
        'setColorLocked',
      ]),

      searchAnime: debounce(async function () {
        this.search_results = await fetchAnimeByWord(this.search_string);
        this.request_pending = false;
      }, 800),

      searchFocus() {
        this.input_focus = true;
      },

      searchNotFocus() {
        this.input_focus = false;
      },

      closeResults() {
        this.searchNotFocus();
      },

      changeColor() {
        this.setBackgroundColor({
        color1: this.color1,
        color2: this.color2,
      });
      },
    },
  }
</script>


<style lang="scss" scoped>
  @import url('https://fonts.googleapis.com/css2?family=Caesar+Dressing&display=swap');

  .header {
    width: 100%;
    padding: 10px 30px;
    background: rgba(255,255,255,0.3);
    z-index: 1000;
    height: 60px;
    position: fixed;
  }

  .max-width {
    max-width: 1770px;
    padding: 0;
    left: 50%;
    transform: translateX(-50%);
    position: relative;
    height: 100%;
  }
  
  .header-content {
    height: inherit;

    div {
      display: flex;
      align-items: center;
    }

    .title {
      span {
        position: absolute;
        font-size: 32px;
        font-weight: bold;
        font-family: 'Caesar Dressing', cursive;
        letter-spacing: .2rem;
        color: white;
        text-shadow: 3px 3px black;
      }
    }

    .input-text {
      border: 0px solid rgba(255, 124, 72, 0.3);
      padding: 0px 10px;
      border-radius: 20px;
      width: 400px;
      height:36px;
      color: rgba(0, 0, 0, .4);
      position: relative;
      border: 1px solid rgb(71, 71, 71);
      box-shadow: 3px 3px 0px 0px rgb(71, 71, 71);
      transition: all .3s;

      &::placeholder {
        color: rgb(0, 0, 0);
        opacity: .3;
      }

      &:focus-visible {
        color: rgba(0, 0, 0, .8);
        background-color: #fff;
        outline: 0;
        outline: none;
        border: 1px solid black;
        box-shadow: 3px 3px 0px 0px black;
      }
    }

    .result-container {
      top: 37px;
      position: absolute;
      flex-direction: column;
      justify-content: start;
      align-items: flex-start;
      min-width: 340px;
      max-width: 340px;
      padding: 2px 10px;
      background-color: white;
      border-radius: 0px 0px 10px 10px;
      border-left: 1px solid black;
      border-right: 1px solid black;
      border-bottom: 1px solid black;
      box-shadow: 3px 3px 0px 0px black;

      .empty { min-height: 26px; }
      .loader {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
      }

      hr {
        border: 0;
        clear:both;
        display:block;
        width: 100%;
        background-color:#dadada;
        height: 1px;
        margin: 4px 0px;
        font-size: 0.8vw;
      }

      .result-here {
        color: rgba(0, 0, 0, .6);
        font-size: 0.8vw;
        margin: 4px 0;

        a {
          color: rgba(0, 0, 0, .8);
          font-style: italic;
        }
      }
    }
  }

  input[type="color"] {
  -webkit-appearance: none;
    border: none;
    border-radius: 3px;
    width: 24px;
    height: 24px;
    cursor: pointer;
    border: 1px solid black;
    box-shadow: 1px 1px 0px 0px black;
    transition: all .2s;
  }

  input[type="color"]:hover {
    width: 26px;
    height: 26px;
  }

  input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 1px;
    border-radius: 10px;
  }

  input[type="color"]::-webkit-color-swatch {
    border: none;
    border-radius: 3px;
  }

  .toggle-switch {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(-200%, -100%);
  }

  .locked { opacity: .5; }
</style>