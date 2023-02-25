<template>
  <div class="anime-container">
    <div ref="background" class="image-container mr-1" />

    <div class="text-truncate anime-title">
      <div>
        {{ resource.title }}
      </div>

      <div>
        {{ resource.score }}
      </div>

      <div class="extra-content">
        <div>
          Type: {{ resource.type }}
        </div>

        <div>
          {{ resource.duration }}

          <span v-if="resource.type === 'TV'">
            per EP
          </span>
        </div>
        
        <div>
          {{ getFormattedDate(resource.aired) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      resource: {
        required: true,
        type: Object,
      }
    },

    mounted() {
      const background = this.$refs.background;

      background.style.backgroundImage = `url(${this.resource.images.webp.large_image_url})`;
    },
    
    methods: {
      getFormattedDate(date) {
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
    },
  }
</script>

<style lang="scss" scoped>
  .anime-container {
    padding: .2vw 0px;
    display: flex;
    max-width: 320px;
    min-width: 100%;

    .image-container {
      min-width: 4.4vw;
      max-width: 4.4vw;
      height: 2.2vw;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
    }

    .anime-title {
      div:nth-child(1) {
        font-size: 0.8vw;
        color: rgba(0,0,0,.6);
      }

      div:nth-child(2) {
        font-size: 0.6vw;
        color: rgba(0,0,0,.4);
      }

      .extra-content { display: none; }
    }
  }

  .anime-container:hover {
    cursor: pointer;
    height: 6.8vw;
    padding: 4px;
    background: rgba(#ff91bc, .15);
    border-radius: 10px;
    display: flex;
    align-items: flex-start;

    .image-container {
      min-width: 4.4vw;
      max-width: 4.4vw;
      height: 6.2vw;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      border-radius: 8px;
    }

    .anime-title {
      div:nth-child(1) {
        font-size: 1vw;
        color: rgba(0,0,0,.65);
      }

      div:nth-child(2) {
        font-size: 0.8vw;
        color: rgba(0,0,0,.55);
      }

      .extra-content {
        display: block;

        div {
          font-size: 0.6vw;
          color: rgba(0,0,0,.45);
        }
      }
    }
  }
</style>
