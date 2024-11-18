const { createVuePlugin } = require('vite-plugin-vue2');
const CopyPlugin = require('vite-copy-plugin');

module.exports = {
  base: './',
  plugins: [
    createVuePlugin(), 
    CopyPlugin([
      // 目录复制
      { from: 'public', to: 'dist' },
      // // 文件复制到目录(空及取vite配置的build.outDir 默认 dist)
      // { from: 'src/static/style.css', to: '' },
      // // 文件复制文件
      // { from: 'src/static/style.css', to: 'dist/index.css' },
    ])
  ],
};
