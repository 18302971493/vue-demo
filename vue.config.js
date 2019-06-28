module.exports = {

    devServer: {
        host: '127.0.0.1',
        port: 8080,
        proxy: {
            '/sparrow': {
                target: 'http://127.0.0.1:8020',  // 请求本地 需要xboot后台项目
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/sparrow': '/'
                }
            },
            '/foo': {
                target: '<other_url>'
            }
        }
    },
    // 打包时不生成.map文件 避免看到源码
    productionSourceMap: false
}
