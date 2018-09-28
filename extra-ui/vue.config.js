module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `
        @import "@/scss/variables.scss";
        `
      }
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: `http://0.0.0.0:${process.env.EXTRA_PORT}`
      },
      '/db': {
        target: `http://0.0.0.0:${process.env.EXTRA_PORT}`
      }
    }
  }
};