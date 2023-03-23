const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      "/": {
        ws: false,
        target: "https://tide-api.moreless.io",
        changeOrigin: true,
        headers: {
          host: "tide-api.moreless.io"
        },
      },
    },
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            hack: `true; @import "@/css/picker.less";`,
          },
        },
      },
    },
  },
})
