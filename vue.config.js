module.exports = {
  configureWebpack: {
    devtool: 'souce-map'
  },
  //eslint是否启用
  lintOnSave: false,
  //指定生成的 index.html 的输出路径  (打包之后，改变系统默认的index.html的文件名)
  // indexPath: "myIndex.html",

  //开发环境下代理配置
  devServer: {
    //设置主机地址
    host: 'localhost',
    //设置端口(需要管理员的方式运行才能启动80端口)
    port: 81,
    //设置自动打开浏览器
    open: true,
    //设置代理
    proxy: {
      '/api': {
        //设置目标API地址
        target: 'http://10.0.0.237:9015',
        //是否启用websockets
        ws: false,
        //是否将主机标头的原点设为目标URL（识别了api是否截取掉）
        changeOrigin: false,
        pathRewrite: {
          '^/wuye': '' //这里理解成用'/api'代替target里面的地址,比如我要调用'http://40.00.100.100:3002/user/add'，直接写'/api/user/add'即可
        }

      }
    }
  },
  chainWebpack: config => {
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
        include: ["./src/icons"]
      });
  }
}