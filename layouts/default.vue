<template>
  <div>
    <AniHeader class="header" />
    <Nuxt class="app-max-width" />
  </div>
</template>

<style scoped>
  .app-max-width {
    max-width: 2400px;
    padding: 0;
    left: 50%;
    transform: translateX(-50%);
    position: relative;
    padding-top: 40px;
  }

  .header { position: absolute; }
</style>
