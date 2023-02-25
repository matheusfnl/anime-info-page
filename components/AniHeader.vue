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
          <input class="input-text" type="text" placeholder="Digite o nome" @input="searchAnime" />
        </div>

        <div class="col-3 justify-content-end">
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { fetchAnimeByWord } from '../axios/api'

  export default {
    data() {
      return {
        search_results: [],
      };
    },

    methods: {
      async searchAnime() {
        const { data } = await fetchAnimeByWord();

        this.search_results = data;
      }
    }
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
      color: rgba(0, 0, 0, .4)
    }

    .input-text::placeholder {
      color: rgb(0, 0, 0);
      opacity: .3;
    }

    .input-text:focus-visible {
      color: rgba(0, 0, 0, .8);
      background-color: #fff;
      box-shadow: 0 0 0 .1rem rgba(#575757, .2);
      outline: 0;
      outline: none;
    }
  }

</style>