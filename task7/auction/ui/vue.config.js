module.exports = {
  transpileDependencies: [
    'nervos-godwoken-integration',
  ],
  configureWebpack: {
    devServer: {
      headers: { 'Access-Control-Allow-Origin': '*' }
    }
  },  
  devServer: {
    port: 3000,
    compress: true,
   }  
}