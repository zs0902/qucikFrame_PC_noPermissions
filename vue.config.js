const path = require("path");
const TerserPlugin = require('terser-webpack-plugin')
const apiMock =  require("./src/mock")

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  outputDir: "supplyChainAdminWeb", // 打包过后的所以文件默认存入dist文件，这是另外命名
  assetsDir: "static", //  打包过后的js、css文件等存放的文件夹
  publicPath: "/", // 打包过后的 index.html 引入js的相对路径
  lintOnSave: false, //设置是否在开发环境下每次保存代码时都启用 eslint验证。
  indexPath: "index.html", // 决定html的输出目录，相对于，outputDir
  productionSourceMap: false,
  runtimeCompiler: true,
  devServer: {
    // 前端请求的链接
    host: process.env.VUE_APP_LOCAL_HOST, // can be overwritten by process.env.HOST
    port: process.env.VUE_APP_LOCAL_PORT, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    disableHostCheck: true,
    // 代理
    // proxy: {
    //   "/api/": {
    //     target: process.env.VUE_APP_LOCAL_HOST+':'+process.env.VUE_APP_LOCAL_PORT,
    //     changeOrigin: true,
    //     pathRewrite: {
    //       "^/api/": "/",
    //     },
    //   },
    // },

    before: apiMock
  },
  
  chainWebpack: (config) => {
    const alias = config.resolve.alias;
    alias
      .set("@", path.resolve("src"))
      .set("&", path.resolve("public"))
      .set("components", resolve("src/components"));
    // .set('vue$', 'vue/dist/vue.esm.js')

    // 去除生产环境打印信息
    config.optimization.minimizer('terser').use(TerserPlugin, [{
      terserOptions: {
        compress: { pure_funcs: ['console.log', 'console.warn'] },
      }
    }])
  },
  configureWebpack: config => {
    config.externals = {
      AMap: "AMap",
    }
  }
};
