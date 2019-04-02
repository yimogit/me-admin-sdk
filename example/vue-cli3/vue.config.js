module.exports = {
  baseUrl: './', // vueConf.baseUrl, // 根域上下文目录
  configureWebpack: {
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js'
      }
    }
  }
}
