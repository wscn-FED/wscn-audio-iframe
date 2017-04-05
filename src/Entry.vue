<template>
  <div id="app">
    <App/>
  </div>
</template>

<script>
  import App from './App.vue'
  export default {
    name: 'Entry',
    components: {
      App
    }
  }
</script>

<style src="normalize.css"></style>
<style lang="scss">
  html, body {
    margin: 0;
    padding: 0;
    background-color: #fff;
    height: 100%;
  }
  #app {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", Arial, sans-serif, "Microsoft YaHei";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-weight: 400;
    font-size: 14px;
    line-height: 1.4;
  }
</style>
