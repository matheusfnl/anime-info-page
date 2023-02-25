<template>
  <div class="header">
    <div class="max-width">
      <div class="header-content w-100 row">
        <div class="col-3 title">
          <span>
            AniApi
          </span>
        </div>

        <div class="col-6 justify-content-center">
          <input v-model="search_string" class="input-text" type="text" placeholder="Digite o nome" @focus="searchFocus" @blur="searchNotFocus" />
          <div v-if="shouldShowResults" class="result-container" @click="searchFocus">
            <template v-if="! request_pending">
              <div v-for="(anime, index) in getSearchResults" :key="index" class="w-100">
                <AniSearchResult :resource="anime" />
              </div>
            </template>

            <div v-if="request_pending" class="loader empty">
              <SyncLoader color="#ff91bc" size="4px" />
            </div>

            <div v-else-if="! request_pending && ! getSearchResults.length" class="empty">
              No results.
            </div>

            <hr>

            <div class="result-here">
              View all results

              <a href="#" style="margin-left: 4px;">
                here.
              </a>
            </div>
          </div>
        </div>

        <div class="col-3 justify-content-end">
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { debounce } from 'lodash';

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
      };
    },
    computed: {
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
      }
    },

    methods: {
      searchAnime: debounce(async function () {
        this.search_results = await fetchAnimeByWord(this.search_string);
        this.request_pending = false;
      }, 800),

      searchFocus() {
        this.input_focus = true;
      },

      searchNotFocus() {
        this.input_focus = false;
      }
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
  }

  .max-width {
    max-width: 2400px;
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

      &::placeholder {
        color: rgb(0, 0, 0);
        opacity: .3;
      }

      &:focus-visible {
        color: rgba(0, 0, 0, .8);
        background-color: #fff;
        box-shadow: 0 0 0 .1rem rgba(#575757, .2);
        outline: 0;
        outline: none;
      }
    }

    .result-container {
      top: 38px;
      position: absolute;
      flex-direction: column;
      justify-content: start;
      align-items: flex-start;
      min-width: 340px;
      max-width: 340px;
      padding: 2px 10px;
      background-color: white;
      border-radius: 0px 0px 10px 10px;

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
        margin-bottom: 4px;

        a {
          color: rgba(0, 0, 0, .8);
          font-style: italic;
        }
      }
    }
  }
</style>