module.exports = {
  // publicPath: '/tourist-site-project/dist/',
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "@/assets/scss/main.scss";`,
      }
    }
  },
  configureWebpack: {
    externals: {
      Vue: "vue"
    }
  }
}